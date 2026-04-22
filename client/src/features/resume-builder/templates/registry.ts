import { lazy } from 'react'

export const TEMPLATE_REGISTRY = {
  'modern-centered': {
    id: 'modern-centered',
    name: 'Modern Centered',
    thumbnail: '/thumbnails/modern-centered.png',
    thumbnailUrl: 'https://res.cloudinary.com/draqrqhdg/image/upload/v1775974692/Arjun_Mehta_s_Resume_vysgl6.jpg',
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
    thumbnailUrl: 'https://res.cloudinary.com/draqrqhdg/image/upload/v1776874609/Arjun_Mehta_s_classic_sidebar_irjlvu.jpg',
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
    thumbnailUrl: 'https://res.cloudinary.com/draqrqhdg/image/upload/v1776874634/Arjun_Mehta_executive_page_gbz8u5.jpg',
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
