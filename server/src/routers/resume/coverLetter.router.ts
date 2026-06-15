import { Router } from 'express'
import * as coverLetterController from '../../controllers/resume/coverLetter.controller'
import { validate }       from '../../middleware/validate'
import { apiRateLimiter } from '../../middleware/rateLimiter'
import { createCoverLetterSchema, updateCoverLetterSchema, coverLetterListQuerySchema, coverLetterParamSchema } from '../../schemas/coverLetter.schema'

const router = Router()
router.use(apiRateLimiter)

router.get(    '/',    validate('query',  coverLetterListQuerySchema), coverLetterController.list)
router.post(   '/',    validate('body',   createCoverLetterSchema),    coverLetterController.create)
router.get(    '/:id', validate('params', coverLetterParamSchema),     coverLetterController.getOne)
router.patch(  '/:id', validate('params', coverLetterParamSchema),
                       validate('body',   updateCoverLetterSchema),    coverLetterController.update)
router.delete( '/:id', validate('params', coverLetterParamSchema),     coverLetterController.remove)

export default router
