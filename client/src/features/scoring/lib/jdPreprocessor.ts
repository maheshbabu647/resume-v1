import type { ResumeData } from '../../resume-builder/templates/shared/template.types'

/**
 * Strips EEO boilerplate, normalizes whitespace, and truncates if necessary.
 * See Appendix B of the Scoring Systems Spec.
 */
export function preprocessJD(rawText: string, rawTitle?: string): string {
  let text = rawText
  
  // 1. Strip Boilerplate (case-insensitive)
  // NOTE: We only strip paragraphs that are clearly standalone boilerplate.
  // Phrases like 'about us' are intentionally excluded because many JDs use
  // "About the Role" / "About the Team" sections to describe actual job content.
  const removePhrases = [
    'equal opportunity employer',
    'we celebrate diversity',
    'reasonable accommodation',
    'background check',
    'sponsorship',
    'benefits include',
    'salary range',
    '401k',
    'join our team',
  ]

  // Split into paragraphs to evaluate text block by text block
  const paragraphs = text.split(/\n\s*\n/)
  
  const cleanedParagraphs = paragraphs.filter(para => {
    const lower = para.toLowerCase()
    const trimmed = para.trim()
    
    // Only filter SHORT paragraphs that match boilerplate (< 300 chars)
    // Long paragraphs likely contain mixed content (job duties + one boilerplate line)
    if (trimmed.length > 300) return true
    
    // Check for exact matching phrases
    if (removePhrases.some(phrase => lower.includes(phrase))) return false
    
    // Check for EEOC/ADA/FMLA acronyms
    if (/\b(eeo|eeoc|ada|fmla)\b/i.test(para)) return false
    
    return true
  })

  let result = cleanedParagraphs.join('\n\n')

  // Safety fallback: if stripping removed too much content, use the raw text
  if (result.trim().length < 100 && rawText.trim().length >= 100) {
    result = rawText
  }

  // 2. Normalize
  result = result
    .replace(/<[^>]+>/g, '') // Strip HTML
    .replace(/^[•*\-–]\s*/gm, '') // Remove leading bullet chars
    .replace(/[\u2018\u2019]/g, "'") // Smart quotes
    .replace(/[\u201C\u201D]/g, '"')
    .trim()

  // 3. Truncate if massively long (> 12,000 characters)
  if (result.length > 12000) {
    result = result.substring(0, 12000)
  }

  if (!rawTitle) return result
  return `ROLE: ${rawTitle}\n\n${result}`
}

/**
 * Serializes the ResumeData object into clean, structured plain text
 * to optimize LLM comprehension and caching.
 */
export function serializeResume(resume: ResumeData): string {
  const { personalInfo, sections } = resume
  const parts: string[] = []

  parts.push(`Name: ${personalInfo.fullName}`)
  if (personalInfo.title) parts.push(`Title: ${personalInfo.title}`)
  if (personalInfo.email) parts.push(`Email: ${personalInfo.email}`)
  if (personalInfo.phone) parts.push(`Phone: ${personalInfo.phone}`)
  if (personalInfo.location) parts.push(`Location: ${personalInfo.location}`)
  if (personalInfo.contactLinks?.length) {
    personalInfo.contactLinks.forEach(link => parts.push(`${link.text}: ${link.url}`))
  }
  if (personalInfo.summary) parts.push(`Summary: ${personalInfo.summary}`)
  parts.push('')

  sections.forEach(section => {
    if (!section.visible || section.entries.length === 0) return

    parts.push(section.key.toUpperCase())

    // Standardize order of properties within entry to ensure deterministic hashing
    const sortedEntries = [...section.entries].sort((a, b) => {
      const titleA = (a.jobTitle || a.projectName || a.role || a.qualification || '').toLowerCase()
      const titleB = (b.jobTitle || b.projectName || b.role || b.qualification || '').toLowerCase()
      return titleA.localeCompare(titleB)
    })

    sortedEntries.forEach(entry => {
      if (section.key === 'experience' || section.key === 'internships') {
        parts.push(`  ${entry.jobTitle || 'Role'} at ${entry.company || 'Company'} (${entry.dates || 'Dates'})`)
      } else if (section.key === 'education') {
        parts.push(`  ${entry.qualification || 'Degree'} at ${entry.institution || 'School'} (${entry.dates || 'Dates'})`)
      } else if (section.key === 'skills') {
        parts.push(`  ${entry.category || 'Category'}: ${entry.skillList || ''}`)
      } else if (section.key === 'projects') {
        parts.push(`  ${entry.projectName || 'Project'}:`)
        if (entry.techStack) parts.push(`  Tech: ${entry.techStack}`)
      } else if (section.key === 'certifications') {
        parts.push(`  ${entry.name || 'Cert'} — ${entry.issuer || 'Issuer'} (${entry.date || 'Date'})`)
      } else {
        parts.push(`  Entry`) 
      }

      if (entry.description) {
        // Sort bullets alphabetically for determinism!
        const bullets = entry.description
          .split('\n')
          .map((b: string) => b.trim())
          .filter((b: string) => b.length > 0)
          .sort((a: string, b: string) => a.localeCompare(b))
          
        bullets.forEach((b: string) => {
          parts.push(`    - ${b}`)
        })
      }
    })
    parts.push('')
  })

  // Final normalization: ensure exact same whitespace layout
  return parts.join('\n').trim()
}
