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
  generateResumeSummary,
  enhanceResumeField,
} from '../controller/resume-controller.js'
import { resumeValidatorsMode, resumeValidation } from '../validators/resume-validators.js'

import vertex_ai from '../config/cloudai-config.js'

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
  max: 20,
  message: {
    status: 429,
    error: 'Too many downloads. Please slow down and try again later.'
  }
})

// [4] Mutations limiter (add, update, delete)
const resumeMutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: {
    status: 429,
    error: 'Too many changes to resumes. Please slow down and try again later.'
  }
})

// [5] AI Summary generation limiter
const summaryLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 5,
  message: {
    status: 429,
    error: 'Too many summary generation requests. Please try again later.'
  }
})


// [6] AI Field Enhancement limiter
const enhanceLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // A bit more generous than summary, for enhancing multiple fields
  message: {
    status: 429,
    error: 'Too many field enhancement requests. Please try again later.'
  }
});

// [7] Routes (defense-in-depth: Auth → RateLimit → Validate → Handler)
resumeRouter.post('/add',
  userAuthorization,
  resumeMutationLimiter,
  resumeValidatorsMode('create'),
  resumeValidation,
  createResume
)
resumeRouter.get('/getById/:resumeId',
  userAuthorization,
  // fetchResumeByIdLimiter,
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

resumeRouter.post('/download',
  userAuthorization,
  downloadLimiter,
  resumeValidatorsMode('download'),
  resumeValidation,
  downlaodResume
)

resumeRouter.post(
  '/generate-summary',
  userAuthorization,
  summaryLimiter,
  resumeValidatorsMode('generateSummary'),
  resumeValidation,
  generateResumeSummary
)

resumeRouter.post(
  '/ai/enhance-field',
  userAuthorization,
  enhanceLimiter,
  // resumeValidatorsMode('enhanceField'), 
  // resumeValidation,
  enhanceResumeField
);


resumeRouter.get('/field', async(req, res)=>{
    
  const model = vertex_ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Generate 5 professional and impactful resume bullet points for a Ml Engineer. Focus on achievements, use action verbs, and include quantifiable metrics where possible.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.candidates[0].content.parts[0].text;
    console.log(responseText)
    res.json({ bulletPoints: responseText });
  })

export default resumeRouter
