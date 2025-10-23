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
          // Include extracted texts for optimization
          resumeText: resumeText,
          jobDescriptionText: jobDescText,
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
You are an expert Applicant Tracking System (ATS) analyst. Analyze the provided resume against the job description and return a comprehensive ATS compatibility evaluation.

Focus on keyword relevance, skills alignment, and experience match using contextual understanding (not just keyword counting). Consider job seniority, role type, and technical vs. soft skill balance.

Return ONLY valid JSON, without markdown, code blocks, or additional commentary.

RESUME TEXT:
${resumeText}

JOB DESCRIPTION TEXT:
${jobDescText}

Your response must strictly follow this JSON format:

{
  "atsScore": 0-100,
  "overallMatch": "One-line summary of fit level (e.g., Excellent match, Good match, Moderate match, Poor match)",
  "keywordMatch": {
    "score": 0-100,
    "matchedKeywords": ["list of major matched keywords"],
    "missingKeywords": ["list of critical missing keywords from JD"],
    "suggestions": ["specific actionable suggestions to improve keyword coverage"]
  },
  "skillsMatch": {
    "score": 0-100,
    "matchedSkills": ["list of skills present in resume and JD"],
    "missingSkills": ["list of important missing or underrepresented skills"],
    "suggestions": ["specific actions for improving skill alignment"]
  },
  "experienceMatch": {
    "score": 0-100,
    "yearsMatch": true/false,
    "industryMatch": true/false,
    "seniorityMatch": true/false,
    "suggestions": ["contextual evaluation of experience depth and industry fit"]
  },
  "educationMatch": {
    "score": 0-100,
    "qualificationMatch": true/false,
    "suggestions": ["recommendations regarding relevant degrees, certifications, or coursework"]
  },
  "softSkillsMatch": {
    "score": 0-100,
    "matchedSoftSkills": ["leadership", "communication", "teamwork"],
    "missingSoftSkills": ["problem solving", "adaptability"],
    "suggestions": ["how to better present or highlight soft skills"]
  },
  "suggestions": [
    "Prioritize missing keywords and technical terms from JD",
    "Add quantifiable achievements where applicable",
    "Include certifications or project outcomes relevant to the job",
    "Align section titles with ATS-parsed field names (e.g., 'Work Experience', 'Education', 'Skills')"
  ],
  "strengths": [
    "Briefly list 2-4 key strengths identified from analysis"
  ],
  "improvements": [
    "List 2-4 targeted improvement points for better ATS alignment"
  ]
}

Scoring guidelines for improved consistency:

90–100 → Excellent match: resume highly aligned with JD

75–89 → Good match: a few key areas for improvement

60–74 → Moderate match: noticeable gaps in skills or experience

Below 60 → Poor match: significant keyword or role misalignment
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
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-500'
      };
    } else if (score >= 75) {
      return {
        level: 'Good',
        description: 'Your resume has good ATS compatibility with room for improvement',
        color: 'blue',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-500'
      };
    } else if (score >= 60) {
      return {
        level: 'Fair',
        description: 'Your resume needs optimization for better ATS performance',
        color: 'yellow',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-500'
      };
    } else {
      return {
        level: 'Poor',
        description: 'Your resume requires significant optimization for ATS systems',
        color: 'red',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-500'
      };
    }
  }

  /**
   * Generate ATS-optimized resume content
   * @param {string} resumeText - Original resume text
   * @param {string} jobDescText - Job description text
   * @param {Object} atsResults - ATS analysis results
   * @param {Object} templateFieldDefinition - Template field definitions
   * @returns {Promise<Object>} - Optimized resume data
   */
  static async generateOptimizedResume(resumeText, jobDescText, atsResults, templateFieldDefinition) {
    try {
      logger.info('[ATSScore] Generating ATS-optimized resume content');

      // Create comprehensive optimization prompt
      const prompt = this.createOptimizationPrompt(resumeText, jobDescText, atsResults, templateFieldDefinition);

      // Generate optimized content using Gemini
      const model = vertex_ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      const responseText = result.response.candidates[0].content.parts[0].text;

      logger.info(`[ATSScore] Raw optimization response: ${responseText.substring(0, 200)}...`);

      // Extract JSON from response
      let jsonText = responseText;
      
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

      // Parse optimized content
      const optimizedData = JSON.parse(jsonText);
      logger.info('[ATSScore] Successfully generated optimized resume content');

      return {
        success: true,
        data: optimizedData
      };

    } catch (error) {
      logger.error(`[ATSScore] Optimization failed: ${error.message}`);
      return {
        success: false,
        error: 'Resume optimization failed',
        message: error.message
      };
    }
  }

  /**
   * Create optimization prompt for Gemini
   * @param {string} resumeText - Original resume text
   * @param {string} jobDescText - Job description text
   * @param {Object} atsResults - ATS analysis results
   * @param {Object} templateFieldDefinition - Template field definitions
   * @returns {string} - Formatted prompt
   */
  static createOptimizationPrompt(resumeText, jobDescText, atsResults, templateFieldDefinition) {
    return `
You are an expert resume writer and ATS optimization specialist. Based on the original resume, job description, and ATS analysis feedback, generate an ATS-optimized version of the resume.

ORIGINAL RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescText}

ATS ANALYSIS FEEDBACK:
- Overall ATS Score: ${atsResults.atsScore}%
- Missing Keywords: ${atsResults.keywordMatch?.missingKeywords?.join(', ') || 'None'}
- Missing Skills: ${atsResults.skillsMatch?.missingSkills?.join(', ') || 'None'}
- Suggestions: ${atsResults.suggestions?.join('; ') || 'None'}
- Areas for Improvement: ${atsResults.improvements?.join('; ') || 'None'}

TEMPLATE STRUCTURE:
${JSON.stringify(templateFieldDefinition, null, 2)}

INSTRUCTIONS:
1. Extract and parse all information from the original resume
2. Incorporate missing keywords and skills naturally where relevant
3. Optimize content to match the job description better
4. Use action verbs and quantifiable achievements
5. Ensure ATS-friendly formatting and language
6. Match the template structure exactly as defined
7. Keep the candidate's authentic experience - only optimize how it's presented
8. Add relevant keywords from the job description naturally into descriptions

IMPORTANT: Return ONLY valid JSON matching the template structure. Include all sections from the template.
Return ONLY the JSON data structure, no additional text or formatting.
`;
  }
}

export default ATSScoreService;
