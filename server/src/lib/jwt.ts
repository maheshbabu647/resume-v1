import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { env } from '../config/env'
import type { RequestUser } from '../middleware/authenticate'

export const signAccessToken = (payload: RequestUser): string =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY as jwt.SignOptions['expiresIn'],
  })

export const signRefreshToken = (userId: string): { token: string; jti: string } => {
  const jti = crypto.randomUUID()
  const token = jwt.sign({ _id: userId, jti }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY as jwt.SignOptions['expiresIn'],
  })
  return { token, jti }
}

export const verifyRefreshToken = (token: string): { _id: string; jti: string } =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as { _id: string; jti: string }

