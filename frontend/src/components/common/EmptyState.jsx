import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'

export default function EmptyState({ title = 'ยังไม่มีข้อมูล', description, actionLabel, onAction, icon }) {
  return (
    <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
      <Box sx={{ fontSize: 48, color: '#94a3b8', mb: 1 }}>
        {icon || <InboxOutlinedIcon sx={{ fontSize: 48 }} />}
      </Box>
      <Typography variant="h6" fontWeight={700}>{title}</Typography>
      {description ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 360, mx: 'auto' }}>
          {description}
        </Typography>
      ) : null}
      {actionLabel ? (
        <Button variant="contained" onClick={onAction} sx={{ mt: 2 }}>{actionLabel}</Button>
      ) : null}
    </Box>
  )
}
