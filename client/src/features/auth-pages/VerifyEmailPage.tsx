import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { apiClient } from '@/shared/lib/apiClient'
import styles from './auth-pages.module.css'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  
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
      setResendCooldown(60) // 60s cooldown
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to resend code.')
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
          <h2 className={styles.leftTitle}>Secure your CareerForge account.</h2>
          <ul className={styles.leftPoints}>
            {['Verify your email to continue', 'Prevents unauthorized access', 'Keeps your resumes private', 'Only takes a minute'].map((p) => (
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
          <h1 className={styles.formTitle}>Check your email</h1>
          <p className={styles.formSub}>We've sent a 6-digit verification code to <strong>{email}</strong>.</p>

          {error && <div className={styles.errorBanner}>{error}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--on-surface)' }}>Verification Code</label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="123456"
                style={{
                  height: '52px', fontSize: '24px', letterSpacing: '8px', textAlign: 'center',
                  background: 'var(--surface-container-low)', border: 'none', borderRadius: 'var(--radius-lg)',
                  color: 'var(--on-surface)', outline: 'none', transition: 'box-shadow var(--transition-fast)'
                }}
                required
              />
            </div>
            
            <Button type="submit" loading={loading} style={{ width: '100%' }}>
              Verify & Continue <ArrowRight size={16} />
            </Button>
          </form>

            <div className={styles.formFooterRow} style={{ justifyContent: 'center', marginTop: 'var(--space-4)' }}>
              <button 
                type="button" 
                className={styles.forgotLink} 
                onClick={handleResend}
                disabled={resendCooldown > 0}
                style={{ opacity: resendCooldown > 0 ? 0.5 : 1, cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer', background: 'none', border: 'none' }}
              >
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend verification code'}
              </button>
            </div>
        </div>
      </div>
    </div>
  )
}
