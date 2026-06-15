import { z } from 'zod'
import { AI } from '../config/constants'

export const jdTailorSchema = z.object({
  resumeId: z.string().length(24, 'Invalid resume ID'),
  jdText:   z.string().min(50).max(AI.JD_TEXT_MAX_CHARS),
  personalInfo: z.record(z.any()),
  sections: z.array(z.unknown()).min(1),
})

export const tailorNewSchema = z.object({
  resumeText: z.string().min(50, 'Resume text too short').max(12000, 'Resume text too long'),
  jdText:     z.string().min(50, 'JD too short').max(AI.JD_TEXT_MAX_CHARS, 'JD too long'),
  templateId: z.string().min(1),
})

export const suggestSchema = z.object({
  resumeId:      z.string().length(24, 'Invalid resume ID').optional(), // optional for unsaved resumes
  sectionKey:    z.string().min(1),
  entryIndex:    z.number().int().min(0).optional(),
  fieldName:     z.string().min(1),
  currentValue:  z.string().min(1),
  contextFields: z.record(z.string()).optional(),
  userNotes:     z.string().max(500).optional(),
})

export const analyzeJdSchema = z.object({
  serializedResume: z.string().min(10, 'Provide serialized resume text'),
  preprocessedJD: z.string().min(10, 'Provide preprocessed JD text').max(15000, 'JD text too large'),
})

export const jdSpecSchema = z.object({
  jdText: z.string().min(50, 'JD too short').max(15000, 'JD text too large'),
})

export const coverLetterSchema = z.object({
  resumeText: z.string().min(50, 'Resume text too short').max(12000, 'Resume text too long'),
  jdText:     z.string().min(50, 'JD too short').max(AI.JD_TEXT_MAX_CHARS, 'JD too long'),
  tone:       z.enum(['professional', 'enthusiastic', 'concise', 'creative']).default('professional'),
})

export const rewriteParagraphSchema = z.object({
  paragraph:   z.string().min(1, 'Paragraph cannot be empty').max(2000, 'Paragraph too long'),
  instruction: z.string().min(1, 'Instruction required').max(200, 'Instruction too long'),
  tone:        z.enum(['professional', 'enthusiastic', 'concise', 'creative']).optional(),
  jdText:      z.string().max(AI.JD_TEXT_MAX_CHARS).optional(),
})

export type JdTailorBody         = z.infer<typeof jdTailorSchema>
export type SuggestBody          = z.infer<typeof suggestSchema>
export type AnalyzeJdBody        = z.infer<typeof analyzeJdSchema>
export type TailorNewBody        = z.infer<typeof tailorNewSchema>
export type CoverLetterBody      = z.infer<typeof coverLetterSchema>
export type RewriteParagraphBody = z.infer<typeof rewriteParagraphSchema>
export type JdSpecBody           = z.infer<typeof jdSpecSchema>
