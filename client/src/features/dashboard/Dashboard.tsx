import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Plus, FileText, MoreHorizontal, Edit3, Copy, Trash2,
  Clock, X, CheckCircle2, Lock,
  ArrowRight, Sparkles, Mail, Gauge, FileSignature,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { apiClient } from '@/shared/lib/apiClient'
import { Button } from '@/shared/components/Button/Button'
import styles from './Dashboard.module.css'

import { TEMPLATE_REGISTRY } from '../resume-builder/templates/registry'
import { GetStartedFlow } from './GetStartedFlow'

const TEMPLATES_QUICK = Object.values(TEMPLATE_REGISTRY).map(t => ({
  id: t.id,
  name: t.name,
  color: t.id === 'modern-centered' ? '#1e2d4a' : t.id === 'classic-sidebar' ? '#006c49' : '#1a2744',
  thumbnailUrl: t.thumbnailUrl
}))

// Three distinct, non-overlapping tools
const ACTIONS = [
  {
    accent: 'brand',
    icon: FileText,
    title: 'Resume Builder',
    desc: 'Create a polished, ATS-ready resume from a template.',
    cta: 'New resume',
    action: 'modal' as const,
  },
  {
    accent: 'green',
    icon: Gauge,
    title: 'ATS Score',
    desc: 'Score any resume against a JD and tailor it to close the gaps.',
    cta: 'Run a check',
    to: '/jd-tailor',
  },
  {
    accent: 'coral',
    icon: Mail,
    title: 'Cover Letter',
    desc: 'AI-personalised cover letter for any role in under 60 seconds.',
    cta: 'Generate letter',
    to: '/cover-letter',
  },
] as const

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 2)  return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7)   return `${days}d ago`
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function Dashboard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <AuthedDashboard /> : <AnonDashboard />
}

