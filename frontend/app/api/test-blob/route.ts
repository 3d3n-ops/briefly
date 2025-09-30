import { NextResponse } from 'next/server'
import { getAllBlobImages } from '@/lib/vercel-blob'

export async function GET() {
  try {
    console.log('Testing Vercel blob connection...')
    const images = await getAllBlobImages()
    
    return NextResponse.json({ 
      success: true,
      imageCount: images.length,
      images: images.map(img => ({
        url: img.url,
        pathname: img.pathname,
        size: img.size
      }))
    })
  } catch (error) {
    console.error('Blob test error:', error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      hasToken: !!process.env.BLOB_READ_WRITE_TOKEN
    }, { status: 500 })
  }
}
