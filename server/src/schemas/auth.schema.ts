import { z } from 'zod'

export const registerSchema = z.object({
  name:     z.string().min(2).max(100).trim(),
  email:    z.string().email().toLowerCase().trim(),
  password: z.string().min(8).max(128),
  referralCode: z.string().optional(),
})

export const loginSchema = z.object({
  email:    z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
})

export const verifyEmailSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  otp:   z.string().length(6),
})

export const resendOtpSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
})

export type RegisterBody    = z.infer<typeof registerSchema>
export type LoginBody       = z.infer<typeof loginSchema>
export type VerifyEmailBody = z.infer<typeof verifyEmailSchema>
export type ResendOtpBody   = z.infer<typeof resendOtpSchema>
