import logger from '../config/logger.js';

/**
 * Cost Monitoring and Circuit Breaker
 * Tracks AI API usage and costs to prevent runaway expenses
 * 
 * In production, this should use Redis or a database for persistence
 * For now, using in-memory storage with file backup option
 */

// Cost estimates per operation (in USD)
const COST_ESTIMATES = {
  ats_analysis: 0.02,      // ~2 cents per analysis
  ats_optimization: 0.05,  // ~5 cents per optimization
  resume_parse: 0.015,     // ~1.5 cents per parse
  field_enhance: 0.01,     // ~1 cent per field enhancement
  summary_generate: 0.02,  // ~2 cents per summary
  enhance_entire: 0.08,    // ~8 cents per full enhancement
  cover_letter: 0.03       // ~3 cents per cover letter
};

// Daily cost limits (in USD)
const DAILY_LIMITS = {
  free_tier_total: 10.00,      // $10/day for all free users combined
  per_ip_free: 0.50,            // $0.50/day per free IP
  authenticated_total: 50.00,   // $50/day for all authenticated users
  per_user_authenticated: 5.00  // $5/day per authenticated user
};

// In-memory cost tracking
const costTracker = {
  daily: {
    date: new Date().toDateString(),
    freeTierTotal: 0,
    authenticatedTotal: 0,
    byIP: new Map(),
    byUser: new Map()
  },
  
  // Reset daily tracking at midnight
  resetIfNewDay() {
    const today = new Date().toDateString();
    if (this.daily.date !== today) {
      logger.info(`[CostMonitor] Resetting daily costs. Previous: Free=$${this.daily.freeTierTotal.toFixed(2)}, Auth=$${this.daily.authenticatedTotal.toFixed(2)}`);
      
      this.daily = {
        date: today,
        freeTierTotal: 0,
        authenticatedTotal: 0,
        byIP: new Map(),
        byUser: new Map()
      };
    }
  },
  
  // Track a cost
  recordCost(type, amount, isAuthenticated, identifier) {
    this.resetIfNewDay();
    
    if (isAuthenticated) {
      this.daily.authenticatedTotal += amount;
      const userTotal = this.daily.byUser.get(identifier) || 0;
      this.daily.byUser.set(identifier, userTotal + amount);
    } else {
      this.daily.freeTierTotal += amount;
      const ipTotal = this.daily.byIP.get(identifier) || 0;
      this.daily.byIP.set(identifier, ipTotal + amount);
    }
    
    logger.info(
      `[CostMonitor] ${type} - $${amount.toFixed(4)} - ` +
      `${isAuthenticated ? 'User' : 'IP'}: ${identifier} - ` +
      `Daily totals: Free=$${this.daily.freeTierTotal.toFixed(2)}, Auth=$${this.daily.authenticatedTotal.toFixed(2)}`
    );
  },
  
  // Check if an operation should be allowed
  canAfford(operationType, isAuthenticated, identifier) {
    this.resetIfNewDay();
    
    const cost = COST_ESTIMATES[operationType] || 0;
    
    if (isAuthenticated) {
      // Check authenticated limits
      const userTotal = this.daily.byUser.get(identifier) || 0;
      
      if (this.daily.authenticatedTotal + cost > DAILY_LIMITS.authenticated_total) {
        logger.warn(`[CostMonitor][LIMIT] Daily authenticated limit reached: $${this.daily.authenticatedTotal.toFixed(2)}`);
        return { allowed: false, reason: 'daily_limit_reached', limit: 'system' };
      }
      
      if (userTotal + cost > DAILY_LIMITS.per_user_authenticated) {
        logger.warn(`[CostMonitor][LIMIT] User ${identifier} limit reached: $${userTotal.toFixed(2)}`);
        return { allowed: false, reason: 'user_limit_reached', limit: 'personal' };
      }
    } else {
      // Check free tier limits
      const ipTotal = this.daily.byIP.get(identifier) || 0;
      
      if (this.daily.freeTierTotal + cost > DAILY_LIMITS.free_tier_total) {
        logger.warn(`[CostMonitor][LIMIT] Daily free tier limit reached: $${this.daily.freeTierTotal.toFixed(2)}`);
        return { allowed: false, reason: 'free_tier_limit_reached', limit: 'system' };
      }
      
      if (ipTotal + cost > DAILY_LIMITS.per_ip_free) {
        logger.warn(`[CostMonitor][LIMIT] IP ${identifier} free limit reached: $${ipTotal.toFixed(2)}`);
        return { allowed: false, reason: 'ip_limit_reached', limit: 'personal' };
      }
    }
    
    return { allowed: true };
  },
  
  // Get current stats
  getStats() {
    this.resetIfNewDay();
    return {
      date: this.daily.date,
      totals: {
        free: this.daily.freeTierTotal,
        authenticated: this.daily.authenticatedTotal,
        combined: this.daily.freeTierTotal + this.daily.authenticatedTotal
      },
      limits: DAILY_LIMITS,
      utilization: {
        free: (this.daily.freeTierTotal / DAILY_LIMITS.free_tier_total * 100).toFixed(1) + '%',
        authenticated: (this.daily.authenticatedTotal / DAILY_LIMITS.authenticated_total * 100).toFixed(1) + '%'
      }
    };
  }
};

