import type { IUser, StoredPlan, UserRole, IOnboardingState } from '../models/User.model'

export interface SafeUser {
  _id: string
  name: string
  email: string
  isEmailVerified: boolean
  avatarUrl?: string
  role: UserRole
  plan: StoredPlan
  resumeCount: number
  onboarding: IOnboardingState
  lastActiveResumeId?: string
  referralCode?: string
  createdAt: Date
}

export interface AuthResult {
  user: SafeUser
  accessToken: string
  refreshToken: string
}

export type { IUser }
