import { z } from 'zod'
import { RESUME, AI, PAGINATION } from '../config/constants'

export const createResumeSchema = z.object({
  title:         z.string().min(1).max(RESUME.TITLE_MAX_LENGTH).trim(),
  templateId:    z.enum(RESUME.VALID_TEMPLATE_IDS),
  personalInfo:  z.record(z.unknown()).optional(),
  sections:      z.array(z.unknown()).optional(),
  customization: z.record(z.unknown()).optional(),
})

export const updateResumeSchema = z.object({
  title:         z.string().min(1).max(RESUME.TITLE_MAX_LENGTH).trim().optional(),
  status:        z.enum(RESUME.VALID_STATUSES).optional(),
  templateId:    z.enum(RESUME.VALID_TEMPLATE_IDS).optional(),
  personalInfo:  z.record(z.unknown()).optional(),
  sections:      z.array(z.unknown()).optional(),
  customization: z.record(z.unknown()).optional(),
  currentJdText: z.string().max(AI.JD_TEXT_MAX_CHARS).optional(),
}).refine((d) => Object.keys(d).length > 0, { message: 'At least one field must be provided.' })

export const resumeListQuerySchema = z.object({
  page:  z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(PAGINATION.DEFAULT_LIMIT),
})

export const resumeParamSchema = z.object({
  id: z.string().length(24, 'Invalid resume ID'),
})

export type CreateResumeBody = z.infer<typeof createResumeSchema>
export type UpdateResumeBody = z.infer<typeof updateResumeSchema>
export type ResumeListQuery  = z.infer<typeof resumeListQuerySchema>
