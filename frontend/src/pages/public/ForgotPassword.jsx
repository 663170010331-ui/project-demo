import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { TextField, Button, Typography, Box, Stack, Alert } from '@mui/material'
import { authService } from '../../services/authService.js'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authService.forgotPassword(email)
      setMessage(res.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={800}>ลืมรหัสผ่าน</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        กรอกอีเมลที่ใช้ลงทะเบียนไว้ เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ให้
      </Typography>

      {message && <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>{message}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Stack spacing={2}>
          <TextField label="อีเมล" type="email" required fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" size="large" variant="contained" disabled={loading}>
            {loading ? 'กำลังส่ง...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
          </Button>
        </Stack>
      </Box>

      <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        <Typography component={Link} to="/login" variant="body2" sx={{ color: '#2f63f6', fontWeight: 700, textDecoration: 'none' }}>
          กลับไปหน้าเข้าสู่ระบบ
        </Typography>
      </Typography>
    </Box>
  )
}
