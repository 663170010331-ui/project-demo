import React, { useState } from 'react'
import { Container, Box, Typography, TextField, Button, Stack, Alert, InputAdornment } from '@mui/material'
import TagRoundedIcon from '@mui/icons-material/TagRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import RepairTimeline from '../../components/common/RepairTimeline.jsx'
import { repairService } from '../../services/repairService.js'
import { REPAIR_CATEGORIES } from '../../utils/constants.js'
import dayjs from 'dayjs'

// Public page — no login required. Mirrors the "ตรวจสอบสถานะ" flow used by
// real municipality complaint systems: anyone with the tracking code (the
// request ID sent back after submitting) can check progress.
export default function CheckStatus() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    if (!code.trim()) return
    setLoading(true)
    try {
      const found = await repairService.getById(code.trim().toUpperCase())
      setResult(found)
    } catch {
      setError('ไม่พบรหัสติดตามนี้ในระบบ กรุณาตรวจสอบอีกครั้ง')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setCode(''); setResult(null); setError('') }

  return (
    <Box sx={{ background: 'linear-gradient(160deg, #eef4ff 0%, #f4f6fb 60%, #ffffff 100%)', minHeight: 'calc(100vh - 64px)', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="sm">
        <Box className="card" sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#eef4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
              <SearchRoundedIcon sx={{ color: '#2f63f6', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" fontWeight={800}>ติดตามสถานะการแจ้งซ่อม</Typography>
            <Typography variant="body2" color="text.secondary">กรอกรหัสติดตามที่ได้รับหลังแจ้งซ่อมเพื่อดูสถานะ</Typography>
          </Box>

          <Box component="form" onSubmit={handleSearch}>
            <TextField
              fullWidth value={code} onChange={(e) => setCode(e.target.value)}
              placeholder="รหัสติดตาม เช่น SR2026-045"
              InputProps={{ startAdornment: <InputAdornment position="start"><TagRoundedIcon /></InputAdornment> }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              กรอกได้เฉพาะตัวเลขหรืออักษรภาษาอังกฤษ (ไม่เว้นวรรค)
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" startIcon={<SearchRoundedIcon />} disabled={loading}>
                {loading ? 'กำลังค้นหา...' : 'ค้นหา'}
              </Button>
              <Button variant="outlined" startIcon={<RestartAltRoundedIcon />} onClick={reset}>ล้างค่า</Button>
            </Stack>
          </Box>

          {error && <Alert severity="warning" sx={{ mt: 3, borderRadius: 2 }}>{error}</Alert>}

          {result && (
            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #f1f5f9' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>{result.id}</Typography>
                  <Typography variant="h6" fontWeight={800}>{result.title}</Typography>
                </Box>
                <StatusBadge status={result.status} />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                {REPAIR_CATEGORIES.find((c) => c.value === result.category)?.label} · แจ้งเมื่อ {dayjs(result.createdAt).format('D MMM YYYY HH:mm')}
              </Typography>
              <RepairTimeline status={result.status} />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  )
}