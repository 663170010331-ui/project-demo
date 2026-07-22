import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Box, Typography, Grid, Chip, Button, Stack, IconButton } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import dayjs from 'dayjs'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import RepairTimeline from '../../components/common/RepairTimeline.jsx'
import { Spinner } from '../../components/common/LoadingState.jsx'
import { REPAIR_CATEGORIES } from '../../utils/constants.js'
import { repairService } from '../../services/repairService.js'
import { useNotifications } from '../../contexts/NotificationContext.jsx'

const nextStatusMap = { assigned: 'in_progress', in_progress: 'completed' }
const nextStatusButtonLabel = { assigned: 'เริ่มดำเนินการ', in_progress: 'ยืนยันซ่อมเสร็จ' }

export default function JobDetails() {
  const { id } = useParams()
  const { notify } = useNotifications()
  const [job, setJob] = useState(null)
  const [afterImages, setAfterImages] = useState([])
  const [updating, setUpdating] = useState(false)

  const load = () => repairService.getById(id).then(setJob)
  useEffect(() => { load() }, [id])

  const handleImages = (e) => {
    const files = Array.from(e.target.files || [])
    setAfterImages((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))].slice(0, 5))
  }

  const handleUpdateStatus = async () => {
    const next = nextStatusMap[job.status]
    if (!next) return
    setUpdating(true)
    try {
      await repairService.updateStatus(id, next)
      notify(next === 'completed' ? 'ยืนยันงานซ่อมเสร็จสมบูรณ์แล้ว' : 'เริ่มดำเนินการซ่อมแล้ว')
      load()
    } finally {
      setUpdating(false)
    }
  }

  const handleReject = async () => {
    await repairService.updateStatus(id, 'reported')
    notify('ปฏิเสธงานเรียบร้อยแล้ว รอหัวหน้าช่างมอบหมายใหม่', 'info')
    load()
  }

  if (!job) return <Spinner />

  return (
    <Box>
      <Button component={Link} to="/technician/jobs" startIcon={<ArrowBackRoundedIcon />} sx={{ mb: 2 }}>กลับไปรายการงาน</Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box className="card" sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>{job.id}</Typography>
                <Typography variant="h6" fontWeight={800}>{job.title}</Typography>
              </Box>
              <StatusBadge status={job.status} />
            </Stack>
            <Chip size="small" label={REPAIR_CATEGORIES.find((c) => c.value === job.category)?.label} sx={{ backgroundColor: '#f1f5f9', my: 1.5 }} />
            <Typography color="text.secondary">{job.description}</Typography>
            <Typography variant="body2" sx={{ mt: 2 }}><b>ตำแหน่ง:</b> {job.location}</Typography>
            <Typography variant="body2"><b>แจ้งเมื่อ:</b> {dayjs(job.createdAt).format('D MMM YYYY HH:mm')}</Typography>

            <Typography fontWeight={700} sx={{ mt: 3, mb: 1 }}>รูปภาพหลังซ่อม</Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              {afterImages.map((src, i) => (
                <Box key={i} sx={{ position: 'relative', width: 84, height: 84 }}>
                  <Box component="img" src={src} sx={{ width: 84, height: 84, borderRadius: 3, objectFit: 'cover' }} />
                  <IconButton size="small" onClick={() => setAfterImages(afterImages.filter((_, idx) => idx !== i))} sx={{ position: 'absolute', top: -8, right: -8, backgroundColor: 'white', boxShadow: 1 }}>
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              <Button component="label" sx={{ width: 84, height: 84, borderRadius: 3, border: '1px dashed #cbd5e1', flexDirection: 'column', gap: 0.5 }}>
                <PhotoCameraRoundedIcon sx={{ color: '#94a3b8' }} />
                <Typography variant="caption" color="text.secondary">เพิ่มรูป</Typography>
                <input type="file" hidden accept="image/*" multiple onChange={handleImages} />
              </Button>
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box className="card" sx={{ p: 3, mb: 2 }}>
            <Typography fontWeight={700} sx={{ mb: 1.5 }}>ความคืบหน้า</Typography>
            <RepairTimeline status={job.status} />
          </Box>

          <Box className="card" sx={{ p: 3 }}>
            <Typography fontWeight={700} sx={{ mb: 1.5 }}>การดำเนินการ</Typography>
            <Stack spacing={1.25}>
              {nextStatusMap[job.status] && (
                <Button fullWidth variant="contained" disabled={updating} onClick={handleUpdateStatus}>
                  {updating ? 'กำลังอัปเดต...' : nextStatusButtonLabel[job.status]}
                </Button>
              )}
              {job.status === 'assigned' && (
                <Button fullWidth variant="outlined" color="error" onClick={handleReject}>ปฏิเสธงาน</Button>
              )}
              {job.status === 'completed' && (
                <Typography variant="body2" color="success.main" fontWeight={700} sx={{ textAlign: 'center' }}>
                  งานนี้เสร็จสมบูรณ์แล้ว ✅
                </Typography>
              )}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
