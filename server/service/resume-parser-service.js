import logger from '../config/logger.js';
import vertex_ai from '../config/cloudai-config.js';

// Get the generative model from your config
const model = vertex_ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

/**
 * Returns a default schema when no example form data is provided
 * @returns {string} - Default schema JSON string
 */
function getDefaultSchema() {
  return `{
  "content": {
    "contact": {
      "name": "",
      "email": "",
      "phone": "",
      "location": ""
    },
    "summary": "",
    "experience": [
      {
        "company": "",
        "position": "",
        "startDate": "",
        "endDate": "",
        "description": "",
        "highlights": [""]
      }
    ],
    "education": [
      {
        "institution": "",
        "degree": "",
        "field": "",
        "startDate": "",
        "endDate": ""
      }
    ],
    "skills": [""]
  }
}`;
}

/**
 * Parses a resume text using Gemini AI and extracts structured data.
 * @param {string} resumeText - The extracted text from the resume
 * @param {object} exampleFormData - The example form data structure to match
 * @returns {Promise<object>} - Structured resume data matching the template format
 */
export const parseResumeWithAI = async (resumeText, exampleFormData = null) => {
  try {
    logger.info('[ResumeParser] Starting AI resume parsing');
    
    // Use the example form data directly as the schema
    const schemaExample = exampleFormData 
      ? JSON.stringify({ content: exampleFormData }, null, 2)
      : getDefaultSchema();
    
    logger.info('[ResumeParser] Using example schema (first 300 chars):', schemaExample.substring(0, 300) + '...');
    
    const prompt = `You are a professional resume parser. Extract information from the resume and return it in the EXACT structure shown in the example below.

RESUME TEXT TO PARSE:
${resumeText}

REQUIRED OUTPUT STRUCTURE (You MUST match this EXACT structure):
${schemaExample}

CRITICAL INSTRUCTIONS:
1. Return a JSON object with the EXACT SAME structure as shown above
2. Use the EXACT SAME field names (keys) as in the example
3. For fields not found in the resume:
   - Use empty string "" for text fields
   - Use empty array [] for array fields
   - Do NOT omit any field that exists in the example structure
4. For array fields (experience, education, projects, etc.):
   - Include ALL items found in the resume
   - Each array item must have ALL the same fields as shown in the example
   - If example shows [{company:"",position:""}], your output must have same fields
5. Extract information accurately from the resume text:
   - Names, emails, phones, addresses, links
   - Work experience with companies, positions, dates, descriptions
   - Education with schools, degrees, dates, GPAs
   - Skills exactly as they appear
   - Projects with details
   - Any other sections shown in the example
6. Date formats: Use "Month YYYY" or "YYYY-MM" format
7. Return ONLY valid JSON - no explanations, no markdown code fences, no extra text
8. Ensure all JSON is properly escaped and valid

Generate the JSON matching the example structure now:`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    // Clean up the response - remove markdown code fences if present
    const cleaned = responseText.trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '');
    
    logger.info('[ResumeParser] Raw AI response cleaned, attempting to parse JSON');
    
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      logger.error('[ResumeParser] JSON parse error:', parseError.message);
      logger.error('[ResumeParser] Cleaned response (first 500 chars):', cleaned.substring(0, 500));
      throw new Error('Failed to parse AI response as JSON');
    }
    
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('AI returned invalid data structure');
    }
    
    logger.info('[ResumeParser] Successfully parsed resume data');
    logger.info('[ResumeParser] Data structure:', JSON.stringify(parsed).substring(0, 200) + '...');
    
    return parsed;
    
  } catch (error) {
    logger.error('[ResumeParser] Error in parseResumeWithAI:', error.message);
    throw error;
  }
};

/**
 * Removes empty fields from parsed data (only keeps filled fields)
 * @param {any} obj - Object to clean
 * @returns {any} - Cleaned object
 */
