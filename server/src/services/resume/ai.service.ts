import crypto      from 'crypto'
import { redis }   from '../../config/redis'
import { callLLMJSON } from '../../lib/llm'
import { AppError }    from '../../lib/AppError'
import { JDHistory }   from '../../models/JDHistory.model'
import { AI }          from '../../config/constants'
import { buildJdTailorPrompt } from './prompts/jdTailor.prompt'
import { buildSuggestPrompt }  from './prompts/suggest.prompt'
import { buildResumeParsePrompt } from './prompts/resumeParse.prompt'
import { buildJDMatchPrompt } from './prompts/jdMatch.prompt'
import { buildTailorNewPrompt } from './prompts/tailorNew.prompt'
import { buildCoverLetterPrompt } from './prompts/coverLetter.prompt'
import type { JdTailorBody, SuggestBody, AnalyzeJdBody, TailorNewBody, CoverLetterBody } from '../../schemas/ai.schema'
import type { ISection } from '../../models/Resume.model'

export const analyzeJDMatch = async (body: AnalyzeJdBody) => {
  const { serializedResume, preprocessedJD } = body

  // Hash input for caching
  const hashObj = crypto.createHash('sha256').update(`${serializedResume}|||${preprocessedJD}`)
  const inputHash = hashObj.digest('hex')
  const cacheKey = `ai:jdmatch:${inputHash}`

  const cached = await redis.get(cacheKey)
  if (cached) {
    const data = JSON.parse(cached)
    return { ...data, inputHash, cachedAt: Date.now() }
  }

  const prompt = buildJDMatchPrompt(serializedResume, preprocessedJD)
  
  // Call LLM with strictly low temperature for determinism but non-zero for stability
  const result = await callLLMJSON<any>(prompt, { maxOutputTokens: 3000, temperature: 0.1 })
  
  // Basic structural validation
  if (!result || typeof result !== 'object' || !('fitScore' in result)) {
    throw new AppError('LLM_ERROR', 500, 'AI returned an unexpected format.')
  }

  const finalResult = { ...result, inputHash }
  
  // Cache for 24 hours
  await redis.setex(cacheKey, 60 * 60 * 24, JSON.stringify(finalResult))
  
  return finalResult
}

interface JdTailorLLMResponse { jdCompanyName: string; jdRoleName: string; rewrittenSections: ISection[] }

export const jdTailor = async (userId: string, body: JdTailorBody) => {
  const { resumeId, jdText, sections } = body
  const parsed = await callLLMJSON<JdTailorLLMResponse>(buildJdTailorPrompt({ sections: sections as ISection[], jdText }))
  if (!parsed.rewrittenSections || !Array.isArray(parsed.rewrittenSections)) throw new AppError('LLM_ERROR', 500, 'AI returned unexpected response format.')
  const history = await JDHistory.create({
    resumeId, userId, jdText,
    jdCompanyName:  parsed.jdCompanyName ?? '',
    jdRoleName:     parsed.jdRoleName ?? '',
    beforeSnapshot: sections,
    afterSnapshot:  parsed.rewrittenSections,
  })
  return { historyId: history._id, rewrittenSections: parsed.rewrittenSections, jdCompanyName: parsed.jdCompanyName, jdRoleName: parsed.jdRoleName }
}

export const suggest = async (body: SuggestBody): Promise<{ suggestions: string[] }> => {
  const cacheKey = `ai:suggest:${crypto.createHash('sha256').update(`${body.sectionKey}:${body.fieldName}:${body.currentValue}`).digest('hex')}`
  const cached   = await redis.get(cacheKey)
  if (cached) return { suggestions: JSON.parse(cached) }
  const suggestions = await callLLMJSON<string[]>(buildSuggestPrompt(body))
  if (!Array.isArray(suggestions)) throw new AppError('LLM_ERROR', 500, 'AI returned unexpected suggestions format.')
  await redis.setex(cacheKey, AI.CACHE_TTL_SEC, JSON.stringify(suggestions))
  return { suggestions }
}

export const getHistory = async (userId: string, resumeId: string) => {
  const history = await JDHistory.find({ resumeId, userId }).select('jdCompanyName jdRoleName createdAt').sort({ createdAt: -1 }).lean()
  return { history }
}

export const revert = async (userId: string, historyId: string) => {
  const history = await JDHistory.findById(historyId).lean()
  if (!history) throw new AppError('RESUME_NOT_FOUND', 404, 'History entry not found.')
  if (history.userId.toString() !== userId) throw new AppError('FORBIDDEN', 403)
  return { restoredSections: history.beforeSnapshot }
}

export interface ParsedResumeData {
  personalInfo: {
    fullName: string
    title?: string
    email: string
    phone?: string
    location?: string
    summary?: string
    summaryLabel?: string
    contactLinks?: { text: string; url: string }[]
  }
  sections: ISection[]
}

export const parseResume = async (rawText: string): Promise<ParsedResumeData> => {
  if (!rawText || rawText.trim().length < 50) {
    throw new AppError('VALIDATION_ERROR', 400, 'The uploaded file appears to be empty or unreadable.')
  }
  // Trim to avoid exceeding LLM context for very long resumes
  const trimmedText = rawText.slice(0, 12000)
  const parsed = await callLLMJSON<ParsedResumeData>(buildResumeParsePrompt(trimmedText))
  if (!parsed.personalInfo || !Array.isArray(parsed.sections)) {
    throw new AppError('LLM_ERROR', 500, 'AI returned an unexpected structure. Please try again.')
  }
  return parsed
}

// ─── Tailor New ───────────────────────────────────────────────────────────────
// Generates a full structured resume (personalInfo + sections) from raw resume
// text + JD. Used by the standalone /jd-tailor page, not the editor sidebar.

export interface TailorNewResult {
  jdCompanyName: string
  jdRoleName: string
  personalInfo: ParsedResumeData['personalInfo']
  sections: ISection[]
}

export const tailorNew = async (body: TailorNewBody): Promise<TailorNewResult> => {
  const { resumeText, jdText } = body
  const prompt = buildTailorNewPrompt(resumeText.slice(0, 12000), jdText)
  const result = await callLLMJSON<TailorNewResult>(prompt, { maxOutputTokens: 8192, temperature: 0.2 })
  if (!result.personalInfo || !Array.isArray(result.sections)) {
    throw new AppError('LLM_ERROR', 500, 'AI returned an unexpected structure for tailored resume.')
  }
  return result
}

// ─── Cover Letter ──────────────────────────────────────────────────────────────
// Generates a professional, tailored cover letter from resume text + JD.

export interface CoverLetterResult {
  subject: string
  recipientName: string
  companyName: string
  roleName: string
  body: string
  wordCount: number
}

export const generateCoverLetter = async (body: CoverLetterBody): Promise<CoverLetterResult> => {
  const { resumeText, jdText, tone } = body
  const prompt = buildCoverLetterPrompt(resumeText.slice(0, 12000), jdText, tone)
  const result = await callLLMJSON<CoverLetterResult>(prompt, { maxOutputTokens: 3000, temperature: 0.3 })
  if (!result.body || typeof result.body !== 'string') {
    throw new AppError('LLM_ERROR', 500, 'AI returned an unexpected structure for the cover letter.')
  }
  return result
}
