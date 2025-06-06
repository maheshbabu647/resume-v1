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
