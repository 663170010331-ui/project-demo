import React, { useEffect, useState } from 'react'
import { Box, Typography, Button, Chip, Stack, IconButton, Avatar, CircularProgress, Tooltip } from '@mui/material'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import DataTable from '../../components/common/DataTable.jsx'
import { userService } from '../../services/userService.js'
import { useNotifications } from '../../contexts/NotificationContext.jsx'

const roleLabel = { citizen: 'ประชาชน', operator: 'หัวหน้าช่าง', technician: 'ช่างซ่อม' }

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const { notify } = useNotifications()

  const load = () => {
    setLoading(true)
    userService
      .list()
      .then(setUsers)
      .catch(() => notify('โหลดรายชื่อผู้ใช้ไม่สำเร็จ'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  // Citizens (tb_user) have no status column on the backend — toggling their
  // status isn't supported, so this is disabled for role === 'citizen' to
  // avoid accidentally hitting the wrong table (see userService.js note).
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
      key: 'actions', label: '', render: () => (
        <Stack direction="row">
          <Tooltip title="แก้ไขข้อมูลผู้ใช้ — เร็วๆ นี้">
            <span><IconButton size="small" disabled><EditRoundedIcon fontSize="small" /></IconButton></span>
          </Tooltip>
          <Tooltip title="ลบผู้ใช้ — เร็วๆ นี้">
            <span><IconButton size="small" disabled><DeleteRoundedIcon fontSize="small" /></IconButton></span>
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
        <Tooltip title="เพิ่มผู้ใช้ — เร็วๆ นี้">
          <span><Button variant="contained" startIcon={<PersonAddRoundedIcon />} disabled>เพิ่มผู้ใช้</Button></span>
        </Tooltip>
      </Stack>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
      ) : (
        <DataTable columns={columns} rows={users} searchKeys={['name', 'username', 'email']} searchPlaceholder="ค้นหาผู้ใช้..." />
      )}
    </Box>
  )
}