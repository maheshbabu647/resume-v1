import AnalyticsEvent from '../model/analytics-event-model.js'

// Helper: date math
const daysAgo = (n) => {
  const d = new Date()
  d.setHours(0,0,0,0)
  d.setDate(d.getDate() - n)
  return d
}

/**
 * Overview analytics for admin dashboard
 * Returns total users, new users, resumes created, downloads, template usage, etc.
 */
export const getAdminAnalyticsOverview = async (req, res, next) => {
  try {
    // Key event counts
    const [
      totalUsers,
      newUsersToday,
      totalResumes,
      newResumesToday,
      totalDownloads,
      downloadsToday,
      totalTemplates,
      templateCreationsToday
    ] = await Promise.all([
      AnalyticsEvent.countDocuments({ eventType: 'user_signup' }),
      AnalyticsEvent.countDocuments({ eventType: 'user_signup', timestamp: { $gte: daysAgo(1) } }),
      AnalyticsEvent.countDocuments({ eventType: 'resume_create' }),
      AnalyticsEvent.countDocuments({ eventType: 'resume_create', timestamp: { $gte: daysAgo(1) } }),
      AnalyticsEvent.countDocuments({ eventType: 'resume_download' }),
      AnalyticsEvent.countDocuments({ eventType: 'resume_download', timestamp: { $gte: daysAgo(1) } }),
      AnalyticsEvent.countDocuments({ eventType: 'template_create' }),
      AnalyticsEvent.countDocuments({ eventType: 'template_create', timestamp: { $gte: daysAgo(1) } })
    ])

    // Top templates (by resume_create)
    const templateUsage = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'resume_create', 'meta.templateId': { $exists: true } } },
      { $group: { _id: '$meta.templateId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])

    // Top active users (by resume_create)
    const topUsers = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'resume_create', userId: { $ne: null } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])

    res.json({
      totalUsers,
      newUsersToday,
      totalResumes,
      newResumesToday,
      totalDownloads,
      downloadsToday,
      totalTemplates,
      templateCreationsToday,
      topTemplates: templateUsage,
      topUsers
    })
  } catch (err) {
    next(err)
  }
}


/**
 * Returns daily event counts for a given eventType and period
 * GET /api/admin/analytics/timeseries?eventType=user_signup&days=30
 */
export const getEventTimeSeries = async (req, res, next) => {
  try {
    const { eventType, days = 30 } = req.query
    if (!eventType) {
      const err = new Error('eventType query param is required')
      err.status = 400
      return next(err)
    }
    const daysInt = parseInt(days)
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
    startDate.setDate(startDate.getDate() - daysInt + 1)

    const data = await AnalyticsEvent.aggregate([
      { $match: { eventType, timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    // Fill missing days with 0s (for smooth graphs)
    const result = []
    for (let i = 0; i < daysInt; i++) {
      const d = new Date(startDate)
      d.setDate(d.getDate() + i)
      const dayStr = d.toISOString().slice(0, 10)
      const found = data.find(x => x._id === dayStr)
      result.push({ date: dayStr, count: found ? found.count : 0 })
    }

    res.json({ eventType, days: daysInt, data: result })
  } catch (err) {
    next(err)
  }
}

/**
 * Returns a simple funnel for user signup → resume_create → resume_download
 * GET /api/admin/analytics/funnel?days=30
 */
export const getSignupToDownloadFunnel = async (req, res, next) => {
  try {
    const { days = 30 } = req.query
    const daysInt = parseInt(days)
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
    startDate.setDate(startDate.getDate() - daysInt + 1)

    // Step 1: New signups
    const signups = await AnalyticsEvent.distinct('userId', {
      eventType: 'user_signup',
      timestamp: { $gte: startDate },
      userId: { $ne: null }
    })

    // Step 2: Of those, who created at least one resume
    const resumeCreators = await AnalyticsEvent.distinct('userId', {
      eventType: 'resume_create',
      timestamp: { $gte: startDate },
      userId: { $in: signups }
    })

    // Step 3: Of those, who downloaded at least once
    const downloaders = await AnalyticsEvent.distinct('userId', {
      eventType: 'resume_download',
      timestamp: { $gte: startDate },
      userId: { $in: resumeCreators }
    })

    res.json({
      funnel: [
        { stage: 'Signups', count: signups.length },
        { stage: 'Created Resume', count: resumeCreators.length },
        { stage: 'Downloaded Resume', count: downloaders.length }
      ],
      days: daysInt
    })
  } catch (err) {
    next(err)
  }
}


/**
 * Returns retention data: What % of users come back on D1, D3, D7, D14 after signup?
 * GET /api/admin/analytics/retention?days=14
 */
export const getUserRetention = async (req, res, next) => {
  try {
    const { days = 14 } = req.query
    const daysInt = parseInt(days)
    const signupStart = new Date()
    signupStart.setHours(0, 0, 0, 0)
    signupStart.setDate(signupStart.getDate() - daysInt + 1)

    // Get all signups within the window
    const signups = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'user_signup', timestamp: { $gte: signupStart }, userId: { $ne: null } } },
      { $project: { userId: 1, signupDay: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, signupTime: "$timestamp" } }
    ])

    // Prepare result: { [daysSinceSignup]: %retained }
    const retention = {}

    for (const d of [1, 3, 7, 14]) {
      let retained = 0
      for (const s of signups) {
        // Did this user do anything (event) Dn days after signup?
        const afterDate = new Date(s.signupTime)
        afterDate.setDate(afterDate.getDate() + d)
        const beforeDate = new Date(afterDate)
        beforeDate.setHours(23, 59, 59, 999)

        const event = await AnalyticsEvent.findOne({
          userId: s.userId,
          timestamp: { $gte: afterDate, $lte: beforeDate }
        })
        if (event) retained++
      }
      retention[`Day${d}`] = signups.length === 0 ? 0 : Math.round((retained / signups.length) * 100)
    }

    res.json({ cohortSize: signups.length, retention })
  } catch (err) {
    next(err)
  }
}


