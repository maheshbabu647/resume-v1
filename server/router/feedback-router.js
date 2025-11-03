import express from 'express'
import { createFeedback } from '../controller/feedback-controller.js'
import { optionalAuth } from '../middleware/tiered-rate-limit.js'

const feedbackRouter = express.Router()

// Allow both authenticated and anonymous feedback
// optionalAuth extracts user info if available, but doesn't fail if not present
feedbackRouter.post('/', optionalAuth, createFeedback)

export default feedbackRouter


