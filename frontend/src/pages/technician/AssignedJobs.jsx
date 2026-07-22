import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, Chip, Stack } from '@mui/material'
import dayjs from 'dayjs'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { Spinner } from '../../components/common/LoadingState.jsx'
import { REPAIR_CATEGORIES, PRIORITY_LEVELS } from '../../utils/constants.js'
import { repairService } from '../../services/repairService.js'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function AssignedJobs() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState(null)

  useEffect(() => {
    repairService.list({ technicianId: user.id }).then(setJobs)
  }, [user.id])

  return (
    <Box>
      <Typography variant="h5" fontWeight={800}>งานที่ได้รับมอบหมาย</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>งานซ่อมทั้งหมดที่คุณรับผิดชอบ</Typography>

      {jobs === null ? <Spinner /> : jobs.length === 0 ? (
        <EmptyState title="ยังไม่มีงานที่ได้รับมอบหมาย" />
      ) : (
        <Grid container spacing={2}>
          {jobs.map((j) => {
            const priority = PRIORITY_LEVELS.find((p) => p.value === j.priority)
            return (
              <Grid item xs={12} sm={6} md={4} key={j.id}>
                <Box className="card card-hover" sx={{ p: 2.5, cursor: 'pointer', height: '100%' }} onClick={() => navigate(`/technician/jobs/${j.id}`)}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>{j.id}</Typography>
                    <StatusBadge status={j.status} />
                  </Stack>
                  <Typography fontWeight={700} sx={{ mt: 0.5 }}>{j.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }} noWrap>{j.location}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                    <Chip size="small" label={REPAIR_CATEGORIES.find((c) => c.value === j.category)?.label} sx={{ backgroundColor: '#f1f5f9' }} />
                    <Chip size="small" label={priority?.label} color={priority?.color} variant="outlined" />
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    {dayjs(j.createdAt).format('D MMM YYYY HH:mm')}
                  </Typography>
                </Box>
              </Grid>
            )
          })}
        </Grid>
      )}
    </Box>
  )
}
