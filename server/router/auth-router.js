import express from 'express'
import rateLimit from 'express-rate-limit'

import {
  userSignUpValidators,
  userSignUpValidation,
  userSignInValidators,
  userSignInValidation
} from '../validators/auth-validators.js'

import userAuthorization from '../middleware/user-authorization.js'
import { userSignUp, userSignIn, userSignout, authStatus } from '../controller/auth-controller.js'

const authRouter = express.Router()

// [1] Signin brute-force protection: per-IP rate limiting
const signinLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // 5 attempts per IP
  message: {
    status: 429,
    error: 'Too many signin attempts. Please try again in 5 minutes.'
  }
})

// [2] Signup abuse prevention: per-IP rate limiting
const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 signups per IP per window
  message: {
    status: 429,
    error: 'Too many signup attempts. Please try again later.'
  }
})

// [3] Auth routes, with security-first ordering
authRouter.post('/signup',
  signupLimiter,
  userSignUpValidators,
  userSignUpValidation,
  userSignUp
)
authRouter.post('/signin',
  signinLimiter,
  userSignInValidators,
  userSignInValidation,
  userSignIn
)
authRouter.post('/signout',
  userAuthorization,
  userSignout
)
authRouter.get('/status',
  userAuthorization,
  authStatus
)

export default authRouter
