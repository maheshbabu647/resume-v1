import { z } from 'zod'

export const updateUserSchema = z.object({
  name:      z.string().min(2).max(100).trim().optional(),
  avatarUrl: z.string().url().optional(),
}).refine((d) => Object.keys(d).length > 0, { message: 'At least one field must be provided.' })

export type UpdateUserBody = z.infer<typeof updateUserSchema>
