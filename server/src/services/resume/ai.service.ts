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
import { buildJdSpecPrompt } from './prompts/jdSpec.prompt'
import { buildTailorNewPrompt } from './prompts/tailorNew.prompt'
import { buildTailorSmartPrompt } from './prompts/tailorSmart.prompt'
import type { TailorSmartContext } from './prompts/tailorSmart.prompt'
import { validateAndFixTailorSmart } from './tailorSmartValidator'
import type { TailorSmartResult } from './tailorSmartValidator'
import { buildCoverLetterPrompt, buildRewriteParagraphPrompt } from './prompts/coverLetter.prompt'
import type { JdTailorBody, SuggestBody, AnalyzeJdBody, TailorNewBody, TailorSmartBody, CoverLetterBody, RewriteParagraphBody, JdSpecBody } from '../../schemas/ai.schema'
import type { ISection } from '../../models/Resume.model'

/**
 * @deprecated Superseded by `extractJdSpec` + the deterministic client-side scoring formula.
 *
 * This route makes the LLM compute the fitScore itself, which means scoring runs on a
 * SEPARATE extraction from the live formula — so the report score and the live score can
 * drift ("missing one word changes the score before/after"). The unified path is:
 *   extractJdSpec() (one LLM call, cached per-JD) → client formula scores report AND live.
 * Kept temporarily so the existing JD-fit UI keeps working until the frontend migrates.
 */
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

// ─── JD-Spec Extraction ─────────────────────────────────────────────────────────
// Converts a raw JD into a structured, weighted spec that a deterministic client-side
// formula scores a resume against — instantly, with no further LLM calls. The spec is
// resume-independent, so it is cached per-JD (24h) and reused while the user edits live.

export type SkillType = 'hard' | 'soft'
export type Seniority = 'intern' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive'

export interface JdSpecSkill {
  term: string
  aliases: string[]
  weight: number               // integer 1..3
  type: SkillType
}

export interface JdSpecResponsibility {
  phrase: string
  keywords: string[]
}

export interface JDSpec {
  jobTitle: string
  titleTerms: string[]
  seniority: Seniority
  minYears: number | null
  requiredSkills: JdSpecSkill[]
  preferredSkills: JdSpecSkill[]
  domainKeywords: JdSpecSkill[]
  responsibilities: JdSpecResponsibility[]
  certifications: string[]
  inputHash: string
  cachedAt?: number
}

const VALID_SENIORITY: Seniority[] = ['intern', 'junior', 'mid', 'senior', 'lead', 'executive']

const cleanStr = (v: unknown): string => (typeof v === 'string' ? v.trim() : '')
const cleanLower = (v: unknown): string => cleanStr(v).toLowerCase()

const cleanStrList = (v: unknown, lower: boolean): string[] => {
  if (!Array.isArray(v)) return []
  const seen = new Set<string>()
  const out: string[] = []
  for (const item of v) {
    const s = lower ? cleanLower(item) : cleanStr(item)
    if (s && !seen.has(s)) { seen.add(s); out.push(s) }
  }
  return out
}

// Verbs that signal a JD duty/responsibility phrase rather than a resume-listable skill.
// Only unambiguous responsibility verbs (excludes double-duty nouns like "lead"/"design").
const RESPONSIBILITY_VERBS = new Set([
  'improve', 'build', 'understand', 'learn', 'develop', 'ensure', 'provide', 'demonstrate',
  'maintain', 'manage', 'handle', 'assist', 'collaborate', 'perform', 'deliver', 'identify',
  'troubleshoot', 'resolve', 'respond', 'configure', 'monitor', 'document', 'communicate',
  'gain', 'expand', 'strengthen', 'contribute', 'participate', 'conduct', 'execute', 'coordinate',
  'facilitate', 'oversee', 'supervise', 'train', 'mentor', 'optimize', 'enhance', 'achieve',
  'apply', 'utilize', 'leverage', 'help', 'adhere', 'comply',
])
// Trailing filler nouns to strip: "communication skills" -> "communication".
const FLUFF_TAIL = new Set([
  'skills', 'skill', 'abilities', 'ability', 'knowledge', 'fundamentals',
  'concepts', 'basics', 'mindset', 'expertise', 'proficiency',
])

/**
 * Deterministic safety net: turns a raw LLM "skill" into a clean atomic term, or rejects it
 * when it's actually a responsibility/sentence. Guards the engine + resume against LLM jitter
 * even if the prompt is ignored (e.g. "improve communication skills", "build technical knowledge").
 */
const sanitizeSkillTerm = (raw: string): string | null => {
  const words = raw.replace(/[.,;:]+$/g, '').trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return null
  // Strip trailing fluff nouns ("X skills" -> "X"), but keep at least one word.
  while (words.length > 1 && FLUFF_TAIL.has(words[words.length - 1])) words.pop()
  // A verb-led multi-word phrase is a duty, not a skill.
  if (words.length >= 2 && RESPONSIBILITY_VERBS.has(words[0])) return null
  // Too long to be an atomic skill — almost certainly a sentence fragment.
  if (words.length > 5) return null
  const term = words.join(' ')
  if (!term || FLUFF_TAIL.has(term)) return null
  return term
}

