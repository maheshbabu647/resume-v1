import type { ResumeData } from '../../resume-builder/templates/shared/template.types'
import type {
  JDSpec, JdSpecSkill, AtsSkillMatch, AtsMatchResult, AtsLabel, MatchZone,
} from '../types/scoring.types'

/**
 * Deterministic, client-side ATS match engine.
 *
 * Scores a resume against a weighted JD-Spec (extracted ONCE by the LLM). Because this
 * runs purely on text, it recomputes instantly on every keystroke — and produces BOTH the
 * report score and the live score, so they are identical by construction.
 *
 * Final score (0..100):
 *   100 * ( 0.55*RequiredCoverage + 0.20*PreferredCoverage + 0.10*TitleMatch + 0.15*ContextCoverage )
 *
 * Match ladder per term: exact 1.0 → stemmed 0.9 → fuzzy substring 0.8 → 0.
 * Placement modifier (real-ATS bonus): both zones 1.0 / experience 0.95 / skills 0.85 / other 0.9.
 * Soft skills are down-weighted ×0.4 (engines discount traits everyone claims).
 */

const WEIGHTS = { required: 0.55, preferred: 0.20, title: 0.10, context: 0.15 }
const SOFT_MULTIPLIER = 0.4

const EXPERIENCE_KEYS = [
  'experience', 'internships', 'projects', 'volunteering',
  'clinicalExperience', 'teachingExperience', 'grants',
]

