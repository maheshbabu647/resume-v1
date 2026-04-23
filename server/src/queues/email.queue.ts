import { Queue, Worker, type Job } from 'bullmq'
import { env } from '../config/env'
import { sendOtpEmail, sendPasswordResetEmail } from '../services/mailer.service'
import { logger } from '../config/logger'

// ─── Connection options (reuse the same Redis URL) ───────────────────────────
const connection = { url: env.REDIS_URL }

// ─── Queue ───────────────────────────────────────────────────────────────────
export interface EmailJobData {
  type: 'otp' | 'password-reset'
  to: string
  /** OTP code — required when type === 'otp' */
  otp?: string
  /** Reset URL — required when type === 'password-reset' */
  resetUrl?: string
}

export const emailQueue = new Queue<EmailJobData>('email', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5_000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 200 },
  },
})

// ─── Worker ──────────────────────────────────────────────────────────────────
let emailWorker: Worker<EmailJobData> | null = null

export const startEmailWorker = (): void => {
  emailWorker = new Worker<EmailJobData>(
    'email',
    async (job: Job<EmailJobData>) => {
      const { type, to, otp, resetUrl } = job.data
      if (type === 'otp') {
        if (!otp) throw new Error('Email job validation failed: otp field is required for type=otp')
        await sendOtpEmail(to, otp)
        logger.info({ jobId: job.id, to }, 'OTP email sent')
      } else if (type === 'password-reset') {
        if (!resetUrl) throw new Error('Email job validation failed: resetUrl is required for type=password-reset')
        await sendPasswordResetEmail(to, resetUrl)
        logger.info({ jobId: job.id, to }, 'Password reset email sent')
      }
    },
    {
      connection,
      concurrency: 5,
    },
  )

  emailWorker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Email job failed')
  })

  logger.info('📧  Email worker started')
}

export const closeEmailWorker = async (): Promise<void> => {
  if (emailWorker) {
    await emailWorker.close()
    emailWorker = null
    logger.info('📧  Email worker closed')
  }
  await emailQueue.close()
}