function removeEmptyFields(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    // Filter out empty items from arrays, but keep the array structure
    const cleaned = obj
      .map(item => removeEmptyFields(item))
      .filter(item => {
        if (item === null || item === undefined || item === '') return false;
        if (Array.isArray(item)) return item.length > 0;
        if (typeof item === 'object') return Object.keys(item).length > 0;
        return true;
      });
    // Always return an array, even if empty (important for template compatibility)
    return cleaned;
  }
  
  if (typeof obj === 'object') {
    const cleaned = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = removeEmptyFields(value);
      
      // Keep arrays even if empty (important for form compatibility)
      if (Array.isArray(cleanedValue)) {
        cleaned[key] = cleanedValue;
        continue;
      }
      
      // Only include non-empty values for non-array fields
      if (cleanedValue === null || cleanedValue === undefined || cleanedValue === '') {
        continue; // Skip empty strings
      }
      
      if (typeof cleanedValue === 'object' && !Array.isArray(cleanedValue) && Object.keys(cleanedValue).length === 0) {
        continue; // Skip empty objects
      }
      
      cleaned[key] = cleanedValue;
    }
    
    return cleaned;
  }
  
  return obj;
}

/**
 * Ensures array fields are properly formatted based on example structure
 * @param {object} parsedData - Parsed resume data
 * @param {object} exampleFormData - Example form data structure
 * @returns {object} - Data with proper array structures
 */
function ensureArrayStructures(parsedData, exampleFormData) {
  if (!parsedData?.content || !exampleFormData) {
    return parsedData;
  }
  
  // Recursively ensure arrays in parsed data match example structure
  function ensureArraysInObject(targetObj, exampleObj) {
    for (const key in exampleObj) {
      if (!exampleObj.hasOwnProperty(key)) continue;
      
      const exampleValue = exampleObj[key];
      
      if (Array.isArray(exampleValue)) {
        // This should be an array in target too
        if (!Array.isArray(targetObj[key])) {
          targetObj[key] = [];
        }
      } else if (typeof exampleValue === 'object' && exampleValue !== null) {
        // Nested object, recurse
        if (!targetObj[key] || typeof targetObj[key] !== 'object') {
          targetObj[key] = {};
        }
        ensureArraysInObject(targetObj[key], exampleValue);
      }
    }
  }
  
  ensureArraysInObject(parsedData.content, exampleFormData);
  
  return parsedData;
}

/**
 * Validates and sanitizes parsed resume data
 * @param {object} parsedData - Parsed resume data from AI
 * @param {object} exampleFormData - Example form data structure to ensure arrays
 * @param {boolean} removeEmpty - Whether to remove empty fields (default: true)
 * @returns {object} - Validated and sanitized data
 */
export const validateParsedResumeData = (parsedData, exampleFormData = null, removeEmpty = true) => {
  try {
    logger.info('[ResumeParser] Validating parsed data');
    
    // Basic validation
    if (!parsedData || typeof parsedData !== 'object') {
      throw new Error('Invalid parsed data');
    }
    
    // Ensure we have a content object
    if (!parsedData.content) {
      parsedData = { content: parsedData };
    }
    
    logger.info('[ResumeParser] Data structure before cleaning:', JSON.stringify(parsedData).substring(0, 200) + '...');
    
    // Remove empty fields if requested
    if (removeEmpty) {
      logger.info('[ResumeParser] Removing empty fields');
      parsedData = removeEmptyFields(parsedData);
    }
    
    // Ensure array structures are preserved based on example
    if (exampleFormData) {
      logger.info('[ResumeParser] Ensuring array structures match example');
      parsedData = ensureArrayStructures(parsedData, exampleFormData);
    }
    
    logger.info('[ResumeParser] Validation complete');
    logger.info('[ResumeParser] Final data structure:', JSON.stringify(parsedData).substring(0, 300) + '...');
    
    return parsedData;
    
  } catch (error) {
    logger.error('[ResumeParser] Validation error:', error.message);
    throw error;
  }
};

export default {
  parseResumeWithAI,
  validateParsedResumeData
};

