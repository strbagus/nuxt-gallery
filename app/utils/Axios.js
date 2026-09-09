import axios from 'axios'

export const MainService = axios.create({
  baseURL: `${import.meta.env.VITE_SAMPLE_API}`,
  withCredentials: true,
  timeout: 5000,
})


export const PhotoService = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
  timeout: 5000,
})

let isRedirecting = false

export const redirectToLogin = () => {
  if (typeof window === 'undefined' || isRedirecting) return
  isRedirecting = true
  const authBase = (import.meta.env.VITE_AUTH_URL || '').replace(/\/$/, '')
  if (!authBase) {
    console.error('VITE_AUTH_URL is not configured')
    return
  }
  const currentUrl = window.location.href
  const separator = authBase.includes('?') ? '&' : '?'
  window.location.href = `${authBase}${separator}callback=${encodeURIComponent(currentUrl)}`
}

const getCookie = (name) => {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
  return match ? decodeURIComponent(match[3]) : ''
}

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

PhotoService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config

    if (!error.response || error.response.status !== 401 || !originalRequest) {
      return Promise.reject(error)
    }

    // Prevent infinite loop if already retried or if the failed request was /refresh
    if (originalRequest._retry || originalRequest.url?.includes('/refresh')) {
      redirectToLogin()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          if (token) {
            originalRequest.headers = originalRequest.headers || {}
            originalRequest.headers['Authorization'] = `Bearer ${token}`
          }
          return PhotoService(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    const authBase = (import.meta.env.VITE_AUTH_URL || '').replace(/\/$/, '')
    const refreshUrl = `${authBase}/refresh`
    const refreshToken = getCookie('refresh_token')
    const payload = refreshToken ? { refresh_token: refreshToken } : {}

    try {
      const res = await axios.post(refreshUrl, payload, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      })
      const newAccessToken = res.data?.access_token || res.data?.data?.access_token
      if (newAccessToken) {
        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
      }
      processQueue(null, newAccessToken)
      return PhotoService(originalRequest)
    } catch (refreshErr) {
      processQueue(refreshErr, null)
      redirectToLogin()
      return Promise.reject(refreshErr)
    } finally {
      isRefreshing = false
    }
  }
)
