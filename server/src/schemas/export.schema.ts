import { z } from 'zod'

export const pdfSchema = z.object({
  resumeId: z.string().length(24, 'Invalid resume ID').optional().nullable(),
  html:     z.string().min(100),
  filename: z.string().max(100).optional(),
})

export const uploadSchema = z.object({
  resumeId: z.string().length(24, 'Invalid resume ID'),
  html:     z.string().min(100),
})

export type PdfBody    = z.infer<typeof pdfSchema>
export type UploadBody = z.infer<typeof uploadSchema>
