import { Schema, model, Document } from 'mongoose'
import { IUsage } from './User.model'

export interface IGuest extends Document {
  guestId: string
  usage: IUsage
  createdAt: Date
  expiresAt: Date // TTL index
}

const UsageSchema = new Schema<IUsage>(
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

const GuestSchema = new Schema<IGuest>(
  {
    guestId: { type: String, required: true, unique: true, index: true },
    usage: {
      type: UsageSchema,
      default: () => ({
        month: new Date().toISOString().slice(0, 7),
        pdfDownloads: 0,
        jdScore: 0,
        aiBullets: 0,
        jdTailoring: 0,
        bonusTailoring: 0,
        bonusPdfDownloads: 0,
      }),
    },
    // TTL index: Guests expire after 30 days of inactivity
    expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), index: { expires: '0s' } }
  },
  {
    timestamps: true,
  }
)

export const Guest = model<IGuest>('Guest', GuestSchema)
