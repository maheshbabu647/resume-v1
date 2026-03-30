import type { ResumeData } from '../../resume-builder/templates/shared/template.types'
import type {
  ResumeQualityScore,
  FailedCheck,
  ScoreDimension,
} from '../types/scoring.types'
import { CHECKS } from '../constants/checks'
import { APPROVED_ACTION_VERBS, WEAK_OPENERS } from '../constants/actionVerbs'

function determineLabel(score: number): ResumeQualityScore['label'] {
  if (score < 40) return 'Needs Work'
  if (score < 60) return 'Fair'
  if (score < 80) return 'Good'
  if (score < 90) return 'Strong'
  return 'Excellent'
}

type CheckFailer = (
  checkId: keyof typeof CHECKS,
  dimension: ScoreDimension,
  pointsLost: number,
  affectedItems?: string[]
) => void

type CheckPasser = (checkId: keyof typeof CHECKS) => void

export function calculateResumeQuality(resume: ResumeData): ResumeQualityScore {
  let score = 100
  const dimensionScores = {
    completeness: 25,
    bulletQuality: 35,
    structure: 20,
    atsSafety: 10,
    keywordDensity: 10,
  }
  const failedChecks: FailedCheck[] = []
  const passedChecks: string[] = []

  const fail: CheckFailer = (checkId, dimension, pointsLost, affectedItems) => {
    score -= pointsLost
    dimensionScores[dimension] -= pointsLost
    failedChecks.push({
      checkId,
      dimension,
      pointsLost,
      message: CHECKS[checkId],
      ...(affectedItems && affectedItems.length > 0 && { affectedItems }),
    })
  }

  const pass: CheckPasser = (checkId) => passedChecks.push(checkId)

  const { personalInfo, sections } = resume

  // --- Dimension 1: Completeness (25 points) ---

  // completeness-header (10)
  const isHeaderValid =
    !!personalInfo.fullName?.trim() &&
    !!personalInfo.title?.trim() &&
    !!personalInfo.email?.trim() &&
    !!personalInfo.phone?.trim() &&
    personalInfo.contactLinks &&
    personalInfo.contactLinks.length > 0
  if (!isHeaderValid) fail('completeness-header', 'completeness', 10)
  else pass('completeness-header')

  // completeness-summary (5)
  const summaryText = personalInfo.summary?.trim() || ''
  if (summaryText.length < 40) fail('completeness-summary', 'completeness', 5)
  else pass('completeness-summary')

  // completeness-core-section (5)
  const coreSections = ['experience', 'internships', 'projects']
  const hasCore = sections.some(
    (s) => s.visible && coreSections.includes(s.key) && s.entries.length > 0
  )
  if (!hasCore) fail('completeness-core-section', 'completeness', 5)
  else pass('completeness-core-section')

  // completeness-no-empty-sections (5)
  const emptyVisibleSections = sections.filter(
    (s) => s.visible && s.entries.length === 0
  )
  if (emptyVisibleSections.length > 0) {
    fail(
      'completeness-no-empty-sections',
      'completeness',
      5,
      emptyVisibleSections.map((s) => s.key)
    )
  } else pass('completeness-no-empty-sections')

  // --- Helpers for Bullets ---
  const extractBullets = (text?: string): string[] => {
    if (!text) return []
    return text
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
  }

  // Gather all bullets from relevant sections
  const bulletEntries: {
    sectionKey: string
    title: string
    bullets: string[]
  }[] = []

  const actionVerbRelevantSections = ['experience', 'internships', 'projects']
  const quantRelevantSections = ['experience', 'internships']

  let totalBullets = 0
  let validActionVerbsCount = 0
  const missingActionVerbItems: string[] = []

  const unquantifiedEntries: string[] = []
  const thinEntries: string[] = []
  const shortBullets: string[] = []
  const longBullets: string[] = []
  const weakOpenerBullets: string[] = []

  sections.forEach((section) => {
    if (!section.visible || section.entries.length === 0) return

    section.entries.forEach((entry, idx) => {
      const bullets = extractBullets(entry.description)
      if (bullets.length === 0) return

      const entryTitle =
        entry.jobTitle || entry.projectName || entry.role || `Entry ${idx + 1}`
      const entryRefString = `${entryTitle} (${section.key})`

      bulletEntries.push({ sectionKey: section.key, title: entryTitle, bullets })

      // Action Verbs checking
      if (actionVerbRelevantSections.includes(section.key)) {
        bullets.forEach((bullet) => {
          totalBullets++
          const firstWord = bullet.split(' ')[0]?.toLowerCase().replace(/[^a-z]/g, '')
          if (APPROVED_ACTION_VERBS.has(firstWord)) {
            validActionVerbsCount++
          } else {
            missingActionVerbItems.push(`"${bullet.substring(0, 30)}..." in ${entryRefString}`)
          }
          if (WEAK_OPENERS.includes(firstWord)) {
            weakOpenerBullets.push(`"${bullet.substring(0, 30)}..." in ${entryRefString}`)
          }

          // Length checks (apply to all bullets globally)
          if (bullet.length < 80) shortBullets.push(`Too short: "${bullet.substring(0, 30)}..."`)
          if (bullet.length > 220) longBullets.push(`Too long: "${bullet.substring(0, 30)}..."`)
        })
      }

      // Quantification checking
      if (quantRelevantSections.includes(section.key)) {
        const hasNumber = bullets.some((b) => /\d/.test(b) || /%|\$/.test(b))
        if (!hasNumber) {
          unquantifiedEntries.push(entryRefString)
        }

        // Thin section checking
        if (bullets.length < 2) {
          thinEntries.push(entryRefString)
        }
      }
    })
  })

  // --- Dimension 2: Bullet Quality / STAR (35 points) ---

  // bullet-action-verb (10)
  if (totalBullets > 0) {
    const actionVerbRatio = validActionVerbsCount / totalBullets
    if (actionVerbRatio < 0.8) {
      fail('bullet-action-verb', 'bulletQuality', 10, missingActionVerbItems.slice(0, 5))
    } else pass('bullet-action-verb')
  } else pass('bullet-action-verb') // Give benefit of doubt if no bullets exist yet

  // bullet-quantified (10)
  if (unquantifiedEntries.length > 0) {
    fail('bullet-quantified', 'bulletQuality', 10, unquantifiedEntries)
  } else pass('bullet-quantified')

  // bullet-length-min (4)
  if (shortBullets.length > 0) {
    fail('bullet-length-min', 'bulletQuality', 4, shortBullets.slice(0, 5))
  } else pass('bullet-length-min')

  // bullet-length-max (4)
  if (longBullets.length > 0) {
    fail('bullet-length-max', 'bulletQuality', 4, longBullets.slice(0, 5))
  } else pass('bullet-length-max')

  // bullet-thin-section (5)
  if (thinEntries.length > 0) {
    fail('bullet-thin-section', 'bulletQuality', 5, thinEntries)
  } else pass('bullet-thin-section')

  // bullet-no-weak-openers (2)
  if (weakOpenerBullets.length > 0) {
    fail('bullet-no-weak-openers', 'bulletQuality', 2, weakOpenerBullets.slice(0, 5))
  } else pass('bullet-no-weak-openers')

  // --- Dimension 3: Structure & Readability (20 points) ---

  // structure-has-summary (5)
  if (summaryText.length < 40) fail('structure-has-summary', 'structure', 5)
  else pass('structure-has-summary')

  const skillsSection = sections.find((s) => s.key === 'skills' && s.visible)
  const skillsCategories = skillsSection?.entries?.filter((e) => e.category) || []

  // Count individual skills properly (handle comma separated strings)
  const allSkills = (skillsSection?.entries || [])
    .flatMap((e) => (e.skillList ? (e.skillList as string).split(',') : []))
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  // structure-skills-categorized (5)
  if (skillsCategories.length < 2) fail('structure-skills-categorized', 'structure', 5)
  else pass('structure-skills-categorized')

  // structure-skills-count (5)
  if (allSkills.length < 8) fail('structure-skills-count', 'structure', 5)
  else pass('structure-skills-count')

  // structure-non-experience-sections (5)
  const readableSectionsCount = sections.filter(
    (s) =>
      s.visible &&
      ['education', 'skills', 'projects', 'certifications', 'volunteering'].includes(s.key) &&
      s.entries.length > 0
  ).length

  if (readableSectionsCount < 2) fail('structure-non-experience-sections', 'structure', 5)
  else pass('structure-non-experience-sections')

  // --- Dimension 4: ATS Parsing Safety (10 points) ---
  // We assume ATS templates are enforced by the UI rendering a single column
  // ats-single-column (4)
  pass('ats-single-column')

  // ats-no-images-in-text (3) - Currently not supported by editor so guaranteed pass
  pass('ats-no-images-in-text')

  // ats-standard-headings (3) - Enforced by our built-in templates
  pass('ats-standard-headings')

  // --- Dimension 5: Keyword Density (10 points) ---

  // keyword-skills-count (5)
  if (allSkills.length < 10) fail('keyword-skills-count', 'keywordDensity', 5)
  else pass('keyword-skills-count')

  // keyword-no-duplicate-sections (3)
  const seenKeys = new Set()
  const dupes: string[] = []
  sections.forEach((s) => {
    if (s.visible) {
      if (seenKeys.has(s.key)) dupes.push(s.key)
      seenKeys.add(s.key)
    }
  })
  if (dupes.length > 0) fail('keyword-no-duplicate-sections', 'keywordDensity', 3, dupes)
  else pass('keyword-no-duplicate-sections')

  // keyword-title-in-header (2)
  if (!personalInfo.title?.trim()) fail('keyword-title-in-header', 'keywordDensity', 2)
  else pass('keyword-title-in-header')

  // Fallback to clamp bounds and sort failed checks
  score = Math.max(0, Math.min(100, score))
  failedChecks.sort((a, b) => b.pointsLost - a.pointsLost)

  return {
    totalScore: score,
    label: determineLabel(score),
    dimensionScores,
    failedChecks,
    passedChecks,
  }
}
