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
  {
    slug: 'how-to-write-the-education-section-on-an-indian-fresher-resume-2026',
    title: 'How to Write the Education Section on an Indian Fresher Resume (With Examples and CGPA Strategy)',
    shortTitle: 'How to Write the Education Section',
    metaDescription: 'How to write the education section on an Indian fresher resume — CGPA strategy, 10th/12th decisions, relevant coursework for ATS, and formatted examples by stream.',
    ogImage: '/assets/blog-post-1-cover.png',
    publishedAt: '2026-04-22',
    readingTime: 12,
    tags: ['Resume Education', 'Indian Freshers', 'CGPA'],
    series: '90-Day Career Forge',
    seriesDay: 9,
    excerpt: 'For every other section on your resume, you\'re building evidence. For the Education section, the evidence already exists — you just need to present it correctly.',
  },
  {
    slug: 'how-to-write-certifications-resume-india-freshers-2026',
    title: 'How to Write the Certifications Section — And Which Certifications Actually Matter for Indian Freshers in 2026',
    shortTitle: 'How to Write the Certifications Section',
    metaDescription: 'Which certifications actually matter for Indian freshers in 2026 — Google, AWS, NPTEL, HackerRank, and more — with formatting rules and a stream-by-stream quick reference.',
    ogImage: '/assets/blog-post-1-cover.png',
    publishedAt: '2026-04-23',
    readingTime: 14,
    tags: ['Indian Freshers', 'Career Advice', 'Resume Tips'],
    series: '90-Day Career Forge',
    seriesDay: 10,
    excerpt: 'Every fresher has been told: "Get certified. It helps your resume." That advice is only half true. Getting certified helps. Getting the wrong certification — or listing it badly — does almost nothi...'
  },
  {
    slug: 'how-to-write-a-resume-with-no-experience-india-freshers-2026',
    title: 'How to Write a Resume With No Experience or Internship as an Indian Fresher',
    shortTitle: 'How to Write a Resume With No Experience or Internship as an Indian Fresher',
    metaDescription: 'No internship, no work experience — here\'s how Indian freshers build a resume that still competes. What replaces experience, how to write it, and a complete example.',
    ogImage: '/assets/blog-post-1-cover.png',
    publishedAt: '2026-04-24',
    readingTime: 14,
    tags: ['Indian Freshers', 'Career Advice', 'Resume Tips'],
    series: '90-Day Career Forge',
    seriesDay: 11,
    excerpt: '"I have no internship. I have no work experience. What do I even put on my resume?" This is the most common question Indian freshers ask. And the answer is longer — and more useful — than most peop...'
  },
  {
    slug: 'blog-12-resume-action-verbs-india-freshers-2026',
    title: 'Resume Action Verbs for Indian Freshers: 100 Power Words That Make Recruiters Stop and Read',
    shortTitle: 'Resume Action Verbs for Indian Freshers: 100 Power Words That Make Recruiters Stop and Read',
    metaDescription: '100 action verbs organised by function for Indian fresher resumes — with before/after examples, verbs to delete, and a quick-reference card to use every time you write a bullet.',
    ogImage: '/assets/blog-post-1-cover.png',
    publishedAt: '2026-04-25',
    readingTime: 12,
    tags: ['Indian Freshers', 'Career Advice', 'Resume Tips'],
    series: '90-Day Career Forge',
    seriesDay: 12,
    excerpt: 'The difference between a resume bullet that gets read and one that gets skipped is often a single word. "Worked on a web application" tells a recruiter nothing. "Built a full-stack web application"...'
  },
  {
    slug: 'resume-format-cse-it-freshers-india-2026',
    title: 'Resume Format for CSE/IT Freshers in India — 2026 ATS-Ready Template and Complete Guide',
    shortTitle: 'Resume Format for CSE/IT Freshers in India',
    metaDescription: 'Complete CSE/IT fresher resume guide for India in 2026 — service vs product vs startup strategy, stream-specific skills, full template, and GitHub checklist.',
    ogImage: '/assets/blog-post-1-cover.png',
    publishedAt: '2026-04-26',
    readingTime: 15,
    tags: ['Indian Freshers', 'Career Advice', 'Resume Tips'],
    series: '90-Day Career Forge',
    seriesDay: 13,
    excerpt: 'More CSE graduates enter the Indian job market every year than any other engineering stream. That\'s not a problem. It\'s a signal that your resume needs to be significantly better than the average —...'
  },
  {
    slug: 'resume-format-ece-freshers-india-2026',
    title: 'Resume Format for ECE Freshers in India — Core Electronics + IT Pivot Guide (2026)',
    shortTitle: 'Resume Format for ECE Freshers in India',
    metaDescription: 'Complete ECE fresher resume guide for India in 2026 — core electronics vs IT pivot strategy, skills by path, three project examples, and a full ATS-ready template.',
    ogImage: '/assets/blog-post-1-cover.png',
    publishedAt: '2026-04-27',
    readingTime: 15,
    tags: ['Indian Freshers', 'Career Advice', 'Resume Tips'],
    series: '90-Day Career Forge',
    seriesDay: 14,
    excerpt: 'ECE is one of the most versatile engineering degrees in India. It opens doors to embedded systems, VLSI, telecom, IoT — and also to software development, data, and IT services. That versatility is ...'
  },
  {
    slug: 'resume-format-mechanical-freshers-india-2026',
    title: 'Resume Format for Mechanical Engineering Freshers in India — Core + Manufacturing + PSU Guide (2026)',
    shortTitle: 'Resume Format for Mechanical Engineering Freshers in India',
    metaDescription: 'Complete mechanical engineering fresher resume guide for India in 2026 — design vs production vs PSU strategy, three project examples, full ATS template, and GATE tips.',
    ogImage: '/assets/blog-post-1-cover.png',
    publishedAt: '2026-04-28',
    readingTime: 15,
    tags: ['Indian Freshers', 'Career Advice', 'Resume Tips'],
    series: '90-Day Career Forge',
    seriesDay: 15,
    excerpt: 'Mechanical engineering is one of the oldest and most stable engineering streams in India — and one of the most misunderstood when it comes to resume writing. Most mechanical fresher resumes look li...'
  },
  {
    slug: 'mba-fresher-resume-india-2026',
    title: 'MBA Fresher Resume That Actually Gets Interview Calls in India — Marketing, Finance, and HR Guide (2026)',
    shortTitle: 'MBA Fresher Resume That Actually Gets Interview Calls in India',
    metaDescription: 'Complete MBA fresher resume guide for India in 2026 — Marketing, Finance, and HR specialisations, internship writing formula, full template, and company-type adaptation.',
    ogImage: '/assets/blog-post-1-cover.png',
    publishedAt: '2026-04-29',
    readingTime: 15,
    tags: ['Indian Freshers', 'Career Advice', 'Resume Tips'],
    series: '90-Day Career Forge',
    seriesDay: 16,
    excerpt: 'An MBA resume is not a longer engineering resume. It is a completely different document — built around business impact, leadership evidence, and the ability to think commercially. Most MBA freshers...'
  },
  {
    slug: 'biodata-vs-resume-vs-cv-india-2026',
    title: 'Biodata vs Resume vs CV — What Indian Freshers Should Actually Submit in 2026',
    shortTitle: 'Biodata vs Resume vs CV',
    metaDescription: 'Biodata, resume, or CV — which should Indian freshers actually submit in 2026? Clear definitions, a decision table, and the consequences of getting it wrong.',
    ogImage: '/assets/blog-post-1-cover.png',
    publishedAt: '2026-04-30',
    readingTime: 11,
    tags: ['Indian Freshers', 'Career Advice', 'Resume Tips'],
    series: '90-Day Career Forge',
    seriesDay: 17,
    excerpt: 'A fresher submits a beautifully formatted biodata — complete with photo, date of birth, father\'s name, and marital status — to an Infosys job portal. The ATS cannot read half of it. The recruiter, ...'
  },
  {
    slug: 'resume-objective-vs-summary-india-freshers-2026',
    title: 'Resume Objective vs Professional Summary — Which One Should Indian Freshers Use in 2026?',
    shortTitle: 'Resume Objective vs Professional Summary',
    metaDescription: 'Resume objective or professional summary — which should Indian freshers use in 2026? Honest guidance, 10 objective examples, 3 summary examples, and a decision framework.',
    ogImage: '/assets/blog-post-1-cover.png',
    publishedAt: '2026-05-01',
    readingTime: 12,
    tags: ['Indian Freshers', 'Career Advice', 'Resume Tips'],
    series: '90-Day Career Forge',
    seriesDay: 18,
    excerpt: 'There is a debate running across every resume advice blog right now: "Objectives are dead. Summaries are the future." That advice is written for experienced professionals in the US and UK. For Indi...'
  },
  {
    slug: 'one-page-vs-two-page-resume-india-2026',
    title: 'One Page vs Two Page Resume — What Indian Freshers Should Follow in 2026',
    shortTitle: 'One Page vs Two Page Resume',
    metaDescription: 'One page or two for Indian fresher resumes in 2026? Honest guidance by situation, two myths debunked, space-saving techniques, and a decision framework that actually works.',
    ogImage: '/assets/blog-post-1-cover.png',
    publishedAt: '2026-05-02',
    readingTime: 11,
    tags: ['Indian Freshers', 'Career Advice', 'Resume Tips'],
    series: '90-Day Career Forge',
    seriesDay: 19,
    excerpt: '"My friend said two pages shows more experience." "My placement officer said one page is mandatory." "I read that ATS prefers one page." Three people. Three different pieces of advice. All confiden...'
  },
  {
    slug: 'how-to-write-resume-with-low-cgpa-india-2026',
    title: 'Resume for Students With Low CGPA in India — How to Compete When Numbers Don\'t Help',
    shortTitle: 'Resume for Students With Low CGPA in India',
    metaDescription: 'Low CGPA in India — what it actually closes, what it doesn\'t, and how to build a resume that competes on skills when academic scores aren\'t your strongest signal.',
    ogImage: '/assets/blog-post-1-cover.png',
    publishedAt: '2026-05-03',
    readingTime: 13,
    tags: ['Indian Freshers', 'Career Advice', 'Resume Tips'],
    series: '90-Day Career Forge',
    seriesDay: 20,
    excerpt: 'A low CGPA closes some doors. It does not close all of them. And the ones it closes are not always the ones worth walking through. This blog is about what you do with the doors that are still open.'
  },
  {
    slug: 'career-gap-resume-india-freshers-2026',
    title: 'Career Gap After Graduation — How to Explain It on Your Resume and in Interviews',
    shortTitle: 'Career Gap After Graduation',
    metaDescription: 'Career gap after graduation in India — how to handle it on your resume, how to explain it in interviews, and the most productive things to do if you\'re still in one.',
    ogImage: '/assets/blog-post-1-cover.png',
    publishedAt: '2026-05-04',
    readingTime: 13,
    tags: ['Career Gap', 'Resume Tips', 'Indian Freshers'],
    series: '90-Day Career Forge',
    seriesDay: 21,
    excerpt: 'You graduated in May 2024. It\'s now mid-2026. You\'ve been applying, preparing, dealing with life. Now you\'re looking at your resume and wondering: how do I explain where I\'ve been? This blog gives you the honest answer — for your resume and for the interview room.'
  },
  {
    slug: 'how-to-tailor-resume-for-job-description-india-2026',
    title: 'Why You Must Tailor Your Resume for Every Job Description — And How to Do It in 10 Minutes',
    shortTitle: 'How to Tailor Your Resume for Every Job Description',
    metaDescription: 'How to tailor your resume for every job description in India — an 8-step 10-minute system, a worked before/after example, and the three highest-impact changes to make first.',
    ogImage: '/assets/blog-post-1-cover.png',
    publishedAt: '2026-05-05',
    readingTime: 13,
    tags: ['Tailor Resume', 'Indian Freshers', 'ATS Formatting'],
    series: '90-Day Career Forge',
    seriesDay: 22,
    excerpt: 'Most freshers send the same resume to 50 companies. Then wonder why they hear back from 2. That\'s not a mystery. That\'s math. A resume written for nobody in particular is compelling to nobody in particular.'
  }
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

/** Up to `count` other posts for the "Keep reading" grid, newest-first. */
export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  return SORTED_POSTS.filter((p) => p.slug !== slug).slice(0, count)
}
