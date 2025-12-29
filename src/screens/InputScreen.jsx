import { useState, useEffect, useRef } from 'react'
import '../styles/InputScreen.css'

const InputScreen = ({ onSubmit }) => {
  const [inputText, setInputText] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [typingIntensity, setTypingIntensity] = useState(0)
  const [focused, setFocused] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastTypedTime, setLastTypedTime] = useState(Date.now())
  const textareaRef = useRef(null)
  const containerRef = useRef(null)
  const waveRef = useRef(null)

  const placeholders = [
    "What's been echoing in your mind?",
    "Let the unsaid words surface",
    "No editing, just expression",
    "Your feelings are welcome here"
  ]

  useEffect(() => {
    // Auto-focus textarea with gentle animation
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 500)

    // Rotate placeholders
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
    }, 3500)

    // Subtle breathing animation for container
    const breathingInterval = setInterval(() => {
      if (containerRef.current && inputText.length === 0 && !focused) {
        containerRef.current.style.setProperty('--breath-phase', Math.random())
      }
    }, 4000)

    return () => {
      clearInterval(interval)
      clearInterval(breathingInterval)
    }
  }, [])

  useEffect(() => {
    // Calculate typing intensity based on text length and typing speed
    const now = Date.now()
    const timeDiff = now - lastTypedTime
    const speedFactor = timeDiff < 200 ? 1.5 : timeDiff < 500 ? 1 : 0.5
    
    const intensity = Math.min((inputText.length / 15) * speedFactor, 1)
    setTypingIntensity(intensity)
    
    // Enable submit if there's meaningful content
    setCanSubmit(inputText.trim().length > 25)
    
    if (inputText.length > 0) {
      setLastTypedTime(now)
      
      // Create typing wave effect
      if (waveRef.current) {
        waveRef.current.style.opacity = '0.6'
        setTimeout(() => {
          if (waveRef.current) {
            waveRef.current.style.opacity = '0'
          }
        }, 300)
      }
    }
  }, [inputText])

  const handleTextChange = (e) => {
    const text = e.target.value
    setInputText(text)
  }

  const handleKeyDown = (e) => {
    // Submit on Cmd/Ctrl + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && canSubmit && !isSubmitting) {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (!canSubmit || isSubmitting) return
    
    setIsSubmitting(true)
    
    // Add elegant submission animation
    if (containerRef.current) {
      containerRef.current.style.opacity = '0.9'
      containerRef.current.style.transform = 'translateY(-20px) scale(0.98)'
      containerRef.current.style.filter = 'blur(2px)'
    }
    
    // Create gentle fade out effect
    setTimeout(() => {
      onSubmit(inputText)
    }, 600)
  }

  const handleClear = () => {
    setInputText('')
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleBack = () => {
    // Navigate back with animation
    if (containerRef.current) {
      containerRef.current.style.opacity = '0'
      containerRef.current.style.transform = 'translateX(-20px)'
    }
    
    setTimeout(() => {
      window.history.back()
    }, 300)
  }

  // Calculate subtle effects based on typing intensity
  const textareaElevation = `${typingIntensity * 0.5}rem`
  const backgroundOpacity = `${0.3 + typingIntensity * 0.2}`
  const pulseScale = `${0.8 + typingIntensity * 0.4}`

  return (
    <div 
      ref={containerRef}
      className="input-screen"
      style={{
        '--textarea-elevation': textareaElevation,
        '--background-opacity': backgroundOpacity,
        '--pulse-scale': pulseScale,
      }}
    >
      {/* Luxury Background */}
      <div className="background-layers">
        <div className="gradient-layer" />
        <div className="mesh-layer" />
        <div className="grain-overlay" />
      </div>

      {/* Floating Particles */}
      <div className="floating-elements">
        <div className="particle particle-1" />
        <div className="particle particle-2" />
        <div className="particle particle-3" />
      </div>

      {/* Typing Wave Effect */}
      <div ref={waveRef} className="typing-wave" />

      <div className="input-container">
        {/* Header with Back Button */}
        <div className="header">
          <button 
            className="back-button"
            onClick={handleBack}
            aria-label="Go back"
          >
            <span className="back-arrow">←</span>
            <span className="back-text">Back</span>
          </button>
          
          <div className="header-content">
            <h2 className="screen-title">Between the Lines</h2>
            <p className="screen-subtitle">
              Share what feels heavy or hopeful
            </p>
          </div>
        </div>

        {/* Text Area - Luxury Design */}
        <div className="textarea-wrapper">
          <div className="textarea-ornament top-ornament" />
          
          <div className="textarea-container">
            <div className="textarea-border-glow" />
            <div className="textarea-border" />
            
            <textarea
              ref={textareaRef}
              className="thought-input"
              value={inputText}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={placeholders[placeholderIndex]}
              rows={6}
              maxLength={1000}
            />
            
            {/* Character Count (No Cursor) */}
            <div className="character-count">
              <div className="count-bar">
                <div 
                  className="count-fill"
                  style={{ width: `${(inputText.length / 1000) * 100}%` }}
                />
              </div>
              <span className="count-text">
                {inputText.length} / 1000
              </span>
            </div>
          </div>
          
          <div className="textarea-ornament bottom-ornament" />
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="left-controls">
            <button 
              className="clear-button"
              onClick={handleClear}
              disabled={!inputText || isSubmitting}
            >
              <span className="clear-icon">↻</span>
              Clear
            </button>
          </div>
          
          <div className="right-controls">
            <div className={`submit-hint ${canSubmit ? 'visible' : ''}`}>
              <div className="hint-dots">
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </div>
              <span>Ready when you are</span>
            </div>
            
            <button
              className={`submit-button ${canSubmit ? 'active' : 'disabled'} ${isSubmitting ? 'submitting' : ''}`}
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
            >
              <span className="submit-text">
                {isSubmitting ? 'Sharing...' : 'Continue'}
              </span>
              <span className="submit-arrow">↗</span>
              <span className="submit-glow" />
            </button>
          </div>
        </div>

        {/* Guidelines - More Elegant */}
        <div className="guidelines">
          <div className="guideline">
            <div className="guideline-ornament" />
            <div className="guideline-content">
              <div className="guideline-icon">🌿</div>
              <p>Gentle space for your thoughts</p>
            </div>
          </div>
          
          <div className="guideline">
            <div className="guideline-ornament" />
            <div className="guideline-content">
              <div className="guideline-icon">🕊️</div>
              <p>Everything stays with you</p>
            </div>
          </div>
          
          <div className="guideline">
            <div className="guideline-ornament" />
            <div className="guideline-content">
              <div className="guideline-icon">🌀</div>
              <p>Flow without pressure</p>
            </div>
          </div>
        </div>
      </div>

      {/* Breathing Indicator */}
      <div className="breathing-indicator">
        <div className="breath-circle" />
        <span className="breath-text">Breathe and write</span>
      </div>
    </div>
  )
}

export default InputScreen