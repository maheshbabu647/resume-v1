import Redis from 'ioredis'
import { env } from './env'
import { logger } from './logger'

// ─── Singleton client ─────────────────────────────────────────────────────────
// Import `redis` wherever you need it — never call new Redis() elsewhere.

export const redis = new Redis(env.REDIS_URL, {
  // Reconnect with exponential backoff, max 10 attempts
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 10) {
      logger.error('❌  Redis max reconnect attempts reached')
      return null // stop retrying
    }
    const delay = Math.min(times * 200, 3000)
    logger.warn(`⚠️   Redis reconnecting in ${delay}ms (attempt ${times})...`)
    return delay
  },
  lazyConnect: false,  // connect eagerly at startup so we fail fast
})

// ─── Event listeners ──────────────────────────────────────────────────────────

redis.on('connect', () => logger.info('✅  Redis connected'))
redis.on('error',   (err) => logger.error({ err }, '❌  Redis error'))
redis.on('close',   () => logger.warn('⚠️   Redis connection closed'))

// ─── Graceful shutdown helper ─────────────────────────────────────────────────
// Called by server.ts SIGTERM handler alongside disconnectDB()

export const disconnectRedis = async (): Promise<void> => {
  await redis.quit()
  logger.info('🔌  Redis disconnected')
}
