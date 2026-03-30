import { Storage } from '@google-cloud/storage'
import { env } from '../config/env'
import { RESUME } from '../config/constants'
import { AppError } from './AppError'

const storage = new Storage({
  projectId: env.GCS_PROJECT_ID,
  ...(env.GCS_KEY_FILE && { keyFilename: env.GCS_KEY_FILE }),
})
const bucket = storage.bucket(env.GCS_BUCKET_NAME || 'default-bucket')

export const uploadPDF = async (buffer: Buffer, filename: string): Promise<string> => {
  const gcsPath = `exports/${filename}.pdf`
  try {
    await bucket.file(gcsPath).save(buffer, { contentType: 'application/pdf', metadata: { cacheControl: 'private, max-age=0' } })
    return `${env.GCS_PUBLIC_URL}/${gcsPath}`
  } catch (err) {
    console.error('[Storage] Upload error:', err)
    throw new AppError('EXPORT_FAILED', 500, 'File upload failed.')
  }
}

export const getSignedUrl = async (filename: string): Promise<{ url: string; expiresAt: Date }> => {
  const expiresAt = new Date(Date.now() + RESUME.EXPORT_URL_TTL_SEC * 1000)
  try {
    const [url] = await bucket.file(`exports/${filename}.pdf`).getSignedUrl({ action: 'read', expires: expiresAt })
    return { url, expiresAt }
  } catch (err) {
    console.error('[Storage] Signed URL error:', err)
    throw new AppError('EXPORT_FAILED', 500, 'Failed to generate download link.')
  }
}

export const deleteFile = async (filename: string): Promise<void> => {
  try { await bucket.file(`exports/${filename}.pdf`).delete({ ignoreNotFound: true }) }
  catch (err) { console.error('[Storage] Delete error:', err) }
}