/**
 * Security & anomaly analytics: failed logins, rate limit hits, suspicious activity
 * GET /api/admin/analytics/security?days=7
 */
export const getSecurityAnomalies = async (req, res, next) => {
  try {
    const { days = 7 } = req.query
    const daysInt = parseInt(days)
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
    startDate.setDate(startDate.getDate() - daysInt + 1)

    // 1. Count failed logins
    const failedLogins = await AnalyticsEvent.countDocuments({
      eventType: 'user_signin_failed',
      timestamp: { $gte: startDate }
    })

    // 2. Find IPs/users with repeated failed logins (possible brute-force)
    const topFailIPs = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'user_signin_failed', timestamp: { $gte: startDate } } },
      { $group: { _id: '$meta.ip', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])

    // 3. Rate limit hits
    const rateLimitHits = await AnalyticsEvent.countDocuments({
      eventType: 'rate_limit_hit',
      timestamp: { $gte: startDate }
    })

    // 4. Error spikes (any eventType that starts with 'error_')
    const errorEvents = await AnalyticsEvent.countDocuments({
      eventType: { $regex: /^error_/ },
      timestamp: { $gte: startDate }
    })

    res.json({
      days: daysInt,
      failedLogins,
      topFailIPs,
      rateLimitHits,
      errorEvents
    })
  } catch (err) {
    next(err)
  }
}


/**
 * Device & geo analytics: top browsers, OS, and IPs
 * GET /api/admin/analytics/device?days=30
 */
export const getDeviceAndGeoAnalytics = async (req, res, next) => {
  try {
    const { days = 30 } = req.query
    const daysInt = parseInt(days)
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
    startDate.setDate(startDate.getDate() - daysInt + 1)

    // Aggregate top user agents (browsers/devices)
    const topAgents = await AnalyticsEvent.aggregate([
      { $match: { timestamp: { $gte: startDate }, 'meta.userAgent': { $exists: true } } },
      { $group: { _id: '$meta.userAgent', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])

    // Aggregate top IPs
    const topIPs = await AnalyticsEvent.aggregate([
      { $match: { timestamp: { $gte: startDate }, 'meta.ip': { $exists: true } } },
      { $group: { _id: '$meta.ip', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])

    res.json({
      days: daysInt,
      topUserAgents: topAgents,
      topIPs: topIPs
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Performance analytics: average and slowest endpoint stats
 * GET /api/admin/analytics/performance?days=7
 */
export const getApiPerformanceStats = async (req, res, next) => {
  try {
    const { days = 7 } = req.query
    const daysInt = parseInt(days)
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
    startDate.setDate(startDate.getDate() - daysInt + 1)

    // 1. Average duration per endpoint (grouped by url+method)
    const avgByEndpoint = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'api_performance', timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: { url: '$meta.url', method: '$meta.method' },
          avgDuration: { $avg: '$meta.durationMs' },
          maxDuration: { $max: '$meta.durationMs' },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgDuration: -1 } }, // slowest first
      { $limit: 10 }
    ])

    // 2. Find slowest single requests
    const slowestRequests = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'api_performance', timestamp: { $gte: startDate } } },
      {
        $project: {
          url: '$meta.url',
          method: '$meta.method',
          durationMs: '$meta.durationMs',
          status: '$meta.status',
          userId: 1,
          timestamp: 1
        }
      },
      { $sort: { durationMs: -1 } },
      { $limit: 10 }
    ])

    res.json({
      days: daysInt,
      avgByEndpoint,
      slowestRequests
    })
  } catch (err) {
    next(err)
  }
}