import TextExtractionService from './text-extraction-service.js';
import logger from '../config/logger.js';
import vertex_ai from '../config/cloudai-config.js';

/**
 * ATS Score Analysis Service
 * Uses Gemini AI to analyze resume against job description
 */
class ATSScoreService {
  constructor() {
    this.model = vertex_ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  /**
   * Analyze ATS compatibility between resume and job description
   * @param {Buffer} resumeBuffer - Resume file buffer
   * @param {string} resumeMimeType - Resume file MIME type
   * @param {Buffer} jobDescBuffer - Job description file buffer
   * @param {string} jobDescMimeType - Job description file MIME type
   * @returns {Promise<Object>} - ATS score and suggestions
   */
  static async analyzeATSScore(resumeBuffer, resumeMimeType, jobDescBuffer, jobDescMimeType) {
    try {
      logger.info('[ATSScore] Starting ATS score analysis');

      // Extract text from resume
      const resumeExtraction = await TextExtractionService.extractText(resumeBuffer, resumeMimeType);
      const resumeText = resumeExtraction.text;

      // Extract text from job description
      const jobDescExtraction = await TextExtractionService.extractText(jobDescBuffer, jobDescMimeType);
      const jobDescText = jobDescExtraction.text;

      logger.info(`[ATSScore] Text extracted - Resume: ${resumeText.length} chars, Job Desc: ${jobDescText.length} chars`);

      // Create Gemini prompt for ATS analysis
      const prompt = this.createATSAnalysisPrompt(resumeText, jobDescText);

      // Generate ATS analysis using Gemini
      const atsAnalysis = await this.generateATSAnalysis(prompt);
      logger.info('[ATSScore] ATS analysis completed successfully');

      return {
        success: true,
        data: {
          atsScore: atsAnalysis.atsScore,
          overallMatch: atsAnalysis.overallMatch,
          keywordMatch: atsAnalysis.keywordMatch,
          skillsMatch: atsAnalysis.skillsMatch,
          experienceMatch: atsAnalysis.experienceMatch,
          suggestions: atsAnalysis.suggestions,
          strengths: atsAnalysis.strengths,
          improvements: atsAnalysis.improvements,
          analysis: {
            resumeTextLength: resumeText.length,
            jobDescTextLength: jobDescText.length,
            timestamp: new Date().toISOString()
          }
        }
      };

    } catch (error) {
      logger.error(`[ATSScore] Analysis failed: ${error.message}`);
      return {
        success: false,
        error: 'ATS analysis failed',
        message: error.message
      };
    }
  }

  /**
   * Create comprehensive ATS analysis prompt for Gemini
   * @param {string} resumeText - Extracted resume text
   * @param {string} jobDescText - Extracted job description text
   * @returns {string} - Formatted prompt for Gemini
   */
  static createATSAnalysisPrompt(resumeText, jobDescText) {
    return `
You are an expert ATS (Applicant Tracking System) analyst. Analyze the following resume against the job description and provide a comprehensive ATS compatibility score and detailed feedback.

RESUME TEXT:
${resumeText}

JOB DESCRIPTION TEXT:
${jobDescText}

IMPORTANT: Return ONLY valid JSON in the following format. Do not include any markdown formatting, code blocks, or additional text. Just the raw JSON:

{
  "atsScore": 85,
  "overallMatch": "Good match with some areas for improvement",
  "keywordMatch": {
    "score": 80,
    "matchedKeywords": ["JavaScript", "React", "Node.js"],
    "missingKeywords": ["TypeScript", "AWS", "Docker"],
    "suggestions": ["Add TypeScript experience", "Include AWS certifications"]
  },
  "skillsMatch": {
    "score": 75,
    "matchedSkills": ["Frontend Development", "API Integration"],
    "missingSkills": ["DevOps", "Database Design"],
    "suggestions": ["Highlight any DevOps experience", "Add database skills"]
  },
  "experienceMatch": {
    "score": 90,
    "yearsMatch": true,
    "industryMatch": true,
    "suggestions": ["Experience aligns well with requirements"]
  },
  "suggestions": [
    "Add more specific technical keywords from the job description",
    "Include quantifiable achievements and metrics",
    "Highlight relevant certifications or training",
    "Optimize section headings to match job requirements"
  ],
  "strengths": [
    "Strong technical background in required technologies",
    "Relevant work experience in the field",
    "Good educational background"
  ],
  "improvements": [
    "Add more industry-specific keywords",
    "Include more quantifiable achievements",
    "Highlight leadership or management experience if applicable"
  ]
}

Guidelines for analysis:
1. ATS Score should be 0-100 (100 being perfect match)
2. Focus on keyword matching, skills alignment, and experience relevance
3. Provide specific, actionable suggestions
4. Be constructive and helpful
5. Consider both hard skills and soft skills
6. Look for industry-specific terminology
7. Check for required qualifications vs nice-to-have qualifications

Return only the JSON response, no additional text.
`;
  }

  /**
   * Generate ATS analysis using Gemini AI
   * @param {string} prompt - Analysis prompt
   * @returns {Promise<Object>} - Parsed ATS analysis
   */
  static async generateATSAnalysis(prompt) {
    try {
      const model = vertex_ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const result = await model.generateContent(prompt);
      const responseText = result.response.candidates[0].content.parts[0].text;

      logger.info(`[ATSScore] Raw AI response: ${responseText.substring(0, 200)}...`);

      // Extract JSON from AI response (handle markdown formatting)
      let jsonText = responseText;
      
      // Remove markdown code blocks if present
      if (jsonText.includes('```json')) {
        const jsonStart = jsonText.indexOf('```json') + 7;
        const jsonEnd = jsonText.lastIndexOf('```');
        if (jsonEnd > jsonStart) {
          jsonText = jsonText.substring(jsonStart, jsonEnd).trim();
        }
      } else if (jsonText.includes('```')) {
        const jsonStart = jsonText.indexOf('```') + 3;
        const jsonEnd = jsonText.lastIndexOf('```');
        if (jsonEnd > jsonStart) {
          jsonText = jsonText.substring(jsonStart, jsonEnd).trim();
        }
      }

      logger.info(`[ATSScore] Extracted JSON: ${jsonText.substring(0, 200)}...`);

      // Parse JSON response
      const analysis = JSON.parse(jsonText);

      // Validate required fields
      if (!analysis.atsScore || !analysis.overallMatch || !analysis.suggestions) {
        throw new Error('Invalid analysis format from Gemini');
      }

      return analysis;

    } catch (error) {
      logger.error(`[ATSScore] Gemini analysis failed: ${error.message}`);
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  /**
   * Get ATS score interpretation
   * @param {number} score - ATS score (0-100)
   * @returns {Object} - Score interpretation
   */
  static getScoreInterpretation(score) {
    if (score >= 90) {
      return {
        level: 'Excellent',
        description: 'Your resume is highly optimized for ATS systems',
        color: 'green'
      };
    } else if (score >= 75) {
      return {
        level: 'Good',
        description: 'Your resume has good ATS compatibility with room for improvement',
        color: 'blue'
      };
    } else if (score >= 60) {
      return {
        level: 'Fair',
        description: 'Your resume needs optimization for better ATS performance',
        color: 'yellow'
      };
    } else {
      return {
        level: 'Poor',
        description: 'Your resume requires significant optimization for ATS systems',
        color: 'red'
      };
    }
  }
}

export default ATSScoreService;
