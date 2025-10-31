import AIUsage from '../model/ai-usage-model.js';
import logger from '../config/logger.js';

/**
 * AI Usage Tracker Utility
 * Tracks token usage and costs for all AI API calls
 */

class AIUsageTracker {
  /**
   * Log AI usage to database
   * @param {Object} params - Usage parameters
   * @param {string} params.service - Service name (resume_summary, ats_analysis, etc.)
   * @param {string} params.model - Model used (gemini-2.5-flash, gemini-2.0-flash-exp)
   * @param {number} params.inputTokens - Number of input tokens
   * @param {number} params.outputTokens - Number of output tokens
   * @param {Object} params.user - User object (or null if not authenticated)
   * @param {string} params.sessionId - Session ID for anonymous users (optional)
   * @param {boolean} params.success - Whether the request was successful
   * @param {string} params.errorMessage - Error message if failed
   * @param {Object} params.metadata - Additional metadata
   * @returns {Promise<Object>} - Created usage record
   */
  static async logUsage({
    service,
    model,
    inputTokens = 0,
    outputTokens = 0,
    user = null,
    sessionId = null,
    success = true,
    errorMessage = null,
    metadata = {}
  }) {
    try {
      // Debug: Log user object to verify it has the correct fields
      if (user) {
        logger.info(`[AIUsage][DEBUG] User object received:`, {
          hasId: !!user._id,
          hasEmail: !!user.email,
          userId: user._id,
          userEmail: user.email
        });
      }

      const usageRecord = new AIUsage({
        userId: user?._id || null,
        userEmail: user?.email || null,
        isAuthenticated: !!user,
        sessionId: sessionId || null,
        service,
        model,
        inputTokens,
        outputTokens,
        requestStatus: success ? 'success' : 'failed',
        errorMessage,
        metadata
      });

      // Costs are calculated automatically via pre-save hook
      await usageRecord.save();

      logger.info(`[AIUsage] Logged usage - Service: ${service}, Model: ${model}, Tokens: ${inputTokens}/${outputTokens}, Cost: $${usageRecord.totalCost.toFixed(6)}, User: ${user?.email || 'anonymous'}, Session: ${sessionId || 'none'}`);

      return usageRecord;
    } catch (error) {
      logger.error('[AIUsage] Failed to log usage:', error.message);
      // Don't throw error - we don't want to break the main functionality
      return null;
    }
  }

  /**
   * Extract token counts from Gemini API response
   * @param {Object} result - Gemini API result object
   * @returns {Object} - { inputTokens, outputTokens }
   */
  static extractTokenCounts(result) {
    try {
      // Gemini API includes usage metadata in the response
      const usageMetadata = result?.response?.usageMetadata || {};
      
      return {
        inputTokens: usageMetadata.promptTokenCount || 0,
        outputTokens: usageMetadata.candidatesTokenCount || 0,
        totalTokens: usageMetadata.totalTokenCount || 0
      };
    } catch (error) {
      logger.warn('[AIUsage] Failed to extract token counts from response:', error.message);
      return {
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0
      };
    }
  }

  /**
   * Estimate token count from text (rough approximation)
   * Used as fallback when API doesn't return token counts
   * @param {string} text - Text to estimate
   * @returns {number} - Estimated token count
   */
  static estimateTokens(text) {
    if (!text) return 0;
    // Rough estimate: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  /**
   * Get usage statistics for a user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} - Usage statistics
   */
  static async getUserUsageStats(userId, options = {}) {
    try {
      const { startDate, endDate } = options;
      const query = { userId };

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      const records = await AIUsage.find(query);

      // Aggregate statistics
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

      // Group by service
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

      // Group by model
      records.forEach(record => {
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
    } catch (error) {
      logger.error('[AIUsage] Failed to get user usage stats:', error.message);
      throw error;
    }
  }

  /**
   * Get overall usage statistics (for admin dashboard)
   * @param {Object} options - Query options
   * @returns {Promise<Object>} - Overall statistics
   */
  static async getOverallStats(options = {}) {
    try {
      const { startDate, endDate } = options;
      const query = {};

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      const records = await AIUsage.find(query);

      const stats = {
        totalRequests: records.length,
        authenticatedRequests: records.filter(r => r.isAuthenticated).length,
        unauthenticatedRequests: records.filter(r => !r.isAuthenticated).length,
        totalCost: records.reduce((sum, r) => sum + r.totalCost, 0),
        totalInputTokens: records.reduce((sum, r) => sum + r.inputTokens, 0),
        totalOutputTokens: records.reduce((sum, r) => sum + r.outputTokens, 0),
        byService: {},
        byModel: {},
        byAuthStatus: {
          authenticated: {
            requests: 0,
            cost: 0,
            tokens: 0
          },
          unauthenticated: {
            requests: 0,
            cost: 0,
            tokens: 0
          }
        }
      };

      // Group by service
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

      // Group by model
      records.forEach(record => {
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

      // Group by auth status
      records.forEach(record => {
        const authKey = record.isAuthenticated ? 'authenticated' : 'unauthenticated';
        stats.byAuthStatus[authKey].requests++;
        stats.byAuthStatus[authKey].cost += record.totalCost;
        stats.byAuthStatus[authKey].tokens += (record.inputTokens + record.outputTokens);
      });

      return stats;
    } catch (error) {
      logger.error('[AIUsage] Failed to get overall stats:', error.message);
      throw error;
    }
  }
}

export default AIUsageTracker;

