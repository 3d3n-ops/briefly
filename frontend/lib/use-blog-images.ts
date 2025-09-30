'use client'

import { useState, useEffect } from 'react'
import { BlogPost } from './supabase'

export function useBlogImages(posts: BlogPost[]) {
  const [postsWithImages, setPostsWithImages] = useState<BlogPost[]>(posts)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { getImageForBlogPost } = await import('./vercel-blob')
        
        const updatedPosts = await Promise.all(
          posts.map(async (post) => {
            if (!post.image_url) {
              const imageUrl = await getImageForBlogPost(post.id)
              return { ...post, image_url: imageUrl || undefined }
            }
            return post
          })
        )
        
        setPostsWithImages(updatedPosts)
      } catch (error) {
        console.error('Error fetching images:', error)
        // Keep original posts if image fetching fails
        setPostsWithImages(posts)
      }
    }

    if (posts.length > 0) {
      fetchImages()
    }
  }, [posts])

  return postsWithImages
}
