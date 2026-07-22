import React from 'react'
import { Box, CircularProgress, Typography, Skeleton, Stack } from '@mui/material'

export function Spinner({ label = 'กำลังโหลดข้อมูล...' }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 1.5 }}>
      <CircularProgress size={32} />
      <Typography variant="body2" color="text.secondary">{label}</Typography>
    </Box>
  )
}

export function CardSkeleton({ rows = 3 }) {
  return (
    <Stack spacing={1.5} sx={{ p: 2 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="rounded" height={64} sx={{ borderRadius: 3 }} />
      ))}
    </Stack>
  )
}
