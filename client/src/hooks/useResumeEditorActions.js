import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { downloadResume } from "@/api/resumeServiceApi";

// Helper function can be co-located or imported from a utils file
const hasUntouchedPlaceholders = (data) => {
    if (typeof data === 'string') {
        return /\[.*\]/.test(data);
    }
    if (Array.isArray(data)) {
        return data.some(item => hasUntouchedPlaceholders(item));
    }
    if (typeof data === 'object' && data !== null) {
        return Object.values(data).some(value => hasUntouchedPlaceholders(value));
    }
    return false;
};

export const useResumeEditorActions = ({
    // STATE & PROPS
    isAuthenticated,
    editorFormData,
    editableResumeName,
    spacingMultiplier,
    fontSizeMultiplier,
    sectionOrder,
    selectedStylePackKey,
    selectedIndustry,
    mode,
    newResumeTemplateId,
    existingResumeId,
    currentResumeDetail,
    currentTemplateForEditor,
    
    // REFS
    resumePreviewRef,

    // STATE SETTERS
    setPendingAction,
    setShowPlaceholderWarning,
    setShowAuthDialog,
    setSaveStatus,
    setFeedbackDetailsForDialog,
    setIsDirty,
    setIsDownloadingPdf,
    setPageError,
    setShowFeedbackDialog,

    // CONTEXT & OTHER HOOKS
    saveOrUpdateCurrentResume,
    handleSimpleChange,
    handleArrayItemChange,
}) => {
    const navigate = useNavigate();

    // --- SAVE LOGIC ---
    const executeSaveResume = useCallback(async () => {
        if (!isAuthenticated) {
            setPendingAction('save');
            setShowAuthDialog(true);
            return;
        }
        console.log('[SAVE] Starting save operation');
        console.log('[SAVE] editorFormData being saved:', editorFormData);
        console.log('[SAVE] editorFormData.content:', editorFormData?.content);
        console.log('[SAVE] editorFormData.sectionsConfig:', editorFormData?.sectionsConfig);
        setSaveStatus('saving');
        const savedResult = await saveOrUpdateCurrentResume(
            editorFormData,
            editableResumeName.trim(),
            spacingMultiplier,
            sectionOrder,
            selectedStylePackKey,
            selectedIndustry,
            fontSizeMultiplier
        );
        console.log('[SAVE] Save result:', savedResult);
        if (savedResult?._id) {
            setFeedbackDetailsForDialog({ title: 'Success!', message: 'Resume saved successfully!', type: 'success' });
            setShowFeedbackDialog(true);
            setIsDirty(false);
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 2500);
            if (mode === 'create') {
                navigate(`/resume/edit/${savedResult._id}`, { replace: true });
            }
        } else {
            setSaveStatus('idle');
        }
    }, [isAuthenticated, editorFormData, editableResumeName, spacingMultiplier, fontSizeMultiplier, sectionOrder, selectedStylePackKey, selectedIndustry, mode, setPendingAction, setShowAuthDialog, setSaveStatus, saveOrUpdateCurrentResume, setFeedbackDetailsForDialog, setIsDirty, navigate]);

    const handleSaveResume = useCallback(() => {
        if (hasUntouchedPlaceholders(editorFormData.content)) {
            setPendingAction('save');
            setShowPlaceholderWarning(true);
            return;
        }
        executeSaveResume();
    }, [editorFormData, executeSaveResume, setPendingAction, setShowPlaceholderWarning]);

    // --- DOWNLOAD LOGIC ---
    const executeDownloadPdf = useCallback(async () => {
        if (!isAuthenticated) {
            setPendingAction('download');
            setShowAuthDialog(true);
            return;
        }
        if (!resumePreviewRef.current) return;

        setIsDownloadingPdf(true);
        try {
            const previewElement = resumePreviewRef.current;
            const styleElement = previewElement.querySelector('style');
            const resumeContainer = previewElement.querySelector('.rt-container');

            if (!styleElement || !resumeContainer) {
                throw new Error("Could not find style or resume content for PDF generation.");
            }
            const cleanHtmlForPdf = styleElement.outerHTML + resumeContainer.outerHTML;
            await downloadResume(cleanHtmlForPdf);
        } catch (error) {
            setPageError('Failed to download PDF.');
        } finally {
            setIsDownloadingPdf(false);
        }
    }, [isAuthenticated, resumePreviewRef, setPendingAction, setShowAuthDialog, setIsDownloadingPdf, setPageError]);

    const handleDownloadPdf = useCallback(() => {
        if (hasUntouchedPlaceholders(editorFormData.content)) {
            setPendingAction('download');
            setShowPlaceholderWarning(true);
            return;
        }
        executeDownloadPdf();
    }, [editorFormData, executeDownloadPdf, setPendingAction, setShowPlaceholderWarning]);

    // --- OTHER ACTIONS ---
    const handlePreviewPage = useCallback(() => {
        const targetPath = mode === 'create' 
          ? `/resume/view/${newResumeTemplateId}` 
          : `/resume/saved/view/${existingResumeId}`;
        
        navigate(targetPath, {
            state: { 
                formData: editorFormData, 
                resumeName: editableResumeName,
                spacingMultiplier,
                fontSizeMultiplier,
                sectionOrder,
                stylePackKey: selectedStylePackKey,
                selectedIndustry,
                template: currentTemplateForEditor
            } 
        });
    }, [mode, newResumeTemplateId, existingResumeId, navigate, editorFormData, editableResumeName, spacingMultiplier, fontSizeMultiplier,  sectionOrder, selectedStylePackKey, selectedIndustry, currentTemplateForEditor]);



    return {
        handleSaveResume,
        executeSaveResume,
        handleDownloadPdf,
        executeDownloadPdf,
        handlePreviewPage,
    };
};