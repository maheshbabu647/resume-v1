import type { SectionKey } from '../templates/shared/template.types'

export interface SectionOrderPreset {
  key: string
  name: string
  description: string
  order: (SectionKey | 'summary')[]
}

export const SECTION_ORDER_PRESETS: SectionOrderPreset[] = [
  {
    key: 'steady-climber',
    name: 'The Steady Climber',
    description: 'Chronological. Experience leads. Best for professionals with a clear career progression.',
    order: ['summary','experience','internships','education','skills','projects','certifications','awards','volunteering','publications','teachingExperience','events','memberships','languages','licensure','barAdmissions','securityClearance','clinicalExperience','grants','custom'],
  },
  {
    key: 'potential-star',
    name: 'The Potential Star',
    description: 'Education and projects first. Best for recent graduates and students.',
    order: ['summary','education','internships','projects','skills','experience','events','awards','volunteering','certifications','publications','memberships','languages','teachingExperience','clinicalExperience','grants','licensure','barAdmissions','securityClearance','custom'],
  },
  {
    key: 'strategic-pivot',
    name: 'The Strategic Pivot',
    description: 'Skills first. Best for career changers who want to lead with what they know.',
    order: ['summary','skills','projects','certifications','events','experience','internships','education','volunteering','awards','publications','memberships','languages','teachingExperience','licensure','barAdmissions','securityClearance','clinicalExperience','grants','custom'],
  },
  {
    key: 'tech-specialist',
    name: 'The Tech Specialist',
    description: 'Skills-first for engineers. Projects and internships up front.',
    order: ['summary','skills','projects','internships','experience','certifications','events','education','publications','awards','volunteering','memberships','languages','teachingExperience','licensure','barAdmissions','securityClearance','clinicalExperience','grants','custom'],
  },
  {
    key: 'senior-authority',
    name: 'The Authority',
    description: 'Experience and impact lead. Best for senior professionals and leaders.',
    order: ['summary','experience','awards','publications','skills','memberships','teachingExperience','internships','education','grants','certifications','projects','volunteering','languages','licensure','barAdmissions','securityClearance','clinicalExperience','events','custom'],
  },
  {
    key: 'academic-focus',
    name: 'The Academic',
    description: 'Research-first ordering. Publications and grants up front.',
    order: ['summary','education','publications','grants','teachingExperience','experience','internships','awards','clinicalExperience','skills','memberships','projects','certifications','events','volunteering','languages','licensure','barAdmissions','securityClearance','custom'],
  },
]

export const DEFAULT_SECTION_ORDER_PRESET_KEY = 'tech-specialist'
