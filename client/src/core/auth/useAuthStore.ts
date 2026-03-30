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
      logout: () => set({ accessToken: null, user: null, isAuthenticated: false }),
    }),
    { name: 'auth-store' }
  )
)
