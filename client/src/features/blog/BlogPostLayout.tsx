import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import type { ReactNode } from 'react'
import { ArrowLeft, Bookmark, Share2, Check } from 'lucide-react'
import { getPostBySlug, getRelatedPosts } from './blogRegistry'
import { categoryFor, CATEGORY_COLOR } from './blogCategories'
import type { PostCardData } from './blogCategories'
import { ArticleCard } from './ArticleCard'
import { Newsletter } from './Newsletter'
import styles from './BlogPost.module.css'

// ── Brand icons (not in lucide-react) ───────────────────────────
const IconTwitter = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.23H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
const IconLinkedIn = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
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

// ── Main Layout ─────────────────────────────────────────────────
export interface PostMeta {
  title: string
  shortTitle: string
  metaDescription: string
  ogImage?: string
  publishedAt?: string
  updatedAt?: string
  readingTime?: number
  tags: string[]
  series?: string
  seriesDay?: number
  excerpt: string
}

interface TocEntry { id: string; text: string }

interface BlogPostLayoutProps {
  slug: string
  /** Pass post metadata directly (DB-backed articles). Falls back to the static registry. */
  post?: PostMeta
  /** "Keep reading" suggestions (DB-backed articles). Falls back to the static registry. */
  related?: PostCardData[]
  heroImagePath?: string   // unused in the current design, kept for static-post compatibility
  tocEntries: TocEntry[]   // unused in the current design, kept for static-post compatibility
  children: ReactNode
}

export function BlogPostLayout({ slug, post: postProp, related: relatedProp, children }: BlogPostLayoutProps) {
  const post = postProp ?? getPostBySlug(slug)
  const related = relatedProp ?? getRelatedPosts(slug, 3)

  const [copied, setCopied] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const shareLinkedIn = () =>
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener')

  const shareTwitter = () =>
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post?.title ?? '')}&url=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener')

  if (!post) return null

  const cat = categoryFor(post)
  const col = CATEGORY_COLOR[cat]

  const canonicalUrl = `https://careerforge.pro/blog/${slug}`
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    : ''

  const ogImageUrl = post.ogImage
    ? (post.ogImage.startsWith('http') ? post.ogImage : `https://careerforge.pro${post.ogImage}`)
    : 'https://careerforge.pro/assets/blog-post-1-cover.png'

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    image: ogImageUrl,
    ...(post.publishedAt && { datePublished: post.publishedAt }),
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
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="CareerForge" />
        {post.publishedAt && <meta property="article:published_time" content={post.publishedAt} />}
        {post.tags.map((t) => <meta key={t} property="article:tag" content={t} />)}
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* ── Back link ── */}
      <div className={styles.backLinkWrap}>
        <Link to="/blog" className={styles.backLink}>
          <ArrowLeft size={14} /> All Insights
        </Link>
      </div>

      {/* ── Article header + body ── */}
      <article className={styles.header}>
        <div className={styles.categoryBadge} style={{ background: `${col}15`, color: col }}>{cat}</div>
        <h1 className={styles.title}>{post.title}</h1>
        {post.excerpt && <p className={styles.subtitle}>{post.excerpt}</p>}

        <div className={styles.metaRow}>
          <div className={styles.avatar}>C</div>
          <div className={styles.metaText}>
            <div className={styles.authorName}>CareerForgePro Team</div>
            <div className={styles.metaSub}>
              Editorial Team
              {formattedDate && ` · ${formattedDate}`}
              {!!post.readingTime && ` · ${post.readingTime} min read`}
            </div>
          </div>
          <div className={styles.shareIcons}>
            <button className={styles.iconBtn} aria-label="Bookmark"><Bookmark size={15} /></button>
            <button className={styles.iconBtn} onClick={handleCopy} aria-label="Copy link">
              {copied ? <Check size={15} /> : <Share2 size={15} />}
            </button>
            <button className={styles.iconBtn} onClick={shareTwitter} aria-label="Share on X"><IconTwitter /></button>
            <button className={styles.iconBtn} onClick={shareLinkedIn} aria-label="Share on LinkedIn"><IconLinkedIn /></button>
          </div>
        </div>

        <div className={styles.article} id="blog-article">
          {children}
        </div>

        {/* Author block */}
        <div className={styles.authorBlock}>
          <div className={styles.authorAvatar}>C</div>
          <div className={styles.authorInfo}>
            <div className={styles.authorBlockName}>CareerForgePro Team</div>
            <div className={styles.authorRole}>Editorial Team</div>
            <div className={styles.authorBio}>
              We build CareerForgePro to help Indian job seekers beat ATS systems and land interviews faster — and write about what actually works.
            </div>
          </div>
          <button className={styles.followBtn}>Follow</button>
        </div>
      </article>

      {/* ── Keep reading ── */}
      {related.length > 0 && (
        <div className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>Keep reading</h2>
          <div className={styles.relatedGrid}>
            {related.map((p) => <ArticleCard key={p.slug} post={p} />)}
          </div>
        </div>
      )}

      <Newsletter />
    </div>
  )
}
