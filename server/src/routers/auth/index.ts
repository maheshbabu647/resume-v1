import { Router } from 'express'
import * as authController from '../../controllers/auth/auth.controller'
import { validate }         from '../../middleware/validate'
import { authRateLimiter }  from '../../middleware/rateLimiter'
import { authenticate }     from '../../middleware/authenticate'
import { registerSchema, loginSchema, verifyEmailSchema, resendOtpSchema, forgotPasswordSchema, resetPasswordSchema } from '../../schemas/auth.schema'

const router = Router()
router.use(authRateLimiter)

router.post('/register',         validate('body', registerSchema),       authController.register)
router.post('/login',            validate('body', loginSchema),          authController.login)
router.post('/verify-email',     validate('body', verifyEmailSchema),    authController.verifyEmail)
router.post('/resend-otp',       validate('body', resendOtpSchema),      authController.resendOtp)
router.post('/forgot-password',  validate('body', forgotPasswordSchema), authController.forgotPassword)
router.post('/reset-password',   validate('body', resetPasswordSchema),  authController.resetPassword)
router.post('/refresh',                                                  authController.refresh)
router.post('/logout',                                                   authController.logout)
router.get('/me',                authenticate,                           authController.getMe)
router.get('/google',                                                    authController.googleRedirect)
router.get('/google/callback',                                           authController.googleCallback)

export default router
