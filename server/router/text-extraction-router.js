import express from 'express';
import multer from 'multer';
import { body } from 'express-validator';
import TextExtractionController from '../controller/text-extraction-controller.js';
import logger from '../config/logger.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
    }
  }
});

// Validation middleware
const validateFileUpload = [
  body('pages').optional().isString().withMessage('Pages must be a string'),
];

/**
 * @swagger
 * components:
 *   schemas:
 *     TextExtractionResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             originalName:
 *               type: string
 *             mimeType:
 *               type: string
 *             fileSize:
 *               type: number
 *             extractedText:
 *               type: string
 *             metadata:
 *               type: object
 *             extractionInfo:
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
 * /api/text-extraction/extract:
 *   post:
 *     summary: Extract text from uploaded file
 *     tags: [Text Extraction]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF or DOCX file to extract text from
 *     responses:
 *       200:
 *         description: Text extracted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TextExtractionResponse'
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
router.post('/extract', upload.single('file'), validateFileUpload, TextExtractionController.extractText);

/**
 * @swagger
 * /api/text-extraction/extract-pdf-pages:
 *   post:
 *     summary: Extract text from specific PDF pages
 *     tags: [Text Extraction]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF file to extract text from
 *               pages:
 *                 type: string
 *                 description: JSON array of page numbers or ranges (e.g., "[1,2,3]" or "[1-5]")
 *     responses:
 *       200:
 *         description: Text extracted successfully from specified pages
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TextExtractionResponse'
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
router.post('/extract-pdf-pages', upload.single('file'), validateFileUpload, TextExtractionController.extractFromPDFPages);

/**
 * @swagger
 * /api/text-extraction/extract-docx-html:
 *   post:
 *     summary: Extract text and HTML from DOCX file
 *     tags: [Text Extraction]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: DOCX or DOC file to extract text and HTML from
 *     responses:
 *       200:
 *         description: Text and HTML extracted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/TextExtractionResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         extractedHTML:
 *                           type: string
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
router.post('/extract-docx-html', upload.single('file'), validateFileUpload, TextExtractionController.extractFromDOCXWithHTML);

/**
 * @swagger
 * /api/text-extraction/supported-types:
 *   get:
 *     summary: Get supported file types for text extraction
 *     tags: [Text Extraction]
 *     responses:
 *       200:
 *         description: Supported file types retrieved successfully
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
 *                     supportedTypes:
 *                       type: array
 *                       items:
 *                         type: string
 *                     descriptions:
 *                       type: object
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/supported-types', TextExtractionController.getSupportedTypes);

/**
 * @swagger
 * /api/text-extraction/health:
 *   get:
 *     summary: Health check for text extraction service
 *     tags: [Text Extraction]
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
 *                 supportedTypes:
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
router.get('/health', TextExtractionController.healthCheck);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    logger.error(`[TextExtraction] Multer error: ${error.message}`);
    
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
        'application/msword'
      ]
    });
  }
  
  logger.error(`[TextExtraction] Router error: ${error.message}`);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

export default router;
