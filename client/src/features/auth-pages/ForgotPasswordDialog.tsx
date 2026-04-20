import { useState, useEffect } from 'react'
import { X, CheckCircle2, ArrowRight, KeyRound } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { Input } from '@/shared/components/Input/Input'
import { apiClient } from '@/shared/lib/apiClient'
import styles from './ForgotPasswordDialog.module.css'

interface ForgotPasswordDialogProps {
  isOpen: boolean
  onClose: () => void
}

type Step = 'email' | 'sent'

export function ForgotPasswordDialog({ isOpen, onClose }: ForgotPasswordDialogProps) {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setStep('email')
      setEmail('')
      setError('')
      setLoading(false)
      setResendCooldown(0)
    }
  }, [isOpen])

  // Countdown for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [resendCooldown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
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

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="fpd-title">
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        {step === 'email' && (
          <>
            <div className={styles.iconWrap}>
              <KeyRound size={24} strokeWidth={1.8} />
            </div>
            <h2 id="fpd-title" className={styles.title}>Forgot your password?</h2>
            <p className={styles.sub}>
              Enter the email address associated with your account and we'll send you a reset link.
            </p>

            {error && <div className={styles.errorBanner}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
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

            <button className={styles.backLink} onClick={onClose}>
              Back to login
            </button>
          </>
        )}

        {step === 'sent' && (
          <div className={styles.sentWrap}>
            <div className={styles.sentIcon}>
              <CheckCircle2 size={32} strokeWidth={1.8} />
            </div>
            <h2 className={styles.title}>Check your inbox</h2>
            <p className={styles.sub}>
              We've sent a password reset link to <strong>{email}</strong>. It expires in 1 hour.
            </p>
            <p className={styles.note}>
              Didn't see it? Check your spam folder, or
            </p>

            {error && <div className={styles.errorBanner}>{error}</div>}

            <button
              className={styles.resendBtn}
              onClick={handleResend}
              disabled={resendCooldown > 0 || loading}
            >
              {loading
                ? 'Sending…'
                : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend email'
              }
            </button>

            <button className={styles.backLink} onClick={onClose}>
              Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
