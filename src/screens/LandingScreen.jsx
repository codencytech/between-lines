import { useState, useEffect, useRef } from 'react'
import '../styles/LandingScreen.css'

const LandingScreen = ({ onBegin }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isBeginning, setIsBeginning] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    // Initial load animation
    const timer = setTimeout(() => setIsLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const handleMouseMove = (e) => {
    if (!containerRef.current || isBeginning) return
    
    const { clientX, clientY } = e
    const { width, height } = containerRef.current.getBoundingClientRect()
    
    // Calculate normalized position (-0.5 to 0.5)
    const x = (clientX / width - 0.5) * 2
    const y = (clientY / height - 0.5) * 2
    
    setMousePosition({ x, y })
  }

  const handleBegin = () => {
    if (isBeginning) return
    
    setIsBeginning(true)
    
    // Create unique page transition effect
    const container = containerRef.current
    if (container) {
      container.style.opacity = '0'
      container.style.transform = 'scale(0.98)'
      container.style.filter = 'blur(10px)'
    }
    
    // Create ripple effect
    const ripple = document.createElement('div')
    ripple.className = 'page-transition-ripple'
    document.body.appendChild(ripple)
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple)
      }
      onBegin()
    }, 800)
  }

  // Calculate parallax transforms
  const textTransform = `translate3d(${mousePosition.x * -8}px, ${mousePosition.y * -8}px, 0)`
  const backgroundTransform = `translate3d(${mousePosition.x * 15}px, ${mousePosition.y * 15}px, 0)`
  const particlesTransform = `translate3d(${mousePosition.x * 25}px, ${mousePosition.y * 25}px, 0)`

  return (
    <div 
      ref={containerRef}
      className={`landing-screen ${isLoaded ? 'loaded' : ''} ${isBeginning ? 'transitioning' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => !isBeginning && setMousePosition({ x: 0, y: 0 })}
    >
      {/* Luxury Background Layers */}
      <div className="background-base">
        <div className="grain-overlay" />
        <div className="gradient-mesh" />
      </div>
      
      {/* Animated Background Elements */}
      <div 
        className="parallax-layer floating-shapes"
        style={{ transform: backgroundTransform }}
      >
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
        <div className="shape shape-4" />
      </div>
      
      {/* Subtle Particles */}
      <div 
        className="parallax-layer particles-layer"
        style={{ transform: particlesTransform }}
      />
      
      {/* Main Content */}
      <div className="landing-content">
        <div 
          className="text-container"
          style={{ transform: textTransform }}
        >
          <div className="title-line">
            <span className="word">Some</span>
            <span className="word">thoughts</span>
            <span className="word">are</span>
            <span className="word">loud.</span>
          </div>
          
          <div className="title-line second-line">
            <span className="word">Some</span>
            <span className="word">meanings</span>
            <span className="word">live</span>
            <span className="word">between</span>
            <span className="word accent-word">the lines.</span>
          </div>
          
          <p className="subtitle">
            A calm space where AI listens to what's unspoken
            <br />
            and brings comfort through voices you miss.
          </p>
        </div>
        
        <div className="button-container">
          <button 
            className="begin-button"
            onClick={handleBegin}
            disabled={isBeginning}
            onMouseEnter={(e) => {
              if (!isBeginning) {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isBeginning) {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
              }
            }}
          >
            <span className="button-glow" />
            <span className="button-text">Begin</span>
            <span className="button-arrow">↘</span>
            <span className="button-ripple" />
          </button>
          
          <div className="instruction">
            Move gently through the space
          </div>
        </div>
      </div>
      
      {/* Subtle Grid Overlay */}
      <div className="grid-overlay" />
      
      {/* Corner Accents - More Refined */}
      <div className="corner-decoration top-left">
        <div className="corner-line horizontal" />
        <div className="corner-line vertical" />
        <div className="corner-dot" />
      </div>
      
      <div className="corner-decoration top-right">
        <div className="corner-line horizontal" />
        <div className="corner-line vertical" />
        <div className="corner-dot" />
      </div>
      
      <div className="corner-decoration bottom-left">
        <div className="corner-line horizontal" />
        <div className="corner-line vertical" />
        <div className="corner-dot" />
      </div>
      
      <div className="corner-decoration bottom-right">
        <div className="corner-line horizontal" />
        <div className="corner-line vertical" />
        <div className="corner-dot" />
      </div>
    </div>
  )
}

export default LandingScreen