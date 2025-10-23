import apiServer from "./index.js"; // Your configured Axios instance

/**
 * Fetches the analytics overview data for the admin dashboard.
 */
export const getAnalyticsOverview = async () => {
  try {
    const response = await apiServer.get('/admin/analytics/overview');
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics overview:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch analytics overview.' };
  }
};

/**
 * Fetches time series data for a specific event type.
 */
export const getAnalyticsTimeSeries = async (eventType, days = 30) => {
  try {
    if (!eventType) {
      throw new Error("eventType parameter is required for fetching time series data.");
    }
    const response = await apiServer.get('/admin/analytics/timeseries', {
      params: { eventType, days },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching time series for ${eventType}:`, error.response?.data || error.message);
    throw error.response?.data || { message: `Failed to fetch time series data for ${eventType}.` };
  }
};

/**
 * Fetches the signup-to-download funnel analytics data.
 */
export const getAnalyticsFunnel = async (days = 30) => {
  try {
    const response = await apiServer.get('/admin/analytics/funnel', {
      params: { days },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics funnel:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch analytics funnel data.' };
  }
};

/**
 * Fetches user retention analytics data.
 */
export const getAnalyticsRetention = async (days = 14) => {
  try {
    const response = await apiServer.get('/admin/analytics/retention', {
      params: { days },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics retention:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch analytics retention data.' };
  }
};

/**
 * Fetches security anomaly analytics data.
 */
export const getAnalyticsSecurity = async (days = 7) => {
  try {
    const response = await apiServer.get('/admin/analytics/security', {
      params: { days },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching security analytics:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch security analytics data.' };
  }
};

/**
 * Fetches device and geo analytics data.
 */
export const getAnalyticsDevice = async (days = 30) => {
  try {
    const response = await apiServer.get('/admin/analytics/device', {
      params: { days },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching device analytics:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch device analytics data.' };
  }
};

/**
 * Fetches API performance statistics.
 * @param {number} [days=7] - The number of past days for the analysis.
 * @returns {Promise<object>} A promise that resolves to the API performance data.
 * @throws {Error} If the API request fails.
 */
export const getAnalyticsPerformance = async (days = 7) => {
  try {
    const response = await apiServer.get('/admin/analytics/performance', {
      params: {
        days,
      },
    });
    // Expected: { days, avgByEndpoint: [...], slowestRequests: [...] }
    return response.data;
  } catch (error) {
    console.error('Error fetching API performance analytics:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch API performance data.' };
  }
};

/**
 * Fetches all users with their resume information for admin dashboard.
 * @param {number} [page=1] - The page number for pagination.
 * @param {number} [limit=20] - The number of users per page.
 * @param {string} [search=''] - Search term for filtering users by name or email.
 * @returns {Promise<object>} A promise that resolves to the users data with pagination.
 * @throws {Error} If the API request fails.
 */
export const getAdminUsers = async (page = 1, limit = 20, search = '') => {
  try {
    const response = await apiServer.get('/admin/analytics/users', {
      params: {
        page,
        limit,
        search,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin users:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch users data.' };
  }
};

// ==================== AI Usage Analytics APIs ====================

/**
 * Fetches overall AI usage statistics
 * @param {string} [startDate] - Optional start date (YYYY-MM-DD)
 * @param {string} [endDate] - Optional end date (YYYY-MM-DD)
 * @returns {Promise<object>} Overall AI usage statistics
 */
export const getAIUsageStats = async (startDate = '', endDate = '') => {
  try {
    const response = await apiServer.get('/admin/ai-usage/stats', {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching AI usage stats:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch AI usage statistics.' };
  }
};

/**
 * Fetches AI usage by users
 * @param {number} [limit=50] - Number of users to fetch
 * @param {number} [offset=0] - Offset for pagination
 * @param {string} [startDate] - Optional start date (YYYY-MM-DD)
 * @param {string} [endDate] - Optional end date (YYYY-MM-DD)
 * @returns {Promise<object>} User AI usage data
 */
export const getAIUsageByUsers = async (limit = 50, offset = 0, startDate = '', endDate = '') => {
  try {
    const response = await apiServer.get('/admin/ai-usage/users', {
      params: { limit, offset, startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching AI usage by users:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch user AI usage data.' };
  }
};

/**
 * Fetches AI usage for a specific user
 * @param {string} userId - User ID
 * @param {string} [startDate] - Optional start date (YYYY-MM-DD)
 * @param {string} [endDate] - Optional end date (YYYY-MM-DD)
 * @returns {Promise<object>} Specific user AI usage data
 */
export const getAIUsageByUser = async (userId, startDate = '', endDate = '') => {
  try {
    const response = await apiServer.get(`/admin/ai-usage/users/${userId}`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user AI usage:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch user AI usage data.' };
  }
};

/**
 * Fetches anonymous user AI usage statistics
 * @param {string} [startDate] - Optional start date (YYYY-MM-DD)
 * @param {string} [endDate] - Optional end date (YYYY-MM-DD)
 * @returns {Promise<object>} Anonymous user AI usage data
 */
export const getAIUsageAnonymous = async (startDate = '', endDate = '') => {
  try {
    const response = await apiServer.get('/admin/ai-usage/anonymous', {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching anonymous AI usage:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch anonymous AI usage data.' };
  }
};

/**
 * Fixes data inconsistency in AI usage records
 * @returns {Promise<object>} Fix result
 */
export const fixAIUsageDataInconsistency = async () => {
  try {
    const response = await apiServer.post('/admin/ai-usage/fix-data');
    return response.data;
  } catch (error) {
    console.error('Error fixing AI usage data:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fix AI usage data inconsistency.' };
  }
};

/**
 * Fetches AI usage by service
 * @param {string} [startDate] - Optional start date (YYYY-MM-DD)
 * @param {string} [endDate] - Optional end date (YYYY-MM-DD)
 * @returns {Promise<object>} Service-level AI usage data
 */
export const getAIUsageByService = async (startDate = '', endDate = '') => {
  try {
    const response = await apiServer.get('/admin/ai-usage/services', {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching AI usage by service:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch service AI usage data.' };
  }
};

/**
 * Fetches AI usage trends over time
 * @param {string} [groupBy='day'] - Group by 'hour', 'day', 'week', or 'month'
 * @param {string} [startDate] - Optional start date (YYYY-MM-DD)
 * @param {string} [endDate] - Optional end date (YYYY-MM-DD)
 * @returns {Promise<object>} Time-series AI usage trends
 */
export const getAIUsageTrends = async (groupBy = 'day', startDate = '', endDate = '') => {
  try {
    const response = await apiServer.get('/admin/ai-usage/trends', {
      params: { groupBy, startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching AI usage trends:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch AI usage trends.' };
  }
};

/**
 * Exports AI usage data
 * @param {string} [format='json'] - Export format ('json' or 'csv')
 * @param {string} [startDate] - Optional start date (YYYY-MM-DD)
 * @param {string} [endDate] - Optional end date (YYYY-MM-DD)
 * @returns {Promise<Blob|object>} Exported data
 */
export const exportAIUsageData = async (format = 'json', startDate = '', endDate = '') => {
  try {
    const response = await apiServer.get('/admin/ai-usage/export', {
      params: { format, startDate, endDate },
      responseType: format === 'csv' ? 'blob' : 'json',
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting AI usage data:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to export AI usage data.' };
  }
};