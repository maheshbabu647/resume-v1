import express from 'express'

import authRouter from './auth-router.js'
import templateRouter from './template-router.js'
import resumeRouter from './resume-router.js'
import adminAnalyticsRouter from './admin-analytics-router.js'

const indexRouter = express.Router()

indexRouter.use('/auth', authRouter)
indexRouter.use('/template', templateRouter)
indexRouter.use('/resume', resumeRouter)
indexRouter.use('/admin/analytics', adminAnalyticsRouter)
indexRouter.get('/', (req, res) => {
  res.json({ status: "OK", message: "API root. All systems operational." })
})

export default indexRouter
