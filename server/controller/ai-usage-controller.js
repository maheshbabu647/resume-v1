import AIUsageTracker from '../util/ai-usage-tracker.js';
import AIUsage from '../model/ai-usage-model.js';
import User from '../model/user-model.js';
import logger from '../config/logger.js';

/**
 * AI Usage Analytics Controller
 * Admin endpoints for tracking AI usage and costs
 */

/**
 * Get overall AI usage statistics
 * @route GET /api/admin/ai-usage/stats
 */
export const getOverallStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const stats = await AIUsageTracker.getOverallStats({
      startDate,
      endDate
    });

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('[AIUsage] Failed to get overall stats:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve usage statistics',
      message: error.message
    });
  }
};

/**
 * Get AI usage statistics by user
 * @route GET /api/admin/ai-usage/users
 */
export const getUsersUsageStats = async (req, res) => {
  try {
    const { startDate, endDate, limit = 100, offset = 0 } = req.query;

    // Build query - FIXED: Also filter out null userIds
    const query = { 
      isAuthenticated: true,
      userId: { $ne: null } // Exclude records with null userId
    };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // DEBUG: Check what's in the database
    const sampleRecords = await AIUsage.find(query).limit(3);
    logger.info('[AIUsage][DEBUG] Sample authenticated records:', JSON.stringify(sampleRecords, null, 2));

    // Aggregate usage by user
    const usageByUser = await AIUsage.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$userId',
          userEmail: { $first: '$userEmail' },
          totalRequests: { $sum: 1 },
          successfulRequests: {
            $sum: { $cond: [{ $eq: ['$requestStatus', 'success'] }, 1, 0] }
          },
          failedRequests: {
            $sum: { $cond: [{ $eq: ['$requestStatus', 'failed'] }, 1, 0] }
          },
          totalInputTokens: { $sum: '$inputTokens' },
          totalOutputTokens: { $sum: '$outputTokens' },
          totalCost: { $sum: '$totalCost' },
          lastUsed: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $addFields: {
          userEmail: {
            $cond: {
              if: { $gt: [{ $size: '$userInfo' }, 0] },
              then: { $first: '$userInfo.userEmail' },
              else: '$userEmail'
            }
          },
          // DEBUG: Keep userInfo for logging
          _debug_userInfo: '$userInfo'
        }
      },
      { $project: { userInfo: 0 } },
      { $sort: { totalCost: -1 } },
      { $skip: parseInt(offset) },
      { $limit: parseInt(limit) }
    ]);

    // Get total count
    const totalUsers = await AIUsage.distinct('userId', query);

    // DEBUG: Log first user data
    if (usageByUser.length > 0) {
      logger.info('[AIUsage][DEBUG] First user data:', JSON.stringify(usageByUser[0], null, 2));
    }

    res.status(200).json({
      success: true,
      data: {
        users: usageByUser,
        total: totalUsers.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    logger.error('[AIUsage] Failed to get users usage stats:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user usage statistics',
      message: error.message
    });
  }
};

/**
 * Get AI usage statistics for a specific user
 * @route GET /api/admin/ai-usage/users/:userId
 */
