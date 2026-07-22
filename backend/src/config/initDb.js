// Run once to create tables + seed demo accounts: `npm run db:init`
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import { pool } from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function run() {
  const schemaSql = fs.readFileSync(path.join(__dirname, '../../sql/schema.sql'), 'utf-8')
  console.log('Creating tables...')
  await pool.query(schemaSql)

  console.log('Seeding repair statuses...')
  const statuses = [
    ['reported', 'แจ้งแล้ว'], ['accepted', 'รับเรื่องแล้ว'], ['assigned', 'มอบหมายงานแล้ว'],
    ['in_progress', 'กำลังดำเนินการ'], ['completed', 'เสร็จสิ้น'], ['cancelled', 'ยกเลิก'],
  ]
  for (const [code, name] of statuses) {
    await pool.query(
      `INSERT INTO tb_repairstatus (status_code, status_name) VALUES ($1, $2)
       ON CONFLICT (status_code) DO NOTHING`,
      [code, name]
    )
  }

  console.log('Seeding demo operator/technician accounts (password: password123)...')
  const passwordHash = await bcrypt.hash('password123', 10)

  await pool.query(
    `INSERT INTO tb_operator (username, password_hash, name, phone, email)
     VALUES ($1, $2, $3, $4, $5) ON CONFLICT (username) DO NOTHING`,
    ['operator1', passwordHash, 'วิภาพร ชื่นบาน', '0821112222', 'operator1@example.com']
  )

  const technicians = [
    ['tech1', 'วิชัย มั่นคง', '0823456789', 'ไฟฟ้า'],
    ['tech2', 'ประเสริฐ สว่างใจ', '0834567890', 'ประปา'],
    ['tech3', 'อรุณี ใสกระจ่าง', '0842555678', 'ถนน'],
  ]
  for (const [username, name, phone, specialty] of technicians) {
    await pool.query(
      `INSERT INTO tb_technician (username, password_hash, name, phone, specialty)
       VALUES ($1, $2, $3, $4, $5) ON CONFLICT (username) DO NOTHING`,
      [username, passwordHash, name, phone, specialty]
    )
  }

  console.log('Done ✅  You can now run: npm run dev')
  await pool.end()
}

run().catch((err) => {
  console.error('DB init failed:', err)
  process.exit(1)
})
