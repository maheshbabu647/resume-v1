/* ── Types ─────────────────────────────────────────────────────────────────── */

/** A single field change inside one entry of a section */
export interface FieldDiffStep {
  /** Unique ID e.g. "experience:0:description" */
  id: string
  sectionKey: string
  sectionName: string
  /** -1 for personalInfo */
  entryIndex: number
  /** e.g. "Software Engineer at Google" */
  entryLabel: string
  fieldKey: string
  fieldLabel: string
  /** String representation of original value */
  before: string
  /** String representation of AI value */
  after: string
}

/* ── Field label map (from fieldDefinitions) ────────────────────────────── */
const FIELD_LABELS: Record<string, string> = {
  // experience / internships
  jobTitle:        'Job Title',
  company:         'Company',
  employmentType:  'Employment Type',
  location:        'Location',
  dates:           'Dates',
  description:     'Description',
  // education
  qualification:   'Degree & Major',
  institution:     'Institution',
  honorsOrMinor:   'Honors / Minor',
  gpa:             'GPA',
  // skills
  category:        'Category',
  skillList:       'Skills',
  // projects
  projectName:     'Project Name',
  role:            'Role',
  techStack:       'Tech Stack',
  // awards
  awardName:       'Award Name',
  issuer:          'Issuer',
  date:            'Date',
  // certifications
  name:            'Name',
  credentialId:    'Credential ID',
  // personalInfo
  title:           'Professional Headline',
  summary:         'Professional Summary',
  // generic
  content:         'Content',
  achievements:    'Achievements',
}

/* ── Section display names ─────────────────────────────────────────────── */
export const SECTION_NAMES: Record<string, string> = {
  experience:           'Work Experience',
  education:            'Education',
  skills:               'Skills',
  projects:             'Projects',
  certifications:       'Certifications',
  awards:               'Awards & Honors',
  languages:            'Languages',
  volunteering:         'Volunteer Experience',
  publications:         'Publications',
  presentations:        'Presentations',
  internships:          'Internships',
  events:               'Workshops & Hackathons',
  teachingExperience:   'Teaching Experience',
  clinicalExperience:   'Clinical Experience',
  grants:               'Grants & Funding',
  memberships:          'Memberships',
  custom:               'Custom Section',
  personalInfo:         'Professional Info',
}

/* ── Entry label helper ─────────────────────────────────────────────────── */
function getEntryLabel(sectionKey: string, entry: any, idx: number): string {
  const parts: string[] = []

  switch (sectionKey) {
    case 'experience':
    case 'internships':
      if (entry.jobTitle) parts.push(entry.jobTitle)
      if (entry.company)  parts.push(`at ${entry.company}`)
      break
    case 'education':
      if (entry.qualification) parts.push(entry.qualification)
      if (entry.institution)   parts.push(`@ ${entry.institution}`)
      break
    case 'projects':
      if (entry.projectName) parts.push(entry.projectName)
      break
    case 'certifications':
      if (entry.name)   parts.push(entry.name)
      if (entry.issuer) parts.push(`— ${entry.issuer}`)
      break
    case 'skills':
      if (entry.category) parts.push(entry.category)
      break
    case 'awards':
      if (entry.awardName) parts.push(entry.awardName)
      break
    default:
      for (const k of ['title', 'name', 'role', 'jobTitle', 'courseName', 'eventName']) {
        if (entry[k]) { parts.push(entry[k]); break }
      }
  }
  return parts.join(' ') || `Item ${idx + 1}`
}

/* ── Value normaliser ───────────────────────────────────────────────────── */
export function normalizeValue(v: any): string {
  if (v == null || v === '') return ''
  if (typeof v === 'string') return v.trim()
  if (Array.isArray(v))      return v.filter(Boolean).map(x => String(x).trim()).join('\n')
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v).trim()
}

/* ── Fields to skip in diff (structural) ─────────────────────────────────── */
const SKIP_FIELDS = new Set(['id', '_id', 'links', 'contactLinks', 'visible', 'order', 'key'])

