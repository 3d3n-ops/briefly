import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_DATABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_DATABASE_KEY!

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

  // Fetch deterministic images for the blog posts using direct blob API
  const posts: BlogPost[] = data || []
  console.log(`Processing ${posts.length} blog posts`)
  
  if (posts.length > 0) {
    try {
      const { getImageForBlogPost } = await import('./vercel-blob')
      
      // Assign deterministic images to each post based on their ID
      for (const post of posts) {
        const imageUrl = await getImageForBlogPost(post.id)
        if (imageUrl) {
          post.image_url = imageUrl
          console.log(`Assigned image to post ${post.id}: ${post.title}`)
        } else {
          console.log(`No image available for post ${post.id}: ${post.title}`)
        }
      }
    } catch (error) {
      console.error('Error fetching deterministic images:', error)
    }
  }

  // Randomize the order of blog posts
  const shuffledPosts = [...posts].sort(() => Math.random() - 0.5)
  console.log(`Randomized order of ${shuffledPosts.length} blog posts`)

  return shuffledPosts
}
