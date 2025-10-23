import express from 'express';
import { parseResumeFromFile, parseResumeFromText } from '../controller/resume-parser-controller.js';
import documentUpload, { documentUploadErrorHandler } from '../middleware/document-upload-middleware.js';
import { optionalAuth, resumeParserLimiter } from '../middleware/tiered-rate-limit.js';
import { validateParserRequest, suspiciousActivityDetector } from '../middleware/request-validation.js';
import { costLimitMiddleware, injectCostRecording } from '../middleware/cost-monitor.js';

const router = express.Router();

/**
 * @route POST /api/resume-parser/parse-file
 * @desc Parse resume from uploaded file (PDF, DOCX, DOC, TXT)
 * @access FREE with limits (5/hr free, 30/hr authenticated)
 * 
 * SECURITY:
 * - Tiered rate limiting (5 parses/hr for free users, 30/hr for authenticated)
 * - File size/type validation
 * - Cost monitoring and circuit breakers
 * - Suspicious activity detection
 */
router.post('/parse-file',
  optionalAuth,                           // Extract user if present (doesn't fail if not)
  suspiciousActivityDetector,             // Detect abuse patterns
  resumeParserLimiter,                    // Tiered rate limiting (5/hr free, 30/hr auth)
  documentUpload.single('file'),          // File upload handling
  documentUploadErrorHandler,             // Error handling
  validateParserRequest,                  // Security validation
  costLimitMiddleware('resume_parse'),    // Cost circuit breaker
  injectCostRecording,                    // Record cost after success
  parseResumeFromFile
);

/**
 * @route POST /api/resume-parser/parse-text
 * @desc Parse resume from raw text input
 * @access FREE with limits (5/hr free, 30/hr authenticated)
 */
router.post('/parse-text',
  optionalAuth,                           // Extract user if present
  suspiciousActivityDetector,             // Detect abuse patterns
  resumeParserLimiter,                    // Tiered rate limiting
  validateParserRequest,                  // Security validation
  costLimitMiddleware('resume_parse'),    // Cost circuit breaker
  injectCostRecording,                    // Record cost after success
  parseResumeFromText
);

export default router;

