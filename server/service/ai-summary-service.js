import logger from '../config/logger.js';
import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HF_TOKEN);

/**
 * Generates a concise 3-4 line summary based on the input text using DeepSeek model.
 * @param {string} inputText - The input text to summarize.
 * @returns {Promise<string>} - The AI-generated summary.
 */
export const generateAISummary = async (inputText) => {
  console.log(inputText)
  const prompt = `Generate a concise 3-4 line professional summary based on the following input:\n\n${inputText}.
                  No extra thinking or talk should be provided, just direct content is needed`;

  return prompt
  try {
    const chatCompletion = await client.chatCompletion({
      provider: "novita",
      model: "deepseek-ai/DeepSeek-R1-0528",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const output =  chatCompletion.choices[0].message.content;
    const cleanedOutput = output.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    return cleanedOutput
  } catch (error) {
    logger.error('AI API error:', error.response?.data || error.message);
    const err = new Error('AI Summary generation failed');
    err.status = 500;
    throw err;
  }
};

/**
 * Generates a professional cover letter based on the provided details.
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

  const prompt = `Write a professional cover letter of 4-5 paragraphs addressed to the hiring manager at [CompanyName]. 
        The position is ${jobTitle}. Use this job description: ${jobDescription}. 
        Highlight these skills: ${userSkills}. 
        Applicant's name is ${userName}. 
        The letter should be formal, engaging, and end with a strong closing.
        No extra thinking or talk should be provided, just direct content is needed
`;
  // const prompt = ` Write a professional, persuasive cover letter of about 4-5 paragraphs based on the following input: ${coverLetterData}`
  try {
    const chatCompletion = await client.chatCompletion({
      provider: "novita",
      model: "deepseek-ai/DeepSeek-R1-0528",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const output =  chatCompletion.choices[0].message.content;
    const cleanedOutput = output.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    return cleanedOutput

  } catch (error) {
    logger.error('AI Cover Letter API error:', error.response?.data || error.message);
    const err = new Error('AI Cover Letter generation failed');
    err.status = 500;
    throw err;
  }
};


/**
 * Analyzes and enhances a piece of resume text, returning structured JSON.
 * @param {string} textToEnhance - The user-submitted resume text.
 * @param {string} jobContext - The job title or context for the text (e.g., "Senior Software Engineer").
 * @returns {Promise<object>} - A structured object with suggestions.
 */
export const enhanceResumeText = async (textToEnhance, jobContext) => {
  // 1. Define the exact JSON structure you want the AI to return.
  const jsonSchema = `{
    "action_verb_rewrites": [
      "string" // An array of 2-3 suggestions rewritten with strong action verbs.
    ],
    "quantification_templates": [
      "string" // An array of 1-2 suggestions that prompt the user to add metrics. e.g., 'Resolved [Number] of tickets...'
    ],
    "conciseness_rewrite": "string", // One suggestion rewritten to be more concise.
    "grammar_correction": {
      "has_errors": "boolean",
      "corrected_text": "string" // The text after fixing any spelling or grammar mistakes.
    }
  }`;

  // 2. Craft a very strict prompt demanding JSON output.
  const prompt = `
    You are a resume enhancement API. Your only function is to return a valid JSON object.
    Do not provide any explanations, introductory text, or markdown formatting.

    Analyze the following resume text from a "${jobContext}":
    TEXT: "${textToEnhance}"

    Based on your analysis, populate the following JSON object with relevant suggestions.
    JSON SCHEMA:
    ${jsonSchema}

    Your entire response must be ONLY the populated JSON object.
  `;

  try {

    const chatCompletion = await client.chatCompletion({
      provider: "novita",
      model: "deepseek-ai/DeepSeek-R1-0528",
      messages: [{ role: "user", content: prompt }],
      // Optional: You might want to increase max_tokens if the suggestions are long
      // max_tokens: 1024, 
    });

    const output = chatCompletion.choices[0].message.content;
    const cleanedOutput = output.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

    // 3. Parse the string response into a JSON object. This is the crucial step.
    try {
      const jsonResponse = JSON.parse(cleanedOutput);
      return jsonResponse;
    } catch (parseError) {
      logger.error('Failed to parse AI JSON response:', cleanedOutput);
      throw new Error('AI enhancement failed: Invalid JSON format.');
    }

  } catch (error) {
    console.log("This is the error", error)
    logger.error('AI API error:', error.response?.data || error.message);
    const err = new Error('AI enhancement generation failed');
    err.status = 500;
    throw err;
  }
};
