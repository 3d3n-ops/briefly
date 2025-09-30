import { list, head } from '@vercel/blob'

export interface BlobImage {
  url: string
  pathname: string
  size: number
  uploadedAt: Date
}

/**
 * Fetches all images from Vercel blob storage
 */
export async function getAllBlobImages(): Promise<BlobImage[]> {
  try {
    const { blobs } = await list()
    
    // Filter for image files only
    const imageBlobs = blobs.filter(blob => {
      const extension = blob.pathname.split('.').pop()?.toLowerCase()
      return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')
    })

    return imageBlobs.map(blob => ({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt
    }))
  } catch (error) {
    console.error('Error fetching blob images:', error)
    return []
  }
}

/**
 * Gets a random image from the blob storage
 */
export async function getRandomBlobImage(): Promise<string | null> {
  try {
    const images = await getAllBlobImages()
    if (images.length === 0) {
      return null
    }
    
    const randomIndex = Math.floor(Math.random() * images.length)
    return images[randomIndex].url
  } catch (error) {
    console.error('Error getting random blob image:', error)
    return null
  }
}

/**
 * Gets multiple images from blob storage with deterministic assignment
 * This ensures the same image is always assigned to the same blog post
 */
export async function getDeterministicBlobImages(count: number): Promise<string[]> {
  try {
    const images = await getAllBlobImages()
    console.log(`Found ${images.length} images in blob storage`)
    
    if (images.length === 0) {
      console.log('No images found in blob storage')
      return []
    }
    
    // Create a deterministic assignment by cycling through available images
    const selectedImages: string[] = []
    for (let i = 0; i < count; i++) {
      const imageIndex = i % images.length
      selectedImages.push(images[imageIndex].url)
    }
    
    console.log(`Assigned ${selectedImages.length} images (cycling through ${images.length} available images)`)
    return selectedImages
  } catch (error) {
    console.error('Error getting deterministic blob images:', error)
    return []
  }
}

/**
 * Gets a specific image for a blog post based on its ID
 * This ensures the same image is always shown for the same blog post
 */
export async function getImageForBlogPost(blogPostId: number): Promise<string | null> {
  try {
    const images = await getAllBlobImages()
    console.log(`Found ${images.length} images in blob storage`)
    
    if (images.length === 0) {
      console.log('No images found in blob storage')
      return null
    }
    
    // Use the blog post ID to deterministically select an image
    const imageIndex = (blogPostId - 1) % images.length
    const selectedImage = images[imageIndex].url
    console.log(`Assigned image ${imageIndex + 1} to blog post ${blogPostId}`)
    
    return selectedImage
  } catch (error) {
    console.error('Error getting image for blog post:', error)
    return null
  }
}

/**
 * Gets multiple random images from blob storage (legacy function)
 */
export async function getRandomBlobImages(count: number): Promise<string[]> {
  try {
    const images = await getAllBlobImages()
    
    if (images.length === 0) {
      return []
    }
    
    // Shuffle array and take the requested count
    const shuffled = [...images].sort(() => 0.5 - Math.random())
    const selectedImages = shuffled.slice(0, Math.min(count, images.length)).map(img => img.url)
    return selectedImages
  } catch (error) {
    console.error('Error getting random blob images:', error)
    return []
  }
}
