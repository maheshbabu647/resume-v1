import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Check, X as XIcon, Zap, ArrowRight, Loader2,
  Download, Brain, BarChart3, GitBranch, Share2, Shield
} from 'lucide-react'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { apiClient } from '@/shared/lib/apiClient'
import styles from './PricingPage.module.css'

type UpgradePlan = 'hustler' | 'closer'

const FEATURES = [
  { label: 'Resumes',               seeker: 'Unlimited',   hustler: 'Unlimited',   closer: 'Unlimited',    icon: <Zap size={15}/> },
  { label: 'Templates',             seeker: 'All',         hustler: 'All',         closer: 'All',          icon: <Zap size={15}/> },
  { label: 'Advanced Customization',seeker: true,          hustler: true,          closer: true,           icon: <Zap size={15}/> },
  { label: 'Resume Strength Score', seeker: true,          hustler: true,          closer: true,           icon: <BarChart3 size={15}/> },
  { label: 'PDF Downloads / month', seeker: '2',           hustler: '10',          closer: 'Unlimited',    icon: <Download size={15}/> },
  { label: 'JD Score / month',      seeker: '3',           hustler: '20',          closer: 'Unlimited',    icon: <BarChart3 size={15}/> },
  { label: 'AI Bullet Suggestions', seeker: '5 / month',   hustler: '25 / month',  closer: 'Unlimited',    icon: <Brain size={15}/> },
  { label: 'JD Tailoring / month',  seeker: '2',           hustler: '12',          closer: 'Unlimited',    icon: <Brain size={15}/> },
  { label: 'Resume Version History',seeker: false,         hustler: '5 versions',  closer: 'Unlimited',    icon: <GitBranch size={15}/> },
  { label: 'Referral Bonus',        seeker: '+2 Bundle',   hustler: '+2 Bundle',   closer: '+2 Bundle',    icon: <Share2 size={15}/> },
]

const PLANS = [
  {
    key: 'seeker',
    name: 'Seeker',
    description: 'Just starting your job hunt? Build and polish a resume in one focused session.',
    price: 'Free',
    priceSub: 'forever',
    badge: null,
    cta: 'Get started free',
    ctaVariant: 'outline',
    color: '#94a3b8',
  },
  {
    key: 'hustler',
    name: 'Hustler',
    description: 'Actively applying? This is your plan. Enough power to run one tailored application every 2-3 days.',
    price: '₹79',
    priceSub: '/ month',
    badge: '🔥 Most Popular',
    cta: 'Upgrade to Hustler',
    ctaVariant: 'primary',
    color: '#6366f1',
  },
  {
    key: 'closer',
    name: 'Closer',
    description: 'Full placement season mode. Unlimited everything. Zero friction. Just land the offer.',
    price: '₹179',
    priceSub: '/ month',
    badge: '⚡ All In',
    cta: 'Upgrade to Closer',
    ctaVariant: 'warm',
    color: '#f59e0b',
  },
]

function renderValue(val: boolean | string) {
  if (val === true) return <span className={styles.checkYes}><Check size={16} /></span>
  if (val === false) return <span className={styles.checkNo}><XIcon size={14} /></span>
  return <span className={styles.valueText}>{val}</span>
}

declare global { interface Window { Razorpay: any } }

