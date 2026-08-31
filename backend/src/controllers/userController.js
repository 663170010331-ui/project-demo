import bcrypt from 'bcryptjs'
import { query } from '../config/db.js'

// Maps a role to its table/id-column — every admin CRUD and self-service
// endpoint below branches on this instead of repeating the same ternary.
const TABLE = {
  citizen: { table: 'tb_user', idCol: 'user_id' },
  operator: { table: 'tb_operator', idCol: 'operator_id' },
  technician: { table: 'tb_technician', idCol: 'technician_id' },
}

function isUniqueViolation(err) {
  return err.code === '23505' // duplicate username
}
function isForeignKeyViolation(err) {
  return err.code === '23503' // e.g. technician still has assignment history
}

export async function listTechnicians(req, res) {
  const result = await query(`SELECT technician_id AS id, name, phone, specialty, status FROM tb_technician ORDER BY name`)
  res.json(result.rows)
}

export async function listUsers(req, res) {
  const [ops, techs, citizens] = await Promise.all([
    query(`SELECT operator_id AS id, name, username, phone, email, status, 'operator' AS role FROM tb_operator`),
    query(`SELECT technician_id AS id, name, username, phone, email, specialty, status, 'technician' AS role FROM tb_technician`),
    query(`SELECT user_id AS id, name, phone, email, 'citizen' AS role FROM tb_user`),
  ])
  res.json([...ops.rows, ...techs.rows, ...citizens.rows])
}

export async function toggleUserStatus(req, res) {
  const { role, id } = req.params
  const table = role === 'operator' ? 'tb_operator' : 'tb_technician'
  const idCol = role === 'operator' ? 'operator_id' : 'technician_id'
  const result = await query(
    `UPDATE ${table} SET status = CASE WHEN status = 'active' THEN 'inactive' ELSE 'active' END
     WHERE ${idCol} = $1 RETURNING status`,
    [id]
  )
  res.json(result.rows[0])
}

// ── Self-service profile (any logged-in role edits their own record) ──────

// PATCH /api/users/me
export async function updateMe(req, res) {
  const { role, id } = req.user
  const meta = TABLE[role]
  const { name, phone, email } = req.body
  if (!name?.trim()) return res.status(400).json({ message: 'กรุณากรอกชื่อ-นามสกุล' })

  const result = await query(
    `UPDATE ${meta.table} SET name = $2, phone = $3, email = $4 WHERE ${meta.idCol} = $1 RETURNING *`,
    [id, name.trim(), phone || null, email || null]
  )
  if (!result.rows.length) return res.status(404).json({ message: 'ไม่พบบัญชีผู้ใช้' })

  const row = result.rows[0]
  res.json({ id: row[meta.idCol], name: row.name, phone: row.phone, email: row.email, role })
}

