import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, KeyRound, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { Input } from '@/shared/components/Input/Input'
import { apiClient } from '@/shared/lib/apiClient'
import styles from './auth-pages.module.css'
import fpStyles from './ForgotPasswordPage.module.css'

type Step = 'email' | 'sent'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [resendCooldown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await apiClient.post('/auth/forgot-password', { email })
      setStep('sent')
      setResendCooldown(60)
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    setError('')
    setLoading(true)
    try {
      await apiClient.post('/auth/forgot-password', { email })
      setResendCooldown(60)
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to resend. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* ── Left branding panel ── */}
      <div className={styles.leftPanel}>
        <div className={styles.leftContent}>
          <Link to="/" className={styles.brand}>
            <div className={styles.brandLogo}>CF</div>
            <span className={styles.brandName}>CareerForge</span>
          </Link>
          <h2 className={styles.leftTitle}>Back in control in under a minute.</h2>
          <ul className={styles.leftPoints}>
            {[
              'Link sent instantly to your inbox',
              'Secure, one-time reset token',
              'Expires after 1 hour',
              'Your data stays safe and private',
            ].map((p) => (
              <li key={p} className={styles.leftPoint}>
                <CheckCircle2 size={16} color="var(--secondary-container)" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.leftDecor} />
      </div>

      {/* ── Right form panel ── */}
      <div className={styles.rightPanel}>
        <div className={styles.formCard}>
          {step === 'email' && (
            <>
              <div className={fpStyles.iconWrap}>
                <KeyRound size={24} strokeWidth={1.8} />
              </div>
              <h1 className={styles.formTitle}>Forgot password?</h1>
              <p className={styles.formSub}>
                Enter your account email and we'll send you a reset link.
              </p>

              {error && <div className={styles.errorBanner}>{error}</div>}

              <form className={styles.form} onSubmit={handleSubmit}>
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" loading={loading} style={{ width: '100%' }}>
                  Send Reset Link <ArrowRight size={16} />
                </Button>
              </form>

              <p className={styles.switchPrompt}>
                <Link to="/login" className={fpStyles.backLink}>
                  <ArrowLeft size={14} /> Back to login
                </Link>
              </p>
            </>
          )}

          {step === 'sent' && (
            <div className={fpStyles.sentWrap}>
              <div className={fpStyles.sentIcon}>
                <CheckCircle2 size={36} strokeWidth={1.6} />
              </div>
              <h1 className={styles.formTitle}>Check your inbox</h1>
              <p className={styles.formSub}>
                We've sent a reset link to <strong>{email}</strong>. It expires in 1 hour.
              </p>

              {error && <div className={styles.errorBanner}>{error}</div>}

              <div className={fpStyles.resendRow}>
                <span className={fpStyles.resendNote}>Didn't receive it?</span>
                <button
                  className={fpStyles.resendBtn}
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || loading}
                >
                  {loading
                    ? 'Sending…'
                    : resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : 'Resend email'}
                </button>
              </div>

              <p className={styles.switchPrompt}>
                <Link to="/login" className={fpStyles.backLink}>
                  <ArrowLeft size={14} /> Back to login
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
