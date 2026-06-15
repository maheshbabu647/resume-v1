import { Router } from 'express'
import * as articleController from '../../controllers/article/article.controller'
import { validate } from '../../middleware/validate'
import {
  articleIdParamSchema,
  listArticlesQuerySchema,
  createArticleSchema,
  updateArticleSchema,
} from '../../schemas/article.schema'

const router = Router()

router.get('/', validate('query', listArticlesQuerySchema), articleController.listAdmin)
router.post('/', validate('body', createArticleSchema), articleController.create)
router.get('/:id', validate('params', articleIdParamSchema), articleController.getAdminById)
router.patch('/:id', validate('params', articleIdParamSchema), validate('body', updateArticleSchema), articleController.update)
router.post('/:id/publish', validate('params', articleIdParamSchema), articleController.publish)
router.post('/:id/archive', validate('params', articleIdParamSchema), articleController.archive)
router.delete('/:id', validate('params', articleIdParamSchema), articleController.remove)

export default router