// PATCH /api/users/me/password — operator/technician only (citizens log in
// via LINE and have no password_hash column at all).
export async function changeMyPassword(req, res) {
  const { role, id } = req.user
  if (role === 'citizen') {
    return res.status(400).json({ message: 'บัญชีประชาชนเข้าสู่ระบบผ่าน LINE ไม่มีรหัสผ่านให้เปลี่ยน' })
  }
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'กรุณากรอกรหัสผ่านให้ครบ' })
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร' })
  }

  const meta = TABLE[role]
  const current = await query(`SELECT password_hash FROM ${meta.table} WHERE ${meta.idCol} = $1`, [id])
  if (!current.rows.length) return res.status(404).json({ message: 'ไม่พบบัญชีผู้ใช้' })

  const ok = await bcrypt.compare(currentPassword, current.rows[0].password_hash)
  if (!ok) return res.status(401).json({ message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' })

  const nextHash = await bcrypt.hash(newPassword, 10)
  await query(`UPDATE ${meta.table} SET password_hash = $2 WHERE ${meta.idCol} = $1`, [id, nextHash])
  res.json({ ok: true })
}

// ── Admin CRUD (operator manages operator/technician accounts) ────────────

// POST /api/users — role must be operator or technician; citizens are never
// created here, they self-provision the first time they open the LIFF app.
export async function createUser(req, res) {
  const { role, username, password, name, phone, email, specialty } = req.body
  if (!['operator', 'technician'].includes(role)) {
    return res.status(400).json({ message: 'เลือกบทบาทได้เฉพาะหัวหน้าช่างหรือช่างซ่อม' })
  }
  if (!username?.trim() || !password || !name?.trim()) {
    return res.status(400).json({ message: 'กรุณากรอกชื่อผู้ใช้ รหัสผ่าน และชื่อ-นามสกุลให้ครบ' })
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' })
  }

  const meta = TABLE[role]
  const passwordHash = await bcrypt.hash(password, 10)

  try {
    const cols = role === 'technician'
      ? '(username, password_hash, name, phone, email, specialty)'
      : '(username, password_hash, name, phone, email)'
    const values = role === 'technician'
      ? [username.trim(), passwordHash, name.trim(), phone || null, email || null, specialty || null]
      : [username.trim(), passwordHash, name.trim(), phone || null, email || null]
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ')

    const result = await query(
      `INSERT INTO ${meta.table} ${cols} VALUES (${placeholders}) RETURNING ${meta.idCol} AS id, name, username, phone, email, status${role === 'technician' ? ', specialty' : ''}`,
      values
    )
    res.status(201).json({ ...result.rows[0], role })
  } catch (err) {
    if (isUniqueViolation(err)) {
      return res.status(409).json({ message: 'ชื่อผู้ใช้นี้มีคนใช้แล้ว กรุณาเลือกชื่ออื่น' })
    }
    throw err
  }
}

// PATCH /api/users/:role/:id — admin edits name/phone/email/(specialty).
// Username and password are intentionally NOT editable here — renaming a
// login username while someone might be mid-session, or resetting a
// password blind without the user present, are both easy to get wrong;
// keep those as deliberate separate actions later if actually needed.
export async function updateUser(req, res) {
  const { role, id } = req.params
  const meta = TABLE[role]
  if (!meta) return res.status(400).json({ message: 'บทบาทไม่ถูกต้อง' })

  const { name, phone, email, specialty } = req.body
  if (!name?.trim()) return res.status(400).json({ message: 'กรุณากรอกชื่อ-นามสกุล' })

  const setSpecialty = role === 'technician' ? ', specialty = $5' : ''
  const values = role === 'technician'
    ? [id, name.trim(), phone || null, email || null, specialty || null]
    : [id, name.trim(), phone || null, email || null]

  const result = await query(
    `UPDATE ${meta.table} SET name = $2, phone = $3, email = $4${setSpecialty} WHERE ${meta.idCol} = $1 RETURNING *`,
    values
  )
  if (!result.rows.length) return res.status(404).json({ message: 'ไม่พบผู้ใช้นี้' })
  res.json({ ...result.rows[0], id: result.rows[0][meta.idCol], role })
}

// DELETE /api/users/:role/:id
export async function deleteUser(req, res) {
  const { role, id } = req.params
  const meta = TABLE[role]
  if (!meta) return res.status(400).json({ message: 'บทบาทไม่ถูกต้อง' })

  try {
    const result = await query(`DELETE FROM ${meta.table} WHERE ${meta.idCol} = $1 RETURNING ${meta.idCol}`, [id])
    if (!result.rows.length) return res.status(404).json({ message: 'ไม่พบผู้ใช้นี้' })
    res.json({ ok: true })
  } catch (err) {
    if (isForeignKeyViolation(err)) {
      // Technician/operator has repair-request or assignment history tied
      // to their id — deleting would orphan those rows, so refuse and point
      // the operator at the safer alternative (deactivate via status toggle).
      return res.status(409).json({
        message: 'ลบไม่ได้เพราะมีประวัติงานผูกอยู่กับผู้ใช้นี้ — ให้ปิดใช้งานแทนการลบ',
      })
    }
    throw err
  }
}