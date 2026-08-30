import { query } from '../config/db.js'
import { createNotification, notifyAllOperators } from '../utils/notificationHelper.js'

function toClientShape(row) {
  return {
    id: row.request_id,
    title: row.title,
    category: row.repair_type,
    description: row.problem_desc,
    reporterName: row.reporter_name,
    community: row.community,
    location: row.location_name,
    coords: row.latitude != null ? { lat: Number(row.latitude), lng: Number(row.longitude) } : null,
    priority: row.priority,
    contactPhone: row.contact_phone,
    images: row.images_before || [],
    imagesAfter: row.images_after || [],
    repairResult: row.repair_result,
    status: row.status_code,
    reporterId: row.user_id,
    technicianId: row.technician_id || null,
    createdAt: row.created_at,
  }
}

async function nextRequestId() {
  const year = new Date().getFullYear() + 543 // Buddhist era, matches SR2026-xxx style
  const res = await query(`SELECT COUNT(*)::int AS count FROM tb_repairrequest WHERE request_id LIKE $1`, [`SR${year}-%`])
  const seq = res.rows[0].count + 1
  return `SR${year}-${String(seq).padStart(3, '0')}`
}

export async function list(req, res) {
  const { status, category, reporterId, technicianId, search } = req.query
  const conditions = []
  const params = []

  let sql = `
    SELECT r.*, a.technician_id
    FROM tb_repairrequest r
    LEFT JOIN LATERAL (
      SELECT technician_id FROM tb_repairassignment
      WHERE request_id = r.request_id ORDER BY assigned_date DESC LIMIT 1
    ) a ON true
  `

  if (status) { params.push(status); conditions.push(`r.status_code = $${params.length}`) }
  if (category) { params.push(category); conditions.push(`r.repair_type = $${params.length}`) }
  if (reporterId) { params.push(reporterId); conditions.push(`r.user_id = $${params.length}`) }
  if (technicianId) { params.push(technicianId); conditions.push(`a.technician_id = $${params.length}`) }
  if (search) { params.push(`%${search.toLowerCase()}%`); conditions.push(`(LOWER(r.request_id) LIKE $${params.length} OR LOWER(r.title) LIKE $${params.length})`) }

  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ')
  sql += ' ORDER BY r.created_at DESC'

  const result = await query(sql, params)
  res.json(result.rows.map(toClientShape))
}

export async function getById(req, res) {
  const result = await query(
    `SELECT r.*, a.technician_id FROM tb_repairrequest r
     LEFT JOIN LATERAL (
       SELECT technician_id FROM tb_repairassignment WHERE request_id = r.request_id ORDER BY assigned_date DESC LIMIT 1
     ) a ON true
     WHERE r.request_id = $1`,
    [req.params.id.toUpperCase()]
  )
  if (!result.rows.length) return res.status(404).json({ message: 'ไม่พบคำขอแจ้งซ่อม' })
  res.json(toClientShape(result.rows[0]))
}

export async function create(req, res) {
  const { title, category, description, reporterName, community, location, coords, priority, contactPhone, reporterId, images } = req.body
  const id = await nextRequestId()

  const result = await query(
    `INSERT INTO tb_repairrequest
      (request_id, user_id, repair_type, title, problem_desc, reporter_name, community, location_name, latitude, longitude, priority, contact_phone, images_before, status_code)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'reported')
     RETURNING *`,
    [id, reporterId, category, title, description, reporterName || null, community || null, location || null,
      coords?.lat ?? null, coords?.lng ?? null, priority || 'normal', contactPhone, images || []]
  )

  await notifyAllOperators({
    requestId: id,
    type: 'info',
    title: 'มีคำขอแจ้งซ่อมใหม่เข้ามา',
    message: `#${id} ${title}`,
  })

  res.status(201).json(toClientShape(result.rows[0]))
}

