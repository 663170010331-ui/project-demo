import multer from 'multer'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Files land in <project-root>/uploads (served statically at /uploads, see server.js)
export const UPLOAD_DIR = path.join(__dirname, '../../uploads')

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    // Random name avoids collisions and strips any path info from the original filename
    const unique = crypto.randomBytes(16).toString('hex')
    cb(null, `${unique}${path.extname(file.originalname).toLowerCase()}`)
  },
})

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME.includes(file.mimetype)) {
    return cb(new Error('อนุญาตเฉพาะไฟล์รูปภาพ (jpg, png, webp, gif) เท่านั้น'))
  }
  cb(null, true)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file — raised from 5MB: modern phone photos (esp. from Google Photos originals) routinely exceed 5MB
    files: 5, // max 5 files per request
  },
})