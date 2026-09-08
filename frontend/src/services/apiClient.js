import axios from 'axios'
import { STORAGE_KEYS } from '../utils/constants.js'

// Central axios instance. Every service module (authService, repairService,
// userService, notificationService, ...) calls through this single client,
// so auth headers, base URL, and 401-handling stay in exactly one place.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
    return Promise.reject(error)
  }
)

export default apiClient