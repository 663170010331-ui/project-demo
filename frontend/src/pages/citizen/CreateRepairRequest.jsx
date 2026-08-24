import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, TextField, Button, Stack, ToggleButton, ToggleButtonGroup,
  IconButton, MenuItem, Alert, CircularProgress,
} from '@mui/material'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import LocationPicker from '../../components/LocationPicker.jsx'
import { REPAIR_CATEGORIES, PRIORITY_LEVELS, COMMUNITIES } from '../../utils/constants.js'
import { repairService } from '../../services/repairService.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useNotifications } from '../../contexts/NotificationContext.jsx'

export default function CreateRepairRequest() {
  const { user } = useAuth()
  const { notify } = useNotifications()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    category: 'electricity', title: '', description: '', reporterName: user?.name || '', location: '', community: '',
    priority: 'normal', contactPhone: user?.phone || '',
  })
  const [coords, setCoords] = useState(null) // { lat, lng }
  const [recenterTrigger, setRecenterTrigger] = useState(0) // bump this to pan the map (GPS button), not on manual pin drags/clicks
  const [geoError, setGeoError] = useState('')
  const [geoLoading, setGeoLoading] = useState(false)
  // Each item: { id, preview (local blob URL, for instant display), url (real
  // uploaded URL once done, null while uploading), uploading, error }
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5 - images.length)
    const newItems = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      preview: URL.createObjectURL(file),
      url: null,
      uploading: true,
      error: '',
    }))
    setImages((prev) => [...prev, ...newItems].slice(0, 5))

    // Upload each file to the backend right away so the request is ready to
    // submit as soon as the user finishes filling the form.
    newItems.forEach((item, i) => {
      const file = files[i]
      repairService
        .uploadImage(file)
        .then((url) => {
          setImages((prev) => prev.map((img) => (img.id === item.id ? { ...img, url, uploading: false } : img)))
        })
        .catch((err) => {
          const message = err?.response?.data?.message || 'อัปโหลดไม่สำเร็จ (ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต)'
          setImages((prev) =>
            prev.map((img) => (img.id === item.id ? { ...img, uploading: false, error: message } : img))
          )
        })
    })
  }

  const removeImage = (id) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id)
      if (target) URL.revokeObjectURL(target.preview)
      return prev.filter((img) => img.id !== id)
    })
  }

  const uploadingCount = images.filter((img) => img.uploading).length

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
        setRecenterTrigger((n) => n + 1)
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
    if (uploadingCount > 0) return // safety net — the submit button is disabled while this is true anyway
    setSubmitting(true)
    try {
      const uploadedUrls = images.filter((img) => img.url).map((img) => img.url)
      const created = await repairService.create({ ...form, coords, reporterId: user.id, images: uploadedUrls })
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
            label="ชื่อผู้แจ้ง / ผู้ประสบปัญหา" required fullWidth value={form.reporterName}
            onChange={(e) => setForm({ ...form, reporterName: e.target.value })}
            placeholder="ชื่อ-นามสกุล ของผู้ที่ประสบปัญหาจริง"
            helperText="กรณีแจ้งแทนผู้อื่น (เช่น ผู้สูงอายุที่บ้าน) กรุณาระบุชื่อของผู้ประสบปัญหาจริง ไม่ใช่ชื่อบัญชี LINE"
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
              {images.map((img) => (
                <Box key={img.id} sx={{ position: 'relative', width: 84, height: 84 }}>
                  <Box
                    component="img" src={img.preview}
                    sx={{ width: 84, height: 84, borderRadius: 3, objectFit: 'cover', opacity: img.uploading ? 0.5 : 1 }}
                  />
                  {img.uploading && (
                    <CircularProgress size={22} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-11px', ml: '-11px' }} />
                  )}
                  {img.error && (
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 3, backgroundColor: 'rgba(220,38,38,0.15)' }}>
                      <Typography variant="caption" color="error" fontWeight={700} sx={{ textAlign: 'center', px: 0.5 }}>ล้มเหลว</Typography>
                    </Box>
                  )}
                  <IconButton
                    size="small" onClick={() => removeImage(img.id)}
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
            <Typography variant="caption" color="text.secondary">สูงสุด 5 รูป (.jpg, .png, .webp — ไม่เกิน 10MB ต่อไฟล์)</Typography>
            {images.some((img) => img.error) && (
              <Stack spacing={0.5} sx={{ mt: 1 }}>
                {images.filter((img) => img.error).map((img) => (
                  <Alert key={img.id} severity="error" sx={{ py: 0 }}>{img.error}</Alert>
                ))}
              </Stack>
            )}
          </Box>

          <TextField
            label="ระบุตำแหน่ง / สถานที่เกิดเหตุ" fullWidth value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="เช่น อาคาร A ชั้น 3 ห้อง 301"
          />

          <Box>
            <Typography fontWeight={700} sx={{ mb: 1 }}>พิกัด (ถ้ามี)</Typography>
            <LocationPicker coords={coords} onChange={setCoords} recenterTrigger={recenterTrigger} height={260} />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              แตะบนแผนที่เพื่อปักหมุด หรือลากหมุดเพื่อปรับตำแหน่งให้ตรงจุด
            </Typography>

            {geoError && <Alert severity="warning" sx={{ mt: 1.5, borderRadius: 2 }}>{geoError}</Alert>}

            <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
              <Button
                variant="outlined" startIcon={geoLoading ? <CircularProgress size={16} /> : <MyLocationRoundedIcon />}
                onClick={handleShareLocation} disabled={geoLoading}
              >
                {geoLoading ? 'กำลังระบุตำแหน่ง...' : 'ใช้ตำแหน่งปัจจุบันของฉัน'}
              </Button>
              {coords && (
                <Button variant="text" color="error" startIcon={<DeleteOutlineRoundedIcon />} onClick={() => setCoords(null)}>
                  ลบพิกัด
                </Button>
              )}
            </Stack>
            {coords && (
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#64748b' }}>
                พิกัดที่เลือก: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
              </Typography>
            )}
          </Box>

          <TextField
            select label="ระดับความเร่งด่วน" fullWidth value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            {PRIORITY_LEVELS.map((p) => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
          </TextField>

          <TextField label="เบอร์ติดต่อกลับ" required fullWidth value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />

          <Button type="submit" size="large" variant="contained" disabled={submitting || uploadingCount > 0}>
            {submitting ? 'กำลังส่งคำขอ...' : uploadingCount > 0 ? `กำลังอัปโหลดรูป (${uploadingCount})...` : 'ส่งการแจ้งซ่อม'}
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}