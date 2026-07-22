import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TextField, Button, Typography, Box, Stack, MenuItem, Alert } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { ROLES } from '../../utils/constants.js'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', username: '', phone: '', password: '', confirmPassword: '', role: ROLES.CITIZEN })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน')
      return
    }
    setLoading(true)
    try {
      const user = await register(form)
      navigate(user.role === ROLES.CITIZEN ? '/citizen' : '/login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={800}>ลงทะเบียนผู้ใช้งาน</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        สร้างบัญชีเพื่อเริ่มแจ้งปัญหาสาธารณูปโภคในพื้นที่ของคุณ
      </Typography>

      {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Stack spacing={2}>
          <TextField label="ชื่อ-นามสกุล" required fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="ชื่อผู้ใช้" required fullWidth value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <TextField label="เบอร์โทรศัพท์" required fullWidth value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <TextField select label="ประเภทผู้ใช้" fullWidth value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <MenuItem value={ROLES.CITIZEN}>ประชาชน (ผู้แจ้งซ่อม)</MenuItem>
            <MenuItem value={ROLES.OPERATOR}>หัวหน้าช่าง (Operator)</MenuItem>
            <MenuItem value={ROLES.TECHNICIAN}>ช่างซ่อม (Technician)</MenuItem>
          </TextField>
          <TextField label="รหัสผ่าน" type="password" required fullWidth value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <TextField label="ยืนยันรหัสผ่าน" type="password" required fullWidth value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          <Button type="submit" size="large" variant="contained" disabled={loading}>
            {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
          </Button>
        </Stack>
      </Box>

      <Typography variant="body2" align="center" sx={{ mt: 3 }} color="text.secondary">
        มีบัญชีอยู่แล้ว?{' '}
        <Typography component={Link} to="/login" variant="body2" sx={{ color: '#2f63f6', fontWeight: 700, textDecoration: 'none' }}>
          เข้าสู่ระบบ
        </Typography>
      </Typography>
    </Box>
  )
}
