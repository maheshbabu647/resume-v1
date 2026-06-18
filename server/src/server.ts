import { app }            from './app'
import { env }            from './config/env'
import { logger }         from './config/logger'
import { connectDB, disconnectDB } from './config/db'
import { disconnectRedis }         from './config/redis'
import { closeBrowser }            from './lib/pdf'
import { startEmailWorker, closeEmailWorker } from './queues/email.queue'

// ─── Boot ─────────────────────────────────────────────────────────────────────

const start = async () => {
  // Connect to data stores first — fail fast if unavailable
  await connectDB()

  // Start background workers
  startEmailWorker()

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀  Server listening on port ${env.PORT}  [${env.NODE_ENV}]`)
  })

  // ─── Graceful shutdown ───────────────────────────────────────────────────

  const shutdown = async (signal: string) => {
    logger.warn(`${signal} received — shutting down gracefully...`)

    server.close(async () => {
      await Promise.allSettled([
        disconnectDB(),
        disconnectRedis(),
        closeBrowser(),
        closeEmailWorker(),
      ])
      logger.info('✅  Server shut down cleanly.')
      process.exit(0)
    })

    // Force exit if graceful shutdown takes too long
    setTimeout(() => {
      logger.error('❌  Forced shutdown after timeout.')
      process.exit(1)
    }, 10_000)
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT',  () => shutdown('SIGINT'))
}

start().catch((err) => {
  logger.error({ err }, '❌  Failed to start server')
  process.exit(1)
})

