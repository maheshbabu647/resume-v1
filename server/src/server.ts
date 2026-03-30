import { app }            from './app'
import { env }            from './config/env'
import { connectDB, disconnectDB } from './config/db'
import { disconnectRedis }         from './config/redis'
import { closeBrowser }            from './lib/pdf'

// ─── Boot ─────────────────────────────────────────────────────────────────────

const start = async () => {
  // Connect to data stores first — fail fast if unavailable
  await connectDB()

  const server = app.listen(env.PORT, () => {
    console.log(`🚀  Server listening on port ${env.PORT}  [${env.NODE_ENV}]`)
  })

  // ─── Graceful shutdown ───────────────────────────────────────────────────

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received — shutting down gracefully...`)

    server.close(async () => {
      await Promise.allSettled([
        disconnectDB(),
        disconnectRedis(),
        closeBrowser(),
      ])
      console.log('✅  Server shut down cleanly.')
      process.exit(0)
    })

    // Force exit if graceful shutdown takes too long
    setTimeout(() => {
      console.error('❌  Forced shutdown after timeout.')
      process.exit(1)
    }, 10_000)
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT',  () => shutdown('SIGINT'))
}

start().catch((err) => {
  console.error('❌  Failed to start server:', err)
  process.exit(1)
})
