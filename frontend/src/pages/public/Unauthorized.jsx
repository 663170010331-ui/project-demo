import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography, Button } from '@mui/material'
import LockPersonRoundedIcon from '@mui/icons-material/LockPersonRounded'

export default function Unauthorized() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2, textAlign: 'center' }}>
      <LockPersonRoundedIcon sx={{ fontSize: 72, color: '#e08a1e', mb: 1 }} />
      <Typography variant="h5" fontWeight={700}>ไม่มีสิทธิ์เข้าถึงหน้านี้</Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>บัญชีของคุณไม่มีสิทธิ์เข้าถึงส่วนนี้ของระบบ</Typography>
      <Button component={Link} to="/" variant="contained" size="large">กลับหน้าแรก</Button>
    </Box>
  )
}
