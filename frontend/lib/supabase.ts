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
  const { data, error } = await supabase
    .from('article_summaries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }

  return data || []
}
