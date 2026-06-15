import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/v1',
  withCredentials: true,
})

// Attach access token or guest ID to every request
apiClient.interceptors.request.use((config) => {
  // Access token
  const raw = localStorage.getItem('auth-store')
  let hasToken = false
  if (raw) {
    try {
      const state = JSON.parse(raw) as { state?: { accessToken?: string } }
      const token = state?.state?.accessToken
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        hasToken = true
      }
    } catch { /* noop */ }
  }

  // Guest ID fallback
  if (!hasToken) {
    let guestId = localStorage.getItem('guest_id')
    if (!guestId) {
      guestId = crypto.randomUUID()
      localStorage.setItem('guest_id', guestId)
    }
    config.headers['X-Guest-Id'] = guestId
  }

  return config
})

// Public auth endpoints: a 401 here means "invalid credentials", not "session expired" —
// let the page handle the error itself instead of redirecting to /login.
const PUBLIC_AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/verify-email',
  '/auth/resend-otp',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/google',
]

let isRefreshing = false
let failedQueue: Array<{ resolve: (value: string) => void; reject: (reason?: any) => void }> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token as string)
    }
  })
  failedQueue = []
}

// 401 → refresh token or redirect to login
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    if (PUBLIC_AUTH_ENDPOINTS.some((endpoint) => originalRequest?.url?.startsWith(endpoint))) {
      return Promise.reject(error)
    }

    if (error.response?.data?.code === 'GUEST_LIMIT_HIT') {
      window.dispatchEvent(new CustomEvent('guest-limit-hit', { detail: error.response.data.data }))
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        const newAccessToken = data.data.accessToken

        // Update auth store manually
        const raw = localStorage.getItem('auth-store')
        if (raw) {
          try {
            const parsed = JSON.parse(raw)
            if (parsed.state) {
              parsed.state.accessToken = newAccessToken
              localStorage.setItem('auth-store', JSON.stringify(parsed))
            }
          } catch (e) { /* noop */ }
        }

        processQueue(null, newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch (err) {
        processQueue(err, null)
        localStorage.removeItem('auth-store')
        window.dispatchEvent(new CustomEvent('auth-expired'))
        if (originalRequest.url !== '/auth/me') {
          window.location.href = '/login'
        }
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('auth-store')
      window.dispatchEvent(new CustomEvent('auth-expired'))
      if (originalRequest?.url !== '/auth/me' && originalRequest?.url !== '/auth/refresh') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)
