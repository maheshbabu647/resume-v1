import type { IUser } from '../models/User.model'

export interface TokenPair { accessToken: string; refreshToken: string }

export interface SafeUser {
  _id: string
  name: string
  email: string
  isEmailVerified: boolean
  avatarUrl?: string
  plan: IUser['plan']
  resumeCount: number
  referralCode?: string
  createdAt: Date
}

export interface AuthResult {
  user: SafeUser
  accessToken: string
  refreshToken: string
}
