import { Router } from 'express'
import * as aiController from '../../controllers/resume/ai.controller'
import { validate }       from '../../middleware/validate'
import { aiRateLimiter }  from '../../middleware/rateLimiter'
import { quotaGuard }     from '../../middleware/quotaGuard'
import { jdTailorSchema, suggestSchema, analyzeJdSchema, tailorNewSchema, tailorSmartSchema, coverLetterSchema, rewriteParagraphSchema, jdSpecSchema } from '../../schemas/ai.schema'

const router = Router()
router.use(aiRateLimiter)

// Each route is quota-gated per the plan limits in constants.ts
router.post('/jd-tailor',                    quotaGuard('jdTailoring'), validate('body', jdTailorSchema),  aiController.jdTailor)
router.post('/tailor-new',                   quotaGuard('jdTailoring'), validate('body', tailorNewSchema), aiController.tailorNew)
// Smart Tailor — full structured resume honoring the user's per-skill have/mention/omit buckets.
router.post('/tailor-smart',                 quotaGuard('jdTailoring'), validate('body', tailorSmartSchema), aiController.tailorSmart)
// /jd-spec is the single source of truth for ATS scoring: one LLM call extracts the
// weighted JD-Spec (cached per-JD); the deterministic client formula scores both the
// initial report and the live updates from it. Used by the ATS-Score&Tailor flow AND
// the editor's JD-fit panel.
router.post('/jd-spec',                      quotaGuard('jdScore'),     validate('body', jdSpecSchema),    aiController.extractJdSpec)
// @deprecated LLM computes the score here (a second, drift-prone extraction). Replaced by
// /jd-spec + client formula. Kept until the JD-fit UI migrates, then remove.
router.post('/analyze-jd',                   quotaGuard('jdScore'),     validate('body', analyzeJdSchema), aiController.analyzeJDMatch)
router.post('/cover-letter',                 quotaGuard('coverLetter'), validate('body', coverLetterSchema), aiController.generateCoverLetter)
router.post('/cover-letter/rewrite-paragraph', quotaGuard('aiBullets'), validate('body', rewriteParagraphSchema), aiController.rewriteCoverLetterParagraph)
router.post('/suggest',                      quotaGuard('aiBullets'),   validate('body', suggestSchema),   aiController.suggest)
router.get( '/jd-history/:resumeId',                                                                       aiController.getHistory)
router.post('/jd-history/:historyId/revert',                                                               aiController.revert)

// Parse resume — available to all authenticated users (no quota)
router.post('/parse-resume', aiController.uploadMiddleware, aiController.parseResume)
router.post('/extract-text', aiController.uploadMiddleware, aiController.extractText)

export default router
