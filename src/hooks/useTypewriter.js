import { useState, useEffect, useCallback } from 'react'

/**
 * Hook for typewriter effect
 */
export const useTypewriter = (text, speed = 30, onComplete) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const reset = useCallback(() => {
    setDisplayText('')
    setCurrentIndex(0)
    setIsComplete(false)
  }, [])

  useEffect(() => {
    if (!text || currentIndex >= text.length) {
      if (!isComplete && onComplete) {
        setIsComplete(true)
        onComplete()
      }
      return
    }

    const timeout = setTimeout(() => {
      setDisplayText(prev => prev + text[currentIndex])
      setCurrentIndex(prev => prev + 1)
    }, speed)

    return () => clearTimeout(timeout)
  }, [currentIndex, text, speed, isComplete, onComplete])

  return { displayText, isComplete, reset }
}