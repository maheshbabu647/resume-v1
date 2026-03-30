import multer from 'multer'
import type { Request, Response, NextFunction } from 'express'
import * as aiService from '../../services/resume/ai.service'

const p = (v: string | string[]): string => (Array.isArray(v) ? v[0] : v)

export const jdTailor = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ ok: true, data: await aiService.jdTailor(req.user!._id, req.body) }) }
  catch (err) { next(err) }
}
export const analyzeJDMatch = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ ok: true, data: await aiService.analyzeJDMatch(req.body) }) }
  catch (err) { next(err) }
}
export const suggest = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ ok: true, data: await aiService.suggest(req.body) }) }
  catch (err) { next(err) }
}
export const getHistory = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ ok: true, data: await aiService.getHistory(req.user!._id, p(req.params.resumeId)) }) }
  catch (err) { next(err) }
}
export const revert = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ ok: true, data: await aiService.revert(req.user!._id, p(req.params.historyId)) }) }
  catch (err) { next(err) }
}

export const tailorNew = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ ok: true, data: await aiService.tailorNew(req.body) }) }
  catch (err) { next(err) }
}

export const generateCoverLetter = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ ok: true, data: await aiService.generateCoverLetter(req.body) }) }
  catch (err) { next(err) }
}

// ─── Resume Upload & Parse ────────────────────────────────────────────────────

// Multer memory storage — file is NOT persisted, only extracted in-memory
export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only PDF and Word documents (.pdf, .docx) are supported.'))
    }
  }
}).single('resume')

// Internal helper for extracting text from PDF/Word buffer
async function extractRawText(mimetype: string, buffer: Buffer): Promise<string> {
  let rawText = ''
  if (mimetype === 'application/pdf') {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs' as any)
    const standardFontDataUrl = __dirname + '/../../../node_modules/pdfjs-dist/standard_fonts/'
    const uint8Array = new Uint8Array(buffer)
    const loadingTask = pdfjsLib.getDocument({ 
      data: uint8Array,
      standardFontDataUrl,
      disableFontFace: true,
    })
    
    const pdf = await loadingTask.promise
    let text = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items.map((item: any) => item.str).join(' ')
      text += pageText + '\n'
    }
    rawText = text
  } else {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    rawText = result.value
  }
  return rawText
}

export const extractText = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ ok: false, error: { message: 'No file uploaded.' } })
      return
    }
    const rawText = await extractRawText(req.file.mimetype, req.file.buffer)
    res.json({ ok: true, data: rawText })
  } catch (err) { next(err) }
}

export const parseResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ ok: false, error: { message: 'No file uploaded.' } })
      return
    }

    const rawText = await extractRawText(req.file.mimetype, req.file.buffer)
    const parsed = await aiService.parseResume(rawText)
    res.json({ ok: true, data: parsed })
  } catch (err) {
    next(err)
  }
}
