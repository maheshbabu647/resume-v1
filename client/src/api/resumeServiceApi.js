/**
 * @fileoverview Resume Service API - Handles all resume-related API calls
 * @module api/resumeServiceApi
 * @description Provides functions to interact with the resume backend API including
 * CRUD operations, AI-powered content generation, and PDF downloads.
 */

import apiServer from './index.js';
import { isLimitError, parseLimitError } from '../utils/rateLimitHandler.js';

// ============================================================================
// RESUME CRUD OPERATIONS
// ============================================================================

/**
 * Creates a new resume in the database
 * @async
 * @function createResume
 * @param {Object} resumePayLoad - The resume data payload
 * @param {string} resumePayLoad.templateId - ID of the template to use
 * @param {Object} resumePayLoad.resumeData - The structured resume content
 * @param {string} resumePayLoad.resumeName - Name of the resume
 * @param {number} [resumePayLoad.spacingMultiplier=1] - Layout spacing multiplier
 * @param {number} [resumePayLoad.fontSizeMultiplier=1] - Font size multiplier
 * @param {Array} [resumePayLoad.sectionOrder] - Custom section ordering
 * @param {string} [resumePayLoad.stylePackKey] - Selected style pack key
 * @param {string} [resumePayLoad.selectedIndustry] - Target industry
 * @returns {Promise<Object>} The created resume object
 * @throws {Error} If the API request fails or returns an error
 * @example
 * const newResume = await createResume({
 *   templateId: '123',
 *   resumeData: { content: {...}, sectionsConfig: {...} },
 *   resumeName: 'Software Engineer Resume'
 * });
 */
export const createResume = async (resumePayLoad) => {
    try {
        const response = await apiServer.post('/resume/add', resumePayLoad);
        return response.data.resume;
    } catch (error) {
        console.error('Error Creating new resume: ', error.response?.data || error.message);
        throw error.response?.data || { message: 'Failed to create resume. Network error or server unavailable.' };
    }
};

/**
 * Retrieves all resumes for the authenticated user
 * @async
 * @function getAllResumes
 * @returns {Promise<Array<Object>>} Array of resume objects belonging to the user
 * @throws {Error} If the API request fails or user is not authenticated
 * @example
 * const resumes = await getAllResumes();
 * console.log(`Found ${resumes.length} resumes`);
 */
export const getAllResumes = async () => {
    try {
        const response = await apiServer.get('/resume/getAll');
        return response.data.resumes;
    } catch (error) {
        console.error('Error fetching user resumes: ', error.response?.data || error.message);
        throw error.response?.data || { message: 'Failed to fetch your resumes.' };
    }
};

/**
 * Downloads a resume as a PDF file
 * @async
 * @function downloadResume
 * @param {string} htmlContent - The HTML content of the resume to convert to PDF
 * @param {Object} [resumeDataForSave] - Optional resume data to save if not already saved
 * @param {string} [resumeDataForSave.resumeId] - Existing resume ID if resume is saved
 * @param {string} [resumeDataForSave.templateId] - Template ID for auto-save
 * @param {Object} [resumeDataForSave.resumeData] - Resume data for auto-save
 * @param {string} [resumeDataForSave.resumeName] - Resume name for auto-save
 * @param {number} [resumeDataForSave.spacingMultiplier] - Spacing multiplier
 * @param {number} [resumeDataForSave.fontSizeMultiplier] - Font size multiplier
 * @param {string} [resumeDataForSave.stylePackKey] - Style pack key
 * @param {Array} [resumeDataForSave.sectionOrder] - Section order
 * @param {string} [resumeDataForSave.selectedIndustry] - Selected industry
 * @returns {Promise<void>} Triggers a browser download, no return value
 * @throws {Error} If the PDF generation or download fails
 * @description Converts HTML resume content to PDF and triggers a browser download.
 * If resume data is provided and the resume hasn't been saved, it will be automatically saved.
 * The function creates a temporary link element to download the file and cleans up after.
 * @example
 * const html = '<html><body>Resume content...</body></html>';
 * await downloadResume(html);
 * // Or with auto-save:
 * await downloadResume(html, {
 *   templateId: '123',
 *   resumeData: { content: {...} },
 *   resumeName: 'My Resume'
 * });
 */
