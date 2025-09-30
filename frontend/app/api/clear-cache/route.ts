import { NextResponse } from 'next/server'
import { clearBlogPostCache } from '@/lib/blog-cache'

export async function POST() {
  try {
    clearBlogPostCache()
    return NextResponse.json({ success: true, message: 'Cache cleared successfully' })
  } catch (error) {
    console.error('Error clearing cache:', error)
    return NextResponse.json(
      { 
        error: 'Failed to clear cache',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
