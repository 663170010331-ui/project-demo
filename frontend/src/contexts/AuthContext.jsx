import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authService } from '../services/authService.js'
import { STORAGE_KEYS } from '../utils/constants.js'
import { liff } from '../services/liffService.js'

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

  const loginWithLine = useCallback(async (accessToken, profile) => {
    const { user: u, token } = await authService.loginWithLine(accessToken, profile)
    persist(u, token)
    return u
  }, [])

  const register = useCallback(async (payload) => {
    const { user: u, token } = await authService.register(payload)
    persist(u, token)
    return u
  }, [])

  const logout = useCallback(async () => {
    const isCitizen = user?.role === 'citizen'
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    setUser(null)
    if (isCitizen) {
      // Citizens never had a username/password session — there's no "/login" for
      // them. liff.logout() clears the LIFF SDK session; closeWindow() returns
      // straight to the LINE chat instead of redirecting to LINE's own login
      // page (which is what caused the 400 Bad Request bug).
      if (liff.isLoggedIn()) liff.logout()
      liff.closeWindow()
    } else {
      await authService.logout()
    }
  }, [user])

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