// import express from 'express'
// import rateLimit from 'express-rate-limit'

// import {
//   getAllTemplates,
//   createTemplate,
//   updateTemplate,
//   deleteTemplate,
//   getTemplateById,
// } from '../controller/template-controller.js'
// import userAuthorization from '../middleware/user-authorization.js'
// import { isAdmin } from '../middleware/admin-auth-middleware.js'
// import { templateValidatorsMode, templateValidation } from '../validators/template-validators.js'
// import upload from '../middleware/upload-middleware.js'

// const templateRouter = express.Router()
// const adminTemplateRouter = express.Router()

// // [1] GET limiter
// const fetchTemplatesLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 50,
//   message: {
//     status: 429,
//     error: 'Too many template fetch requests. Please try again later.'
//   }
// })

// // [2] Mutation limiter (optional but good for defense)
// const mutationLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 20,
//   message: {
//     status: 429,
//     error: 'Too many template changes. Please try again later.'
//   }
// })

// // [3] Public GET (rate-limited)
// templateRouter.get('/getAll', fetchTemplatesLimiter, getAllTemplates)
// templateRouter.get('/:templateId', fetchTemplatesLimiter, templateValidatorsMode('getById'), templateValidation, getTemplateById)

// // [4] Admin mutations (rate-limited)
// adminTemplateRouter.post('/add', userAuthorization, isAdmin, mutationLimiter, upload.single('templateImageFile'), templateValidatorsMode('create'), templateValidation, createTemplate)
// adminTemplateRouter.put('/update/:templateId', userAuthorization, isAdmin, mutationLimiter, upload.any(), templateValidatorsMode('update'), templateValidation, updateTemplate)
// adminTemplateRouter.delete('/delete/:templateId', userAuthorization, isAdmin, mutationLimiter, templateValidatorsMode('delete'), templateValidation, deleteTemplate)

// export{ templateRouter, adminTemplateRouter }

import express from 'express'
import rateLimit from 'express-rate-limit'

import {
  getAllTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getTemplateById,
} from '../controller/template-controller.js'
import userAuthorization from '../middleware/user-authorization.js'
import { isAdmin } from '../middleware/admin-auth-middleware.js'
import { templateValidatorsMode, templateValidation } from '../validators/template-validators.js'
import upload from '../middleware/upload-middleware.js'

const templateRouter = express.Router()
const adminTemplateRouter = express.Router()

// Rate limiter for fetching templates
const fetchTemplatesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    status: 429,
    error: 'Too many template fetch requests. Please try again later.'
  }
})

// Rate limiter for creating/updating/deleting templates
const mutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    status: 429,
    error: 'Too many template changes. Please try again later.'
  }
})

// Public routes for fetching templates
templateRouter.get('/getAll', fetchTemplatesLimiter, getAllTemplates)
templateRouter.get('/:templateId', fetchTemplatesLimiter, templateValidatorsMode('getById'), templateValidation, getTemplateById)

// Admin routes for managing templates
adminTemplateRouter.post('/add', userAuthorization, isAdmin, mutationLimiter, upload.single('templateImageFile'), templateValidatorsMode('create'), templateValidation, createTemplate)

// --- FIX: Changed upload.any() to upload.single('templateImageFile') ---
// This ensures that if a file is uploaded during an update, it will be available at `req.file` in the controller.
adminTemplateRouter.put('/update/:templateId', userAuthorization, isAdmin, mutationLimiter, upload.single('templateImageFile'), templateValidatorsMode('update'), templateValidation, updateTemplate)

adminTemplateRouter.delete('/delete/:templateId', userAuthorization, isAdmin, mutationLimiter, templateValidatorsMode('delete'), templateValidation, deleteTemplate)

export { templateRouter, adminTemplateRouter }