// ── Text primitives ─────────────────────────────────────────────────────────────
// Keep + # . / - inside tokens so c++, c#, .net, node.js, ci/cd survive normalization.
const normalize = (s: unknown): string =>
  (typeof s === 'string' ? s : '')
    .toLowerCase()
    .replace(/[^a-z0-9+#./\- ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const stem = (w: string): string => w.replace(/(ing|edly|ed|es|s)$/i, '')

const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Phrase present with non-alphanumeric boundaries (for multiword terms like "machine learning").
const phraseInText = (text: string, phrase: string): boolean =>
  new RegExp(`(^|[^a-z0-9])${escapeRe(phrase)}([^a-z0-9]|$)`).test(text)

interface Zone {
  text: string
  tokens: Set<string>
  stems: Set<string>
}

const makeZone = (parts: string[]): Zone => {
  const text = normalize(parts.join(' '))
  const tokens = new Set(text.split(' ').filter(Boolean))
  const stems = new Set<string>()
  tokens.forEach(t => stems.add(stem(t)))
  return { text, tokens, stems }
}

/** Best match level (0..1) of any variant within one zone. */
const matchLevelInZone = (variants: string[], zone: Zone): number => {
  let best = 0
  for (const v of variants) {
    if (!v) continue
    if (v.includes(' ')) {
      if (phraseInText(zone.text, v)) { best = Math.max(best, 1.0) }
      else if (v.length >= 5 && zone.text.includes(v)) { best = Math.max(best, 0.8) }
    } else {
      if (zone.tokens.has(v)) { best = Math.max(best, 1.0) }
      else if (zone.stems.has(stem(v))) { best = Math.max(best, 0.9) }
      else if (v.length >= 4 && zone.text.includes(v)) { best = Math.max(best, 0.8) }
    }
    if (best >= 1.0) break
  }
  return best
}

// ── Resume → zoned text ─────────────────────────────────────────────────────────
interface ResumeZones { skills: Zone; experience: Zone; other: Zone }

const buildZones = (resume: ResumeData): ResumeZones => {
  const skillsParts: string[] = []
  const expParts: string[] = []
  const otherParts: string[] = [resume.personalInfo?.title ?? '', resume.personalInfo?.summary ?? '']

  for (const section of resume.sections ?? []) {
    if (!section.visible || !section.entries?.length) continue
    const key = section.key
    for (const entry of section.entries) {
      const desc = (entry as any).description ?? ''
      if (key === 'skills') {
        skillsParts.push((entry as any).category ?? '', (entry as any).skillList ?? '')
      } else if (EXPERIENCE_KEYS.includes(key)) {
        const tech = (entry as any).techStack ?? ''
        if (tech) skillsParts.push(tech) // tech stack is a skills listing too
        expParts.push(
          (entry as any).jobTitle ?? '', (entry as any).company ?? '',
          (entry as any).projectName ?? '', (entry as any).role ?? '', tech, desc,
        )
      } else {
        // education, certifications, languages, custom… → "other" zone
        otherParts.push(Object.values(entry).filter(v => typeof v === 'string').join(' '))
      }
    }
  }

  return {
    skills: makeZone(skillsParts),
    experience: makeZone(expParts),
    other: makeZone(otherParts),
  }
}

// ── Per-skill evaluation ─────────────────────────────────────────────────────────
const placementFactor = (zones: MatchZone[]): number => {
  const inSkills = zones.includes('skills')
  const inExp = zones.includes('experience')
  if (inSkills && inExp) return 1.0
  if (inExp) return 0.95
  if (inSkills) return 0.85
  if (zones.includes('other')) return 0.9
  return 0
}

const evaluateSkill = (skill: JdSpecSkill, z: ResumeZones): AtsSkillMatch => {
  const variants = [skill.term, ...(skill.aliases ?? [])]
  const lvlSkills = matchLevelInZone(variants, z.skills)
  const lvlExp = matchLevelInZone(variants, z.experience)
  const lvlOther = matchLevelInZone(variants, z.other)

  const foundIn: MatchZone[] = []
  if (lvlSkills > 0) foundIn.push('skills')
  if (lvlExp > 0) foundIn.push('experience')
  if (lvlOther > 0) foundIn.push('other')

  const bestLevel = Math.max(lvlSkills, lvlExp, lvlOther)
  const matchValue = Math.min(1, bestLevel * placementFactor(foundIn))

  return {
    term: skill.term,
    weight: skill.weight,
    type: skill.type,
    matched: matchValue > 0,
    matchValue,
    foundIn,
  }
}

const effectiveWeight = (m: { weight: number; type: string }): number =>
  m.weight * (m.type === 'soft' ? SOFT_MULTIPLIER : 1)

/** Weighted coverage of a list, 0..1. Empty list → 1 (nothing to miss). */
const coverage = (matches: AtsSkillMatch[]): number => {
  if (matches.length === 0) return 1
  let num = 0, den = 0
  for (const m of matches) {
    const w = effectiveWeight(m)
    num += w * m.matchValue
    den += w
  }
  return den === 0 ? 1 : num / den
}

export const labelFor = (score: number): AtsLabel => {
  if (score < 50) return 'Weak match'
  if (score < 65) return 'Partial match'
  if (score < 75) return 'Decent match'
  if (score < 90) return 'Strong match'
  return 'Excellent match'
}

export function calculateAtsMatch(resume: ResumeData, spec: JDSpec): AtsMatchResult {
  const z = buildZones(resume)

  const requiredSkills = (spec.requiredSkills ?? []).map(s => evaluateSkill(s, z))
  const preferredSkills = (spec.preferredSkills ?? []).map(s => evaluateSkill(s, z))
  const domainKeywords = (spec.domainKeywords ?? []).map(s => evaluateSkill(s, z))

  // Context coverage = domain keywords ∪ responsibility keywords (the deterministic
  // stand-in for "semantic overlap" — the LLM already extracted the meaningful terms).
  const respSkills: AtsSkillMatch[] = (spec.responsibilities ?? []).flatMap(r =>
    (r.keywords ?? []).map(kw => evaluateSkill({ term: kw, aliases: [], weight: 1, type: 'hard' }, z)),
  )
  // De-duplicated view for the UI — scoring above intentionally uses the raw (possibly
  // repeated) list so each responsibility's weight is counted once per occurrence.
  const respSkillsDisplay = Array.from(new Map(respSkills.map(s => [s.term, s])).values())
  const contextMatches = [...domainKeywords, ...respSkills]

  // Title match — across all zones.
  const titleVariants = spec.titleTerms?.length ? spec.titleTerms : (spec.jobTitle ? [normalize(spec.jobTitle)] : [])
  const titleLevel = Math.max(
    matchLevelInZone(titleVariants, z.skills),
    matchLevelInZone(titleVariants, z.experience),
    matchLevelInZone(titleVariants, z.other),
  )

  const components = {
    required: coverage(requiredSkills),
    preferred: coverage(preferredSkills),
    title: titleLevel,
    context: coverage(contextMatches),
  }

  const score = Math.round(100 * (
    WEIGHTS.required * components.required +
    WEIGHTS.preferred * components.preferred +
    WEIGHTS.title * components.title +
    WEIGHTS.context * components.context
  ))

  const evaluated = [...requiredSkills, ...preferredSkills]
  const missing = evaluated
    .filter(m => !m.matched)
    .sort((a, b) => b.weight - a.weight)
  const matchedCount = evaluated.filter(m => m.matched).length

  return {
    score: Math.max(0, Math.min(100, score)),
    label: labelFor(score),
    components,
    titleMatched: titleLevel >= 0.8,
    requiredSkills,
    preferredSkills,
    domainKeywords,
    responsibilityKeywords: respSkillsDisplay,
    missing,
    matchedCount,
    totalCount: evaluated.length,
    seniority: spec.seniority,
    jobTitle: spec.jobTitle,
    titleTerms: titleVariants,
    responsibilities: spec.responsibilities ?? [],
  }
}

// ── Smart Tailor helpers ─────────────────────────────────────────────────────────

// Realistic match value for a skill the user adds via tailoring (placed in skills, maybe
// woven into experience). NOT 1.0 — a freshly-added keyword never scores a perfect match.
const ADDED_MATCH = 0.9

/**
 * Runs the SAME deterministic engine against a raw resume-text blob (for the /jd-tailor
 * flow, where the resume isn't structured yet). The text is treated as experience content,
 * so the baseline mirrors what the editor will compute once the resume is loaded.
 */
export function atsMatchFromText(spec: JDSpec, text: string): AtsMatchResult {
  const fakeResume = {
    personalInfo: { title: '', summary: '' },
    sections: [{ key: 'experience', visible: true, entries: [{ description: text }] }],
  } as unknown as ResumeData
  return calculateAtsMatch(fakeResume, spec)
}

// Realistic post-tailor floors: tailoring sets the targeted job title and weaves the JD's
// responsibilities/domain keywords into the bullets, so these components rise regardless of
// the skill triage. We floor them (never below the resume's current value) so the projection
// reflects what tailoring actually delivers — and matches the editor's post-tailor score.
const TITLE_FLOOR = 0.92
const CONTEXT_FLOOR = 0.8

/**
 * Projected ATS score for the Smart Tailor screen, 0..100 — built on the SAME engine and
 * baseline as the editor, so the numbers agree (no impossible free 100, no misleading low cap).
 *
 * Required/preferred coverage follows the user's skill decisions:
 *   • included + already in resume → keep its real match value (placement-aware)
 *   • included + currently missing  → ADDED_MATCH (it will be added by tailoring)
 *   • left out                      → 0
 * Title and context model the POST-tailor state (floored), because tailoring targets the
 * title and weaves the responsibilities in no matter which skills you keep.
 */
// ── Smart Tailor request payload ─────────────────────────────────────────────────

export interface SmartTailorAux {
  domainKeywords: { matched: string[]; missing: string[] }
  responsibilityKeywords: { matched: string[]; missing: string[] }
  titleTarget?: { eligible: boolean; targetTitle: string }
  allowGrowthLine: boolean
}

/**
 * Builds the auto-determined (non-triaged) part of the /ai/tailor-smart request from the
 * same baseline AtsMatchResult the report/projection already use — domain keywords,
 * responsibility keywords, and title-targeting are never something the user triages like a
 * skill; they're derived straight from what the deterministic engine already found true.
 */
export function buildSmartTailorAux(baseline: AtsMatchResult): SmartTailorAux {
  const split = (matches: AtsSkillMatch[]) => ({
    matched: matches.filter(m => m.matched).map(m => m.term),
    missing: matches.filter(m => !m.matched).map(m => m.term),
  })
  const domainKeywords = split(baseline.domainKeywords)
  const responsibilityKeywords = split(baseline.responsibilityKeywords)
  const titleTarget = baseline.jobTitle
    ? { eligible: baseline.titleMatched, targetTitle: baseline.jobTitle }
    : undefined
  const allowGrowthLine = (domainKeywords.missing.length + responsibilityKeywords.missing.length) > 0

  return { domainKeywords, responsibilityKeywords, titleTarget, allowGrowthLine }
}

export function projectAtsScore(baseline: AtsMatchResult, includedTerms: Set<string>): { score: number; label: AtsLabel } {
  const cov = (list: AtsSkillMatch[]): number => {
    if (!list.length) return 1
    let num = 0, den = 0
    for (const m of list) {
      const w = m.weight * (m.type === 'soft' ? SOFT_MULTIPLIER : 1)
      den += w
      if (includedTerms.has(m.term)) num += w * (m.matched ? m.matchValue : ADDED_MATCH)
    }
    return den === 0 ? 1 : num / den
  }
  const required = cov(baseline.requiredSkills)
  const preferred = cov(baseline.preferredSkills)
  const title = Math.max(baseline.components.title, TITLE_FLOOR)
  const context = Math.max(baseline.components.context, CONTEXT_FLOOR)
  const raw = 100 * (
    WEIGHTS.required * required +
    WEIGHTS.preferred * preferred +
    WEIGHTS.title * title +
    WEIGHTS.context * context
  )
  const score = Math.max(0, Math.min(100, Math.round(raw)))
  return { score, label: labelFor(score) }
}
