import type { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from './useAuthStore'

interface Props { children?: ReactNode }

export const AuthGuard = ({ children }: Props) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children ? <>{children}</> : <Outlet />
}
