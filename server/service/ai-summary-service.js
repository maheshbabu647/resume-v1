// services/ai-summary-service.js

import logger from '../config/logger.js';
import axios from 'axios'

export const generateAISummary = async (fieldData) => {

  const URL = "http://localhost:4000/api/generate-summary"
  try {
      // const response = await axios.post(URL, {
      //   resumeFields : fieldData
      // })
      // return response.data.summary
      return 'This is temporary summary'
  }
  catch(error){
    logger.error('AI API error:', error.response?.data || error.message);
    const err = new Error(error.message || 'AI Summary generation failed');
    err.status = 500;
    throw err;
  }

  return response.summary
  
}