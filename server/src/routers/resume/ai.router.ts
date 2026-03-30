import { Router } from 'express'
import * as aiController from '../../controllers/resume/ai.controller'
import { validate }       from '../../middleware/validate'
import { aiRateLimiter }  from '../../middleware/rateLimiter'
import { quotaGuard }     from '../../middleware/quotaGuard'
import { jdTailorSchema, suggestSchema, analyzeJdSchema, tailorNewSchema, coverLetterSchema } from '../../schemas/ai.schema'

const router = Router()
router.use(aiRateLimiter)

// Each route is quota-gated per the plan limits in constants.ts
router.post('/jd-tailor',                    quotaGuard('jdTailoring'), validate('body', jdTailorSchema),  aiController.jdTailor)
router.post('/tailor-new',                   quotaGuard('jdTailoring'), validate('body', tailorNewSchema), aiController.tailorNew)
router.post('/analyze-jd',                   quotaGuard('jdScore'),     validate('body', analyzeJdSchema), aiController.analyzeJDMatch)
router.post('/cover-letter',                 quotaGuard('coverLetter'), validate('body', coverLetterSchema), aiController.generateCoverLetter)
router.post('/suggest',                      quotaGuard('aiBullets'),   validate('body', suggestSchema),   aiController.suggest)
router.get( '/jd-history/:resumeId',                                                                       aiController.getHistory)
router.post('/jd-history/:historyId/revert',                                                               aiController.revert)

// Parse resume — available to all authenticated users (no quota)
router.post('/parse-resume', aiController.uploadMiddleware, aiController.parseResume)
router.post('/extract-text', aiController.uploadMiddleware, aiController.extractText)

export default router
