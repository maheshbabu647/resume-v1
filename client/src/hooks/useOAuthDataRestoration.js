import { useEffect } from 'react';
import { getInitiallyEditedSections } from '@/utils/EditorUtils';

/**
 * Hook to restore OAuth-saved form data in the resume editor
 * This should only be used in the resume editor page
 */
export const useOAuthDataRestoration = ({
    setEditorFormData,
    setEditableResumeName,
    setSpacingMultiplier,
    setFontSizeMultiplier,
    setSectionOrder,
    setSelectedStylePackKey,
    setSelectedIndustry,
    setEditedSections,
    setPageIsLoading,
    setPageError,
    setPreviewUpdateKey,
    isAuthenticated,
    pageIsLoading,
    currentTemplateForEditor
}) => {
    useEffect(() => {
        // Only run on resume editor pages and when authenticated
        if (!isAuthenticated || pageIsLoading) return;
        
        // Check if we're on a resume editor page
        const isResumeEditorPage = window.location.pathname.includes('/resume/');
        if (!isResumeEditorPage) return;
        
        try {
            const savedFormData = localStorage.getItem('resume_editor_form_data');
            if (savedFormData) {
                const formData = JSON.parse(savedFormData);
                const now = Date.now();
                const dataAge = now - formData.timestamp;
                
                // Only restore data if it's less than 10 minutes old
                if (dataAge < 10 * 60 * 1000) {
                    console.log('OAuth: Restoring form data in resume editor:', formData);
                    
                    if (formData.editorFormData) {
                        setEditorFormData(formData.editorFormData);
                    }
                    if (formData.editableResumeName) {
                        setEditableResumeName(formData.editableResumeName);
                    }
                    if (formData.spacingMultiplier) {
                        setSpacingMultiplier(formData.spacingMultiplier);
                    }
                    if (formData.fontSizeMultiplier) {
                        setFontSizeMultiplier(formData.fontSizeMultiplier);
                    }
                    if (formData.sectionOrder) {
                        setSectionOrder(formData.sectionOrder);
                    }
                    if (formData.selectedStylePackKey) {
                        setSelectedStylePackKey(formData.selectedStylePackKey);
                    }
                    if (formData.selectedIndustry) {
                        setSelectedIndustry(formData.selectedIndustry);
                    }
                    if (formData.editedSections && Array.isArray(formData.editedSections)) {
                        setEditedSections(new Set(formData.editedSections));
                    } else if (formData.editorFormData?.content && currentTemplateForEditor?.templateFieldDefinition) {
                        // Fallback: calculate edited sections from form data if not saved
                        const calculatedEditedSections = getInitiallyEditedSections(
                            formData.editorFormData.content,
                            currentTemplateForEditor.templateFieldDefinition
                        );
                        setEditedSections(calculatedEditedSections);
                    }
                    
                    // Clear the saved data after restoration
                    localStorage.removeItem('resume_editor_form_data');
                    console.log('OAuth: Form data restored successfully in resume editor');
                    
                    // Force preview update to reflect restored data
                    setPreviewUpdateKey(prev => prev + 1);
                    
                    // Set page as loaded without fetching from server
                    setPageIsLoading(false);
                    setPageError(null);
                } else {
                    // Clear old data
                    localStorage.removeItem('resume_editor_form_data');
                }
            }
        } catch (error) {
            console.warn('OAuth: Could not restore form data from localStorage:', error);
            localStorage.removeItem('resume_editor_form_data');
        }
    }, [isAuthenticated, pageIsLoading, setEditorFormData, setEditableResumeName, setSpacingMultiplier, setFontSizeMultiplier, setSectionOrder, setSelectedStylePackKey, setSelectedIndustry, setEditedSections, setPageIsLoading, setPageError, setPreviewUpdateKey, currentTemplateForEditor]);
};
