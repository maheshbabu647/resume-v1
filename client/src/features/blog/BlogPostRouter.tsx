import React, { lazy, Suspense, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { getPostBySlug } from './blogRegistry'
import { useArticle, usePublishedArticles } from './articlesApi'
import type { ArticleDetail, ArticleListItem } from './articlesApi'
import { BlogPostLayout } from './BlogPostLayout'
import type { PostCardData } from './blogCategories'
import { ArticleMarkdown, extractToc } from './ArticleMarkdown'

// ── Lazy-load each post component ──────────────────────────────
// Add a new entry here for every new post you write.
const POST_COMPONENTS: Record<string, React.LazyExoticComponent<() => React.ReactElement>> = {
  'why-indian-fresher-resumes-are-invisible-to-ats-2026': lazy(
    () => import('./posts/blog-post-1')
  ),
  'ats-friendly-resume-format-indian-freshers-2026': lazy(
    () => import('./posts/blog-post-2')
  ),
  'how-to-check-your-ats-score-before-applying-india-2026': lazy(
    () => import('./posts/blog-post-3')
  ),
  '10-resume-formatting-mistakes-indian-freshers-2026': lazy(
    () => import('./posts/blog-post-4')
  ),
  'ats-keywords-for-indian-freshers-2026': lazy(
    () => import('./posts/blog-post-5')
  ),
  'how-to-write-a-resume-objective-for-freshers-in-india-2026': lazy(
    () => import('./posts/blog-post-6')
  ),
  'how-to-write-the-projects-section-on-your-resume-2026': lazy(
    () => import('./posts/blog-post-7')
  ),
  'resume-skills-section-for-indian-freshers-2026': lazy(
    () => import('./posts/blog-post-8')
  ),
  'how-to-write-the-education-section-on-an-indian-fresher-resume-2026': lazy(
    () => import('./posts/blog-post-9')
  ),
  'how-to-write-certifications-resume-india-freshers-2026': lazy(
    () => import('./posts/blog-post-10')
  ),
  'how-to-write-a-resume-with-no-experience-india-freshers-2026': lazy(
    () => import('./posts/blog-post-11')
  ),
  'blog-12-resume-action-verbs-india-freshers-2026': lazy(
    () => import('./posts/blog-post-12')
  ),
  'resume-format-cse-it-freshers-india-2026': lazy(
    () => import('./posts/blog-post-13')
  ),
  'resume-format-ece-freshers-india-2026': lazy(
    () => import('./posts/blog-post-14')
  ),
  'resume-format-mechanical-freshers-india-2026': lazy(
    () => import('./posts/blog-post-15')
  ),
  'mba-fresher-resume-india-2026': lazy(
    () => import('./posts/blog-post-16')
  ),
  'biodata-vs-resume-vs-cv-india-2026': lazy(
    () => import('./posts/blog-post-17')
  ),
  'resume-objective-vs-summary-india-freshers-2026': lazy(
    () => import('./posts/blog-post-18')
  ),
  'one-page-vs-two-page-resume-india-2026': lazy(
    () => import('./posts/blog-post-19')
  ),
  'how-to-write-resume-with-low-cgpa-india-2026': lazy(
    () => import('./posts/blog-post-20')
  ),
  'career-gap-resume-india-freshers-2026': lazy(
    () => import('./posts/blog-post-21')
  ),
  'how-to-tailor-resume-for-job-description-india-2026': lazy(
    () => import('./posts/blog-post-22')
  ),
}

const Fallback = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      background: 'var(--surface)',
    }}
  >
    <div
      style={{
        width: 32,
        height: 32,
        border: '3px solid var(--outline-variant)',
        borderTopColor: 'var(--secondary)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

const NotFound = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      gap: 16,
      color: 'var(--on-surface-variant)',
      fontFamily: 'var(--font-sans)',
    }}
  >
    <p style={{ fontSize: 48, fontWeight: 900, color: 'var(--on-surface)', margin: 0 }}>404</p>
    <p style={{ fontSize: 18, margin: 0 }}>Blog post not found.</p>
    <a href="/blog" style={{ color: 'var(--secondary-fixed)', textDecoration: 'underline', fontSize: 14 }}>
      ← Back to Blog
    </a>
  </div>
)

// ── DB-backed article rendering ─────────────────────────────────
function DbArticle({ article, list }: { article: ArticleDetail; list?: ArticleListItem[] }) {
  const tocEntries = useMemo(
    () => extractToc(article.content, article.contentFormat),
    [article.content, article.contentFormat]
  )

  const related: PostCardData[] = useMemo(() => {
    if (!list || list.length === 0) return []
    return list
      .filter((a) => a.slug !== article.slug)
      .slice(0, 3)
      .map((a) => ({
        slug: a.slug,
        title: a.title,
        shortTitle: a.shortTitle,
        metaDescription: a.metaDescription,
        ogImage: a.ogImage ?? '',
        publishedAt: a.publishedAt ?? a.createdAt,
        updatedAt: a.updatedAt,
        readingTime: a.readingTime ?? 5,
        tags: a.tags,
        series: a.series,
        seriesDay: a.seriesDay,
        excerpt: a.excerpt,
        coverImage: a.coverImage,
      }))
  }, [list, article.slug])

  return (
    <BlogPostLayout
      slug={article.slug}
      post={{
        title: article.title,
        shortTitle: article.shortTitle,
        metaDescription: article.metaDescription,
        ogImage: article.ogImage,
        publishedAt: article.publishedAt,
        updatedAt: article.updatedAt,
        readingTime: article.readingTime,
        tags: article.tags,
        series: article.series,
        seriesDay: article.seriesDay,
        excerpt: article.excerpt,
      }}
      related={related}
      heroImagePath={article.coverImage}
      tocEntries={tocEntries}
    >
      <ArticleMarkdown content={article.content} contentFormat={article.contentFormat} />
    </BlogPostLayout>
  )
}

export default function BlogPostRouter() {
  const { slug } = useParams<{ slug: string }>()
  const { data: article, isLoading, isError } = useArticle(slug)
  const { data: listData } = usePublishedArticles({ limit: 50 })

  if (!slug) return <NotFound />

  // 1. DB article found → render it
  if (article) return <DbArticle article={article} list={listData?.articles} />

  // 2. Still loading from the API → spinner
  if (isLoading) return <Fallback />

  // 3. API errored or 404 → fall back to the static TSX post (pre-migration safety net)
  if (isError) {
    const post = getPostBySlug(slug)
    const PostComponent = POST_COMPONENTS[slug]
    if (post && PostComponent) {
      return (
        <Suspense fallback={<Fallback />}>
          <PostComponent />
        </Suspense>
      )
    }
  }

  return <NotFound />
}
