import TextExtractionService from '../service/text-extraction-service.js';
import logger from '../config/logger.js';
import { validationResult } from 'express-validator';

/**
 * Text extraction controller
 */
class TextExtractionController {
  /**
   * Extract text from uploaded file
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async extractText(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.warn(`[TextExtraction] Validation errors: ${JSON.stringify(errors.array())}`);
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      // Check if file was uploaded
      if (!req.file) {
        logger.warn('[TextExtraction] No file uploaded');
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      const { buffer, mimetype, originalname, size } = req.file;
      
      logger.info(`[TextExtraction] Processing file: ${originalname} (${mimetype}, ${size} bytes)`);

      // Validate file type with enhanced validation
      if (!TextExtractionService.isSupportedFileType(mimetype, originalname)) {
        logger.warn(`[TextExtraction] Unsupported file type: ${mimetype} for file: ${originalname}`);
        return res.status(400).json({
          success: false,
          error: 'Unsupported file type',
          message: 'Please upload PDF, DOCX, DOC, or TXT files',
          supportedTypes: TextExtractionService.getSupportedFileTypes()
        });
      }

      // Extract text based on file type
      const extractionOptions = {
        // PDF specific options
        max: 0, // No page limit
        version: 'v1.10.100', // PDF.js version
        // DOCX specific options
        styleMap: [
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh"
        ]
      };

      const extractedData = await TextExtractionService.extractText(
        buffer, 
        mimetype, 
        extractionOptions
      );

      // Log successful extraction
      logger.info(`[TextExtraction] Successfully extracted text from ${originalname}`);

      // Return extracted data
      res.status(200).json({
        success: true,
        data: {
          originalName: originalname,
          mimeType: mimetype,
          fileSize: size,
          extractedText: extractedData.text,
          metadata: extractedData.metadata,
          extractionInfo: extractedData.extractionInfo
        }
      });

    } catch (error) {
      logger.error(`[TextExtraction] Controller error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Text extraction failed',
        message: error.message
      });
    }
  }

  /**
   * Extract text from PDF with specific page range
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async extractFromPDFPages(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      const { buffer, mimetype, originalname, size } = req.file;
      const { pages } = req.body;

      // Validate file type
      if (mimetype !== 'application/pdf') {
        return res.status(400).json({
          success: false,
          error: 'File must be a PDF'
        });
      }

      logger.info(`[TextExtraction] Processing PDF with pages: ${pages}`);

      // Parse pages parameter
      let pageRange = null;
      if (pages) {
        try {
          pageRange = JSON.parse(pages);
        } catch (parseError) {
          return res.status(400).json({
            success: false,
            error: 'Invalid pages format. Use JSON array like [1,2,3] or [1-5]'
          });
        }
      }

      const extractionOptions = {
        partial: pageRange
      };

      const extractedData = await TextExtractionService.extractFromPDF(
        buffer, 
        extractionOptions
      );

      logger.info(`[TextExtraction] Successfully extracted text from PDF pages`);

      res.status(200).json({
        success: true,
        data: {
          originalName: originalname,
          mimeType: mimetype,
          fileSize: size,
          extractedText: extractedData.text,
          pages: extractedData.pages,
          metadata: extractedData.metadata,
          extractionInfo: {
            ...extractedData.extractionInfo,
            pageRange: pageRange
          }
        }
      });

    } catch (error) {
      logger.error(`[TextExtraction] PDF pages extraction error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'PDF text extraction failed',
        message: error.message
      });
    }
  }

  /**
   * Extract text from DOCX with HTML conversion
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async extractFromDOCXWithHTML(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      const { buffer, mimetype, originalname, size } = req.file;

      // Validate file type
      if (!mimetype.includes('wordprocessingml.document') && mimetype !== 'application/msword') {
        return res.status(400).json({
          success: false,
          error: 'File must be a DOCX or DOC file'
        });
      }

      logger.info(`[TextExtraction] Processing DOCX with HTML conversion`);

      const extractedData = await TextExtractionService.extractFromDOCXWithHTML(buffer);

      logger.info(`[TextExtraction] Successfully extracted text and HTML from DOCX`);

      res.status(200).json({
        success: true,
        data: {
          originalName: originalname,
          mimeType: mimetype,
          fileSize: size,
          extractedText: extractedData.text,
          extractedHTML: extractedData.html,
          metadata: extractedData.metadata,
          extractionInfo: {
            timestamp: new Date().toISOString(),
            mimeType,
            fileSize: size,
            extractionMethod: 'mammoth-html'
          }
        }
      });

    } catch (error) {
      logger.error(`[TextExtraction] DOCX HTML extraction error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'DOCX HTML extraction failed',
        message: error.message
      });
    }
  }

  /**
   * Get supported file types
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getSupportedTypes(req, res) {
    try {
      const supportedTypes = TextExtractionService.getSupportedFileTypes();
      
      res.status(200).json({
        success: true,
        data: {
          supportedTypes,
          descriptions: {
            'application/pdf': 'PDF documents',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Microsoft Word documents (DOCX)',
            'application/msword': 'Microsoft Word documents (DOC)'
          }
        }
      });

    } catch (error) {
      logger.error(`[TextExtraction] Get supported types error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Failed to get supported types',
        message: error.message
      });
    }
  }

  /**
   * Health check for text extraction service
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async healthCheck(req, res) {
    try {
      res.status(200).json({
        success: true,
        message: 'Text extraction service is healthy',
        timestamp: new Date().toISOString(),
        supportedTypes: TextExtractionService.getSupportedFileTypes()
      });
    } catch (error) {
      logger.error(`[TextExtraction] Health check error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Health check failed',
        message: error.message
      });
    }
  }
}

export default TextExtractionController;
