import { Router } from 'express'
import * as resumeController from '../../controllers/resume/resume.controller'
import { validate }           from '../../middleware/validate'
import { apiRateLimiter }     from '../../middleware/rateLimiter'
import { createResumeSchema, updateResumeSchema, resumeListQuerySchema, resumeParamSchema } from '../../schemas/resume.schema'

const router = Router()
router.use(apiRateLimiter)

router.get(    '/',              validate('query',  resumeListQuerySchema), resumeController.list)
router.post(   '/',              validate('body',   createResumeSchema),    resumeController.create)
router.get(    '/:id',           validate('params', resumeParamSchema),     resumeController.getOne)
router.patch(  '/:id',           validate('params', resumeParamSchema),
                                 validate('body',   updateResumeSchema),    resumeController.update)
router.delete( '/:id',           validate('params', resumeParamSchema),     resumeController.remove)
router.post(   '/:id/duplicate', validate('params', resumeParamSchema),     resumeController.duplicate)

export default router
