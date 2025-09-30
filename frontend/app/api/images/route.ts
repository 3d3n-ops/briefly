import { NextResponse } from 'next/server'
import { getDeterministicBlobImages } from '@/lib/vercel-blob'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const count = parseInt(searchParams.get('count') || '1')
    
    const images = await getDeterministicBlobImages(count)
    
    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error fetching images:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch images',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
