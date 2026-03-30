import { HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { router } from './router'
import { queryClient } from '@/shared/lib/queryClient'

export const Providers = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </HelmetProvider>
)
