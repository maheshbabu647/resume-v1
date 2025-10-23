import logger from '../config/logger.js';

/**
 * Request validation middleware to prevent abuse of free AI endpoints
 * Checks for:
 * - Excessively large inputs
 * - Suspicious patterns (repeated identical requests)
 * - Malformed data
 */

/**
 * Validate ATS analysis request
 * Prevents abuse by checking file sizes and content
 */
export const validateATSRequest = (req, res, next) => {
  try {
    const resume = req.files?.resume?.[0];
    const jobDesc = req.files?.jobDescription?.[0];
    
    // Check file presence (already done in router, but double-check)
    if (!resume || !jobDesc) {
      return res.status(400).json({
        success: false,
        error: 'Missing files',
        message: 'Both resume and job description are required'
      });
    }
    
    // Check file sizes (10MB already enforced by multer, but add warning for large files)
    const resumeSizeMB = resume.size / (1024 * 1024);
    const jobDescSizeMB = jobDesc.size / (1024 * 1024);
    
    if (resumeSizeMB > 5 || jobDescSizeMB > 5) {
      logger.warn(
        `[Validation][ATS] Large files detected - Resume: ${resumeSizeMB.toFixed(2)}MB, ` +
        `JobDesc: ${jobDescSizeMB.toFixed(2)}MB, IP: ${req.ip}`
      );
    }
    
    // Log request for monitoring
    logger.info(
      `[Validation][ATS] Request accepted - ` +
      `Resume: ${resume.originalname} (${resumeSizeMB.toFixed(2)}MB), ` +
      `JobDesc: ${jobDesc.originalname} (${jobDescSizeMB.toFixed(2)}MB), ` +
      `IP: ${req.ip}, Auth: ${!!req.user?.userId}`
    );
    
    next();
  } catch (error) {
    logger.error(`[Validation][ATS] Error: ${error.message}`);
    res.status(400).json({
      success: false,
      error: 'Invalid request',
      message: 'Failed to validate request'
    });
  }
};

/**
 * Validate resume parser request
 */
