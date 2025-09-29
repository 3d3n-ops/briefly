# Supabase Setup Instructions

To connect your frontend to Supabase, you need to create a `.env.local` file in the frontend directory with the following environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## How to get these values:

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the "Project URL" and "anon public" key
4. Create a `.env.local` file in the frontend directory
5. Add the environment variables with your actual values

## Database Setup

Make sure your Supabase database has the `article_summaries` table with the following structure:

```sql
CREATE TABLE IF NOT EXISTS article_summaries (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Running the Backend

To populate the database with blog summaries, run the backend scraper:

```bash
cd backend
pip install -r requirements.txt
python main.py
```

This will scrape the configured tech blogs and save AI-generated summaries to your Supabase database.