export const getUserUsageStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    // Get user info
    const user = await User.findById(userId).select('name email createdAt');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Query for AFTER sign-up (authenticated usage)
    const afterQuery = { 
      userId,
      isAuthenticated: true
    };
    if (startDate || endDate) {
      afterQuery.createdAt = {};
      if (startDate) afterQuery.createdAt.$gte = new Date(startDate);
      if (endDate) afterQuery.createdAt.$lte = new Date(endDate);
    }

    const afterRecords = await AIUsage.find(afterQuery);

    // Query for BEFORE sign-up (anonymous but linked to this user)
    const beforeQuery = {
      userId,
      isAuthenticated: false
    };
    if (startDate || endDate) {
      beforeQuery.createdAt = {};
      if (startDate) beforeQuery.createdAt.$gte = new Date(startDate);
      if (endDate) beforeQuery.createdAt.$lte = new Date(endDate);
    }

    const beforeRecords = await AIUsage.find(beforeQuery);

    // Aggregate stats helper
    const aggregateStats = (records) => {
      const stats = {
        totalRequests: records.length,
        successfulRequests: records.filter(r => r.requestStatus === 'success').length,
        failedRequests: records.filter(r => r.requestStatus === 'failed').length,
        totalInputTokens: records.reduce((sum, r) => sum + r.inputTokens, 0),
        totalOutputTokens: records.reduce((sum, r) => sum + r.outputTokens, 0),
        totalCost: records.reduce((sum, r) => sum + r.totalCost, 0),
        byService: {},
        byModel: {}
      };

      records.forEach(record => {
        if (!stats.byService[record.service]) {
          stats.byService[record.service] = {
            requests: 0,
            inputTokens: 0,
            outputTokens: 0,
            cost: 0
          };
        }
        stats.byService[record.service].requests++;
        stats.byService[record.service].inputTokens += record.inputTokens;
        stats.byService[record.service].outputTokens += record.outputTokens;
        stats.byService[record.service].cost += record.totalCost;

        if (!stats.byModel[record.model]) {
          stats.byModel[record.model] = {
            requests: 0,
            inputTokens: 0,
            outputTokens: 0,
            cost: 0
          };
        }
        stats.byModel[record.model].requests++;
        stats.byModel[record.model].inputTokens += record.inputTokens;
        stats.byModel[record.model].outputTokens += record.outputTokens;
        stats.byModel[record.model].cost += record.totalCost;
      });

      return stats;
    };

    const afterStats = aggregateStats(afterRecords);
    const beforeStats = aggregateStats(beforeRecords);
    const allRecords = [...beforeRecords, ...afterRecords];
    const totalStats = aggregateStats(allRecords);

    logger.info(`[AIUsage] User ${userId} - Before records: ${beforeRecords.length}, After records: ${afterRecords.length}`);
    logger.info(`[AIUsage] Before stats:`, JSON.stringify(beforeStats).substring(0, 200));
    logger.info(`[AIUsage] After stats:`, JSON.stringify(afterStats).substring(0, 200));

    res.status(200).json({
      success: true,
      data: {
        user,
        before: beforeStats,
        after: afterStats,
        stats: totalStats, // Total for backward compatibility
        hasBeforeSignupData: beforeRecords.length > 0,
        history: allRecords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 100)
      }
    });
  } catch (error) {
    logger.error('[AIUsage] Failed to get user usage stats:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user usage statistics',
      message: error.message
    });
  }
};

/**
 * Get unauthenticated (anonymous) usage statistics
 * @route GET /api/admin/ai-usage/anonymous
 */
export const getAnonymousUsageStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Include both explicitly unauthenticated records AND records with null userId
    const query = { 
      $or: [
        { isAuthenticated: false },
        { userId: null }
      ]
    };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const records = await AIUsage.find(query);

    // Aggregate stats
    const stats = {
      totalRequests: records.length,
      successfulRequests: records.filter(r => r.requestStatus === 'success').length,
      failedRequests: records.filter(r => r.requestStatus === 'failed').length,
      totalInputTokens: records.reduce((sum, r) => sum + r.inputTokens, 0),
      totalOutputTokens: records.reduce((sum, r) => sum + r.outputTokens, 0),
      totalCost: records.reduce((sum, r) => sum + r.totalCost, 0),
      byService: {}
    };

    // Group by service with detailed token information
    records.forEach(record => {
      if (!stats.byService[record.service]) {
        stats.byService[record.service] = {
          requests: 0,
          inputTokens: 0,
          outputTokens: 0,
          cost: 0
        };
      }
      stats.byService[record.service].requests++;
      stats.byService[record.service].inputTokens += record.inputTokens;
      stats.byService[record.service].outputTokens += record.outputTokens;
      stats.byService[record.service].cost += record.totalCost;
    });

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('[AIUsage] Failed to get anonymous usage stats:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve anonymous usage statistics',
      message: error.message
    });
  }
};

/**
 * Get usage breakdown by service
 * @route GET /api/admin/ai-usage/services
 */
