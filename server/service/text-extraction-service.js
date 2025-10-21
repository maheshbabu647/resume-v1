import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import logger from '../config/logger.js';

/**
 * Text extraction service for PDF and DOCX files
 */
class TextExtractionService {
  /**
   * Extract text from PDF file
   * @param {Buffer} fileBuffer - PDF file buffer
   * @param {Object} options - Extraction options
   * @returns {Promise<Object>} - Extracted text with metadata
   */
  static async extractFromPDF(fileBuffer, options = {}) {
    try {
      logger.info('[TextExtraction] Starting PDF text extraction');
      
      const parser = new PDFParse({ 
        data: fileBuffer,
        ...options 
      });
      
      const result = await parser.getText();
      await parser.destroy();
      
      const extractedData = {
        text: result.text,
        pages: result.numpages,
        info: result.info,
        metadata: {
          title: result.info?.Title || null,
          author: result.info?.Author || null,
          subject: result.info?.Subject || null,
          creator: result.info?.Creator || null,
          producer: result.info?.Producer || null,
          creationDate: result.info?.CreationDate || null,
          modificationDate: result.info?.ModDate || null
        }
      };
      
      logger.info(`[TextExtraction] PDF extraction completed - ${result.numpages} pages, ${result.text.length} characters`);
      return extractedData;
      
    } catch (error) {
      logger.error(`[TextExtraction] PDF extraction failed: ${error.message}`);
      throw new Error(`PDF text extraction failed: ${error.message}`);
    }
  }

  /**
   * Extract text from DOCX file
   * @param {Buffer} fileBuffer - DOCX file buffer
   * @param {Object} options - Extraction options
   * @returns {Promise<Object>} - Extracted text with metadata
   */
  static async extractFromDOCX(fileBuffer, options = {}) {
    try {
      logger.info('[TextExtraction] Starting DOCX text extraction');
      
      const result = await mammoth.extractRawText({ 
        buffer: fileBuffer,
        ...options 
      });
      
      const extractedData = {
        text: result.value,
        messages: result.messages || [],
        metadata: {
          hasErrors: result.messages?.some(msg => msg.type === 'error') || false,
          warnings: result.messages?.filter(msg => msg.type === 'warning') || [],
          errors: result.messages?.filter(msg => msg.type === 'error') || []
        }
      };
      
      logger.info(`[TextExtraction] DOCX extraction completed - ${result.value.length} characters`);
      return extractedData;
      
    } catch (error) {
      logger.error(`[TextExtraction] DOCX extraction failed: ${error.message}`);
      throw new Error(`DOCX text extraction failed: ${error.message}`);
    }
  }

  /**
   * Extract text from DOCX file with HTML conversion
   * @param {Buffer} fileBuffer - DOCX file buffer
   * @param {Object} options - Extraction options
   * @returns {Promise<Object>} - Extracted text and HTML with metadata
   */
  static async extractFromDOCXWithHTML(fileBuffer, options = {}) {
    try {
      logger.info('[TextExtraction] Starting DOCX text and HTML extraction');
      
      const result = await mammoth.convertToHtml({ 
        buffer: fileBuffer,
        ...options 
      });
      
      const extractedData = {
        text: result.value,
        html: result.value,
        messages: result.messages || [],
        metadata: {
          hasErrors: result.messages?.some(msg => msg.type === 'error') || false,
          warnings: result.messages?.filter(msg => msg.type === 'warning') || [],
          errors: result.messages?.filter(msg => msg.type === 'error') || []
        }
      };
      
      logger.info(`[TextExtraction] DOCX HTML extraction completed - ${result.value.length} characters`);
      return extractedData;
      
    } catch (error) {
      logger.error(`[TextExtraction] DOCX HTML extraction failed: ${error.message}`);
      throw new Error(`DOCX HTML extraction failed: ${error.message}`);
    }
  }

  /**
   * Extract text from TXT file
   * @param {Buffer} fileBuffer - TXT file buffer
   * @param {Object} options - Extraction options
   * @returns {Promise<Object>} - Extracted text with metadata
   */
  static async extractFromTXT(fileBuffer, options = {}) {
    try {
      logger.info('[TextExtraction] Starting TXT text extraction');
      
      const text = fileBuffer.toString('utf8');
      
      const extractedData = {
        text: text,
        metadata: {
          encoding: 'utf8',
          characterCount: text.length,
          lineCount: text.split('\n').length
        }
      };
      
      logger.info(`[TextExtraction] TXT extraction completed - ${text.length} characters`);
      return extractedData;
      
    } catch (error) {
      logger.error(`[TextExtraction] TXT extraction failed: ${error.message}`);
      throw new Error(`TXT text extraction failed: ${error.message}`);
    }
  }

  /**
   * Auto-detect file type and extract text
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} mimeType - File MIME type
   * @param {Object} options - Extraction options
   * @returns {Promise<Object>} - Extracted text with metadata
   */
  static async extractText(fileBuffer, mimeType, options = {}) {
    try {
      logger.info(`[TextExtraction] Starting auto text extraction for MIME type: ${mimeType}`);
      
      let extractedData;
      
      switch (mimeType) {
        case 'application/pdf':
          extractedData = await this.extractFromPDF(fileBuffer, options);
          break;
          
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
          extractedData = await this.extractFromDOCX(fileBuffer, options);
          break;
          
        case 'text/plain':
          extractedData = await this.extractFromTXT(fileBuffer, options);
          break;
          
        default:
          throw new Error(`Unsupported file type: ${mimeType}`);
      }
      
      // Add common metadata
      extractedData.extractionInfo = {
        timestamp: new Date().toISOString(),
        mimeType,
        fileSize: fileBuffer.length,
        extractionMethod: mimeType === 'application/pdf' ? 'pdf-parse' : 'mammoth'
      };
      
      logger.info(`[TextExtraction] Auto extraction completed successfully`);
      return extractedData;
      
    } catch (error) {
      logger.error(`[TextExtraction] Auto extraction failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate file type for text extraction
   * @param {string} mimeType - File MIME type
   * @param {string} fileName - File name for extension fallback
   * @returns {boolean} - Whether file type is supported
   */
  static isSupportedFileType(mimeType, fileName = '') {
    const supportedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];
    
    const supportedExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    
    // Check MIME type first
    if (supportedMimeTypes.includes(mimeType)) {
      return true;
    }
    
    // If MIME type is not detected or incorrect, check file extension
    if (fileName) {
      const lowerFileName = fileName.toLowerCase();
      const hasValidExtension = supportedExtensions.some(ext => lowerFileName.endsWith(ext));
      
      // Also check for empty or generic MIME types that might be valid files
      const isEmptyOrGenericType = !mimeType || mimeType === '' || mimeType === 'application/octet-stream';
      
      return hasValidExtension && (isEmptyOrGenericType || supportedMimeTypes.includes(mimeType));
    }
    
    return false;
  }

  /**
   * Get supported file types
   * @returns {Array<string>} - Array of supported MIME types
   */
  static getSupportedFileTypes() {
    return [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];
  }
}

export default TextExtractionService;
