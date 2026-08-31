import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Button, Chip, Stack, IconButton, Avatar, CircularProgress, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Alert,
} from '@mui/material'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import DataTable from '../../components/common/DataTable.jsx'
import { userService } from '../../services/userService.js'
import { useNotifications } from '../../contexts/NotificationContext.jsx'
import { REPAIR_CATEGORIES } from '../../utils/constants.js'

const roleLabel = { citizen: 'ประชาชน', operator: 'หัวหน้าช่าง', technician: 'ช่างซ่อม' }
const EMPTY_FORM = { role: 'technician', username: '', password: '', name: '', phone: '', email: '', specialty: '' }

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const { notify } = useNotifications()

  // Add/Edit share one dialog: editingUser === null means "creating new".
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    userService
      .list()
      .then(setUsers)
      .catch(() => notify('โหลดรายชื่อผู้ใช้ไม่สำเร็จ'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const toggleStatus = async (u) => {
    if (u.role === 'citizen') return
    try {
      await userService.toggleStatus(u.role, u.id)
      setUsers((prev) => prev.map((x) => (x.id === u.id && x.role === u.role ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x)))
      notify('อัปเดตสถานะผู้ใช้สำเร็จ')
    } catch {
      notify('อัปเดตสถานะไม่สำเร็จ')
    }
  }

  const openCreate = () => {
    setEditingUser(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setDialogOpen(true)
  }

  const openEdit = (u) => {
    setEditingUser(u)
    setForm({ role: u.role, username: u.username || '', password: '', name: u.name || '', phone: u.phone || '', email: u.email || '', specialty: u.specialty || '' })
    setFormError('')
    setDialogOpen(true)
  }

  const closeDialog = () => { if (!saving) setDialogOpen(false) }

  const submitForm = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.name.trim()) return setFormError('กรุณากรอกชื่อ-นามสกุล')
    if (!editingUser && (!form.username.trim() || !form.password)) return setFormError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน')
    if (!editingUser && form.password.length < 6) return setFormError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')

    setSaving(true)
    try {
      if (editingUser) {
        const payload = { name: form.name, phone: form.phone, email: form.email }
        if (editingUser.role === 'technician') payload.specialty = form.specialty
        const saved = await userService.update(editingUser.role, editingUser.id, payload)
        setUsers((prev) => prev.map((x) => (x.id === editingUser.id && x.role === editingUser.role ? { ...x, ...saved } : x)))
        notify('บันทึกข้อมูลผู้ใช้สำเร็จ')
      } else {
        const created = await userService.create(form)
        setUsers((prev) => [...prev, created])
        notify('เพิ่มผู้ใช้สำเร็จ')
      }
      setDialogOpen(false)
    } catch (err) {
      setFormError(err.response?.data?.message || 'บันทึกไม่สำเร็จ กรุณาลองใหม่')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await userService.remove(deleteTarget.role, deleteTarget.id)
      setUsers((prev) => prev.filter((x) => !(x.id === deleteTarget.id && x.role === deleteTarget.role)))
      notify('ลบผู้ใช้สำเร็จ')
      setDeleteTarget(null)
    } catch (err) {
      notify(err.response?.data?.message || 'ลบผู้ใช้ไม่สำเร็จ', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    {
      key: 'name', label: 'ชื่อผู้ใช้', sortable: true,
      render: (u) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#2f63f6', fontSize: 14 }}>{u.name?.[0] || '?'}</Avatar>
          <Box>
            <Typography fontWeight={600} fontSize={14}>{u.name}</Typography>
            <Typography variant="caption" color="text.secondary">{u.username || u.phone || '-'}</Typography>
          </Box>
        </Stack>
      ),
    },
    { key: 'role', label: 'บทบาท', render: (u) => <Chip size="small" label={roleLabel[u.role]} sx={{ backgroundColor: '#eef4ff', color: '#193bab', fontWeight: 700 }} /> },
    { key: 'email', label: 'อีเมล', render: (u) => u.email || '-' },
    {
      key: 'status', label: 'สถานะ',
      render: (u) =>
        u.role === 'citizen' ? (
          <Chip size="small" label="ประชาชน (LIFF)" sx={{ backgroundColor: '#f1f5f9', color: '#64748b', fontWeight: 700 }} />
        ) : (
          <Chip
            size="small" label={u.status === 'active' ? 'ใช้งาน' : 'ปิดใช้งาน'} onClick={() => toggleStatus(u)}
            sx={{ cursor: 'pointer', backgroundColor: u.status === 'active' ? '#e2f6ec' : '#f1f5f9', color: u.status === 'active' ? '#1aa768' : '#64748b', fontWeight: 700 }}
          />
        ),
    },
    {
      key: 'actions', label: '', render: (u) => (
        <Stack direction="row">
          <Tooltip title="แก้ไขข้อมูลผู้ใช้">
            <IconButton size="small" onClick={() => openEdit(u)}><EditRoundedIcon fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="ลบผู้ใช้">
            <IconButton size="small" onClick={() => setDeleteTarget(u)}><DeleteRoundedIcon fontSize="small" /></IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ]

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>จัดการผู้ใช้งาน</Typography>
          <Typography variant="body2" color="text.secondary">รายชื่อผู้ใช้จริงในระบบ (ประชาชน/หัวหน้าช่าง/ช่างซ่อม)</Typography>
        </Box>
        <Button variant="contained" startIcon={<PersonAddRoundedIcon />} onClick={openCreate}>เพิ่มผู้ใช้</Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
      ) : (
        <DataTable columns={columns} rows={users} searchKeys={['name', 'username', 'email']} searchPlaceholder="ค้นหาผู้ใช้..." />
      )}

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="xs" fullWidth>
        <Box component="form" onSubmit={submitForm}>
          <DialogTitle>{editingUser ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มผู้ใช้ใหม่'}</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ pt: 0.5 }}>
              {formError && <Alert severity="error">{formError}</Alert>}

              {!editingUser && (
                <TextField select label="บทบาท" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value, specialty: '' })} fullWidth>
                  <MenuItem value="technician">ช่างซ่อม</MenuItem>
                  <MenuItem value="operator">หัวหน้าช่าง</MenuItem>
                </TextField>
              )}

              {!editingUser && (
                <>
                  <TextField label="ชื่อผู้ใช้ (username)" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} fullWidth required />
                  <TextField label="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} fullWidth required />
                </>
              )}

              <TextField label="ชื่อ-นามสกุล" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth required />
              <TextField label="เบอร์โทรศัพท์" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} fullWidth />
              <TextField label="อีเมล" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth />

              {(editingUser ? editingUser.role : form.role) === 'technician' && (
                <TextField select label="ความเชี่ยวชาญ" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} fullWidth>
                  {REPAIR_CATEGORIES.map((c) => <MenuItem key={c.value} value={c.label}>{c.icon} {c.label}</MenuItem>)}
                </TextField>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={closeDialog} disabled={saving}>ยกเลิก</Button>
            <Button type="submit" variant="contained" disabled={saving}>{saving ? 'กำลังบันทึก...' : 'บันทึก'}</Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onClose={() => !deleting && setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>ยืนยันการลบผู้ใช้</DialogTitle>
        <DialogContent dividers>
          <Typography>
            ต้องการลบ <strong>{deleteTarget?.name}</strong> ({roleLabel[deleteTarget?.role]}) ใช่หรือไม่? การลบไม่สามารถย้อนกลับได้
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>ยกเลิก</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={deleting}>{deleting ? 'กำลังลบ...' : 'ลบผู้ใช้'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}