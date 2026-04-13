import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Search, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { Modal } from '@/shared/components/Modal/Modal'
import styles from './TemplatesPage.module.css'

import { TEMPLATE_REGISTRY } from '../resume-builder/templates/registry'

const FILTERS = ['All', 'Minimal', 'Professional', 'Creative', 'Technical'] as const
type Filter = typeof FILTERS[number]

const TEMPLATES = Object.values(TEMPLATE_REGISTRY).map(t => ({
  id: t.id,
  name: t.name, // Will be "Modern Centered" instead of "MODERN CENTERED"
  imageUrl: t.thumbnailUrl,
  tag: t.tags?.style || 'Modern',
  industries: t.tags?.industry || [],
  ats: 96,
  desc: t.isAtsRecommended ? 'ATS-Optimized layout for professional roles.' : 'Modern creative layout.'
}))

export default function TemplatesPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All')
  const { isAuthenticated } = useAuthStore()
  const [search, setSearch] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)

  const filtered = TEMPLATES.filter((t) => {
    const matchFilter = activeFilter === 'All' || t.industries.includes(activeFilter as any)
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
        <div className={styles.heroBadge}>{TEMPLATES.length} premium templates</div>
        <h1 className={styles.heroTitle}>The Executive Library</h1>
        <p className={styles.heroSub}>Choose a high-end editorial layout designed to pass ATS checks and impress recruiters.</p>
        <div className={styles.searchBar}>
          <Search size={15} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search our collection..."
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
            <div className={styles.thumb}>
              {t.imageUrl ? (
                <img src={t.imageUrl} alt={t.name} className={styles.thumbImage} />
              ) : (
                <div className={styles.thumbPlaceholder}>
                  <div className={styles.placeholderLogo} />
                  <div className={styles.placeholderLines}>
                    <div style={{ width: '40%' }} />
                    <div style={{ width: '80%' }} />
                    <div style={{ width: '60%' }} />
                  </div>
                </div>
              )}
              
              <div className={`${styles.thumbOverlay} ${hoveredId === t.id ? styles.overlayVisible : ''}`}>
                <div className={styles.overlayActions}>
                  <Link to={`/resume/new?template=${t.id}`}>
                    <Button variant="primary">Use Template <ArrowRight size={14} /></Button>
                  </Link>
                  <button 
                    className={styles.previewBtn}
                    onClick={(e) => { e.stopPropagation(); setPreviewImageUrl(t.imageUrl || null); }}
                  >
                    View Preview
                  </button>
                </div>
              </div>
              
              <div className={styles.thumbBadge}>
                <CheckCircle2 size={10} />
                <span>ATS {t.ats}%</span>
              </div>
            </div>

            <div className={styles.cardInfo}>
              <h3 className={styles.cardName}>{t.name}</h3>
              <p className={styles.customLabel}>Fully Customizable</p>
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
          <Link to="/resume/new"><Button variant="primary" size="lg">Start Building <ArrowRight size={16} /></Button></Link>
        ) : (
          <Link to="/resume/new"><Button variant="primary" size="lg">Start for free <ArrowRight size={16} /></Button></Link>
        )}
      </section>

      <Modal 
        isOpen={!!previewImageUrl} 
        onClose={() => setPreviewImageUrl(null)} 
        title="Template Preview"
      >
        <div className={styles.previewModalBody}>
          <img src={previewImageUrl || ''} alt="Template Preview" className={styles.previewFullImage} />
        </div>
      </Modal>
    </div>
  )
}
