import { z } from 'zod'
import { ARTICLE } from '../config/constants'

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const createArticleSchema = z.object({
  slug: z.string().min(3).max(ARTICLE.SLUG_MAX_LENGTH).regex(slugRegex, 'Slug must be lowercase kebab-case'),
  title: z.string().min(3).max(ARTICLE.TITLE_MAX_LENGTH).trim(),
  shortTitle: z.string().min(3).max(ARTICLE.TITLE_MAX_LENGTH).trim(),
  excerpt: z.string().min(10).max(ARTICLE.EXCERPT_MAX_LENGTH).trim(),
  content: z.string().min(1),
  contentFormat: z.enum(['markdown', 'html']).default('markdown'),
  metaDescription: z.string().min(10).max(ARTICLE.META_DESCRIPTION_MAX_LENGTH).trim(),
  ogImage: z.string().min(1).optional(),
  coverImage: z.string().min(1).optional(),
  readingTime: z.number().int().min(1).optional(),
  tags: z.array(z.string().min(1).max(ARTICLE.TAG_MAX_LENGTH)).max(ARTICLE.MAX_TAGS).default([]),
  series: z.string().max(120).optional(),
  seriesDay: z.number().int().min(1).optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  publishedAt: z.coerce.date().optional(),
})

export const updateArticleSchema = createArticleSchema.partial().refine(
  (d) => Object.keys(d).length > 0,
  { message: 'At least one field must be provided.' }
)

export const articleSlugParamSchema = z.object({
  slug: z.string().min(1),
})

export const articleIdParamSchema = z.object({
  id: z.string().min(1),
})

export const listArticlesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  tag: z.string().optional(),
  series: z.string().optional(),
})

export type CreateArticleBody = z.infer<typeof createArticleSchema>
export type UpdateArticleBody = z.infer<typeof updateArticleSchema>
export type ListArticlesQuery = z.infer<typeof listArticlesQuerySchema>
