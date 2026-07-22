import React, { useState } from 'react'
import { Box, Typography, Button, Chip, Stack, IconButton, Avatar } from '@mui/material'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import DataTable from '../../components/common/DataTable.jsx'
import { mockUsers } from '../../services/mock/mockData.js'
import { useNotifications } from '../../contexts/NotificationContext.jsx'

const roleLabel = { citizen: 'ประชาชน', operator: 'หัวหน้าช่าง', technician: 'ช่างซ่อม' }

export default function ManageUsers() {
  const [users, setUsers] = useState(mockUsers)
  const { notify } = useNotifications()

  const toggleStatus = (id) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u)))
    notify('อัปเดตสถานะผู้ใช้สำเร็จ')
  }

  const removeUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
    notify('ลบผู้ใช้เรียบร้อยแล้ว')
  }

  const columns = [
    {
      key: 'name', label: 'ชื่อผู้ใช้', sortable: true,
      render: (u) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#2f63f6', fontSize: 14 }}>{u.name[0]}</Avatar>
          <Box>
            <Typography fontWeight={600} fontSize={14}>{u.name}</Typography>
            <Typography variant="caption" color="text.secondary">{u.username}</Typography>
          </Box>
        </Stack>
      ),
    },
    { key: 'role', label: 'บทบาท', render: (u) => <Chip size="small" label={roleLabel[u.role]} sx={{ backgroundColor: '#eef4ff', color: '#193bab', fontWeight: 700 }} /> },
    { key: 'email', label: 'อีเมล' },
    {
      key: 'status', label: 'สถานะ',
      render: (u) => (
        <Chip
          size="small" label={u.status === 'active' ? 'ใช้งาน' : 'ปิดใช้งาน'} onClick={() => toggleStatus(u.id)}
          sx={{ cursor: 'pointer', backgroundColor: u.status === 'active' ? '#e2f6ec' : '#f1f5f9', color: u.status === 'active' ? '#1aa768' : '#64748b', fontWeight: 700 }}
        />
      ),
    },
    {
      key: 'actions', label: '', render: (u) => (
        <Stack direction="row">
          <IconButton size="small"><EditRoundedIcon fontSize="small" /></IconButton>
          <IconButton size="small" onClick={() => removeUser(u.id)}><DeleteRoundedIcon fontSize="small" sx={{ color: '#e0413f' }} /></IconButton>
        </Stack>
      ),
    },
  ]

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>จัดการผู้ใช้งาน</Typography>
          <Typography variant="body2" color="text.secondary">เพิ่ม แก้ไข หรือปิดการใช้งานบัญชีผู้ใช้ในระบบ</Typography>
        </Box>
        <Button variant="contained" startIcon={<PersonAddRoundedIcon />}>เพิ่มผู้ใช้</Button>
      </Stack>
      <DataTable columns={columns} rows={users} searchKeys={['name', 'username', 'email']} searchPlaceholder="ค้นหาผู้ใช้..." />
    </Box>
  )
}
