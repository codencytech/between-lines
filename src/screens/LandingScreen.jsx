import { useState, useEffect, useRef } from 'react'
import '../styles/LandingScreen.css'

const LandingScreen = ({ onBegin }) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [loaded, setLoaded] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 500)
    return () => clearTimeout(t)
  }, [])

  const onMove = (e) => {
    if (!ref.current || leaving) return
    const r = ref.current.getBoundingClientRect()
    setMouse({
      x: e.clientX / r.width - 0.5,
      y: e.clientY / r.height - 0.5,
    })
  }

  const begin = () => {
    if (leaving) return
    setLeaving(true)

    const el = ref.current
    if (el) {
      el.classList.add('leaving')
    }

    setTimeout(onBegin, 900)
  }

  return (
    <div
      ref={ref}
      className={`landing-screen ${loaded ? 'loaded' : ''}`}
      onMouseMove={onMove}
      onMouseLeave={() => !leaving && setMouse({ x: 0, y: 0 })}
    >
      {/* Emotional background */}
      <div className="bg-base">
        <div className="bg-light-field" />
        <div className="bg-depth" />
        <div className="bg-grain" />
      </div>

      {/* Breathing atmosphere */}
      <div
        className="atmosphere"
        style={{
          transform: `translate3d(${mouse.x * 14}px, ${mouse.y * 14}px,0)`,
        }}
      />

      {/* Content */}
      <div className="landing-content">
        <h1
          className="headline"
          style={{
            transform: `translate3d(${mouse.x * -4}px, ${mouse.y * -4}px,0)`,
          }}
        >
          Some thoughts are loud.
          <br />
          <span>Some meanings live between the lines.</span>
        </h1>

        <p className="subtitle">
          A quiet space that listens first —
          <br />
          and responds in a voice you trust.
        </p>

        <button className="begin-button" onClick={begin} disabled={leaving}>
          <span>Begin</span>
        </button>
      </div>

      {/* Soft focus frame */}
      <div className="soft-frame" />
    </div>
  )
}

export default LandingScreen
