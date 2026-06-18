import type { Request, Response, NextFunction } from 'express'
import { redis } from '../config/redis'
import { AppError } from '../lib/AppError'
import { logger } from '../config/logger'

interface RateLimitOptions { windowSec: number; maxRequests: number }

export const rateLimiter =
  (routeKey: string, opts: RateLimitOptions) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const identifier = req.user?._id ?? req.ip ?? 'anonymous'
      const key = `rl:${identifier}:${routeKey}`
      const now = Date.now()
      const windowStart = now - opts.windowSec * 1000
      try {
        const pipeline = redis.pipeline()
        pipeline.zremrangebyscore(key, '-inf', windowStart)
        pipeline.zcard(key)
        pipeline.zadd(key, now, `${now}`)
        pipeline.expire(key, opts.windowSec)
        const results = await pipeline.exec()
        const requestCount = (results?.[1]?.[1] as number) ?? 0
        res.setHeader('X-RateLimit-Limit', opts.maxRequests)
        res.setHeader('X-RateLimit-Remaining', Math.max(0, opts.maxRequests - requestCount - 1))
        if (requestCount >= opts.maxRequests) {
          res.setHeader('Retry-After', opts.windowSec)
          return next(new AppError('RATE_LIMITED', 429, 'You have reached your limit please try again.'))
        }
        next()
      } catch (err) {
        logger.error({ err }, '[rateLimiter] Redis error, failing open')
        next()
      }
    }

export const aiRateLimiter = rateLimiter('ai', { windowSec: 60, maxRequests: 20 })
export const authRateLimiter = rateLimiter('auth', { windowSec: 900, maxRequests: 100 })
export const apiRateLimiter = rateLimiter('api', { windowSec: 60, maxRequests: 120 })
export const parseRateLimiter = rateLimiter('parse', { windowSec: 900, maxRequests: 5 })
