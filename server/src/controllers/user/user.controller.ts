import type { Request, Response, NextFunction } from 'express'
import * as userService from '../../services/user/user.service'

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ ok: true, data: await userService.getMe(req.user!._id) }) }
  catch (err) { next(err) }
}
export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ ok: true, data: await userService.updateMe(req.user!._id, req.body) }) }
  catch (err) { next(err) }
}
export const deleteMe = async (req: Request, res: Response, next: NextFunction) => {
  try { await userService.deleteMe(req.user!._id); res.status(204).send() }
  catch (err) { next(err) }
}