const normalizeSkill = (raw: any): JdSpecSkill | null => {
  const term = sanitizeSkillTerm(cleanLower(raw?.term))
  if (!term) return null
  let weight = Math.round(Number(raw?.weight))
  if (!Number.isFinite(weight)) weight = 2
  weight = Math.min(3, Math.max(1, weight))
  const type: SkillType = raw?.type === 'soft' ? 'soft' : 'hard'
  // Aliases: lowercase, deduped, exclude the term itself
  const aliases = cleanStrList(raw?.aliases, true).filter(a => a !== term)
  return { term, aliases, weight, type }
}

const normalizeSkillList = (v: unknown, cap: number): JdSpecSkill[] => {
  if (!Array.isArray(v)) return []
  const seen = new Set<string>()
  const out: JdSpecSkill[] = []
  for (const raw of v) {
    const skill = normalizeSkill(raw)
    if (skill && !seen.has(skill.term)) { seen.add(skill.term); out.push(skill) }
  }
  // Deterministic order: weight desc, then term asc — so the report/live score render stably.
  out.sort((a, b) => (b.weight - a.weight) || a.term.localeCompare(b.term))
  return out.slice(0, cap)
}

/** Defensive normalization — guarantees a clean, deterministic spec regardless of LLM jitter. */
const normalizeJdSpec = (raw: any): Omit<JDSpec, 'inputHash'> => {
  const seniorityRaw = cleanLower(raw?.seniority) as Seniority
  const seniority: Seniority = VALID_SENIORITY.includes(seniorityRaw) ? seniorityRaw : 'mid'

  let minYears: number | null = null
  const my = Number(raw?.minYears)
  if (Number.isFinite(my) && my >= 0) minYears = Math.min(50, Math.round(my))

  const responsibilities: JdSpecResponsibility[] = Array.isArray(raw?.responsibilities)
    ? raw.responsibilities
        .map((r: any) => ({ phrase: cleanStr(r?.phrase), keywords: cleanStrList(r?.keywords, true) }))
        .filter((r: JdSpecResponsibility) => r.phrase || r.keywords.length > 0)
        .slice(0, 6)
    : []

  // Ensure a term lives in only one bucket (required wins over preferred wins over domain).
  const required = normalizeSkillList(raw?.requiredSkills, 25)
  const claimed = new Set(required.map(s => s.term))
  const preferred = normalizeSkillList(raw?.preferredSkills, 25).filter(s => !claimed.has(s.term))
  preferred.forEach(s => claimed.add(s.term))
  const domain = normalizeSkillList(raw?.domainKeywords, 30).filter(s => !claimed.has(s.term))

  return {
    jobTitle: cleanStr(raw?.jobTitle),
    titleTerms: cleanStrList(raw?.titleTerms, true),
    seniority,
    minYears,
    requiredSkills: required,
    preferredSkills: preferred,
    domainKeywords: domain,
    responsibilities,
    certifications: cleanStrList(raw?.certifications, true),
  }
}

export const extractJdSpec = async (body: JdSpecBody): Promise<JDSpec> => {
  const preprocessedJD = body.jdText.slice(0, 12000)

  const inputHash = crypto.createHash('sha256').update(preprocessedJD).digest('hex')
  const cacheKey = `ai:jdspec:${inputHash}`

  const cached = await redis.get(cacheKey)
  if (cached) {
    const data = JSON.parse(cached) as JDSpec
    return { ...data, inputHash, cachedAt: Date.now() }
  }

  const prompt = buildJdSpecPrompt(preprocessedJD)
  const raw = await callLLMJSON<any>(prompt, { maxOutputTokens: 3000, temperature: 0.1 })

  if (!raw || typeof raw !== 'object') {
    throw new AppError('LLM_ERROR', 500, 'AI returned an unexpected format for the JD spec.')
  }

  const normalized = normalizeJdSpec(raw)

  // A usable spec must contain at least one weighted skill to score against.
  const totalSkills = normalized.requiredSkills.length + normalized.preferredSkills.length + normalized.domainKeywords.length
  if (totalSkills === 0) {
    throw new AppError('LLM_ERROR', 500, 'Could not extract any skills from this job description. Please provide more detail.')
  }

  const finalResult: JDSpec = { ...normalized, inputHash }

  // Cache for 24 hours — spec is resume-independent and keyed by JD content.
  await redis.setex(cacheKey, 60 * 60 * 24, JSON.stringify(finalResult))

  return finalResult
}

interface JdTailorLLMResponse {
  jdCompanyName: string; 
  jdRoleName: string; 
  rewrittenPersonalInfo?: any;
  rewrittenSections: ISection[] 
}

