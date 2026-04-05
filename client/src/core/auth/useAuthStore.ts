import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthUser {
  _id: string
  email: string
  name: string
  plan: 'seeker' | 'hustler' | 'closer'
  avatarUrl?: string
  referralCode?: string
  isEmailVerified: boolean
  createdAt: string
  resumeCount: number
}

interface AuthStore {
  accessToken: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setTokens: (access: string) => void
  setUser: (user: AuthUser) => void
  fetchUser: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      setTokens: (access) => set({ accessToken: access, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      fetchUser: async () => {
        try {
          const { apiClient } = await import('@/shared/lib/apiClient')
          const res = await apiClient.get('/auth/me')
          if (res.data.data) {
            set({ user: res.data.data })
            // Re-identify user in GA4 on every session restore
            const { setUserProperties } = await import('@/shared/lib/analytics')
            setUserProperties(res.data.data._id, res.data.data.plan)
          }
        } catch (err) {
          console.error('Failed to fetch user:', err)
        }
      },
      logout: () => set({ accessToken: null, user: null, isAuthenticated: false }),
    }),
    { name: 'auth-store' }
  )
)
