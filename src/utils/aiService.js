import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

// Person-specific tone mappings
const personTones = {
  father: {
    tone: "steady, protective, proud, slightly reserved but deeply caring",
    perspective: "speaks from experience and wisdom, values responsibility and quiet strength",
    examples: [
      "I can see you're carrying more than you show.",
      "You don't have to have all the answers right now.",
      "I'm proud of you just for being honest with yourself."
    ]
  },
  mother: {
    tone: "nurturing, understanding, gentle, unconditionally supportive",
    perspective: "speaks from the heart, values emotional honesty and self-care",
    examples: [
      "I can hear the tiredness in your words, even if you're trying to hide it.",
      "Your feelings are valid, no matter how heavy they feel.",
      "Rest isn't giving up—it's gathering strength."
    ]
  },
  friend: {
    tone: "authentic, relatable, honest, with shared history",
    perspective: "speaks as an equal who knows you beyond the surface",
    examples: [
      "I know that voice in your head isn't really you.",
      "Remember when we used to just be, without pressure?",
      "You don't have to perform right now—just be."
    ]
  },
  lost: {
    tone: "peaceful, gentle, from memory but present",
    perspective: "speaks with the wisdom of absence and eternal connection",
    examples: [
      "From where I am, I see how hard you're trying.",
      "The love we shared doesn't disappear—it transforms.",
      "Carry me in your heart, not as a burden, but as peace."
    ]
  },
  drifted: {
    tone: "reflective, understanding, without blame",
    perspective: "speaks with the tenderness of what was and what could be",
    examples: [
      "Distance doesn't erase what we shared.",
      "Sometimes people drift, but that doesn't invalidate the connection.",
      "You're allowed to miss what was, even as you move forward."
    ]
  }
}

/**
 * Generate emotional understanding and comforting message
 */
export const generateAIResponse = async (userInput, personType) => {
  try {
    const person = personTones[personType.id] || personTones.father
    
    const systemPrompt = `You are an emotionally intelligent assistant creating a therapeutic experience.
    
USER'S EMOTIONAL STATE:
${userInput}

PERSONA: ${personType.title} (${person.tone})
PERSPECTIVE: ${person.perspective}

INSTRUCTIONS:
1. ANALYZE the emotional state. Don't label diagnoses, just describe the feeling.
2. GENERATE 4 sections:
   - Emotional Signal: What they're experiencing (2-3 sentences)
   - Why It Makes Sense: Contextualize without judgment (2-3 sentences)
   - What It Is Not: Gently correct any self-criticism (2-3 bullet points)
   - Comforting Message: As the ${personType.title}, speak directly to them (4-5 sentences)
3. TONE: ${person.tone}
4. STYLE: Use "I" statements. Be present. No advice. No solutions. Just understanding.
5. FORMAT: Return ONLY valid JSON with these keys: emotionalSignal, whyItMakesSense, whatItIsNot, comfortingMessage

EXAMPLE RESPONSE FORMAT:
{
  "emotionalSignal": "You are experiencing emotional fatigue mixed with direction uncertainty.",
  "whyItMakesSense": "This comes from sustained effort without emotional rest, not from lack of ability or motivation.",
  "whatItIsNot": "This is not laziness.\\nThis is not failure.",
  "comfortingMessage": "I can hear how tired you are, even if you don't say it.\\n\\nYou've been carrying responsibility quietly, and that kind of weight doesn't show on the outside.\\n\\nYou don't need to be ahead of anyone.\\n\\nTaking a pause doesn't mean you're falling behind."
}`

    // For development: Return mock response if no API key
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      console.warn('No API key found, using mock response')
      return generateMockResponse(personType)
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(systemPrompt)
    const response = await result.response
    const text = response.text()
    
    // Clean and parse JSON
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim()
    
    try {
      const parsed = JSON.parse(cleanText)
      return {
        ...parsed,
        sections: [
          { title: "The Signal", content: parsed.emotionalSignal },
          { title: "Why This Makes Sense", content: parsed.whyItMakesSense },
          { title: "What This Is Not", content: parsed.whatItIsNot }
        ]
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      // Fallback to structured response from text
      return parseUnstructuredResponse(text, personType)
    }
    
  } catch (error) {
    console.error('AI generation failed:', error)
    return generateMockResponse(personType)
  }
}

/**
 * Fallback parser for unstructured AI responses
 */
const parseUnstructuredResponse = (text, personType) => {
  const lines = text.split('\n').filter(line => line.trim())
  
  // Extract sections using heuristics
  const emotionalSignal = lines.find(line => 
    line.toLowerCase().includes('experiencing') || 
    line.toLowerCase().includes('feeling')
  ) || "I sense a heaviness in your words, a need to be understood without having to explain."
  
  const whyItMakesSense = lines.find(line => 
    line.toLowerCase().includes('makes sense') || 
    line.toLowerCase().includes('understandable')
  ) || "What you're feeling comes from real experiences, not from any flaw in your character."
  
  const whatItIsNot = lines.find(line => 
    line.toLowerCase().includes('not') || 
    line.toLowerCase().includes('isn\'t')
  ) || "This is not weakness. This is not something you need to fix immediately."
  
  const comfortingMessage = lines.slice(-4).join('\n\n') || 
    `I hear you, even in the silence between your words.\n\nYou don't have to carry everything alone.\n\nWhat you're feeling matters, and so do you.`

  return {
    emotionalSignal,
    whyItMakesSense,
    whatItIsNot,
    comfortingMessage,
    sections: [
      { title: "The Signal", content: emotionalSignal },
      { title: "Why This Makes Sense", content: whyItMakesSense },
      { title: "What This Is Not", content: whatItIsNot }
    ]
  }
}

/**
 * Generate mock response for development
 */
const generateMockResponse = (personType) => {
  const person = personTones[personType.id] || personTones.father
  
  const responses = {
    emotionalSignal: "You are experiencing emotional fatigue mixed with direction uncertainty—a sense of carrying weight without knowing exactly where to set it down.",
    whyItMakesSense: "This makes sense because sustained effort without emotional rest naturally leads to this kind of weariness. You've been showing up consistently, and that takes energy whether you see it or not.",
    whatItIsNot: "This is not laziness.\nThis is not failure.\nThis is not a sign you can't handle your life.",
    comfortingMessage: `I can hear how tired you are, even if you don't say it.\n\nYou've been carrying responsibility quietly, and that kind of weight doesn't show on the outside.\n\nYou don't need to be ahead of anyone.\n\nTaking a pause doesn't mean you're falling behind.\n\nI'm proud of you for staying honest with yourself.`
  }

  return {
    ...responses,
    sections: [
      { title: "The Signal", content: responses.emotionalSignal },
      { title: "Why This Makes Sense", content: responses.whyItMakesSense },
      { title: "What This Is Not", content: responses.whatItIsNot }
    ]
  }
}

/**
 * Format the AI response into displayable sections
 */
export const formatAIResponse = (response) => {
  if (!response) return { sections: [], comfortingMessage: '' }
  
  return {
    sections: response.sections || [],
    comfortingMessage: response.comfortingMessage || '',
    raw: response
  }
}