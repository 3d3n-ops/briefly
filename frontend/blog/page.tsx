import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { getBlogPosts, type BlogPost } from '@/lib/supabase'

export default async function BlogPost() {
  const blogPosts = await getBlogPosts()
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-mono">Briefly</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">All Articles</h1>
          
          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors cursor-pointer group">
                    <div className="w-full h-48 bg-gray-700 rounded-lg mb-4 group-hover:bg-gray-600 transition-colors"></div>
                    <h2 className="text-xl font-bold mb-3 group-hover:text-gray-300 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed">
                      {post.summary.length > 150 
                        ? `${post.summary.substring(0, 150)}...` 
                        : post.summary
                      }
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">No blog posts available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-6 py-8">
          <p className="text-right text-gray-500 font-mono text-sm">
            made for nerds like me :)
          </p>
        </div>
      </footer>
    </div>
  )
}
