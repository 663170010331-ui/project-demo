import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, MenuItem, TextField } from '@mui/material'
import dayjs from 'dayjs'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import { Spinner } from '../../components/common/LoadingState.jsx'
import { REPAIR_CATEGORIES } from '../../utils/constants.js'
import { repairService } from '../../services/repairService.js'

export default function RepairRequests() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    repairService.list({ status: statusFilter || undefined, category: categoryFilter || undefined }).then(setRequests)
  }, [statusFilter, categoryFilter])

  const columns = [
    { key: 'id', label: 'หมายเลขคำขอ', sortable: true },
    { key: 'title', label: 'หัวข้อปัญหา', sortable: true },
    { key: 'category', label: 'ประเภท', render: (r) => REPAIR_CATEGORIES.find((c) => c.value === r.category)?.label },
    { key: 'createdAt', label: 'วันที่แจ้ง', sortable: true, render: (r) => dayjs(r.createdAt).format('D MMM YYYY HH:mm') },
    { key: 'status', label: 'สถานะ', render: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <Box>
      <Typography variant="h5" fontWeight={800}>รายการคำขอแจ้งซ่อม</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>ตรวจสอบและมอบหมายงานให้ช่างเทคนิค</Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField select size="small" label="สถานะ" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 180, backgroundColor: 'white' }}>
          <MenuItem value="">ทั้งหมด</MenuItem>
          <MenuItem value="reported">แจ้งแล้ว</MenuItem>
          <MenuItem value="assigned">มอบหมายงานแล้ว</MenuItem>
          <MenuItem value="in_progress">กำลังดำเนินการ</MenuItem>
          <MenuItem value="completed">เสร็จสิ้น</MenuItem>
        </TextField>
        <TextField select size="small" label="ประเภทปัญหา" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} sx={{ minWidth: 180, backgroundColor: 'white' }}>
          <MenuItem value="">ทั้งหมด</MenuItem>
          {REPAIR_CATEGORIES.map((c) => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
        </TextField>
      </Stack>

      {requests === null ? <Spinner /> : (
        <DataTable
          columns={columns} rows={requests} searchKeys={['id', 'title']}
          searchPlaceholder="ค้นหาด้วยหมายเลขคำขอหรือหัวข้อ"
          onRowClick={(row) => navigate(`/operator/requests/${row.id}`)}
        />
      )}
    </Box>
  )
}
