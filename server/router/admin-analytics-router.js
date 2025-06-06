import express from 'express'
import { isAdmin } from '../middleware/admin-auth-middleware.js'
import { getAdminAnalyticsOverview,
         getEventTimeSeries,
         getSignupToDownloadFunnel,
         getUserRetention,
         getSecurityAnomalies,
         getDeviceAndGeoAnalytics,
         getApiPerformanceStats } from '../controller/admin-analytics-controller.js'
import userAuthorization from '../middleware/user-authorization.js'

const router = express.Router()

// GET /api/admin/analytics/overview
router.get('/overview', userAuthorization, isAdmin, getAdminAnalyticsOverview)
router.get('/timeseries', userAuthorization, isAdmin, getEventTimeSeries)
router.get('/funnel', userAuthorization, isAdmin, getSignupToDownloadFunnel)
router.get('/retention', userAuthorization, isAdmin, getUserRetention)
router.get('/security', userAuthorization, isAdmin, getSecurityAnomalies)
router.get('/device', userAuthorization, isAdmin, getDeviceAndGeoAnalytics)
router.get('/performance', userAuthorization, isAdmin, getApiPerformanceStats)

export default router
