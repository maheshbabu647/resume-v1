import { Schema, model, Document, Types } from 'mongoose'

export type ArticleStatus = 'draft' | 'published' | 'archived'
export type ArticleContentFormat = 'markdown' | 'html'

export interface IArticle extends Document {
  slug: string
  title: string
  shortTitle: string
  excerpt: string
  content: string
  contentFormat: ArticleContentFormat
  metaDescription: string
  ogImage?: string
  coverImage?: string
  status: ArticleStatus
  publishedAt?: Date
  readingTime?: number
  tags: string[]
  series?: string
  seriesDay?: number
  authorId: Types.ObjectId
  /** Set when migrated from static blog-post-N.tsx */
  legacyPostId?: number
  createdAt: Date
  updatedAt: Date
}

const ArticleSchema = new Schema<IArticle>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: { type: String, required: true, trim: true },
    shortTitle: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    contentFormat: {
      type: String,
      enum: ['markdown', 'html'],
      default: 'markdown',
    },
    metaDescription: { type: String, required: true, maxlength: 320 },
    ogImage: { type: String },
    coverImage: { type: String },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    publishedAt: { type: Date },
    readingTime: { type: Number, min: 1 },
    tags: { type: [String], default: [] },
    series: { type: String },
    seriesDay: { type: Number, min: 1 },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    legacyPostId: { type: Number, sparse: true, unique: true },
  },
  {
    timestamps: true,
  }
)

// Public list: published articles, newest first
ArticleSchema.index({ status: 1, publishedAt: -1 })

// Admin list: author's articles by recency
ArticleSchema.index({ authorId: 1, updatedAt: -1 })

// Series navigation
ArticleSchema.index({ series: 1, seriesDay: 1 })

export const Article = model<IArticle>('Article', ArticleSchema)
