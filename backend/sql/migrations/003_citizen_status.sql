-- Migration 003: adds a status column to tb_user so operators can suspend
-- (blacklist) a citizen who abuses the report-a-problem flow, without
-- deleting their account or losing their report history. Reuses the same
-- 'active' / 'inactive' convention already used by tb_operator and
-- tb_technician, rather than inventing a new set of status values.

ALTER TABLE tb_user ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active';

-- ── วิธีรัน ──────────────────────────────────────────────────────────────
-- เหมือนไฟล์ 002_notifications.sql ทุกประการ — รันบนทั้ง 2 ที่ (local pgAdmin4
-- และ Render ผ่าน server connection ที่ตั้งไว้แล้ว) ด้วย Query Tool