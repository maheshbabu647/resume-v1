import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../lib/AppError'

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof AppError) {
    const errObj: Record<string, unknown> = { code: err.code, message: err.message }
    if ((err as any).errors) errObj.errors = (err as any).errors
    if (err.data) errObj.data = err.data
    res.status(err.statusCode).json({ ok: false, error: errObj })
    return
  }
  if (err.name === 'ValidationError') {
    res.status(400).json({ ok: false, error: { code: 'VALIDATION_ERROR', message: err.message } })
    return
  }
  if ((err as any).code === 11000) {
    res.status(400).json({ ok: false, error: { code: 'DUPLICATE_KEY', message: 'A record with that value already exists.' } })
    return
  }
  console.error('[ERROR]', err)
  res.status(500).json({ ok: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong.' } })
}
