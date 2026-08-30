import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { Snackbar, Alert } from '@mui/material'
import { notificationService } from '../services/notificationService.js'
import { useAuth } from './AuthContext.jsx'

const NotificationContext = createContext(null)

// How often to re-poll the notification list while the app is open. There's
// no websocket/push channel yet, so this is a simple interval — cheap enough
// at this scale and good enough for a capstone demo.
const POLL_INTERVAL_MS = 30000

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState([])
  const [toast, setToast] = useState(null)
  const pollRef = useRef(null)

  const unreadCount = items.filter((n) => !n.read).length

  const refresh = useCallback(async () => {
    try {
      const data = await notificationService.list()
      setItems(data)
    } catch (err) {
      // Silent on purpose — a failed background poll shouldn't interrupt
      // whatever the user is doing. The next poll (or manual action) retries.
      console.error('โหลดการแจ้งเตือนไม่สำเร็จ', err)
    }
  }, [])

  // Fetch once on login, then keep polling while the session is active. Stop
  // and clear everything on logout so one user never sees a flash of the
  // previous user's notifications.
  useEffect(() => {
    if (!isAuthenticated) {
      setItems([])
      if (pollRef.current) clearInterval(pollRef.current)
      return
    }
    refresh()
    pollRef.current = setInterval(refresh, POLL_INTERVAL_MS)
    return () => clearInterval(pollRef.current)
  }, [isAuthenticated, refresh])

  const markAllRead = useCallback(async () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true }))) // optimistic
    try {
      await notificationService.markAllRead()
    } catch (err) {
      console.error('ทำเครื่องหมายอ่านทั้งหมดไม่สำเร็จ', err)
      refresh() // reconcile with the server if the call actually failed
    }
  }, [refresh])

  const markRead = useCallback(async (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n))) // optimistic
    try {
      await notificationService.markRead(id)
    } catch (err) {
      console.error('ทำเครื่องหมายอ่านไม่สำเร็จ', err)
      refresh()
    }
  }, [refresh])

  const notify = useCallback((message, severity = 'success') => {
    setToast({ message, severity, key: Date.now() })
  }, [])

  return (
    <NotificationContext.Provider value={{ items, unreadCount, markAllRead, markRead, notify, refresh }}>
      {children}
      <Snackbar
        open={!!toast}
        autoHideDuration={3500}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {toast ? (
          <Alert severity={toast.severity} variant="filled" onClose={() => setToast(null)} sx={{ borderRadius: 3 }}>
            {toast.message}
          </Alert>
        ) : null}
      </Snackbar>
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}