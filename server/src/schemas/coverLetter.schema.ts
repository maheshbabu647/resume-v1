import { z } from 'zod'
import { COVER_LETTER, PAGINATION } from '../config/constants'

export const createCoverLetterSchema = z.object({
  title:         z.string().min(1).max(COVER_LETTER.TITLE_MAX_LENGTH).trim(),
  subject:       z.string().max(300).optional(),
  recipientName: z.string().max(200).optional(),
  companyName:   z.string().max(200).optional(),
  roleName:      z.string().max(200).optional(),
  body:          z.string().min(1).max(COVER_LETTER.BODY_MAX_LENGTH),
  tone:          z.enum(COVER_LETTER.VALID_TONES).default('professional'),
  wordCount:     z.number().int().min(0).optional(),
  keywordsUsed:  z.array(z.string()).optional(),
  resumeId:      z.string().length(24, 'Invalid resume ID').optional(),
})

export const updateCoverLetterSchema = z.object({
  title:         z.string().min(1).max(COVER_LETTER.TITLE_MAX_LENGTH).trim().optional(),
  subject:       z.string().max(300).optional(),
  recipientName: z.string().max(200).optional(),
  companyName:   z.string().max(200).optional(),
  roleName:      z.string().max(200).optional(),
  body:          z.string().min(1).max(COVER_LETTER.BODY_MAX_LENGTH).optional(),
  tone:          z.enum(COVER_LETTER.VALID_TONES).optional(),
  wordCount:     z.number().int().min(0).optional(),
}).refine((d) => Object.keys(d).length > 0, { message: 'At least one field must be provided.' })

export const coverLetterListQuerySchema = z.object({
  page:  z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(PAGINATION.DEFAULT_LIMIT),
})

export const coverLetterParamSchema = z.object({
  id: z.string().length(24, 'Invalid cover letter ID'),
})

export type CreateCoverLetterBody = z.infer<typeof createCoverLetterSchema>
export type UpdateCoverLetterBody = z.infer<typeof updateCoverLetterSchema>
export type CoverLetterListQuery  = z.infer<typeof coverLetterListQuerySchema>
