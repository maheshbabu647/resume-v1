import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { Input } from '@/shared/components/Input/Input'
import { CfpLogo } from '@/shared/components/CfpLogo/CfpLogo'
import { apiClient } from '@/shared/lib/apiClient'
import { trackSignUp } from '@/shared/lib/analytics'
import { AuthBrandPanel } from './AuthBrandPanel'
import { AuthHeading, AuthDivider, OAuthRow, PasswordStrengthMeter } from './AuthFormKit'
import styles from './auth-pages.module.css'
import kit from './AuthFormKit.module.css'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [searchParams] = useSearchParams()
  const referralCode = searchParams.get('ref') || ''
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload: any = { name, email, password }
      if (referralCode) payload.referralCode = referralCode

      await apiClient.post('/auth/register', payload)
      localStorage.removeItem('guest_id') // Guest was merged server-side; discard stale ID
      trackSignUp('email')
      // Redirect to verification without setting tokens yet
      navigate(`/verify-email?email=${encodeURIComponent(email)}`)
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleClick = () => {
    const guestId = localStorage.getItem('guest_id')
    const queryParams = new URLSearchParams()
    if (referralCode) queryParams.append('ref', referralCode)
    if (guestId) queryParams.append('guestId', guestId)
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/v1'}/auth/google${queryString}`
  }

  return (
    <div className={styles.page}>
      <div className={styles.formColumn}>
        <div className={styles.logo}>
          <CfpLogo />
        </div>

        <div className={styles.formCenter}>
          <AuthHeading
            title="Create your account"
            sub="Free forever — no credit card. Your first ATS-ready resume in 3 minutes."
          />
          <OAuthRow onGoogleClick={handleGoogleClick} />
          <AuthDivider label="or sign up with email" />

          {error && <div className={styles.errorBanner}>{error}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              label="Full name"
              placeholder="Arjun Kapoor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={16} />}
              required
            />
            <div>
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                rightElement={
                  <button type="button" className={kit.iconToggle} onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                required
              />
              <PasswordStrengthMeter password={password} />
            </div>

            <label className={kit.checkLabel}>
              <input type="checkbox" defaultChecked required />
              <span>
                I agree to the <Link to="/terms" className={kit.inlineLink}>Terms</Link> and{' '}
                <Link to="/privacy" className={kit.inlineLink}>Privacy Policy</Link>.
              </span>
            </label>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} className={kit.primaryBtn}>
              Create account <ArrowRight size={14} />
            </Button>
          </form>

          <p className={kit.switchPrompt}>
            Already have an account? <Link to="/login" className={kit.switchLink}>Log in</Link>
          </p>
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

      <AuthBrandPanel view="signup" />
    </div>
  )
}
