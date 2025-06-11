import React, { createContext, useState, useCallback, useContext } from 'react';
import { getAllTemplates as apiGetAllTemplates } from '../api/templateServiceApi.js';
import useAuthContext from '../hooks/useAuth.js';

const TemplateContext = createContext(null);

const TemplateContextProvider = ({ children }) => {
    const [templates, setTemplates] = useState([]);
    const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
    const [templatesError, setTemplatesError] = useState(null);
    const { isAuthenticated } = useAuthContext();

    // The function to fetch templates is wrapped in useCallback.
    // This ensures that the function itself doesn't get recreated on every render,
    // which prevents infinite loops in components that depend on it (like TemplatesPage).
    const getAllTemplates = useCallback(async () => {

        setIsLoadingTemplates(true);
        setTemplatesError(null);
        try {
            const data = await apiGetAllTemplates();
            // Ensure we always work with an array.
            console.log(data)
            const templatesArray = Array.isArray(data) ? data : [];
            setTemplates(templatesArray);
            return templatesArray;
        } catch (error) {
            console.error("Error fetching templates in TemplateContext: ", error);
            setTemplatesError(error.message || "Failed to load templates. Please try again.");
            setTemplates([]); // Clear templates on error to prevent displaying stale data.
            return [];
        } finally {
            setIsLoadingTemplates(false);
        }
    }, [isAuthenticated]); // The function will only update if the authentication status changes.

    const contextValues = {
        templates,
        isLoadingTemplates,
        templatesError,
        getAllTemplates
    };

    return (
        <TemplateContext.Provider value={contextValues}>
            {children}
        </TemplateContext.Provider>
    );
};

// Custom hook for easy consumption of the context
export const useTemplateContext = () => {
    const context = useContext(TemplateContext);
    if (!context) {
        throw new Error('useTemplateContext must be used within a TemplateContextProvider');
    }
    return context;
}


export { TemplateContext, TemplateContextProvider };
