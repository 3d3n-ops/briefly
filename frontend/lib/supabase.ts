import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_DATABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_DATABASE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface BlogPost {
  id: number
  title: string
  summary: string
  url: string
  created_at: string
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!process.env.NEXT_PUBLIC_DATABASE_URL || !process.env.NEXT_PUBLIC_DATABASE_KEY) {
    console.error('Missing Supabase environment variables. Please check your .env.local file.')
    return []
  }

  const { data, error } = await supabase
    .from('article_summaries')
    .select('id, title, summary, url, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }

  return data || []
}
