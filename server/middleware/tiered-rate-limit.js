import rateLimit from 'express-rate-limit';
import logger from '../config/logger.js';

/**
 * Tiered Rate Limiting Strategy
 * - Free users (no auth): Very strict limits based on IP
 * - Authenticated users: More generous limits
 * 
 * This allows "try before you buy" while preventing abuse
 */

/**
 * Create a tiered rate limiter
 * @param {Object} options - Rate limit options
 * @param {number} options.freeMax - Max requests for free users
 * @param {number} options.authMax - Max requests for authenticated users
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {string} options.message - Error message
 */
export const createTieredLimiter = ({ freeMax, authMax, windowMs, message }) => {
  // Store for tracking free user requests
  const store = new Map();
  
  return rateLimit({
    windowMs,
    
    // Dynamic max based on authentication
    max: (req) => {
      // Check if user is authenticated
      const isAuthenticated = req.user && req.user.userId;
      const limit = isAuthenticated ? authMax : freeMax;
      
      logger.info(`[TieredLimit] ${req.originalUrl} - Auth: ${!!isAuthenticated}, Limit: ${limit}, IP: ${req.ip}`);
      
      return limit;
    },
    
    // Use IP + user agent for fingerprinting free users
    keyGenerator: (req) => {
      const isAuthenticated = req.user && req.user.userId;
      
      if (isAuthenticated) {
        // Authenticated: limit per user
        return `user:${req.user.userId}`;
      } else {
        // Free: limit per IP (or IP + user agent for better fingerprinting)
        return `ip:${req.ip}`;
      }
    },
    
    // Custom handler with detailed logging
    handler: (req, res) => {
      const isAuthenticated = req.user && req.user.userId;
      
      logger.warn(
        `[TieredLimit][Hit] Route: ${req.originalUrl}, ` +
        `Auth: ${!!isAuthenticated}, IP: ${req.ip}, ` +
        `UserAgent: ${req.get('user-agent')?.substring(0, 50)}`
      );
      
      res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        message: message || 'Too many requests. Please try again later.',
        hint: isAuthenticated 
          ? 'You have reached your usage limit. Please wait before trying again.'
          : 'Sign up for a free account to get higher limits and save your work!'
      });
    },
    
    // Don't count successful requests that fail validation
    skipFailedRequests: true,
    
    // Don't count requests that result in errors
    skipSuccessfulRequests: false,
    
    // Use standard headers
    standardHeaders: true,
    legacyHeaders: false,
  });
};

/**
 * Aggressive IP-based limiter for AI endpoints
 * Prevents abuse while allowing users to "try before signup"
 */

// [1] ATS Score Analysis - Free tier gets to try a few times
export const atsAnalysisLimiter = createTieredLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  freeMax: 3, // Free: 3 analyses per hour (enough to try the feature)
  authMax: 20, // Authenticated: 20 per hour (generous for real usage)
  message: 'Too many ATS analyses. Sign up for unlimited access!'
});

// [2] ATS Optimization - Should be auth-only but add limiter as backup
export const atsOptimizationLimiter = createTieredLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  freeMax: 1, // Free: 1 optimization per hour (very limited)
  authMax: 10, // Authenticated: 10 per hour
  message: 'Sign up to generate unlimited optimized resumes!'
});

// [3] Resume Parser - Let users parse a few resumes to see the value
export const resumeParserLimiter = createTieredLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  freeMax: 5, // Free: 5 parses per hour (enough to import a resume)
  authMax: 30, // Authenticated: 30 per hour
  message: 'Too many resume parsing requests. Sign up to continue!'
});

// [4] Field Content Enhancement - Let users try AI writing assistance
export const fieldEnhancementLimiter = createTieredLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  freeMax: 10, // Free: 10 field enhancements per hour (try the feature)
  authMax: 50, // Authenticated: 50 per hour (can enhance whole resume)
  message: 'Too many AI enhancement requests. Sign up for unlimited access!'
});

/**
 * Middleware to extract user from JWT without failing if not present
 * This allows tiered rate limiting to work for both auth and non-auth users
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const { verifyToken } = await import('../util/jwt.js');
    const { authToken } = req.cookies;
    
    if (authToken) {
      try {
        const { userId, userRole } = await verifyToken(authToken);
        req.user = { userId, userRole };
        logger.info(`[OptionalAuth] User ${userId} authenticated for ${req.originalUrl}`);
      } catch (error) {
        // Token invalid/expired - treat as free user
        logger.info(`[OptionalAuth] Invalid token for ${req.originalUrl}, treating as free user`);
        req.user = null;
      }
    } else {
      // No token - treat as free user
      req.user = null;
    }
    
    next();
  } catch (error) {
    logger.error(`[OptionalAuth] Error: ${error.message}`);
    req.user = null;
    next();
  }
};

export default {
  createTieredLimiter,
  atsAnalysisLimiter,
  atsOptimizationLimiter,
  resumeParserLimiter,
  fieldEnhancementLimiter,
  optionalAuth
};


