import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { Input } from '@/shared/components/Input/Input'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { apiClient } from '@/shared/lib/apiClient'
import { trackLogin, trackLoginFailed, setUserProperties } from '@/shared/lib/analytics'
import styles from './auth-pages.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
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

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <div className={styles.leftContent}>
          <Link to="/" className={styles.brand}>
            <div className={styles.brandLogo}>CF</div>
            <span className={styles.brandName}>CareerForge</span>
          </Link>
          <h2 className={styles.leftTitle}>Land the role you've been working toward.</h2>
          <ul className={styles.leftPoints}>
            {['AI-tailored resume for every job', 'Real-time ATS scoring', 'One-click PDF export', '12,000+ candidates placed'].map((p) => (
              <li key={p} className={styles.leftPoint}>
                <CheckCircle2 size={16} color="var(--secondary-container)" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.leftDecor} />
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formCard}>
          <h1 className={styles.formTitle}>Welcome back</h1>
          <p className={styles.formSub}>Log in to your CareerForge account</p>

          {(() => {
            const guestId = localStorage.getItem('guest_id')
            return (
              <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:4000/v1'}/auth/google${guestId ? `?guestId=${guestId}` : ''}`} className={styles.googleBtn}>
                <div className={styles.googleIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                Continue with Google
              </a>
            )
          })()}

          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>OR</span>
            <div className={styles.dividerLine} />
          </div>

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
            <div className={styles.passWrapper}>
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className={styles.passToggle} onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <div className={styles.formFooterRow}>
              <label className={styles.checkLabel}>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className={styles.forgotLink}>Forgot password?</a>
            </div>
            <Button type="submit" loading={loading} style={{ width: '100%' }}>Log in</Button>
          </form>

          <p className={styles.switchPrompt}>
            Don't have an account? <Link to="/register" className={styles.switchLink}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
