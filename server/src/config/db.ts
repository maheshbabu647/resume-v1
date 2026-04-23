import mongoose from 'mongoose'
import { env } from './env'
import { logger } from './logger'

// ─── Connect ──────────────────────────────────────────────────────────────────

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      // Recommended settings for production stability
      serverSelectionTimeoutMS: 5000,  // fail fast if DB unreachable at boot
      socketTimeoutMS: 45000,
    })
    logger.info(`✅  MongoDB connected: ${mongoose.connection.host}`)
  } catch (err) {
    logger.error({ err }, '❌  MongoDB connection failed')
    process.exit(1)
  }
}

// ─── Disconnect ───────────────────────────────────────────────────────────────
// Used in graceful shutdown handler in server.ts

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect()
  logger.info('🔌  MongoDB disconnected')
}

// ─── Connection event listeners ───────────────────────────────────────────────

mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️   MongoDB disconnected — attempting to reconnect...')
})

mongoose.connection.on('error', (err) => {
  logger.error({ err }, '❌  MongoDB error')
})

