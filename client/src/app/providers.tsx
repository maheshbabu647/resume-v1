import { useEffect } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { router } from './router'
import { queryClient } from '@/shared/lib/queryClient'
import { useAuthStore } from '@/core/auth/useAuthStore'

const AuthInit = () => {
  const { isAuthenticated, fetchUser } = useAuthStore()
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchUser()
    }
  }, [isAuthenticated, fetchUser])
  
  return null
}

export const Providers = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthInit />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </HelmetProvider>
)
