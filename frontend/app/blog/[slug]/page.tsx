'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { supabase, BlogPost } from '@/lib/supabase'
import StreamingText from '@/components/StreamingText'
import { useEffect, useState } from 'react'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

async function getBlogPost(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('article_summaries')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching blog post:', error)
    return null
  }

  // Fetch the same deterministic image for this blog post
  if (data) {
    try {
      const { getImageForBlogPost } = await import('@/lib/vercel-blob')
      const imageUrl = await getImageForBlogPost(data.id)
      if (imageUrl) {
        (data as BlogPost).image_url = imageUrl
      }
    } catch (error) {
      console.error('Error fetching deterministic image:', error)
    }
  }

  return data as BlogPost
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getBlogPost(params.slug)
        if (!postData) {
          setError(true)
        } else {
          setPost(postData)
        }
      } catch (err) {
        console.error('Error fetching blog post:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.slug])

  const handleReadingComplete = () => {
    // You can add analytics or other completion logic here
    console.log('Reading completed for:', post?.title)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-300">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Briefly</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex h-[calc(100vh-80px)]">
        {/* Fixed Image and Title Section */}
        <div className="w-1/2 border-r border-black p-8 flex flex-col hidden lg:flex">
          <div className="w-full h-96 bg-gray-700 rounded-lg mb-6 overflow-hidden">
            {post.image_url ? (
              <img 
                src={post.image_url} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>
        </div>

        {/* Scrollable Content Section */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Mobile Title Section */}
          <div className="lg:hidden p-6 border-b border-gray-800">
            <div className="w-full h-48 bg-gray-700 rounded-lg mb-4 overflow-hidden">
              {post.image_url ? (
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold leading-tight">
              {post.title}
            </h1>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">
            <StreamingText 
              text={post.summary}
              speed={35}
              autoStart={true}
              className="min-h-full"
              onComplete={handleReadingComplete}
            />
          </div>
          
          {/* Fixed Bottom Button */}
          <div className="border-t border-gray-800 p-4 flex justify-center">
            <Button 
              variant="outline" 
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300"
            >
              <span className="flex items-center space-x-2">
                <span>Completed reading</span>
                <span className="text-xs opacity-70">(scroll to review)</span>
              </span>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-6 py-8">
          <p className="text-right text-gray-500 text-sm">
            made for nerds like me :)
          </p>
        </div>
      </footer>
    </div>
  )
}
