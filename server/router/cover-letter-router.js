import express from 'express'
import rateLimit from 'express-rate-limit'
import userAuthorization from '../middleware/user-authorization.js'
import {
  generateCoverLetter,
  saveCoverLetter,
  getAllCoverLetters,
  updateCoverLetter,
  deleteCoverLetter
} from '../controller/cover-letter-controller.js'
import {
  coverLetterValidatorsMode,
  coverLetterValidation
} from '../validators/cover-letter-validators.js'

const coverLetterRouter = express.Router()

// Rate limiter for AI generation to prevent abuse
const generationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    status: 429,
    error: 'Too many cover letter generation requests. Please try again later.'
  }
});

// Stricter rate limiter for saving/editing data
const mutationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30, 
    message: {
        status: 429,
        error: 'Too many requests to modify cover letters. Please try again later.'
    }
})

// --- Cover Letter Routes ---

// Generate a new cover letter (does not save)
coverLetterRouter.post(
  '/generate',
  userAuthorization,
  generationLimiter,
  coverLetterValidatorsMode('generate'),
  coverLetterValidation,
  generateCoverLetter
);

// Save a generated cover letter
coverLetterRouter.post(
    '/save',
    userAuthorization,
    mutationLimiter,
    coverLetterValidatorsMode('save'),
    coverLetterValidation,
    saveCoverLetter
)

// Get all of a user's saved cover letters
coverLetterRouter.get(
  '/get-all',
  userAuthorization,
  getAllCoverLetters
);

// Update a specific cover letter
coverLetterRouter.put(
  '/update/:coverLetterId',
  userAuthorization,
  mutationLimiter,
  coverLetterValidatorsMode('update'),
  coverLetterValidation,
  updateCoverLetter
);

// Delete a specific cover letter
coverLetterRouter.delete(
  '/delete/:coverLetterId',
  userAuthorization,
  mutationLimiter,
  coverLetterValidatorsMode('delete'),
  coverLetterValidation,
  deleteCoverLetter
);

export default coverLetterRouter;
