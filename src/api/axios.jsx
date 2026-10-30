import axios from 'axios'
import { getToken } from '../utils/authStorage'

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

// Returns the response `data` directly. Errors become a friendly message (never raw server errors).
api.interceptors.response.use(
  (response) => response.data?.data,
  (error) => {
    const message = error.response
      ? error.response.data?.message || 'Something went wrong. Please try again.'
      : 'Cannot reach the server. Please check your connection.'
    return Promise.reject(new Error(message))
  },
)

export default api
