import logger from '../config/logger.js';
import TextExtractionService from '../service/text-extraction-service.js';
import { parseResumeWithAI, validateParsedResumeData } from '../service/resume-parser-service.js';

/**
 * Parse resume from uploaded file
 * Extracts text from file and uses AI to structure the data
 */
export const parseResumeFromFile = async (req, res, next) => {
  try {
    logger.info('[ResumeParserController] parseResumeFromFile called');
    
    // Check if file was uploaded
    if (!req.file) {
      logger.warn('[ResumeParserController] No file uploaded');
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
        message: 'Please upload a resume file (PDF, DOCX, DOC, or TXT)'
      });
    }
    
    const file = req.file;
    const exampleFormData = req.body.exampleFormData 
      ? JSON.parse(req.body.exampleFormData) 
      : null;
    
    logger.info(`[ResumeParserController] Processing file: ${file.originalname}, type: ${file.mimetype}`);
    logger.info(`[ResumeParserController] Example form data provided: ${exampleFormData ? 'Yes' : 'No'}`);
    
    // Validate file type
    if (!TextExtractionService.isSupportedFileType(file.mimetype, file.originalname)) {
      logger.warn(`[ResumeParserController] Unsupported file type: ${file.mimetype}`);
      return res.status(400).json({
        success: false,
        error: 'Unsupported file type',
        message: 'Please upload a PDF, DOCX, DOC, or TXT file',
        supportedTypes: TextExtractionService.getSupportedFileTypes()
      });
    }
    
    // Extract text from file
    logger.info('[ResumeParserController] Extracting text from file');
    const extractedData = await TextExtractionService.extractText(
      file.buffer,
      file.mimetype
    );
    
    if (!extractedData || !extractedData.text) {
      throw new Error('Failed to extract text from file');
    }
    
    logger.info(`[ResumeParserController] Extracted ${extractedData.text.length} characters`);
    
    // Parse resume using AI with example form data structure
    logger.info('[ResumeParserController] Parsing resume with AI');
    const parsedData = await parseResumeWithAI(extractedData.text, exampleFormData, req.user || null, req.body.sessionId);
    
    // Validate parsed data
    const validatedData = validateParsedResumeData(parsedData, exampleFormData);
    
    logger.info('[ResumeParserController] Resume parsed successfully');
    
    return res.status(200).json({
      success: true,
      data: {
        originalFileName: file.originalname,
        fileType: file.mimetype,
        extractedTextLength: extractedData.text.length,
        parsedResumeData: validatedData,
        metadata: extractedData.metadata || {}
      }
    });
    
  } catch (error) {
    logger.error('[ResumeParserController] Error in parseResumeFromFile:', error);
    next(error);
  }
};

/**
 * Parse resume from raw text
 * Uses AI to structure the provided text data
 */
export const parseResumeFromText = async (req, res, next) => {
  try {
    logger.info('[ResumeParserController] parseResumeFromText called');
    
    const { resumeText, exampleFormData, sessionId } = req.body;
    
    // Validate input
    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length === 0) {
      logger.warn('[ResumeParserController] No resume text provided');
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'Please provide resume text'
      });
    }
    
    logger.info(`[ResumeParserController] Processing text (${resumeText.length} characters)`);
    logger.info(`[ResumeParserController] Example form data provided: ${exampleFormData ? 'Yes' : 'No'}`);
    
    // Parse resume using AI with example form data structure
    logger.info('[ResumeParserController] Parsing resume with AI');
    const parsedData = await parseResumeWithAI(resumeText, exampleFormData, req.user || null, sessionId);
    
    // Validate parsed data
    const validatedData = validateParsedResumeData(parsedData, exampleFormData);
    
    logger.info('[ResumeParserController] Resume parsed successfully');
    
    return res.status(200).json({
      success: true,
      data: {
        originalTextLength: resumeText.length,
        parsedResumeData: validatedData
      }
    });
    
  } catch (error) {
    logger.error('[ResumeParserController] Error in parseResumeFromText:', error);
    next(error);
  }
};

export default {
  parseResumeFromFile,
  parseResumeFromText
};

