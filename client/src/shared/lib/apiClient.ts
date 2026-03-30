import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/v1',
  withCredentials: true,
})

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  // Dynamically import avoids circular dep — read directly from localStorage fallback
  const raw = localStorage.getItem('auth-store')
  if (raw) {
    try {
      const state = JSON.parse(raw) as { state?: { accessToken?: string } }
      const token = state?.state?.accessToken
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch { /* noop */ }
  }
  return config
})

// 401 → redirect to login
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-store')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
