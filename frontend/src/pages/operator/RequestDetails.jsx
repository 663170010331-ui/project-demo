import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Box, Typography, Grid, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  RadioGroup, FormControlLabel, Radio, ToggleButtonGroup, ToggleButton, TextField, Stack,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import dayjs from 'dayjs'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import RepairTimeline from '../../components/common/RepairTimeline.jsx'
import { Spinner } from '../../components/common/LoadingState.jsx'
import { REPAIR_CATEGORIES, PRIORITY_LEVELS } from '../../utils/constants.js'
import { repairService } from '../../services/repairService.js'
import { useNotifications } from '../../contexts/NotificationContext.jsx'

export default function RequestDetails() {
  const { id } = useParams()
  const { notify } = useNotifications()
  const [request, setRequest] = useState(null)
  const [technicians, setTechnicians] = useState([])
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedTech, setSelectedTech] = useState('')
  const [priority, setPriority] = useState('normal')
  const [note, setNote] = useState('')

  const load = () => repairService.getById(id).then((r) => { setRequest(r); setPriority(r.priority) })

  useEffect(() => { load(); repairService.listTechnicians().then(setTechnicians) }, [id])

  const handleAssign = async () => {
    await repairService.assignTechnician(id, Number(selectedTech), priority)
    notify('มอบหมายงานสำเร็จ')
    setAssignOpen(false)
    load()
  }

  if (!request) return <Spinner />

  const category = REPAIR_CATEGORIES.find((c) => c.value === request.category)
  const assignedTech = technicians.find((t) => t.id === request.technicianId)

  return (
    <Box>
      <Button component={Link} to="/operator/requests" startIcon={<ArrowBackRoundedIcon />} sx={{ mb: 2 }}>กลับไปรายการคำขอ</Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box className="card" sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>{request.id}</Typography>
                <Typography variant="h6" fontWeight={800}>{request.title}</Typography>
              </Box>
              <StatusBadge status={request.status} />
            </Stack>
            <Stack direction="row" spacing={1} sx={{ my: 2 }}>
              <Chip label={category?.label} sx={{ backgroundColor: '#f1f5f9' }} />
              <Chip label={PRIORITY_LEVELS.find((p) => p.value === request.priority)?.label} color={PRIORITY_LEVELS.find((p) => p.value === request.priority)?.color} variant="outlined" />
            </Stack>
            <Typography color="text.secondary">{request.description}</Typography>
            <Typography variant="body2" sx={{ mt: 2 }}><b>ตำแหน่ง:</b> {request.location}</Typography>
            <Typography variant="body2"><b>แจ้งเมื่อ:</b> {dayjs(request.createdAt).format('D MMM YYYY HH:mm')}</Typography>

            {request.images?.length > 0 && (
              <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                {request.images.map((src, i) => (
                  <Box key={i} component="img" src={src} sx={{ width: 90, height: 90, borderRadius: 2, objectFit: 'cover' }} />
                ))}
              </Stack>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box className="card" sx={{ p: 3, mb: 2 }}>
            <Typography fontWeight={700} sx={{ mb: 1.5 }}>สถานะงาน</Typography>
            <RepairTimeline status={request.status} />
          </Box>
          <Box className="card" sx={{ p: 3 }}>
            <Typography fontWeight={700} sx={{ mb: 1.5 }}>ช่างผู้รับผิดชอบ</Typography>
            {assignedTech ? (
              <Box>
                <Typography fontWeight={600}>{assignedTech.name}</Typography>
                <Typography variant="body2" color="text.secondary">{assignedTech.phone} · {assignedTech.specialty}</Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">ยังไม่ได้มอบหมายงาน</Typography>
            )}
            <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={() => setAssignOpen(true)}>
              {assignedTech ? 'มอบหมายงานใหม่' : 'มอบหมายงานให้ช่าง'}
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>มอบหมายงานซ่อม</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>เลือกช่าง</Typography>
          <RadioGroup value={selectedTech} onChange={(e) => setSelectedTech(e.target.value)}>
            {technicians.map((t) => (
              <FormControlLabel
                key={t.id} value={String(t.id)} control={<Radio />}
                label={
                  <Box>
                    <Typography fontWeight={600}>{t.name}</Typography>
                    <Typography variant="caption" color="text.secondary">ช่าง{t.specialty} | {t.phone}</Typography>
                  </Box>
                }
                sx={{ border: '1px solid #e2e8f0', borderRadius: 2, mx: 0, mb: 1, px: 1.5, py: 0.5 }}
              />
            ))}
          </RadioGroup>

          <Typography variant="body2" fontWeight={700} sx={{ mt: 2, mb: 1 }}>ความสำคัญ</Typography>
          <ToggleButtonGroup value={priority} exclusive onChange={(_, v) => v && setPriority(v)} size="small" sx={{ flexWrap: 'wrap', gap: 1 }}>
            {PRIORITY_LEVELS.map((p) => <ToggleButton key={p.value} value={p.value} sx={{ borderRadius: '10px !important' }}>{p.label}</ToggleButton>)}
          </ToggleButtonGroup>

          <TextField fullWidth multiline minRows={2} label="หมายเหตุ (ถ้ามี)" sx={{ mt: 2 }} value={note} onChange={(e) => setNote(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAssignOpen(false)}>ยกเลิก</Button>
          <Button variant="contained" disabled={!selectedTech} onClick={handleAssign}>มอบหมายงาน</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
