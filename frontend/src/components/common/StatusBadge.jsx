import React from 'react'
import { Chip } from '@mui/material'
import { STATUS_COLOR } from '../../utils/constants.js'

export default function StatusBadge({ status, size = 'small' }) {
  const info = STATUS_COLOR[status] || STATUS_COLOR.pending
  return (
    <Chip
      size={size}
      label={info.label}
      sx={{
        color: info.color,
        backgroundColor: info.bg,
        fontWeight: 600,
        borderRadius: '8px',
      }}
    />
  )
}
