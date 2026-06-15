// ============================================================
// blogCategories.ts — shared category taxonomy for Insights
// Used by the list page, article page ("Keep reading"), and
// the shared ArticleCard component.
// ============================================================

import type { BlogPost } from './blogRegistry'

/** Card data shared by static registry posts and DB articles. */
export type PostCardData = BlogPost & { coverImage?: string }

export const CATEGORIES: { label: string; col: string }[] = [
  { label: 'All', col: '#0F0E2A' },
  { label: 'Resume Tips', col: '#5046E4' },
  { label: 'ATS Hacks', col: '#FF5C35' },
  { label: 'Interview Prep', col: '#7C3AED' },
  { label: 'Job Search', col: '#0891B2' },
  { label: 'Career Stories', col: '#16A34A' },
  { label: 'Salary Negotiation', col: '#F59E0B' },
]

export const CATEGORY_COLOR: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.label, c.col]),
)

export function categoryFor(post: { tags: string[] }): string {
  const tags = post.tags.map((t) => t.toLowerCase())
  if (tags.some((t) => t.includes('ats'))) return 'ATS Hacks'
  if (tags.some((t) => t.includes('interview'))) return 'Interview Prep'
  if (tags.some((t) => t.includes('salary'))) return 'Salary Negotiation'
  if (tags.some((t) => t.includes('job search') || t.includes('job market') || t.includes('job hunt'))) return 'Job Search'
  if (tags.some((t) => t.includes('career gap') || t.includes('career stor'))) return 'Career Stories'
  return 'Resume Tips'
}
