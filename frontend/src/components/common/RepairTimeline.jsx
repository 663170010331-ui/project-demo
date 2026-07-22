import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { REPAIR_STATUSES } from '../../utils/constants.js'

// Visual timeline: Reported -> Accepted -> Assigned -> In progress -> Completed
export default function RepairTimeline({ status }) {
  const steps = REPAIR_STATUSES.filter((s) => s.value !== 'cancelled')
  const currentIndex = steps.findIndex((s) => s.value === status)

  return (
    <Stack sx={{ py: 1 }}>
      {steps.map((step, idx) => {
        const done = idx <= currentIndex
        const isLast = idx === steps.length - 1
        return (
          <Box key={step.value} sx={{ display: 'flex', gap: 1.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {done ? (
                <CheckCircleIcon sx={{ color: '#1aa768', fontSize: 24 }} />
              ) : (
                <RadioButtonUncheckedIcon sx={{ color: '#cbd5e1', fontSize: 24 }} />
              )}
              {!isLast && (
                <Box sx={{ width: 2, flex: 1, minHeight: 28, backgroundColor: done ? '#1aa768' : '#e2e8f0', my: 0.25 }} />
              )}
            </Box>
            <Box sx={{ pb: isLast ? 0 : 2.5 }}>
              <Typography fontWeight={done ? 700 : 500} color={done ? 'text.primary' : 'text.secondary'}>
                {step.label}
              </Typography>
            </Box>
          </Box>
        )
      })}
    </Stack>
  )
}