function AuthedDashboard() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showNewModal, setShowNewModal] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [openLetterMenuId, setOpenLetterMenuId] = useState<string | null>(null)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const { data: resumes = [], isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      const res = await apiClient.get('/resumes')
      return res.data.data.resumes as any[]
    },
  })

  const { data: coverLetters = [], isLoading: coverLettersLoading } = useQuery({
    queryKey: ['coverLetters'],
    queryFn: async () => {
      const res = await apiClient.get('/cover-letters')
      return res.data.data.coverLetters as any[]
    },
  })

  const duplicateMutation = useMutation({
    mutationFn: async (id: string) => apiClient.post(`/resumes/${id}/duplicate`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['resumes'] }); setOpenMenuId(null) },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/resumes/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['resumes'] }); setOpenMenuId(null) },
  })

  const deleteLetterMutation = useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/cover-letters/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['coverLetters'] }); setOpenLetterMenuId(null) },
  })

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const dateStr    = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
  const firstName  = user?.name?.split(' ')[0] ?? 'there'

  // Merge resumes + cover letters, sort by recency, show top 3
  const recentItems = useMemo(() => [
    ...resumes.map((r: any) => ({
      kind: 'resume' as const,
      id: r._id,
      title: r.title || 'Untitled Resume',
      sub: TEMPLATE_REGISTRY[r.templateId as keyof typeof TEMPLATE_REGISTRY]?.name || 'Resume',
      updatedAt: r.updatedAt,
      to: `/resume/${r._id}`,
    })),
    ...coverLetters.map((cl: any) => ({
      kind: 'cover' as const,
      id: cl._id,
      title: cl.title || 'Untitled Cover Letter',
      sub: cl.companyName || cl.roleName || 'Cover letter',
      updatedAt: cl.updatedAt,
      to: `/cover-letter/${cl._id}`,
    })),
  ]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3),
  [resumes, coverLetters])

  const hasContent = resumes.length > 0 || coverLetters.length > 0

  return (
    <div className={styles.page}>
      {/* ── Greeting ── */}
      <div className={styles.greetingBlock}>
        <div className={styles.dateLabel}>{dateStr}</div>
        <h1 className={styles.greetingTitle}>
          {greeting()}, <span className={styles.greetingName}>{firstName}.</span>
        </h1>
      </div>

      {/* ── Do you have an existing resume? (first time / no resumes) ── */}
      {!isLoading && resumes.length === 0 && <GetStartedFlow />}

      {/* ── Pick up where you left off ── */}
      {!isLoading && !coverLettersLoading && hasContent && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionLabel}>Pick up where you left off</h2>
          </div>
          <div className={styles.recentsGrid}>
            {recentItems.map(item => (
              <button
                key={item.id}
                className={styles.recentCard}
                onClick={() => navigate(item.to)}
              >
                <div className={styles.recentCardTop}>
                  <span className={`${styles.recentTag} ${item.kind === 'resume' ? styles.recentTagBrand : styles.recentTagCoral}`}>
                    {item.kind === 'resume' ? 'Resume' : 'Cover letter'}
                  </span>
                </div>
                <div className={styles.recentCardTitle}>{item.title}</div>
                <div className={styles.recentCardMeta}>
                  <span>{item.sub}</span>
                  <span className={styles.recentDot}>·</span>
                  <span>{relativeTime(item.updatedAt)}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Three core tools ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionLabel}>What would you like to do?</h2>
        </div>
        <div className={styles.actionsGrid}>
          {ACTIONS.map((a) => {
            const Icon = a.icon
            const handleClick = 'action' in a && a.action === 'modal'
              ? () => setShowNewModal(true)
              : () => navigate((a as any).to)
            return (
              <button key={a.title} className={styles.actionCard} data-accent={a.accent} onClick={handleClick}>
                <div className={styles.actionIcon}><Icon size={18} /></div>
                <div className={styles.actionTitle}>{a.title}</div>
                <div className={styles.actionDesc}>{a.desc}</div>
                <div className={styles.actionCta}>{a.cta} <ArrowRight size={13} /></div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── My resumes ── */}
      {(isLoading || resumes.length > 0) && (
        <section id="resumes-section" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionLabel}>My resumes</h2>
            <button className={styles.sectionLink} onClick={() => setShowNewModal(true)}>
              <Plus size={13} /> New resume
            </button>
          </div>

          <div className={styles.grid}>
            {isLoading ? (
              <div className={styles.loadingState}>Loading your resumes&hellip;</div>
            ) : resumes.map((r: any) => {
              const template  = TEMPLATE_REGISTRY[r.templateId as keyof typeof TEMPLATE_REGISTRY]
              const tColor    = template?.id === 'modern-centered' ? '#1e2d4a' : '#006c49'
              const lastEdited = new Date(r.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

              return (
                <div key={r._id} className={styles.card}>
                  <div className={styles.cardThumb} style={{ '--c': tColor } as React.CSSProperties}>
                    <div className={styles.thumbLines}>
                      <div className={styles.tl} style={{ width: '60%' }} />
                      <div className={styles.tl} style={{ width: '40%', height: 3 }} />
                      <div style={{ height: 6 }} />
                      <div className={styles.tl} style={{ width: '35%', height: 3, opacity: 0.5 }} />
                      {[100, 80, 90, 70, 65].map((w, i) => (
                        <div key={i} className={styles.tl} style={{ width: `${w}%`, opacity: 0.25 }} />
                      ))}
                    </div>
                    <div className={styles.atsOverlay}>
                      <CheckCircle2 size={12} />
                      ATS ready
                    </div>
                    <button
                      className={styles.menuBtn}
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === r._id ? null : r._id) }}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {openMenuId === r._id && (
                      <div className={styles.menu}>
                        <button className={styles.menuItem} onClick={() => navigate(`/resume/${r._id}`)}><Edit3 size={13} /> Edit</button>
                        <button className={styles.menuItem} onClick={() => navigate('/cover-letter', { state: { resumeId: r._id } })}><Mail size={13} /> Write cover letter</button>
                        <button className={styles.menuItem} onClick={() => duplicateMutation.mutate(r._id)}><Copy size={13} /> Duplicate</button>
                        <button className={`${styles.menuItem} ${styles.menuDanger}`} onClick={() => { if (confirm('Delete this resume?')) deleteMutation.mutate(r._id) }}><Trash2 size={13} /> Delete</button>
                      </div>
                    )}
                  </div>
                  <div className={styles.cardInfo}>
                    <div>
                      <h3 className={styles.cardTitle}>{r.title}</h3>
                      <span className={styles.cardTemplate}>{template?.name || r.templateId}</span>
                    </div>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardTime}><Clock size={11} /> {lastEdited}</span>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/resume/${r._id}`)}>
                        Edit <Edit3 size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── My cover letters (list style) ── */}
      {(coverLettersLoading || coverLetters.length > 0) && (
        <section id="letters-section" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionLabel}>My cover letters</h2>
            <button className={styles.sectionLink} onClick={() => navigate('/cover-letter')}>
              <Plus size={13} /> New letter
            </button>
          </div>

          {coverLettersLoading ? (
            <div className={styles.loadingState}>Loading cover letters&hellip;</div>
          ) : (
            <div className={styles.letterList}>
              {coverLetters.map((cl: any) => (
                <div key={cl._id} className={styles.letterRow} onClick={() => navigate(`/cover-letter/${cl._id}`)}>
                  <div className={styles.letterRowIcon}>
                    <Mail size={15} />
                  </div>
                  <div className={styles.letterRowBody}>
                    <div className={styles.letterRowTitle}>{cl.title}</div>
                    <div className={styles.letterRowMeta}>{cl.companyName || cl.roleName || 'Cover letter'}</div>
                  </div>
                  <div className={styles.letterRowTime}>{relativeTime(cl.updatedAt)}</div>
                  <div className={styles.letterRowActions} onClick={e => e.stopPropagation()}>
                    <button
                      className={styles.letterMenuBtn}
                      onClick={() => setOpenLetterMenuId(openLetterMenuId === cl._id ? null : cl._id)}
                    >
                      <MoreHorizontal size={15} />
                    </button>
                    {openLetterMenuId === cl._id && (
                      <div className={styles.letterMenu}>
                        <button className={styles.menuItem} onClick={() => navigate(`/cover-letter/${cl._id}`)}><Edit3 size={13} /> Edit</button>
                        <button className={`${styles.menuItem} ${styles.menuDanger}`} onClick={() => { if (confirm('Delete this cover letter?')) deleteLetterMutation.mutate(cl._id) }}><Trash2 size={13} /> Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Mobile Navigation ── */}
      <div className={styles.bottomNav}>
        <div className={styles.bottomNavInner}>
          <button className={styles.bottomNavItem} onClick={() => scrollTo('resumes-section')}>
            <FileText size={20} />
            <span className={styles.bottomNavLabel}>Resumes</span>
          </button>
          <button className={styles.bottomNavItem} onClick={() => scrollTo('letters-section')}>
            <FileSignature size={20} />
            <span className={styles.bottomNavLabel}>Letters</span>
          </button>
        </div>
      </div>

      {/* ── New Resume Modal ── */}
      {showNewModal && (
        <div className={styles.modalOverlay} onClick={() => setShowNewModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHead}>
              <h2 className={styles.modalTitle}>Choose a template</h2>
              <button className={styles.modalClose} onClick={() => setShowNewModal(false)}><X size={18} /></button>
            </div>
            <p className={styles.modalSub}>You can change the template at any time in the editor.</p>
            <div className={styles.modalGrid}>
              {TEMPLATES_QUICK.map((t) => (
                <button
                  key={t.id}
                  className={styles.modalCard}
                  onClick={() => { setShowNewModal(false); navigate(`/resume/new?template=${t.id}`) }}
                >
                  {t.thumbnailUrl ? (
                    <img src={t.thumbnailUrl} alt={t.name} className={styles.modalThumbImage} />
                  ) : (
                    <div className={styles.modalThumb} style={{ '--c': t.color } as React.CSSProperties}>
                      <div className={styles.thumbLines}>
                        <div className={styles.tl} style={{ width: '60%' }} />
                        <div className={styles.tl} style={{ width: '40%', height: 3 }} />
                        {[80, 90, 70].map((w, i) => <div key={i} className={styles.tl} style={{ width: `${w}%`, opacity: 0.3 }} />)}
                      </div>
                    </div>
                  )}
                  <span className={styles.modalCardName}>{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Anonymous Dashboard ───────────────────────────────────────────────────────
const TRY_CARDS = [
  { accent: 'brand', icon: FileText, title: 'Resume Builder', sub: 'Build or upload your resume', to: '/templates' },
  { accent: 'green', icon: Gauge,    title: 'ATS Score',      sub: 'Check before you apply',      to: '/jd-tailor' },
  { accent: 'coral', icon: Mail,     title: 'Cover Letter',   sub: 'Personalised in 60 seconds',  to: '/cover-letter' },
] as const

function AnonDashboard() {
  const navigate = useNavigate()

  return (
    <div className={styles.anonPage}>
      <div className={styles.anonHero}>
        <div className={styles.anonBadge}>
          <Sparkles size={12} />
          <span>Try it free &mdash; no signup needed</span>
        </div>
        <h1 className={styles.anonTitle}>Welcome. Let&apos;s build your<br />first ATS-ready resume.</h1>
        <p className={styles.anonSub}>
          Answer one quick question and we&apos;ll set you up the fastest way &mdash; no account required.
        </p>
      </div>

      <GetStartedFlow />

      <div className={styles.tryGrid}>
        {TRY_CARDS.map((c) => {
          const Icon = c.icon
          return (
            <button key={c.title} className={styles.tryCard} data-accent={c.accent} onClick={() => navigate(c.to)}>
              <div className={styles.tryIcon}><Icon size={17} /></div>
              <div className={styles.tryTitle}>{c.title}</div>
              <div className={styles.trySub}>{c.sub}</div>
            </button>
          )
        })}
      </div>

      <div className={styles.saveBanner}>
        <Lock size={18} />
        <div className={styles.saveBannerText}>
          <div className={styles.saveBannerTitle}>Your work isn&apos;t saved yet</div>
          <div className={styles.saveBannerSub}>Sign up free to keep your resumes, track applications, and unlock job suggestions.</div>
        </div>
        <Link to="/register" className={styles.saveBannerCta}>Sign up free &rarr;</Link>
      </div>
    </div>
  )
}
