// services/ai-summary-service.js

import logger from '../config/logger.js';
import axios from 'axios'

/**
 * Generates a cover letter using an external AI service.
 * @param {object} coverLetterData - The data required to generate the cover letter.
 * @param {string} coverLetterData.userName - The user's full name.
 * @param {string} coverLetterData.companyName - The name of the company being applied to.
 * @param {string} coverLetterData.jobTitle - The job title being applied for.
 * @param {string} coverLetterData.jobDescription - The full job description.
 * @param {string} coverLetterData.userSkills - Key skills of the user for this role.
 * @returns {Promise<string>} The generated cover letter text.
 */
export const generateAICoverLetter = async (coverLetterData) => {
    // This URL should point to your AI service endpoint.
    // It is recommended to move this to your .env file as COVER_LETTER_API_URL
    const URL = "http://localhost:4000/api/generate-cover-letter"; 
    try {
        // const response = await axios.post(URL, {
        //     coverLetterFields: coverLetterData
        // });
        // return response.data.coverLetter;

        // --- Placeholder response for local testing ---
        // This simulates a successful response from your AI service.
        return `Dear Hiring Manager at ${coverLetterData.companyName || 'the company'},\n\nThis is a sample cover letter for the position of ${coverLetterData.jobTitle || 'the role'}. I am confident in my skills in ${coverLetterData.userSkills || 'the required areas'}.\n\nSincerely,\n${coverLetterData.userName || 'The Applicant'}`;
        // --- End of placeholder ---

    } catch(error) {
        logger.error('AI Cover Letter API error:', error.response?.data || error.message);
        const err = new Error('AI Cover Letter generation failed');
        err.status = 500;
        throw err;
    }
}

/**
 * Generates a resume summary using an external AI service.
 * @param {object} fieldData - The resume data.
 * @returns {Promise<string>} The generated summary text.
 */
export const generateAISummary = async (fieldData) => {
  // This URL should point to your AI service endpoint.
  const URL = "http://localhost:4000/api/generate-summary" 
  try {
      // const response = await axios.post(URL, {
      //   resumeFields : fieldData
      // })
      // return response.data.summary
      return 'This is a temporary summary for your resume.'
  }
  catch(error){
    logger.error('AI API error:', error.response?.data || error.message);
    const err = new Error(error.message || 'AI Summary generation failed');
    err.status = 500;
    throw err;
  }
}
