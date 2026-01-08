import { useState, useEffect, useRef } from 'react'
import '../styles/LandingScreen.css'

const LandingScreen = ({ onBegin }) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [loaded, setLoaded] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 400)
    return () => clearTimeout(t)
  }, [])

  const onMove = (e) => {
    if (!ref.current || leaving) return
    const r = ref.current.getBoundingClientRect()
    setMouse({
      x: (e.clientX / r.width - 0.5),
      y: (e.clientY / r.height - 0.5),
    })
  }

  const begin = () => {
    if (leaving) return
    setLeaving(true)

    const el = ref.current
    if (el) {
      el.style.opacity = '0'
      el.style.transform = 'scale(0.97)'
      el.style.filter = 'blur(6px)'
    }

    setTimeout(onBegin, 700)
  }

  return (
    <div
      ref={ref}
      className={`landing-screen ${loaded ? 'loaded' : ''}`}
      onMouseMove={onMove}
      onMouseLeave={() => !leaving && setMouse({ x: 0, y: 0 })}
    >
      {/* Background */}
      <div className="bg-base">
        <div className="bg-glow" />
        <div className="bg-grain" />
      </div>

      {/* Floating atmosphere */}
      <div
        className="atmosphere"
        style={{
          transform: `translate3d(${mouse.x * 18}px, ${mouse.y * 18}px,0)`,
        }}
      />

      {/* Content */}
      <div className="landing-content">
        <h1
          className="headline"
          style={{
            transform: `translate3d(${mouse.x * -6}px, ${mouse.y * -6}px,0)`,
          }}
        >
          Some thoughts are loud.
          <br />
          <span>Some meanings live between the lines.</span>
        </h1>

        <p className="subtitle">
          A calm space where AI listens
          <br />
          and responds through voices you miss.
        </p>

        <button className="begin-button" onClick={begin} disabled={leaving}>
          <span>Begin</span>
        </button>
      </div>

      {/* Frame */}
      <div className="soft-frame" />
    </div>
  )
}

export default LandingScreen
