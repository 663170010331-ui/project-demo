# Backend — ระบบแจ้งซ่อมสาธารณูปโภคด้วย LINE OA

Node.js + Express + PostgreSQL API ที่ endpoint ตรงกับสิ่งที่ frontend (repair-line-oa) เรียกใช้อยู่แล้วทุกจุด
ตารางฐานข้อมูลอิงตามบทที่ 3 ของเล่ม (tb_user, tb_operator, tb_technician, tb_repairrequest, tb_repairassignment, tb_repairstatus)

## ติดตั้ง

**1. ต้องมี PostgreSQL รันอยู่ก่อน** (ติดตั้งเครื่อง หรือใช้ Docker: `docker run --name pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`)

**2. สร้างฐานข้อมูลเปล่า**
```bash
createdb repair_line_oa
# หรือถ้าใช้ psql: CREATE DATABASE repair_line_oa;
```

**3. ติดตั้ง dependencies**
```bash
npm install
```

**4. ตั้งค่า .env**
```bash
cp .env.example .env
```
แก้ `PGUSER`, `PGPASSWORD` ให้ตรงกับเครื่องคุณ, ใส่ `JWT_SECRET` เป็นสตริงสุ่มยาวๆ

**5. สร้างตาราง + seed ข้อมูลตั้งต้น** (สร้าง operator1 / tech1 / tech2 / tech3 ให้อัตโนมัติ)
```bash
npm run db:init
```

**6. รันเซิร์ฟเวอร์**
```bash
npm run dev
```
เปิด `http://localhost:3000/api/health` ควรเห็น `{"ok":true,...}`

## บัญชีทดสอบหลัง db:init (รหัสผ่านเดียวกันหมด: `password123`)
| username | role |
|---|---|
| operator1 | operator |
| tech1 / tech2 / tech3 | technician |

ฝั่งประชาชนไม่มี username/password — สร้างอัตโนมัติผ่าน `/api/auth/line-login` ตอน login ด้วย LIFF

## Endpoints ทั้งหมด

| Method | Path | Auth | คำอธิบาย |
|---|---|---|---|
| POST | `/api/auth/login` | - | staff login (operator/technician) |
| POST | `/api/auth/line-login` | - | citizen login ผ่าน LIFF access token |
| GET | `/api/repairs` | ✅ | list + filter (`status`, `category`, `reporterId`, `technicianId`, `search`) |
| GET | `/api/repairs/stats` | ✅ operator | สถิติสำหรับแดชบอร์ด |
| GET | `/api/repairs/:id` | ✅ | รายละเอียดคำขอ |
| POST | `/api/repairs` | ✅ citizen | สร้างคำขอแจ้งซ่อมใหม่ |
| POST | `/api/repairs/:id/assign` | ✅ operator | มอบหมายช่าง |
| PATCH | `/api/repairs/:id/status` | ✅ tech/operator | อัปเดตสถานะงาน |
| GET | `/api/users/technicians` | ✅ | รายชื่อช่างทั้งหมด |
| GET | `/api/users` | ✅ operator | รายชื่อผู้ใช้ทั้งระบบ |
| PATCH | `/api/users/:role/:id/toggle-status` | ✅ operator | เปิด/ปิดการใช้งานบัญชี |

ทุก endpoint ที่มี ✅ ต้องส่ง header `Authorization: Bearer <token>` (token ได้จาก login)

## เชื่อมกับ Frontend

ในโปรเจกต์ frontend สร้างไฟล์ `.env`:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

จากนั้นแก้ 2 ไฟล์นี้ให้เรียก `apiClient` แทน mock (โครงสร้าง response ตรงกันแล้ว ไม่ต้องแก้หน้า UI):

**`src/services/authService.js`**
```js
import apiClient from './apiClient.js'

export const authService = {
  async login({ username, password }) {
    const { data } = await apiClient.post('/auth/login', { username, password })
    return data // { user, token }
  },
  async loginWithLine({ accessToken, profile }) {
    const { data } = await apiClient.post('/auth/line-login', { accessToken, profile })
    return data
  },
  // ...
}
```

**`src/services/repairService.js`** — แทนทุกฟังก์ชันด้วย `apiClient.get/post/patch(...)` ตามตาราง endpoint ด้านบน (โครงสร้าง params/response เหมือน mock เป๊ะ)

## หมายเหตุเรื่องรูปภาพ

ตอนนี้ `images_before` / `images_after` เก็บเป็น `TEXT[]` (array ของ URL) เตรียมไว้เฉยๆ — ยังไม่มี endpoint อัปโหลดไฟล์จริง
แนะนำใช้ `multer` (มีอยู่ใน dependencies แล้ว) เขียน endpoint `POST /api/upload` แยก แล้วเก็บไฟล์ไว้ที่ดิสก์ หรือ S3/Cloud Storage แล้วส่ง URL กลับมาเก็บใน array นี้แทน
