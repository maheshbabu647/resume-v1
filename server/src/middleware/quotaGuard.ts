/**
 * quotaGuard middleware
 * ─────────────────────
 * Checks if the authenticated user has remaining quota for a feature.
 * If they've hit their monthly limit, returns 403 with QUOTA_EXCEEDED.
 * Otherwise, increments the usage counter atomically and calls next().
 *
 * Usage in routers:
 *   router.post('/export', authenticate, quotaGuard('pdfDownloads'), exportController)
 */

import type { Request, Response, NextFunction } from 'express'
import { User } from '../models/User.model'
import { Guest } from '../models/Guest.model'
import { PLAN_LIMITS, GUEST_LIMITS, type PlanName } from '../config/constants'
import { AppError } from '../lib/AppError'

export type QuotaFeature = 'pdfDownloads' | 'jdScore' | 'aiBullets' | 'jdTailoring' | 'coverLetter'

const currentMonth = () => new Date().toISOString().slice(0, 7) // "YYYY-MM"

export const quotaGuard =
  (feature: QuotaFeature) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isDev = process.env.NODE_ENV === 'development'
      
      if (!req.user) {
        if (!req.guestId) {
          return next(new AppError('UNAUTHORIZED', 401))
        }
        
        const month = currentMonth()
        let guest = await Guest.findOne({ guestId: req.guestId }).lean()
        if (!guest) {
          await Guest.create({ guestId: req.guestId, usage: { month } })
          guest = await Guest.findOne({ guestId: req.guestId }).lean()
        }
        if (!guest) return next(new AppError('SERVER_ERROR', 500))

        // Reset counters if it's a new month
        if (guest.usage?.month !== month) {
          await Guest.findOneAndUpdate(
            { guestId: req.guestId },
            { $set: {
              'usage.month': month,
              'usage.pdfDownloads': 0,
              'usage.jdScore': 0,
              'usage.aiBullets': 0,
              'usage.jdTailoring': 0,
              'usage.coverLetter': 0,
            }}
          )
          guest = await Guest.findOne({ guestId: req.guestId }).lean()
          if (!guest) return next(new AppError('SERVER_ERROR', 500))
        }

        const limit = GUEST_LIMITS[feature]
        const used = guest.usage?.[feature] ?? 0

        if (used < limit) {
          await Guest.findOneAndUpdate({ guestId: req.guestId }, { $inc: { [`usage.${feature}`]: 1 } })
          return next()
        }
        
        if (isDev) {
          await Guest.findOneAndUpdate({ guestId: req.guestId }, { $inc: { [`usage.${feature}`]: 1 } })
          return next()
        }

        res.status(403).json({
          success: false,
          code: 'GUEST_LIMIT_HIT',
          message: `Guest limit reached for ${feature}. Please sign up to continue.`,
          data: { feature, used, limit }
        })
        return
      }

      // ─────────────────────────────────────────────────────────
      // User path
      // ─────────────────────────────────────────────────────────
      const userId = req.user._id

      // Fetch user with usage
      let user = await User.findById(userId).select('plan usage').lean()
      if (!user) return next(new AppError('USER_NOT_FOUND', 404))

      const plan = (user.plan ?? 'seeker') as PlanName
      const limits = PLAN_LIMITS[plan]
      const limit = limits[feature]

      // -1 = unlimited (Closer plan)
      if (limit === -1) return next()

      const month = currentMonth()

      // Reset counter if it's a new month OR usage object is missing
      if (user.usage?.month !== month || !user.usage) {
        await User.findByIdAndUpdate(userId, {
          $set: {
            'usage.month': month,
            'usage.pdfDownloads': 0,
            'usage.jdScore': 0,
            'usage.aiBullets': 0,
            'usage.jdTailoring': 0,
            'usage.coverLetter': 0,
            'usage.bonusTailoring': user.usage?.bonusTailoring ?? 0,
            'usage.bonusPdfDownloads': user.usage?.bonusPdfDownloads ?? 0,
          }
        }, { upsert: true })
        // Re-fetch fresh usage
        user = await User.findById(userId).select('plan usage').lean()
        if (!user) return next(new AppError('USER_NOT_FOUND', 404))
      }

      const used = user.usage?.[feature] ?? 0
      const bonusPoolKey = feature === 'jdTailoring' ? 'bonusTailoring' : feature === 'pdfDownloads' ? 'bonusPdfDownloads' : null
      const bonusPool = bonusPoolKey ? (user.usage?.[bonusPoolKey] ?? 0) : 0

      // Logic:
      // 1. If used < limit, use monthly credit (increment used counter)
      // 2. Else if bonusPool > 0, use bonus credit (decrement bonus counter)
      // 3. Else, if in dev, still increment (but don't block), else quota exceeded

      if (used < limit) {
        await User.findByIdAndUpdate(userId, { $inc: { [`usage.${feature}`]: 1 } })
        return next()
      } 
      
      if (bonusPool > 0 && bonusPoolKey) {
        await User.findByIdAndUpdate(userId, { $inc: { [`usage.${bonusPoolKey}`]: -1 } })
        return next()
      }

      // If in development, still increment the counter (to show it works) but don't block
      if (isDev) {
        await User.findByIdAndUpdate(userId, { $inc: { [`usage.${feature}`]: 1 } })
        return next()
      }

      return next(
        new AppError('QUOTA_EXCEEDED', 403, {
          feature,
          used,
          limit,
          bonusPool,
          plan,
        })
      )
    } catch (err) {
      next(err)
    }
  }
