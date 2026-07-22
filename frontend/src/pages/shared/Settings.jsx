import React, { useState } from 'react'
import { Box, Typography, Stack, Switch, FormControlLabel, MenuItem, TextField, Divider } from '@mui/material'

export default function Settings() {
  const [settings, setSettings] = useState({ language: 'th', darkMode: false, emailNotif: true, lineNotif: true })

  const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }))

  return (
    <Box>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>ตั้งค่า</Typography>
      <Box className="card" sx={{ p: 3, maxWidth: 560 }}>
        <Typography fontWeight={700} sx={{ mb: 2 }}>ทั่วไป</Typography>
        <Stack spacing={2}>
          <TextField
            select label="ภาษา" value={settings.language}
            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
          >
            <MenuItem value="th">ไทย</MenuItem>
            <MenuItem value="en">English</MenuItem>
          </TextField>
          <FormControlLabel control={<Switch checked={settings.darkMode} onChange={() => toggle('darkMode')} />} label="โหมดมืด (Dark Mode)" />
        </Stack>
        <Divider sx={{ my: 3 }} />
        <Typography fontWeight={700} sx={{ mb: 2 }}>การแจ้งเตือน</Typography>
        <Stack spacing={1}>
          <FormControlLabel control={<Switch checked={settings.emailNotif} onChange={() => toggle('emailNotif')} />} label="แจ้งเตือนทางอีเมล" />
          <FormControlLabel control={<Switch checked={settings.lineNotif} onChange={() => toggle('lineNotif')} />} label="แจ้งเตือนผ่าน LINE" />
        </Stack>
      </Box>
    </Box>
  )
}