export const downloadResume = async (htmlContent, resumeDataForSave = null) => {
    try {
        const requestBody = { html: htmlContent };
        
        // Include resume data for auto-save if provided
        if (resumeDataForSave) {
            if (resumeDataForSave.resumeId) {
                requestBody.resumeId = resumeDataForSave.resumeId;
            }
            if (resumeDataForSave.templateId) {
                requestBody.templateId = resumeDataForSave.templateId;
            }
            if (resumeDataForSave.resumeData) {
                requestBody.resumeData = resumeDataForSave.resumeData;
            }
            if (resumeDataForSave.resumeName) {
                requestBody.resumeName = resumeDataForSave.resumeName;
            }
            if (resumeDataForSave.spacingMultiplier !== undefined) {
                requestBody.spacingMultiplier = resumeDataForSave.spacingMultiplier;
            }
            if (resumeDataForSave.fontSizeMultiplier !== undefined) {
                requestBody.fontSizeMultiplier = resumeDataForSave.fontSizeMultiplier;
            }
            if (resumeDataForSave.stylePackKey) {
                requestBody.stylePackKey = resumeDataForSave.stylePackKey;
            }
            if (resumeDataForSave.sectionOrder) {
                requestBody.sectionOrder = resumeDataForSave.sectionOrder;
            }
            if (resumeDataForSave.selectedIndustry) {
                requestBody.selectedIndustry = resumeDataForSave.selectedIndustry;
            }
        }
        
        const response = await apiServer.post('/resume/download',
            requestBody,
            { responseType: 'blob' }
        );
        
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'My_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error('Error downloading user resume: ', error.response?.data || error.message);
        throw error.response?.data || { message: 'Failed to download your resume.' };
    }
};

/**
 * Retrieves a specific resume by its ID
 * @async
 * @function getById
 * @param {string} resumeId - The unique identifier of the resume
 * @returns {Promise<Object>} The resume object with all its data
 * @throws {Error} If the resume ID is missing or the resume is not found
 * @example
 * const resume = await getById('64abc123def456');
 * console.log(resume.resumeName);
 */
export const getById = async (resumeId) => {
    try {
        if (!resumeId) {
            throw new Error('Resume ID is required to fetch a resume.');
        }
        const response = await apiServer.get(`/resume/getById/${resumeId}`);
        return response.data.resume;
    } catch (error) {
        console.error(`Error fetching resume with Id ${resumeId}: `, error.response?.data || error.message);
        throw error.response?.data || { message: `Failed to fetch resume ${resumeId}` };
    }
};

/**
 * Updates an existing resume
 * @async
 * @function updateResume
 * @param {string} resumeId - The unique identifier of the resume to update
 * @param {Object} resumePayLoad - The updated resume data (same structure as createResume)
 * @returns {Promise<Object>} The updated resume object
 * @throws {Error} If the resume ID is missing or the update fails
 * @example
 * const updated = await updateResume('64abc123def456', {
 *   resumeName: 'Updated Resume Name',
 *   resumeData: { content: {...} }
 * });
 */
export const updateResume = async (resumeId, resumePayLoad) => {
    try {
        if (!resumeId) {
            throw new Error('Resume ID is required to update a resume.');
        }
        const response = await apiServer.put(`/resume/update/${resumeId}`, resumePayLoad);
        return response.data.resume;
    } catch (error) {
        console.error(`Error updating resume with ID ${resumeId}`, error.response?.data || error.message);
        throw error.response?.data || { message: `Failed to update resume ${resumeId}` };
    }
};

/**
 * Deletes a resume from the database
 * @async
 * @function deleteResume
 * @param {string} resumeId - The unique identifier of the resume to delete
 * @returns {Promise<Object>} Confirmation message object
 * @throws {Error} If the resume ID is missing or the deletion fails
 * @example
 * await deleteResume('64abc123def456');
 * console.log('Resume deleted successfully');
 */
export const deleteResume = async (resumeId) => {
    try {
        if (!resumeId) {
            throw new Error(`Resume Id is required to delete a resume.`);
        }
        const response = await apiServer.delete(`/resume/delete/${resumeId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting resume with ID ${resumeId}`, error.response?.data || error.message);
        throw error.response?.data || { message: `Failed to delete resume ${resumeId}.` };
    }
};

// ============================================================================
// AI-POWERED CONTENT GENERATION
// ============================================================================

/**
 * Generates an AI-powered professional summary for a resume
 * @async
 * @function generateAISummary
 * @param {Object} resumeData - The structured resume data to analyze
 * @param {Object} resumeData.experience - Work experience entries
 * @param {Object} resumeData.skills - Skills and competencies
 * @param {Object} resumeData.education - Educational background
 * @returns {Promise<string>} AI-generated professional summary text
 * @throws {Error} If the API request fails or summary generation is unsuccessful
 * @description Uses AI to analyze resume data and generate a compelling professional summary
 * that highlights key achievements and skills.
 * @example
 * const summary = await generateAISummary({
 *   experience: [...],
 *   skills: [...],
 *   education: [...]
 * });
 */
