import type { Request, Response, NextFunction } from 'express'
import * as coverLetterService from '../../services/resume/coverLetter.service'

const p = (v: string | string[]): string => (Array.isArray(v) ? v[0] : v)

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ ok: true, data: await coverLetterService.listCoverLetters(req.user!._id, req.query as any) }) }
  catch (err) { next(err) }
}
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(201).json({ ok: true, data: await coverLetterService.createCoverLetter(req.user!._id, req.body) }) }
  catch (err) { next(err) }
}
export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ ok: true, data: await coverLetterService.getCoverLetter(req.user!._id, p(req.params.id)) }) }
  catch (err) { next(err) }
}
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ ok: true, data: await coverLetterService.updateCoverLetter(req.user!._id, p(req.params.id), req.body) }) }
  catch (err) { next(err) }
}
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try { await coverLetterService.deleteCoverLetter(req.user!._id, p(req.params.id)); res.status(204).send() }
  catch (err) { next(err) }
}
