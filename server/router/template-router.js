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

// [1] GET limiter
const fetchTemplatesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    status: 429,
    error: 'Too many template fetch requests. Please try again later.'
  }
})

// [2] Mutation limiter (optional but good for defense)
const mutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    status: 429,
    error: 'Too many template changes. Please try again later.'
  }
})

// [3] Public GET (rate-limited)
templateRouter.get('/getAll', fetchTemplatesLimiter, getAllTemplates)
templateRouter.get('/:templateId', fetchTemplatesLimiter, templateValidatorsMode('getById'), templateValidation, getTemplateById)

// [4] Admin mutations (rate-limited)
adminTemplateRouter.post('/add', userAuthorization, isAdmin, mutationLimiter, upload.single('templateImageFile'), templateValidatorsMode('create'), templateValidation, createTemplate)
adminTemplateRouter.put('/update/:templateId', userAuthorization, isAdmin, mutationLimiter, templateValidatorsMode('update'), templateValidation, updateTemplate)
adminTemplateRouter.delete('/delete/:templateId', userAuthorization, isAdmin, mutationLimiter, templateValidatorsMode('delete'), templateValidation, deleteTemplate)

export{ templateRouter, adminTemplateRouter }
