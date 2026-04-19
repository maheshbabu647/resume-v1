import React, { lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { getPostBySlug } from './blogRegistry'

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

export default function BlogPostRouter() {
  const { slug } = useParams<{ slug: string }>()

  if (!slug) return <NotFound />

  const post = getPostBySlug(slug)
  const PostComponent = POST_COMPONENTS[slug]

  if (!post || !PostComponent) return <NotFound />

  return (
    <Suspense fallback={<Fallback />}>
      <PostComponent />
    </Suspense>
  )
}
