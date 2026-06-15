import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Sparkles, Search, Clock, ArrowRight, Quote } from 'lucide-react'
import { SORTED_POSTS } from './blogRegistry'
import { usePublishedArticles } from './articlesApi'
import { CATEGORIES, CATEGORY_COLOR, categoryFor } from './blogCategories'
import type { PostCardData } from './blogCategories'
import { ArticleCard } from './ArticleCard'
import { Newsletter } from './Newsletter'
import styles from './BlogListPage.module.css'

// ── Featured card ────────────────────────────────────────────────
function FeaturedCard({ post }: { post: PostCardData }) {
  const navigate = useNavigate()
  const cat = categoryFor(post)
  const col = CATEGORY_COLOR[cat]
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })

  return (
    <div className={styles.featuredCard} onClick={() => navigate(`/blog/${post.slug}`)} role="link" tabIndex={0}>
      <div className={styles.featuredVisual}>
        <div className={styles.featuredDotgrid} aria-hidden="true" />
        <div className={styles.featuredGlow} aria-hidden="true" />
        <div className={styles.featuredKicker}>
          <Sparkles size={12} color="#FF5C35" />
          Featured this week
        </div>
        <div className={styles.featuredQuoteBlock}>
          <Quote size={56} className={styles.featuredQuoteIcon} />
          <p className={styles.featuredQuote}>&ldquo;{post.excerpt}&rdquo;</p>
        </div>
        <div className={styles.featuredAuthor}>
          <div className={styles.featuredAvatar}>C</div>
          <div>
            <div className={styles.featuredAuthorName}>CareerForgePro Team</div>
            <div className={styles.featuredAuthorRole}>Editorial Team</div>
          </div>
        </div>
      </div>
      <div className={styles.featuredText}>
        <div className={styles.featuredCategory} style={{ background: `${col}15`, color: col }}>{cat}</div>
        <h3 className={styles.featuredTitle}>{post.title}</h3>
        <p className={styles.featuredExcerpt}>{post.excerpt}</p>
        <div className={styles.featuredMeta}>
          <span>{formattedDate}</span>
          <span className={styles.metaDot} />
          <span className={styles.featuredMetaRead}><Clock size={12} /> {post.readingTime} min read</span>
        </div>
        <Link to={`/blog/${post.slug}`} className={styles.featuredCta}>
          Read article <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

// ── Blog List Page ──────────────────────────────────────────────
export default function BlogListPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const { data } = usePublishedArticles({ limit: 50 })
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  // DB articles when available; static registry until the migration is run
  const posts: PostCardData[] = useMemo(() => {
    if (data && data.articles.length > 0) {
      return data.articles.map((a) => ({
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
    }
    return SORTED_POSTS
  }, [data])

  const featured = useMemo(() => posts.find((p) => p.tags?.includes('Featured')) ?? posts[0], [posts])
  const showFeatured = Boolean(featured) && category === 'All' && !search

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return posts.filter((post) => {
      if (post.slug === featured?.slug) return false
      const matchCat = category === 'All' || categoryFor(post) === category
      const matchSearch = !q || post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [posts, search, category, featured])

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
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <Sparkles size={12} color="#FF5C35" />
            Updated weekly · Free for everyone
          </div>
          <h1 className={styles.heroTitle}>
            Land the job.<br />Skip the trial-and-error.
          </h1>
          <p className={styles.heroSubtitle}>
            Resume tactics, ATS hacks, interview playbooks and real career stories — written for ambitious job seekers, completely free.
          </p>

          <div className={styles.searchFilters}>
            <div className={styles.searchBox}>
              <Search size={16} color="#8888A5" />
              <input
                className={styles.searchInput}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles…"
              />
              <button className={styles.searchBtn} type="button">Search</button>
            </div>
            <div className={styles.categoryPills}>
              {CATEGORIES.map((c) => {
                const active = category === c.label
                return (
                  <button
                    key={c.label}
                    className={styles.categoryPill}
                    onClick={() => setCategory(c.label)}
                    style={active ? { background: c.col, borderColor: c.col, color: '#fff' } : undefined}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </header>

      {posts.length === 0 ? (
        <div className={styles.emptyState}>
          <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)' }}>
            First post coming soon.
          </p>
        </div>
      ) : (
        <>
          {/* ── Featured ── */}
          {showFeatured && (
            <div className={styles.featuredSection}>
              <FeaturedCard post={featured} />
            </div>
          )}

          {/* ── Grid ── */}
          <div className={styles.gridSection}>
            <div className={styles.gridHeader}>
              <h2 className={styles.gridTitle}>{category === 'All' ? 'Latest articles' : category}</h2>
              <span className={styles.gridCount}>{filtered.length} article{filtered.length !== 1 ? 's' : ''}</span>
            </div>
            {filtered.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No articles match your search yet.</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {filtered.map((post) => (
                  <ArticleCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Newsletter ── */}
      <Newsletter />
    </div>
  )
}
