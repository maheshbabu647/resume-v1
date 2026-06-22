// tailorSmartValidator.ts — a server-side safety net for /ai/tailor-smart output.
//
// The prompt instructs the LLM on placement (Mention → "Familiar With" category only,
// soft skills → never a Skills entry, etc.), but an instruction is not a guarantee — LLMs
// skip self-check steps. This module re-checks the LLM's actual JSON output against the
// same rules and AUTO-FIXES the structural violations that are safe to fix mechanically
// (moving a list item between categories), while only WARNING on violations that would
// require rewriting prose to fix safely (an overclaiming bullet) rather than risk mangling
// the candidate's resume text. Every finding is logged for debugging.

import type { ISection } from '../../models/Resume.model'
import type { TailorSmartContext } from './prompts/tailorSmart.prompt'

interface SkillEntry {
  category?: string
  skillList?: string
  [key: string]: unknown
}

export interface TailorSmartResult {
  jdCompanyName: string
  jdRoleName: string
  personalInfo: Record<string, unknown>
  sections: ISection[]
}

const FAMILIAR_WITH_CATEGORY = 'Familiar With'
const MENTION_CATEGORY_PATTERN = /familiar|exposure|learning|developing/i

// Terms that should NEVER appear as a bare Skills-section list item, regardless of which
// bucket they arrived in — they must be demonstrated in a sentence or not appear at all.
const SOFT_SKILL_TERMS = [
  'communication', 'leadership', 'teamwork', 'collaboration', 'problem-solving', 'problem solving',
  'adaptability', 'attention to detail', 'time management', 'ownership', 'mentoring', 'mentorship',
  'critical thinking', 'creativity', 'work ethic', 'interpersonal skills', 'interpersonal',
  'organization', 'organizational skills', 'flexibility', 'self-motivation', 'self motivation',
]

const splitSkillList = (raw: string | undefined): string[] =>
  (raw ?? '').split(',').map(s => s.trim()).filter(Boolean)

const joinSkillList = (items: string[]): string => items.join(', ')

const normalize = (s: string): string => s.toLowerCase().trim()

