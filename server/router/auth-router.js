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
  signupLimiter, // Re-enabled for security
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
authRouter.post('/verify-email', verifyEmailCodeValidator, verifyEmail);

// [NEW] Resend Verification Link Route
authRouter.post('/resend-verification',
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



authRouter.get('/google',
  (req, res, next) => {
    // Store redirect URL in session if provided
    if (req.query.redirect) {
      req.session.redirectUrl = req.query.redirect;
    }
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);


authRouter.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${CLIENT_ORIGIN}/login`, session: false }),
  async (req, res) => {

    try {
      const user = req.user;
      const authToken = await createToken({ userId: user._id, userRole: user.userRole });
      await createAuthCookie(res, authToken);

      // Check for redirect parameter in the original request
      const redirectUrl = req.session?.redirectUrl || req.query.redirect;
      let finalRedirectUrl;
      
      if (redirectUrl) {
        const decodedUrl = decodeURIComponent(redirectUrl);
        // If it's just a path, prepend the client origin
        if (decodedUrl.startsWith('/')) {
          finalRedirectUrl = `${CLIENT_ORIGIN}${decodedUrl}`;
        } else {
          finalRedirectUrl = decodedUrl;
        }
      } else {
        // Check if there's saved state in localStorage by redirecting to a special handler
        finalRedirectUrl = `${CLIENT_ORIGIN}/oauth-return`;
      }
      
      res.redirect(finalRedirectUrl); 
    } catch (error) {
      res.redirect(`${CLIENT_ORIGIN}/login?error=auth_failed`);
    }
  }
);


authRouter.get('/linkedin',
  passport.authenticate('linkedin', { session: false })
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
