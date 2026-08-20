import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadSingle, uploadMultiple } from '../controllers/uploadController.js'

const router = Router()

// Wraps multer so its errors (file too big, wrong type, too many files)
// reach the central error handler with a friendly Thai message instead of
// crashing with a raw multer stack trace.
function handleMulterErrors(multerMiddleware) {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB ต่อไฟล์)' })
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ message: 'อัปโหลดได้สูงสุด 5 ไฟล์ต่อครั้ง' })
        }
        return res.status(400).json({ message: err.message || 'อัปโหลดไฟล์ไม่สำเร็จ' })
      }
      next()
    })
  }
}

// requireAuth: only logged-in users (citizen/operator/technician) may upload —
// keeps random people from filling the disk with anonymous uploads.
router.post('/', requireAuth, handleMulterErrors(upload.single('image')), asyncHandler(uploadSingle))
router.post('/multiple', requireAuth, handleMulterErrors(upload.array('images', 5)), asyncHandler(uploadMultiple))

export default router