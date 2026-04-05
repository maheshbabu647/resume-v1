import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Plus, FileText, MoreHorizontal, Edit3, Copy, Trash2,
  BarChart3, Clock, TrendingUp, X, CheckCircle2,
  Download, Zap, ArrowRight, Share2, Target, CheckCircle,
  MessageCircle, Send, Mail, Link as LinkIcon, FileSignature
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { apiClient } from '@/shared/lib/apiClient'
import { Button } from '@/shared/components/Button/Button'
import { UpgradeModal } from '@/shared/components/UpgradeModal/UpgradeModal'
import { useUsage, PLAN_LIMITS } from '@/core/hooks/useUsage'
import { trackSubscriptionCancelled, trackReferralShared } from '@/shared/lib/analytics'
import styles from './Dashboard.module.css'

import { TEMPLATE_REGISTRY } from '../resume-builder/templates/registry'

const TEMPLATES_QUICK = Object.values(TEMPLATE_REGISTRY).map(t => ({
  id: t.id,
  name: t.name,
  color: '#1e2d4a'
}))

const PLAN_DISPLAY: Record<string, { label: string; color: string; bg: string }> = {
  seeker:  { label: 'Seeker — Free',    color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
  hustler: { label: 'Hustler — ₹79/mo', color: '#818cf8', bg: 'rgba(99,102,241,0.12)'  },
  closer:  { label: 'Closer — ₹179/mo', color: '#fbbf24', bg: 'rgba(245,158,11,0.12)'  },
}

interface UsageBarProps {
  label: string
  icon: React.ReactNode
  used: number
  limit: number
  bonus?: number
  onUpgrade: () => void
}

function UsageBar({ label, icon, used, limit, bonus = 0, onUpgrade }: UsageBarProps) {
  const isUnlimited = limit === -1
  const pct = isUnlimited ? 0 : Math.min(100, Math.round((used / limit) * 100))
  const isNearLimit = !isUnlimited && pct >= 80
  const isAtLimit   = !isUnlimited && used >= limit && bonus <= 0

  return (
    <div className={`${styles.usageBar} ${isAtLimit ? styles.usageBarDanger : isNearLimit ? styles.usageBarWarn : ''}`}>
      <div className={styles.usageBarTop}>
        <span className={styles.usageBarLabel}>
          <span className={styles.usageBarIcon}>{icon}</span>
          {label}
        </span>
        <span className={styles.usageBarCount}>
          {isUnlimited ? (
            <span className={styles.usageUnlimited}>∞</span>
          ) : (
            <>
              {used}<span className={styles.usageOf}>/{limit}</span>
              {bonus > 0 && <span className={styles.usageBonus}> (+{bonus} bonus)</span>}
            </>
          )}
        </span>
      </div>
      {!isUnlimited && (
        <div className={styles.usageTrack}>
          <div
            className={styles.usageFill}
            style={{ width: `${pct}%`, background: isAtLimit ? '#ef4444' : isNearLimit ? '#f59e0b' : '#6366f1' }}
          />
        </div>
      )}
      {isAtLimit && (
        <button className={styles.usageUpgradeLink} onClick={onUpgrade}>
          Upgrade to get more <ArrowRight size={11} />
        </button>
      )}
    </div>
  )
}

export default function Dashboard() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showNewModal, setShowNewModal] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [upgradeTrigger, setUpgradeTrigger] = useState<'jdTailoring' | 'pdfDownloads' | 'jdScore' | 'aiBullets' | 'general'>('general')
  const [showShareOptions, setShowShareOptions] = useState(false)

  const { plan, usage } = useUsage()
  const planDisplay = PLAN_DISPLAY[plan] ?? PLAN_DISPLAY.seeker
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.seeker

  const openUpgrade = (trigger: typeof upgradeTrigger) => {
    setUpgradeTrigger(trigger)
    setUpgradeOpen(true)
  }

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

  // Subscription fetch for premium users to detect cancellation status
  const { data: sub } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const res = await apiClient.get('/payment/subscription')
      return res.data.data
    },
    enabled: plan !== 'seeker',
  })

  const cancelMutation = useMutation({
    mutationFn: async () => apiClient.post('/payment/cancel'),
    onSuccess: () => {
      trackSubscriptionCancelled(plan)
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
      alert('Subscription will cancel at the end of your billing period.')
    }
  })

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const referralUrl = `${window.location.origin}/register?ref=${user?.referralCode ?? ''}`
  const shareText = `Hey! Use my link to sign up on CareerForge and get free AI resume tailoring credits: ${referralUrl}`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join CareerForge',
          text: 'Get free AI resume credits on CareerForge!',
          url: referralUrl,
        })
      } catch (err) {
        setShowShareOptions(!showShareOptions)
      }
    } else {
      setShowShareOptions(!showShareOptions)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralUrl)
    setShowShareOptions(false)
    trackReferralShared('copy')
    alert('Referral link copied!')
  }

  return (
    <div className={styles.page}>
      {/* ── Stats bar ── */}
      <div className={styles.statsBar}>
        <div className={styles.greeting}>
          <h1 className={styles.greetingText}>{greeting()}, {user?.name?.split(' ')[0] ?? 'there'} 👋</h1>
          <p className={styles.greetingSub}>Here's your career progress at a glance.</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <FileText size={18} color="var(--secondary)" />
            <div>
              <div className={styles.statNum}>{resumes.length}</div>
              <div className={styles.statLabel}>Resumes</div>
            </div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <BarChart3 size={18} color="var(--secondary)" />
            <div>
              <div className={styles.statNum}>{resumes.length > 0 ? 85 : 0}%</div>
              <div className={styles.statLabel}>Avg ATS Score</div>
            </div>
          </div>
          <div className={styles.statDivider} />
          {/* Plan badge */}
          <div className={styles.stat}>
            <TrendingUp size={18} color={planDisplay.color} />
            <div>
              <div
                className={styles.planBadge}
                style={{ color: planDisplay.color, background: planDisplay.bg }}
              >
                {planDisplay.label}
              </div>
              {plan === 'seeker' && (
                <Link to="/pricing" className={styles.upgradeNudge}>
                  Upgrade <ArrowRight size={10} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-column layout: resumes + sidebar ── */}
      <div className={styles.contentRow}>
        {/* ── Left: Resume grid ── */}
        <div className={styles.contentArea}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>My Resumes</h2>
            <Button size="sm" onClick={() => setShowNewModal(true)}>
              <Plus size={14} /> New Resume
            </Button>
          </div>

          <div className={styles.grid}>
            <button className={styles.newCard} onClick={() => setShowNewModal(true)}>
              <div className={styles.newCardIcon}><Plus size={24} /></div>
              <span className={styles.newCardLabel}>New Resume</span>
              <span className={styles.newCardSub}>Start from a template</span>
            </button>

            {isLoading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-12)' }}>
                Loading your resumes...
              </div>
            ) : resumes.map((r) => {
              const template = TEMPLATE_REGISTRY[r.templateId as keyof typeof TEMPLATE_REGISTRY]
              const tColor = template?.id === 'modern-centered' ? '#1e2d4a' : '#006c49'
              const lastEdited = new Date(r.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

              return (
                <div key={r._id} className={styles.card}>
                  <div className={styles.cardThumb} style={{ '--c': tColor } as React.CSSProperties}>
                    <div className={styles.thumbLines}>
                      <div className={styles.tl} style={{ width: '60%' }} />
                      <div className={styles.tl} style={{ width: '40%', height: 3 }} />
                      <div style={{ height: 6 }} />
                      <div className={styles.tl} style={{ width: '35%', height: 3, opacity: 0.5 }} />
                      {[100,80,90,70,65].map((w,i) => <div key={i} className={styles.tl} style={{ width: `${w}%`, opacity: 0.25 }} />)}
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
                        <button className={styles.menuItem} onClick={() => duplicateMutation.mutate(r._id)}><Copy size={13} /> Duplicate</button>
                        <button className={`${styles.menuItem} ${styles.menuDanger}`} onClick={() => { if(confirm('Delete this resume?')) deleteMutation.mutate(r._id) }}><Trash2 size={13} /> Delete</button>
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

            {!isLoading && resumes.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-12)', color: 'var(--on-surface-variant)' }}>
                <FileText size={32} style={{ opacity: 0.5, marginBottom: 'var(--space-4)' }} />
                <p>You haven't created any resumes yet.</p>
                <p style={{ fontSize: 'var(--text-sm)', marginTop: '4px' }}>Click "New Resume" to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Sidebar: Usage + Referral ── */}
        <div className={styles.sidebar}>
          {/* Usage Panel */}
          <div className={styles.sideCard}>
            <div className={styles.sideCardHead}>
              <Zap size={15} />
              <h3 className={styles.sideCardTitle}>Monthly Usage</h3>
              <span className={styles.sideCardSub}>resets on the 1st</span>
            </div>

            {usage ? (
              <div className={styles.usageBars}>
                <UsageBar
                  label="PDF Downloads"
                  icon={<Download size={13} />}
                  used={usage.pdfDownloads}
                  limit={limits.pdfDownloads}
                  bonus={usage.bonusPdfDownloads}
                  onUpgrade={() => openUpgrade('pdfDownloads')}
                />
                <UsageBar
                  label="JD Score"
                  icon={<CheckCircle size={13} />}
                  used={usage.jdScore}
                  limit={limits.jdScore}
                  onUpgrade={() => openUpgrade('general')}
                />
                <UsageBar
                  label="AI Suggestions"
                  icon={<Zap size={13} />}
                  used={usage.aiBullets}
                  limit={limits.aiBullets}
                  onUpgrade={() => openUpgrade('general')}
                />
                <UsageBar
                  label="JD Tailoring"
                  icon={<Target size={13} />}
                  used={usage.jdTailoring}
                  limit={limits.jdTailoring}
                  bonus={usage.bonusTailoring}
                  onUpgrade={() => openUpgrade('jdTailoring')}
                />
                <UsageBar
                  label="Cover Letters"
                  icon={<FileSignature size={13} />}
                  used={usage.coverLetter ?? 0}
                  limit={limits.coverLetter}
                  onUpgrade={() => openUpgrade('general')}
                />
              </div>
            ) : (
              <div className={styles.usageLoading}>Loading usage…</div>
            )}

            {plan === 'seeker' ? (
              <Link to="/pricing" className={styles.sideUpgradeBtn}>
                <Zap size={14} /> Upgrade Plan <ArrowRight size={13} />
              </Link>
            ) : (
              <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {sub?.cancelAtPeriodEnd ? (
                   <>
                     <div style={{ fontSize: '11px', color: '#b45309', background: '#fef3c7', padding: '8px', borderRadius: '6px', border: '1px solid #fde68a' }}>
                       Plan cancels on <strong>{sub?.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : 'end of period'}</strong>.
                     </div>
                     <button className={styles.sideUpgradeBtn} onClick={() => openUpgrade('general')} style={{ background: planDisplay.color }}>
                       Reactivate Plan
                     </button>
                   </>
                ) : (
                   <button 
                     className={styles.sideUpgradeBtn} 
                     style={{ background: 'transparent', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                     onClick={() => {
                        if(confirm("You'll keep your premium access until the period ends. No refund. Are you sure you want to cancel?")) {
                          cancelMutation.mutate()
                        }
                     }}
                     disabled={cancelMutation.isPending}
                   >
                     {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Auto-Pay'}
                   </button>
                )}
              </div>
            )}
          </div>

          {/* Referral bonus counter */}
          {usage && (usage.bonusTailoring > 0 || usage.bonusPdfDownloads > 0) && (
            <div className={styles.sideCard} style={{ borderColor: 'rgba(99,102,241,0.25)', background: 'rgba(99,102,241,0.05)' }}>
              <div className={styles.referralCount}>
                <Share2 size={16} color="#818cf8" style={{ flexShrink: 0 }} />
                <span>
                  You have <strong>{usage.bonusTailoring} Tailoring{usage.bonusTailoring !== 1 ? 's' : ''}</strong> and <strong>{usage.bonusPdfDownloads} PDF Download{usage.bonusPdfDownloads !== 1 ? 's' : ''}</strong> earned from referrals. They never expire!
                </span>
              </div>
            </div>
          )}

          {/* Share referral nudge */}
          <div className={styles.sideCard}>
            <div className={styles.sideCardHead}>
              <Share2 size={15} />
              <h3 className={styles.sideCardTitle}>Give 2, Get 2</h3>
            </div>
            <p className={styles.referralDesc}>
              Share your link and get <strong>+2 JD Tailorings</strong> and <strong>+2 PDF Downloads</strong> for every friend who creates a resume.
            </p>
            <div className={styles.shareWrapper}>
              <Button
                variant="secondary"
                className={styles.shareBtn}
                onClick={handleShare}
              >
                <Share2 size={14} /> Share Link
              </Button>

              {showShareOptions && (
                <div className={styles.shareMenu}>
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={styles.shareItem}
                    onClick={() => trackReferralShared('whatsapp')}
                  >
                    <MessageCircle size={14} color="#25D366" /> WhatsApp
                  </a>
                  <a 
                    href={`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent('Join CareerForge!')}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={styles.shareItem}
                    onClick={() => trackReferralShared('telegram')}
                  >
                    <Send size={14} color="#0088cc" /> Telegram
                  </a>
                  <a 
                    href={`mailto:?subject=Join CareerForge&body=${encodeURIComponent(shareText)}`} 
                    className={styles.shareItem}
                    onClick={() => trackReferralShared('email')}
                  >
                    <Mail size={14} color="#ea4335" /> Email
                  </a>
                  <button onClick={copyToClipboard} className={styles.shareItem}>
                    <LinkIcon size={14} /> Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>
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
                  onClick={() => { setShowNewModal(false); navigate('/resume/new') }}
                >
                  <div className={styles.modalThumb} style={{ '--c': t.color } as React.CSSProperties}>
                    <div className={styles.thumbLines}>
                      <div className={styles.tl} style={{ width: '60%' }} />
                      <div className={styles.tl} style={{ width: '40%', height: 3 }} />
                      {[80, 90, 70].map((w, i) => <div key={i} className={styles.tl} style={{ width: `${w}%`, opacity: 0.3 }} />)}
                    </div>
                  </div>
                  <span className={styles.modalCardName}>{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Upgrade Modal ── */}
      <UpgradeModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        trigger={upgradeTrigger}
        currentPlan={plan}
      />
    </div>
  )
}
