import { useState, useEffect } from 'react'

/**
 * Hook to track mouse position relative to an element
 */
export const useMousePosition = (ref) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (e) => {
      if (!ref.current) return
      
      const rect = ref.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      
      setMousePosition({ x, y })
    }

    const element = ref.current
    if (element) {
      element.addEventListener('mousemove', updateMousePosition)
      element.addEventListener('mouseleave', () => setMousePosition({ x: 0, y: 0 }))
    }

    return () => {
      if (element) {
        element.removeEventListener('mousemove', updateMousePosition)
        element.removeEventListener('mouseleave', () => setMousePosition({ x: 0, y: 0 }))
      }
    }
  }, [ref])

  return mousePosition
}