export async function assignTechnician(req, res) {
  const { id } = req.params
  const { technicianId, priority, operatorId, note } = req.body

  await query('BEGIN')
  try {
    await query(
      `INSERT INTO tb_repairassignment (request_id, technician_id, operator_id, note) VALUES ($1,$2,$3,$4)`,
      [id, technicianId, operatorId || req.user?.id, note || null]
    )
    await query(
      `UPDATE tb_repairrequest SET status_code = 'assigned', priority = COALESCE($2, priority), updated_at = NOW() WHERE request_id = $1`,
      [id, priority]
    )
    await query('COMMIT')
  } catch (err) {
    await query('ROLLBACK')
    throw err
  }

  const updated = await query('SELECT * FROM tb_repairrequest WHERE request_id = $1', [id])
  const row = updated.rows[0]

  await createNotification({
    recipientRole: 'technician',
    recipientId: technicianId,
    requestId: id,
    type: 'info',
    title: 'ได้รับมอบหมายงานใหม่',
    message: `งานแจ้งซ่อม #${id} ${row.title} ถูกมอบหมายให้คุณแล้ว`,
  })
  if (row.user_id) {
    await createNotification({
      recipientRole: 'citizen',
      recipientId: row.user_id,
      requestId: id,
      type: 'success',
      title: `งานแจ้งซ่อม #${id} มอบหมายสำเร็จ`,
      message: 'ระบบมอบหมายงานให้ช่างเทคนิคแล้ว กำลังดำเนินการ',
    })
  }

  res.json(toClientShape({ ...row, technician_id: technicianId }))
}

export async function updateStatus(req, res) {
  const { id } = req.params
  const { status, repairResult, imagesAfter } = req.body

  await query(
    `UPDATE tb_repairrequest
     SET status_code = $2, repair_result = COALESCE($3, repair_result),
         images_after = COALESCE($4, images_after), updated_at = NOW()
     WHERE request_id = $1`,
    [id, status, repairResult || null, imagesAfter || null]
  )

  if (status === 'completed') {
    await query(`UPDATE tb_repairassignment SET completed_date = NOW() WHERE request_id = $1`, [id])
  }

  const result = await query('SELECT * FROM tb_repairrequest WHERE request_id = $1', [id])
  const row = result.rows[0]

  if (row.user_id) {
    const STATUS_LABEL = {
      accepted: 'รับเรื่องแล้ว',
      in_progress: 'กำลังดำเนินการ',
      completed: 'เสร็จสมบูรณ์',
      cancelled: 'ถูกยกเลิก',
    }
    const label = STATUS_LABEL[status] || status
    await createNotification({
      recipientRole: 'citizen',
      recipientId: row.user_id,
      requestId: id,
      type: status === 'completed' ? 'success' : 'info',
      title: `งานแจ้งซ่อม #${id} ${label}`,
      message: status === 'completed'
        ? 'ช่างเทคนิคยืนยันการซ่อมเสร็จสิ้นแล้ว'
        : `สถานะงานแจ้งซ่อมของคุณอัปเดตเป็น "${label}"`,
    })
  }

  res.json(toClientShape(row))
}

export async function getStats(req, res) {
  const counts = await query(`
    SELECT status_code, COUNT(*)::int AS count FROM tb_repairrequest GROUP BY status_code
  `)
  const byCategory = await query(`
    SELECT repair_type AS category, COUNT(*)::int AS count FROM tb_repairrequest GROUP BY repair_type ORDER BY count DESC
  `)
  const monthlyTrend = await query(`
    SELECT to_char(created_at, 'Mon') AS month, COUNT(*)::int AS count
    FROM tb_repairrequest
    WHERE created_at > NOW() - INTERVAL '6 months'
    GROUP BY 1, date_trunc('month', created_at)
    ORDER BY date_trunc('month', created_at)
  `)
  const map = Object.fromEntries(counts.rows.map((r) => [r.status_code, r.count]))
  res.json({
    pending: (map.reported || 0) + (map.accepted || 0) + (map.assigned || 0),
    inProgress: map.in_progress || 0,
    completed: map.completed || 0,
    cancelled: map.cancelled || 0,
    byCategory: byCategory.rows,
    monthlyTrend: monthlyTrend.rows,
  })
}