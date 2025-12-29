/**
 * Validate user input before sending to AI
 */
export const validateUserInput = (input) => {
  if (!input || input.trim().length === 0) {
    return {
      valid: false,
      message: 'Please share something that\'s on your mind'
    }
  }
  
  if (input.trim().length < 10) {
    return {
      valid: false,
      message: 'Could you share a bit more? Even a few more words would help me understand better.'
    }
  }
  
  if (input.trim().length > 2000) {
    return {
      valid: false,
      message: 'That\'s quite a lot on your mind. Could you share the most present thoughts?'
    }
  }
  
  return { valid: true, message: '' }
}

/**
 * Sanitize AI response for safe display
 */
export const sanitizeAIResponse = (text) => {
  if (!text) return ''
  
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '') // Remove remaining angle brackets
    .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines
    .trim()
}