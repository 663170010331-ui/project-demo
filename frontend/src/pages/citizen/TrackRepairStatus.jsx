import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Grid, TextField, InputAdornment, Chip, Dialog, DialogContent, DialogTitle, IconButton,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import dayjs from 'dayjs'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import RepairTimeline from '../../components/common/RepairTimeline.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { Spinner } from '../../components/common/LoadingState.jsx'
import { REPAIR_CATEGORIES } from '../../utils/constants.js'
import { repairService } from '../../services/repairService.js'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function TrackRepairStatus() {
  const { user } = useAuth()
  const [requests, setRequests] = useState(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    repairService.list({ reporterId: user.id, search }).then(setRequests)
  }, [user.id, search])

  const categoryLabel = (val) => REPAIR_CATEGORIES.find((c) => c.value === val)?.label || val

  return (
    <Box>
      <Typography variant="h5" fontWeight={800}>ติดตามสถานะการแจ้งซ่อม</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>ตรวจสอบความคืบหน้าของคำขอแจ้งซ่อมทั้งหมดของคุณ</Typography>

      <TextField
        fullWidth placeholder="ค้นหาด้วยหมายเลขคำขอ หรือหัวข้อปัญหา" value={search} onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, backgroundColor: 'white', borderRadius: 2 }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }}
      />

      {requests === null ? (
        <Spinner />
      ) : requests.length === 0 ? (
        <EmptyState title="ไม่พบรายการแจ้งซ่อม" description="ลองค้นหาด้วยคำอื่น หรือแจ้งปัญหาใหม่" />
      ) : (
        <Grid container spacing={2}>
          {requests.map((r) => (
            <Grid item xs={12} md={6} key={r.id}>
              <Box className="card card-hover" sx={{ p: 2.5, cursor: 'pointer' }} onClick={() => setSelected(r)}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>{r.id}</Typography>
                  <StatusBadge status={r.status} />
                </Box>
                <Typography fontWeight={700} sx={{ mt: 0.5 }}>{r.title}</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip size="small" label={categoryLabel(r.category)} sx={{ backgroundColor: '#f1f5f9' }} />
                  <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                    {dayjs(r.createdAt).format('D MMM YYYY HH:mm')}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="xs" fullWidth>
        {selected && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              รายละเอียดสถานะ
              <IconButton onClick={() => setSelected(null)}><CloseRoundedIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="caption" color="text.secondary">{selected.id}</Typography>
              <Typography fontWeight={700} sx={{ mb: 2 }}>{selected.title}</Typography>
              <RepairTimeline status={selected.status} />

              {selected.status === 'completed' && selected.imagesAfter?.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography fontWeight={700} sx={{ mb: 1 }}>รูปภาพหลังซ่อมเสร็จ</Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    {selected.imagesAfter.map((url) => (
                      <Box
                        key={url} component="img" src={url}
                        sx={{ width: 96, height: 96, borderRadius: 3, objectFit: 'cover', border: '1px solid #e2e8f0' }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  )
}