import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { Spinner } from '../../components/common/LoadingState.jsx'
import { repairService } from '../../services/repairService.js'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function RepairHistory() {
  const { user } = useAuth()
  const [requests, setRequests] = useState(null)

  useEffect(() => {
    repairService.list({ reporterId: user.id }).then((data) => setRequests(data.filter((r) => ['completed', 'cancelled'].includes(r.status))))
  }, [user.id])

  return (
    <Box>
      <Typography variant="h5" fontWeight={800}>ประวัติการแจ้งซ่อม</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>รายการที่ดำเนินการเสร็จสิ้นหรือยกเลิกแล้ว</Typography>

      <Box className="card">
        {requests === null ? (
          <Spinner />
        ) : requests.length === 0 ? (
          <EmptyState title="ยังไม่มีประวัติ" description="งานแจ้งซ่อมที่เสร็จสิ้นแล้วจะแสดงที่นี่" />
        ) : (
          requests.map((r, idx) => (
            <Box
              key={r.id}
              sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2.5,
                borderBottom: idx !== requests.length - 1 ? '1px solid #f1f5f9' : 'none',
              }}
            >
              <Box>
                <Typography fontWeight={600}>{r.title}</Typography>
                <Typography variant="caption" color="text.secondary">{r.id} · {dayjs(r.createdAt).format('D MMM YYYY')}</Typography>
              </Box>
              <StatusBadge status={r.status} />
            </Box>
          ))
        )}
      </Box>
    </Box>
  )
}
