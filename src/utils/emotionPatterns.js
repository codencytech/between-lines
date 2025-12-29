/**
 * Common emotional patterns for better understanding
 */
export const emotionPatterns = {
  fatigue: {
    keywords: ['tired', 'exhausted', 'burnout', 'drained', 'weary'],
    response: 'emotional fatigue with sustained effort',
    comfort: 'acknowledge the exhaustion without demanding rest'
  },
  uncertainty: {
    keywords: ['lost', 'confused', 'direction', 'purpose', 'what next'],
    response: 'direction uncertainty in a transitional phase',
    comfort: 'validate the uncertainty as part of growth'
  },
  overwhelm: {
    keywords: ['overwhelmed', 'too much', 'can\'t handle', 'drowning'],
    response: 'sensory and emotional overwhelm',
    comfort: 'ground in the present moment without solutions'
  },
  loneliness: {
    keywords: ['alone', 'isolated', 'misunderstood', 'no one gets it'],
    response: 'existential loneliness despite connections',
    comfort: 'acknowledge the loneliness without fixing it'
  },
  grief: {
    keywords: ['loss', 'miss', 'gone', 'used to be', 'memory'],
    response: 'grief for what was or could have been',
    comfort: 'honor the grief without rushing through it'
  }
}

/**
 * Detect emotional patterns in user input
 */
export const detectEmotionalPatterns = (text) => {
  const lowerText = text.toLowerCase()
  const patterns = []
  
  Object.entries(emotionPatterns).forEach(([pattern, data]) => {
    if (data.keywords.some(keyword => lowerText.includes(keyword))) {
      patterns.push(pattern)
    }
  })
  
  return patterns.length > 0 ? patterns : ['general', 'unspoken']
}