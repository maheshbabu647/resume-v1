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

// 401 → redirect to login
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.data?.code === 'GUEST_LIMIT_HIT') {
      window.dispatchEvent(new CustomEvent('guest-limit-hit', { detail: error.response.data.data }))
      return Promise.reject(error)
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-store')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
