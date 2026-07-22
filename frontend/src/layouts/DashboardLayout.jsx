import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import Sidebar, { drawerWidth } from '../components/common/Sidebar.jsx'
import DashboardNavbar from '../components/common/DashboardNavbar.jsx'

export default function DashboardLayout({ menu, roleLabel }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar menu={menu} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box sx={{ flex: 1, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <DashboardNavbar onMenuClick={() => setMobileOpen(true)} roleLabel={roleLabel} />
        <Box component="main" sx={{ p: { xs: 2, md: 3.5 }, maxWidth: 1400, mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
