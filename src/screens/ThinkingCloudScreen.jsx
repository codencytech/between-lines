import { useState, useEffect, useRef } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import '../styles/ThinkingCloudScreen.css'

const ThinkingCloudScreen = ({ isLoading, selectedPerson, onBack }) => {
  const [currentSection, setCurrentSection] = useState(-1)
  const [characterState, setCharacterState] = useState('entering') // entering, standing, thinking, listening
  const [cloudState, setCloudState] = useState('hidden') // hidden, appearing, visible
  const [thoughts, setThoughts] = useState([])
  const [showEnvironment, setShowEnvironment] = useState(false)
  const [isThinkingComplete, setIsThinkingComplete] = useState(false)
  const containerRef = useRef(null)
  const characterRef = useRef(null)
  const cloudRef = useRef(null)

  // AI sections for the understanding phase
  const aiSections = [
    {
      title: "The Signal",
      content: "You are experiencing emotional fatigue mixed with direction uncertainty—a sense of carrying weight without knowing exactly where to set it down.",
      icon: "🎯",
      color: "#8A7F78"
    },
    {
      title: "Why This Makes Sense",
      content: "This makes sense because sustained effort without emotional rest naturally leads to this kind of weariness. You've been showing up consistently, and that takes energy whether you see it or not.",
      icon: "🧠",
      color: "#B8A9A3"
    },
    {
      title: "What This Is Not",
      content: "This is not laziness. This is not failure. This is not a sign you can't handle your life. This is simply human.",
      icon: "🕊️",
      color: "#8A9A9E"
    }
  ]

  // Typewriter effect for current thought with mouth sync
  const { displayText, isComplete: lineComplete, reset } = useTypewriter(
    currentSection >= 0 ? thoughts[currentSection]?.content || '' : '',
    25,
    () => {
      // Line complete - pause before next section
      setTimeout(() => {
        if (currentSection < thoughts.length - 1) {
          setCurrentSection(prev => prev + 1)
          reset()
        } else {
          // All sections complete
          setIsThinkingComplete(true)
          setCharacterState('listening')
          
          // Transition to message phase after delay
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.style.opacity = '0'
              containerRef.current.style.transform = 'scale(0.98)'
            }
          }, 2000)
        }
      }, 800)
    }
  )

  useEffect(() => {
    // Character walking in from left
    setTimeout(() => {
      setCharacterState('walking')
      
      // Character arrives after walking animation
      setTimeout(() => {
        setCharacterState('standing')
        
        // Show environment elements
        setTimeout(() => {
          setShowEnvironment(true)
          
          // Cloud appears
          setTimeout(() => {
            setCloudState('appearing')
            
            // Cloud becomes visible
            setTimeout(() => {
              setCloudState('visible')
              
              // Start showing thoughts
              setTimeout(() => {
                setThoughts(aiSections)
                setCurrentSection(0)
                setCharacterState('thinking')
              }, 800)
            }, 600)
          }, 800)
        }, 400)
      }, 1500) // Walking duration
    }, 500)

    return () => {
      // Cleanup
      setThoughts([])
      setCurrentSection(-1)
    }
  }, [])

  const handleBack = () => {
    if (isThinkingComplete) return
    
    setCharacterState('leaving')
    
    if (containerRef.current) {
      containerRef.current.style.opacity = '0'
      containerRef.current.style.transform = 'translateX(-20px)'
    }
    
    setTimeout(() => {
      if (onBack) onBack()
    }, 500)
  }

  const handleCloudClick = () => {
    if (currentSection < thoughts.length - 1 && lineComplete && cloudRef.current) {
      cloudRef.current.classList.add('cloud-pulse')
      setTimeout(() => {
        if (cloudRef.current) {
          cloudRef.current.classList.remove('cloud-pulse')
        }
      }, 300)
      
      setCurrentSection(prev => prev + 1)
      reset()
    }
  }

  const getCurrentPerson = () => {
    if (!selectedPerson) return { title: 'Someone', icon: '👤', symbol: '⭐' }
    return {
      title: selectedPerson.title,
      icon: selectedPerson.icon,
      symbol: selectedPerson.symbol || '💭'
    }
  }

  const person = getCurrentPerson()

  // Determine mouth animation based on state
  const getMouthAnimation = () => {
    if (characterState === 'thinking' && !lineComplete) return 'speaking'
    if (characterState === 'listening') return 'smiling'
    return 'neutral'
  }

  return (
    <div ref={containerRef} className="thinking-screen">
      {/* Luxury Environment Background */}
      <div className="environment-background">
        <div className="sky-gradient" />
        <div className="ground-layer" />
        <div className="atmosphere-fog" />
        
        {/* Environment Elements */}
        {showEnvironment && (
          <>
            <div className="env-element tree-1" />
            <div className="env-element tree-2" />
            <div className="env-element cloud-small cloud-1" />
            <div className="env-element cloud-small cloud-2" />
            <div className="env-element sun-glow" />
          </>
        )}
      </div>

      {/* Animated Particles */}
      <div className="thought-particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i}
            className="particle"
            style={{
              '--delay': `${i * 0.3}s`,
              '--duration': `${4 + Math.random() * 3}s`,
              '--size': `${8 + Math.random() * 8}px`,
              '--opacity': `${0.1 + Math.random() * 0.2}`
            }}
          />
        ))}
      </div>

      <div className="thinking-container">
        {/* Header with Back Button */}
        <div className="thinking-header">
          <button 
            className="back-button"
            onClick={handleBack}
            disabled={characterState === 'leaving' || isThinkingComplete}
          >
            <span className="back-arrow">←</span>
            <span className="back-text">Back</span>
          </button>
          
          <div className="header-content">
            <h1 className="thinking-title">
              <span className="title-line">Understanding</span>
              <span className="title-line accent">What's Unspoken</span>
            </h1>
            <p className="thinking-subtitle">
              {person.title} is listening with care and attention
            </p>
          </div>
        </div>

        {/* Main Scene */}
        <div className="scene-container">
          {/* Character with Walking Animation */}
          <div 
            ref={characterRef}
            className={`character-container ${characterState}`}
          >
            <div className="character">
              {/* Walking Animation Track */}
              {characterState === 'walking' && (
                <div className="walking-track">
                  <div className="footstep step-1" />
                  <div className="footstep step-2" />
                  <div className="footstep step-3" />
                </div>
              )}
              
              {/* Character Body */}
              <div className="character-body">
                {/* Head */}
                <div className="character-head">
                  <div className="character-face">
                    {/* Eyes */}
                    <div className="character-eyes">
                      <div className="eye left-eye">
                        <div className="eye-pupil" />
                      </div>
                      <div className="eye right-eye">
                        <div className="eye-pupil" />
                      </div>
                      
                      {/* Eye highlights */}
                      <div className="eye-highlight" />
                    </div>
                    
                    {/* Mouth - Synced with speech */}
                    <div className="character-mouth">
                      <div className={`mouth-shape ${getMouthAnimation()}`} />
                    </div>
                  </div>
                </div>
                
                {/* Body with breathing animation */}
                <div className="character-torso">
                  <div className="shoulder-line" />
                  <div className="torso-shape" />
                </div>
                
                {/* Arms - Position based on state */}
                <div className="character-arms">
                  <div className={`arm left-arm ${characterState}`} />
                  <div className={`arm right-arm ${characterState}`} />
                </div>
              </div>
            </div>
            
            {/* Person Identity */}
            <div className="person-identity">
              <div className="identity-orb">
                <div className="orb-icon">{person.icon}</div>
                <div className="orb-symbol">{person.symbol}</div>
              </div>
              <div className="identity-name">{person.title}</div>
              <div className="identity-role">Listening & Understanding</div>
            </div>
          </div>

          {/* Thinking Cloud with Progressive Reveal */}
          <div 
            ref={cloudRef}
            className={`thinking-cloud ${cloudState}`}
            onClick={handleCloudClick}
          >
            {/* Cloud Glow Effect */}
            <div className="cloud-glow" />
            
            {/* Cloud Body */}
            <div className="cloud-body">
              <div className="cloud-ornament top" />
              
              <div className="cloud-content">
                {currentSection >= 0 ? (
                  <>
                    {/* Thought Header */}
                    <div className="thought-header">
                      <div 
                        className="thought-icon"
                        style={{ color: thoughts[currentSection]?.color }}
                      >
                        {thoughts[currentSection]?.icon}
                      </div>
                      <div className="thought-title-container">
                        <h3 className="thought-title">
                          {thoughts[currentSection]?.title}
                        </h3>
                        <div className="title-underline" />
                      </div>
                    </div>
                    
                    {/* Thought Text with Typewriter */}
                    <div className="thought-text">
                      <div className="text-container">
                        {displayText}
                        {!lineComplete && <span className="type-cursor" />}
                      </div>
                      
                      {/* Progress Indicator */}
                      <div className="text-progress">
                        <div 
                          className="progress-bar"
                          style={{ 
                            width: `${((displayText.length) / (thoughts[currentSection]?.content?.length || 1)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Continue Prompt */}
                    {lineComplete && currentSection < thoughts.length - 1 && (
                      <div className="thought-continue">
                        <div className="continue-dots">
                          <div className="dot" />
                          <div className="dot" />
                          <div className="dot" />
                        </div>
                        <span className="continue-text">
                          {characterState === 'thinking' ? 'Processing next insight...' : 'Click to continue'}
                        </span>
                      </div>
                    )}
                    
                    {/* Section Progress */}
                    <div className="section-progress">
                      <div className="progress-track">
                        {thoughts.map((_, index) => (
                          <div 
                            key={index}
                            className={`progress-step ${index === currentSection ? 'current' : ''} ${index < currentSection ? 'completed' : ''}`}
                          >
                            <div className="step-dot" />
                            {index < thoughts.length - 1 && <div className="step-connector" />}
                          </div>
                        ))}
                      </div>
                      <div className="progress-label">
                        Insight {currentSection + 1} of {thoughts.length}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Initial Loading State */
                  <div className="cloud-loading">
                    <div className="loading-orb">
                      <div className="orb-ring ring-1" />
                      <div className="orb-ring ring-2" />
                      <div className="orb-ring ring-3" />
                      <div className="orb-center">{person.icon}</div>
                    </div>
                    <p className="loading-text">
                      {person.title} is gathering understanding...
                    </p>
                  </div>
                )}
              </div>
              
              <div className="cloud-ornament bottom" />
            </div>
            
            {/* Cloud Tail/Connection to Character */}
            <div className="cloud-connection">
              <div className="connection-line" />
              <div className="connection-dot" />
            </div>
          </div>
        </div>

        {/* Status Information */}
        <div className="status-info">
          {isThinkingComplete ? (
            <div className="completion-status">
              <div className="completion-orb" />
              <div className="completion-text">
                Understanding complete. Preparing comforting message...
              </div>
            </div>
          ) : (
            <div className="thinking-status">
              <div className="status-indicator">
                <div className="indicator-pulse" />
                <div className="indicator-text">
                  {characterState === 'thinking' ? 'Thinking deeply...' : 'Listening carefully...'}
                </div>
              </div>
              
              <div className="status-instructions">
                <div className="instruction">
                  <div className="instruction-icon">👂</div>
                  <span>Take your time with each insight</span>
                </div>
                <div className="instruction">
                  <div className="instruction-icon">💫</div>
                  <span>No rush, no pressure</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Border */}
      <div className="scene-border top" />
      <div className="scene-border bottom" />
      <div className="scene-border left" />
      <div className="scene-border right" />
    </div>
  )
}

export default ThinkingCloudScreen