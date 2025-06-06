import { logAnalyticsEvent } from '../service/analytics-logger.js'

const performanceLogger = (req, res, next) => {
  const start = process.hrtime.bigint()

  res.on('finish', async () => {
    const end = process.hrtime.bigint()
    const durationMs = Number(end - start) / 1e6 // convert nanoseconds to ms

    // Don't log static files or non-API routes (optional, can filter as you wish)
    if (req.originalUrl.startsWith('/api')) {
      await logAnalyticsEvent({
        eventType: 'api_performance',
        userId: req.user ? req.user.userId : null,
        meta: {
          url: req.originalUrl,
          method: req.method,
          status: res.statusCode,
          durationMs: Math.round(durationMs)
        }
      }, req)
    }
  })

  next()
}

export default performanceLogger
