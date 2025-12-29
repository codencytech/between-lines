import { useState, useEffect, useRef } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import '../styles/MessageDisplayScreen.css'

const MessageDisplayScreen = ({ response, selectedPerson, onRestart }) => {
  const [currentLine, setCurrentLine] = useState(0)
  const [showCharacter, setShowCharacter] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [showFinalNote, setShowFinalNote] = useState(false)
  const containerRef = useRef(null)
  const cardRef = useRef(null)

  // Split comforting message into lines
  const messageLines = response?.comfortingMessage 
    ? response.comfortingMessage.split('\n').filter(line => line.trim())
    : []

  // Typewriter effect for current line
  const { displayText, isComplete: lineComplete } = useTypewriter(
    messageLines[currentLine] || '',
    30,
    () => {
      // Move to next line after a pause
      if (currentLine < messageLines.length - 1) {
        setTimeout(() => {
          setCurrentLine(prev => prev + 1)
        }, 1200)
      } else {
        // All lines complete
        setTimeout(() => {
          setIsComplete(true)
          setTimeout(() => setShowFinalNote(true), 1000)
        }, 2000)
      }
    }
  )

  useEffect(() => {
    // Sequence animations
    const sequence = async () => {
      // Initial delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Show character
      setShowCharacter(true)
      
      // Show card after character appears
      await new Promise(resolve => setTimeout(resolve, 800))
      setShowCard(true)
      
      // Start showing message after card appears
      await new Promise(resolve => setTimeout(resolve, 600))
    }

    sequence()

    // Add gentle mouse parallax
    const handleMouseMove = (e) => {
      if (!containerRef.current) return
      
      const { clientX, clientY } = e
      const { width, height } = containerRef.current.getBoundingClientRect()
      
      const x = (clientX / width - 0.5) * 2
      const y = (clientY / height - 0.5) * 2
      
      if (cardRef.current) {
        cardRef.current.style.transform = `translate3d(${x * -10}px, ${y * -10}px, 0) rotate3d(${y * 0.1}, ${x * 0.1}, 0, 1deg)`
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      container.addEventListener('mouseleave', () => {
        if (cardRef.current) {
          cardRef.current.style.transform = 'translate3d(0, 0, 0) rotate3d(0, 0, 0, 0)'
        }
      })
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [])

  const getPersonInfo = () => {
    if (!selectedPerson) return { title: 'Someone', icon: '👤' }
    return {
      title: selectedPerson.title,
      icon: selectedPerson.icon,
      color: selectedPerson.color || '#A3B1B6'
    }
  }

  const person = getPersonInfo()

  const handleRestart = () => {
    // Add exit animation
    if (containerRef.current) {
      containerRef.current.style.opacity = '0'
      containerRef.current.style.transform = 'scale(0.98)'
    }
    
    setTimeout(() => {
      onRestart()
    }, 500)
  }

  const mouthAnimationClass = lineComplete ? 'speaking' : 'resting'

  return (
    <div ref={containerRef} className="message-screen">
      {/* Background with gradient layers */}
      <div className="message-background">
        <div className="gradient-layer layer-1" />
        <div className="gradient-layer layer-2" />
        <div className="gradient-layer layer-3" />
      </div>

      {/* Main content */}
      <div className="message-container">
        {/* Header */}
        <div className="message-header">
          <div className="sender-info">
            <div className="sender-icon">{person.icon}</div>
            <div className="sender-text">
              <span className="sender-label">From</span>
              <h2 className="sender-name">{person.title}</h2>
            </div>
          </div>
        </div>

        {/* Message area */}
        <div className="message-area">
          {/* Character */}
          <div className={`character-container ${showCharacter ? 'visible' : ''}`}>
            <div className="character">
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
                  </div>
                  
                  {/* Mouth with speaking animation */}
                  <div className="character-mouth">
                    <div className={`mouth-shape ${mouthAnimationClass}`} />
                  </div>
                </div>
              </div>
              
              {/* Body */}
              <div className="character-body">
                <div className="shoulder" />
                <div className="torso" />
              </div>
              
              {/* Arms - open posture */}
              <div className="character-arms comforting">
                <div className="arm left-arm" />
                <div className="arm right-arm" />
              </div>
            </div>
          </div>

          {/* Message card */}
          <div 
            ref={cardRef}
            className={`message-card ${showCard ? 'visible' : ''}`}
          >
            <div className="card-border" />
            
            <div className="card-content">
              {/* Card header */}
              <div className="card-header">
                <div className="card-icon">💭</div>
                <div className="card-title">
                  <span className="title-text">A Message For You</span>
                  <span className="title-dot" />
                </div>
              </div>

              {/* Message lines */}
              <div className="message-lines">
                {messageLines.map((line, index) => (
                  <div 
                    key={index}
                    className={`message-line ${index <= currentLine ? 'active' : ''} ${index === currentLine ? 'current' : ''}`}
                  >
                    {index < currentLine ? (
                      // Already displayed lines
                      <span className="line-text">{line}</span>
                    ) : index === currentLine ? (
                      // Currently typing line
                      <span className="line-text">
                        {displayText}
                        {!lineComplete && <span className="type-cursor" />}
                      </span>
                    ) : (
                      // Future lines (empty)
                      <span className="line-text" />
                    )}
                    
                    {/* Line indicator */}
                    {index < currentLine && (
                      <div className="line-indicator">
                        <div className="indicator-dot" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Completion indicator */}
              {isComplete && (
                <div className="completion-indicator">
                  <div className="indicator-line" />
                  <div className="indicator-text">Message complete</div>
                  <div className="indicator-line" />
                </div>
              )}
            </div>

            {/* Card glow */}
            <div className="card-glow" />
          </div>
        </div>

        {/* Final note */}
        <div className={`final-note ${showFinalNote ? 'visible' : ''}`}>
          <div className="note-line top-line" />
          
          <div className="note-content">
            <p className="note-text">
              Nothing here asks you to act.
            </p>
            <p className="note-subtext">
              This message was not meant to push you forward.
            </p>
          </div>
          
          <div className="note-line bottom-line" />
        </div>

        {/* Footer with restart */}
        <div className="message-footer">
          <button 
            className="restart-button"
            onClick={handleRestart}
          >
            <span className="restart-icon">↺</span>
            <span className="restart-text">Begin Again</span>
          </button>
          
          <div className="footer-note">
            Your words remain private and are not stored
          </div>
        </div>
      </div>

      {/* Decorative corner accents */}
      <div className="corner-accent top-left" />
      <div className="corner-accent top-right" />
      <div className="corner-accent bottom-left" />
      <div className="corner-accent bottom-right" />
    </div>
  )
}

export default MessageDisplayScreen