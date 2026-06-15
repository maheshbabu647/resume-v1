import { Schema, model, Document } from 'mongoose'
import { UsageSchema, defaultUsage, type IUsage } from './shared/Usage.schema'

export type { IUsage }

export interface IGuest extends Document {
  guestId: string
  usage: IUsage
  createdAt: Date
  expiresAt: Date // TTL index
}

const GuestSchema = new Schema<IGuest>(
  {
    guestId: { type: String, required: true, unique: true, index: true },
    usage: {
      type: UsageSchema,
      default: defaultUsage,
    },
    // TTL index: Guests expire after 30 days of inactivity
    expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), index: { expires: '0s' } }
  },
  {
    timestamps: true,
  }
)

export const Guest = model<IGuest>('Guest', GuestSchema)
