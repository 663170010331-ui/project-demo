import React, { useState, useEffect } from 'react'
import { Box, Typography, Avatar, TextField, Button, Stack, Grid, Divider } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useNotifications } from '../../contexts/NotificationContext.jsx'
import { userService } from '../../services/userService.js'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const { notify } = useNotifications()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' })
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  // user loads from localStorage synchronously in almost every case, but if
  // this page is ever reached before that finishes, keep the form in sync
  // once it does instead of showing permanently-blank fields.
  useEffect(() => {
    setForm({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' })
  }, [user?.name, user?.phone, user?.email])

  const saveProfile = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      notify('กรุณากรอกชื่อ-นามสกุล', 'error')
      return
    }
    setSavingProfile(true)
    try {
      const saved = await userService.updateMe(form)
      updateUser({ name: saved.name, phone: saved.phone, email: saved.email })
      notify('บันทึกข้อมูลส่วนตัวสำเร็จ')
    } catch (err) {
      notify(err.response?.data?.message || 'บันทึกข้อมูลไม่สำเร็จ', 'error')
    } finally {
      setSavingProfile(false)
    }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    if (pw.next !== pw.confirm) {
      notify('รหัสผ่านใหม่ไม่ตรงกัน', 'error')
      return
    }
    setSavingPassword(true)
    try {
      await userService.changeMyPassword({ currentPassword: pw.current, newPassword: pw.next })
      setPw({ current: '', next: '', confirm: '' })
      notify('เปลี่ยนรหัสผ่านสำเร็จ')
    } catch (err) {
      notify(err.response?.data?.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ', 'error')
    } finally {
      setSavingPassword(false)
    }
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
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box className="card" sx={{ p: 3 }}>
            <Typography fontWeight={700} sx={{ mb: 2 }}>ข้อมูลส่วนตัว</Typography>
            <Box component="form" onSubmit={saveProfile}>
              <Stack spacing={2}>
                <TextField label="ชื่อ-นามสกุล" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth required />
                <TextField label="เบอร์โทรศัพท์" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} fullWidth />
                <TextField label="อีเมล" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth />
                <Box><Button type="submit" variant="contained" disabled={savingProfile}>{savingProfile ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</Button></Box>
              </Stack>
            </Box>
            {user?.role !== 'citizen' && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography fontWeight={700} sx={{ mb: 2 }}>เปลี่ยนรหัสผ่าน</Typography>
                <Box component="form" onSubmit={changePassword}>
                  <Stack spacing={2}>
                    <TextField label="รหัสผ่านปัจจุบัน" type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} fullWidth required />
                    <TextField label="รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)" type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} fullWidth required />
                    <TextField label="ยืนยันรหัสผ่านใหม่" type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} fullWidth required />
                    <Box><Button type="submit" variant="outlined" disabled={savingPassword}>{savingPassword ? 'กำลังบันทึก...' : 'เปลี่ยนรหัสผ่าน'}</Button></Box>
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