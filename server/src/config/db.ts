import mongoose from 'mongoose'
import { env } from './env'

// ─── Connect ──────────────────────────────────────────────────────────────────

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      // Recommended settings for production stability
      serverSelectionTimeoutMS: 5000,  // fail fast if DB unreachable at boot
      socketTimeoutMS: 45000,
    })
    console.log(`✅  MongoDB connected: ${mongoose.connection.host}`)
  } catch (err) {
    console.error('❌  MongoDB connection failed:', err)
    process.exit(1)
  }
}

// ─── Disconnect ───────────────────────────────────────────────────────────────
// Used in graceful shutdown handler in server.ts

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect()
  console.log('🔌  MongoDB disconnected')
}

// ─── Connection event listeners ───────────────────────────────────────────────

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️   MongoDB disconnected — attempting to reconnect...')
})

mongoose.connection.on('error', (err) => {
  console.error('❌  MongoDB error:', err)
})
