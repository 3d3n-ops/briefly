import { BlogPost } from './supabase'

interface CachedBlogPosts {
  posts: BlogPost[]
  generatedAt: number
  expiresAt: number
}

const CACHE_DURATION = 12 * 60 * 60 * 1000 // 12 hours in milliseconds

// Server-side in-memory cache
let serverCache: CachedBlogPosts | null = null

/**
 * Generates a deterministic seed based on the current 12-hour period
 * This ensures the same randomization for 12 hours, then changes
 */
function getTimeBasedSeed(): number {
  const now = new Date()
  const hoursSinceEpoch = Math.floor(now.getTime() / (12 * 60 * 60 * 1000))
  return hoursSinceEpoch
}

/**
 * Shuffles an array using a seeded random number generator
 * This ensures the same seed produces the same shuffle
 */
function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array]
  let currentIndex = shuffled.length
  let randomIndex: number

  // Simple seeded random number generator
  let seedValue = seed
  const seededRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280
    return seedValue / 233280
  }

  while (currentIndex !== 0) {
    randomIndex = Math.floor(seededRandom() * currentIndex)
    currentIndex--
    ;[shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex]
    ]
  }

  return shuffled
}

/**
 * Gets cached blog posts or generates new ones if cache is expired (Server-side)
 */
export async function getCachedBlogPosts(originalPosts: BlogPost[]): Promise<BlogPost[]> {
  try {
    const now = Date.now()
    
    // Check if we have a valid server-side cache
    if (serverCache && now < serverCache.expiresAt) {
      const hoursRemaining = Math.round((serverCache.expiresAt - now) / (1000 * 60 * 60))
      console.log(`Using server-side cached blog posts (expires in ${hoursRemaining} hours)`)
      return serverCache.posts
    }

    // Generate new randomized order
    const seed = getTimeBasedSeed()
    const randomizedPosts = seededShuffle(originalPosts, seed)
    
    // Update server-side cache
    serverCache = {
      posts: randomizedPosts,
      generatedAt: now,
      expiresAt: now + CACHE_DURATION
    }
    
    console.log('Generated new randomized blog post order (valid for 12 hours)')
    return randomizedPosts
  } catch (error) {
    console.error('Error with blog post caching:', error)
    // Fallback to simple randomization if caching fails
    return [...originalPosts].sort(() => Math.random() - 0.5)
  }
}

/**
 * Clears the blog post cache (useful for testing or manual refresh)
 */
export function clearBlogPostCache(): void {
  serverCache = null
  console.log('Server-side blog post cache cleared')
}

/**
 * Gets cache status information (Server-side)
 */
export function getCacheStatus(): { isCached: boolean; expiresAt: number | null; timeUntilExpiry: number | null } {
  try {
    if (!serverCache) {
      return { isCached: false, expiresAt: null, timeUntilExpiry: null }
    }

    const now = Date.now()
    const timeUntilExpiry = serverCache.expiresAt - now

    return {
      isCached: timeUntilExpiry > 0,
      expiresAt: serverCache.expiresAt,
      timeUntilExpiry: timeUntilExpiry > 0 ? timeUntilExpiry : 0
    }
  } catch (error) {
    console.error('Error getting cache status:', error)
    return { isCached: false, expiresAt: null, timeUntilExpiry: null }
  }
}
