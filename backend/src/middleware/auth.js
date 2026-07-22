import { verifyToken } from '../utils/jwt.js'

export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'ไม่ได้เข้าสู่ระบบ' })
  }
  try {
    const payload = verifyToken(header.split(' ')[1])
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ message: 'โทเคนไม่ถูกต้องหรือหมดอายุ' })
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึงส่วนนี้' })
    }
    next()
  }
}
