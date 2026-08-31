import { uploadBufferToCloudinary } from '../utils/cloudinary.js'

// POST /api/upload — single file, field name "image". Used one call per photo,
// or call repeatedly from the frontend for multiple photos.
export async function uploadSingle(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'ไม่พบไฟล์รูปภาพที่อัปโหลด' })
  }
  const result = await uploadBufferToCloudinary(req.file.buffer)
  res.status(201).json({ url: result.secure_url })
}

// POST /api/upload/multiple — up to 5 files at once, field name "images".
export async function uploadMultiple(req, res) {
  if (!req.files?.length) {
    return res.status(400).json({ message: 'ไม่พบไฟล์รูปภาพที่อัปโหลด' })
  }
  const results = await Promise.all(req.files.map((f) => uploadBufferToCloudinary(f.buffer)))
  res.status(201).json({ urls: results.map((r) => r.secure_url) })
}