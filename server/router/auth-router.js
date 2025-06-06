import express from 'express'
import rateLimit from 'express-rate-limit'

import {
  userSignUpValidators,
  userSignUpValidation,
  userSignInValidators,
  userSignInValidation,
  forgotPasswordValidator,
  resetPasswordValidator,
  resendVerificationValidator
} from '../validators/auth-validators.js'

import userAuthorization from '../middleware/user-authorization.js'
import { 
    userSignUp, 
    userSignIn, 
    userSignout, 
    authStatus,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationLink
} from '../controller/auth-controller.js'

const authRouter = express.Router()

// [1] Signin brute-force protection
const signinLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  message: {
    status: 429,
    error: 'Too many sign-in attempts from this IP, please try again after 15 minutes.'
  }
})

// [2] Signup abuse prevention
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    status: 429,
    error: 'Too many accounts created from this IP, please try again after an hour.'
  }
})

// [3] Password Reset and Verification Resend limiter
const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        status: 429,
        error: 'Too many requests. Please try again later.'
    }
})


// [4] Auth routes, with security-first ordering
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

// The user clicks the link in their email, which takes them to a frontend page.
// That frontend page then makes this API call.
authRouter.post('/verify-email/:token', verifyEmail);

// [NEW] Resend Verification Link Route
authRouter.post('/resend-verification',
    emailLimiter,
    resendVerificationValidator,
    userSignUpValidation, // Can reuse the same validation result handler
    resendVerificationLink
)

// [NEW] Password Reset Routes
authRouter.post('/forgot-password',
  emailLimiter,
  forgotPasswordValidator,
  userSignInValidation,
  forgotPassword
)

authRouter.put('/reset-password/:token',
  emailLimiter,
  resetPasswordValidator,
  userSignUpValidation,
  resetPassword
)


export default authRouter
