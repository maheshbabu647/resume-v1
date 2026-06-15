import type { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from './useAuthStore'

interface Props { children?: ReactNode }

/** Requires an authenticated user with role 'admin'. */
export const AdminGuard = ({ children }: Props) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // User profile not hydrated yet (fetchUser in flight after reload)
  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--surface)' }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--outline-variant)', borderTopColor: 'var(--brand)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children ? <>{children}</> : <Outlet />
}
