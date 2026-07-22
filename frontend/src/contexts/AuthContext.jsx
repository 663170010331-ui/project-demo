import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authService } from '../services/authService.js'
import { STORAGE_KEYS } from '../utils/constants.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER)
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const persist = (nextUser, token) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(nextUser))
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    setUser(nextUser)
  }

  const login = useCallback(async (credentials) => {
    const { user: u, token } = await authService.login(credentials)
    persist(u, token)
    return u
  }, [])

  const loginWithLine = useCallback(async () => {
    const { user: u, token } = await authService.loginWithLine()
    persist(u, token)
    return u
  }, [])

  const register = useCallback(async (payload) => {
    const { user: u, token } = await authService.register(payload)
    persist(u, token)
    return u
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithLine, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
