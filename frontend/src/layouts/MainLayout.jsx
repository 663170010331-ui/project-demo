import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Box, Typography, Button, Container, Stack } from '@mui/material'
import BuildCircleRoundedIcon from '@mui/icons-material/BuildCircleRounded'

const navItems = [
  { label: 'หน้าแรก', path: '/' },
  { label: 'ตรวจสอบสถานะ', path: '/check-status' },
  { label: 'เกี่ยวกับ', path: '/about' },
  { label: 'ติดต่อเรา', path: '/contact' },
]

export default function MainLayout() {
  const location = useLocation()
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" elevation={0} color="inherit" sx={{ borderBottom: '1px solid #eef1f7', backgroundColor: '#fff' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 2 }}>
            <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit' }}>
              <BuildCircleRoundedIcon sx={{ color: '#2f63f6' }} />
              <Typography fontWeight={800}>ระบบแจ้งซ่อมสาธารณูปโภค</Typography>
            </Box>
            <Box sx={{ flex: 1 }} />
            <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  color={location.pathname === item.path ? 'primary' : 'inherit'}
                  sx={{ fontWeight: 600 }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
            <Button component={Link} to="/login" variant="outlined">เข้าสู่ระบบ</Button>
            <Button component={Link} to="/register" variant="contained" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
              แจ้งปัญหา
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Box component="footer" sx={{ borderTop: '1px solid #eef1f7', py: 3, mt: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2569 ระบบแจ้งซ่อมสาธารณูปโภคด้วย LINE OA — โครงงานนักศึกษาสาขาเทคโนโลยีสารสนเทศ
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}