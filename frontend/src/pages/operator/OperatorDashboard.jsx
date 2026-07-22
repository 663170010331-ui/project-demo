import React, { useEffect, useState } from 'react'
import { Box, Typography, Grid, Stack } from '@mui/material'
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded'
import BuildRoundedIcon from '@mui/icons-material/BuildRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import StatCard from '../../components/common/StatCard.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import { Spinner } from '../../components/common/LoadingState.jsx'
import { repairService } from '../../services/repairService.js'
import dayjs from 'dayjs'

export default function OperatorDashboard() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState(null)

  useEffect(() => {
    repairService.getStats().then(setStats)
    repairService.list().then((data) => setRecent(data.slice(0, 5)))
  }, [])

  const maxCat = stats ? Math.max(...stats.byCategory.map((c) => c.count)) : 1
  const maxMonth = stats ? Math.max(...stats.monthlyTrend.map((m) => m.count)) : 1

  return (
    <Box>
      <Typography variant="h5" fontWeight={800}>แดชบอร์ดผู้ดูแลงานซ่อม</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>ภาพรวมงานแจ้งซ่อมสาธารณูปโภคทั้งหมด</Typography>

      {!stats ? <Spinner /> : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} md={3}><StatCard icon={<PendingActionsRoundedIcon />} label="รอดำเนินการ" value={stats.pending} accent="#e08a1e" trend="+12% จากเมื่อวาน" /></Grid>
            <Grid item xs={6} md={3}><StatCard icon={<BuildRoundedIcon />} label="กำลังดำเนินการ" value={stats.inProgress} accent="#2f63f6" trend="+5%" /></Grid>
            <Grid item xs={6} md={3}><StatCard icon={<CheckCircleRoundedIcon />} label="เสร็จสิ้นแล้ว" value={stats.completed} accent="#1aa768" trend="+23%" /></Grid>
            <Grid item xs={6} md={3}><StatCard icon={<CancelRoundedIcon />} label="ยกเลิก" value={stats.cancelled} accent="#e0413f" trend="-40%" /></Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={7}>
              <Box className="card" sx={{ p: 3, height: '100%' }}>
                <Typography fontWeight={700} sx={{ mb: 2 }}>งานแจ้งซ่อมรายเดือน</Typography>
                <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ height: 160 }}>
                  {stats.monthlyTrend.map((m) => (
                    <Stack key={m.month} alignItems="center" spacing={1} sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          width: '100%', maxWidth: 32, borderRadius: '8px 8px 0 0', backgroundColor: '#2f63f6',
                          height: `${(m.count / maxMonth) * 120}px`,
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">{m.month}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box className="card" sx={{ p: 3, height: '100%' }}>
                <Typography fontWeight={700} sx={{ mb: 2 }}>ประเภทปัญหาที่พบบ่อย</Typography>
                <Stack spacing={1.5}>
                  {stats.byCategory.map((c) => (
                    <Box key={c.category}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Typography variant="body2">{c.category}</Typography>
                        <Typography variant="body2" fontWeight={700}>{c.count}</Typography>
                      </Stack>
                      <Box sx={{ height: 8, borderRadius: 999, backgroundColor: '#f1f5f9' }}>
                        <Box sx={{ height: 8, borderRadius: 999, backgroundColor: '#2f63f6', width: `${(c.count / maxCat) * 100}%` }} />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </>
      )}

      <Box className="card">
        <Box sx={{ p: 2.5, borderBottom: '1px solid #f1f5f9' }}>
          <Typography fontWeight={700}>รายการแจ้งซ่อมล่าสุด</Typography>
        </Box>
        {recent === null ? <Spinner /> : recent.map((r, idx) => (
          <Box
            key={r.id}
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2.5, borderBottom: idx !== recent.length - 1 ? '1px solid #f1f5f9' : 'none' }}
          >
            <Box>
              <Typography fontWeight={600}>{r.title}</Typography>
              <Typography variant="caption" color="text.secondary">{r.id} · {dayjs(r.createdAt).format('D MMM YYYY HH:mm')}</Typography>
            </Box>
            <StatusBadge status={r.status} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
