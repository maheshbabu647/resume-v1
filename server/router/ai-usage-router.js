import express from 'express';
import {
  getOverallStats,
  getUsersUsageStats,
  getUserUsageStats,
  getAnonymousUsageStats,
  getServiceUsageStats,
  getUsageTrends,
  exportUsageData,
  fixDataInconsistency
} from '../controller/ai-usage-controller.js';

const router = express.Router();

/**
 * AI Usage Analytics Routes
 * All routes require admin authentication (should be applied at app level)
 */

// Overall statistics
router.get('/stats', getOverallStats);

// User-specific statistics
router.get('/users', getUsersUsageStats);
router.get('/users/:userId', getUserUsageStats);

// Anonymous usage
router.get('/anonymous', getAnonymousUsageStats);

// Service breakdown
router.get('/services', getServiceUsageStats);

// Usage trends over time
router.get('/trends', getUsageTrends);

// Export data
router.get('/export', exportUsageData);

// Fix data inconsistency (admin utility)
router.post('/fix-data', fixDataInconsistency);

export default router;

