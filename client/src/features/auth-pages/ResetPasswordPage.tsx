import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Check, ArrowRight } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { Input } from '@/shared/components/Input/Input'
import { CfpLogo } from '@/shared/components/CfpLogo/CfpLogo'
import { apiClient } from '@/shared/lib/apiClient'
import { AuthBrandPanel } from './AuthBrandPanel'
import { AuthHeading, PasswordStrengthMeter } from './AuthFormKit'
import styles from './auth-pages.module.css'
import kit from './AuthFormKit.module.css'

type Step = 'reset' | 'done'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('reset')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) navigate('/forgot-password')
  }, [token, navigate])

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
      <div className={styles.formColumn}>
        <div className={styles.logo}>
          <CfpLogo />
        </div>

        <div className={styles.formCenter}>
          {step === 'reset' && (
            <>
              <AuthHeading
                title="Choose a new password"
                sub="Make it something memorable — and different from your old one."
              />

              {error && <div className={styles.errorBanner}>{error}</div>}

              <form className={styles.form} onSubmit={handleSubmit}>
                <div>
                  <Input
                    label="New password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    rightElement={
                      <button type="button" className={kit.iconToggle} onClick={() => setShowPass(!showPass)}>
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                    autoFocus
                    required
                  />
                  <PasswordStrengthMeter password={password} />
                </div>

                <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} className={kit.primaryBtn}>
                  Reset password <ArrowRight size={14} />
                </Button>
              </form>

              <p className={kit.switchPrompt}>
                <Link to="/login" className={kit.switchLink}>← Back to log in</Link>
              </p>
            </>
          )}

          {step === 'done' && (
            <>
              <div className={`${kit.iconBox} ${kit.iconBoxGreen}`}>
                <Check size={24} strokeWidth={2.5} />
              </div>

              <AuthHeading
                title="Password updated!"
                sub="Your password has been reset successfully. You can now log in with your new password."
              />

              <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/login')} className={kit.primaryBtn}>
                Go to login <ArrowRight size={14} />
              </Button>
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

      <AuthBrandPanel view="reset" />
    </div>
  )
}
