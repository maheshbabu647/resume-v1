import { useState, useEffect } from 'react'
import { X, Zap, ArrowRight, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { apiClient } from '@/shared/lib/apiClient'
import {
  trackFeatureLocked, trackUpgradeClicked,
  trackPaymentInitiated, trackPaymentCompleted, trackPaymentFailed,
} from '@/shared/lib/analytics'
import styles from './UpgradeModal.module.css'

type UpgradePlan = 'hustler' | 'closer'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  /** The feature that triggered the modal, for contextual copy */
  trigger?: 'jdTailoring' | 'pdfDownloads' | 'jdScore' | 'aiBullets' | 'versionHistory' | 'general'
  /** Currently active plan */
  currentPlan?: string
}

const TRIGGER_COPY: Record<string, { headline: string; sub: string }> = {
  jdTailoring: {
    headline: "You've used all your JD tailorings this month.",
    sub: 'Hustler gives you 12 tailorings/month for ₹79 — less than a Swiggy order.',
  },
  pdfDownloads: {
    headline: "You've hit your PDF download limit.",
    sub: 'Hustler gives you 10 downloads/month. Closer gives unlimited.',
  },
  jdScore: {
    headline: "You've used all your JD Score checks.",
    sub: 'Hustler gives you 20 JD scores/month to keep every application sharp.',
  },
  aiBullets: {
    headline: "You've run out of AI bullet suggestions.",
    sub: 'Hustler gives you 25 suggestions/month. Never stare at a blank bullet again.',
  },
  versionHistory: {
    headline: 'Resume version history is a paid feature.',
    sub: "Students constantly overwrite good resumes. Hustler saves 5 versions — never lose your best draft.",
  },
  general: {
    headline: 'Level up your job hunt.',
    sub: 'Unlock more downloads, AI power, and version history with a plan that matches your hustle.',
  },
}

const PLANS = [
  {
    key: 'hustler' as UpgradePlan,
    name: 'Hustler',
    price: '₹79',
    period: '/month',
    badge: '🔥 Most Popular',
    color: '#6366f1',
    features: ['10 PDF downloads', '20 JD scores', '25 AI bullet suggestions', '12 JD tailorings', '5 resume versions', '+2 tailorings per referral'],
  },
  {
    key: 'closer' as UpgradePlan,
    name: 'Closer',
    price: '₹179',
    period: '/month',
    badge: '⚡ All In',
    color: '#f59e0b',
    features: ['Unlimited downloads', 'Unlimited JD scores', 'Unlimited AI suggestions', 'Unlimited tailorings', 'Unlimited versions', '+3 tailorings per referral'],
  },
]

declare global {
  interface Window {
    Razorpay: any
  }
}

export function UpgradeModal({ isOpen, onClose, trigger = 'general' }: Omit<UpgradeModalProps, 'currentPlan'> & { currentPlan?: string }) {
  const [loading, setLoading] = useState<UpgradePlan | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fire feature_locked_seen every time the modal opens
  useEffect(() => {
    if (isOpen) {
      trackFeatureLocked(trigger)
    }
  }, [isOpen, trigger])

  if (!isOpen) return null

  const copy = TRIGGER_COPY[trigger] ?? TRIGGER_COPY.general

  const PLAN_AMOUNTS: Record<UpgradePlan, number> = { hustler: 79, closer: 179 }

  const handleUpgrade = async (plan: UpgradePlan) => {
    setLoading(plan)
    setError(null)
    trackUpgradeClicked(plan, 'feature_gate_modal')
    try {
      const res = await apiClient.post('/payment/subscribe', { plan })
      const { subscriptionId, keyId, name, email } = res.data.data

      // Load Razorpay checkout script if not already loaded
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script')
          s.src = 'https://checkout.razorpay.com/v1/checkout.js'
          s.onload = () => resolve()
          s.onerror = () => reject(new Error('Failed to load Razorpay'))
          document.head.appendChild(s)
        })
      }

      const amount = PLAN_AMOUNTS[plan]
      trackPaymentInitiated(plan, amount)

      const rzp = new window.Razorpay({
        key: keyId,
        subscription_id: subscriptionId,
        name: 'CareerForge',
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
        image: '', // optional logo URL
        prefill: { name, email },
        theme: { color: plan === 'hustler' ? '#6366f1' : '#f59e0b' },
        handler: async (response: any) => {
          try {
            trackPaymentCompleted(plan, amount, response.razorpay_order_id ?? response.razorpay_subscription_id)
            await apiClient.post('/payment/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
            })
            await useAuthStore.getState().fetchUser()
            onClose()
          } catch (err: any) {
            setError('Payment verification failed. Check your dashboard.')
            setLoading(null)
          }
        },
        modal: {
          ondismiss: () => {
            trackPaymentFailed(plan, 'user_dismissed')
            setLoading(null)
          },
        },
      })
      rzp.open()
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message ?? 'Something went wrong. Please try again.'
      setError(msg)
      setLoading(null)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <Zap size={20} fill="currentColor" />
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        {/* Copy */}
        <div className={styles.copy}>
          <h2 className={styles.headline}>{copy.headline}</h2>
          <p className={styles.sub}>{copy.sub}</p>
        </div>

        {/* Error */}
        {error && <div className={styles.errorBanner}>{error}</div>}

        {/* Plan cards */}
        <div className={styles.plans}>
          {PLANS.map((plan) => (
            <div key={plan.key} className={`${styles.planCard} ${plan.key === 'hustler' ? styles.planCardHighlight : ''}`}>
              <div className={styles.planBadge} style={{ background: plan.color + '22', color: plan.color }}>
                {plan.badge}
              </div>
              <div className={styles.planName}>{plan.name}</div>
              <div className={styles.planPrice}>
                <span className={styles.planAmount}>{plan.price}</span>
                <span className={styles.planPeriod}>{plan.period}</span>
              </div>
              <ul className={styles.planFeatures}>
                {plan.features.map((f) => (
                  <li key={f} className={styles.planFeature}>
                    <span className={styles.featureDot} style={{ background: plan.color }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={styles.upgradeBtn}
                style={{ background: '#ccc', cursor: 'not-allowed' }}
                onClick={() => handleUpgrade(plan.key)}
                disabled={true}
              >
                Coming Soon
              </button>
            </div>
          ))}
        </div>

        <p className={styles.footer}>
          Billed monthly · Cancel anytime · Powered by Razorpay
        </p>
      </div>
    </div>
  )
}
