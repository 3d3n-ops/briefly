import { getBlogPosts } from '@/lib/supabase'
import { CacheStatus } from '@/components/CacheStatus'
import { BlogPostsGrid } from '@/components/BlogPostsGrid'

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
        <BlogPostsGrid posts={blogPosts} />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-6 py-8">
          <p className="text-right text-gray-500 text-sm">
            made for nerds like me :)
          </p>
        </div>
      </footer>

      {/* Cache Status (Development Only) */}
      <CacheStatus />
    </div>
  )
}
