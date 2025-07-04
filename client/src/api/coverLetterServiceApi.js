import apiServer from './index.js';

/**
 * Generates cover letter text using the AI service.
 * @param {object} generationData - The data needed for generation.
 * @returns {Promise<object>} The API response with the generated content.
 */
export const generateCoverLetter = async (generationData) => {
    try {
        // FIX: Corrected route to match API documentation
        const response = await apiServer.post('/cover-letter/generate', generationData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to generate cover letter.' };
    }
};

/**
 * Saves a new cover letter to the user's account.
 * @param {object} letterData - The cover letter content and metadata.
 * @returns {Promise<object>} The API response with the saved cover letter.
 */
export const saveCoverLetter = async (letterData) => {
    try {
        // FIX: Corrected route to match API documentation
        const response = await apiServer.post('/cover-letter/save', letterData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to save cover letter.' };
    }
};

/**
 * Retrieves all saved cover letters for the logged-in user.
 * @returns {Promise<Array>} A promise that resolves to an array of cover letters.
 */
export const getAllCoverLetters = async () => {
    try {
        // FIX: Corrected route to match API documentation
        const response = await apiServer.get('/cover-letter/get-all');
        return response.data.coverLetters || [];
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch cover letters.' };
    }
};

/**
 * Retrieves a single saved cover letter by its ID.
 * This function may be needed if a user accesses an edit page via a direct link.
 * @param {string} coverLetterId - The ID of the cover letter.
 * @returns {Promise<object>} The API response with the specific cover letter.
 */
export const getCoverLetterById = async (coverLetterId) => {
    try {
        // Note: The provided doc did not have a get-one route, but it's good practice.
        // Assuming a route like this exists or might be added.
        const response = await apiServer.get(`/cover-letter/get-one/${coverLetterId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch cover letter details.' };
    }
}

/**
 * Updates a specific saved cover letter.
 * @param {string} coverLetterId - The ID of the cover letter to update.
 * @param {object} updateData - The data to update, e.g., { coverLetterContent: "..." }.
 * @returns {Promise<object>} The API response with the updated cover letter.
 */
export const updateCoverLetter = async (coverLetterId, updateData) => {
    try {
        // FIX: Corrected route to match API documentation
        const response = await apiServer.put(`/cover-letter/update/${coverLetterId}`, updateData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update cover letter.' };
    }
};

/**
 * Deletes a specific saved cover letter.
 * @param {string} coverLetterId - The ID of the cover letter to delete.
 * @returns {Promise<object>} The API success response.
 */
export const deleteCoverLetter = async (coverLetterId) => {
    try {
        // FIX: Corrected route to match API documentation
        const response = await apiServer.delete(`/cover-letter/delete/${coverLetterId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to delete cover letter.' };
    }
};
