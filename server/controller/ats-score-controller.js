import ATSScoreService from '../service/ats-score-service.js';
import logger from '../config/logger.js';
import { validationResult } from 'express-validator';

/**
 * ATS Score Controller
 */
class ATSScoreController {
  /**
   * Analyze ATS compatibility between resume and job description
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async analyzeATSScore(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.warn(`[ATSScore] Validation errors: ${JSON.stringify(errors.array())}`);
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      // Check if both files were uploaded
      if (!req.files || !req.files.resume || !req.files.jobDescription) {
        logger.warn('[ATSScore] Missing required files');
        return res.status(400).json({
          success: false,
          error: 'Both resume and job description files are required'
        });
      }

      const resume = req.files.resume[0];
      const jobDescription = req.files.jobDescription[0];
      
      // Add null checks and logging
      if (!resume || !jobDescription) {
        logger.error('[ATSScore] Missing files in request');
        return res.status(400).json({
          success: false,
          error: 'Missing required files'
        });
      }
      
      logger.info(`[ATSScore] Processing files: Resume: ${resume.originalname || 'unknown'}, Job Desc: ${jobDescription.originalname || 'unknown'}`);
      logger.info(`[ATSScore] File details - Resume: ${JSON.stringify({
        originalname: resume.originalname,
        mimetype: resume.mimetype,
        size: resume.size
      })}, JobDesc: ${JSON.stringify({
        originalname: jobDescription.originalname,
        mimetype: jobDescription.mimetype,
        size: jobDescription.size
      })}`);
      
      // Debug: Log the entire file objects
      logger.info(`[ATSScore] Full file objects - Resume: ${JSON.stringify(resume)}, JobDesc: ${JSON.stringify(jobDescription)}`);

      // Enhanced file type validation
      const supportedMimeTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain'
      ];
      
      const supportedExtensions = ['.pdf', '.docx', '.doc', '.txt'];
      
      const isFileTypeSupported = (file) => {
        try {
          // Check MIME type first
          if (file.mimetype && supportedMimeTypes.includes(file.mimetype)) {
            return true;
          }
          
          // If MIME type is not detected or incorrect, check file extension
          const fileName = file.originalname ? file.originalname.toLowerCase() : '';
          const hasValidExtension = fileName && supportedExtensions.some(ext => fileName.endsWith(ext));
          
          // Also check for empty or generic MIME types that might be valid files
          const isEmptyOrGenericType = !file.mimetype || file.mimetype === '' || file.mimetype === 'application/octet-stream';
          
          return hasValidExtension && (isEmptyOrGenericType || supportedMimeTypes.includes(file.mimetype));
        } catch (error) {
          logger.error(`[ATSScore] File validation error: ${error.message}`, { file: file });
          return false;
        }
      };

      if (!isFileTypeSupported(resume) || !isFileTypeSupported(jobDescription)) {
        logger.warn(`[ATSScore] Unsupported file types - Resume: ${resume.mimetype}, JobDesc: ${jobDescription.mimetype}`);
        return res.status(400).json({
          success: false,
          error: 'Unsupported file type',
          message: 'Please upload PDF, DOCX, DOC, or TXT files',
          supportedTypes: supportedMimeTypes,
          supportedExtensions
        });
      }

      // Analyze ATS score
      const analysisResult = await ATSScoreService.analyzeATSScore(
        resume.buffer,
        resume.mimetype,
        jobDescription.buffer,
        jobDescription.mimetype
      );

      if (!analysisResult.success) {
        logger.error(`[ATSScore] Analysis failed: ${analysisResult.error}`);
        return res.status(500).json({
          success: false,
          error: 'ATS analysis failed',
          message: analysisResult.message
        });
      }

      // Add score interpretation
      const scoreInterpretation = ATSScoreService.getScoreInterpretation(analysisResult.data.atsScore);
      analysisResult.data.scoreInterpretation = scoreInterpretation;

      // Log successful analysis
      logger.info(`[ATSScore] Analysis completed - Score: ${analysisResult.data.atsScore}`);

      // Return analysis results
      res.status(200).json({
        success: true,
        data: {
          ...analysisResult.data,
          fileInfo: {
            resumeName: resume.originalname,
            resumeSize: resume.size,
            resumeType: resume.mimetype,
            jobDescName: jobDescription.originalname,
            jobDescSize: jobDescription.size,
            jobDescType: jobDescription.mimetype
          }
        }
      });

    } catch (error) {
      logger.error(`[ATSScore] Controller error: ${error.message}`);
      logger.error(`[ATSScore] Error stack: ${error.stack}`);
      res.status(500).json({
        success: false,
        error: 'ATS analysis failed',
        message: error.message
      });
    }
  }

  /**
   * Get ATS score interpretation guide
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getScoreGuide(req, res) {
    try {
      const scoreGuide = {
        excellent: {
          range: '90-100',
          description: 'Excellent ATS compatibility',
          color: 'green',
          tips: [
            'Your resume is highly optimized for ATS systems',
            'Continue using current formatting and keywords',
            'Consider adding more quantifiable achievements'
          ]
        },
        good: {
          range: '75-89',
          description: 'Good ATS compatibility with room for improvement',
          color: 'blue',
          tips: [
            'Add more industry-specific keywords',
            'Include more quantifiable achievements',
            'Optimize section headings'
          ]
        },
        fair: {
          range: '60-74',
          description: 'Fair ATS compatibility, needs optimization',
          color: 'yellow',
          tips: [
            'Significantly improve keyword matching',
            'Add more relevant skills and experience',
            'Consider restructuring resume sections'
          ]
        },
        poor: {
          range: '0-59',
          description: 'Poor ATS compatibility, requires major optimization',
          color: 'red',
          tips: [
            'Complete resume overhaul recommended',
            'Focus on matching job requirements exactly',
            'Consider professional resume writing services'
          ]
        }
      };

      res.status(200).json({
        success: true,
        data: scoreGuide
      });

    } catch (error) {
      logger.error(`[ATSScore] Score guide error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Failed to get score guide',
        message: error.message
      });
    }
  }

  /**
   * Generate ATS-optimized resume content
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async generateOptimizedResume(req, res) {
    try {
      logger.info('[ATSScore] Received optimization request');
      logger.info(`[ATSScore] Request body keys: ${Object.keys(req.body).join(', ')}`);
      
      const { resumeText, jobDescriptionText, atsResults, templateFieldDefinition } = req.body;

      logger.info(`[ATSScore] Resume text length: ${resumeText?.length || 0}`);
      logger.info(`[ATSScore] Job desc text length: ${jobDescriptionText?.length || 0}`);
      logger.info(`[ATSScore] ATS Results present: ${!!atsResults}`);
      logger.info(`[ATSScore] Template field def present: ${!!templateFieldDefinition}`);

      // Validate required fields
      if (!resumeText || !jobDescriptionText || !atsResults) {
        const missing = [];
        if (!resumeText) missing.push('resumeText');
        if (!jobDescriptionText) missing.push('jobDescriptionText');
        if (!atsResults) missing.push('atsResults');
        
        logger.warn(`[ATSScore] Missing required fields: ${missing.join(', ')}`);
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          message: `Missing required fields: ${missing.join(', ')}`
        });
      }

      logger.info('[ATSScore] All required fields validated, generating optimized resume content');

      // Generate optimized resume
      const result = await ATSScoreService.generateOptimizedResume(
        resumeText,
        jobDescriptionText,
        atsResults,
        templateFieldDefinition
      );

      if (!result.success) {
        logger.error(`[ATSScore] Optimization failed: ${result.error}`);
        return res.status(500).json({
          success: false,
          error: 'Resume optimization failed',
          message: result.message
        });
      }

      logger.info('[ATSScore] Successfully generated optimized resume');

      res.status(200).json({
        success: true,
        data: result.data
      });

    } catch (error) {
      logger.error(`[ATSScore] Optimization error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Resume optimization failed',
        message: error.message
      });
    }
  }

  /**
   * Health check for ATS score service
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async healthCheck(req, res) {
    try {
      res.status(200).json({
        success: true,
        message: 'ATS Score service is healthy',
        timestamp: new Date().toISOString(),
        features: [
          'Resume and job description analysis',
          'ATS compatibility scoring',
          'AI-powered suggestions',
          'Keyword matching analysis',
          'ATS-optimized resume generation'
        ]
      });
    } catch (error) {
      logger.error(`[ATSScore] Health check error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Health check failed',
        message: error.message
      });
    }
  }
}

export default ATSScoreController;
