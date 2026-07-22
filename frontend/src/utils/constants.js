// Central constants used across the app (mock-data driven, ready to be swapped for API values)

export const ROLES = {
  CITIZEN: 'citizen',
  OPERATOR: 'operator',
  TECHNICIAN: 'technician',
}

export const REPAIR_CATEGORIES = [
  { value: 'electricity', label: 'ไฟฟ้า', icon: '⚡' },
  { value: 'water', label: 'ประปา', icon: '💧' },
  { value: 'road', label: 'ถนน', icon: '🛣️' },
  { value: 'streetlight', label: 'ไฟส่องสว่าง', icon: '💡' },
  { value: 'drainage', label: 'ท่อระบายน้ำ', icon: '🌊' },
  { value: 'other', label: 'อื่นๆ', icon: '🔧' },
]

export const PRIORITY_LEVELS = [
  { value: 'low', label: 'ต่ำ', color: 'default' },
  { value: 'normal', label: 'ปานกลาง', color: 'info' },
  { value: 'high', label: 'สูง', color: 'warning' },
  { value: 'urgent', label: 'ด่วนมาก', color: 'error' },
]

// Repair status timeline (ordered)
export const REPAIR_STATUSES = [
  { value: 'reported', label: 'แจ้งแล้ว' },
  { value: 'accepted', label: 'รับเรื่องแล้ว' },
  { value: 'assigned', label: 'มอบหมายงานแล้ว' },
  { value: 'in_progress', label: 'กำลังดำเนินการ' },
  { value: 'completed', label: 'เสร็จสิ้น' },
  { value: 'cancelled', label: 'ยกเลิก' },
]

export const STATUS_COLOR = {
  reported: { label: 'แจ้งแล้ว', color: '#2f63f6', bg: '#eef4ff' },
  accepted: { label: 'รับเรื่องแล้ว', color: '#1f4bd8', bg: '#dae7ff' },
  assigned: { label: 'มอบหมายงานแล้ว', color: '#e08a1e', bg: '#fdf0dc' },
  in_progress: { label: 'กำลังดำเนินการ', color: '#e08a1e', bg: '#fdf0dc' },
  completed: { label: 'เสร็จสิ้น', color: '#1aa768', bg: '#e2f6ec' },
  cancelled: { label: 'ยกเลิก', color: '#e0413f', bg: '#fbe2e2' },
  pending: { label: 'รอดำเนินการ', color: '#64748b', bg: '#f1f5f9' },
}

export const STORAGE_KEYS = {
  TOKEN: 'ru_token',
  USER: 'ru_user',
}

// Community / village list — customize to match your own tambon/municipality
export const COMMUNITIES = [
  'หมู่ 1', 'หมู่ 2', 'หมู่ 3', 'หมู่ 4', 'หมู่ 5',
  'หมู่ 6', 'หมู่ 7', 'หมู่ 8', 'หมู่ 9', 'หมู่ 10',
]