import logging
from dotenv import load_dotenv
import os
import time
from urllib.parse import urljoin, urlparse
from sqlalchemy import create_engine, text as sa_text
import requests
from bs4 import BeautifulSoup
from newspaper import Article
from openai import OpenAI
import feedparser
from typing import List, Tuple, Optional

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s: %(message)s")

load_dotenv()

# Read API key from environment for safety
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    logging.warning("Environment variable OPENAI_API_KEY not set. OpenAI API calls will be skipped.")

# Construct the OpenAI client if API key is present
client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

# Database URL
DB_URL = os.environ.get("DATABASE_URL")
engine = create_engine(DB_URL, pool_pre_ping=True) if DB_URL else None

def _mask_db_url(url: Optional[str]) -> str:
    if not url:
        return "<none>"
    try:
        parsed = urlparse(url)
        user = parsed.username or ""
        host = parsed.hostname or parsed.netloc or ""
        port = f":{parsed.port}" if parsed.port else ""
        db = parsed.path.lstrip('/') if parsed.path else ""
        if user:
            return f"{parsed.scheme}://{user}:***@{host}{port}/{db}"
        return f"{parsed.scheme}://{host}{port}/{db}"
    except Exception:
        return '***'

try:
    # Prefer external configuration of tech blog URLs
    from config import TECH_BLOG_URLS  # type: ignore
    blogs = TECH_BLOG_URLS
except Exception as e:
    logging.warning("Could not import TECH_BLOG_URLS from config.py: %s. Falling back to built-in list.", e)

def get_articles(blog_url, limit=5):
    feed_url = find_feed(blog_url)
    if feed_url:
        try:
            logging.info("Found feed for %s: %s", blog_url, feed_url)
            parsed = feedparser.parse(feed_url)
            entries = parsed.entries or []
            if entries:
                links = [urljoin(feed_url, entry.get("link") or entry.get("id")) for entry in entries[:limit] if entry.get("link") or entry.get("id")]
                return links
        except Exception as e:
            logging.warning("Failed to parse feed %s: %s", feed_url, e)

    # Fallback: scrape homepage for links
    headers = {"User-Agent": "agora-bot/1.0 (+https://example.com)"}
    try:
        resp = requests.get(blog_url, timeout=10, headers=headers)
        resp.raise_for_status()
    except Exception as e:
        logging.error("Failed to fetch %s: %s", blog_url, e)
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    links = []
    base = resp.url or blog_url
    allowed_netloc = urlparse(blog_url).netloc
    allowed_path_prefix = urlparse(blog_url).path.rstrip('/')
    for a in soup.find_all("a", href=True):
        href = urljoin(base, a["href"].strip())
        parsed = urlparse(href)
        if parsed.scheme not in ("http", "https"):
            continue
        path = parsed.path.lower()
        keywords = ("blog", "article", "news", "post")
        has_keyword = any(k in path for k in keywords)
        same_host = parsed.netloc == allowed_netloc

        accept = False
        if same_host and allowed_path_prefix:
            if path.startswith(allowed_path_prefix):
                accept = True
        if has_keyword:
            accept = True
        if same_host and not allowed_path_prefix:
            accept = True

        if accept and path not in ("", "/"):
            links.append(href)

    seen = set()
    deduped = []
    for l in links:
        if l in seen:
            continue
        seen.add(l)
        deduped.append(l)
    return deduped[:limit]

def find_feed(url: str) -> Optional[str]:
    headers = {"User-Agent": "agora-bot/1.0 (+https://example.com)"}
    try:
        resp = requests.get(url, timeout=10, headers=headers)
        resp.raise_for_status()
    except Exception:
        return None

    if url.lower().endswith(('.xml', '.rss')) or 'feed' in url.lower():
        return url

    soup = BeautifulSoup(resp.text, "html.parser")
    link = soup.find('link', type=lambda v: v and 'rss' in v)
    if link and link.get('href'):
        return urljoin(url, link.get('href'))
    link = soup.find('link', rel=lambda v: v and 'alternate' in v)
    if link and link.get('type') and ('rss' in link.get('type') or 'xml' in link.get('type')) and link.get('href'):
        return urljoin(url, link.get('href'))

    for suffix in ['/feed', '/rss', '/atom.xml', '/index.xml']:
        candidate = url.rstrip('/') + suffix
        try:
            r2 = requests.get(candidate, timeout=5, headers=headers)
            if r2.status_code == 200 and ('xml' in r2.headers.get('Content-Type', '') or r2.text.strip().startswith('<')):
                return candidate
        except Exception:
            continue
    return None

