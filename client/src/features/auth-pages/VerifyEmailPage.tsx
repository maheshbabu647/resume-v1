import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Mail, Sparkles } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { CfpLogo } from '@/shared/components/CfpLogo/CfpLogo'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { apiClient } from '@/shared/lib/apiClient'
import { AuthBrandPanel } from './AuthBrandPanel'
import { AuthHeading } from './AuthFormKit'
import styles from './auth-pages.module.css'
import kit from './AuthFormKit.module.css'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const { setTokens, setUser } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!email) navigate('/register')
  }, [email, navigate])

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const setDigit = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return
    const next = [...digits]
    next[i] = v
    setDigits(next)
    if (v && i < 5) refs.current[i + 1]?.focus()
  }

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus()
  }

  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    const t = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!t) return
    const next = ['', '', '', '', '', '']
    t.split('').forEach((c, i) => { next[i] = c })
    setDigits(next)
    refs.current[Math.min(t.length, 5)]?.focus()
  }

  const otp = digits.join('')
  const filled = digits.filter(Boolean).length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) return setError('OTP must be 6 digits.')
    setError('')
    setLoading(true)
    try {
      const { data } = await apiClient.post('/auth/verify-email', { email, otp })

      setTokens(data.data.accessToken)
      setUser(data.data.user)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Invalid or expired verification code.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    setError('')
    try {
      await apiClient.post('/auth/resend-otp', { email })
      setResendCooldown(60)
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to resend code.')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.formColumn}>
        <div className={styles.logo}>
          <CfpLogo />
        </div>

        <div className={styles.formCenter}>
          <Link to="/register" className={kit.backLink}>
            <ArrowLeft size={14} /> Back
          </Link>

          <div className={`${kit.iconBox} ${kit.iconBoxBrand}`}>
            <Mail size={24} />
          </div>

          <AuthHeading
            title="Check your email"
            sub={<>We sent a 6-digit code to <strong style={{ color: 'var(--dark)' }}>{email}</strong>. Enter it below to verify your account.</>}
          />

          {error && <div className={styles.errorBanner}>{error}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={kit.otpRow} onPaste={onPaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { refs.current[i] = el }}
                  value={d}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => onKeyDown(i, e)}
                  inputMode="numeric"
                  maxLength={1}
                  autoFocus={i === 0}
                  className={`${kit.otpInput} ${d ? kit.otpFilled : ''}`}
                />
              ))}
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} disabled={filled < 6} className={kit.primaryBtn}>
              Verify and continue <ArrowRight size={14} />
            </Button>
          </form>

          <div className={kit.resendRow}>
            Didn't get a code?{' '}
            {resendCooldown > 0 ? (
              <span>Resend in {resendCooldown}s</span>
            ) : (
              <button type="button" className={kit.resendLink} onClick={handleResend}>Resend code</button>
            )}
          </div>

          <div className={kit.tipBox}>
            <Sparkles size={14} style={{ color: 'var(--brand)', flexShrink: 0, marginTop: 2 }} />
            <span>
              Wrong email?{' '}
              <Link to="/register" className={kit.fieldHint}>Edit email address</Link>
            </span>
          </div>
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

      <AuthBrandPanel view="verify" />
    </div>
  )
}
