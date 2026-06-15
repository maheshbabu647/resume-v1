import { Schema } from 'mongoose'

/** Monthly feature counters — shared by User and Guest documents. */
export interface IUsage {
  month: string               // "YYYY-MM" — auto-resets each month
  pdfDownloads: number
  jdScore: number
  aiBullets: number
  jdTailoring: number
  coverLetter: number
  bonusTailoring: number      // Lifetime bonus pool for tailoring
  bonusPdfDownloads: number   // Lifetime bonus pool for PDF downloads
}

export const defaultUsage = (): IUsage => ({
  month: new Date().toISOString().slice(0, 7),
  pdfDownloads: 0,
  jdScore: 0,
  aiBullets: 0,
  jdTailoring: 0,
  coverLetter: 0,
  bonusTailoring: 0,
  bonusPdfDownloads: 0,
})

export const UsageSchema = new Schema<IUsage>(
  {
    month:             { type: String, default: () => new Date().toISOString().slice(0, 7) },
    pdfDownloads:      { type: Number, default: 0, min: 0 },
    jdScore:           { type: Number, default: 0, min: 0 },
    aiBullets:         { type: Number, default: 0, min: 0 },
    jdTailoring:       { type: Number, default: 0, min: 0 },
    coverLetter:       { type: Number, default: 0, min: 0 },
    bonusTailoring:    { type: Number, default: 0, min: 0 },
    bonusPdfDownloads: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
)
