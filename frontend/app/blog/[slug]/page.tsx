import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { supabase, BlogPost } from '@/lib/supabase'

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

  return data
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug)

  if (!post) {
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
          <div className="w-full h-96 bg-gray-700 rounded-lg mb-6"></div>
          <h1 className="text-3xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>
        </div>

        {/* Scrollable Content Section */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Mobile Title Section */}
          <div className="lg:hidden p-6 border-b border-gray-800">
            <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>
            <h1 className="text-2xl font-bold leading-tight">
              {post.title}
            </h1>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-300 leading-relaxed text-lg">
                {post.summary}
              </div>
            </div>
          </div>
          
          {/* Fixed Bottom Button */}
          <div className="border-t border-black p-4 flex justify-center">
            <Button 
              variant="outline" 
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Completed reading
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
