import app from './app.js'
import logger from './config/logger.js'
import { connectDB, disConnectDB } from './config/db-connect.js'

const PORT = process.env.PORT || 5000

let shuttingDown = false // [PREVENT DOUBLE SHUTDOWN]

// [1] Start server with DB connection
const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      logger.info(`[Server][Start][Success] Server is running on port ${PORT} [ENV: ${process.env.NODE_ENV}]`)
      // [OPTIONAL] Log server user/group for prod (if running as non-root on Linux)
      // logger.info(`[Server][User] UID: ${process.getuid?.()}, GID: ${process.getgid?.()}`)
    })
  } catch (error) {
    logger.error(`[Server][Start][Error] Failed to start: ${error.message}`)
    process.exit(1)
  }
}

// [2] Graceful shutdown logic
const stopServer = async (signal) => {
  if (shuttingDown) return // [PREVENT DOUBLE SHUTDOWN]
  shuttingDown = true

  logger.info(`[Server][Shutdown] Received ${signal}. Closing app gracefully...`)
  try {
    await disConnectDB()
    logger.info('[Server][Shutdown][Success] Database disconnected. Exiting...')
    process.exit(0)
  } catch (error) {
    logger.error(`[Server][Shutdown][Error] ${error.message}`)
    process.exit(1)
  }
}

// [3] Catch OS signals for graceful shutdown
process.on('SIGINT', () => stopServer('SIGINT'))
process.on('SIGTERM', () => stopServer('SIGTERM'))

// [4] Handle fatal errors: crash fast, don't stay in bad state
process.on('uncaughtException', (err) => {
  logger.error(`[Server][UncaughtException] ${err.message}\n${err.stack}`)
  process.exit(1)
})
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`[Server][UnhandledRejection] ${reason}`)
  process.exit(1)
})

startServer()
