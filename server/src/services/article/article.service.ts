import { Types } from 'mongoose'
import { Article } from '../../models/Article.model'
import { AppError } from '../../lib/AppError'
import type { CreateArticleBody, UpdateArticleBody, ListArticlesQuery } from '../../schemas/article.schema'
import type { ArticleDetail, ArticleListItem, PaginatedArticles } from '../../types/article.types'

const toListItem = (doc: Record<string, unknown>): ArticleListItem => ({
  _id: String(doc._id),
  slug: doc.slug as string,
  title: doc.title as string,
  shortTitle: doc.shortTitle as string,
  excerpt: doc.excerpt as string,
  metaDescription: doc.metaDescription as string,
  ogImage: doc.ogImage as string | undefined,
  coverImage: doc.coverImage as string | undefined,
  status: doc.status as ArticleListItem['status'],
  publishedAt: doc.publishedAt as Date | undefined,
  readingTime: doc.readingTime as number | undefined,
  tags: (doc.tags as string[]) ?? [],
  series: doc.series as string | undefined,
  seriesDay: doc.seriesDay as number | undefined,
  authorId: String(doc.authorId),
  createdAt: doc.createdAt as Date,
  updatedAt: doc.updatedAt as Date,
})

const toDetail = (doc: Record<string, unknown>): ArticleDetail => ({
  ...toListItem(doc),
  content: doc.content as string,
  contentFormat: doc.contentFormat as ArticleDetail['contentFormat'],
})

export const listPublishedArticles = async (query: ListArticlesQuery): Promise<PaginatedArticles> => {
  const { page, limit, tag, series } = query
  const filter: Record<string, unknown> = { status: 'published' }
  if (tag) filter.tags = tag
  if (series) filter.series = series

  const [raw, total] = await Promise.all([
    Article.find(filter)
      .select('-content')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Article.countDocuments(filter),
  ])

  return { articles: raw.map(toListItem), total, page, limit }
}

export const listAdminArticles = async (query: ListArticlesQuery): Promise<PaginatedArticles> => {
  const { page, limit, status, tag, series } = query
  const filter: Record<string, unknown> = {}
  if (status) filter.status = status
  if (tag) filter.tags = tag
  if (series) filter.series = series

  const [raw, total] = await Promise.all([
    Article.find(filter)
      .select('-content')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Article.countDocuments(filter),
  ])

  return { articles: raw.map(toListItem), total, page, limit }
}

export const getPublishedArticleBySlug = async (slug: string): Promise<ArticleDetail> => {
  const article = await Article.findOne({ slug, status: 'published' }).lean()
  if (!article) throw new AppError('NOT_FOUND', 404, 'Article not found.')
  return toDetail(article as Record<string, unknown>)
}

export const getAdminArticleById = async (id: string): Promise<ArticleDetail> => {
  if (!Types.ObjectId.isValid(id)) throw new AppError('VALIDATION_ERROR', 400, 'Invalid article id.')
  const article = await Article.findById(id).lean()
  if (!article) throw new AppError('NOT_FOUND', 404, 'Article not found.')
  return toDetail(article as Record<string, unknown>)
}

export const createArticle = async (authorId: string, body: CreateArticleBody): Promise<ArticleDetail> => {
  const exists = await Article.findOne({ slug: body.slug }).lean()
  if (exists) throw new AppError('CONFLICT', 409, 'An article with this slug already exists.')

  const publishedAt = body.status === 'published'
    ? (body.publishedAt ?? new Date())
    : body.publishedAt

  const article = await Article.create({
    ...body,
    authorId,
    publishedAt,
  })

  return toDetail(article.toObject() as unknown as Record<string, unknown>)
}

export const updateArticle = async (id: string, body: UpdateArticleBody): Promise<ArticleDetail> => {
  if (!Types.ObjectId.isValid(id)) throw new AppError('VALIDATION_ERROR', 400, 'Invalid article id.')

  if (body.slug) {
    const slugTaken = await Article.findOne({ slug: body.slug, _id: { $ne: id } }).lean()
    if (slugTaken) throw new AppError('CONFLICT', 409, 'An article with this slug already exists.')
  }

  const patch = { ...body }
  if (body.status === 'published' && !body.publishedAt) {
    const existing = await Article.findById(id).select('publishedAt status').lean()
    if (existing && !existing.publishedAt) {
      (patch as CreateArticleBody).publishedAt = new Date()
    }
  }

  const article = await Article.findByIdAndUpdate(id, { $set: patch }, { new: true, runValidators: true }).lean()
  if (!article) throw new AppError('NOT_FOUND', 404, 'Article not found.')
  return toDetail(article as Record<string, unknown>)
}

export const publishArticle = async (id: string): Promise<ArticleDetail> => {
  if (!Types.ObjectId.isValid(id)) throw new AppError('VALIDATION_ERROR', 400, 'Invalid article id.')

  const existing = await Article.findById(id).select('publishedAt').lean()
  if (!existing) throw new AppError('NOT_FOUND', 404, 'Article not found.')

  const article = await Article.findByIdAndUpdate(
    id,
    {
      $set: {
        status: 'published',
        publishedAt: existing.publishedAt ?? new Date(),
      },
    },
    { new: true, runValidators: true }
  ).lean()

  if (!article) throw new AppError('NOT_FOUND', 404, 'Article not found.')
  return toDetail(article as Record<string, unknown>)
}

export const archiveArticle = async (id: string): Promise<ArticleDetail> => {
  if (!Types.ObjectId.isValid(id)) throw new AppError('VALIDATION_ERROR', 400, 'Invalid article id.')

  const article = await Article.findByIdAndUpdate(
    id,
    { $set: { status: 'archived' } },
    { new: true, runValidators: true }
  ).lean()

  if (!article) throw new AppError('NOT_FOUND', 404, 'Article not found.')
  return toDetail(article as Record<string, unknown>)
}

export const deleteArticle = async (id: string): Promise<void> => {
  if (!Types.ObjectId.isValid(id)) throw new AppError('VALIDATION_ERROR', 400, 'Invalid article id.')
  const result = await Article.findByIdAndDelete(id)
  if (!result) throw new AppError('NOT_FOUND', 404, 'Article not found.')
}
