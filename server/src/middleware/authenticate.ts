import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { AppError } from '../lib/AppError'

export interface RequestUser {
  _id: string
  name: string
  email: string
  plan: 'seeker' | 'hustler' | 'closer'
}

declare global {
  namespace Express {
    interface Request { 
      user?: RequestUser 
      guestId?: string
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return next(new AppError('AUTH_TOKEN_MISSING', 401))
  const token = authHeader.split(' ')[1]
  try {
    req.user = jwt.verify(token, env.JWT_ACCESS_SECRET) as RequestUser
    next()
  } catch (err: any) {
    const code = err.name === 'TokenExpiredError' ? 'AUTH_TOKEN_EXPIRED' : 'AUTH_TOKEN_INVALID'
    next(new AppError(code, 401))
  }
}

export const optionalAuthenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization
  const guestId = req.headers['x-guest-id'] as string | undefined

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    try {
      req.user = jwt.verify(token, env.JWT_ACCESS_SECRET) as RequestUser
    } catch {
      // Ignored for optional authentication, fallback to guest or anonymous
    }
  }
  
  if (!req.user && guestId) {
    req.guestId = guestId
  }

  // If neither user nor guest, they are truly anonymous (which is fine, quotaGuard will block them or error out)
  next()
}