/* ── Main diff builder ─────────────────────────────────────────────────── */
export function buildFieldDiffs(params: {
  originalSections:      any[]
  rewrittenSections:     any[]
  originalPersonalInfo:  any
  rewrittenPersonalInfo: any | null
}): FieldDiffStep[] {
  const { originalSections, rewrittenSections, originalPersonalInfo, rewrittenPersonalInfo } = params
  const steps: FieldDiffStep[] = []

  /* personalInfo */
  if (rewrittenPersonalInfo) {
    for (const fieldKey of ['title', 'summary'] as const) {
      const before = normalizeValue(originalPersonalInfo?.[fieldKey])
      const after  = normalizeValue(rewrittenPersonalInfo[fieldKey])
      if (after && before !== after) {
        steps.push({
          id:          `personalInfo:-1:${fieldKey}`,
          sectionKey:  'personalInfo',
          sectionName: 'Professional Info',
          entryIndex:  -1,
          entryLabel:  'Your Profile',
          fieldKey,
          fieldLabel:  FIELD_LABELS[fieldKey] || fieldKey,
          before,
          after,
        })
      }
    }
  }

  /* sections */
  for (const rewrittenSec of rewrittenSections) {
    const originalSec  = originalSections.find(s => s.key === rewrittenSec.key)
    const sectionName  = SECTION_NAMES[rewrittenSec.key] || rewrittenSec.key
    const entries: any[] = rewrittenSec.entries || []

    entries.forEach((rewrittenEntry: any, entryIdx: number) => {
      const originalEntry = originalSec?.entries?.[entryIdx] ?? {}
      // Use original entry to derive label (more stable)
      const labelEntry = Object.keys(originalEntry).length > 0 ? originalEntry : rewrittenEntry
      const entryLabel = getEntryLabel(rewrittenSec.key, labelEntry, entryIdx)

      // Collect all field keys from the rewritten entry
      const fieldKeys = Object.keys(rewrittenEntry).filter(k => !SKIP_FIELDS.has(k))

      for (const fieldKey of fieldKeys) {
        const before = normalizeValue(originalEntry[fieldKey])
        const after  = normalizeValue(rewrittenEntry[fieldKey])

        // Only show if the AI actually changed something
        if (!after || before === after) continue

        steps.push({
          id:          `${rewrittenSec.key}:${entryIdx}:${fieldKey}`,
          sectionKey:  rewrittenSec.key,
          sectionName,
          entryIndex:  entryIdx,
          entryLabel,
          fieldKey,
          fieldLabel:  FIELD_LABELS[fieldKey] || fieldKey,
          before,
          after,
        })
      }
    })
  }

  return steps
}

/* ── Apply accepted changes to the resume store ────────────────────────── */
export function applyAcceptedDiffs(params: {
  acceptedIds:           Set<string>
  allSteps:              FieldDiffStep[]
  originalSections:      any[]
  rewrittenSections:     any[]
  originalPersonalInfo:  any
  rewrittenPersonalInfo: any | null
  updateSectionEntries:  (key: string, entries: any[]) => void
  setPersonalField:      (key: string, value: any) => void
}): void {
  const {
    acceptedIds, allSteps,
    originalSections, rewrittenSections,
    rewrittenPersonalInfo,
    updateSectionEntries, setPersonalField,
  } = params

  const acceptedSteps = allSteps.filter(s => acceptedIds.has(s.id))

  /* personalInfo */
  const piSteps = acceptedSteps.filter(s => s.sectionKey === 'personalInfo')
  for (const step of piSteps) {
    if (rewrittenPersonalInfo?.[step.fieldKey] !== undefined) {
      setPersonalField(step.fieldKey, rewrittenPersonalInfo[step.fieldKey])
    }
  }

  /* section fields — build a map: sectionKey → entryIndex → fieldKey → value */
  const sectionSteps = acceptedSteps.filter(s => s.sectionKey !== 'personalInfo')
  const sectionMap = new Map<string, Map<number, Map<string, any>>>()

  for (const step of sectionSteps) {
    if (!sectionMap.has(step.sectionKey)) sectionMap.set(step.sectionKey, new Map())
    const entryMap = sectionMap.get(step.sectionKey)!
    if (!entryMap.has(step.entryIndex)) entryMap.set(step.entryIndex, new Map())
    // Find the rewritten field raw value (not normalised)
    const rwSec  = rewrittenSections.find(s => s.key === step.sectionKey)
    const rwEntry = rwSec?.entries?.[step.entryIndex]
    if (rwEntry !== undefined) {
      entryMap.get(step.entryIndex)!.set(step.fieldKey, rwEntry[step.fieldKey])
    }
  }

  for (const [sectionKey, entryMap] of sectionMap) {
    const originalSec = originalSections.find(s => s.key === sectionKey)
    if (!originalSec) continue

    // Clone original entries and patch accepted fields
    const newEntries = originalSec.entries.map((origEntry: any, idx: number) => {
      const fieldPatch = entryMap.get(idx)
      if (!fieldPatch) return origEntry
      return { ...origEntry, ...Object.fromEntries(fieldPatch) }
    })

    updateSectionEntries(sectionKey, newEntries)
  }
}
