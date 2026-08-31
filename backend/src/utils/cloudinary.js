import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Streams an in-memory Buffer (from multer's memoryStorage) straight to
// Cloudinary and resolves with the upload result (we mainly care about
// .secure_url). Nothing ever touches the local disk here — that's the
// whole point: Render's free-tier filesystem is wiped on every deploy and
// every spin-down/restart, which is why photos saved with the old
// disk-storage setup kept disappearing.
export function uploadBufferToCloudinary(buffer, folder = 'repair-line-oa') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result))
    )
    stream.end(buffer)
  })
}

export default cloudinary