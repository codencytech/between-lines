import { useState, useEffect, useRef } from 'react'
import '../styles/SelectorScreen.css'

const personOptions = [
  {
    id: 'father',
    title: 'Father',
    description: 'Steady, protective presence',
    icon: '🧔',
    symbol: '🛡️',
    color: '#8A7F78',
    gradient: 'linear-gradient(135deg, #8A7F78 0%, #D7CCC8 100%)',
    tone: 'steady wisdom'
  },
  {
    id: 'mother',
    title: 'Mother',
    description: 'Nurturing, understanding voice',
    icon: '👩',
    symbol: '🌿',
    color: '#B8A9A3',
    gradient: 'linear-gradient(135deg, #B8A9A3 0%, #F3E9E1 100%)',
    tone: 'gentle comfort'
  },
  {
    id: 'friend',
    title: 'Best Friend',
    description: 'Who knows you beyond words',
    icon: '👥',
    symbol: '⭐',
    color: '#8A9A7E',
    gradient: 'linear-gradient(135deg, #8A9A7E 0%, #D7E6C8 100%)',
    tone: 'authentic connection'
  },
  {
    id: 'lost',
    title: 'Someone I Lost',
    description: 'Their memory comforts me',
    icon: '👼',
    symbol: '🕊️',
    color: '#9A8A9E',
    gradient: 'linear-gradient(135deg, #9A8A9E 0%, #E6D7E6 100%)',
    tone: 'peaceful remembrance'
  },
  {
    id: 'drifted',
    title: 'Someone I Drifted From',
    description: 'Connection that still resonates',
    icon: '🌅',
    symbol: '🌀',
    color: '#8A9A9E',
    gradient: 'linear-gradient(135deg, #8A9A9E 0%, #D7E6E6 100%)',
    tone: 'reflective understanding'
  }
]

