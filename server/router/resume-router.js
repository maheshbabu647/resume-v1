import express from 'express'
import rateLimit from 'express-rate-limit'

import userAuthorization from '../middleware/user-authorization.js'
import {
  createResume,
  deleteResume,
  downlaodResume,
  getAllResumes,
  getResumeById,
  updateResume,
  generateResumeSummary // <-- [NEW] AI summary generation controller
} from '../controller/resume-controller.js'
import { resumeValidatorsMode, resumeValidation } from '../validators/resume-validators.js'

const resumeRouter = express.Router()

// [1] GET (all user's resumes) limiter
const fetchResumesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    status: 429,
    error: 'Too many resume fetch requests. Please try again later.'
  }
})

// [2] GET (specific resume) limiter
const fetchResumeByIdLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    status: 429,
    error: 'Too many resume fetch requests. Please try again later.'
  }
})

// [3] Download (heavy) limiter
const downloadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    status: 429,
    error: 'Too many downloads. Please slow down and try again later.'
  }
})

// [4] Mutations limiter (add, update, delete)
const resumeMutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    status: 429,
    error: 'Too many changes to resumes. Please slow down and try again later.'
  }
})

// [NEW] AI Summary generation limiter
const summaryLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 5,
  message: {
    status: 429,
    error: 'Too many summary generation requests. Please try again later.'
  }
})

// [5] Routes (defense-in-depth: Auth → RateLimit → Validate → Handler)
resumeRouter.post('/add',
  userAuthorization,
  resumeMutationLimiter,
  resumeValidatorsMode('create'),
  resumeValidation,
  createResume
)
resumeRouter.get('/getById/:resumeId',
  userAuthorization,
  fetchResumeByIdLimiter,
  resumeValidatorsMode('getById'),
  resumeValidation,
  getResumeById
)
resumeRouter.put('/update/:resumeId',
  userAuthorization,
  resumeMutationLimiter,
  resumeValidatorsMode('update'),
  resumeValidation,
  updateResume
)
resumeRouter.get('/getAll',
  userAuthorization,
  fetchResumesLimiter,
  resumeValidatorsMode('getAll'),
  resumeValidation,
  getAllResumes
)
resumeRouter.delete('/delete/:resumeId',
  userAuthorization,
  resumeMutationLimiter,
  resumeValidatorsMode('delete'),
  resumeValidation,
  deleteResume
)
// [PRO LEVEL] Always require auth for download, and validate input!
resumeRouter.post('/download',
  userAuthorization,         // [ADDED]
  downloadLimiter,
  resumeValidatorsMode('download'), // [OPTIONAL: if you want to validate download body]
  resumeValidation,                // [OPTIONAL: if above]
  downlaodResume
)

// [NEW] Resume Summary Generation via Gemini AI
resumeRouter.post(
  '/generate-summary',
  userAuthorization,
  summaryLimiter,
  // resumeValidatorsMode('generateSummary'),
  resumeValidation,
  generateResumeSummary
)

export default resumeRouter
