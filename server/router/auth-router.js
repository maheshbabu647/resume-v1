import express from 'express'
import rateLimit from 'express-rate-limit'
import passport from 'passport'


import {
  userSignUpValidators,
  userSignUpValidation,
  userSignInValidators,
  userSignInValidation,
  forgotPasswordValidator,
  resetPasswordValidator,
  resendVerificationValidator,
  verifyEmailCodeValidator,
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

import { createToken } from '../util/jwt.js'
import { createAuthCookie } from '../util/auth-cookie.js'

const authRouter = express.Router()
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

// [1] Signin brute-force protection
const signinLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 25,
  message: {
    status: 429,
    error: 'Too many sign-in attempts from this IP, please try again after 15 minutes.'
  }
})

// [2] Signup abuse prevention
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 25,
  message: {
    status: 429,
    error: 'Too many accounts created from this IP, please try again after an hour.'
  }
})


const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        status: 429,
        error: 'Too many requests. Please try again later.'
    }
})


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


authRouter.post('/verify-email', verifyEmailCodeValidator, verifyEmail);

authRouter.post('/resend-verification',
    resendVerificationValidator,
    userSignUpValidation, 
    resendVerificationLink
)

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

authRouter.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);


authRouter.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${CLIENT_ORIGIN}/login`, session: false }),
  async (req, res) => {

    try {
      const user = req.user;
      const authToken = await createToken({ userId: user._id, userRole: user.userRole });
      await createAuthCookie(res, authToken);

      res.redirect(`${CLIENT_ORIGIN}/home`); 
    } catch (error) {
      res.redirect(`${CLIENT_ORIGIN}/login?error=auth_failed`);
    }
  }
);


authRouter.get('/linkedin',
  passport.authenticate('linkedin', { scope: ['openid', 'profile', 'email'], session: false })
);

authRouter.get('/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: `${CLIENT_ORIGIN}/login`, session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      const authToken = await createToken({ userId: user._id, userRole: user.userRole });
      await createAuthCookie(res, authToken);
      res.redirect(`${CLIENT_ORIGIN}/home`); 
    } catch (error) {
      res.redirect(`${CLIENT_ORIGIN}/login?error=auth_failed`);
    }
  }
);

export default authRouter
