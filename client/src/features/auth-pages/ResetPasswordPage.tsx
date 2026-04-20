import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { Input } from '@/shared/components/Input/Input'
import { apiClient } from '@/shared/lib/apiClient'
import styles from './auth-pages.module.css'
import fpStyles from './ForgotPasswordPage.module.css'

type Step = 'reset' | 'done'

function getStrength(password: string): { score: 0 | 1 | 2 | 3 | 4; label: string; cls: string } {
  let score = 0
  if (password.length >= 8)  score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  const map: Record<number, { label: string; cls: string }> = {
    0: { label: '', cls: '' },
    1: { label: 'Weak', cls: 'weak' },
    2: { label: 'Fair', cls: 'fair' },
    3: { label: 'Good', cls: 'good' },
    4: { label: 'Strong', cls: 'strong' },
  }
  return { score: score as 0 | 1 | 2 | 3 | 4, ...map[score] }
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('reset')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if no token
  useEffect(() => {
    if (!token) navigate('/forgot-password')
  }, [token, navigate])

  const strength = getStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await apiClient.post('/auth/reset-password', { token, password })
      setStep('done')
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Reset failed. The link may have expired.')
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
          <h2 className={styles.leftTitle}>Set a strong password, protect your career.</h2>
          <ul className={styles.leftPoints}>
            {[
              'At least 8 characters long',
              'Mix of upper and lowercase',
              'Include a number or symbol',
              'Never reuse old passwords',
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
          {step === 'reset' && (
            <>
              <div className={fpStyles.iconWrap}>
                <ShieldCheck size={24} strokeWidth={1.8} />
              </div>
              <h1 className={styles.formTitle}>Choose a new password</h1>
              <p className={styles.formSub}>
                Make it something memorable — and different from your old one.
              </p>

              {error && <div className={styles.errorBanner}>{error}</div>}

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.passWrapper}>
                  <Input
                    label="New password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passToggle}
                    onClick={() => setShowPass(!showPass)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Strength indicator */}
                {password.length > 0 && (
                  <div>
                    <div className={fpStyles.strengthBar}>
                      {[1, 2, 3, 4].map((s) => (
                        <div
                          key={s}
                          className={[
                            fpStyles.strengthSegment,
                            s <= strength.score ? fpStyles[strength.cls] : '',
                          ].join(' ')}
                        />
                      ))}
                    </div>
                    {strength.label && (
                      <p className={`${fpStyles.strengthLabel} ${fpStyles[strength.cls]}`}>
                        {strength.label} password
                      </p>
                    )}
                  </div>
                )}

                <Button type="submit" loading={loading} style={{ width: '100%' }}>
                  Reset Password
                </Button>
              </form>

              <p className={styles.switchPrompt}>
                <Link to="/login" className={fpStyles.backLink}>
                  <ArrowLeft size={14} /> Back to login
                </Link>
              </p>
            </>
          )}

          {step === 'done' && (
            <div className={fpStyles.successCard}>
              <div className={fpStyles.sentIcon}>
                <CheckCircle2 size={36} strokeWidth={1.6} />
              </div>
              <h1 className={styles.formTitle}>Password updated!</h1>
              <p className={styles.formSub}>
                Your password has been reset successfully. You can now log in with your new password.
              </p>
              <Button
                style={{ width: '100%' }}
                onClick={() => navigate('/login')}
              >
                Go to login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
