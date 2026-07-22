// Realistic mock data for the whole app.
// Swap these out for real API calls later — service functions in /services already
// mirror the shape these return, so pages don't need to change.

export const mockUsers = [
  { id: 1, name: 'สมชาย ใจดี', username: 'somchai', role: 'citizen', phone: '081-234-5678', email: 'somchai@example.com', avatar: '', status: 'active' },
  { id: 2, name: 'วิภาพร ชื่นบาน', username: 'operator1', role: 'operator', phone: '082-111-2222', email: 'operator1@example.com', avatar: '', status: 'active' },
  { id: 3, name: 'วิชัย มั่นคง', username: 'tech1', role: 'technician', phone: '082-345-6789', specialty: 'ไฟฟ้า', email: 'tech1@example.com', avatar: '', status: 'active' },
  { id: 4, name: 'ประเสริฐ สว่างใจ', username: 'tech2', role: 'technician', phone: '083-456-7890', specialty: 'ประปา', email: 'tech2@example.com', avatar: '', status: 'active' },
  { id: 5, name: 'อรุณี ใสกระจ่าง', username: 'tech3', role: 'technician', phone: '084-255-5678', specialty: 'ถนน', email: 'tech3@example.com', avatar: '', status: 'inactive' },
]

export const mockTechnicians = mockUsers.filter((u) => u.role === 'technician')

export const mockRepairRequests = [
  {
    id: 'SR2026-045', title: 'ไฟฟ้าดับหน้าซอยร้านน้ำปั่น', category: 'electricity',
    description: 'หม้อแปลงระเบิด 227/2 บ.หนองแวง ต.สงเปลือย อ.นาดูน จ.มหาสารคาม 46230 ไม่สามารถใช้งานได้ตั้งแต่เมื่อเช้า',
    location: '123/45 ซอยสุขวิถี 21 แขวงคลองตันเหนือ เขตวัฒนา กทม 10110',
    priority: 'urgent', status: 'in_progress', reporterId: 1, technicianId: 3,
    createdAt: '2026-02-07T08:15:00', images: [],
  },
  {
    id: 'SR2026-046', title: 'ท่อประปาแตก น้ำรั่วซึม', category: 'water',
    description: 'ท่อประปาบริเวณหน้าบ้านเลขที่ 221/3 แตกและมีน้ำไหลออกมาตลอดทั้งคืน',
    location: '221/3 หมู่ 3 ต.สงเปลือย', priority: 'high', status: 'in_progress',
    reporterId: 1, technicianId: 4, createdAt: '2026-02-07T09:40:00', images: [],
  },
  {
    id: 'SR2026-047', title: 'ไฟถนนดับ 5 จุดติดต่อกัน', category: 'streetlight',
    description: 'ไฟถนนบริเวณหน้าโรงเรียนดับติดต่อกัน 5 ต้น เสี่ยงอันตรายเวลากลางคืน',
    location: 'ถนนสายหลัก หน้าโรงเรียนบ้านสงเปลือย', priority: 'normal', status: 'assigned',
    reporterId: 1, technicianId: null, createdAt: '2026-02-07T10:05:00', images: [],
  },
  {
    id: 'SR2026-048', title: 'ถนนเป็นหลุมบ่อ', category: 'road',
    description: 'ถนนภายในหมู่บ้านมีหลุมขนาดใหญ่ เสี่ยงอุบัติเหตุ', location: 'ถนนสายรอง หมู่ 2',
    priority: 'high', status: 'reported', reporterId: 1, technicianId: null,
    createdAt: '2026-02-06T14:20:00', images: [],
  },
  {
    id: 'SR2026-049', title: 'ท่อระบายน้ำอุดตัน', category: 'drainage',
    description: 'น้ำท่วมขังบริเวณสี่แยกหลังตลาดสด เนื่องจากท่อระบายน้ำอุดตัน', location: 'สี่แยกหลังตลาดสด',
    priority: 'normal', status: 'completed', reporterId: 1, technicianId: 4,
    createdAt: '2026-02-05T11:00:00', images: [],
  },
]

export const mockNotifications = [
  { id: 1, title: 'งานแจ้งซ่อม #SR2026-047 มอบหมายสำเร็จ', message: 'ระบบมอบหมายงานให้ช่างเทคนิคแล้ว', read: false, createdAt: '2026-02-07T10:10:00', type: 'success' },
  { id: 2, title: 'มีคำขอแจ้งซ่อมใหม่เข้ามา', message: '#SR2026-048 ถนนเป็นหลุมบ่อ', read: false, createdAt: '2026-02-06T14:22:00', type: 'info' },
  { id: 3, title: 'งานซ่อม #SR2026-049 เสร็จสมบูรณ์', message: 'ช่างเทคนิคยืนยันการซ่อมเสร็จสิ้นแล้ว', read: true, createdAt: '2026-02-05T16:40:00', type: 'success' },
]

export const mockStats = {
  pending: 8,
  inProgress: 15,
  completed: 38,
  cancelled: 3,
  todayCount: 5,
  monthCount: 64,
  byCategory: [
    { category: 'ไฟฟ้า', count: 24 },
    { category: 'ประปา', count: 18 },
    { category: 'ถนน', count: 11 },
    { category: 'ไฟส่องสว่าง', count: 8 },
    { category: 'ท่อระบายน้ำ', count: 3 },
  ],
  monthlyTrend: [
    { month: 'ก.ย.', count: 32 }, { month: 'ต.ค.', count: 41 }, { month: 'พ.ย.', count: 38 },
    { month: 'ธ.ค.', count: 45 }, { month: 'ม.ค.', count: 52 }, { month: 'ก.พ.', count: 64 },
  ],
}
