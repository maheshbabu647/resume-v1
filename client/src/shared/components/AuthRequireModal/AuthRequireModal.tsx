import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Modal } from '@/shared/components/Modal/Modal'
import { Button } from '@/shared/components/Button/Button'
import { Input } from '@/shared/components/Input/Input'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { apiClient } from '@/shared/lib/apiClient'
import { trackLogin, trackSignUp, setUserProperties } from '@/shared/lib/analytics'
import { useResumeStore } from '@/features/resume-builder/store/useResumeStore'
import styles from './AuthRequireModal.module.css'

interface AuthRequireModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  title: string
  subtitle?: string
}

type Mode = 'login' | 'register' | 'verify'

export const AuthRequireModal = ({ isOpen, onClose, onSuccess, title, subtitle }: AuthRequireModalProps) => {
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  
  const { setTokens, setUser } = useAuthStore()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  // Clear errors when mode changes
  const switchMode = (m: Mode) => {
    setMode(m)
    setError('')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const guestId = localStorage.getItem('guest_id')
      const { data } = await apiClient.post('/auth/login', { email, password }, {
        headers: guestId ? { 'X-Guest-Id': guestId } : {},
      })
      setTokens(data.data.accessToken)
      setUser(data.data.user)
      localStorage.removeItem('guest_id') // Guest was merged server-side; discard stale ID
      trackLogin('email')
      setUserProperties(data.data.user._id, data.data.user.plan)
      await queryClient.refetchQueries({ queryKey: ['usage'] })
      onSuccess()
    } catch (err: any) {
      const code = err.response?.data?.error?.code
      if (code === 'AUTH_UNVERIFIED') {
        switchMode('verify')
      } else {
        const msg = err.response?.data?.error?.message || 'Invalid email or password.'
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const guestId = localStorage.getItem('guest_id')
      await apiClient.post('/auth/register', { name, email, password }, {
        headers: guestId ? { 'X-Guest-Id': guestId } : {},
      })
      localStorage.removeItem('guest_id') // Guest was merged server-side; discard stale ID
      trackSignUp('email')
      switchMode('verify')
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) return setError('OTP must be 6 digits.')
    setError('')
    setLoading(true)
    try {
      const { data } = await apiClient.post('/auth/verify-email', { email, otp })
      setTokens(data.data.accessToken)
      setUser(data.data.user)
      localStorage.removeItem('guest_id') // Guest was merged server-side; discard stale ID
      await queryClient.refetchQueries({ queryKey: ['usage'] })
      onSuccess()
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

  const stashStateForOAuth = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    localStorage.setItem('returnTo', window.location.pathname + window.location.search)
    const state = useResumeStore.getState()
    localStorage.setItem('careerforge_unsaved_resume', JSON.stringify({
      title: state.title,
      data: state.data,
      customization: state.customization
    }))
    // Add guestId to the OAuth URL so mergeGuest runs
    const guestId = localStorage.getItem('guest_id')
    let url = e.currentTarget.href
    if (guestId && !url.includes('guestId')) {
      url += (url.includes('?') ? '&' : '?') + `guestId=${guestId}`
    }
    window.location.href = url
  }

  // Build Google OAuth URL with guestId
  const googleOAuthUrl = (() => {
    const base = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/v1'}/auth/google`
    const guestId = localStorage.getItem('guest_id')
    return guestId ? `${base}?guestId=${guestId}` : base
  })()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'verify' ? 'Check your email' : title}>
      <div className={styles.container}>
        {mode === 'verify' ? (
          <p className={styles.subtitle}>We've sent a 6-digit verification code to <strong>{email}</strong>.</p>
        ) : (
          subtitle && <p className={styles.subtitle}>{subtitle}</p>
        )}
        
        {error && <div className={styles.errorBanner}>{error}</div>}

        {mode === 'login' && (
          <>
            <a 
              href={googleOAuthUrl} 
              className={styles.googleBtn}
              onClick={stashStateForOAuth}
            >
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

            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <span className={styles.dividerText}>OR</span>
              <div className={styles.dividerLine} />
            </div>

            <form className={styles.form} onSubmit={handleLogin}>
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
              <Button type="submit" loading={loading} style={{ width: '100%', marginTop: '0.5rem' }}>Log in to continue</Button>
            </form>
            <p className={styles.footerNote}>
              Don't have an account?{' '}
              <button className={styles.switchLink} onClick={() => switchMode('register')}>Create one free</button>
            </p>
          </>
        )}

        {mode === 'register' && (
          <>
            <a 
              href={googleOAuthUrl} 
              className={styles.googleBtn}
              onClick={stashStateForOAuth}
            >
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

            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <span className={styles.dividerText}>OR</span>
              <div className={styles.dividerLine} />
            </div>

            <form className={styles.form} onSubmit={handleRegister}>
              <Input
                label="Full name"
                placeholder="Arjun Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
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
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className={styles.passToggle} onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <Button type="submit" loading={loading} style={{ width: '100%', marginTop: '0.5rem' }}>Create account</Button>
            </form>
            <p className={styles.footerNote}>
              Already have an account?{' '}
              <button className={styles.switchLink} onClick={() => switchMode('login')}>Log in</button>
            </p>
          </>
        )}

        {mode === 'verify' && (
          <form className={styles.form} onSubmit={handleVerify}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--on-surface)' }}>Verification Code</label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="123456"
                className={styles.otpInput}
                required
              />
            </div>
            
            <Button type="submit" loading={loading} style={{ width: '100%', marginTop: '1rem' }}>
              Verify & Continue <ArrowRight size={16} />
            </Button>

            <div className={styles.footerNote} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button 
                type="button" 
                className={styles.switchLink} 
                onClick={handleResend}
                disabled={resendCooldown > 0}
                style={{ opacity: resendCooldown > 0 ? 0.5 : 1, cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer' }}
              >
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend verification code'}
              </button>
              
              <span>
                Wrong email?{' '}
                <button type="button" className={styles.switchLink} onClick={() => switchMode('register')}>Go back</button>
              </span>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
