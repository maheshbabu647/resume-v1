import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Mail, Check } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { Input } from '@/shared/components/Input/Input'
import { CfpLogo } from '@/shared/components/CfpLogo/CfpLogo'
import { apiClient } from '@/shared/lib/apiClient'
import { AuthBrandPanel } from './AuthBrandPanel'
import { AuthHeading } from './AuthFormKit'
import styles from './auth-pages.module.css'
import kit from './AuthFormKit.module.css'

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
      <div className={styles.formColumn}>
        <div className={styles.logo}>
          <CfpLogo />
        </div>

        <div className={styles.formCenter}>
          {step === 'email' && (
            <>
              <Link to="/login" className={kit.backLink}>
                <ArrowLeft size={14} /> Back to log in
              </Link>

              <AuthHeading
                title="Forgot password?"
                sub="No worries. Enter the email tied to your account and we'll send you a reset link."
              />

              {error && <div className={styles.errorBanner}>{error}</div>}

              <form className={styles.form} onSubmit={handleSubmit}>
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail size={16} />}
                  autoFocus
                  required
                />

                <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} className={kit.primaryBtn}>
                  Send reset link <ArrowRight size={14} />
                </Button>
              </form>

              <p className={kit.switchPrompt}>
                Remembered it? <Link to="/login" className={kit.switchLink}>Log in</Link>
              </p>
            </>
          )}

          {step === 'sent' && (
            <>
              <div className={`${kit.iconBox} ${kit.iconBoxGreen}`}>
                <Check size={24} strokeWidth={2.5} />
              </div>

              <AuthHeading
                title="Check your inbox"
                sub={<>We sent a password reset link to <strong style={{ color: 'var(--dark)' }}>{email}</strong>. The link expires in 30 minutes.</>}
              />

              {error && <div className={styles.errorBanner}>{error}</div>}

              <div className={kit.noteBox}>
                <div className={kit.noteBoxTitle}>Didn't receive it?</div>
                <ul className={kit.noteBoxList}>
                  <li>Check your spam or promotions folder</li>
                  <li>Make sure you typed the right email</li>
                  <li>Wait 60 seconds — sometimes mail is delayed</li>
                </ul>
              </div>

              <Button
                variant="ghost"
                size="lg"
                fullWidth
                loading={loading}
                disabled={resendCooldown > 0}
                onClick={handleResend}
                className={kit.primaryBtn}
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend reset link'}
              </Button>

              <p className={kit.switchPrompt}>
                <Link to="/login" className={kit.switchLink}>← Back to log in</Link>
              </p>
            </>
          )}
        </div>

        <div className={styles.footerRow}>
          <span>© 2026 CareerForgePro</span>
          <div className={styles.footerLinks}>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/contact">Help</Link>
          </div>
        </div>
      </div>

      <AuthBrandPanel view="forgot" />
    </div>
  )
}
