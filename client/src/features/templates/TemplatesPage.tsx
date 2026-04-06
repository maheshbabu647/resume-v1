import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Search, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { useAuthStore } from '@/core/auth/useAuthStore'
import styles from './TemplatesPage.module.css'

import { TEMPLATE_REGISTRY } from '../resume-builder/templates/registry'

const FILTERS = ['All', 'Minimal', 'Professional', 'Creative', 'Technical'] as const
type Filter = typeof FILTERS[number]

const TEMPLATES = Object.values(TEMPLATE_REGISTRY).map(t => ({
  id: t.id,
  name: t.name,
  tag: t.tags?.style || 'Modern',
  category: t.tags?.industry?.[0] || 'Professional',
  color: '#1e2d4a', // Using a default base color for now
  ats: 96,
  desc: t.isAtsRecommended ? 'ATS-Optimized layout for professional roles.' : 'Modern creative layout.'
}))

export default function TemplatesPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All')
  const { isAuthenticated } = useAuthStore()
  const [search, setSearch] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const filtered = TEMPLATES.filter((t) => {
    const matchFilter = activeFilter === 'All' || t.category === activeFilter
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className={styles.page}>
      <Helmet>
        <link rel="canonical" href="https://careerforge.pro/templates" />
      </Helmet>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>{TEMPLATES.length} templates available</div>
        <h1 className={styles.heroTitle}>Choose your template</h1>
        <p className={styles.heroSub}>Every template is ATS-optimized and fully customizable with our editor.</p>
        <div className={styles.searchBar}>
          <Search size={15} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filterBar}>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${activeFilter === f ? styles.filterActive : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className={styles.grid}>
        {filtered.map((t) => (
          <div
            key={t.id}
            className={styles.card}
            onMouseEnter={() => setHoveredId(t.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className={styles.thumb} style={{ '--c': t.color } as React.CSSProperties}>
              <div className={styles.thumbContent}>
                <div className={styles.thumbHeader}>
                  <div className={styles.thumbName} />
                  <div className={styles.thumbContact} />
                </div>
                <div className={styles.thumbDivider} />
                <div className={styles.thumbSection} />
                {[100, 80, 90, 70].map((w, i) => (
                  <div key={i} className={styles.thumbLine} style={{ width: `${w}%` }} />
                ))}
              </div>
              <div className={`${styles.thumbOverlay} ${hoveredId === t.id ? styles.overlayVisible : ''}`}>
                <Link to={`/resume/new?template=${t.id}`}>
                  <Button size="sm">Use template <ArrowRight size={13} /></Button>
                </Link>
                <Link to={`/resume/new?template=${t.id}`} className={styles.previewLink}>Preview</Link>
              </div>
              {t.tag && <div className={styles.thumbTag}>{t.tag}</div>}
            </div>
            <div className={styles.cardInfo}>
              <div>
                <h3 className={styles.cardName}>{t.name}</h3>
                <p className={styles.cardDesc}>{t.desc}</p>
              </div>
              <div className={styles.atsBadge}>
                <CheckCircle2 size={12} />
                ATS {t.ats}%
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className={styles.empty}>
            <Search size={32} color="var(--outline)" />
            <p>No templates match "{search}"</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to build?</h2>
        <p className={styles.ctaSub}>Pick any template and start editing in our AI-powered editor.</p>
        {isAuthenticated ? (
          <Link to="/resume/new"><Button size="lg">Start Building <ArrowRight size={16} /></Button></Link>
        ) : (
          <Link to="/resume/new"><Button size="lg">Start for free <ArrowRight size={16} /></Button></Link>
        )}
      </section>
    </div>
  )
}
