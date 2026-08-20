// Builds a full URL back to the file so the frontend can store/display it directly,
// e.g. http://localhost:3000/uploads/ab12cd34....jpg
function toPublicUrl(req, filename) {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`
}

// POST /api/upload — single file, field name "image". Used one call per photo,
// or call repeatedly from the frontend for multiple photos.
export async function uploadSingle(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'ไม่พบไฟล์รูปภาพที่อัปโหลด' })
  }
  res.status(201).json({ url: toPublicUrl(req, req.file.filename) })
}

// POST /api/upload/multiple — up to 5 files at once, field name "images".
export async function uploadMultiple(req, res) {
  if (!req.files?.length) {
    return res.status(400).json({ message: 'ไม่พบไฟล์รูปภาพที่อัปโหลด' })
  }
  const urls = req.files.map((f) => toPublicUrl(req, f.filename))
  res.status(201).json({ urls })
}