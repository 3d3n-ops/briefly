# Agora

A tech blog aggregator that scrapes articles from popular tech blogs, generates AI-powered summaries, and displays them in a clean web interface.

## What it does

- **Backend**: Scrapes tech blogs, extracts article content, and generates summaries using OpenAI
- **Frontend**: Displays article summaries in a modern Next.js interface with Supabase integration

## Quick Start

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

Set environment variables:
```bash
# .env file
OPENAI_API_KEY=your_openai_key
DATABASE_URL=your_supabase_database_url
```

Run the scraper:
```bash
python main.py
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

Set environment variables:
```bash
# .env.local file
NEXT_PUBLIC_DATABASE_URL=your_supabase_url
NEXT_PUBLIC_DATABASE_KEY=your_supabase_anon_key
```

Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
agora/
├── backend/           # Python scraper & AI summarization
│   ├── main.py       # Main scraper script
│   ├── config.py     # Blog URLs configuration
│   └── requirements.txt
└── frontend/         # Next.js web app
    ├── app/          # App router pages
    ├── components/   # React components
    └── lib/          # Supabase client & utilities
```

## Features

- Scrapes articles from configurable tech blogs
- AI-powered article summarization
- Modern React/Next.js frontend
- Supabase database integration
- Responsive design with Tailwind CSS

## Database

The app uses a Supabase PostgreSQL database with an `article_summaries` table containing:
- `id` - Primary key
- `title` - Article title
- `summary` - AI-generated summary
- `url` - Original article URL
- `created_at` - Timestamp

## Tech Stack

**Backend**: Python, OpenAI API, BeautifulSoup, Playwright, SQLAlchemy
**Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Supabase