export const jdTailor = async (userId: string, body: JdTailorBody) => {
  const { resumeId, jdText, personalInfo, sections } = body
  const parsed = await callLLMJSON<JdTailorLLMResponse>(buildJdTailorPrompt({ personalInfo, sections: sections as ISection[], jdText }))
  if (!parsed.rewrittenSections || !Array.isArray(parsed.rewrittenSections)) throw new AppError('LLM_ERROR', 500, 'AI returned unexpected response format.')
  const history = await JDHistory.create({
    resumeId, userId, jdText,
    jdCompanyName:  parsed.jdCompanyName ?? '',
    jdRoleName:     parsed.jdRoleName ?? '',
    beforePersonalInfo: personalInfo,
    afterPersonalInfo:  parsed.rewrittenPersonalInfo,
    beforeSnapshot: sections,
    afterSnapshot:  parsed.rewrittenSections,
  })
  return { 
    historyId: history._id, 
    rewrittenPersonalInfo: parsed.rewrittenPersonalInfo, 
    rewrittenSections: parsed.rewrittenSections, 
    jdCompanyName: parsed.jdCompanyName, 
    jdRoleName: parsed.jdRoleName 
  }
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
  return { restoredPersonalInfo: history.beforePersonalInfo, restoredSections: history.beforeSnapshot }
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

// ─── Tailor Smart ───────────────────────────────────────────────────────────────
// Like tailorNew, but honors the user's per-skill decisions: `have` claimed normally,
// `mention` woven in WITHOUT claiming proficiency (keyword present for ATS only), `omit`
// left out. Returns the same full structured resume shape.

export const tailorSmart = async (body: TailorSmartBody): Promise<TailorNewResult> => {
  const {
    resumeText, jdText, skillsHave, skillsMention, skillsOmit, softSkillsAttempt,
    domainKeywords, responsibilityKeywords, titleTarget, allowGrowthLine,
  } = body
  const context: TailorSmartContext = {
    resumeText: resumeText.slice(0, 12000),
    jdText,
    buckets: { skillsHave, skillsMention, skillsOmit },
    softSkillsAttempt,
    domainKeywords,
    responsibilityKeywords,
    titleTarget,
    allowGrowthLine,
  }
  console.log('[TailorSmart][DEBUG] request context:', JSON.stringify(context, null, 2))

  const prompt = buildTailorSmartPrompt(context)
  const result = await callLLMJSON<TailorNewResult>(prompt, { maxOutputTokens: 8192, temperature: 0.2 })
  if (!result.personalInfo || !Array.isArray(result.sections)) {
    throw new AppError('LLM_ERROR', 500, 'AI returned an unexpected structure for the tailored resume.')
  }

  console.log('[TailorSmart][DEBUG] raw LLM result:', JSON.stringify(result, null, 2))

  const { result: fixedResult, warnings } = validateAndFixTailorSmart(result as TailorSmartResult, context)
  if (warnings.length > 0) {
    console.warn(`[TailorSmart][DEBUG] ${warnings.length} validation warning(s):`)
    warnings.forEach(w => console.warn('  -', w))
  } else {
    console.log('[TailorSmart][DEBUG] no validation warnings — output matched all placement rules.')
  }
  console.log('[TailorSmart][DEBUG] result after auto-fix:', JSON.stringify(fixedResult, null, 2))

  return fixedResult as TailorNewResult
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
  keywordsUsed: string[]
}

export const generateCoverLetter = async (body: CoverLetterBody): Promise<CoverLetterResult> => {
  const { resumeText, jdText, tone } = body
  const prompt = buildCoverLetterPrompt(resumeText.slice(0, 12000), jdText, tone)
  const result = await callLLMJSON<CoverLetterResult>(prompt, { maxOutputTokens: 3000, temperature: 0.3 })
  if (!result.body || typeof result.body !== 'string') {
    throw new AppError('LLM_ERROR', 500, 'AI returned an unexpected structure for the cover letter.')
  }
  if (!Array.isArray(result.keywordsUsed)) result.keywordsUsed = []
  return result
}

// ─── Cover Letter — Paragraph Rewrite ──────────────────────────────────────────

export interface RewriteParagraphResult {
  rewritten: string
}

export const rewriteCoverLetterParagraph = async (body: RewriteParagraphBody): Promise<RewriteParagraphResult> => {
  const { paragraph, instruction, tone, jdText } = body
  const prompt = buildRewriteParagraphPrompt(paragraph, instruction, tone, jdText)
  const result = await callLLMJSON<RewriteParagraphResult>(prompt, { maxOutputTokens: 700, temperature: 0.4 })
  if (!result.rewritten || typeof result.rewritten !== 'string') {
    throw new AppError('LLM_ERROR', 500, 'AI returned an unexpected structure for the paragraph rewrite.')
  }
  return result
}
