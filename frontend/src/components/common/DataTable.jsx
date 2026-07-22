import React, { useMemo, useState } from 'react'
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  TextField, InputAdornment, Box, TableSortLabel,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import EmptyState from './EmptyState.jsx'

// Generic reusable data table: pagination + client-side search + sorting.
// columns: [{ key, label, sortable, render(row) }]
export default function DataTable({ columns, rows, searchPlaceholder = 'ค้นหา...', searchKeys = [], onRowClick }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [orderBy, setOrderBy] = useState(null)
  const [order, setOrder] = useState('asc')

  const filtered = useMemo(() => {
    if (!search) return rows
    const q = search.toLowerCase()
    return rows.filter((r) => searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(q)))
  }, [rows, search, searchKeys])

  const sorted = useMemo(() => {
    if (!orderBy) return filtered
    return [...filtered].sort((a, b) => {
      const av = a[orderBy]; const bv = b[orderBy]
      if (av < bv) return order === 'asc' ? -1 : 1
      if (av > bv) return order === 'asc' ? 1 : -1
      return 0
    })
  }, [filtered, orderBy, order])

  const paged = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const handleSort = (key) => {
    if (orderBy === key) setOrder(order === 'asc' ? 'desc' : 'asc')
    else { setOrderBy(key); setOrder('asc') }
  }

  return (
    <Box className="card">
      {searchKeys.length > 0 && (
        <Box sx={{ p: 2 }}>
          <TextField
            size="small" fullWidth placeholder={searchPlaceholder} value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }}
          />
        </Box>
      )}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key} sx={{ fontWeight: 700, backgroundColor: '#f8fafc' }}>
                  {col.sortable ? (
                    <TableSortLabel active={orderBy === col.key} direction={order} onClick={() => handleSort(col.key)}>
                      {col.label}
                    </TableSortLabel>
                  ) : col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map((row, idx) => (
              <TableRow
                key={row.id || idx} hover
                onClick={() => onRowClick?.(row)}
                sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((col) => (
                  <TableCell key={col.key}>{col.render ? col.render(row) : row[col.key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {sorted.length === 0 ? (
        <EmptyState title="ไม่พบข้อมูล" description="ลองปรับคำค้นหาหรือตัวกรองใหม่" />
      ) : (
        <TablePagination
          component="div" count={sorted.length} page={page} onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0) }}
          labelRowsPerPage="แถวต่อหน้า"
        />
      )}
    </Box>
  )
}
