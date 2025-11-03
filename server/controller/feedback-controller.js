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

/**
 * Get all feedback for admin dashboard
 * Supports pagination, filtering by action, and sorting
 */
export const getAllFeedback = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const action = req.query.action // Optional filter by action type
    const sortBy = req.query.sortBy || 'createdAt'
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1

    // Build query
    const query = {}
    if (action) {
      query.action = action
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Fetch feedback with pagination
    const [feedback, total] = await Promise.all([
      FeedbackModel.find(query)
        .populate('userId', 'userEmail userName userRole')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      FeedbackModel.countDocuments(query)
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)

    logger.info(`[Feedback][Admin][GetAll] Retrieved ${feedback.length} feedback entries (page ${page})`)

    res.status(200).json({
      success: true,
      feedback,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    logger.error(`[Feedback][Admin][GetAll][Error] ${error.message}`)
    const err = new Error('Failed to fetch feedback')
    err.status = 500
    next(err)
  }
}


