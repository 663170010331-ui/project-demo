import { query } from '../config/db.js'

// Inserts one row into tb_notification. Called directly for notifications
// that go to a single, already-known recipient (e.g. "the technician who
// was just assigned", "the citizen who filed this request").
export async function createNotification({ recipientRole, recipientId, requestId = null, type = 'info', title, message = null }) {
  if (!recipientRole || !recipientId || !title) {
    // Defensive — a bad call site (e.g. missing technicianId) should never
    // crash the request that triggered it, just skip the notification.
    console.error('createNotification: missing required field', { recipientRole, recipientId, title })
    return null
  }
  const result = await query(
    `INSERT INTO tb_notification (recipient_role, recipient_id, request_id, type, title, message)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [recipientRole, recipientId, requestId, type, title, message]
  )
  return result.rows[0]
}

// Fans a notification out to every active operator — used when a new repair
// request comes in and any operator on shift needs to pick it up.
export async function notifyAllOperators({ requestId = null, type = 'info', title, message = null }) {
  const operators = await query(`SELECT operator_id FROM tb_operator WHERE status = 'active'`)
  await Promise.all(
    operators.rows.map((op) =>
      createNotification({ recipientRole: 'operator', recipientId: op.operator_id, requestId, type, title, message })
    )
  )
}