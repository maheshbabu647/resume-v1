// ============================================================
// blogRegistry.ts — CareerForge Blog Registry
// To add a new post: append one object to BLOG_POSTS.
// The list page, router, and prev/next nav all read from here.
// ============================================================

export interface BlogPost {
  slug: string
  title: string
  shortTitle: string           // Used in prev/next nav cards
  metaDescription: string      // Max 155 chars for Google
  ogImage: string              // Path to OG image (1200×630)
  publishedAt: string          // ISO date string: 'YYYY-MM-DD'
  updatedAt?: string           // ISO date string (optional)
  readingTime: number          // Minutes (integer)
  tags: string[]
  series?: string              // Series name, e.g. '90-Day Career Forge'
  seriesDay?: number           // Day number within the series
  excerpt: string              // 1–2 sentence summary for list card
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'why-indian-fresher-resumes-are-invisible-to-ats-2026',
    title: 'What is ATS — And Why Your Resume Gets Rejected Before Any Human Reads It',
    shortTitle: 'What is ATS & Why Resumes Get Rejected',
    metaDescription:
      'Applied to 50+ jobs with no response? Learn how ATS works in India, which companies use it, and how to fix your resume so it finally gets shortlisted.',
    ogImage: '/assets/blog-post-1-cover.png',
    publishedAt: '2026-04-14',
    updatedAt: '2026-04-14',
    readingTime: 12,
    tags: ['ATS', 'Fresher', 'Resume Tips', 'Indian Job Market', 'TCS', 'Infosys'],
    series: '90-Day Career Forge',
    seriesDay: 1,
    excerpt:
      'Your resume never reached a human being. It was filtered out in seconds — by software. Learn exactly how ATS works at TCS, Infosys, Wipro, and what you must change right now.',
  },
  // ── ADD NEW POSTS BELOW THIS LINE ───────────────────────────
  // {
  //   slug: 'ats-master-template-2026',
  //   title: 'The ATS Master Template: A Single-Column Format That Gets You Shortlisted',
  //   shortTitle: 'The ATS Master Template for 2026',
  //   metaDescription: '...',
  //   ogImage: '/assets/blog-post-2-cover.png',
  //   publishedAt: '2026-04-15',
  //   readingTime: 8,
  //   tags: ['Resume Template', 'ATS', 'Fresher'],
  //   series: '90-Day Career Forge',
  //   seriesDay: 2,
  //   excerpt: '...',
  // },
]

// Sorted newest-first for the list page
export const SORTED_POSTS = [...BLOG_POSTS].sort(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
)

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

export function getPrevNextPosts(slug: string): { prev: BlogPost | null; next: BlogPost | null } {
  const idx = SORTED_POSTS.findIndex((p) => p.slug === slug)
  return {
    prev: idx < SORTED_POSTS.length - 1 ? SORTED_POSTS[idx + 1] : null,
    next: idx > 0 ? SORTED_POSTS[idx - 1] : null,
  }
}
