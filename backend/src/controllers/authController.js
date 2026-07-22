import bcrypt from 'bcryptjs'
import { query } from '../config/db.js'
import { signToken } from '../utils/jwt.js'
import { verifyLineAccessToken, getLineProfile } from '../utils/lineAuth.js'

// Staff login (Operator / Technician) — tries both tables by username.
export async function login(req, res) {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' })
  }

  try {
    const opRes = await query('SELECT * FROM tb_operator WHERE username = $1', [username])
    if (opRes.rows.length) {
      const row = opRes.rows[0]
      const ok = await bcrypt.compare(password, row.password_hash)
      if (!ok) return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' })
      if (row.status !== 'active') return res.status(403).json({ message: 'บัญชีนี้ถูกปิดใช้งาน' })

      const user = { id: row.operator_id, name: row.name, username: row.username, role: 'operator', phone: row.phone, email: row.email }
      return res.json({ user, token: signToken({ id: user.id, role: 'operator' }) })
    }

    const techRes = await query('SELECT * FROM tb_technician WHERE username = $1', [username])
    if (techRes.rows.length) {
      const row = techRes.rows[0]
      const ok = await bcrypt.compare(password, row.password_hash)
      if (!ok) return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' })
      if (row.status !== 'active') return res.status(403).json({ message: 'บัญชีนี้ถูกปิดใช้งาน' })

      const user = { id: row.technician_id, name: row.name, username: row.username, role: 'technician', phone: row.phone, specialty: row.specialty }
      return res.json({ user, token: signToken({ id: user.id, role: 'technician' }) })
    }

    return res.status(401).json({ message: 'ไม่พบบัญชีผู้ใช้นี้ในระบบ' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' })
  }
}

// Citizen login via LIFF — verifies the LIFF access token with LINE, then
// looks up (or creates) the matching row in tb_user by line_id.
export async function lineLogin(req, res) {
  const { accessToken, profile } = req.body
  if (!accessToken) return res.status(400).json({ message: 'ไม่พบ access token จาก LIFF' })

  try {
    await verifyLineAccessToken(accessToken) // throws if invalid/expired
    const lineProfile = profile || (await getLineProfile(accessToken))

    const existing = await query('SELECT * FROM tb_user WHERE line_id = $1', [lineProfile.userId])
    let row
    if (existing.rows.length) {
      row = existing.rows[0]
    } else {
      const inserted = await query(
        `INSERT INTO tb_user (line_id, name) VALUES ($1, $2) RETURNING *`,
        [lineProfile.userId, lineProfile.displayName || 'ผู้ใช้ LINE']
      )
      row = inserted.rows[0]
    }

    const user = { id: row.user_id, name: row.name, role: 'citizen', phone: row.phone, lineId: row.line_id }
    return res.json({ user, token: signToken({ id: user.id, role: 'citizen' }) })
  } catch (err) {
    console.error(err.response?.data || err)
    return res.status(401).json({ message: 'ยืนยันตัวตนกับ LINE ไม่สำเร็จ' })
  }
}