/**
 * Middleware to check cost limits before expensive AI operations
 * @param {string} operationType - Type of operation (e.g., 'ats_analysis')
 */
export const costLimitMiddleware = (operationType) => {
  return (req, res, next) => {
    try {
      const isAuthenticated = !!(req.user && req.user.userId);
      const identifier = isAuthenticated ? req.user.userId : req.ip;
      
      const check = costTracker.canAfford(operationType, isAuthenticated, identifier);
      
      if (!check.allowed) {
        // Cost limit reached - circuit breaker activated
        logger.error(
          `[CostMonitor][BLOCKED] ${operationType} blocked - ` +
          `Reason: ${check.reason}, ${isAuthenticated ? 'User' : 'IP'}: ${identifier}`
        );
        
        const message = check.limit === 'system' 
          ? 'Our AI service is temporarily at capacity. Please try again later.'
          : isAuthenticated
            ? 'You have reached your daily usage limit. Your limit will reset at midnight UTC.'
            : 'You have reached the free tier limit. Sign up for a free account to continue!';
        
        return res.status(429).json({
          success: false,
          error: 'Usage limit reached',
          message,
          hint: !isAuthenticated ? 'Create a free account to get higher daily limits' : null,
          resetTime: 'midnight UTC'
        });
      }
      
      // Attach cost tracking to request for post-operation recording
      req.costTracking = {
        operationType,
        estimatedCost: COST_ESTIMATES[operationType],
        isAuthenticated,
        identifier
      };
      
      next();
    } catch (error) {
      logger.error(`[CostMonitor] Middleware error: ${error.message}`);
      // On error, allow request but log it
      next();
    }
  };
};

/**
 * Middleware to record cost after successful operation
 * Use this AFTER the operation completes successfully
 */
export const recordCostMiddleware = (req, res, next) => {
  try {
    if (req.costTracking) {
      const { operationType, estimatedCost, isAuthenticated, identifier } = req.costTracking;
      costTracker.recordCost(operationType, estimatedCost, isAuthenticated, identifier);
    }
    next();
  } catch (error) {
    logger.error(`[CostMonitor] Record error: ${error.message}`);
    next();
  }
};

/**
 * Express middleware to inject cost recording into response
 * This ensures cost is recorded when the response is sent
 */
export const injectCostRecording = (req, res, next) => {
  const originalJson = res.json.bind(res);
  
  res.json = function(data) {
    // Only record cost for successful operations
    if (data.success && req.costTracking) {
      const { operationType, estimatedCost, isAuthenticated, identifier } = req.costTracking;
      costTracker.recordCost(operationType, estimatedCost, isAuthenticated, identifier);
    }
    
    return originalJson(data);
  };
  
  next();
};

/**
 * Get current cost statistics
 * Use this for admin dashboard or monitoring
 */
export const getCostStats = (req, res) => {
  try {
    const stats = costTracker.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error(`[CostMonitor] Stats error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to get cost statistics'
    });
  }
};

// Log cost stats every hour
setInterval(() => {
  const stats = costTracker.getStats();
  logger.info(
    `[CostMonitor][Hourly] Date: ${stats.date}, ` +
    `Free: $${stats.totals.free.toFixed(2)} (${stats.utilization.free}), ` +
    `Auth: $${stats.totals.authenticated.toFixed(2)} (${stats.utilization.authenticated}), ` +
    `Total: $${stats.totals.combined.toFixed(2)}`
  );
}, 60 * 60 * 1000); // Every hour

export default {
  costLimitMiddleware,
  recordCostMiddleware,
  injectCostRecording,
  getCostStats,
  costTracker
};

