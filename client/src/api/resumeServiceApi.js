import apiServer from './index.js';

// --- Existing Resume API Functions ---

export const createResume = async (resumePayLoad) => {
    try {
        const response = await apiServer.post('/resume/add', resumePayLoad);
        return response.data.resume; // API doc suggests this structure
    } catch (error) {
        console.error('Error Creating new resume: ', error.response?.data || error.message);
        throw error.response?.data || { message: 'Failed to create resume. Network error or server unavailable.' };
    }
};

export const getAllResumes = async () => {
    try {
        const response = await apiServer.get('/resume/getAll');
        return response.data.resumes; // API doc suggests this structure
    } catch (error) {
        console.error('Error fetching user resumes: ', error.response?.data || error.message);
        throw error.response?.data || { message: 'Failed to fetch your resumes.' };
    }
};

export const downloadResume = async (htmlContent) => { // Changed parameter name from resumeCode to htmlContent
    try {
        const response = await apiServer.post('/resume/download',
            { html: htmlContent }, // API expects an object with an 'html' key
            { responseType: 'blob' }
        );
        
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'My_Resume.pdf'; // Filename as per API doc
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        // No explicit return needed as it triggers a download
    } catch (error) {
        console.error('Error downloading user resume: ', error.response?.data || error.message);
        throw error.response?.data || { message: 'Failed to download your resume.' };
    }
};

export const getById = async (resumeId) => {
    try {
        if (!resumeId) {
            throw new Error('Resume ID is required to fetch a resume.');
        }
        const response = await apiServer.get(`/resume/getById/${resumeId}`);
        return response.data.resume; // API doc suggests this structure
    } catch (error) {
        console.error(`Error fetching resume with Id ${resumeId}: `, error.response?.data || error.message);
        throw error.response?.data || { message: `Failed to fetch resume ${resumeId}` };
    }
};

export const updateResume = async (resumeId, resumePayLoad) => {
    try {
        if (!resumeId) {
            throw new Error('Resume ID is required to update a resume.');
        }
        const response = await apiServer.put(`/resume/update/${resumeId}`, resumePayLoad);
        return response.data.resume; // API doc suggests this structure
    } catch (error) {
        console.error(`Error updating resume with ID ${resumeId}`, error.response?.data || error.message);
        throw error.response?.data || { message: `Failed to update resume ${resumeId}` };
    }
};

export const deleteResume = async (resumeId) => {
    try {
        if (!resumeId) {
            throw new Error(`Resume Id is required to delete a resume.`);
        }
        const response = await apiServer.delete(`/resume/delete/${resumeId}`);
        return response.data; // API doc suggests { message: "Resume deleted successfully." }
    } catch (error) {
        console.error(`Error deleting resume with ID ${resumeId}`, error.response?.data || error.message);
        throw error.response?.data || { message: `Failed to delete resume ${resumeId}.` };
    }
};

// --- New AI Summary Function ---

/**
 * Generates a resume summary using AI based on the provided resume data.
 * @param {object} resumeData - The structured data of the resume (e.g., experience, skills).
 * @returns {Promise<string>} A promise that resolves to the AI-generated summary string.
 * @throws {Error} If the API request fails or the summary is not returned.
 */
export const generateAISummary = async (resumeData) => {
    try {
        // The API documentation expects the resumeData object directly as the payload
        console.log(resumeData)
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



// Add this new function to your resumeServiceApi.js file

/**
 * Sends text to the AI for enhancement and receives structured suggestions.
 * @param {string} textToEnhance - The text the user wants to improve.
 * @param {string} jobContext - The related context (e.g., job title) to make suggestions more relevant.
 * @returns {Promise<object>} A promise that resolves to the structured object of AI suggestions.
 * @throws {Error} If the API request fails or the suggestions are not returned.
 */
export const enhanceResumeField = async (textToEnhance, jobContext) => {
    try {
        // The API expects an object with textToEnhance and jobContext keys
        const payload = { textToEnhance, jobContext };
        console.log(payload)
        const response = await apiServer.post('/resume/ai/enhance-field', payload);
        console.log(response)

        if (response.data && response.data.success && typeof response.data.suggestions === 'object') {
            return response.data.suggestions;
        } else {
            throw new Error(response.data.message || 'Failed to get suggestions or suggestions not found in response.');
        }
    } catch (error) {
        console.error('Error enhancing resume field:', error.response?.data || error.message);
        const errorMessage = error.response?.data?.message ||
            'Failed to get AI suggestions. The server might be busy, or the request was invalid.';
        throw { message: errorMessage };
    }
};