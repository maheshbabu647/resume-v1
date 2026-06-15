import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Plus, FileText, MoreHorizontal, Edit3, Copy, Trash2,
  Clock, X, CheckCircle2,
  ArrowRight, Target, Sparkles, Mail, Gauge, FileSignature, LayoutGrid, BookOpen,
  Lock,
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

const ACTIONS = [
  { accent: 'brand', icon: Sparkles, title: 'Tailor a resume', desc: "Paste a JD — we'll match your resume to it.", cta: 'Paste JD', to: '/jd-tailor' },
  { accent: 'coral', icon: Mail, title: 'Write a cover letter', desc: 'Personalised in 60 seconds for any role.', cta: 'Generate letter', to: '/cover-letter' },
  { accent: 'green', icon: Gauge, title: 'ATS Score & Tailor', desc: 'Score your resume against any JD and tailor it to match.', cta: 'Run a check', to: '/jd-tailor' },
] as const

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
  const [isMoreOpen, setIsMoreOpen] = useState(false)

  const { data: resumes = [], isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      const res = await apiClient.get('/resumes')
      return res.data.data.resumes as any[]
    }
  })

  const duplicateMutation = useMutation({
    mutationFn: async (id: string) => apiClient.post(`/resumes/${id}/duplicate`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['resumes'] }); setOpenMenuId(null) }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/resumes/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['resumes'] }); setOpenMenuId(null) }
  })

  const { data: coverLetters = [], isLoading: coverLettersLoading } = useQuery({
    queryKey: ['coverLetters'],
    queryFn: async () => {
      const res = await apiClient.get('/cover-letters')
      return res.data.data.coverLetters as any[]
    }
  })

  const [openLetterMenuId, setOpenLetterMenuId] = useState<string | null>(null)

  const deleteLetterMutation = useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/cover-letters/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['coverLetters'] }); setOpenLetterMenuId(null) }
  })

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const dateStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className={styles.page}>
      {/* ── Greeting ── */}
      <div className={styles.greetingBlock}>
        <div className={styles.dateLabel}>{dateStr}</div>
        <h1 className={styles.greetingTitle}>
          {greeting()}, <span className={styles.greetingName}>{firstName}.</span>
        </h1>
      </div>

      {/* ── Do you have an existing resume? ── */}
      {!isLoading && resumes.length === 0 && <GetStartedFlow />}

      {/* ── Three core actions ── */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionLabel}>What would you like to do?</h2>
      </div>
      <div className={styles.actionsGrid}>
        {ACTIONS.map((a) => {
          const Icon = a.icon
          return (
            <button key={a.title} className={styles.actionCard} data-accent={a.accent} onClick={() => navigate(a.to)}>
              <div className={styles.actionIcon}><Icon size={18} /></div>
              <div className={styles.actionTitle}>{a.title}</div>
              <div className={styles.actionDesc}>{a.desc}</div>
              <div className={styles.actionCta}>{a.cta} <ArrowRight size={13} /></div>
            </button>
          )
        })}
      </div>

      {/* ── My resumes ── */}
      {(isLoading || resumes.length > 0) && (
        <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionLabel}>My resumes</h2>
      </div>

      <div className={styles.grid}>
        <button className={styles.newCard} onClick={() => setShowNewModal(true)}>
          <div className={styles.newCardInner}>
            <div className={styles.newCardIcon}><Plus size={24} /></div>
            <span className={styles.newCardLabel}>New resume</span>
            <span className={styles.newCardSub}>Start from a template</span>
          </div>
        </button>

        {isLoading ? (
          <div className={styles.loadingState}>Loading your resumes&hellip;</div>
        ) : resumes.map((r) => {
          const template = TEMPLATE_REGISTRY[r.templateId as keyof typeof TEMPLATE_REGISTRY]
          const tColor = template?.id === 'modern-centered' ? '#1e2d4a' : '#006c49'
          const lastEdited = new Date(r.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

          return (
            <div key={r._id} className={styles.card}>
              <div className={styles.cardThumb} style={{ '--c': tColor } as React.CSSProperties}>
                <div className={styles.thumbLines}>
                  <div className={styles.tl} style={{ width: '60%' }} />
                  <div className={styles.tl} style={{ width: '40%', height: 3 }} />
                  <div style={{ height: 6 }} />
                  <div className={styles.tl} style={{ width: '35%', height: 3, opacity: 0.5 }} />
                  {[100, 80, 90, 70, 65].map((w, i) => <div key={i} className={styles.tl} style={{ width: `${w}%`, opacity: 0.25 }} />)}
                </div>
                <div className={styles.atsOverlay}>
                  <CheckCircle2 size={12} />
                  85%
                </div>
                <button className={styles.menuBtn} onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === r._id ? null : r._id) }}>
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
        </>
      )}

      {/* ── My cover letters ── */}
      {(coverLettersLoading || coverLetters.length > 0) && (
        <>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionLabel}>My cover letters</h2>
          </div>

          <div className={styles.grid}>
            {coverLettersLoading ? (
              <div className={styles.loadingState}>Loading your cover letters&hellip;</div>
            ) : coverLetters.map((cl) => {
              const lastEdited = new Date(cl.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
              return (
                <div key={cl._id} className={styles.card}>
                  <div className={styles.cardThumb} style={{ '--c': '#e85d4d' } as React.CSSProperties}>
                    <div className={styles.thumbLines}>
                      <Mail size={28} style={{ opacity: 0.5, color: 'white' }} />
                    </div>
                    <button className={styles.menuBtn} onClick={(e) => { e.stopPropagation(); setOpenLetterMenuId(openLetterMenuId === cl._id ? null : cl._id) }}>
                      <MoreHorizontal size={16} />
                    </button>
                    {openLetterMenuId === cl._id && (
                      <div className={styles.menu}>
                        <button className={styles.menuItem} onClick={() => navigate(`/cover-letter/${cl._id}`)}><Edit3 size={13} /> Edit</button>
                        <button className={`${styles.menuItem} ${styles.menuDanger}`} onClick={() => { if (confirm('Delete this cover letter?')) deleteLetterMutation.mutate(cl._id) }}><Trash2 size={13} /> Delete</button>
                      </div>
                    )}
                  </div>
                  <div className={styles.cardInfo}>
                    <div>
                      <h3 className={styles.cardTitle}>{cl.title}</h3>
                      <span className={styles.cardTemplate}>{cl.companyName || cl.roleName || 'Cover letter'}</span>
                    </div>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardTime}><Clock size={11} /> {lastEdited}</span>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/cover-letter/${cl._id}`)}>
                        Edit <Edit3 size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* ── Mobile Navigation ── */}
      <div className={styles.bottomNav}>
        <div className={styles.bottomNavInner}>
          <button className={`${styles.bottomNavItem} ${styles.active}`}>
            <FileText size={20} />
            <span className={styles.bottomNavLabel}>Resumes</span>
          </button>
          <button className={styles.bottomNavItem} onClick={() => navigate('/cover-letter')}>
            <FileSignature size={20} />
            <span className={styles.bottomNavLabel}>Letters</span>
          </button>
          <button className={styles.bottomNavItem} onClick={() => setIsMoreOpen(!isMoreOpen)}>
            <MoreHorizontal size={20} />
            <span className={styles.bottomNavLabel}>More</span>
          </button>
        </div>
      </div>

      {/* ── More Drawer (Mobile) ── */}
      {isMoreOpen && (
        <>
          <div className={styles.drawerBackdrop} onClick={() => setIsMoreOpen(false)} />
          <div className={styles.moreDrawer}>
            <div className={styles.drawerGrid}>
              <button className={styles.drawerItem} onClick={() => { setIsMoreOpen(false); navigate('/jd-tailor'); }}>
                <Target size={24} /> <span>ATS Tailor</span>
              </button>
              <button className={styles.drawerItem} onClick={() => { setIsMoreOpen(false); navigate('/templates'); }}>
                <LayoutGrid size={24} /> <span>Templates</span>
              </button>
              <button className={styles.drawerItem} onClick={() => { setIsMoreOpen(false); navigate('/blog'); }}>
                <BookOpen size={24} /> <span>Insights</span>
              </button>
            </div>
          </div>
        </>
      )}

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

const TRY_CARDS = [
  { accent: 'brand', icon: FileText, title: 'Resume Builder', sub: 'Tailor your resume to a JD', to: '/templates' },
  { accent: 'coral', icon: Mail, title: 'Cover Letter', sub: 'Personalised in 60 seconds', to: '/cover-letter' },
  { accent: 'green', icon: Gauge, title: 'ATS Score & Tailor', sub: 'Check before you apply', to: '/jd-tailor' },
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