export const getServiceUsageStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const serviceStats = await AIUsage.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$service',
          totalRequests: { $sum: 1 },
          authenticatedRequests: {
            $sum: { $cond: ['$isAuthenticated', 1, 0] }
          },
          unauthenticatedRequests: {
            $sum: { $cond: ['$isAuthenticated', 0, 1] }
          },
          totalInputTokens: { $sum: '$inputTokens' },
          totalOutputTokens: { $sum: '$outputTokens' },
          totalCost: { $sum: '$totalCost' }
        }
      },
      { $sort: { totalCost: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: serviceStats
    });
  } catch (error) {
    logger.error('[AIUsage] Failed to get service usage stats:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve service usage statistics',
      message: error.message
    });
  }
};

/**
 * Get usage trends over time (daily/weekly/monthly)
 * @route GET /api/admin/ai-usage/trends
 */
export const getUsageTrends = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Determine date grouping format
    let dateFormat;
    switch (groupBy) {
      case 'hour':
        dateFormat = { $dateToString: { format: '%Y-%m-%d-%H', date: '$createdAt' } };
        break;
      case 'day':
        dateFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
        break;
      case 'week':
        dateFormat = { $dateToString: { format: '%Y-W%V', date: '$createdAt' } };
        break;
      case 'month':
        dateFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
        break;
      default:
        dateFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    }

    const trends = await AIUsage.aggregate([
      { $match: query },
      {
        $group: {
          _id: dateFormat,
          totalRequests: { $sum: 1 },
          authenticatedRequests: {
            $sum: { $cond: ['$isAuthenticated', 1, 0] }
          },
          unauthenticatedRequests: {
            $sum: { $cond: ['$isAuthenticated', 0, 1] }
          },
          totalCost: { $sum: '$totalCost' },
          totalInputTokens: { $sum: '$inputTokens' },
          totalOutputTokens: { $sum: '$outputTokens' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: trends
    });
  } catch (error) {
    logger.error('[AIUsage] Failed to get usage trends:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve usage trends',
      message: error.message
    });
  }
};

/**
 * Export usage data as CSV
 * @route GET /api/admin/ai-usage/export
 */
/**
 * Fix data inconsistency: Set isAuthenticated to false for records with null userId
 * @route POST /api/admin/ai-usage/fix-data
 */
export const fixDataInconsistency = async (req, res) => {
  try {
    // Find records where isAuthenticated is true but userId is null
    const inconsistentRecords = await AIUsage.find({
      isAuthenticated: true,
      userId: null
    });

    logger.info(`[AIUsage][DataFix] Found ${inconsistentRecords.length} inconsistent records`);

    // Update them to be unauthenticated
    const result = await AIUsage.updateMany(
      {
        isAuthenticated: true,
        userId: null
      },
      {
        $set: { isAuthenticated: false }
      }
    );

    logger.info(`[AIUsage][DataFix] Updated ${result.modifiedCount} records`);

    res.status(200).json({
      success: true,
      message: 'Data inconsistency fixed',
      recordsFound: inconsistentRecords.length,
      recordsUpdated: result.modifiedCount
    });
  } catch (error) {
    logger.error('[AIUsage] Failed to fix data inconsistency:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fix data inconsistency',
      message: error.message
    });
  }
};

export const exportUsageData = async (req, res) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const records = await AIUsage.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    if (format === 'csv') {
      // Generate CSV
      const headers = [
        'Date',
        'User Email',
        'Service',
        'Model',
        'Input Tokens',
        'Output Tokens',
        'Total Cost',
        'Status',
        'Authenticated'
      ];

      const csvRows = [headers.join(',')];
      records.forEach(record => {
        const row = [
          new Date(record.createdAt).toISOString(),
          record.userEmail || 'anonymous',
          record.service,
          record.model,
          record.inputTokens,
          record.outputTokens,
          record.totalCost.toFixed(6),
          record.requestStatus,
          record.isAuthenticated
        ];
        csvRows.push(row.join(','));
      });

      const csv = csvRows.join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=ai-usage-${Date.now()}.csv`);
      res.send(csv);
    } else {
      // Return JSON
      res.status(200).json({
        success: true,
        data: records
      });
    }
  } catch (error) {
    logger.error('[AIUsage] Failed to export usage data:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to export usage data',
      message: error.message
    });
  }
};

