import { query } from '../config/db.js'

function toClientShape(row) {
  return {
    id: row.notification_id,
    title: row.title,
    message: row.message,
    read: row.is_read,
    type: row.type,
    requestId: row.request_id,
    createdAt: row.created_at,
  }
}

// GET /api/notifications — always scoped to the logged-in user via the JWT
// (req.user.role / req.user.id), never to a role/id passed in the query
// string, so citizens/operators/technicians can only ever see their own.
export async function list(req, res) {
  const result = await query(
    `SELECT * FROM tb_notification
     WHERE recipient_role = $1 AND recipient_id = $2
     ORDER BY created_at DESC
     LIMIT 50`,
    [req.user.role, req.user.id]
  )
  res.json(result.rows.map(toClientShape))
}

// PATCH /api/notifications/:id/read
export async function markRead(req, res) {
  const result = await query(
    `UPDATE tb_notification SET is_read = TRUE
     WHERE notification_id = $1 AND recipient_role = $2 AND recipient_id = $3
     RETURNING *`,
    [req.params.id, req.user.role, req.user.id]
  )
  if (!result.rows.length) return res.status(404).json({ message: 'ไม่พบการแจ้งเตือนนี้' })
  res.json(toClientShape(result.rows[0]))
}

// PATCH /api/notifications/read-all
export async function markAllRead(req, res) {
  await query(
    `UPDATE tb_notification SET is_read = TRUE
     WHERE recipient_role = $1 AND recipient_id = $2 AND is_read = FALSE`,
    [req.user.role, req.user.id]
  )
  res.json({ ok: true })
}