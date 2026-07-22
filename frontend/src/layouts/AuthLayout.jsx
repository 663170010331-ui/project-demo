import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import BuildCircleRoundedIcon from '@mui/icons-material/BuildCircleRounded'

export default function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #eef4ff 0%, #f4f6fb 45%, #ffffff 100%)', p: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', mb: 3 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit' }}>
            <BuildCircleRoundedIcon sx={{ color: '#2f63f6', fontSize: 34 }} />
            <Box>
              <Typography fontWeight={800} lineHeight={1.1}>ระบบแจ้งซ่อมสาธารณูปโภค</Typography>
              <Typography variant="caption" color="text.secondary">ผ่าน LINE Official Account</Typography>
            </Box>
          </Link>
        </Box>
        <Box className="card animate-fadeIn" sx={{ p: { xs: 3, sm: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
