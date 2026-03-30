import type { Request, Response, NextFunction } from 'express'
import { User } from '../models/User.model'
import { AppError } from '../lib/AppError'

type RequiredPlan = 'hustler' | 'closer'

/** Guards routes that require at least a given plan tier. */
export const planGuard =
  (required: RequiredPlan) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await User.findById(req.user!._id).select('plan').lean()
      // Bypass plan guard in development mode for easier testing
      const isDev = process.env.NODE_ENV === 'development'
      const PLAN_ORDER: Record<string, number> = { seeker: 0, hustler: 1, closer: 2 }
      const userLevel     = PLAN_ORDER[user?.plan ?? 'seeker'] ?? 0
      const requiredLevel = PLAN_ORDER[required] ?? 1
      if (!user || (userLevel < requiredLevel && !isDev)) return next(new AppError('PLAN_UPGRADE_REQUIRED', 403))
      next()
    } catch (err) { next(err) }
  }
