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
  {
    slug: 'ats-friendly-resume-format-indian-freshers-2026',
    title: 'The Complete ATS-Friendly Resume Format for Indian Freshers (2026 Guide)',
    shortTitle: 'The ATS-Friendly Resume Format',
    metaDescription: 'The complete ATS-friendly resume format for Indian freshers — every section, every rule, a full template, and a checklist. Built for TCS, Infosys, Wipro, and beyond.',
    ogImage: '/assets/blog-post-1-cover.png', // Fallback to cover 1 since cover 2 not yet generated
    publishedAt: '2026-04-15',
    readingTime: 14,
    tags: ['Resume Template', 'ATS', 'Fresher', 'Indian Job Market'],
    series: '90-Day Career Forge',
    seriesDay: 2,
    excerpt: 'Stop. Before You Open Canva. Most freshers in India start building their resume by picking the template that looks the most impressive. Here\'s why that guarantees rejection—and how to build a resume that passes every Indian ATS.',
  },
  {
    slug: 'how-to-check-your-ats-score-before-applying-india-2026',
    title: 'How to Check Your ATS Score Before Applying for Any Job in India',
    shortTitle: 'How to Check Your ATS Score',
    metaDescription: 'Learn how to check your resume\'s ATS score before applying for any job in India. Understand what the score means, what to fix, and how to use it correctly.',
    ogImage: '/assets/blog-post-1-cover.png', // Fallback to cover 1
    publishedAt: '2026-04-16',
    readingTime: 13,
    tags: ['ATS Score', 'Resume Checker', 'Indian Freshers'],
    series: '90-Day Career Forge',
    seriesDay: 3,
    excerpt: 'You built the resume. You followed the format. Now the question is: will it actually pass? This is how you find out your simulated ATS score before you hit submit.',
  },
  {
    slug: '10-resume-formatting-mistakes-indian-freshers-2026',
    title: '10 Resume Formatting Mistakes Indian Freshers Make (And How to Fix Each One)',
    shortTitle: '10 Resume Formatting Mistakes',
    metaDescription: 'The 10 most common resume formatting mistakes Indian freshers make — with specific before/after fixes for each one. Most are quick to correct once you know them.',
    ogImage: '/assets/blog-post-1-cover.png',
    publishedAt: '2026-04-17',
    readingTime: 15,
    tags: ['Resume Mistakes', 'Formatting', 'Indian Freshers'],
    series: '90-Day Career Forge',
    seriesDay: 4,
    excerpt: 'You\'ve read the theory. You know what ATS is. Now let\'s look at the actual mistakes — the specific, fixable errors that are sitting in most Indian fresher resumes right now.',
  },
  {
    slug: 'ats-keywords-for-indian-freshers-2026',
    title: 'ATS Keywords for Indian Freshers: How to Find Them and Where to Place Them',
    shortTitle: 'ATS Keywords for Indian Freshers',
    metaDescription: 'Learn exactly how to find ATS keywords from any job description and where to place them on your resume — with a worked before/after example for Indian freshers.',
    ogImage: '/assets/blog-post-1-cover.png',
    publishedAt: '2026-04-18',
    readingTime: 14,
    tags: ['ATS Keywords', 'Indian Freshers', 'Resume Tips'],
    series: '90-Day Career Forge',
    seriesDay: 5,
    excerpt: 'You have the right format. Your resume parses cleanly. But the ATS is still ranking you low. The missing piece is almost always the same thing: keywords.',
  },
  {
    slug: 'how-to-write-a-resume-objective-for-freshers-in-india-2026',
    title: 'How to Write a Resume Objective for Freshers in India (With 20 Ready Examples)',
    shortTitle: 'Resume Objective for Freshers in India',
    metaDescription: 'How to write a resume objective that passes ATS and impresses recruiters — with a formula, 20 stream-specific examples for Indian freshers, and 6 things to delete now.',
    ogImage: '/assets/blog-post-1-cover.png',
    publishedAt: '2026-04-19',
    readingTime: 13,
    tags: ['Resume Objective', 'Indian Freshers', 'Career Advice'],
    series: '90-Day Career Forge',
    seriesDay: 6,
    excerpt: 'It\'s the first thing a recruiter reads after your name. It\'s the first thing an ATS parses for keywords. And it\'s written badly on the majority of Indian fresher resumes. Two sentences. Used right, they can open the door. Used wrong, they confirm that your resume is like every other one in the pile.',
  },
  {
    slug: 'how-to-write-the-projects-section-on-your-resume-2026',
    title: 'How to Write the Projects Section on Your Resume — The Section That Actually Gets You Shortlisted',
    shortTitle: 'How to Write the Projects Section',
    metaDescription: 'Your projects section is your work experience. Learn the exact structure, four before/after examples, and how to get numbers from academic projects — for Indian freshers.',
    ogImage: '/assets/blog-post-1-cover.png',
    publishedAt: '2026-04-20',
    readingTime: 14,
    tags: ['Resume Projects', 'Indian Freshers', 'Career Advice'],
    series: '90-Day Career Forge',
    seriesDay: 7,
    excerpt: 'Every Indian fresher has the same problem: no work experience. But most of them have built things. The gap between "I built things" and "I have no experience" is entirely a writing problem.',
  },
  {
    slug: 'resume-skills-section-for-indian-freshers-2026',
    title: 'Resume Skills Section for Indian Freshers: What to Include, What to Skip, and How to Format It',
    shortTitle: 'Resume Skills Section for Indian Freshers',
    metaDescription: 'What to include in your skills section as an Indian fresher — stream-specific skill lists, the soft skills trap, ATS formatting rules, and what to delete right now.',
    ogImage: '/assets/blog-post-1-cover.png',
    publishedAt: '2026-04-21',
    readingTime: 13,
    tags: ['Resume Skills', 'Indian Freshers', 'ATS Formatting'],
    series: '90-Day Career Forge',
    seriesDay: 8,
    excerpt: 'Open any five Indian fresher resumes. Four of them will have "communication skills" and "team player" listed under Skills. Neither of those phrases has ever passed an ATS filter.',
  },
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
