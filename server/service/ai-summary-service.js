import logger from '../config/logger.js';
import vertex_ai from '../config/cloudai-config.js';

// Get the generative model from your config
const model = vertex_ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Generates a concise 3-4 line summary based on the input text using the Gemini model.
 * @param {string} inputText - The input text to summarize.
 * @returns {Promise<string>} - The AI-generated summary.
 */
export const generateAISummary = async (inputText) => {
  const prompt = `Generate a concise 3-4 line professional summary based on the following input:\n\n${inputText}.
                  No extra thinking or talk should be provided, just direct content is needed`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.candidates[0].content.parts[0].text;
    return responseText;
  } catch (error) {
    logger.error('Gemini API error in generateAISummary:', error.message);
    const err = new Error('AI Summary generation failed');
    err.status = 500;
    throw err;
  }
};

/**
 * Generates a professional cover letter based on the provided details using the Gemini model.
 * @param {object} coverLetterData
 * @param {string} coverLetterData.userName - Applicant's full name
 * @param {string} coverLetterData.companyName - Company name
 * @param {string} coverLetterData.jobTitle - Job title applied for
 * @param {string} coverLetterData.jobDescription - Job description text
 * @param {string} coverLetterData.userSkills - Key skills relevant to the job
 * @returns {Promise<string>} - Generated cover letter text
 */
export const generateAICoverLetter = async (coverLetterData) => {
  const {
    userName,
    companyName,
    jobTitle,
    jobDescription,
    userSkills
  } = coverLetterData;

  const prompt = `Write a professional cover letter of 4-5 paragraphs addressed to the hiring manager at ${companyName}. 
        The position is ${jobTitle}. Use this job description: ${jobDescription}. 
        Highlight these skills: ${userSkills}. 
        Applicant's name is ${userName}. 
        The letter should be formal, engaging, and end with a strong closing.
        No extra thinking or talk should be provided, just direct content is needed`;
  
  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.candidates[0].content.parts[0].text;
    return responseText;
  } catch (error) {
    logger.error('Gemini API error in generateAICoverLetter:', error.message);
    const err = new Error('AI Cover Letter generation failed');
    err.status = 500;
    throw err;
  }
};

/**
 * Generates AI content for a specific resume field using global and local context.
 * Uses the same Gemini model configuration as other AI features.
 *
 * @param {object} params
 * @param {string} params.fieldName - The target field key (e.g., "summary").
 * @param {string} params.fieldLabel - Human readable label of the field.
 * @param {string} params.fieldType - Field type (text, textarea, etc.).
 * @param {object} params.globalContext - Global context collected from setup dialog.
 * @param {object} params.localContext - Local context from aiConfig.contextFields.
 * @param {string} params.userNotes - Optional user notes.
 * @returns {Promise<string>} Generated content for the field.
 */
export const generateAIFieldContent = async ({
  fieldName,
  fieldLabel,
  fieldType,
  globalContext = {},
  localContext = {},
  userNotes = ''
}) => {
  console.log(globalContext)
  const safeFieldLabel = fieldLabel || fieldName || 'this field';

  const prompt = `You are assisting with writing content for a resume field: "${safeFieldLabel}".

Global Context (overall resume intent and preferences):
${JSON.stringify(globalContext, null, 2)}

Local Context (must strictly guide the output):
${JSON.stringify(localContext, null, 2)}

User Notes (optional, higher priority than global context):
${(userNotes || '').trim()}

Instructions:
- Generate polished, concise content tailored to the Local Context.
- Align with Global Context tone/intent when relevant.
- Do not include meta text or explanations.
- Output only the final content suitable for the "${safeFieldLabel}" ${fieldType === 'textarea' ? 'multiline' : 'single line'} field.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return (responseText || '').trim();
  } catch (error) {
    logger.error('Gemini API error in generateAIFieldContent:', error.message);
    const err = new Error('AI field content generation failed');
    err.status = 500;
    throw err;
  }
};

/**
 * Enhances an entire resume's data using Gemini based on provided global context and optional user notes.
 * Returns JSON in the exact same structure as the provided resumeData (only enhanced text values).
 *
 * @param {object} params
 * @param {object} params.resumeData - The user's entered resume data object (pruned fields)
 * @param {object} params.globalContext - Global onboarding context from setup dialog
 * @param {string} params.userNotes - Optional user notes guiding enhancement
 * @returns {Promise<object>} Enhanced resume data JSON matching the same shape as resumeData
 */
export const enhanceResumeContent = async ({ resumeData = {}, globalContext = {}, userNotes = '' }) => {
  const instructions = `You are enhancing a resume. Improve clarity, impact, grammar, and professionalism.
Keep content factual, concise, and achievement-focused. Use action verbs and quantify when reasonable.
Respect existing structure strictly. Do not add or remove keys. Do not include explanations.
Only modify string values that represent user content; keep non-string values unchanged.
Return ONLY a JSON object that mirrors the exact shape of input resumeData with enhanced values.`;

  const prompt = `Global Context (user preferences / profile):
${JSON.stringify(globalContext, null, 2)}

User Notes (guidance, optional):
${(userNotes || '').trim()}

resumeData (to enhance - STRUCTURE MUST BE PRESERVED):
${JSON.stringify(resumeData, null, 2)}

${instructions}`;

  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    // Attempt to parse JSON; some models may wrap in code fences
    const cleaned = raw.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');
    const parsed = JSON.parse(cleaned);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Model returned invalid JSON structure');
    }
    return parsed;
  } catch (error) {
    logger.error('Gemini API error in enhanceResumeContent:', error.message);
    const err = new Error('AI resume enhancement failed');
    err.status = 500;
    throw err;
  }
};

