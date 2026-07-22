import axios from 'axios'
import { STORAGE_KEYS } from '../utils/constants.js'

// Central axios instance. Backend is not implemented yet — every service module
// (authService, repairService, ...) calls through this client so swapping mock
// data for real endpoints later only touches one layer.
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
