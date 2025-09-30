import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getBlogPosts, BlogPost } from '@/lib/supabase'

export default async function Home() {
  const blogPosts = await getBlogPosts()
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Briefly</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            Learn from the best in the industry
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Follow the technical blogs of various companies and stay informed on engineering practices at scale.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.length > 0 ? (
            blogPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer group">
                  <CardHeader className="p-0">
                    <div className="w-full h-48 bg-gray-700 rounded-t-lg mb-4 group-hover:bg-gray-600 transition-colors overflow-hidden">
                      {post.image_url ? (
                        <img 
                          src={post.image_url} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-500">No image</span>
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
