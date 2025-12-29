import { useState, useCallback } from 'react'

/**
 * Custom hook for smooth screen transitions
 * Handles fade-out/fade-in animations between screens
 */
export const useScreenTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false)

  const transition = useCallback((callback, delay = 300) => {
    setIsTransitioning(true)
    
    // Wait for fade-out animation
    setTimeout(() => {
      callback()
      // Small delay before fade-in
      setTimeout(() => {
        setIsTransitioning(false)
      }, 50)
    }, delay)
  }, [])

  return { isTransitioning, transition }
}