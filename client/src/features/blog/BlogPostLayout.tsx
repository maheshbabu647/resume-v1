import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import type { ReactNode } from 'react'
import { getPostBySlug, getPrevNextPosts } from './blogRegistry'
import styles from './BlogPost.module.css'

// ── Icons ──────────────────────────────────────────────────────
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)
const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const IconTag = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
)
const IconArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
)
const IconArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
)
const IconLink = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)
const IconLinkedIn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
)
const IconTwitter = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.23H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const IconExternalLink = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

// ── Reading Progress ────────────────────────────────────────────
function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const el = document.documentElement
      const scrollTop = el.scrollTop || document.body.scrollTop
      const scrollHeight = el.scrollHeight - el.clientHeight
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0)
    }
    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return <div className={styles.progressBar} style={{ width: `${progress}%` }} aria-hidden="true" />
}

// ── Table of Contents ───────────────────────────────────────────
interface TocEntry { id: string; text: string }

function TableOfContents({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '-20% 0% -70% 0%' }
    )
    entries.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [entries])

  if (entries.length === 0) return null

  return (
    <nav className={styles.toc} aria-label="Table of contents">
      <p className={styles.tocTitle}>On this page</p>
      <ol className={styles.tocList}>
        {entries.map(({ id, text }) => (
          <li key={id} className={styles.tocItem}>
            <a
              href={`#${id}`}
              className={`${styles.tocLink} ${activeId === id ? styles.tocLinkActive : ''}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

// ── Share Widget ────────────────────────────────────────────────
function ShareWidget({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const url = window.location.href

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [url])

  const shareLinkedIn = () =>
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'noopener')

  const shareTwitter = () =>
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener')

  return (
    <div className={styles.shareCard}>
      <p className={styles.shareTitle}>Share this post</p>
      <div className={styles.shareButtons}>
        <button className={`${styles.shareBtn} ${styles.shareBtnCopy}`} onClick={handleCopy} id="blog-share-copy">
          {copied ? <IconCheck /> : <IconLink />}
          <span>{copied ? 'Copied!' : 'Copy link'}</span>
        </button>
        <button className={`${styles.shareBtn} ${styles.shareBtnLinkedIn}`} onClick={shareLinkedIn} id="blog-share-linkedin">
          <IconLinkedIn />
          <span>LinkedIn</span>
        </button>
        <button className={`${styles.shareBtn} ${styles.shareBtnTwitter}`} onClick={shareTwitter} id="blog-share-twitter">
          <IconTwitter />
          <span>X / Twitter</span>
        </button>
      </div>
    </div>
  )
}

// ── Main Layout ─────────────────────────────────────────────────
interface BlogPostLayoutProps {
  slug: string
  heroImagePath?: string   // optional per-post override for hero BG
  tocEntries: TocEntry[]
  children: ReactNode
}

export function BlogPostLayout({ slug, heroImagePath, tocEntries, children }: BlogPostLayoutProps) {
  const post = getPostBySlug(slug)
  const { prev, next } = getPrevNextPosts(slug)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  if (!post) return null

  const canonicalUrl = `https://careerforge.pro/blog/${slug}`
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    image: `https://careerforge.pro${post.ogImage}`,
    datePublished: post.publishedAt,
    ...(post.updatedAt && { dateModified: post.updatedAt }),
    author: { '@type': 'Organization', name: 'CareerForge', url: 'https://careerforge.pro' },
    publisher: {
      '@type': 'Organization',
      name: 'CareerForge',
      logo: { '@type': 'ImageObject', url: 'https://careerforge.pro/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  }

  return (
    <div className={styles.page}>
      <ReadingProgress />

      <Helmet>
        <title>{`${post.title} | CareerForge Blog`}</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:image" content={`https://careerforge.pro${post.ogImage}`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="CareerForge" />
        <meta property="article:published_time" content={post.publishedAt} />
        {post.tags.map((t) => <meta key={t} property="article:tag" content={t} />)}
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription} />
        <meta name="twitter:image" content={`https://careerforge.pro${post.ogImage}`} />
        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* ── Hero ── */}
      <header className={styles.hero}>
        <div
          className={styles.heroBg}
          style={heroImagePath ? { backgroundImage: `url(${heroImagePath})` } : undefined}
          aria-hidden="true"
        />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          {post.series && (
            <span className={styles.seriesBadge}>
              {post.series}{post.seriesDay ? ` — Day ${post.seriesDay}` : ''}
            </span>
          )}
          <h1 className={styles.heroTitle}>{post.title}</h1>
          <div className={styles.hereMeta}>
            <span className={styles.metaTag}><IconCalendar />{formattedDate}</span>
            <span className={styles.metaDot} />
            <span className={styles.metaTag}><IconClock />{post.readingTime} min read</span>
            {post.tags.slice(0, 2).map((tag) => (
              <>
                <span className={styles.metaDot} />
                <span className={styles.metaTag} key={tag}><IconTag />{tag}</span>
              </>
            ))}
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className={styles.body}>
        <div className={styles.bodyInner}>
          {/* Left column: article prose + CTA + prev/next */}
          <div className={styles.articleCol}>
            <article className={styles.article} id="blog-article">
              {children}
            </article>

            {/* CTA Strip — outside <article> so .article p / .article a don't cascade here */}
            <aside className={styles.ctaStrip} aria-label="CareerForge call to action">
              <div className={styles.ctaStripGlow} aria-hidden="true" />
              <div className={styles.ctaTextBlock}>
                <span className={styles.ctaLabel}>Free Tool</span>
                <strong className={styles.ctaTitle}>See exactly what the ATS sees in your resume</strong>
                <span className={styles.ctaSubtitle}>Our AI parser mirrors TCS Neuralent &amp; Workday logic. Instant visibility score — no signup needed.</span>
              </div>
              <Link to="/jd-tailor" className={styles.ctaButton} id="blog-cta-scoring">
                Check your ATS Score
                <IconExternalLink />
              </Link>
            </aside>

            {/* Prev / Next — outside <article> so .article a doesn't cascade here */}
            <nav className={styles.prevNextNav} aria-label="Post navigation">
              {prev ? (
                <Link to={`/blog/${prev.slug}`} className={styles.navCard} id="blog-nav-prev">
                  <span className={styles.navDirection}><IconArrowLeft />Previous</span>
                  <span className={styles.navCardTitle}>{prev.shortTitle}</span>
                </Link>
              ) : <div className={`${styles.navCard} ${styles.navCardPlaceholder}`} />}

              {next ? (
                <Link to={`/blog/${next.slug}`} className={`${styles.navCard} ${styles.navCardNext}`} id="blog-nav-next">
                  <span className={styles.navDirection}>Next<IconArrowRight /></span>
                  <span className={styles.navCardTitle}>{next.shortTitle}</span>
                </Link>
              ) : <div className={`${styles.navCard} ${styles.navCardPlaceholder}`} />}
            </nav>
          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <TableOfContents entries={tocEntries} />
            <ShareWidget title={post.title} />
          </aside>
        </div>
      </div>
    </div>
  )
}
