import { Schema, model, Document, Types } from 'mongoose'

export type CoverLetterTone = 'professional' | 'enthusiastic' | 'concise' | 'creative'

export interface ICoverLetter extends Document {
  userId: Types.ObjectId
  title: string
  subject: string
  recipientName: string
  companyName: string
  roleName: string
  body: string
  tone: CoverLetterTone
  wordCount: number
  keywordsUsed: string[]
  resumeId?: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const CoverLetterSchema = new Schema<ICoverLetter>(
  {
    userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title:         { type: String, required: true, trim: true },
    subject:       { type: String, default: '' },
    recipientName: { type: String, default: '' },
    companyName:   { type: String, default: '' },
    roleName:      { type: String, default: '' },
    body:          { type: String, required: true },
    tone:          { type: String, enum: ['professional', 'enthusiastic', 'concise', 'creative'], default: 'professional' },
    wordCount:     { type: Number, default: 0 },
    keywordsUsed:  { type: [String], default: [] },
    resumeId:      { type: Schema.Types.ObjectId, ref: 'Resume' },
  },
  {
    timestamps: true,
  }
)

// Fast lookup: all cover letters for a user (dashboard list)
CoverLetterSchema.index({ userId: 1, updatedAt: -1 })

export const CoverLetter = model<ICoverLetter>('CoverLetter', CoverLetterSchema)
