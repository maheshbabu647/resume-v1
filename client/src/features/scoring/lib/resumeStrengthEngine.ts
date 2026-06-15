import type { ResumeData } from '../../resume-builder/templates/shared/template.types'
import type {
  ResumeStrengthScore, StrengthCheck, StrengthDimension,
} from '../types/scoring.types'
import { APPROVED_ACTION_VERBS, WEAK_OPENERS } from '../constants/actionVerbs'
import { BUZZWORDS, FILLER_WORDS, PLACEHOLDER_MARKERS, FIRST_PERSON, OUTCOME_VERBS } from '../constants/contentLists'

/**
 * Advanced resume strength — CONTENT ONLY.
 *
 * Unlike the legacy quality engine, this awards ZERO points for template-guaranteed traits
 * (single column, standard headings, ATS-safety). Our own templates always win those, which
 * inflated every score. This judges only the writing: impact, quantification, verb strength,
 * specificity, signal density, and substance. Calibrated so a task-listing first draft lands
 * ~45–60 and must genuinely improve to climb.
 */

const DIMENSION_MAX: Record<StrengthDimension, number> = {
  impact: 30,
  language: 20,
  specificity: 20,
  density: 15,
  substance: 15,
}

const EXPERIENCE_KEYS = ['experience', 'internships', 'projects']

const labelFor = (score: number): ResumeStrengthScore['label'] => {
  if (score < 50) return 'Needs Work'
  if (score < 65) return 'Fair'
  if (score < 80) return 'Good'
  if (score < 90) return 'Strong'
  return 'Excellent'
}

const extractBullets = (text?: string): string[] =>
  !text ? [] : text.split('\n').map(t => t.trim()).filter(Boolean)

const firstWord = (b: string): string => b.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '') ?? ''

// A bullet shows a quantified result: %, $, or a number paired with a magnitude/scale unit.
const hasMetric = (b: string): boolean =>
  /[%$]/.test(b) ||
  /\b\d{1,3}(?:[.,]\d+)?\s?(?:%|x|k|m|bn|million|billion|thousand|users?|customers?|clients?|hours?|days?|weeks?|months?|projects?|people|members?|reps?|countries|markets|\+)\b/i.test(b) ||
  /\b\d{3,}\b/.test(b)

const numericTokens = (b: string): string[] => b.match(/\d+(?:[.,]\d+)?/g) ?? []

const countOccurrences = (haystack: string, needles: string[]): number => {
  let n = 0
  for (const w of needles) {
    const re = new RegExp(`(^|[^a-z0-9])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`, 'gi')
    n += (haystack.match(re) ?? []).length
  }
  return n
}

interface BulletEntry { ref: string; bullets: string[] }

