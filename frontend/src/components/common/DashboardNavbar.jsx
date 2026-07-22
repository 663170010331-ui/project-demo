import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppBar, Toolbar, IconButton, Box, Typography, Badge, Avatar, Menu, MenuItem, Divider,
} from '@mui/material'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useNotifications } from '../../contexts/NotificationContext.jsx'

export default function DashboardNavbar({ onMenuClick, roleLabel }) {
  const { user, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{ backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #eef1f7' }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton onClick={onMenuClick} sx={{ display: { md: 'none' } }}>
          <MenuRoundedIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary">{roleLabel}</Typography>
        </Box>
        <IconButton onClick={() => navigate('notifications')}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsRoundedIcon />
          </Badge>
        </IconButton>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 0.5 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: '#2f63f6', fontSize: 14 }}>
            {user?.name?.[0] || 'U'}
          </Avatar>
        </IconButton>
        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
          <Box sx={{ px: 2, py: 1 }}>
            <Typography fontWeight={700}>{user?.name}</Typography>
            <Typography variant="caption" color="text.secondary">{user?.username}</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => { setAnchorEl(null); navigate('profile') }}>โปรไฟล์</MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); navigate('settings') }}>ตั้งค่า</MenuItem>
          <Divider />
          <MenuItem sx={{ color: '#e0413f' }} onClick={async () => { await logout(); navigate('/login') }}>
            ออกจากระบบ
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
