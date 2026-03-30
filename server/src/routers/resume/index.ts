import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate'

import resumeRouter from './resume.router'
import aiRouter     from './ai.router'
import exportRouter from './export.router'

// ─── Resume domain index ──────────────────────────────────────────────────────
// /v1/resumes  → resume CRUD
// /v1/ai       → AI features (quota-gated per plan in ai.router.ts)
// /v1/export   → PDF export (quota-gated in export.router.ts)

const router = Router()

router.use('/',       authenticate, resumeRouter)
router.use('/ai',     authenticate, aiRouter)
router.use('/export', authenticate, exportRouter)

export default router
