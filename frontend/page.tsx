import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Mock data for blog posts
const blogPosts = [
  {
    id: 1,
    title: "Building Scalable Microservices",
    description: "Learn how to design and implement microservices that can handle millions of requests per day.",
    slug: "building-scalable-microservices"
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    description: "Explore modern React patterns and best practices for building maintainable applications.",
    slug: "advanced-react-patterns"
  },
  {
    id: 3,
    title: "Database Optimization Techniques",
    description: "Master the art of database performance tuning and query optimization strategies.",
    slug: "database-optimization-techniques"
  },
  {
    id: 4,
    title: "DevOps at Scale",
    description: "Implement CI/CD pipelines and infrastructure as code for large-scale applications.",
    slug: "devops-at-scale"
  },
  {
    id: 5,
    title: "Machine Learning in Production",
    description: "Deploy and monitor machine learning models in production environments.",
    slug: "machine-learning-in-production"
  },
  {
    id: 6,
    title: "Security Best Practices",
    description: "Implement comprehensive security measures to protect your applications and data.",
    slug: "security-best-practices"
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold font-mono">Briefly</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 font-mono">
            Learn from the best in the industry
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-mono">
            Follow the technical blogs of various companies and stay informed on engineering practices at scale.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer group">
                <CardHeader className="p-0">
                  <div className="w-full h-48 bg-gray-700 rounded-t-lg mb-4 group-hover:bg-gray-600 transition-colors"></div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl mb-3 font-mono group-hover:text-gray-300 transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-mono leading-relaxed">
                    {post.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
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
