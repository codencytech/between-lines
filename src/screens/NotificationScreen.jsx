import { useState, useEffect, useRef } from 'react'
import '../styles/NotificationScreen.css'

const NotificationScreen = ({ selectedPerson, onClick, onBack }) => {
  const [notificationState, setNotificationState] = useState('hidden') // hidden, appearing, visible, clicking
  const [particleCount, setParticleCount] = useState(0)
  const containerRef = useRef(null)
  const notificationRef = useRef(null)
  const envelopeRef = useRef(null)

  useEffect(() => {
    // Sequence animations
    const sequence = async () => {
      // Initial delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Envelope appears
      setNotificationState('envelope-appearing')
      
      // Envelope opens
      await new Promise(resolve => setTimeout(resolve, 800))
      setNotificationState('envelope-opening')
      
      // Message appears
      await new Promise(resolve => setTimeout(resolve, 600))
      setNotificationState('message-appearing')
      
      // Final state
      await new Promise(resolve => setTimeout(resolve, 400))
      setNotificationState('ready')
    }

    sequence()

    // Generate gentle particles
    const particleInterval = setInterval(() => {
      if (notificationState === 'ready' && particleCount < 15) {
        setParticleCount(prev => prev + 1)
        setTimeout(() => {
          setParticleCount(prev => prev - 1)
        }, 3000)
      }
    }, 200)

    return () => clearInterval(particleInterval)
  }, [notificationState, particleCount])

  const handleClick = () => {
    if (notificationState !== 'ready') return
    
    setNotificationState('clicking')
    
    // Create opening animation
    if (envelopeRef.current) {
      envelopeRef.current.classList.add('opening')
    }
    
    // Gentle fade out
    setTimeout(() => {
      onClick()
    }, 1000)
  }

  const handleBack = () => {
    if (notificationState === 'clicking') return
    
    if (containerRef.current) {
      containerRef.current.style.opacity = '0'
      containerRef.current.style.transform = 'translateX(-20px)'
    }
    
    setTimeout(() => {
      if (onBack) onBack()
    }, 400)
  }

  const getPersonInfo = () => {
    if (!selectedPerson) return { title: 'Someone', icon: '👤', symbol: '💭' }
    return {
      title: selectedPerson.title,
      icon: selectedPerson.icon,
      symbol: selectedPerson.symbol || '💭',
      color: selectedPerson.color || '#8A7F78'
    }
  }

  const person = getPersonInfo()

  return (
    <div ref={containerRef} className="notification-screen">
      {/* Luxury Background */}
      <div className="background-layers">
        <div className="gradient-field" />
        <div className="light-rays" />
        <div className="soft-glow" />
      </div>

      {/* Animated Particles */}
      <div className="magic-particles">
        {Array.from({ length: particleCount }).map((_, i) => (
          <div 
            key={i}
            className="magic-particle"
            style={{
              '--delay': `${i * 0.1}s`,
              '--duration': `${2 + Math.random() * 2}s`,
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`,
              '--color': person.color
            }}
          />
        ))}
      </div>

      <div className="notification-container">
        {/* Header with Back Button */}
        <div className="notification-header">
          <button 
            className="back-button"
            onClick={handleBack}
            disabled={notificationState === 'clicking'}
          >
            <span className="back-arrow">←</span>
            <span className="back-text">Back</span>
          </button>
          
          <div className="header-content">
            <h1 className="screen-title">
              <span className="title-line">A Message</span>
              <span className="title-line accent">Has Arrived</span>
            </h1>
            <p className="screen-subtitle">
              From someone who understands what's between your lines
            </p>
          </div>
        </div>

        {/* Main Content - Animated Envelope */}
        <div className="envelope-container">
          <div 
            ref={envelopeRef}
            className={`envelope ${notificationState}`}
            onClick={handleClick}
          >
            {/* Envelope Back */}
            <div className="envelope-back">
              <div className="envelope-seal">
                <div className="seal-icon">{person.symbol}</div>
              </div>
            </div>
            
            {/* Envelope Front */}
            <div className="envelope-front">
              <div className="envelope-flap" />
              <div className="envelope-body">
                <div className="sender-badge">
                  <div className="badge-icon">{person.icon}</div>
                  <div className="badge-glow" />
                </div>
                
                <div className="envelope-content">
                  <div className="content-line line-1" />
                  <div className="content-line line-2" />
                  <div className="content-line line-3" />
                  <div className="content-dot dot-1" />
                  <div className="content-dot dot-2" />
                  <div className="content-dot dot-3" />
                </div>
              </div>
            </div>
            
            {/* Letter Inside */}
            <div className="letter">
              <div className="letter-fold" />
              <div className="letter-content">
                <div className="letter-header">
                  <div className="letter-icon">✉️</div>
                  <div className="letter-title">For You</div>
                </div>
                
                <div className="letter-message">
                  <div className="message-line" />
                  <div className="message-line" />
                  <div className="message-line" />
                  <div className="message-line short" />
                </div>
                
                <div className="letter-footer">
                  <div className="footer-symbol">{person.symbol}</div>
                  <div className="footer-name">{person.title}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status and Instructions */}
        <div className="notification-status">
          {notificationState === 'ready' ? (
            <div className="ready-status">
              <div className="status-indicator">
                <div className="indicator-pulse" />
                <span className="indicator-text">Click the envelope to open</span>
              </div>
              
              <div className="sender-info">
                <div className="sender-avatar">
                  <div className="avatar-icon">{person.icon}</div>
                  <div className="avatar-glow" style={{ backgroundColor: person.color + '20' }} />
                </div>
                <div className="sender-details">
                  <div className="sender-name">{person.title}</div>
                  <div className="sender-role">Has a message for you</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="preparing-status">
              <div className="preparing-indicator">
                <div className="preparing-dots">
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                </div>
                <span className="preparing-text">
                  {notificationState === 'message-appearing' 
                    ? 'Preparing your message...' 
                    : 'Sealing with care...'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="notification-footer">
          <div className="footer-note">
            <div className="note-icon">💫</div>
            <p>
              This message was written from understanding, not obligation
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Corner Elements */}
      <div className="corner-ornament top-left">
        <div className="ornament-line" />
        <div className="ornament-dot" />
      </div>
      <div className="corner-ornament top-right">
        <div className="ornament-line" />
        <div className="ornament-dot" />
      </div>
      <div className="corner-ornament bottom-left">
        <div className="ornament-line" />
        <div className="ornament-dot" />
      </div>
      <div className="corner-ornament bottom-right">
        <div className="ornament-line" />
        <div className="ornament-dot" />
      </div>
    </div>
  )
}

export default NotificationScreen