def extract_text(url):
    try:
        art = Article(url)
        art.download()
        art.parse()
        title = art.title or url
        article_text = art.text or ""
        if article_text.strip():
            return title, article_text
    except Exception:
        logging.debug("newspaper3k failed for %s, falling back to BeautifulSoup", url)

    try:
        headers = {"User-Agent": "agora-bot/1.0 (+https://example.com)"}
        resp = requests.get(url, timeout=10, headers=headers)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        article_tag = soup.find("article")
        if article_tag:
            article_text = article_tag.get_text(separator="\n").strip()
        else:
            paragraphs = [p.get_text() for p in soup.find_all("p")]
            article_text = "\n\n".join(paragraphs).strip()
        title_tag = soup.find("title")
        title = title_tag.get_text().strip() if title_tag else url
        if len(article_text) < 300:
            rendered = render_with_playwright(url)
            if rendered:
                soup2 = BeautifulSoup(rendered, "html.parser")
                article_tag = soup2.find("article")
                if article_tag:
                    article_text2 = article_tag.get_text(separator="\n").strip()
                else:
                    paragraphs = [p.get_text() for p in soup2.find_all("p")]
                    article_text2 = "\n\n".join(paragraphs).strip()
                title_tag = soup2.find("title")
                title = title_tag.get_text().strip() if title_tag else title
                if len(article_text2) > len(article_text):
                    article_text = article_text2
        return title, article_text
    except Exception as e:
        logging.error("Failed to extract text from %s: %s", url, e)
        return None, None

def render_with_playwright(url: str) -> Optional[str]:
    try:
        from playwright.sync_api import sync_playwright
    except Exception:
        logging.debug("Playwright not installed; skipping JS rendering for %s", url)
        return None

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(user_agent="agora-bot/1.0 (+https://example.com)")
            page.goto(url, timeout=20000)
            try:
                page.wait_for_load_state('networkidle', timeout=10000)
            except Exception:
                pass
            html = page.content()
            browser.close()
            return html
    except Exception as e:
        logging.debug("Playwright rendering failed for %s: %s", url, e)
        return None


def summarize_article(title, article_text, url):
    clean_text = (article_text or "").replace("\n", " ")[:4000]
    prompt = (
        f"You are an assistant that summarizes technical blog posts.\n"
        f"Summarize the article titled:\n{title}\n\n"
        f"Write a concise, detail-oriented summary in 2-4 short paragraphs (1-4 sentences each).\n"
        f"DO NOT START WITH 'The article' OR 'This article'. Begin the summary with a direct opening mimicking the writing style of the actual blog.\n"
        f"Use a clear, engaging and educational tone for senior-level readers and beginners.\n"
        f"After the summary, include the article URL on its own line.\n\nArticle excerpt:\n{clean_text}"
    )

    if client is None:
        logging.info("OpenAI client not configured; using fallback summary for %s", url)
        paragraphs = [p.strip() for p in (article_text or "").split("\n\n") if p.strip()]
        summary_paras = paragraphs[:3] if paragraphs else [title]
        result = "\n\n".join(summary_paras)
        return f"{result}\n\n{url}"

    try:
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=800,
        )
        content = getattr(resp.choices[0].message, "content", None) or getattr(resp.choices[0], "text", None)
        if content:
            out = content.strip()
            if url not in out:
                out = f"{out}\n\n{url}"
            return out
    except Exception as e:
        logging.error("OpenAI API error summarizing %s: %s", url, e)

    paragraphs = [p.strip() for p in (article_text or "").split("\n\n") if p.strip()]
    summary_paras = paragraphs[:3] if paragraphs else [title]
    result = "\n\n".join(summary_paras)
    return f"{result}\n\n{url}"


# def save_article_locally(title: str, article_text: str, url: str):
#     filename = "articles.txt"
#     try:
#         with open(filename, "a", encoding="utf-8") as f:
#             f.write(f"Title: {title}\nURL: {url}\nArticle:\n{article_text}\n{'-'*80}\n")
#     except Exception as e:
#         logging.error("Failed to save article locally for %s: %s", url, e)

def save_summary(title: str, summary: str, url: str):
    if not engine:
        logging.warning("DATABASE_URL not set; skipping saving summary for %s", url)
        return
    try:
        logging.info("Attempting to save summary for %s to DB %s", url, _mask_db_url(DB_URL))
        insert_stmt = sa_text("""
            INSERT INTO article_summaries (title, summary, url, created_at)
            VALUES (:title, :summary, :url, NOW())
            ON CONFLICT (url) DO UPDATE SET
                title = EXCLUDED.title,
                summary = EXCLUDED.summary,
                created_at = NOW();
        """)
        with engine.begin() as conn:
            result = conn.execute(insert_stmt, {"title": title, "summary": summary, "url": url})
        logging.info("Saved summary for %s", url)
    except Exception as e:
        logging.error("Failed to save summary for %s: %s", url, e)

if __name__ == "__main__":
    for blog in blogs:
        logging.info("Scanning blog: %s", blog)
        for url in get_articles(blog):
            title, article_text = extract_text(url)
            if not article_text:
                continue
            print(f"\n📰 {title} ({url})")
            summary_post = summarize_article(title, article_text, url)
            print(f"{summary_post}")

            save_summary(title, summary_post, url)
            time.sleep(0.5)
