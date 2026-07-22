import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography, Button } from '@mui/material'

export default function NotFound() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2, textAlign: 'center' }}>
      <Typography variant="h1" fontWeight={800} sx={{ color: '#2f63f6', fontSize: { xs: 72, md: 120 } }}>404</Typography>
      <Typography variant="h5" fontWeight={700}>ไม่พบหน้าที่คุณต้องการ</Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>หน้านี้อาจถูกย้ายหรือไม่มีอยู่จริง</Typography>
      <Button component={Link} to="/" variant="contained" size="large">กลับหน้าแรก</Button>
    </Box>
  )
}
