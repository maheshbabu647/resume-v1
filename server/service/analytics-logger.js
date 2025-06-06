import AnalyticsEvent from '../model/analytics-event-model.js'
import logger from '../config/logger.js'

export const logAnalyticsEvent = async ({ eventType, userId = null, meta = {} }, req = null) => {
  try {
    // Automatically add IP and User-Agent if request object is passed
    if (req) {
      meta.ip = req.ip
      meta.userAgent = req.get ? req.get('User-Agent') : undefined
      // You can add geoip lookups here if needed
    }
    await AnalyticsEvent.create({ eventType, userId, meta })
  } catch (err) {
    logger.warn(`[Analytics][Log][Fail] ${eventType} - ${err.message}`)
  }
}