const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Hyphen vs. space is the single most common false-mismatch ("problem-solving" vs.
// "problem solving") — treat both forms as equivalent for matching purposes only.
const normalizeForMatch = (s: string): string => normalize(s).replace(/[-_]/g, ' ')

const wordBoundaryIncludes = (text: string, term: string): boolean =>
  new RegExp(`(^|[^a-z0-9])${escapeRe(normalizeForMatch(term))}([^a-z0-9]|$)`, 'i').test(normalizeForMatch(text))

/**
 * Walks every section's entries collecting plain prose (descriptions, summaries, achievements)
 * EXCLUDING the skills section itself — this is "everywhere a skill could be overclaimed."
 */
const collectProseText = (result: TailorSmartResult): string => {
  const parts: string[] = [String(result.personalInfo?.summary ?? '')]
  for (const section of result.sections ?? []) {
    if (section.key === 'skills') continue
    for (const entry of section.entries ?? []) {
      for (const [key, value] of Object.entries(entry as Record<string, unknown>)) {
        if (typeof value === 'string' && /description|achievements|summary/i.test(key)) {
          parts.push(value)
        }
      }
    }
  }
  return normalize(parts.join(' \n '))
}

export function validateAndFixTailorSmart(
  result: TailorSmartResult,
  ctx: TailorSmartContext,
): { result: TailorSmartResult; warnings: string[] } {
  const warnings: string[] = []
  const skillsSection = result.sections?.find(s => s.key === 'skills')
  const skillsEntries = (skillsSection?.entries ?? []) as SkillEntry[]
  const proseText = collectProseText(result)

  const mentionSet = new Set(ctx.buckets.skillsMention.map(normalize))
  const haveSet = new Set(ctx.buckets.skillsHave.map(normalize))

  // ── 1. Soft skills must never be a bare Skills-list item, regardless of bucket. ──
  for (const entry of skillsEntries) {
    const items = splitSkillList(entry.skillList)
    const kept = items.filter(item => {
      const isSoft = SOFT_SKILL_TERMS.some(soft => normalizeForMatch(item) === normalizeForMatch(soft))
      if (isSoft) {
        warnings.push(`[soft-skill-stripped] "${item}" was listed in Skills category "${entry.category}" — soft skills/traits can never be a bare Skills entry. Stripped it; it should instead be demonstrated in a sentence, or left out if nothing supports it.`)
      }
      return !isSoft
    })
    if (kept.length !== items.length) entry.skillList = joinSkillList(kept)
  }

  // ── 2. Mention terms must live in a dedicated, clearly-labeled category — not mixed ──
  //       into a category that also contains a HAVE term, and not in an unlabeled category.
  let familiarEntry: SkillEntry | undefined = skillsEntries.find(e => MENTION_CATEGORY_PATTERN.test(e.category ?? ''))

  for (const entry of skillsEntries) {
    if (entry === familiarEntry) continue
    const items = splitSkillList(entry.skillList)
    const misplacedMentions = items.filter(item => mentionSet.has(normalize(item)))
    if (misplacedMentions.length === 0) continue

    const categoryHasHave = items.some(item => haveSet.has(normalize(item)))
    const isLabeledMentionCategory = MENTION_CATEGORY_PATTERN.test(entry.category ?? '')
    if (isLabeledMentionCategory) continue // already correctly placed, just not the "first" one found

    for (const term of misplacedMentions) {
      warnings.push(`[mention-misplaced] "${term}" was placed in category "${entry.category}"${categoryHasHave ? ' alongside a HAVE skill' : ''} instead of a dedicated "Familiar With" category. Moved it.`)
    }
    entry.skillList = joinSkillList(items.filter(item => !mentionSet.has(normalize(item))))

    if (!familiarEntry) {
      familiarEntry = { category: FAMILIAR_WITH_CATEGORY, skillList: '' }
      skillsEntries.push(familiarEntry)
    }
    const existing = splitSkillList(familiarEntry.skillList)
    familiarEntry.skillList = joinSkillList([...existing, ...misplacedMentions])
  }

  if (skillsSection) {
    skillsSection.entries = skillsEntries.filter(e => splitSkillList(e.skillList).length > 0) as unknown as ISection['entries']
  }

  // ── 3. Mention terms missing entirely (LLM dropped them silently). ──
  const allSkillText = normalize(skillsEntries.map(e => e.skillList ?? '').join(', '))
  for (const term of ctx.buckets.skillsMention) {
    if (!wordBoundaryIncludes(allSkillText, term)) {
      warnings.push(`[mention-missing] "${term}" was marked Mention but never appears anywhere in the Skills section.`)
    }
  }

  // ── 4. Mention terms that got overclaimed in prose (bullets/summary). Cannot safely ──
  //       auto-fix free text without risking mangling real content — warn loudly instead.
  for (const term of ctx.buckets.skillsMention) {
    if (wordBoundaryIncludes(proseText, term)) {
      warnings.push(`[mention-overclaimed] "${term}" was marked Mention (candidate does NOT have it) but appears in a bullet/summary — this may imply real usage. Needs manual review.`)
    }
  }

  // ── 5. HAVE terms missing entirely. Hard skills get safely auto-restored (a plain ──
  //       append to the Skills section); soft skills are only warned about, since blindly
  //       appending them would recreate the exact violation rule #1 just fixed.
  let restoreEntry: SkillEntry | undefined
  for (const term of ctx.buckets.skillsHave) {
    const inSkills = wordBoundaryIncludes(allSkillText, term)
    const inProse = wordBoundaryIncludes(proseText, term)
    if (inSkills || inProse) continue

    const isSoft = SOFT_SKILL_TERMS.some(soft => normalizeForMatch(soft) === normalizeForMatch(term))
    if (isSoft) {
      warnings.push(`[have-missing] "${term}" was marked Have but doesn't appear anywhere on the resume — soft skill, left for manual review (can't safely auto-add without a real evidence sentence).`)
      continue
    }

    if (!restoreEntry) {
      restoreEntry = skillsEntries.find(e => /additional|other/i.test(e.category ?? ''))
      if (!restoreEntry) {
        restoreEntry = { category: 'Additional Skills', skillList: '' }
        skillsEntries.push(restoreEntry)
      }
    }
    const existing = splitSkillList(restoreEntry.skillList)
    restoreEntry.skillList = joinSkillList([...existing, term])
    warnings.push(`[have-missing-restored] "${term}" was marked Have but the LLM dropped it from the Skills section entirely. Re-added it under "${restoreEntry.category}".`)
  }
  if (restoreEntry && skillsSection) {
    skillsSection.entries = skillsEntries.filter(e => splitSkillList(e.skillList).length > 0) as unknown as ISection['entries']
  }

  // ── 6. Growth-line / title-target cardinality checks. Count by SENTENCE, not by marker —
  //       overlapping marker phrases (e.g. "actively building depth" contains "building depth")
  //       must not double-count the same clause as two separate growth-lines.
  const summary = normalize(String(result.personalInfo?.summary ?? ''))
  const growthMarkers = ['actively building depth', 'developing experience with', 'developing depth in', 'building depth in']
  const sentences = summary.split(/(?<=[.!?])\s+/).filter(Boolean)
  const growthSentences = sentences.filter(sentence => growthMarkers.some(m => sentence.includes(m)))
  const growthHits = growthSentences.length
  if (!ctx.allowGrowthLine && growthHits > 0) {
    warnings.push(`[growth-line-not-allowed] A growth-framing clause appears in the summary even though allowGrowthLine was false.`)
  }
  if (growthHits > 1) {
    warnings.push(`[growth-line-multiple] ${growthHits} growth-framing clauses detected — only one was allowed.`)
  }

  const titleMarker = 'currently looking for opportunities as'
  const hasTitleClause = summary.includes(titleMarker)
  if (hasTitleClause && !ctx.titleTarget?.eligible) {
    warnings.push(`[title-target-not-eligible] A title-targeting clause appears in the summary even though title targeting was not eligible.`)
  }

  return { result, warnings }
}
