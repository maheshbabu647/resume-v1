import { Router } from 'express'
import { authenticate } from '../middleware/authenticate'
import { planGuard }    from '../middleware/planGuard'
import { quotaGuard }   from '../middleware/quotaGuard'
import { aiRateLimiter } from '../middleware/rateLimiter'

import authRouter    from './auth/index'
import userRouter    from './user/index'
import webhookRouter from './webhook/index'
import paymentRouter from './payment/payment.router'

import resumeRouter from './resume/resume.router'
import aiRouter     from './resume/ai.router'
import exportRouter from './resume/export.router'

// Import parse-resume controller directly for free-tier access
import { uploadMiddleware, parseResume } from '../controllers/resume/ai.controller'

// ─── Root API Router ──────────────────────────────────────────────────────────
// Mounted at /v1 in app.ts

const router = Router()

router.use('/auth',     authRouter)
router.use('/webhooks', webhookRouter)
router.use('/user',     authenticate, userRouter)

// ─── Payment ──────────────────────────────────────────────────────────────────
router.use('/payment',  authenticate, paymentRouter)

// ─── Resumes ──────────────────────────────────────────────────────────────────
router.use('/resumes',  authenticate, resumeRouter)

// ─── AI features ─────────────────────────────────────────────────────────────
// Parse resume — free for all authenticated users (onboarding feature)
router.post('/ai/parse-resume', authenticate, aiRateLimiter, uploadMiddleware, parseResume)

// AI suggest — quota gated (aiBullets: 5/25/∞ per month)
// AI JD score  — quota gated (jdScore: 3/20/∞ per month)
// AI JD tailor — quota gated (jdTailoring: 2/12/∞ per month)
// These are applied inside ai.router per-route for fine-grained control
router.use('/ai',       authenticate, aiRouter)

// ─── Export/Download ──────────────────────────────────────────────────────────
// PDF download is quota gated (pdfDownloads: 2/10/∞ per month)
// quotaGuard is applied inside export.router
router.use('/export',   authenticate, exportRouter)

export default router