const SelectorScreen = ({ onSelect }) => {
  const [selectedId, setSelectedId] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef(null)
  const cardsRef = useRef([])
  const orbRef = useRef(null)

  useEffect(() => {
    // Initialize with gentle animation
    setTimeout(() => {
      if (orbRef.current) {
        orbRef.current.style.opacity = '1'
      }
    }, 500)
  }, [])

  const handleMouseMove = (e) => {
    if (!containerRef.current || isTransitioning) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    
    // Update active index based on mouse position
    const sectionWidth = 1 / personOptions.length
    const hoverIndex = Math.floor((x + 0.5) / sectionWidth)
    setActiveIndex(Math.max(0, Math.min(hoverIndex, personOptions.length - 1)))
  }

  const handleSelect = (person) => {
    if (selectedId === person.id || isTransitioning) return
    
    setIsTransitioning(true)
    setSelectedId(person.id)
    
    // Visual feedback
    const selectedCard = cardsRef.current.find(card => card && card.dataset.id === person.id)
    if (selectedCard) {
      selectedCard.classList.add('selected-glow')
    }
    
    // Create ripple effect
    createSelectionRipple(person)
    
    // Transition after animation
    setTimeout(() => {
      if (onSelect && typeof onSelect === 'function') {
        onSelect(person)
      }
    }, 1200)
  }

  const createSelectionRipple = (person) => {
    const ripple = document.createElement('div')
    ripple.className = 'selection-ripple'
    ripple.style.background = `radial-gradient(circle, ${person.color}20 0%, transparent 70%)`
    document.body.appendChild(ripple)
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple)
      }
    }, 1000)
  }

  const handleBack = () => {
    setIsTransitioning(true)
    
    if (containerRef.current) {
      containerRef.current.style.opacity = '0'
      containerRef.current.style.transform = 'translateX(-20px)'
    }
    
    setTimeout(() => {
      window.history.back()
    }, 400)
  }

  const handleContinueClick = () => {
    if (!selectedId) {
      // Gentle shake animation
      const hint = document.querySelector('.selection-hint')
      if (hint) {
        hint.style.animation = 'shake 0.5s ease'
        setTimeout(() => hint.style.animation = '', 500)
      }
      return
    }
    
    const selectedPerson = personOptions.find(p => p.id === selectedId)
    if (selectedPerson) {
      handleSelect(selectedPerson)
    }
  }

  // Calculate connection lines between cards
  const getConnectionStyle = (index) => {
    if (selectedId || hoveredId) return {}
    
    const activeCard = cardsRef.current[activeIndex]
    if (!activeCard) return {}
    
    const rect = activeCard.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    return {
      '--center-x': `${centerX}px`,
      '--center-y': `${centerY}px`
    }
  }

  return (
    <div 
      ref={containerRef}
      className="selector-screen"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => !isTransitioning && setActiveIndex(0)}
    >
      {/* Luxury Background */}
      <div className="background-layers">
        <div className="gradient-field" />
        <div className="mesh-overlay" />
        <div className="grain-texture" />
      </div>
      
      {/* Animated Orb */}
      <div ref={orbRef} className="floating-orb" />
      
      {/* Connection Lines */}
      <div className="connection-lines">
        {personOptions.map((person, index) => (
          <div 
            key={`line-${person.id}`}
            className="connection-line"
            style={getConnectionStyle(index)}
          />
        ))}
      </div>

      <div className="selector-content">
        {/* Header with Back Button */}
        <div className="header-section">
          <button 
            className="back-button"
            onClick={handleBack}
            disabled={isTransitioning}
          >
            <span className="back-arrow">←</span>
            <span className="back-text">Back</span>
          </button>
          
          <div className="header-content">
            <h1 className="selector-title">
              <span className="title-line">Whose Voice</span>
              <span className="title-line accent">Would Comfort You?</span>
            </h1>
            <p className="selector-subtitle">
              Choose someone whose understanding feels safe and familiar
            </p>
          </div>
        </div>

        {/* Circular Selection Interface */}
        <div className="selection-interface">
          <div className="selection-circle">
            {personOptions.map((person, index) => {
              const angle = (index / personOptions.length) * 2 * Math.PI
              const radius = 180
              const x = radius * Math.cos(angle)
              const y = radius * Math.sin(angle)
              
              return (
                <div
                  key={person.id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  data-id={person.id}
                  className={`person-orb ${selectedId === person.id ? 'selected' : ''} ${hoveredId === person.id ? 'hovered' : ''}`}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    '--color': person.color,
                    '--gradient': person.gradient,
                    '--delay': `${index * 0.1}s`
                  }}
                  onClick={() => handleSelect(person)}
                  onMouseEnter={() => !isTransitioning && setHoveredId(person.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="orb-glow" />
                  <div className="orb-border" />
                  
                  <div className="orb-content">
                    <div className="orb-symbol">{person.symbol}</div>
                    <div className="orb-icon">{person.icon}</div>
                  </div>
                  
                  <div className="orb-info">
                    <h3 className="orb-title">{person.title}</h3>
                    <p className="orb-tone">{person.tone}</p>
                  </div>
                </div>
              )
            })}
            
            {/* Center Info */}
            <div className="center-info">
              <div className="center-circle">
                <div className="center-glow" />
                {selectedId ? (
                  <>
                    <div className="selected-icon">
                      {personOptions.find(p => p.id === selectedId)?.icon}
                    </div>
                    <p className="selected-message">
                      Voice Selected
                    </p>
                  </>
                ) : hoveredId ? (
                  <>
                    <div className="hovered-icon">
                      {personOptions.find(p => p.id === hoveredId)?.icon}
                    </div>
                    <p className="hovered-message">
                      {personOptions.find(p => p.id === hoveredId)?.description}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="default-icon">👤</div>
                    <p className="default-message">
                      Hover to explore voices
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Selection Status */}
        <div className="selection-status">
          <div className="status-content">
            {selectedId ? (
              <>
                <div className="selected-indicator">
                  <div className="pulse-dot" />
                  <span className="selected-label">
                    Selected: <strong>{personOptions.find(p => p.id === selectedId)?.title}</strong>
                  </span>
                </div>
                <button 
                  className="continue-button"
                  onClick={handleContinueClick}
                  disabled={isTransitioning}
                >
                  <span className="button-glow" />
                  <span className="button-text">Listen to their voice</span>
                  <span className="button-arrow">→</span>
                </button>
              </>
            ) : (
              <div className="selection-hint">
                <div className="hint-ornament" />
                <p className="hint-text">
                  Touch an orb to select, or hover to feel their presence
                </p>
                <div className="hint-ornament" />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="selector-footer">
          <div className="footer-note">
            <div className="note-icon">💭</div>
            <p>
              This voice will listen without judgment and speak from genuine care
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Corner Elements */}
      <div className="corner-element top-left">
        <div className="corner-line" />
        <div className="corner-dot" />
      </div>
      <div className="corner-element top-right">
        <div className="corner-line" />
        <div className="corner-dot" />
      </div>
      <div className="corner-element bottom-left">
        <div className="corner-line" />
        <div className="corner-dot" />
      </div>
      <div className="corner-element bottom-right">
        <div className="corner-line" />
        <div className="corner-dot" />
      </div>
    </div>
  )
}

export default SelectorScreen