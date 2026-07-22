import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material'
import BuildCircleRoundedIcon from '@mui/icons-material/BuildCircleRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { useAuth } from '../../contexts/AuthContext.jsx'

const drawerWidth = 260

export default function Sidebar({ menu, mobileOpen, onClose }) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 2.5, py: 2.5 }}>
        <BuildCircleRoundedIcon sx={{ color: '#2f63f6', fontSize: 30 }} />
        <Box>
          <Typography fontWeight={800} lineHeight={1.1}>ระบบแจ้งซ่อม</Typography>
          <Typography variant="caption" color="text.secondary">สาธารณูปโภค LINE OA</Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ flex: 1, px: 1.5, py: 1.5 }}>
        {menu.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            onClick={onClose}
            sx={{
              borderRadius: 2.5, mb: 0.5, py: 1.1,
              '&.active': { backgroundColor: '#eef4ff', color: '#193bab', '& .MuiListItemIcon-root': { color: '#193bab' } },
            }}
          >
            <ListItemIcon sx={{ minWidth: 38 }}>{item.icon}</ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}>{item.label}</ListItemText>
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List sx={{ px: 1.5, py: 1.5 }}>
        <ListItemButton
          sx={{ borderRadius: 2.5, color: '#e0413f' }}
          onClick={async () => { await logout(); navigate('/login') }}
        >
          <ListItemIcon sx={{ minWidth: 38, color: '#e0413f' }}><LogoutRoundedIcon /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}>ออกจากระบบ</ListItemText>
        </ListItemButton>
      </List>
    </Box>
  )

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          '& .MuiDrawer-paper': { width: drawerWidth, borderRight: '1px solid #eef1f7', boxSizing: 'border-box' },
        }}
        open
      >
        {content}
      </Drawer>
    </>
  )
}

export { drawerWidth }
