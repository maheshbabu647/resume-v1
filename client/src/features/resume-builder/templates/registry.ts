import { lazy } from 'react'

export const TEMPLATE_REGISTRY = {
  'modern-centered': {
    id: 'modern-centered',
    name: 'Modern Centered',
    thumbnail: '/thumbnails/modern-centered.png',
    isAtsRecommended: true,
    tags: {
      style: 'Modern',
      level: ['Professional', 'Entry-Level', 'Executive'],
      industry: ['Technology', 'General', 'Corporate'],
    },
    defaultStylePackKey: 'monochrome-professional',
    defaultSectionOrderPresetKey: 'tech-specialist',
    component: lazy(() => import('./modern-centered')),
  },
  'classic-sidebar': {
    id: 'classic-sidebar',
    name: 'Classic Sidebar',
    thumbnail: '/thumbnails/classic-sidebar.png',
    isAtsRecommended: true,
    tags: {
      style: 'Classic',
      level: ['Professional', 'Executive'],
      industry: ['Corporate', 'Finance', 'Consulting'],
    },
    defaultStylePackKey: 'monochrome-professional',
    defaultSectionOrderPresetKey: 'tech-specialist',
    component: lazy(() => import('./classic-sidebar')),
  },
  'executive-minimal': {
    id: 'executive-minimal',
    name: 'Executive Minimal',
    thumbnail: '/thumbnails/executive-minimal.png',
    isAtsRecommended: true,
    tags: {
      style: 'Minimal',
      level: ['Senior', 'Executive', 'Academic'],
      industry: ['General', 'Academic', 'Legal', 'Healthcare'],
    },
    defaultStylePackKey: 'monochrome-professional',
    defaultSectionOrderPresetKey: 'tech-specialist',
    component: lazy(() => import('./executive-minimal')),
  },
}
