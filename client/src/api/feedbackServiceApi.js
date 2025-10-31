import apiServer from './index.js'

export const submitFeedback = async ({ action, rating, comments, pageUrl, meta }) => {
  try {
    const res = await apiServer.post('/feedback', { action, rating, comments, pageUrl, meta })
    return res.data
  } catch (error) {
    console.error('Error submitting feedback:', error.response?.data || error.message)
    throw error.response?.data || { message: 'Failed to submit feedback.' }
  }
}


