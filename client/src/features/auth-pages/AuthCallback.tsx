import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { apiClient } from '@/shared/lib/apiClient'
import { trackSignUp, trackLogin, setUserProperties } from '@/shared/lib/analytics'

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()
  const hasProcessed = useRef(false)

  useEffect(() => {
    if (hasProcessed.current) return
    hasProcessed.current = true

    const token = searchParams.get('token')
    
    if (!token) {
      console.error('No token found in callback URL')
      navigate('/login')
      return
    }

    const handleOAuthSuccess = async () => {
      try {
        // 1. Set the token first so subsequent requests are authenticated
        setTokens(token)
        
        // 2. Fetch the full user profile
        // Note: useAuthStore.setTokens sets the token in memory/localStorage, 
        // and apiClient (if using interceptors) should pick it up.
        // If not, we can pass it explicitly or wait a tick.
        const { data } = await apiClient.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        const user = data.data.user ?? data.data
        setUser(user)

        // Detect new vs returning user — new if account created within last 60 seconds
        const isNewUser = (Date.now() - new Date(user.createdAt).getTime()) < 60_000
        if (isNewUser) {
          trackSignUp('google')
        } else {
          trackLogin('google')
        }
        setUserProperties(user._id, user.plan)

        // 3. Redirect to dashboard or saved returnTo
        const returnTo = localStorage.getItem('returnTo')
        if (returnTo) {
          localStorage.removeItem('returnTo')
          navigate(returnTo)
        } else {
          navigate('/dashboard')
        }
      } catch (err) {
        console.error('Failed to complete OAuth login:', err)
        navigate('/login?error=oauth_failed')
      }
    }

    handleOAuthSuccess()
  }, [searchParams, navigate, setTokens, setUser])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', background: 'var(--surface)' }}>
      <Loader2 size={40} className="spin" color="var(--primary)" />
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--on-surface)', marginBottom: '0.5rem' }}>Completing login...</h2>
        <p style={{ color: 'var(--on-surface-variant)' }}>Please wait a moment while we set things up.</p>
      </div>
    </div>
  )
}
