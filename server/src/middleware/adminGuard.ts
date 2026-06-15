import type { Request, Response, NextFunction } from 'express'
import { User } from '../models/User.model'
import { AppError } from '../lib/AppError'

/** Restricts routes to users with role === 'admin'. Must run after authenticate. */
export const adminGuard = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) return next(new AppError('UNAUTHORIZED', 401))

    const user = await User.findById(req.user._id).select('role').lean()
    if (!user || user.role !== 'admin') {
      return next(new AppError('FORBIDDEN', 403, 'Admin access required.'))
    }

    next()
  } catch (err) {
    next(err)
  }
}
