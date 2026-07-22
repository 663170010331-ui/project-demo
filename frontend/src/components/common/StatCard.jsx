import React from 'react'
import { Box, Typography, Stack } from '@mui/material'

export default function StatCard({ icon, label, value, trend, accent = '#2f63f6' }) {
  return (
    <Box className="card card-hover animate-fadeIn" sx={{ p: 2.5, flex: 1, minWidth: 180 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
          <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>{value}</Typography>
          {trend ? (
            <Typography variant="caption" sx={{ color: trend.startsWith('-') ? '#e0413f' : '#1aa768', fontWeight: 600 }}>
              {trend}
            </Typography>
          ) : null}
        </Box>
        <Box
          sx={{
            width: 48, height: 48, borderRadius: '14px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 22,
            backgroundColor: `${accent}1a`, color: accent,
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Box>
  )
}
