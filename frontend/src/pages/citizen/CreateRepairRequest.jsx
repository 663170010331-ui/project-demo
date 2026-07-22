import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, TextField, Button, Stack, ToggleButton, ToggleButtonGroup,
  IconButton, MenuItem, Alert, CircularProgress,
} from '@mui/material'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded'
import RoomRoundedIcon from '@mui/icons-material/RoomRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import { REPAIR_CATEGORIES, PRIORITY_LEVELS, COMMUNITIES } from '../../utils/constants.js'
import { repairService } from '../../services/repairService.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useNotifications } from '../../contexts/NotificationContext.jsx'

export default function CreateRepairRequest() {
  const { user } = useAuth()
  const { notify } = useNotifications()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    category: 'electricity', title: '', description: '', location: '', community: '',
    priority: 'normal', contactPhone: user?.phone || '',
  })
  const [coords, setCoords] = useState(null) // { lat, lng }
  const [geoError, setGeoError] = useState('')
  const [geoLoading, setGeoLoading] = useState(false)
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5 - images.length)
    const previews = files.map((f) => URL.createObjectURL(f))
    setImages((prev) => [...prev, ...previews].slice(0, 5))
  }

  // Real browser geolocation — works inside LINE LIFF's in-app browser too.
  const handleShareLocation = () => {
    setGeoError('')
    if (!navigator.geolocation) {
      setGeoError('อุปกรณ์นี้ไม่รองรับการระบุตำแหน่ง')
      return
    }
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGeoLoading(false)
      },
      (err) => {
        setGeoError(
          err.code === err.PERMISSION_DENIED
            ? 'กรุณาเปิดการเข้าถึงตำแหน่ง (GPS) บนอุปกรณ์ของท่านด้วย'
            : 'ไม่สามารถระบุตำแหน่งได้ กรุณาลองใหม่'
        )
        setGeoLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const created = await repairService.create({ ...form, coords, reporterId: user.id, images })
      notify(`แจ้งซ่อมสำเร็จ หมายเลขคำขอ ${created.id}`)
      navigate('/citizen/track')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Typography variant="h5" fontWeight={800}>แจ้งปัญหาสาธารณูปโภค</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>กรุณากรอกข้อมูลให้ครบถ้วนเพื่อให้เจ้าหน้าที่ดำเนินการได้รวดเร็ว</Typography>

      <Box component="form" onSubmit={handleSubmit} className="card" sx={{ p: 3 }}>
        <Typography fontWeight={700} sx={{ mb: 1.5 }}>เลือกประเภทปัญหา *</Typography>
        <ToggleButtonGroup
          value={form.category} exclusive onChange={(_, v) => v && setForm({ ...form, category: v })}
          sx={{ flexWrap: 'wrap', gap: 1, mb: 3, '& .MuiToggleButton-root': { borderRadius: '12px !important', border: '1px solid #e2e8f0 !important', px: 2 } }}
        >
          {REPAIR_CATEGORIES.map((c) => (
            <ToggleButton key={c.value} value={c.value}>
              <span style={{ marginRight: 6 }}>{c.icon}</span>{c.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Stack spacing={2.5}>
          <TextField label="หัวข้อปัญหา" required fullWidth value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="เช่น ไฟฟ้าดับหน้าซอย" />
          <TextField
            label="อธิบายปัญหาที่พบ" required fullWidth multiline minRows={3} value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="เช่น ไฟดับตั้งแต่ 3 อาคาร A ห้อง 301 ไม่สามารถใช้งานได้ตั้งแต่เช้า"
          />

          <TextField
            select label="ชุมชนของผู้แจ้ง (ถ้ามี)" fullWidth value={form.community}
            onChange={(e) => setForm({ ...form, community: e.target.value })}
          >
            <MenuItem value="">-- เลือกชุมชน (ถ้ามี) --</MenuItem>
            {COMMUNITIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>

          <Box>
            <Typography fontWeight={700} sx={{ mb: 1 }}>แนบรูปภาพ (ไม่บังคับ)</Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              {images.map((src, i) => (
                <Box key={i} sx={{ position: 'relative', width: 84, height: 84 }}>
                  <Box component="img" src={src} sx={{ width: 84, height: 84, borderRadius: 3, objectFit: 'cover' }} />
                  <IconButton
                    size="small" onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    sx={{ position: 'absolute', top: -8, right: -8, backgroundColor: 'white', boxShadow: 1, '&:hover': { backgroundColor: '#fee2e2' } }}
                  >
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              {images.length < 5 && (
                <Button component="label" sx={{ width: 84, height: 84, borderRadius: 3, border: '1px dashed #cbd5e1', flexDirection: 'column', gap: 0.5 }}>
                  <PhotoCameraRoundedIcon sx={{ color: '#94a3b8' }} />
                  <Typography variant="caption" color="text.secondary">เพิ่มรูป</Typography>
                  <input type="file" hidden accept="image/*" multiple onChange={handleImages} />
                </Button>
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary">สูงสุด 5 รูป (.jpg, .png)</Typography>
          </Box>

          <TextField
            label="ระบุตำแหน่ง / สถานที่เกิดเหตุ" fullWidth value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="เช่น อาคาร A ชั้น 3 ห้อง 301"
          />

          <Box>
            <Typography fontWeight={700} sx={{ mb: 1 }}>พิกัด (ถ้ามี)</Typography>
            <Box
              sx={{
                height: 160, borderRadius: 3, backgroundColor: '#f1f5f9', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', color: '#64748b', gap: 0.5, position: 'relative',
              }}
            >
              {coords ? (
                <>
                  <RoomRoundedIcon sx={{ color: '#e0413f', fontSize: 32 }} />
                  <Typography variant="body2" fontWeight={700}>
                    {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                  </Typography>
                  <Typography variant="caption">ปักหมุดจากตำแหน่งปัจจุบันของคุณ</Typography>
                </>
              ) : (
                <Typography variant="body2">ยังไม่ได้ระบุพิกัด — แผนที่ Google Maps (เชื่อมต่อภายหลัง)</Typography>
              )}
            </Box>

            {geoError && <Alert severity="warning" sx={{ mt: 1.5, borderRadius: 2 }}>{geoError}</Alert>}

            <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
              <Button
                variant="outlined" startIcon={geoLoading ? <CircularProgress size={16} /> : <MyLocationRoundedIcon />}
                onClick={handleShareLocation} disabled={geoLoading}
              >
                {geoLoading ? 'กำลังระบุตำแหน่ง...' : 'แชร์ตำแหน่งที่ตั้งปัจจุบัน'}
              </Button>
              {coords && (
                <Button variant="text" color="error" startIcon={<DeleteOutlineRoundedIcon />} onClick={() => setCoords(null)}>
                  ลบพิกัด
                </Button>
              )}
            </Stack>
          </Box>

          <TextField
            select label="ระดับความเร่งด่วน" fullWidth value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            {PRIORITY_LEVELS.map((p) => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
          </TextField>

          <TextField label="เบอร์ติดต่อกลับ" required fullWidth value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />

          <Button type="submit" size="large" variant="contained" disabled={submitting}>
            {submitting ? 'กำลังส่งคำขอ...' : 'ส่งการแจ้งซ่อม'}
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}