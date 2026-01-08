import { useState, useEffect, useRef } from 'react'
import '../styles/InputScreen.css'

const InputScreen = ({ onSubmit }) => {
  const [inputText, setInputText] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [focused, setFocused] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const textareaRef = useRef(null)
  const containerRef = useRef(null)

  const placeholders = [
    "What's been echoing in your mind?",
    "Let the unsaid words surface",
    "No editing, just expression",
    "Your feelings are welcome here"
  ]

  /* Initial focus + placeholder rotation */
  useEffect(() => {
    const focusTimer = setTimeout(() => {
      textareaRef.current?.focus()
    }, 500)

    if (focused || inputText.length > 0) return

    const placeholderTimer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
    }, 4000)

    const breathingTimer = setInterval(() => {
      if (containerRef.current && !focused && inputText.length === 0) {
        containerRef.current.style.setProperty('--breath-phase', Math.random())
      }
    }, 4000)

    return () => {
      clearTimeout(focusTimer)
      clearInterval(placeholderTimer)
      clearInterval(breathingTimer)
    }
  }, [focused, inputText])

  /* Enable submit only when enough text exists */
  useEffect(() => {
    setCanSubmit(inputText.trim().length > 25)
  }, [inputText])

  const handleTextChange = (e) => {
    setInputText(e.target.value)
  }

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && canSubmit && !isSubmitting) {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (!canSubmit || isSubmitting) return

    setIsSubmitting(true)

    if (containerRef.current) {
      containerRef.current.style.opacity = '0.9'
      containerRef.current.style.transform = 'translateY(-20px) scale(0.98)'
      containerRef.current.style.filter = 'blur(2px)'
    }

    setTimeout(() => {
      onSubmit(inputText)
    }, 600)
  }

  const handleClear = () => {
    setInputText('')
    textareaRef.current?.focus()
  }

  const handleBack = () => {
    if (containerRef.current) {
      containerRef.current.style.opacity = '0'
      containerRef.current.style.transform = 'translateX(-20px)'
    }

    setTimeout(() => {
      onSubmit(null)
    }, 300)
  }

  return (
    <div ref={containerRef} className="input-screen">
      {/* Background */}
      <div className="background-layers">
        <div className="gradient-layer" />
        <div className="mesh-layer" />
        <div className="grain-overlay" />
      </div>

      {/* Ambient elements */}
      <div className="floating-elements">
        <div className="particle particle-1" />
        <div className="particle particle-2" />
        <div className="particle particle-3" />
      </div>

      <div className="input-container">
        {/* Header */}
        <div className="header">
          <button className="back-button" onClick={handleBack} aria-label="Go back">
            <span className="back-arrow">←</span>
            <span className="back-text">Back</span>
          </button>

          <div className="header-content">
            <h2 className="screen-title">Between the Lines</h2>
            <p className="screen-subtitle">Share what feels heavy or hopeful</p>
          </div>
        </div>

        {/* Text input */}
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

        {/* Guidelines */}
        <div className="guidelines">
          <p>Gentle space. No pressure. Nothing to perform.</p>
        </div>
      </div>

      {/* Breathing cue */}
      <div className="breathing-indicator">
        <div className="breath-circle" />
        <span className="breath-text">Breathe and write</span>
      </div>
    </div>
  )
}

export default InputScreen
