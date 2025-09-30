'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BlogPost } from '@/lib/supabase'
import { useBlogImages } from '@/lib/use-blog-images'

interface BlogPostsGridProps {
  posts: BlogPost[]
}

export function BlogPostsGrid({ posts }: BlogPostsGridProps) {
  const postsWithImages = useBlogImages(posts)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {postsWithImages.length > 0 ? (
        postsWithImages.map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`}>
            <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer group">
              <CardHeader className="p-0">
                <div className="w-full h-48 bg-gray-700 rounded-t-lg mb-4 group-hover:bg-gray-600 transition-colors overflow-hidden relative">
                  {post.image_url ? (
                    <Image 
                      src={post.image_url} 
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500">Loading image...</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-3 group-hover:text-gray-300 transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-gray-400 leading-relaxed">
                  {post.summary.length > 150 
                    ? `${post.summary.substring(0, 150)}...` 
                    : post.summary
                  }
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-400 text-lg">No blog posts available yet. Check back soon!</p>
        </div>
      )}
    </div>
  )
}
