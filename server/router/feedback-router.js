import express from 'express'
import { createFeedback } from '../controller/feedback-controller.js'

const feedbackRouter = express.Router()

// Allow both authenticated and anonymous feedback
feedbackRouter.post('/', createFeedback)

export default feedbackRouter


