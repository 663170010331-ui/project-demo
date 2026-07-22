import { query } from '../config/db.js'

export async function listTechnicians(req, res) {
  const result = await query(`SELECT technician_id AS id, name, phone, specialty, status FROM tb_technician ORDER BY name`)
  res.json(result.rows)
}

export async function listUsers(req, res) {
  const [ops, techs, citizens] = await Promise.all([
    query(`SELECT operator_id AS id, name, username, phone, email, status, 'operator' AS role FROM tb_operator`),
    query(`SELECT technician_id AS id, name, username, phone, email, status, 'technician' AS role FROM tb_technician`),
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
