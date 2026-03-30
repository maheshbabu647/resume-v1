import Redis from 'ioredis'
import { env } from './env'

// ─── Singleton client ─────────────────────────────────────────────────────────
// Import `redis` wherever you need it — never call new Redis() elsewhere.

export const redis = new Redis(env.REDIS_URL, {
  // Reconnect with exponential backoff, max 10 attempts
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 10) {
      console.error('❌  Redis max reconnect attempts reached')
      return null // stop retrying
    }
    const delay = Math.min(times * 200, 3000)
    console.warn(`⚠️   Redis reconnecting in ${delay}ms (attempt ${times})...`)
    return delay
  },
  lazyConnect: false,  // connect eagerly at startup so we fail fast
})

// ─── Event listeners ──────────────────────────────────────────────────────────

redis.on('connect', () => console.log('✅  Redis connected'))
redis.on('error',   (err) => console.error('❌  Redis error:', err))
redis.on('close',   () => console.warn('⚠️   Redis connection closed'))

// ─── Graceful shutdown helper ─────────────────────────────────────────────────
// Called by server.ts SIGTERM handler alongside disconnectDB()

export const disconnectRedis = async (): Promise<void> => {
  await redis.quit()
  console.log('🔌  Redis disconnected')
}
