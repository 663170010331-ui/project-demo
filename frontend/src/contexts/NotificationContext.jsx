import React, { createContext, useContext, useState, useCallback } from 'react'
import { Snackbar, Alert } from '@mui/material'
import { mockNotifications } from '../services/mock/mockData.js'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [items, setItems] = useState(mockNotifications)
  const [toast, setToast] = useState(null)

  const unreadCount = items.filter((n) => !n.read).length

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const markRead = useCallback((id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const notify = useCallback((message, severity = 'success') => {
    setToast({ message, severity, key: Date.now() })
  }, [])

  return (
    <NotificationContext.Provider value={{ items, unreadCount, markAllRead, markRead, notify }}>
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