export const generateAISummary = async (resumeData) => {
    try {
        console.log('Generating AI summary with data:', resumeData);
        const response = await apiServer.post('/resume/generate-summary', resumeData);
        if (response.data && response.data.success && typeof response.data.summary === 'string') {
            return response.data.summary;
        } else {
            throw new Error(response.data.message || 'Failed to generate summary or summary not found in response.');
        }
    } catch (error) {
        console.error('Error generating AI summary:', error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || 
                             (error.response?.data?.name === "VALIDATION_ERROR" && Array.isArray(error.response?.data?.message) 
                                ? error.response.data.message.map(e => e.message).join(', ') 
                                : null) ||
                             error.message ||
                             'Failed to generate AI summary. Please ensure all relevant fields are filled.';
        throw { message: errorMessage };
    }
};

/**
 * Generates AI content for a specific resume field with contextual awareness
 * @async
 * @function generateAIFieldContent
 * @param {Object} payload - The content generation configuration
 * @param {string} payload.fieldName - Name of the field to generate content for
 * @param {string} payload.fieldLabel - Display label of the field
 * @param {string} payload.fieldType - Type of field (text, textarea, etc.)
 * @param {Object} payload.globalContext - Global resume context (setup data)
 * @param {Object} payload.localContext - Local section context (related field data)
 * @param {string} [payload.userNotes=''] - Additional user-provided guidance
 * @param {string} [payload.userNotesPrompt=''] - Prompt for collecting user notes
 * @param {string} payload.targetField - The full path of the target field
 * @returns {Promise<string>} AI-generated content for the field
 * @throws {Error} If the API request fails or content generation is unsuccessful
 * @description Generates contextually relevant content for individual resume fields using AI,
 * considering both global resume context and local section-specific information.
 * @example
 * const content = await generateAIFieldContent({
 *   fieldName: 'responsibilities',
 *   globalContext: { targetRole: 'Software Engineer' },
 *   localContext: { company: 'Tech Corp', title: 'Developer' },
 *   userNotes: 'Focus on leadership'
 * });
 */
export const generateAIFieldContent = async (payload) => {
    try {
        console.log('AI Field Generation Payload:', payload);
        const response = await apiServer.post('/resume/generate-field-content', payload);
        if (response.data && response.data.success && typeof response.data.content === 'string') {
            return response.data.content;
        } else {
            throw new Error(response.data.message || 'Failed to generate field content or content not found in response.');
        }
    } catch (error) {
        console.error('Error generating AI field content:', error.response?.data || error.message);
        
        // Check if it's a rate limit or cost limit error
        if (isLimitError(error)) {
            const limitError = parseLimitError(error);
            throw { 
                message: error.response?.data?.message || error.message,
                isLimitError: true,
                limitError: limitError,
                hint: error.response?.data?.hint,
                resetTime: error.response?.data?.resetTime
            };
        }
        
        const errorMessage = error.response?.data?.message || 
                             (error.response?.data?.name === "VALIDATION_ERROR" && Array.isArray(error.response?.data?.message) 
                                ? error.response.data.message.map(e => e.message).join(', ') 
                                : null) ||
                             error.message ||
                             'Failed to generate AI field content. Please ensure all relevant context is provided.';
        throw { message: errorMessage };
    }
};

/**
 * Enhances an entire resume using AI to improve content quality
 * @async
 * @function enhanceEntireResume
 * @param {Object} config - Enhancement configuration
 * @param {Object} config.resumeData - The current resume data to enhance
 * @param {Object} [config.globalContext={}] - Global context (target role, industry, etc.)
 * @param {string} [config.userNotes=''] - User-provided enhancement guidance
 * @returns {Promise<Object>} Enhanced resume data with improved content
 * @throws {Error} If the enhancement fails or API request is unsuccessful
 * @description Uses AI to comprehensively enhance all resume content, improving phrasing,
 * adding relevant keywords, and optimizing for impact while maintaining accuracy.
 * @example
 * const enhanced = await enhanceEntireResume({
 *   resumeData: { content: {...} },
 *   globalContext: { targetRole: 'Senior Developer' },
 *   userNotes: 'Emphasize leadership and architecture experience'
 * });
 */
export const enhanceEntireResume = async ({ resumeData, globalContext = {}, userNotes = '' }) => {
    try {
        const response = await apiServer.post('/resume/enhance-entire', {
            resumeData,
            globalContext,
            userNotes
        });
        if (response.data && response.data.success && response.data.enhancedResumeData) {
            console.log('Enhanced Resume Data:', response.data.enhancedResumeData);
            return response.data.enhancedResumeData;
        }
        throw new Error(response.data?.message || 'Failed to enhance resume.');
    } catch (error) {
        console.error('Error enhancing entire resume:', error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || error.message || 'Enhancement failed.';
        throw { message: errorMessage };
    }
};
