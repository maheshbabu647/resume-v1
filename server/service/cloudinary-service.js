import path from 'path'
import crypto from 'crypto'
import cloudinary from '../config/cloudinary-config.js'
import logger from '../config/logger.js'

// [SECURITY] Accept only allowed image file extensions
const allowedExts = ['.png', '.jpg', '.jpeg', '.webp', '.gif']

const uploadImageToCloudinary = async (fileBuffer, originalFileName, folderName = 'resume_templates_previews') => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      const msg = 'File buffer is required for upload.'
      logger.error(`[Cloudinary][Upload][Error] ${msg}`)
      return reject(new Error(msg))
    }

    if (!originalFileName) {
      const msg = 'Original file name is required for upload.'
      logger.error(`[Cloudinary][Upload][Error] ${msg}`)
      return reject(new Error(msg))
    }

    // [SECURITY] Limit file extension (defense in depth)
    const ext = path.extname(originalFileName).toLowerCase()
    if (!allowedExts.includes(ext)) {
      const msg = `File type not allowed: ${ext}`
      logger.error(`[Cloudinary][Upload][Error] ${msg}`)
      return reject(new Error(msg))
    }

    // [SECURITY] Sanitize file name (prevent weird public_id)
    const fileNameWithoutExt = path
      .parse(originalFileName)
      .name
      .replace(/[^a-zA-Z0-9_\-]/g, '_')
      .slice(0, 60) // [OPTIONAL] Limit filename length

    // [SECURITY] Optional: check buffer size (limit 5MB)
    if (fileBuffer.length > 5 * 1024 * 1024) {
      const msg = 'File size exceeds limit (5MB)'
      logger.error(`[Cloudinary][Upload][Error] ${msg}`)
      return reject(new Error(msg))
    }

    const uniquePublicId = `${fileNameWithoutExt}_${crypto.randomUUID()}`

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        public_id: uniquePublicId,
        resource_type: 'image', // [SECURITY] Force to image type
        overwrite: false,
        use_filename: false,
      },
      (error, result) => {
        if (error) {
          logger.error(`[Cloudinary][Upload][Error] Cloudinary upload error: ${error.message}`)
          return reject(new Error('Image upload to Cloudinary failed'))
        }
        if (!result || !result.secure_url) {
          logger.error(`[Cloudinary][Upload][Error] No result/URL returned. Result: ${JSON.stringify(result)}`)
          return reject(new Error('Invalid upload result from Cloudinary.'))
        }
        logger.info(`[Cloudinary][Upload][Success] Uploaded image as: ${uniquePublicId} in folder: ${folderName}`)
        resolve({ secure_url: result.secure_url, public_id: result.public_id })
      }
    )
    uploadStream.end(fileBuffer)
  })
}

const deleteImageFromCloudinary = async (publicId) => {
  if (!publicId) {
    const msg = 'Public ID is required to delete an image.'
    logger.error(`[Cloudinary][Delete][Error] ${msg}`)
    throw new Error(msg)
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' }) // [SECURITY]
    logger.info(`[Cloudinary][Delete][Success] Deleted image with publicId: ${publicId}`)
    return result
  } catch (error) {
    logger.error(`[Cloudinary][Delete][Error] publicId: ${publicId}, Reason: ${error.message}`)
    throw new Error(`Failed to delete image: ${error.message}`)
  }
}

export {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
}
