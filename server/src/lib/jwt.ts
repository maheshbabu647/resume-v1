import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import type { RequestUser } from '../middleware/authenticate'

export const signAccessToken = (payload: RequestUser): string =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY as jwt.SignOptions['expiresIn'],
  })

export const signRefreshToken = (userId: string): string =>
  jwt.sign({ _id: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY as jwt.SignOptions['expiresIn'],
  })

export const verifyRefreshToken = (token: string): { _id: string } =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as { _id: string }
