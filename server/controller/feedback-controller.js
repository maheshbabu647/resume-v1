import FeedbackModel from '../model/feedback-model.js'
import logger from '../config/logger.js'

export const createFeedback = async (req, res, next) => {
  try {
    const userId = req.user?.userId || null
    const { action, rating, comments, pageUrl, meta } = req.body || {}

    if (!action) {
      const err = new Error('action is required')
      err.status = 400
      return next(err)
    }

    const doc = await FeedbackModel.create({ userId, action, rating, comments, pageUrl, meta })
    logger.info(`[Feedback][Create] action=${action} user=${userId || 'anon'} rating=${rating || 'n/a'}`)
    res.status(201).json({ status: 201, feedbackId: doc._id })
  } catch (error) {
    logger.error(`[Feedback][Error] ${error.message}`)
    const err = new Error('Failed to save feedback')
    err.status = 500
    next(err)
  }
}


