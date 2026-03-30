import { Schema, model, Document } from 'mongoose'

export type Plan = 'seeker' | 'hustler' | 'closer'

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

export interface IUser extends Document {
  name: string
  email: string
  isEmailVerified: boolean       // true for Google OAuth users or after OTP
  passwordHash?: string          // undefined for OAuth-only users
  googleId?: string              // undefined for email/password users
  avatarUrl?: string
  plan: Plan
  resumeCount: number            // denormalised counter — avoids COUNT queries
  usage: IUsage
  referralCode: string           // unique invite code, e.g. "ABC12345"
  referredBy?: Schema.Types.ObjectId  // who referred this user
  totalReferrals: number         // lifetime count of successful referrals
  createdAt: Date
  updatedAt: Date
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

const UserSchema = new Schema<IUser>(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    isEmailVerified: { type: Boolean, default: false },
    passwordHash: { type: String },          // bcrypt hash — absent for Google users
    googleId:     { type: String, sparse: true, unique: true }, // sparse: allows multiple nulls
    avatarUrl:    { type: String },
    plan:         { type: String, enum: ['seeker', 'hustler', 'closer'], default: 'seeker' },
    resumeCount:  { type: Number, default: 0, min: 0 },
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
    referralCode:   { type: String, unique: true, sparse: true },
    referredBy:     { type: Schema.Types.ObjectId, ref: 'User' },
    totalReferrals: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,   // adds createdAt + updatedAt automatically
  }
)


export const User = model<IUser>('User', UserSchema)
