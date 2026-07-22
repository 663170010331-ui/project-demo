import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  TextField, Button, Typography, Box, Stack, Alert, InputAdornment, IconButton,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { ROLES } from '../../utils/constants.js'

const roleHome = { [ROLES.CITIZEN]: '/citizen', [ROLES.OPERATOR]: '/operator', [ROLES.TECHNICIAN]: '/technician' }

// This page is for STAFF only (Operator / Technician). Citizens never see a
// login form — they open the LINE OA directly (LIFF auto-identifies them),
// and can check their request status without any account via /check-status.
export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form)
      const from = location.state?.from?.pathname
      navigate(from || roleHome[user.role] || '/', { replace: true })
    } catch (err) {
      setError(err.message || 'เข้าสู่ระบบไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box sx={{ width: 40, height: 40, borderRadius: '12px', backgroundColor: '#eef4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BadgeRoundedIcon sx={{ color: '#2f63f6' }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={800}>เข้าสู่ระบบเจ้าหน้าที่</Typography>
          <Typography variant="body2" color="text.secondary">สำหรับหัวหน้าช่าง (Operator) และช่างซ่อม (Technician)</Typography>
        </Box>
      </Stack>

      {error && <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="ชื่อผู้ใช้" fullWidth required value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="เช่น operator1 หรือ tech1"
          />
          <TextField
            label="รหัสผ่าน" type={showPassword ? 'text' : 'password'} fullWidth required
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography component={Link} to="/forgot-password" variant="body2" sx={{ color: '#2f63f6', textDecoration: 'none', fontWeight: 600, alignSelf: 'flex-end' }}>
            ลืมรหัสผ่าน?
          </Typography>
          <Button type="submit" size="large" variant="contained" disabled={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </Button>
        </Stack>
      </Box>

      <Alert severity="info" variant="outlined" sx={{ mt: 3, borderRadius: 2, fontSize: 13 }}>
        Demo: <b>operator1</b> / <b>tech1</b> · รหัสผ่านอะไรก็ได้ (≥ 3 ตัวอักษร)
      </Alert>

      <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #eef1f7' }}>
        <Typography variant="body2" fontWeight={700} sx={{ mb: 1.5 }}>เป็นประชาชนใช่ไหม?</Typography>
        <Stack spacing={1.25}>
          <Button
            fullWidth variant="contained" startIcon={<ChatBubbleRoundedIcon />}
            sx={{ backgroundColor: '#06C755', '&:hover': { backgroundColor: '#05a648' } }}
            href="https://line.me/R/ti/p/@yourlineoa" target="_blank" rel="noopener"
          >
            แจ้งซ่อมผ่าน LINE OA
          </Button>
          <Button fullWidth variant="outlined" component={Link} to="/check-status" startIcon={<SearchRoundedIcon />}>
            ตรวจสอบสถานะ (ไม่ต้องเข้าสู่ระบบ)
          </Button>
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.25 }}>
          ประชาชนไม่ต้องสมัครสมาชิกหรือเข้าสู่ระบบ — เปิดจากเมนูใน LINE OA ได้ทันที
        </Typography>
      </Box>
    </Box>
  )
}