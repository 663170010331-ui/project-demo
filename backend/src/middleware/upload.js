import multer from 'multer'

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME.includes(file.mimetype)) {
    return cb(new Error('อนุญาตเฉพาะไฟล์รูปภาพ (jpg, png, webp, gif) เท่านั้น'))
  }
  cb(null, true)
}

// memoryStorage: the file lives only as a Buffer in req.file(s), long
// enough to stream straight to Cloudinary (see uploadController.js) and is
// then discarded. Previously this used diskStorage into <project-root>/uploads
// — on Render's free tier that folder is wiped on every deploy and every
// spin-down/restart, so any photo saved there was liable to vanish later.
export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 5, // max 5 files per request
  },
})