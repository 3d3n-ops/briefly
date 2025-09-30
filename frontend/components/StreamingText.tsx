'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw, Gauge } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StreamingTextProps {
  text: string
  speed?: number // characters per second
  className?: string
  autoStart?: boolean
  onComplete?: () => void
}

export default function StreamingText({ 
  text, 
  speed = 30, 
  className = '', 
  autoStart = true,
  onComplete 
}: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isPlaying, setIsPlaying] = useState(autoStart)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [speedSetting, setSpeedSetting] = useState(speed)

  // Calculate realistic typing delays based on character type
  const getTypingDelay = useCallback((char: string, index: number): number => {
    const baseDelay = 1000 / speedSetting // Base delay in ms
    
    // Add variation based on character type
    if (char === ' ') {
      return baseDelay * 0.3 // Shorter delay for spaces
    } else if (char === '.' || char === '!' || char === '?') {
      return baseDelay * 2.5 // Longer pause for sentence endings
    } else if (char === ',' || char === ';' || char === ':') {
      return baseDelay * 1.5 // Medium pause for commas
    } else if (char === '\n') {
      return baseDelay * 3 // Longer pause for line breaks
    } else if (/[A-Z]/.test(char)) {
      return baseDelay * 1.2 // Slightly longer for capital letters
    } else {
      return baseDelay * (0.8 + Math.random() * 0.4) // Random variation for regular characters
    }
  }, [speedSetting])

  const startTyping = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    if (currentIndex >= text.length) {
      setIsComplete(true)
      onComplete?.()
      return
    }

    const nextChar = text[currentIndex]
    const delay = getTypingDelay(nextChar, currentIndex)

    intervalRef.current = setTimeout(() => {
      setDisplayedText(prev => prev + nextChar)
      setCurrentIndex(prev => {
        const newIndex = prev + 1
        if (newIndex >= text.length) {
          setIsComplete(true)
          onComplete?.()
        }
        return newIndex
      })
    }, delay)
  }, [text, currentIndex, getTypingDelay, onComplete])

  const pauseTyping = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsPlaying(false)
  }, [])

  const resumeTyping = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const resetTyping = useCallback(() => {
    pauseTyping()
    setDisplayedText('')
    setCurrentIndex(0)
    setIsComplete(false)
  }, [pauseTyping])

  const togglePlayPause = useCallback(() => {
    if (isComplete) {
      resetTyping()
      return
    }
    
    if (isPlaying) {
      pauseTyping()
    } else {
      resumeTyping()
    }
  }, [isPlaying, isComplete, pauseTyping, resumeTyping, resetTyping])

  // Handle speed changes
  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeedSetting(newSpeed)
    if (isPlaying && !isComplete) {
      pauseTyping()
      resumeTyping()
    }
  }, [isPlaying, isComplete, pauseTyping, resumeTyping])

  // Auto-start effect
  useEffect(() => {
    if (autoStart && !isComplete && currentIndex < text.length) {
      startTyping()
    }
  }, [autoStart, isComplete, currentIndex, text.length, startTyping])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Progress calculation
  const progress = text.length > 0 ? (currentIndex / text.length) * 100 : 0

  return (
    <div className={`streaming-text-container ${className}`}>
      {/* Controls */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
        <div className="flex items-center space-x-2">
          <Button
            onClick={togglePlayPause}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            {isComplete ? (
              <RotateCcw className="h-4 w-4" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          <span className="text-sm text-gray-400">
            {isComplete ? 'Complete' : `${Math.round(progress)}%`}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Gauge className="h-4 w-4 text-gray-400" />
            <select
              value={speedSetting}
              onChange={(e) => handleSpeedChange(Number(e.target.value))}
              className="bg-gray-800 border border-gray-600 text-gray-300 text-sm rounded px-2 py-1"
              disabled={isComplete}
            >
              <option value={15}>Slow</option>
              <option value={30}>Normal</option>
              <option value={50}>Fast</option>
              <option value={80}>Very Fast</option>
            </select>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-1 mb-4">
        <div 
          className="bg-blue-500 h-1 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Streaming text content */}
      <div className="prose prose-invert max-w-none">
        <div className="whitespace-pre-wrap text-gray-300 leading-relaxed text-lg">
          {displayedText}
          {!isComplete && (
            <span className="animate-pulse text-blue-400">|</span>
          )}
        </div>
      </div>

      {/* Completion message */}
      {isComplete && (
        <div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded-lg">
          <p className="text-green-400 text-sm text-center">
            ✨ Reading complete! You can scroll to review or restart.
          </p>
        </div>
      )}
    </div>
  )
}
