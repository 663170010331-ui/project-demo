import React, { useEffect, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useAuth } from '../contexts/AuthContext.jsx'
import { getLiffAuth } from '../services/liffService.js'

// Citizens have no login page — this replaces ProtectedRoute for the
// /citizen branch. Instead of redirecting to /login when there's no user,
// it silently runs the LIFF login flow (auto-add-friend + fetch profile)
// and only renders the citizen pages once that succeeds.
export default function LiffRoute({ children }) {
  const { user, loading, loginWithLine } = useAuth()
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (loading || user || signingIn) return

    setSigningIn(true)
    getLiffAuth()
      .then((auth) => {
        // auth is null when liff.login() just redirected the page away —
        // nothing left to do here.
        if (!auth) return
        return loginWithLine(auth.accessToken, auth.profile)
      })
      .catch((err) => {
        console.error(err)
        setError('เข้าสู่ระบบผ่าน LINE ไม่สำเร็จ กรุณาเปิดลิงก์นี้ผ่านแอป LINE อีกครั้ง')
      })
      .finally(() => setSigningIn(false))
  }, [loading, user, signingIn, loginWithLine])

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Typography color="error" align="center">{error}</Typography>
      </Box>
    )
  }

  if (loading || signingIn || !user) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">กำลังเข้าสู่ระบบผ่าน LINE...</Typography>
      </Box>
    )
  }

  return children
}
