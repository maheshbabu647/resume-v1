import { Router } from 'express'
import * as articleController from '../../controllers/article/article.controller'
import { validate } from '../../middleware/validate'
import {
  articleSlugParamSchema,
  articleIdParamSchema,
  listArticlesQuerySchema,
  createArticleSchema,
  updateArticleSchema,
} from '../../schemas/article.schema'

const router = Router()

router.get('/', validate('query', listArticlesQuerySchema), articleController.listPublished)
router.get('/:slug', validate('params', articleSlugParamSchema), articleController.getPublishedBySlug)

export default router
