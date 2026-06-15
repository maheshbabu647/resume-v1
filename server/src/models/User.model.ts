import { Schema, model, Document } from 'mongoose'
import { UsageSchema, defaultUsage, type IUsage } from './shared/Usage.schema'

export type { IUsage }

/** Active plan — CareerForge is fully free; legacy paid values remain until migration. */
export type Plan = 'free'
export type LegacyPlan = 'seeker' | 'hustler' | 'closer'
export type StoredPlan = Plan | LegacyPlan

export type UserRole = 'user' | 'admin'

export type OnboardingStatus = 'pending' | 'completed' | 'skipped'
export type OnboardingEntryMethod = 'upload' | 'scratch' | 'guided'

/** Tracks first-run onboarding — used by frontend to decide when to show the flow. */
export interface IOnboardingState {
  status: OnboardingStatus
  completedAt?: Date
  skippedAt?: Date
  /** Last step reached if the user exits mid-flow (e.g. 'education', 'skills'). */
  lastStepId?: string
  /** How the user chose to create their first resume. */
  entryMethod?: OnboardingEntryMethod
}

export interface IUser extends Document {
  name: string
  email: string
  isEmailVerified: boolean       // true for Google OAuth users or after OTP
  passwordHash?: string          // undefined for OAuth-only users
  googleId?: string              // undefined for email/password users
  avatarUrl?: string
  role: UserRole
  plan: StoredPlan
  resumeCount: number            // denormalised counter — avoids COUNT queries
  usage: IUsage
  onboarding: IOnboardingState
  /** Most recently opened resume — quick return from dashboard. */
  lastActiveResumeId?: Schema.Types.ObjectId
  referralCode: string           // unique invite code, e.g. "ABC12345"
  referredBy?: Schema.Types.ObjectId  // who referred this user
  totalReferrals: number         // lifetime count of successful referrals
  createdAt: Date
  updatedAt: Date
}

const OnboardingSchema = new Schema<IOnboardingState>(
  {
    status: {
      type: String,
      enum: ['pending', 'completed', 'skipped'],
      default: 'pending',
    },
    completedAt: { type: Date },
    skippedAt: { type: Date },
    lastStepId: { type: String },
    entryMethod: {
      type: String,
      enum: ['upload', 'scratch', 'guided'],
    },
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
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      index: true,
    },
    plan: {
      type: String,
      enum: ['free', 'seeker', 'hustler', 'closer'],
      default: 'free',
    },
    resumeCount:  { type: Number, default: 0, min: 0 },
    usage: {
      type: UsageSchema,
      default: defaultUsage,
    },
    onboarding: {
      type: OnboardingSchema,
      default: () => ({ status: 'pending' }),
    },
    lastActiveResumeId: { type: Schema.Types.ObjectId, ref: 'Resume' },
    referralCode:   { type: String, unique: true, sparse: true },
    referredBy:     { type: Schema.Types.ObjectId, ref: 'User' },
    totalReferrals: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,   // adds createdAt + updatedAt automatically
  }
)


export const User = model<IUser>('User', UserSchema)
