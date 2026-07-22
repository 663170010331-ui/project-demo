import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography, Grid, Button, Stack } from '@mui/material'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded'
import BuildRoundedIcon from '@mui/icons-material/BuildRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import StatCard from '../../components/common/StatCard.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { Spinner } from '../../components/common/LoadingState.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { repairService } from '../../services/repairService.js'
import dayjs from 'dayjs'

export default function CitizenDashboard() {
  const { user } = useAuth()
  const [requests, setRequests] = useState(null)

  useEffect(() => {
    repairService.list({ reporterId: user.id }).then(setRequests)
  }, [user.id])

  const counts = requests
    ? {
        pending: requests.filter((r) => ['reported', 'accepted', 'assigned'].includes(r.status)).length,
        inProgress: requests.filter((r) => r.status === 'in_progress').length,
        completed: requests.filter((r) => r.status === 'completed').length,
      }
    : { pending: 0, inProgress: 0, completed: 0 }

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>สวัสดี, {user.name} 👋</Typography>
          <Typography variant="body2" color="text.secondary">ภาพรวมงานแจ้งซ่อมของคุณ</Typography>
        </Box>
        <Button component={Link} to="/citizen/create" variant="contained" startIcon={<AddCircleRoundedIcon />} size="large">
          แจ้งปัญหาใหม่
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <StatCard icon={<PendingActionsRoundedIcon />} label="รอดำเนินการ" value={counts.pending} accent="#e08a1e" />
        <StatCard icon={<BuildRoundedIcon />} label="กำลังซ่อม" value={counts.inProgress} accent="#2f63f6" />
        <StatCard icon={<CheckCircleRoundedIcon />} label="เสร็จสิ้น" value={counts.completed} accent="#1aa768" />
      </Stack>

      <Box className="card">
        <Box sx={{ p: 2.5, borderBottom: '1px solid #f1f5f9' }}>
          <Typography fontWeight={700}>รายการแจ้งซ่อมล่าสุด</Typography>
        </Box>
        {requests === null ? (
          <Spinner />
        ) : requests.length === 0 ? (
          <EmptyState
            title="ยังไม่มีรายการแจ้งซ่อม"
            description="เริ่มแจ้งปัญหาสาธารณูปโภคแรกของคุณได้เลย"
            actionLabel="แจ้งปัญหาใหม่"
          />
        ) : (
          requests.map((r, idx) => (
            <Box
              key={r.id}
              component={Link}
              to="/citizen/track"
              sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2.5, textDecoration: 'none', color: 'inherit',
                borderBottom: idx !== requests.length - 1 ? '1px solid #f1f5f9' : 'none', '&:hover': { backgroundColor: '#f8faff' },
              }}
            >
              <Box>
                <Typography fontWeight={600}>{r.title}</Typography>
                <Typography variant="caption" color="text.secondary">{r.id} · {dayjs(r.createdAt).format('D MMM YYYY HH:mm')}</Typography>
              </Box>
              <StatusBadge status={r.status} />
            </Box>
          ))
        )}
      </Box>
    </Box>
  )
}
