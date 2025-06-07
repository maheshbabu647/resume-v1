import apiServer from './index.js';

export const createTemplate = async (formData) => {
    try {
        // When sending FormData, the browser automatically sets the correct
        // 'multipart/form-data' header with the boundary. Do not set it manually.
        const response = await apiServer.post('/admin/template/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to create template.' };
    }
};

export const updateTemplate = async (templateId, formData) => {
    try {
        // The same principle applies to updates with file uploads.
        const response = await apiServer.put(`/admin/template/update/${templateId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: `Failed to update template ${templateId}.` };
    }
};

export const getAllTemplates = async () => {
    try {
        const response = await apiServer.get('/template/getAll');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch templates.' };
    }
};

export const getTemplateById = async (templateId) => {
    try {
        const response = await apiServer.get(`/template/${templateId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch template.' };
    }
};

export const deleteTemplate = async (templateId) => {
    try {
        const response = await apiServer.delete(`/admin/template/delete/${templateId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to delete template.' };
    }
};
