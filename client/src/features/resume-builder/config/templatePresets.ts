export interface TemplatePreset {
  key: string
  name: string
  industry: string
  sectionPresetKey: string
  stylePackKey: string
}

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  { key: 'grad-ambitious',     name: 'For the Ambitious Graduate',       industry: 'General Professional', sectionPresetKey: 'potential-star',   stylePackKey: 'monochrome-professional' },
  { key: 'swe-modern',         name: 'For the Modern Software Engineer', industry: 'Technology',            sectionPresetKey: 'tech-specialist',  stylePackKey: 'tech-innovator'          },
  { key: 'corp-professional',  name: 'For the Corporate Professional',   industry: 'Business / Finance',    sectionPresetKey: 'steady-climber',   stylePackKey: 'corporate-authority'     },
  { key: 'academic-researcher',name: 'For the Academic Researcher',      industry: 'Academia / Research',   sectionPresetKey: 'academic-focus',   stylePackKey: 'academic-scholar'        },
  { key: 'creative-pro',       name: 'For the Creative Professional',    industry: 'Creative / Media',      sectionPresetKey: 'potential-star',   stylePackKey: 'creative-minimalist'     },
  { key: 'healthcare-pro',     name: 'For the Healthcare Professional',  industry: 'Healthcare',            sectionPresetKey: 'potential-star',   stylePackKey: 'modern-generalist'       },
]
