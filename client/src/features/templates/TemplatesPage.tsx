import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { useAuthStore } from '@/core/auth/useAuthStore'
import styles from './TemplatesPage.module.css'

import { TEMPLATE_REGISTRY } from '../resume-builder/templates/registry'

const ACCENTS = ['brand', 'coral', 'green'] as const

const TEMPLATES = Object.values(TEMPLATE_REGISTRY).map((t, i) => ({
  id: t.id,
  name: t.name,
  imageUrl: t.thumbnailUrl,
  style: t.tags?.style || 'Modern',
  accent: ACCENTS[i % ACCENTS.length],
  desc: t.isAtsRecommended
    ? 'A clean, ATS-optimized layout built to clear recruiter screens.'
    : 'A modern, creative layout that still parses cleanly.',
}))

export default function TemplatesPage() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <Helmet>
        <link rel="canonical" href="https://careerforge.pro/templates" />
      </Helmet>

      {/* Hero */}
      <section className={styles.hero}>
        <span className={styles.eyebrow}>
          <Sparkles size={12} /> {TEMPLATES.length} templates &middot; ATS-tested
        </span>
        <h1 className={styles.heroTitle}>Pick a layout. Make it yours.</h1>
        <p className={styles.heroSub}>
          Every template here is built to clear ATS screening and look sharp to a human reviewer.
          Choose one to start &mdash; you can switch templates anytime without losing your content.
        </p>
      </section>

      {/* Grid */}
      <section className={styles.grid}>
        {TEMPLATES.map((t) => (
          <div
            key={t.id}
            className={styles.card}
            data-accent={t.accent}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/resume/new?template=${t.id}`)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/resume/new?template=${t.id}`) }}
          >
            <div className={styles.thumb}>
              {t.imageUrl ? (
                <img src={t.imageUrl} alt={t.name} className={styles.thumbImage} />
              ) : (
                <div className={styles.thumbPlaceholder}>
                  <div className={styles.placeholderLines}>
                    <div style={{ width: '50%' }} />
                    <div style={{ width: '85%' }} />
                    <div style={{ width: '65%' }} />
                    <div style={{ width: '40%' }} />
                  </div>
                </div>
              )}

              <span className={styles.atsBadge}>
                <CheckCircle2 size={11} /> ATS-ready
              </span>
            </div>

            <div className={styles.cardInfo}>
              <div className={styles.cardHead}>
                <h3 className={styles.cardName}>{t.name}</h3>
                <span className={styles.cardTag}>{t.style}</span>
              </div>
              <p className={styles.cardDesc}>{t.desc}</p>
              <Link
                to={`/resume/new?template=${t.id}`}
                className={styles.useBtn}
                onClick={(e) => e.stopPropagation()}
              >
                Use this template <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaText}>
          <span className={styles.ctaEyebrow}>Not sure which one?</span>
          <h2 className={styles.ctaTitle}>Start with any template &mdash; switch anytime.</h2>
          <p className={styles.ctaSub}>
            Your content stays put. Swap layouts right inside the editor until one feels right.
          </p>
        </div>
        <Link to="/resume/new">
          <Button variant="primary" size="lg">
            {isAuthenticated ? 'Start building' : 'Start for free'} <ArrowRight size={16} />
          </Button>
        </Link>
      </section>
    </div>
  )
}
