import type { StylePack } from '../../config/stylePacks'

export interface TemplateProps {
  data: ResumeData
  customization: CustomizationConfig
}

export interface ResumeData {
  personalInfo: PersonalInfo
  sections: ResumeSection[]
}

export interface PersonalInfo {
  fullName: string
  title: string
  summary: string
  summaryLabel?: string
  email: string
  phone: string
  location: string
  contactLinks: ContactLink[]
}

export interface ContactLink {
  text: string
  url: string
}

export interface ResumeSection {
  key: SectionKey
  name?: string
  visible: boolean
  order: number
  entries: Record<string, any>[]
}

export type SectionKey =
  | 'experience' | 'education' | 'skills' | 'projects'
  | 'certifications' | 'awards' | 'languages' | 'volunteering'
  | 'publications' | 'presentations' | 'licensure' | 'barAdmissions'
  | 'custom' | 'memberships' | 'clinicalExperience' | 'grants'
  | 'teachingExperience' | 'securityClearance' | 'events' | 'internships'
  | 'declaration'

export interface CustomizationConfig {
  stylePack: StylePack
  spacing: SpacingConfig
  sizing: SizingConfig
  sectionOrder: (SectionKey | 'summary')[]
}

export interface SpacingConfig {
  sectionGap: number
  entryGap: number
  pagePadding: number
  bulletGap: number
}

export interface SizingConfig {
  baseFontSize: number
  nameFontSize: number
  sectionTitleSize: number
  entryTitleSize: number
  metaFontSize: number
  lineHeight: number
}
