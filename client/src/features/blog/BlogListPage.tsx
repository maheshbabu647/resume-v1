import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { SORTED_POSTS } from './blogRegistry'
import type { BlogPost } from './blogRegistry'
import styles from './BlogListPage.module.css'
import blogCover from '@/assets/blog-post-1-cover.png'

// Map slugs to their imported cover assets.
// Add a new entry here each time you add a post with a cover image.
const COVER_IMAGES: Record<string, string> = {
  'why-indian-fresher-resumes-are-invisible-to-ats-2026': blogCover,
  'ats-friendly-resume-format-indian-freshers-2026': blogCover,
  'how-to-check-your-ats-score-before-applying-india-2026': blogCover,
  '10-resume-formatting-mistakes-indian-freshers-2026': blogCover,
  'ats-keywords-for-indian-freshers-2026': blogCover,
  'how-to-write-a-resume-objective-for-freshers-in-india-2026': blogCover,
  'how-to-write-the-projects-section-on-your-resume-2026': blogCover,
  'resume-skills-section-for-indian-freshers-2026': blogCover,
}

// ── Icons ──────────────────────────────────────────────────────
const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IconArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const IconPen = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
)

// ── Featured Post Card ──────────────────────────────────────────
function FeaturedCard({ post }: { post: BlogPost }) {
  const cover = COVER_IMAGES[post.slug]
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <Link
      to={`/blog/${post.slug}`}
      className={styles.featuredCard}
      id={`blog-featured-${post.slug}`}
      aria-label={`Read: ${post.title}`}
    >
      {/* Image panel */}
      <div className={styles.featuredImage}>
        {cover && (
          <div
            className={styles.featuredImageBg}
            style={{ backgroundImage: `url(${cover})` }}
            role="img"
            aria-label={`Cover image for ${post.title}`}
          />
        )}
        <div className={styles.featuredImageOverlay} aria-hidden="true" />
        {post.series && post.seriesDay && (
          <span className={styles.featuredBadge}>
            {post.series} · Day {post.seriesDay}
          </span>
        )}
      </div>

      {/* Content panel */}
      <div className={styles.featuredContent}>
        {post.series && <p className={styles.postSeries}>{post.series}</p>}
        <h2 className={styles.featuredTitle}>{post.title}</h2>
        <p className={styles.featuredExcerpt}>{post.excerpt}</p>

        <div className={styles.postMeta}>
          <span className={styles.postMetaItem}><IconCalendar />{formattedDate}</span>
          <span className={styles.postMetaItem}><IconClock />{post.readingTime} min read</span>
        </div>

        <div className={styles.tagRow}>
          {post.tags.slice(0, 3).map((t) => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>

        <span className={styles.readMore}>
          Read full article <IconArrowRight />
        </span>
      </div>
    </Link>
  )
}

// ── Regular Post Card ───────────────────────────────────────────
function PostCard({ post }: { post: BlogPost }) {
  const cover = COVER_IMAGES[post.slug]
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

  return (
    <Link
      to={`/blog/${post.slug}`}
      className={styles.postCard}
      id={`blog-card-${post.slug}`}
      aria-label={`Read: ${post.title}`}
    >
      <div className={styles.postCardImageWrap}>
        {cover && (
          <div
            className={styles.postCardImageBg}
            style={{ backgroundImage: `url(${cover})` }}
            role="img"
            aria-label={`Cover image for ${post.title}`}
          />
        )}
        <div className={styles.postCardImageOverlay} aria-hidden="true" />
        {post.series && post.seriesDay && (
          <span className={styles.postCardSeriesBadge}>
            {post.series} · Day {post.seriesDay}
          </span>
        )}
      </div>

      <div className={styles.postCardBody}>
        <h2 className={styles.postCardTitle}>{post.title}</h2>
        <p className={styles.postCardExcerpt}>{post.excerpt}</p>

        <div className={styles.postMeta}>
          <span className={styles.postMetaItem}><IconCalendar />{formattedDate}</span>
          <span className={styles.postMetaItem}><IconClock />{post.readingTime} min read</span>
        </div>

        <div className={styles.tagRow}>
          {post.tags.slice(0, 2).map((t) => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>
      </div>
    </Link>
  )
}

// ── Blog List Page ──────────────────────────────────────────────
export default function BlogListPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const [featured, ...rest] = SORTED_POSTS

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Career Blog — ATS Tips, Resume Advice &amp; Job Market Insights | CareerForge</title>
        <meta
          name="description"
          content="Expert career advice for Indian freshers. Learn how to beat ATS systems, write an interview-winning resume, and navigate the 2026 Indian job market."
        />
        <link rel="canonical" href="https://careerforge.pro/blog" />
        <meta property="og:title" content="CareerForge Career Blog" />
        <meta property="og:description" content="Expert career advice for Indian freshers — ATS tips, resume templates, and job market insights." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://careerforge.pro/blog" />
      </Helmet>

      {/* ── Hero ── */}
      <header className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroGlow2} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>
            <span className={styles.heroEyebrowDot} />
            The CareerForge Blog
          </div>
          <h1 className={styles.heroTitle}>
            Career intelligence for the{' '}
            <span className={styles.accent}>ambitious Indian fresher</span>
          </h1>
          <p className={styles.heroSubtitle}>
            ATS strategies, resume templates, and job market insights — published daily during
            the 90-Day Career Forge series.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>{SORTED_POSTS.length}</span>
              <span className={styles.heroStatLabel}>Articles published</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>Daily</span>
              <span className={styles.heroStatLabel}>Publishing frequency</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>Free</span>
              <span className={styles.heroStatLabel}>Always</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <main className={styles.body} id="blog-list">
        {SORTED_POSTS.length === 0 ? (
          <div className={styles.emptyState}>
            <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)' }}>
              First post coming soon.
            </p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <>
                <div className={styles.featuredLabel}>
                  <IconPen />
                  Latest Post
                  <span className={styles.featuredLabelLine} />
                </div>
                <FeaturedCard post={featured} />
              </>
            )}

            {/* Grid of remaining posts */}
            {rest.length > 0 && (
              <>
                <div className={styles.gridLabel}>
                  All Articles
                  <span style={{ flex: 1, height: 1, background: 'var(--outline-variant)' }} />
                </div>
                <div className={styles.grid}>
                  {rest.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
