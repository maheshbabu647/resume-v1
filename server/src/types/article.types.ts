import type { ArticleStatus, ArticleContentFormat } from '../models/Article.model'

export interface ArticleListItem {
  _id: string
  slug: string
  title: string
  shortTitle: string
  excerpt: string
  metaDescription: string
  ogImage?: string
  coverImage?: string
  status: ArticleStatus
  publishedAt?: Date
  readingTime?: number
  tags: string[]
  series?: string
  seriesDay?: number
  authorId: string
  createdAt: Date
  updatedAt: Date
}

export interface ArticleDetail extends ArticleListItem {
  content: string
  contentFormat: ArticleContentFormat
}

export interface PaginatedArticles {
  articles: ArticleListItem[]
  total: number
  page: number
  limit: number
}
