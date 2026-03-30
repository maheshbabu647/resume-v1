export interface StylePack {
  key: string
  name: string
  accentColor: string
  fontFamily: string
  fontImportUrl?: string
}

export const STYLE_PACKS: StylePack[] = [
  {
    key: 'monochrome-professional',
    name: 'Monochrome Professional',
    accentColor: '#000000',
    fontFamily: 'Lato',
    fontImportUrl: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',
  },
  {
    key: 'tech-innovator',
    name: 'Tech Innovator',
    accentColor: '#4A6B8A',
    fontFamily: 'Inter',
    fontImportUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
  },
  {
    key: 'corporate-authority',
    name: 'Corporate Authority',
    accentColor: '#003366',
    fontFamily: 'Lato',
    fontImportUrl: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',
  },
  {
    key: 'academic-scholar',
    name: 'Academic Scholar',
    accentColor: '#800020',
    fontFamily: 'Georgia',
    // Georgia is a system font, no import needed
  },
  {
    key: 'creative-minimalist',
    name: 'Creative Minimalist',
    accentColor: '#005A5A',
    fontFamily: 'Lato',
    fontImportUrl: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',
  },
  {
    key: 'modern-generalist',
    name: 'Modern Generalist',
    accentColor: '#005A5A',
    fontFamily: 'Lato',
    fontImportUrl: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',
  },
]

export const DEFAULT_STYLE_PACK_KEY = 'monochrome-professional'

export function getStylePack(key: string): StylePack {
  return STYLE_PACKS.find(p => p.key === key) ?? STYLE_PACKS[0]
}
