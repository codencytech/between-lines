import { useState } from 'react'
import LandingScreen from './screens/LandingScreen'
import InputScreen from './screens/InputScreen'
import SelectorScreen from './screens/SelectorScreen'
import ThinkingCloudScreen from './screens/ThinkingCloudScreen'
import NotificationScreen from './screens/NotificationScreen'
import MessageDisplayScreen from './screens/MessageDisplayScreen'
import { useScreenTransition } from './hooks/useScreenTransition'
import { generateAIResponse, formatAIResponse } from './utils/aiService'
import './styles/App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing')
  const [userInput, setUserInput] = useState('')
  const [selectedPerson, setSelectedPerson] = useState(null)

  // AI lifecycle states
  const [analysisResponse, setAnalysisResponse] = useState(null)
  const [finalMessage, setFinalMessage] = useState(null)
  const [quote, setQuote] = useState(null)

  const [isThinking, setIsThinking] = useState(false)

  const { isTransitioning, transition } = useScreenTransition()

  /* -------------------- NAVIGATION HANDLERS -------------------- */

  const handleBegin = () => {
    transition(() => setCurrentScreen('input'))
  }

  const handleInputSubmit = (text) => {
    setUserInput(text)
    transition(() => setCurrentScreen('selector'))
  }

  const handlePersonSelect = async (person) => {
    setSelectedPerson(person)

    transition(() => setCurrentScreen('thinking'))
    await generateAIFlow(userInput, person)
  }

  const handleNotificationClick = () => {
    transition(() => setCurrentScreen('message'))
  }

  const handleRestart = () => {
    transition(() => {
      setUserInput('')
      setSelectedPerson(null)
      setAnalysisResponse(null)
      setFinalMessage(null)
      setQuote(null)
      setIsThinking(false)
      setCurrentScreen('landing')
    })
  }

  /* -------------------- AI FLOW (CORE LOGIC) -------------------- */

  const generateAIFlow = async (text, person) => {
    setIsThinking(true)

    // Calm pacing before AI starts responding
    await new Promise((res) => setTimeout(res, 1800))

    try {
      const rawResponse = await generateAIResponse(text, person)
      const formatted = formatAIResponse(rawResponse)

      setAnalysisResponse(formatted.analysisSections)
      setFinalMessage(formatted.messageText)
      setQuote(formatted.quote)

      // Let analysis text + character animation finish
      await new Promise((res) => setTimeout(res, 1200))

      transition(() => setCurrentScreen('notification'))
    } catch (error) {
      console.error('AI generation failed:', error)

      // Graceful fallback (still calming & human)
      setAnalysisResponse([
        {
          title: 'What You Are Feeling',
          content:
            'You are emotionally exhausted, not broken. This comes from carrying responsibility longer than expected.',
        },
      ])

      setFinalMessage(
        `I know you feel alone right now.\n\nYou don’t need to have everything figured out.\n\nRest is not quitting.\n\nI’m here with you.`
      )

      setQuote('“Even the strongest hearts need quiet.”')

      transition(() => setCurrentScreen('notification'))
    } finally {
      setIsThinking(false)
    }
  }

  /* -------------------- SCREEN RENDER -------------------- */

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingScreen onBegin={handleBegin} />

      case 'input':
        return <InputScreen onSubmit={handleInputSubmit} />

      case 'selector':
        return <SelectorScreen onSelect={handlePersonSelect} />

      case 'thinking':
        return (
          <ThinkingCloudScreen
            isThinking={isThinking}
            selectedPerson={selectedPerson}
            analysisSections={analysisResponse}
          />
        )

      case 'notification':
        return (
          <NotificationScreen
            selectedPerson={selectedPerson}
            onClick={handleNotificationClick}
          />
        )

      case 'message':
        return (
          <MessageDisplayScreen
            selectedPerson={selectedPerson}
            message={finalMessage}
            quote={quote}
            onRestart={handleRestart}
          />
        )

      default:
        return <LandingScreen onBegin={handleBegin} />
    }
  }

  /* -------------------- ROOT -------------------- */

  return (
    <div className="app">
      <div
        className={`screen-container ${
          isTransitioning ? 'fade-out' : 'fade-in'
        }`}
      >
        {renderScreen()}
      </div>
    </div>
  )
}

export default App
