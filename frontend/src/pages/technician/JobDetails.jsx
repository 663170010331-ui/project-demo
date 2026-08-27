import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Box, Typography, Grid, Chip, Button, Stack, IconButton, CircularProgress, Alert } from '@mui/material'
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
  // Each item: { id, preview (local blob URL), url (real uploaded URL, null while uploading), uploading, error }
  const [afterImages, setAfterImages] = useState([])
  const [updating, setUpdating] = useState(false)

  const load = () => repairService.getById(id).then(setJob)
  useEffect(() => { load() }, [id])

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5 - afterImages.length)
    const newItems = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      preview: URL.createObjectURL(file),
      url: null,
      uploading: true,
      error: '',
    }))
    setAfterImages((prev) => [...prev, ...newItems].slice(0, 5))

    newItems.forEach((item, i) => {
      const file = files[i]
      repairService
        .uploadImage(file)
        .then((url) => {
          setAfterImages((prev) => prev.map((img) => (img.id === item.id ? { ...img, url, uploading: false } : img)))
        })
        .catch((err) => {
          const message = err?.response?.data?.message || 'อัปโหลดไม่สำเร็จ (ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต)'
          setAfterImages((prev) =>
            prev.map((img) => (img.id === item.id ? { ...img, uploading: false, error: message } : img))
          )
        })
    })
  }

  const removeAfterImage = (imgId) => {
    setAfterImages((prev) => {
      const target = prev.find((img) => img.id === imgId)
      if (target) URL.revokeObjectURL(target.preview)
      return prev.filter((img) => img.id !== imgId)
    })
  }

  const uploadingCount = afterImages.filter((img) => img.uploading).length

  const handleUpdateStatus = async () => {
    const next = nextStatusMap[job.status]
    if (!next) return
    setUpdating(true)
    try {
      // Only "completed" carries the after-repair photos — attach them here if any were uploaded.
      const imagesAfter = next === 'completed' ? afterImages.filter((img) => img.url).map((img) => img.url) : undefined
      await repairService.updateStatus(id, next, undefined, imagesAfter)
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

            {job.coords && (
              <Button
                variant="outlined" size="small" sx={{ mt: 1.5, borderRadius: 999 }}
                startIcon={<span role="img" aria-label="navigate">🧭</span>}
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${job.coords.lat},${job.coords.lng}`, '_blank')}
              >
                นำทางไปยังจุดเกิดเหตุ
              </Button>
            )}

            <Typography fontWeight={700} sx={{ mt: 3, mb: 1 }}>รูปภาพหลังซ่อม</Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              {afterImages.map((img) => (
                <Box key={img.id} sx={{ position: 'relative', width: 84, height: 84 }}>
                  <Box component="img" src={img.preview} sx={{ width: 84, height: 84, borderRadius: 3, objectFit: 'cover', opacity: img.uploading ? 0.5 : 1 }} />
                  {img.uploading && (
                    <CircularProgress size={22} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-11px', ml: '-11px' }} />
                  )}
                  {img.error && (
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 3, backgroundColor: 'rgba(220,38,38,0.15)' }}>
                      <Typography variant="caption" color="error" fontWeight={700} sx={{ textAlign: 'center', px: 0.5 }}>ล้มเหลว</Typography>
                    </Box>
                  )}
                  <IconButton size="small" onClick={() => removeAfterImage(img.id)} sx={{ position: 'absolute', top: -8, right: -8, backgroundColor: 'white', boxShadow: 1 }}>
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              {afterImages.length < 5 && (
                <Button component="label" sx={{ width: 84, height: 84, borderRadius: 3, border: '1px dashed #cbd5e1', flexDirection: 'column', gap: 0.5 }}>
                  <PhotoCameraRoundedIcon sx={{ color: '#94a3b8' }} />
                  <Typography variant="caption" color="text.secondary">เพิ่มรูป</Typography>
                  <input type="file" hidden accept="image/*" multiple onChange={handleImages} />
                </Button>
              )}
            </Stack>
            {afterImages.some((img) => img.error) && (
              <Stack spacing={0.5} sx={{ mt: 1 }}>
                {afterImages.filter((img) => img.error).map((img) => (
                  <Alert key={img.id} severity="error" sx={{ py: 0 }}>{img.error}</Alert>
                ))}
              </Stack>
            )}
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
                <Button fullWidth variant="contained" disabled={updating || uploadingCount > 0} onClick={handleUpdateStatus}>
                  {updating ? 'กำลังอัปเดต...' : uploadingCount > 0 ? `กำลังอัปโหลดรูป (${uploadingCount})...` : nextStatusButtonLabel[job.status]}
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