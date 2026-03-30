import { Router } from 'express'
import * as exportController from '../../controllers/resume/export.controller'
import { validate }           from '../../middleware/validate'
import { quotaGuard }         from '../../middleware/quotaGuard'
import { pdfSchema, uploadSchema } from '../../schemas/export.schema'

const router = Router()
// authenticate applied in routers/index.ts
router.post('/pdf',    quotaGuard('pdfDownloads'), validate('body', pdfSchema),    exportController.generatePDF)
router.post('/upload', validate('body', uploadSchema), exportController.uploadPDF)

export default router
