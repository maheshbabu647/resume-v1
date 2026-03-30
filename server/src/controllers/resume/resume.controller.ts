import type { Request, Response, NextFunction } from 'express'
import * as resumeService from '../../services/resume/resume.service'

const p = (v: string | string[]): string => (Array.isArray(v) ? v[0] : v)

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ ok: true, data: await resumeService.listResumes(req.user!._id, req.query as any) }) }
  catch (err) { next(err) }
}
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(201).json({ ok: true, data: await resumeService.createResume(req.user!._id, req.body) }) }
  catch (err) { next(err) }
}
export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ ok: true, data: await resumeService.getResume(req.user!._id, p(req.params.id)) }) }
  catch (err) { next(err) }
}
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ ok: true, data: await resumeService.updateResume(req.user!._id, p(req.params.id), req.body) }) }
  catch (err) { next(err) }
}
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try { await resumeService.deleteResume(req.user!._id, p(req.params.id)); res.status(204).send() }
  catch (err) { next(err) }
}
export const duplicate = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(201).json({ ok: true, data: await resumeService.duplicateResume(req.user!._id, p(req.params.id)) }) }
  catch (err) { next(err) }
}
