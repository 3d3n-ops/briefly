import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_DATABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_DATABASE_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface BlogPost {
  id: number
  title: string
  summary: string
  url: string
  image_url?: string
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

  // Return posts without images during build time to avoid rate limiting
  // Images will be fetched on the client side
  const posts: BlogPost[] = data || []

  // Use cached randomization (changes every 12 hours)
  try {
    const { getCachedBlogPosts } = await import('./blog-cache')
    const shuffledPosts = await getCachedBlogPosts(posts)
    return shuffledPosts
  } catch (error) {
    console.error('Error with cached randomization, falling back to simple shuffle:', error)
    // Fallback to simple randomization if caching fails
    const shuffledPosts = [...posts].sort(() => Math.random() - 0.5)
    return shuffledPosts
  }
}
