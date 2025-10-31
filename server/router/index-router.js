import express from 'express'

import authRouter from './auth-router.js'
import { templateRouter, adminTemplateRouter } from './template-router.js'
import resumeRouter from './resume-router.js'
import coverLetterRouter from './cover-letter-router.js'
import adminAnalyticsRouter from './admin-analytics-router.js'
import chatRouter from './chat-router.js'
import textExtractionRouter from './text-extraction-router.js'
import atsScoreRouter from './ats-score-router.js'
import resumeParserRouter from './resume-parser-router.js'
import aiUsageRouter from './ai-usage-router.js'
import feedbackRouter from './feedback-router.js'


const indexRouter = express.Router()

indexRouter.use('/auth', authRouter)
indexRouter.use('/template', templateRouter)
indexRouter.use('/resume', resumeRouter)
indexRouter.use('/cover-letter', coverLetterRouter)
indexRouter.use('/admin/template', adminTemplateRouter)
indexRouter.use('/admin/analytics', adminAnalyticsRouter)
indexRouter.use('/admin/ai-usage', aiUsageRouter)
indexRouter.use('/chat', chatRouter)
indexRouter.use('/text-extraction', textExtractionRouter)
indexRouter.use('/ats-score', atsScoreRouter)
indexRouter.use('/resume-parser', resumeParserRouter)
indexRouter.use('/feedback', feedbackRouter)
indexRouter.get('/', (req, res) => {
  res.json({ status: "OK", message: "API root. All systems operational." })
})

export default indexRouter
