import React from 'react'
import { Box, Typography, Stack, Button, Avatar } from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import dayjs from 'dayjs'
import { useNotifications } from '../../contexts/NotificationContext.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'

export default function Notifications() {
  const { items, markAllRead, markRead } = useNotifications()

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>การแจ้งเตือน</Typography>
          <Typography variant="body2" color="text.secondary">ความเคลื่อนไหวล่าสุดของงานแจ้งซ่อม</Typography>
        </Box>
        <Button onClick={markAllRead} variant="outlined" size="small">อ่านทั้งหมด</Button>
      </Stack>

      <Box className="card">
        {items.length === 0 ? (
          <EmptyState title="ไม่มีการแจ้งเตือน" description="เมื่อมีความเคลื่อนไหวใหม่ ระบบจะแจ้งเตือนที่นี่" />
        ) : (
          items.map((n, idx) => (
            <Box
              key={n.id}
              onClick={() => markRead(n.id)}
              sx={{
                display: 'flex', gap: 2, p: 2.5, cursor: 'pointer',
                borderBottom: idx !== items.length - 1 ? '1px solid #f1f5f9' : 'none',
                backgroundColor: n.read ? 'transparent' : '#f8faff',
                '&:hover': { backgroundColor: '#f8faff' },
              }}
            >
              <Avatar sx={{ bgcolor: n.type === 'success' ? '#e2f6ec' : '#eef4ff', color: n.type === 'success' ? '#1aa768' : '#2f63f6' }}>
                {n.type === 'success' ? <CheckCircleRoundedIcon /> : <InfoRoundedIcon />}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={n.read ? 500 : 700}>{n.title}</Typography>
                <Typography variant="body2" color="text.secondary">{n.message}</Typography>
                <Typography variant="caption" color="text.secondary">{dayjs(n.createdAt).format('D MMM YYYY HH:mm')}</Typography>
              </Box>
              {!n.read && <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2f63f6', mt: 1 }} />}
            </Box>
          ))
        )}
      </Box>
    </Box>
  )
}
