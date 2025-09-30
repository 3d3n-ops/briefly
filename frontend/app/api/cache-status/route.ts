import { NextResponse } from 'next/server'
import { getCacheStatus } from '@/lib/blog-cache'

export async function GET() {
  try {
    const cacheStatus = getCacheStatus()
    return NextResponse.json(cacheStatus)
  } catch (error) {
    console.error('Error getting cache status:', error)
    return NextResponse.json(
      { error: 'Failed to get cache status' },
      { status: 500 }
    )
  }
}