export default function PricingPage() {
  const { isAuthenticated } = useAuthStore()
  const [loading, setLoading] = useState<UpgradePlan | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpgrade = async (plan: UpgradePlan) => {
    if (!isAuthenticated) { window.location.href = '/register'; return }
    setLoading(plan)
    setError(null)
    try {
      const res = await apiClient.post('/payment/subscribe', { plan })
      const { subscriptionId, keyId, name, email } = res.data.data

      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script')
          s.src = 'https://checkout.razorpay.com/v1/checkout.js'
          s.onload = () => resolve()
          s.onerror = () => reject()
          document.head.appendChild(s)
        })
      }

      const rzp = new window.Razorpay({
        key: keyId,
        subscription_id: subscriptionId,
        name: 'CareerForge',
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
        prefill: { name, email },
        theme: { color: plan === 'hustler' ? '#6366f1' : '#f59e0b' },
        handler: async (response: any) => {
          try {
            // Verify payment aggressively since webhooks won't work easily on localhost
            await apiClient.post('/payment/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
            })
            // Force refresh user profile to show updated plan globally
            await useAuthStore.getState().fetchUser()
            window.location.href = '/dashboard'
          } catch (err: any) {
            setError('Payment verification failed. Please check your dashboard.')
            setLoading(null)
          }
        },
        modal: { ondismiss: () => setLoading(null) },
      })
      rzp.open()
    } catch (err: any) {
      setError(err?.response?.data?.error?.message ?? 'Something went wrong. Try again.')
      setLoading(null)
    }
  }

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.badge}><Shield size={13} /> Simple pricing</div>
        <h1 className={styles.title}>
          Pick your <span className={styles.accent}>hustle level</span>
        </h1>
        <p className={styles.sub}>
          Every plan includes unlimited resumes, all templates, and real-time ATS scoring.
          Upgrade when you're ready to go all in.
        </p>
      </div>

      {/* ── Plan Cards ── */}
      <div className={styles.planGrid}>
        {PLANS.map((plan) => (
          <div
            key={plan.key}
            className={`${styles.planCard} ${plan.key === 'hustler' ? styles.planCardFeatured : ''}`}
            style={{ '--plan-color': plan.color } as React.CSSProperties}
          >
            {plan.badge && (
              <div className={styles.planBadge} style={{ color: plan.color, borderColor: plan.color + '40', background: plan.color + '15' }}>
                {plan.badge}
              </div>
            )}
            <div className={styles.planName} style={{ color: plan.color }}>{plan.name}</div>
            <p className={styles.planDesc}>{plan.description}</p>
            <div className={styles.planPrice}>
              <span className={styles.planAmount}>{plan.price}</span>
              {plan.priceSub && <span className={styles.planSub}>{plan.priceSub}</span>}
            </div>

            {plan.key === 'seeker' ? (
              <Link to={isAuthenticated ? '/dashboard' : '/register'} className={styles.ctaOutline}>
                {plan.cta} <ArrowRight size={14} />
              </Link>
            ) : (
              <button
                className={`${styles.ctaBtn} ${plan.key === 'closer' ? styles.ctaWarm : ''}`}
                style={{ '--btn-color': plan.color } as React.CSSProperties}
                onClick={() => handleUpgrade(plan.key as UpgradePlan)}
                disabled={loading !== null}
              >
                {loading === plan.key
                  ? <Loader2 size={16} className={styles.spin} />
                  : <>{plan.cta} <ArrowRight size={14} /></>
                }
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ── Error ── */}
      {error && <div className={styles.error}>{error}</div>}

      {/* ── Comparison Table ── */}
      <div className={styles.tableWrap}>
        <h2 className={styles.tableTitle}>Full feature comparison</h2>
        <div className={styles.table}>
          {/* Thead */}
          <div className={styles.tableHead}>
            <div className={styles.thFeature}>Feature</div>
            <div className={styles.th}>Seeker</div>
            <div className={`${styles.th} ${styles.thHighlight}`}>Hustler</div>
            <div className={styles.th}>Closer</div>
          </div>
          {/* Rows */}
          {FEATURES.map((row, i) => (
            <div key={i} className={`${styles.tableRow} ${i % 2 === 0 ? styles.tableRowAlt : ''}`}>
              <div className={styles.tdFeature}>
                <span className={styles.featureIcon}>{row.icon}</span>
                {row.label}
              </div>
              <div className={styles.td}>{renderValue(row.seeker)}</div>
              <div className={`${styles.td} ${styles.tdHighlight}`}>{renderValue(row.hustler)}</div>
              <div className={styles.td}>{renderValue(row.closer)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Referral Callout ── */}
      <div className={styles.referralBox}>
        <div className={styles.referralIcon}><Share2 size={22} /></div>
        <div>
          <h3 className={styles.referralTitle}>Give 2, Get 2 — Referral Bonus</h3>
          <p className={styles.referralDesc}>
            Invite your friends to CareerForge! When they create their first resume, both you and your friend get 
            <strong> +2 JD Tailorings</strong> and <strong>+2 PDF Downloads</strong> instantly. 
            Earn bonuses for up to 10 successful referrals.
          </p>
        </div>
      </div>

      {/* ── FAQ strip ── */}
      <div className={styles.faqStrip}>
        <div className={styles.faqItem}>
          <span className={styles.faqQ}>When does my quota reset?</span>
          <span className={styles.faqA}>On the 1st of every month. Unused credits don't roll over.</span>
        </div>
        <div className={styles.faqItem}>
          <span className={styles.faqQ}>Can I cancel anytime?</span>
          <span className={styles.faqA}>Yes. You keep access until the end of your billing period.</span>
        </div>
        <div className={styles.faqItem}>
          <span className={styles.faqQ}>Is my payment secure?</span>
          <span className={styles.faqA}>Payments are handled by Razorpay — PCI-DSS compliant.</span>
        </div>
      </div>
    </div>
  )
}
