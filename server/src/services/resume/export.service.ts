import { htmlToPDF }               from '../../lib/pdf'
import { uploadPDF, getSignedUrl } from '../../lib/storage'
import type { PdfBody, UploadBody } from '../../schemas/export.schema'

export const generatePDFBuffer = async (body: PdfBody): Promise<{ buffer: Buffer; filename: string }> => {
  const buffer   = await htmlToPDF(body.html)
  const filename = (body.filename?.replace(/[^a-z0-9-_]/gi, '_') ?? 'resume') + '.pdf'
  return { buffer, filename }
}

export const generateShareLink = async (body: UploadBody) => {
  const buffer = await htmlToPDF(body.html)
  await uploadPDF(buffer, body.resumeId)
  return getSignedUrl(body.resumeId)
}
