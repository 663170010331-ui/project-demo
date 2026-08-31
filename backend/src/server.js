import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'

import authRoutes from './routes/authRoutes.js'
import repairRoutes from './routes/repairRoutes.js'
import userRoutes from './routes/userRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'

dotenv.config()
const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))
app.use(express.json({ limit: '5mb' })) // generous limit for base64 image payloads if used
app.use(morgan('dev'))

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'repair-line-oa-backend' }))

app.use('/api/auth', authRoutes)
app.use('/api/repairs', repairRoutes)
app.use('/api/users', userRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/notifications', notificationRoutes)

// Central error handler — keeps controllers free of try/catch boilerplate
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'เกิดข้อผิดพลาดในระบบ' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`🚀 API running at http://localhost:${PORT}`))