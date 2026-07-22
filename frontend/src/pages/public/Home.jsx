import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Box, Typography, Button, Grid, Stack } from '@mui/material'
import ElectricBoltRoundedIcon from '@mui/icons-material/ElectricBoltRounded'
import WaterDropRoundedIcon from '@mui/icons-material/WaterDropRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded'

const features = [
  { icon: <BoltRoundedIcon />, title: 'แจ้งซ่อมง่ายผ่าน LINE', desc: 'ส่งข้อความ รูปภาพ และพิกัด ได้ในแชทเดียว ไม่ต้องโทรศัพท์หรือกรอกแบบฟอร์มกระดาษ' },
  { icon: <TimelineRoundedIcon />, title: 'ติดตามสถานะแบบเรียลไทม์', desc: 'รู้ทุกขั้นตอนตั้งแต่แจ้งซ่อม มอบหมายงาน จนถึงซ่อมเสร็จสมบูรณ์' },
  { icon: <ElectricBoltRoundedIcon />, title: 'มอบหมายงานอัตโนมัติ', desc: 'เจ้าหน้าที่จัดคิวงานและมอบหมายช่างเทคนิคที่เหมาะสมได้ทันที' },
  { icon: <WaterDropRoundedIcon />, title: 'รายงานผลครบวงจร', desc: 'สรุปสถิติงานซ่อมรายวัน รายเดือน เพื่อวางแผนบำรุงรักษาต่อไป' },
]

export default function Home() {
  return (
    <Box>
      <Box sx={{ background: 'linear-gradient(160deg, #eef4ff 0%, #f4f6fb 60%, #ffffff 100%)', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="overline" color="primary" fontWeight={700}>เทศบาลตำบลสงเปลือย</Typography>
              <Typography variant="h3" fontWeight={800} sx={{ mt: 1, lineHeight: 1.25 }}>
                แจ้งซ่อมสาธารณูปโภค<br />ง่าย รวดเร็ว ผ่าน LINE
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 520 }}>
                แจ้งปัญหาไฟฟ้า ประปา ถนน และสาธารณูปโภคอื่นๆ ได้ทุกที่ทุกเวลา
                พร้อมติดตามสถานะการซ่อมได้แบบเรียลไทม์ ไม่ต้องรอสายโทรศัพท์อีกต่อไป
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Button component={Link} to="/register" size="large" variant="contained">เริ่มแจ้งปัญหา</Button>
                <Button component={Link} to="/login" size="large" variant="outlined">เข้าสู่ระบบ</Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box className="card" sx={{ p: 3 }}>
                <Stack spacing={2}>
                  {['ไฟฟ้าดับหน้าซอย...', 'ท่อประปาแตก...', 'ไฟถนนดับ 5 จุด...'].map((t, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 3, backgroundColor: '#f8fafc' }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2f63f6' }} />
                      <Typography variant="body2" fontWeight={600}>{t}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h4" fontWeight={800} textAlign="center">ทำไมต้องใช้ระบบนี้</Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {features.map((f) => (
            <Grid item xs={12} sm={6} md={3} key={f.title}>
              <Box className="card card-hover" sx={{ p: 3, height: '100%' }}>
                <Box sx={{ color: '#2f63f6', mb: 1.5, fontSize: 30 }}>{f.icon}</Box>
                <Typography fontWeight={700}>{f.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{f.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
