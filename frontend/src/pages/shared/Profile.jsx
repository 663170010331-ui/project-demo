import React, { useState } from 'react'
import { Box, Typography, Avatar, TextField, Button, Stack, Grid, Divider, Alert } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useNotifications } from '../../contexts/NotificationContext.jsx'

export default function Profile() {
  const { user } = useAuth()
  const { notify } = useNotifications()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' })
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })

  const saveProfile = (e) => {
    e.preventDefault()
    notify('บันทึกข้อมูลส่วนตัวสำเร็จ')
  }

  const changePassword = (e) => {
    e.preventDefault()
    if (pw.next !== pw.confirm) {
      notify('รหัสผ่านใหม่ไม่ตรงกัน', 'error')
      return
    }
    setPw({ current: '', next: '', confirm: '' })
    notify('เปลี่ยนรหัสผ่านสำเร็จ')
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>โปรไฟล์ของฉัน</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box className="card" sx={{ p: 3, textAlign: 'center' }}>
            <Avatar sx={{ width: 84, height: 84, mx: 'auto', bgcolor: '#2f63f6', fontSize: 32 }}>{user?.name?.[0]}</Avatar>
            <Typography fontWeight={700} sx={{ mt: 2 }}>{user?.name}</Typography>
            <Typography variant="body2" color="text.secondary">{user?.username}</Typography>
            <Button size="small" variant="outlined" sx={{ mt: 2 }}>เปลี่ยนรูปโปรไฟล์</Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box className="card" sx={{ p: 3 }}>
            <Typography fontWeight={700} sx={{ mb: 2 }}>ข้อมูลส่วนตัว</Typography>
            <Box component="form" onSubmit={saveProfile}>
              <Stack spacing={2}>
                <TextField label="ชื่อ-นามสกุล" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
                <TextField label="เบอร์โทรศัพท์" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} fullWidth />
                <TextField label="อีเมล" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth />
                <Box><Button type="submit" variant="contained">บันทึกข้อมูล</Button></Box>
              </Stack>
            </Box>
            {user?.role !== 'citizen' && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography fontWeight={700} sx={{ mb: 2 }}>เปลี่ยนรหัสผ่าน</Typography>
                <Box component="form" onSubmit={changePassword}>
                  <Stack spacing={2}>
                    <TextField label="รหัสผ่านปัจจุบัน" type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} fullWidth />
                    <TextField label="รหัสผ่านใหม่" type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} fullWidth />
                    <TextField label="ยืนยันรหัสผ่านใหม่" type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} fullWidth />
                    <Box><Button type="submit" variant="outlined">เปลี่ยนรหัสผ่าน</Button></Box>
                  </Stack>
                </Box>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}