import { NextResponse } from 'next/server'
import { getCacheStatus } from '@/lib/blog-cache'

export async function GET() {
  try {
    const cacheStatus = getCacheStatus()
    return NextResponse.json(cacheStatus)
  } catch (error) {
    console.error('Error getting cache status:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get cache status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
