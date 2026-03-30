import type { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { AppError } from '../lib/AppError'

type RequestPart = 'body' | 'params' | 'query'

export const validate =
  (part: RequestPart, schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part])
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message }))
      const err    = new AppError('VALIDATION_ERROR', 400) as any
      err.errors   = errors
      return next(err)
    }
    Object.defineProperty(req, part, { value: result.data, writable: true, enumerable: true, configurable: true })
    next()
  }
