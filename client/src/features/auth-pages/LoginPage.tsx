import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { Input } from '@/shared/components/Input/Input'
import { CfpLogo } from '@/shared/components/CfpLogo/CfpLogo'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { apiClient } from '@/shared/lib/apiClient'
import { trackLogin, trackLoginFailed, setUserProperties } from '@/shared/lib/analytics'
import { ForgotPasswordDialog } from './ForgotPasswordDialog'
import { AuthBrandPanel } from './AuthBrandPanel'
import { AuthHeading, AuthDivider, OAuthRow } from './AuthFormKit'
import styles from './auth-pages.module.css'
import kit from './AuthFormKit.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [forgotOpen, setForgotOpen] = useState(false)
  const { setTokens, setUser } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await apiClient.post('/auth/login', { email, password })
      setTokens(data.data.accessToken)
      setUser(data.data.user)
      localStorage.removeItem('guest_id') // Guest was merged server-side; discard stale ID
      trackLogin('email')
      setUserProperties(data.data.user._id, data.data.user.plan)
      navigate('/dashboard')
    } catch (err: any) {
      const code = err.response?.data?.error?.code
      if (code === 'AUTH_UNVERIFIED') {
        navigate(`/verify-email?email=${encodeURIComponent(email)}`)
      } else {
        trackLoginFailed('email')
        setError(err.response?.data?.error?.message || 'Invalid email or password.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleClick = () => {
    const guestId = localStorage.getItem('guest_id')
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/v1'}/auth/google${guestId ? `?guestId=${guestId}` : ''}`
  }

  return (
    <div className={styles.page}>
      <div className={styles.formColumn}>
        <div className={styles.logo}>
          <CfpLogo />
        </div>

        <div className={styles.formCenter}>
          <AuthHeading title="Welcome back" sub="Pick up where you left off — your resumes are ready." />
          <OAuthRow onGoogleClick={handleGoogleClick} />
          <AuthDivider label="or log in with email" />

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
            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={16} />}
              rightElement={
                <button type="button" className={kit.iconToggle} onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              hintAction={
                <button type="button" className={kit.fieldHint} onClick={() => setForgotOpen(true)}>
                  Forgot?
                </button>
              }
              required
            />

            <label className={kit.checkLabelInline}>
              <input type="checkbox" /> Keep me logged in for 30 days
            </label>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} className={kit.primaryBtn}>
              Log in <ArrowRight size={14} />
            </Button>
          </form>

          <p className={kit.switchPrompt}>
            New to CareerForge? <Link to="/register" className={kit.switchLink}>Create an account</Link>
          </p>
        </div>

        <div className={styles.footerRow}>
          <span>© 2026 CareerForge</span>
          <div className={styles.footerLinks}>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/contact">Help</Link>
          </div>
        </div>
      </div>

      <AuthBrandPanel view="login" />

      <ForgotPasswordDialog isOpen={forgotOpen} onClose={() => setForgotOpen(false)} />
    </div>
  )
}
