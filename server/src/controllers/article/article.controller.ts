import type { Request, Response, NextFunction } from 'express'
import * as articleService from '../../services/article/article.service'

const p = (v: string | string[]): string => (Array.isArray(v) ? v[0] : v)

export const listPublished = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ ok: true, data: await articleService.listPublishedArticles(req.query as any) })
  } catch (err) { next(err) }
}

export const getPublishedBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ ok: true, data: await articleService.getPublishedArticleBySlug(p(req.params.slug)) })
  } catch (err) { next(err) }
}

export const listAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ ok: true, data: await articleService.listAdminArticles(req.query as any) })
  } catch (err) { next(err) }
}

export const getAdminById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ ok: true, data: await articleService.getAdminArticleById(p(req.params.id)) })
  } catch (err) { next(err) }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(201).json({ ok: true, data: await articleService.createArticle(req.user!._id, req.body) })
  } catch (err) { next(err) }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ ok: true, data: await articleService.updateArticle(p(req.params.id), req.body) })
  } catch (err) { next(err) }
}

export const publish = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ ok: true, data: await articleService.publishArticle(p(req.params.id)) })
  } catch (err) { next(err) }
}

export const archive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ ok: true, data: await articleService.archiveArticle(p(req.params.id)) })
  } catch (err) { next(err) }
}

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await articleService.deleteArticle(p(req.params.id))
    res.status(204).send()
  } catch (err) { next(err) }
}
