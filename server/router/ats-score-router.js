import express from 'express';
import multer from 'multer';
import { body } from 'express-validator';
import ATSScoreController from '../controller/ats-score-controller.js';
import logger from '../config/logger.js';
import { 
  optionalAuth, 
  atsAnalysisLimiter, 
  atsOptimizationLimiter 
} from '../middleware/tiered-rate-limit.js';
import { 
  validateATSRequest, 
  validateOptimizationRequest,
  suspiciousActivityDetector 
} from '../middleware/request-validation.js';
import { 
  costLimitMiddleware, 
  injectCostRecording 
} from '../middleware/cost-monitor.js';
import userAuthorization from '../middleware/user-authorization.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];
    
    const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    
    // Check MIME type first
    if (allowedMimes.includes(file.mimetype)) {
      logger.info(`[ATSScore] File accepted by MIME type: ${file.originalname} (${file.mimetype})`);
      return cb(null, true);
    }
    
    // If MIME type is not detected or incorrect, check file extension
    const fileName = file.originalname ? file.originalname.toLowerCase() : '';
    const hasValidExtension = fileName && allowedExtensions.some(ext => fileName.endsWith(ext));
    
    // Also check for empty or generic MIME types that might be valid files
    const isEmptyOrGenericType = !file.mimetype || file.mimetype === '' || file.mimetype === 'application/octet-stream';
    
    if (hasValidExtension && (isEmptyOrGenericType || allowedMimes.includes(file.mimetype))) {
      logger.info(`[ATSScore] File accepted by extension: ${file.originalname} (${file.mimetype})`);
      return cb(null, true);
    }
    
    logger.warn(`[ATSScore] File rejected: ${file.originalname} (${file.mimetype})`);
    cb(new Error(`Unsupported file type: ${file.mimetype || 'unknown'}`), false);
  }
});

// Validation middleware
const validateATSAnalysis = [
  body('resume').custom((value, { req }) => {
    if (!req.files || !req.files.resume || !req.files.resume[0]) {
      throw new Error('Resume file is required');
    }
    return true;
  }),
  body('jobDescriptionText').custom((value, { req }) => {
    const hasFile = req.files && req.files.jobDescription && req.files.jobDescription[0];
    const hasText = typeof req.body.jobDescriptionText === 'string' && req.body.jobDescriptionText.trim().length > 0;
    if (!hasFile && !hasText) {
      throw new Error('Provide a job description file or pasted text');
    }
    if (hasText && req.body.jobDescriptionText.length > 20000) {
      throw new Error('Job description text too long (max 20,000 characters)');
    }
    return true;
  })
];

/**
 * @swagger
 * components:
 *   schemas:
 *     ATSScoreResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             atsScore:
 *               type: number
 *             overallMatch:
 *               type: string
 *             keywordMatch:
 *               type: object
 *             skillsMatch:
 *               type: object
 *             experienceMatch:
 *               type: object
 *             suggestions:
 *               type: array
 *               items:
 *                 type: string
 *             strengths:
 *               type: array
 *               items:
 *                 type: string
 *             improvements:
 *               type: array
 *               items:
 *                 type: string
 *             scoreInterpretation:
 *               type: object
 *             fileInfo:
 *               type: object
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         error:
 *           type: string
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /api/ats-score/analyze:
 *   post:
 *     summary: Analyze ATS compatibility between resume and job description
 *     tags: [ATS Score]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: Resume file (PDF, DOCX, DOC, or TXT)
 *               jobDescription:
 *                 type: string
 *                 format: binary
 *                 description: Job description file (PDF, DOCX, DOC, or TXT)
 *     responses:
 *       200:
 *         description: ATS analysis completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ATSScoreResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * ATS Score Analysis - FREE with limits
 * - Free users: 3 per hour (try before signup)
 * - Authenticated: 20 per hour
 * - Cost monitoring and validation applied
 */
router.post('/analyze', 
  optionalAuth,                           // Extract user if present (doesn't fail if not)
  suspiciousActivityDetector,             // Detect abuse patterns
  atsAnalysisLimiter,                     // Tiered rate limiting (3/hr free, 20/hr auth)
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'jobDescription', maxCount: 1 }
  ]),
  validateATSAnalysis,                    // Original validation
  validateATSRequest,                     // Additional security validation
  costLimitMiddleware('ats_analysis'),    // Cost circuit breaker
  injectCostRecording,                    // Record cost after success
  ATSScoreController.analyzeATSScore
);

/**
 * @swagger
 * /api/ats-score/guide:
 *   get:
 *     summary: Get ATS score interpretation guide
 *     tags: [ATS Score]
 *     responses:
 *       200:
 *         description: Score guide retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     excellent:
 *                       type: object
 *                     good:
 *                       type: object
 *                     fair:
 *                       type: object
 *                     poor:
 *                       type: object
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/guide', ATSScoreController.getScoreGuide);

/**
 * @swagger
 * /api/ats-score/optimize:
 *   post:
 *     summary: Generate ATS-optimized resume content
 *     tags: [ATS Score]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resumeText
 *               - jobDescriptionText
 *               - atsResults
 *             properties:
 *               resumeText:
 *                 type: string
 *                 description: Original resume text
 *               jobDescriptionText:
 *                 type: string
 *                 description: Job description text
 *               atsResults:
 *                 type: object
 *                 description: ATS analysis results
 *               templateFieldDefinition:
 *                 type: array
 *                 description: Template field definitions
 *     responses:
 *       200:
 *         description: Optimized resume generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * ATS Optimization - REQUIRES AUTHENTICATION
 * - This is a premium feature (already protected in frontend)
 * - Added backend protection as defense-in-depth
 * - Free tier gets 1/hr as fallback, authenticated gets 10/hr
 */
router.post('/optimize',
  userAuthorization,                         // MUST be authenticated
  suspiciousActivityDetector,                // Detect abuse patterns
  atsOptimizationLimiter,                    // Rate limiting (backup)
  validateOptimizationRequest,               // Validate request
  costLimitMiddleware('ats_optimization'),   // Cost circuit breaker
  injectCostRecording,                       // Record cost after success
  ATSScoreController.generateOptimizedResume
);

/**
 * @swagger
 * /api/ats-score/health:
 *   get:
 *     summary: Health check for ATS score service
 *     tags: [ATS Score]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                 features:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Service is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/health', ATSScoreController.healthCheck);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    logger.error(`[ATSScore] Multer error: ${error.message}`);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large',
        message: 'File size must be less than 10MB'
      });
    }
    
    return res.status(400).json({
      success: false,
      error: 'File upload error',
      message: error.message
    });
  }
  
  if (error.message.includes('Unsupported file type')) {
    return res.status(400).json({
      success: false,
      error: 'Unsupported file type',
      message: error.message,
      supportedTypes: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain'
      ]
    });
  }
  
  logger.error(`[ATSScore] Router error: ${error.message}`);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

export default router;
