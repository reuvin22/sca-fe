import axios from 'axios'
import { clearToken, getToken } from '../utils/authStorage'
import { invalidate, tagsForUrl } from '../utils/dataSync'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
})

// Sends the login token with every request
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Returns the response body: { data, pagination? } (or the Blob for downloads).
// Errors become a friendly message (never raw server errors).
api.interceptors.response.use(
  (response) => {
    // A successful change: every list and card showing this data reloads (see utils/dataSync)
    if (response.config.method !== 'get') invalidate(tagsForUrl(response.config.url))
    return response.data
  },
  (error) => {
    // Expired or invalid login: sign out and go to the login page
    if (error.response?.status === 401 && error.config.headers.Authorization) {
      clearToken()
      window.location.assign('/login')
    }

    const message = error.response
      ? error.response.data?.message || 'Something went wrong. Please try again.'
      : 'Cannot reach the server. Please check your connection.'
    return Promise.reject(new Error(message))
  },
)

export default api
