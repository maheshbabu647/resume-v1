import type { Request, Response, NextFunction } from 'express'
import * as exportService from '../../services/resume/export.service'

export const generatePDF = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { buffer, filename } = await exportService.generatePDFBuffer(req.body)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Length', buffer.length)
    res.send(buffer)
  } catch (err) { next(err) }
}

export const uploadPDF = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ ok: true, data: await exportService.generateShareLink(req.body) }) }
  catch (err) { next(err) }
}
