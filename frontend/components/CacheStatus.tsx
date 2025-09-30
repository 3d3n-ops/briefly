'use client'

import { useState, useEffect } from 'react'

export function CacheStatus() {
  const [cacheInfo, setCacheInfo] = useState<{
    isCached: boolean
    expiresAt: number | null
    timeUntilExpiry: number | null
  }>({ isCached: false, expiresAt: null, timeUntilExpiry: null })

  const updateCacheInfo = async () => {
    try {
      const response = await fetch('/api/cache-status')
      const data = await response.json()
      setCacheInfo(data)
    } catch (error) {
      console.error('Error fetching cache status:', error)
    }
  }

  useEffect(() => {
    updateCacheInfo()
    // Update every minute to show countdown
    const interval = setInterval(updateCacheInfo, 60000)
    return () => clearInterval(interval)
  }, [])

  const formatTimeRemaining = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60))
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const handleClearCache = async () => {
    try {
      const response = await fetch('/api/clear-cache', { method: 'POST' })
      const data = await response.json()
      if (data.success) {
        updateCacheInfo()
        // Refresh the page to get new randomization
        window.location.reload()
      }
    } catch (error) {
      console.error('Error clearing cache:', error)
    }
  }

  if (process.env.NODE_ENV !== 'development') {
    return null // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-600 rounded-lg p-3 text-xs text-gray-300 max-w-xs">
      <div className="font-semibold mb-2">Blog Cache Status</div>
      
      {cacheInfo.isCached ? (
        <div>
          <div className="text-green-400 mb-1">✓ Cached (12h rotation)</div>
          {cacheInfo.timeUntilExpiry && (
            <div className="text-gray-400 mb-2">
              Expires in: {formatTimeRemaining(cacheInfo.timeUntilExpiry)}
            </div>
          )}
          <button
            onClick={handleClearCache}
            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
          >
            Clear Cache & Refresh
          </button>
        </div>
      ) : (
        <div>
          <div className="text-yellow-400 mb-1">⚠ No cache</div>
          <div className="text-gray-400 text-xs">
            New order will be generated
          </div>
        </div>
      )}
    </div>
  )
}