export const validateParserRequest = (req, res, next) => {
  try {
    const file = req.file;
    const text = req.body?.resumeText;
    
    // Must have either file or text
    if (!file && !text) {
      return res.status(400).json({
        success: false,
        error: 'Missing input',
        message: 'Either a file or resume text is required'
      });
    }
    
    // If text is provided, check length
    if (text) {
      const textLength = text.length;
      const maxLength = 50000; // ~50KB of text
      
      if (textLength > maxLength) {
        logger.warn(
          `[Validation][Parser] Text too long: ${textLength} chars, IP: ${req.ip}`
        );
        return res.status(400).json({
          success: false,
          error: 'Text too long',
          message: `Resume text must be less than ${maxLength} characters`
        });
      }
      
      // Check for suspicious patterns (all caps, excessive special chars)
      const capsRatio = (text.match(/[A-Z]/g) || []).length / textLength;
      const specialCharsRatio = (text.match(/[^a-zA-Z0-9\s.,;:'"()]/g) || []).length / textLength;
      
      if (capsRatio > 0.5) {
        logger.warn(
          `[Validation][Parser] Suspicious text - high caps ratio: ${capsRatio.toFixed(2)}, IP: ${req.ip}`
        );
      }
      
      if (specialCharsRatio > 0.3) {
        logger.warn(
          `[Validation][Parser] Suspicious text - high special chars: ${specialCharsRatio.toFixed(2)}, IP: ${req.ip}`
        );
      }
    }
    
    // Log file-based parsing
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);
      logger.info(
        `[Validation][Parser] File request - ` +
        `${file.originalname} (${fileSizeMB.toFixed(2)}MB), ` +
        `IP: ${req.ip}, Auth: ${!!req.user?.userId}`
      );
      
      if (fileSizeMB > 5) {
        logger.warn(`[Validation][Parser] Large file: ${fileSizeMB.toFixed(2)}MB, IP: ${req.ip}`);
      }
    }
    
    next();
  } catch (error) {
    logger.error(`[Validation][Parser] Error: ${error.message}`);
    res.status(400).json({
      success: false,
      error: 'Invalid request',
      message: 'Failed to validate request'
    });
  }
};

/**
 * Validate field content enhancement request
 */
export const validateFieldEnhancementRequest = (req, res, next) => {
  try {
    const { field, context, currentContent } = req.body;
    
    // Check required fields
    if (!field) {
      return res.status(400).json({
        success: false,
        error: 'Missing field',
        message: 'Field name is required'
      });
    }
    
    // Check content length
    const maxLength = 5000; // Reasonable limit for a single field
    const totalLength = (context?.length || 0) + (currentContent?.length || 0);
    
    if (totalLength > maxLength) {
      logger.warn(
        `[Validation][FieldEnhance] Content too long: ${totalLength} chars, IP: ${req.ip}`
      );
      return res.status(400).json({
        success: false,
        error: 'Content too long',
        message: `Combined content must be less than ${maxLength} characters`
      });
    }
    
    // Log request
    logger.info(
      `[Validation][FieldEnhance] Request for field: ${field}, ` +
      `length: ${totalLength}, IP: ${req.ip}, Auth: ${!!req.user?.userId}`
    );
    
    next();
  } catch (error) {
    logger.error(`[Validation][FieldEnhance] Error: ${error.message}`);
    res.status(400).json({
      success: false,
      error: 'Invalid request',
      message: 'Failed to validate request'
    });
  }
};

/**
 * Validate ATS optimization request (should be auth-only)
 */
export const validateOptimizationRequest = (req, res, next) => {
  try {
    const { resumeText, jobDescriptionText } = req.body;
    
    // Check required fields
    if (!resumeText || !jobDescriptionText) {
      return res.status(400).json({
        success: false,
        error: 'Missing data',
        message: 'Resume text and job description are required'
      });
    }
    
    // Check lengths
    const maxLength = 50000;
    
    if (resumeText.length > maxLength) {
      return res.status(400).json({
        success: false,
        error: 'Resume too long',
        message: `Resume must be less than ${maxLength} characters`
      });
    }
    
    if (jobDescriptionText.length > maxLength) {
      return res.status(400).json({
        success: false,
        error: 'Job description too long',
        message: `Job description must be less than ${maxLength} characters`
      });
    }
    
    // Log request
    logger.info(
      `[Validation][Optimize] Resume: ${resumeText.length} chars, ` +
      `JobDesc: ${jobDescriptionText.length} chars, ` +
      `IP: ${req.ip}, Auth: ${!!req.user?.userId}`
    );
    
    next();
  } catch (error) {
    logger.error(`[Validation][Optimize] Error: ${error.message}`);
    res.status(400).json({
      success: false,
      error: 'Invalid request',
      message: 'Failed to validate request'
    });
  }
};

/**
 * Detect and log suspicious activity patterns
 * This doesn't block requests but logs them for monitoring
 */
export const suspiciousActivityDetector = (req, res, next) => {
  try {
    // Track rapid repeated requests (same IP, same endpoint)
    const key = `${req.ip}:${req.originalUrl}`;
    const now = Date.now();
    
    // Simple in-memory tracking (for production, use Redis)
    if (!global.requestTracker) {
      global.requestTracker = new Map();
    }
    
    const tracker = global.requestTracker;
    const requests = tracker.get(key) || [];
    
    // Add current request
    requests.push(now);
    
    // Remove requests older than 1 minute
    const recentRequests = requests.filter(time => now - time < 60000);
    tracker.set(key, recentRequests);
    
    // If more than 10 requests in 1 minute, log as suspicious
    if (recentRequests.length > 10) {
      logger.warn(
        `[Suspicious] Rapid requests detected - ` +
        `IP: ${req.ip}, Route: ${req.originalUrl}, ` +
        `Count: ${recentRequests.length} in 1 min, ` +
        `Auth: ${!!req.user?.userId}`
      );
    }
    
    // Cleanup old entries every 1000 requests
    if (tracker.size > 1000) {
      const cutoff = now - 300000; // 5 minutes
      for (const [key, times] of tracker.entries()) {
        if (times.every(time => time < cutoff)) {
          tracker.delete(key);
        }
      }
    }
    
    next();
  } catch (error) {
    logger.error(`[Suspicious] Detector error: ${error.message}`);
    // Don't block on error, just continue
    next();
  }
};

export default {
  validateATSRequest,
  validateParserRequest,
  validateFieldEnhancementRequest,
  validateOptimizationRequest,
  suspiciousActivityDetector
};

