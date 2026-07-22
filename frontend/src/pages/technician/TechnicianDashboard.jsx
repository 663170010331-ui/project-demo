import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography, Stack, Button } from '@mui/material'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import BuildRoundedIcon from '@mui/icons-material/BuildRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import StatCard from '../../components/common/StatCard.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { Spinner } from '../../components/common/LoadingState.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { repairService } from '../../services/repairService.js'
import dayjs from 'dayjs'

export default function TechnicianDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState(null)

  useEffect(() => {
    repairService.list({ technicianId: user.id }).then(setJobs)
  }, [user.id])

  const counts = jobs
    ? {
        assigned: jobs.filter((j) => j.status === 'assigned').length,
        inProgress: jobs.filter((j) => j.status === 'in_progress').length,
        completed: jobs.filter((j) => j.status === 'completed').length,
      }
    : { assigned: 0, inProgress: 0, completed: 0 }

  return (
    <Box>
      <Typography variant="h5" fontWeight={800}>สวัสดี, {user.name} 🔧</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>งานซ่อมที่ได้รับมอบหมายวันนี้</Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <StatCard icon={<AssignmentRoundedIcon />} label="งานใหม่" value={counts.assigned} accent="#e08a1e" />
        <StatCard icon={<BuildRoundedIcon />} label="กำลังทำ" value={counts.inProgress} accent="#2f63f6" />
        <StatCard icon={<CheckCircleRoundedIcon />} label="เสร็จแล้ว" value={counts.completed} accent="#1aa768" />
      </Stack>

      <Box className="card">
        <Box sx={{ p: 2.5, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography fontWeight={700}>งานของฉัน</Typography>
          <Button component={Link} to="/technician/jobs" size="small">ดูทั้งหมด</Button>
        </Box>
        {jobs === null ? <Spinner /> : jobs.length === 0 ? (
          <EmptyState title="ยังไม่มีงานที่ได้รับมอบหมาย" description="งานใหม่จะปรากฏที่นี่ทันทีที่หัวหน้าช่างมอบหมาย" />
        ) : jobs.map((j, idx) => (
          <Box
            key={j.id} component={Link} to={`/technician/jobs/${j.id}`}
            sx={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2.5, textDecoration: 'none', color: 'inherit',
              borderBottom: idx !== jobs.length - 1 ? '1px solid #f1f5f9' : 'none', '&:hover': { backgroundColor: '#f8faff' },
            }}
          >
            <Box>
              <Typography fontWeight={600}>{j.title}</Typography>
              <Typography variant="caption" color="text.secondary">{j.id} · {dayjs(j.createdAt).format('D MMM YYYY HH:mm')}</Typography>
            </Box>
            <StatusBadge status={j.status} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
