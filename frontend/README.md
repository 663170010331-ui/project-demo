# ระบบแจ้งซ่อมสาธารณูปโภคด้วย LINE OA — Frontend

Frontend (React 18 + Vite + Tailwind CSS + MUI) สำหรับโปรเจกต์จบ "การพัฒนาระบบแจ้งซ่อมสาธารณูปโภคด้วย LINE OA"
เวอร์ชันนี้เป็น **frontend-only** ใช้ Mock Data / LocalState ทั้งหมด ยังไม่ต่อ backend จริง (เตรียม service layer ไว้ให้สลับได้ทันที)

## วิธีรัน

```bash
npm install
npm run dev
```

เปิด `http://localhost:5173`

### บัญชีทดสอบ (Mock Login)
ที่หน้า Login กรอก **username** ตามนี้ (รหัสผ่านอะไรก็ได้ ≥ 3 ตัวอักษร):

| Username     | บทบาท              |
|--------------|---------------------|
| `somchai`    | ประชาชน (Citizen)   |
| `operator1`  | หัวหน้าช่าง (Operator) |
| `tech1`      | ช่างซ่อม (Technician) |

หรือกดปุ่ม "เข้าสู่ระบบด้วย LINE" เพื่อ mock login เป็นประชาชนทันที

## โครงสร้างโปรเจกต์

```
src/
  components/common/   # UI ที่ reuse ได้: Sidebar, DataTable, StatusBadge, StatCard, RepairTimeline, EmptyState ...
  contexts/             # AuthContext, NotificationContext (React Context API, ไม่ใช้ Redux)
  layouts/              # MainLayout (public), AuthLayout (login/register), DashboardLayout (3 role)
  pages/
    public/              # Home, Login, Register, ForgotPassword, NotFound, Unauthorized
    citizen/             # Dashboard, แจ้งซ่อมใหม่, ติดตามสถานะ, ประวัติ
    operator/            # Dashboard, รายการคำขอ, รายละเอียด+มอบหมายงาน, จัดการผู้ใช้
    technician/           # Dashboard, งานที่ได้รับมอบหมาย, รายละเอียดงาน+อัปเดตสถานะ
    shared/               # Notifications, Profile, Settings (ใช้ร่วมกันทั้ง 3 role)
  routes/ProtectedRoute.jsx  # role-based route guard
  services/              # axios instance + authService/repairService (พร้อมสลับเป็น API จริง) + mock data
  theme/theme.js          # ธีม MUI "Modern Government Dashboard" (ฟ้า/ขาว, การ์ดโค้งมน, เงานุ่ม)
  utils/constants.js      # หมวดปัญหา, ระดับความสำคัญ, สถานะงานซ่อม
```

## สิ่งที่ทำไว้แล้ว (Phase 1 — ครบ flow การทำงานจริง)

- Auth: Login (mock + LINE placeholder), Register, Forgot Password, role-based redirect, ProtectedRoute
- Citizen: Dashboard, แจ้งซ่อมใหม่ (เลือกประเภท/แนบรูป/พิกัด placeholder/ความเร่งด่วน), ติดตามสถานะ (timeline), ประวัติ
- Operator: Dashboard (สถิติ+กราฟ), รายการคำขอ (filter/search/pagination), รายละเอียด+มอบหมายช่าง, จัดการผู้ใช้
- Technician: Dashboard, งานที่ได้รับมอบหมาย, รายละเอียดงาน (อัปเดตสถานะ/แนบรูปหลังซ่อม/ปฏิเสธงาน)
- ใช้ร่วมกัน: Notifications (unread badge, mark as read), Profile, Settings
- Reusable components, Responsive (mobile drawer sidebar), Dark-mode-ready theme, animation เบื้องต้น (fadeIn, hover)

## ส่วนที่ยังไม่ได้ทำ (ขยายได้ตามต้องการในรอบถัดไป)

หน้า static: About / Contact / Help / Privacy Policy / Terms
Operator: Repair Calendar, Reports (export), Statistics แยกหน้า
LINE LIFF login จริง (ตอนนี้เป็น mock button)
Google Login จริง

บอกมาได้เลยว่าอยากให้ทำหน้าไหนต่อ จะต่อยอดจากโครงสร้างเดิมให้ครบตามสเปกทั้งหมด
