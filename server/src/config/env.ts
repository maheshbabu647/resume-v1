import { z } from 'zod'

const envSchema = z.object({
  // Server
  NODE_ENV:   z.enum(['development', 'production', 'test']).default('development'),
  PORT:       z.string().default('4000').transform(Number),
  CLIENT_URL: z.string().url(),

  // MongoDB
  MONGODB_URI: z.string().min(1),

  // Redis
  REDIS_URL: z.string().min(1),

  // JWT
  JWT_ACCESS_SECRET:  z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRY:  z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // Google OAuth 2.0
  GOOGLE_CLIENT_ID:     z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_CALLBACK_URL:  z.string().url(),

  // Google AI — Gemini
  GEMINI_API_KEY: z.string().min(1),

  // Google Cloud Storage
  GCS_PROJECT_ID:  z.string().optional(),
  GCS_BUCKET_NAME: z.string().optional(),
  GCS_PUBLIC_URL:  z.string().optional(),
  // Local dev only — path to service account JSON key file.
  // In Cloud Run, ADC is used automatically (no key file needed).
  GCS_KEY_FILE: z.string().optional(),

  // Razorpay
  RAZORPAY_KEY_ID:            z.string().optional(),
  RAZORPAY_KEY_SECRET:        z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET:    z.string().optional(),
  RAZORPAY_PLAN_ID_HUSTLER:   z.string().optional(),
  RAZORPAY_PLAN_ID_CLOSER:    z.string().optional(),

  // SMTP
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().default('587').transform(Number),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),

  // Sentry
  SENTRY_DSN: z.string().url().optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('\n❌  Invalid environment variables:\n')
  parsed.error.errors.forEach((e) => {
    console.error(`  ${e.path.join('.')} — ${e.message}`)
  })
  console.error('\nFix the above in your .env file and restart.\n')
  process.exit(1)
}

export const env = parsed.data
export type Env = typeof env