export function calculateResumeStrength(resume: ResumeData): ResumeStrengthScore {
  const { personalInfo, sections } = resume
  const dimensionScores: Record<StrengthDimension, number> = { impact: 0, language: 0, specificity: 0, density: 0, substance: 0 }
  const failedChecks: StrengthCheck[] = []
  const passedChecks: string[] = []

  const award = (dim: StrengthDimension, pts: number) => { dimensionScores[dim] += pts }
  const fail = (checkId: string, dimension: StrengthDimension, pointsLost: number, message: string, affectedItems?: string[]) => {
    if (pointsLost <= 0) { passedChecks.push(checkId); return }
    failedChecks.push({ checkId, dimension, pointsLost: Math.round(pointsLost), message, ...(affectedItems?.length ? { affectedItems } : {}) })
  }
  const ratioPts = (ratio: number, max: number) => Math.round(Math.max(0, Math.min(1, ratio)) * max)

  // ── Gather impact bullets (experience / internships / projects) ──
  const impactEntries: BulletEntry[] = []
  const allImpactBullets: string[] = []
  sections.forEach(section => {
    if (!section.visible || !section.entries?.length) return
    if (!EXPERIENCE_KEYS.includes(section.key)) return
    section.entries.forEach((entry, idx) => {
      const bullets = extractBullets((entry as any).description)
      if (!bullets.length) return
      const title = (entry as any).jobTitle || (entry as any).projectName || (entry as any).role || `Entry ${idx + 1}`
      impactEntries.push({ ref: `${title} (${section.key})`, bullets })
      allImpactBullets.push(...bullets)
    })
  })
  const totalBullets = allImpactBullets.length
  const hasBullets = totalBullets > 0

  const summaryText = (personalInfo.summary ?? '').trim()
  const corpus = [summaryText, ...allImpactBullets].join(' \n ').toLowerCase()

  // ════════════ A. IMPACT & QUANTIFICATION (30) ════════════
  // quantification (18), outcome language (7), magnitude variety (5)
  if (hasBullets) {
    const quantified = allImpactBullets.filter(hasMetric)
    const quantRatio = quantified.length / totalBullets
    // Target ≥50% quantified for full credit.
    const quantPts = ratioPts(quantRatio / 0.5, 18)
    award('impact', quantPts)
    fail('impact-quantified', 'impact', 18 - quantPts,
      `Only ${Math.round(quantRatio * 100)}% of your bullets show a measurable result. Add numbers, %, $ or scale to at least half.`,
      impactEntries.filter(e => !e.bullets.some(hasMetric)).map(e => e.ref).slice(0, 6))

    const outcomeBullets = allImpactBullets.filter(b => countOccurrences(b.toLowerCase(), OUTCOME_VERBS) > 0)
    const outcomePts = ratioPts((outcomeBullets.length / totalBullets) / 0.4, 7)
    award('impact', outcomePts)
    fail('impact-outcome', 'impact', 7 - outcomePts,
      'Few bullets describe an outcome. Lead with what changed (increased, reduced, saved…), not just the task.')

    const distinctNums = new Set(quantified.flatMap(numericTokens))
    const varietyPts = distinctNums.size >= 3 ? 5 : distinctNums.size === 2 ? 3 : distinctNums.size === 1 ? 1 : 0
    award('impact', varietyPts)
    fail('impact-variety', 'impact', 5 - varietyPts,
      'Add a wider range of concrete metrics — varied numbers read as real impact, not boilerplate.')
  } else {
    fail('impact-no-bullets', 'impact', 30,
      'No experience or project bullets yet. Add bullets with measurable results to build strength.')
  }

  // ════════════ B. ACTION & LANGUAGE STRENGTH (20) ════════════
  // action verbs (10), weak openers (4), first-person/passive (3), verb variety (3)
  if (hasBullets) {
    const verbCounts = new Map<string, number>()
    let strongVerbBullets = 0
    const weakBullets: string[] = []
    const firstPersonBullets: string[] = []
    allImpactBullets.forEach(b => {
      const fw = firstWord(b)
      verbCounts.set(fw, (verbCounts.get(fw) ?? 0) + 1)
      if (APPROVED_ACTION_VERBS.has(fw)) strongVerbBullets++
      if (WEAK_OPENERS.includes(fw)) weakBullets.push(`"${b.slice(0, 32)}…"`)
      const lower = ` ${b.toLowerCase()} `
      if (FIRST_PERSON.some(p => lower.includes(` ${p} `)) || /\b(was|were)\b.*\bby\b/i.test(b)) {
        firstPersonBullets.push(`"${b.slice(0, 32)}…"`)
      }
    })

    const verbPts = ratioPts((strongVerbBullets / totalBullets) / 0.8, 10)
    award('language', verbPts)
    fail('lang-action-verb', 'language', 10 - verbPts,
      `Only ${Math.round((strongVerbBullets / totalBullets) * 100)}% of bullets start with a strong action verb (aim for 80%+).`)

    const weakPts = weakBullets.length === 0 ? 4 : Math.max(0, 4 - weakBullets.length)
    award('language', weakPts)
    fail('lang-weak-openers', 'language', 4 - weakPts,
      'Replace weak openers like "Responsible for", "Helped", "Worked on" with action verbs.', weakBullets.slice(0, 5))

    const fpPts = firstPersonBullets.length === 0 ? 3 : Math.max(0, 3 - firstPersonBullets.length)
    award('language', fpPts)
    fail('lang-first-person', 'language', 3 - fpPts,
      'Drop first-person pronouns ("I", "my", "we") and passive voice — write in implied first person.', firstPersonBullets.slice(0, 5))

    const topVerb = [...verbCounts.entries()].sort((a, b) => b[1] - a[1])[0]
    const overuse = topVerb && totalBullets >= 4 ? topVerb[1] / totalBullets : 0
    const varPts = overuse > 0.3 ? 0 : 3
    award('language', varPts)
    fail('lang-variety', 'language', 3 - varPts,
      `Vary your opening verbs — "${topVerb?.[0]}" starts ${Math.round(overuse * 100)}% of your bullets.`)
  } else {
    fail('lang-no-bullets', 'language', 20, 'Add bullets so your action verbs and phrasing can be evaluated.')
  }

  // ════════════ C. SPECIFICITY & DEPTH (20) ════════════
  // concrete references (8), length band (6), entry depth (3), specific summary (3)
  if (hasBullets) {
    const concrete = allImpactBullets.filter(b => /\d/.test(b) || /[A-Z][a-zA-Z0-9.+#]{2,}/.test(b))
    const concretePts = ratioPts((concrete.length / totalBullets) / 0.5, 8)
    award('specificity', concretePts)
    fail('spec-concrete', 'specificity', 8 - concretePts,
      'Name specific tools, technologies, or numbers in more bullets — concrete detail beats vague claims.')

    const inBand = allImpactBullets.filter(b => b.length >= 80 && b.length <= 200)
    const bandPts = ratioPts(inBand.length / totalBullets, 6)
    award('specificity', bandPts)
    const tooShort = allImpactBullets.filter(b => b.length < 60).length
    const tooLong = allImpactBullets.filter(b => b.length > 240).length
    fail('spec-length', 'specificity', 6 - bandPts,
      `Aim for substantial but focused bullets (~80–200 chars). ${tooShort} too short, ${tooLong} too long.`)
  } else {
    fail('spec-no-bullets', 'specificity', 14, 'Add detailed bullets to demonstrate specificity and depth.')
  }

  const deepEntries = impactEntries.filter(e => e.bullets.length >= 2).length
  const depthRatio = impactEntries.length ? deepEntries / impactEntries.length : 0
  const depthPts = ratioPts(depthRatio, 3)
  award('specificity', depthPts)
  fail('spec-depth', 'specificity', 3 - depthPts,
    'Give each role/project at least 2–3 bullets so your impact is clear.',
    impactEntries.filter(e => e.bullets.length < 2).map(e => e.ref).slice(0, 6))

  const summaryWords = summaryText.split(/\s+/).filter(Boolean).length
  const specificSummary = summaryText.length >= 40 && (summaryWords >= 12 || /\d/.test(summaryText))
  const sumPts = specificSummary ? 3 : 0
  award('specificity', sumPts)
  fail('spec-summary', 'specificity', 3 - sumPts,
    'Write a specific summary (role, years, domain) of at least ~12 words — avoid a one-line generic intro.')

  // ════════════ D. SIGNAL DENSITY / ANTI-FLUFF (15) ════════════
  // buzzwords (6), filler (5), redundancy (4)
  const buzzCount = countOccurrences(corpus, BUZZWORDS)
  const buzzPts = Math.max(0, 6 - buzzCount * 2)
  award('density', buzzPts)
  fail('density-buzzwords', 'density', 6 - buzzPts,
    `Remove generic clichés (${buzzCount} found) like "team player" or "results-driven" — they add no signal.`)

  const fillerCount = countOccurrences(corpus, FILLER_WORDS)
  const fillerPts = Math.max(0, 5 - Math.floor(fillerCount / 2))
  award('density', fillerPts)
  fail('density-filler', 'density', 5 - fillerPts,
    `Trim filler words (${fillerCount} found) such as "very", "successfully", "various" to tighten your writing.`)

  let redundantPts = 4
  if (hasBullets) {
    const norm = allImpactBullets.map(b => b.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim())
    const seen = new Set<string>()
    let dupes = 0
    norm.forEach(n => { if (n && seen.has(n)) dupes++; seen.add(n) })
    redundantPts = dupes === 0 ? 4 : Math.max(0, 4 - dupes)
    fail('density-redundancy', 'density', 4 - redundantPts,
      'Remove repeated or near-duplicate bullets across roles — each line should earn its place.')
  } else { passedChecks.push('density-redundancy') }
  award('density', redundantPts)

  // ════════════ E. SUBSTANCE COMPLETENESS (15) ════════════
  // summary (4), skills depth (5), core content (4), no placeholders (2)
  const summaryPts = summaryText.length >= 40 ? 4 : 0
  award('substance', summaryPts)
  fail('sub-summary', 'substance', 4 - summaryPts, 'Add a professional summary of at least ~40 characters.')

  const skillsSection = sections.find(s => s.key === 'skills' && s.visible)
  const skillCats = (skillsSection?.entries ?? []).filter(e => (e as any).category).length
  const skillList = (skillsSection?.entries ?? [])
    .flatMap(e => ((e as any).skillList ? ((e as any).skillList as string).split(',') : []))
    .map(s => s.trim()).filter(Boolean)
  const countPts = skillList.length >= 8 ? 3 : ratioPts(skillList.length / 8, 3)
  const catPts = skillCats >= 2 ? 2 : 0
  award('substance', countPts + catPts)
  fail('sub-skills', 'substance', (3 - countPts) + (2 - catPts),
    `List more skills across categories — you have ${skillList.length} skill(s) in ${skillCats} categor${skillCats === 1 ? 'y' : 'ies'} (aim for 8+ in 2+).`)

  const corePts = hasBullets ? 4 : 0
  award('substance', corePts)
  fail('sub-core', 'substance', 4 - corePts, 'Add at least one experience or project with real, written bullets.')

  const placeholderHits = countOccurrences(corpus, PLACEHOLDER_MARKERS)
  const phPts = placeholderHits === 0 ? 2 : 0
  award('substance', phPts)
  fail('sub-placeholder', 'substance', 2 - phPts, 'Replace leftover placeholder/template text with real content.')

  // ── Totals ──
  ;(Object.keys(dimensionScores) as StrengthDimension[]).forEach(k => {
    dimensionScores[k] = Math.max(0, Math.min(DIMENSION_MAX[k], Math.round(dimensionScores[k])))
  })
  const totalScore = Math.max(0, Math.min(100,
    (Object.keys(dimensionScores) as StrengthDimension[]).reduce((sum, k) => sum + dimensionScores[k], 0)))

  failedChecks.sort((a, b) => b.pointsLost - a.pointsLost)

  return {
    totalScore,
    label: labelFor(totalScore),
    dimensionScores,
    dimensionMax: DIMENSION_MAX,
    failedChecks,
    passedChecks,
  }
}
