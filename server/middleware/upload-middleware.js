import multer from 'multer'
import path from 'path' // <-- [ADDED] To check file extension
import logger from '../config/logger.js'

// [1] Use memory storage (already secure for image processing)
const storage = multer.memoryStorage()

// [2] Allowed file extensions for images (defense-in-depth)
const allowedExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

const fileFilter = (req, file, cb) => {
  // Check MIME type
  if (!file.mimetype.startsWith('image/')) {
    logger.warn(`[Upload] File rejected (not image): ${file.originalname} from ${req.ip}`)
    return cb(new Error('Only image files are allowed!'), false)
  }

  // [ADDED] Check extension
  const ext = path.extname(file.originalname).toLowerCase()
  if (!allowedExt.includes(ext)) {
    logger.warn(`[Upload] File rejected (disallowed ext): ${file.originalname} from ${req.ip}`)
    return cb(new Error('Invalid image file extension!'), false)
  }

  // [ADDED] Sanitize filename (basic)
  file.originalname = path.basename(file.originalname).replace(/[^a-zA-Z0-9.\-_]/g, '_')

  logger.info(`[Upload] File accepted: ${file.originalname} (${file.mimetype}) from ${req.ip}`)
  cb(null, true)
}

// [3] Limit max file size to 5MB (adjust as needed)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // <-- [ADDED] 5MB limit
})

// [4] Multer error handler middleware (use in routes)
export const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    logger.warn(`[Upload] Multer error: ${err.message} from ${req.ip}`)
    return res.status(400).json({ status: 400, error: 'File upload error: ' + err.message })
  } else if (err) {
    logger.warn(`[Upload] Error: ${err.message} from ${req.ip}`)
    return res.status(400).json({ status: 400, error: err.message })
  }
  next()
}

export default upload
