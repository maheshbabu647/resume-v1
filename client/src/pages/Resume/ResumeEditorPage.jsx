

import React, { useEffect, useCallback, Suspense, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from 'framer-motion';
import { get, set, cloneDeep, isEqual } from 'lodash';

// UI Components & Icons
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Eye, Settings2, RefreshCw, AlertCircle, Edit2 } from "lucide-react";
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';

// Custom Components
import EditorHeader from '@/components/ResumeEditor/EditorHeader'; 
import CustomizePanel from "@/components/ResumeEditor/CustomizationPanel";
import EnhancementDialog from '@/components/ResumeEditor/EnhancementDialog';
import AuthDialog from '@/components/Auth/AuthDialog.jsx';
import { TooltipDialog } from "@/components/ResumeEditor/TooltipDialog";
import { FeedbackDialog, PlaceholderWarningDialog, AddSectionDialog } from '@/components/ResumeEditor/EditorDialogs';
const ResumePreview = React.lazy(() => import("@/components/ResumeEditor/ResumePreview"));
const ResumeForm = React.lazy(() => import("@/components/ResumeEditor/ResumeForm"));

// Hooks
import { useResumeEditorState } from '@/hooks/useResumeEditorState';
import { useResumeEditorActions } from "@/hooks/useResumeEditorActions";
import { useSectionHandlers } from '@/hooks/useSectionHandlers';
import { useFormHandlers } from '@/hooks/useFormHandlers';
import { useDesignHandlers } from '@/hooks/useDesignHandlers';
import { usePageSetupEffect } from '@/hooks/usePageSetupEffect';
import { useOAuthDataRestoration } from '@/hooks/useOAuthDataRestoration';

// Utilities
import { initializeFormDataFromDefinitions, calculateProgressData } from '@/utils/EditorUtils';
import { cn } from "@/lib/utils";

const ResumeEditorPage = () => {
    const {
        newResumeTemplateId, existingResumeId, navigate, location,
        resumePreviewRef, nameInputRef,
        auth: { isAuthenticated, isLoading: isAuthLoading },
        templates: { templates: allTemplates, getAllTemplates, isLoadingTemplates },
        resume: {
            currentResumeDetail, editorFormData, setEditorFormData, isSavingResume,
            resumeError, loadResumeForEditor, prepareNewResumeForEditor,
            saveOrUpdateCurrentResume, clearCurrentEditorData, isLoadingCurrentResume
        },
        // All State & Setters
        mode, setMode, pageIsLoading, setPageIsLoading,
        pageError, setPageError, currentTemplateForEditor, setCurrentTemplateForEditor,
        editableResumeName, setEditableResumeName, isEditingName, setIsEditingName,
        previewUpdateKey, setPreviewUpdateKey,
        isDownloadingPdf, setIsDownloadingPdf, showFeedbackDialog, setShowFeedbackDialog,
        feedbackDetailsForDialog, setFeedbackDetailsForDialog, showAuthDialog, setShowAuthDialog,
        isEnhancing, setIsEnhancing, enhancementSuggestions, setEnhancementSuggestions,
        activeEnhancementInfo, setActiveEnhancementInfo, isDirty, setIsDirty,
        saveStatus, setSaveStatus, showPlaceholderWarning, setShowPlaceholderWarning,
        pendingAction, setPendingAction, isAddSectionDialogOpen, setIsAddSectionDialogOpen,
        activeMobileView, setActiveMobileView, isCustomizeDialogOpen, setIsCustomizeDialogOpen,
        editedSections, setEditedSections, spacingMultiplier, setSpacingMultiplier,
        fontSizeMultiplier, setFontSizeMultiplier,
        selectedStylePackKey, setSelectedStylePackKey, sectionOrder, setSectionOrder,
        selectedPresetKey, setSelectedPresetKey, selectedIndustry, setSelectedIndustry,
        zoomLevel, setZoomLevel,
        isTooltipDialogOpen, setIsTooltipDialogOpen, 
        tooltipContent, setTooltipContent, 
    } = useResumeEditorState();

    const {
      handleSimpleChange,
      handleArrayItemChange,
      handleAddItemToArray,
      handleRemoveItemFromArray,
    } = useFormHandlers({
        setEditorFormData,
        setIsDirty,
        setEditedSections,
    });

    const {
        handleStylePackChange,
        handlePresetChange,
        handleSpacingChange,
        handleResumeNameChange,
        handleFontSizeChange,
    } = useDesignHandlers({
        setIsDirty,
        setSelectedStylePackKey,
        currentTemplateForEditor,
        setSelectedPresetKey,
        setSectionOrder,
        setSpacingMultiplier,
        setFontSizeMultiplier,
        setEditableResumeName,
    });

    // 2. Specialized hooks consume state and setters from the hook above.
    const {
        sectionProperties,
        handleSectionToggle,
        handleAddChosenSection,
        handleIndustryChange,
    } = useSectionHandlers({
        setEditorFormData,
        currentTemplateForEditor,
        setIsAddSectionDialogOpen,
        setIsDirty,
    });

    const {
        handleSaveResume, handleDownloadPdf, handlePreviewPage, handleEnhanceField,
        handleAcceptSuggestion, executeSaveResume, executeDownloadPdf,
    } = useResumeEditorActions({
        isAuthenticated, editorFormData, editableResumeName, spacingMultiplier,
        fontSizeMultiplier,
        sectionOrder, selectedStylePackKey, selectedIndustry, mode,
        newResumeTemplateId, existingResumeId, activeEnhancementInfo,
        currentTemplateForEditor, resumePreviewRef, setPendingAction,
        setShowPlaceholderWarning, setShowAuthDialog, setSaveStatus,
        setFeedbackDetailsForDialog, setIsDirty, setIsDownloadingPdf,
        setPageError, setIsEnhancing, setActiveEnhancementInfo,
        setEnhancementSuggestions, setShowFeedbackDialog,
        saveOrUpdateCurrentResume, handleSimpleChange, handleArrayItemChange,
    });  

    usePageSetupEffect({
      existingResumeId, newResumeTemplateId, location, isAuthLoading,
      loadResumeForEditor, currentResumeDetail, editorFormData, allTemplates,
      getAllTemplates, prepareNewResumeForEditor, setPageIsLoading, setPageError,
      setMode, setCurrentTemplateForEditor, setEditorFormData, setEditableResumeName,
      setSpacingMultiplier, setFontSizeMultiplier, setSelectedIndustry, setSelectedStylePackKey,
      setSectionOrder, setSelectedPresetKey, setEditedSections
    });

    const handleShowTooltip = (title, message) => {
        setTooltipContent({ title, message });
        setIsTooltipDialogOpen(true);
    };

    // --- ORCHESTRATION HANDLERS ---
    const handleConfirmAction = () => {
        setShowPlaceholderWarning(false);
        if (pendingAction === 'save') { executeSaveResume(); } 
        else if (pendingAction === 'download') { executeDownloadPdf(); }
        setPendingAction(null);
    };

    const handleAuthSuccess = async () => {
        if (pendingAction === 'save') { await executeSaveResume(); } 
        else if (pendingAction === 'download') { await executeDownloadPdf(); }
        setPendingAction(null);
    };
    
    // --- OTHER EFFECTS ---
    useEffect(() => {
        if (isEditingName && nameInputRef.current) {
            nameInputRef.current.focus();
            nameInputRef.current.select();
        }
    }, [isEditingName]);

    // OAuth form data restoration
    useOAuthDataRestoration({
        setEditorFormData,
        setEditableResumeName,
        setSpacingMultiplier,
        setFontSizeMultiplier,
        setSectionOrder,
        setSelectedStylePackKey,
        setSelectedIndustry,
        setPageIsLoading,
        setPageError,
        setPreviewUpdateKey,
        isAuthenticated,
        pageIsLoading
    });

    useEffect(() => { return () => { if (!window.location.pathname.startsWith('/resume/')) clearCurrentEditorData(); }; }, [location.pathname, clearCurrentEditorData]);
    useEffect(() => { if (resumeError && saveStatus === 'saving') { setFeedbackDetailsForDialog({ title: 'Operation Failed', message: resumeError.message || 'An unexpected error occurred.', type: 'error' }); setShowFeedbackDialog(true); } }, [resumeError, saveStatus]);
    
    // --- MEMOIZED CALCULATIONS ---
    const progressData = useMemo(() => {
        const definitions = currentTemplateForEditor?.templateFieldDefinition;
        if (!definitions || !editorFormData?.content) {
            return { completed: 0, total: 0, progress: 0 };
        }
        return calculateProgressData(definitions, editorFormData);
    }, [editorFormData, currentTemplateForEditor]);
  
    const industryOptions = useMemo(() => {
        if (!currentTemplateForEditor?.templateFieldDefinition) return [];
        const allIndustries = new Set();
        currentTemplateForEditor.templateFieldDefinition.forEach(field => {
            if (Array.isArray(field.recommendedFor)) {
                field.recommendedFor.forEach(industry => allIndustries.add(industry));
            }
        });
        return Array.from(allIndustries).sort();
    }, [currentTemplateForEditor]);

    const progressBarColor = useMemo(() => {
        const { progress } = progressData;
        if (progress === 100) return 'bg-green-500';
        if (progress >= 75) return 'bg-blue-600';
        if (progress >= 50) return 'bg-sky-500';
        if (progress >= 25) return 'bg-yellow-400';
        return 'bg-amber-400';
    }, [progressData]);

    // --- RENDER LOGIC ---
    const isInitiallyLoading = pageIsLoading || isAuthLoading || isLoadingTemplates || (mode === 'edit' && isLoadingCurrentResume);

    if (isInitiallyLoading) {
        return <div className="flex items-center justify-center min-h-screen bg-background"><LoadingSpinner size="large" label="Preparing Editor..." /></div>;
    }
  
    if (pageError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
                <Alert variant="destructive" className="max-w-lg w-full">
                    <AlertCircle className="h-5 w-5" /><AlertTitle>Error Loading Editor</AlertTitle><AlertDescription>{pageError}</AlertDescription>
                </Alert>
                <Button variant="outline" onClick={() => window.location.reload()} className="mt-6"><RefreshCw className="mr-2 h-4 w-4" /> Try Again</Button>
            </div>
        );
    }

    const seoTitle = mode === 'edit' ? `${editableResumeName || "Edit Resume"} | CareerForge Editor` : `Create ${currentTemplateForEditor?.templateName || "New Resume"} | CareerForge Editor`;

    return (
        <>
            <Helmet><title>{seoTitle}</title></Helmet>
            <div className="flex flex-col min-h-screen bg-muted/20 text-foreground">
                <EditorHeader
                    resumeName={editableResumeName}
                    templateName={currentTemplateForEditor?.templateName}
                    progressData={progressData}
                    isDirty={isDirty}
                    saveStatus={saveStatus}
                    isDownloadingPdf={isDownloadingPdf}
                    isEditingName={isEditingName}
                    setIsEditingName={setIsEditingName}
                    onNameChange={handleResumeNameChange}
                    onBack={() => navigate(existingResumeId ? '/dashboard' : '/templates')}
                    onPreview={handlePreviewPage}
                    onDownloadPdf={handleDownloadPdf}
                    onSave={handleSaveResume}
                />

                <main className="flex-grow container mx-auto px-2 sm:px-4 md:px-6 py-3 md:py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start pb-20 lg:pb-0">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} 
                            className={cn("lg:sticky lg:top-[95px] h-fit lg:col-span-5", { 'hidden lg:block': activeMobileView !== 'edit' })}
                        >
                            <ResumeForm 
                                templateFieldDefinition={currentTemplateForEditor?.templateFieldDefinition || []}
                                formData={editorFormData || {}}
                                onFormChange={handleSimpleChange}
                                onArrayChange={handleArrayItemChange}
                                onAddItem={handleAddItemToArray}
                                onRemoveItem={handleRemoveItemFromArray}
                                onSectionToggle={handleSectionToggle}
                                onEnhanceField={handleEnhanceField}
                                isEnhancing={isEnhancing}
                                onOpenAddSectionDialog={() => setIsAddSectionDialogOpen(true)}
                                sectionProperties={sectionProperties}
                                onShowTooltip={handleShowTooltip}
                                onSectionAdd={(sectionKey) => {
                                    // Optional: Add any additional logic when a section is added
                                    console.log(`New section added: ${sectionKey}`);
                                }}
                            />
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }} 
                            className={cn("lg:sticky lg:top-[75px] h-fit lg:col-span-7", { 'hidden lg:block': activeMobileView !== 'preview' })}
                        >   
                            <div className="hidden lg:flex items-center justify-between gap-4 p-3 border border-border bg-card rounded-lg shadow-sm mb-3">
                                {/* Spacing Control is inside CustomizePanel now for this example */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button 
                                            variant="outline" 
                                            className="ml-4 flex-shrink-0"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                        >
                                            <Settings2 className="mr-2 h-4 w-4" /> Customize
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 p-4">
                                        <div className="grid gap-4">
                                            <div className="space-y-1">
                                                <h4 className="font-medium leading-none">Advanced Customization</h4>
                                                <p className="text-sm text-muted-foreground">Tailor your resume's style, layout, and industry focus.</p>
                                            </div>
                                            <CustomizePanel
                                                spacingMultiplier={spacingMultiplier}
                                                fontSizeMultiplier={fontSizeMultiplier}
                                                selectedStylePackKey={selectedStylePackKey}
                                                selectedPresetKey={selectedPresetKey}
                                                selectedIndustry={selectedIndustry}
                                                currentTemplateForEditor={currentTemplateForEditor}
                                                industryOptions={industryOptions}
                                                onSpacingChange={handleSpacingChange}
                                                onFontSizeChange={handleFontSizeChange}
                                                onStylePackChange={handleStylePackChange}
                                                onPresetChange={handlePresetChange}
                                                onIndustryChange={handleIndustryChange}
                                            />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <Suspense fallback={<div className="flex justify-center items-center min-h-[calc(100vh-100px)] bg-muted/20 rounded-xl border border-border"><LoadingSpinner label="Loading preview..." /></div>}>
                                <ResumePreview 
                                    ref={resumePreviewRef}
                                    currentFormData={editorFormData || {}}
                                    spacingMultiplier={spacingMultiplier}
                                    fontSizeMultiplier={fontSizeMultiplier}
                                    htmlShell={currentTemplateForEditor?.templateComponents?.htmlShell}
                                    baseCss={currentTemplateForEditor?.templateComponents?.baseCss}
                                    sections={currentTemplateForEditor?.templateComponents?.sections}
                                    stylePacks={currentTemplateForEditor?.templateComponents?.stylePacks}
                                    selectedStylePackKey={selectedStylePackKey}
                                    sectionOrder={sectionOrder}
                                    zoomLevel={zoomLevel}
                                    setZoomLevel={setZoomLevel}
                                    editedSections={editedSections}
                                    templateFieldDefinition={currentTemplateForEditor?.templateFieldDefinition || []}
                                />
                            </Suspense>
                        </motion.div>
                    </div>
                </main>
            </div>

            {/* Dialogs */}
            <FeedbackDialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog} title={feedbackDetailsForDialog.title} message={feedbackDetailsForDialog.message} type={feedbackDetailsForDialog.type}/>
            <EnhancementDialog suggestions={enhancementSuggestions} originalText={activeEnhancementInfo.originalText} onAccept={handleAcceptSuggestion} onOpenChange={() => setEnhancementSuggestions(null)}/>
            <AuthDialog 
                open={showAuthDialog} 
                onOpenChange={setShowAuthDialog} 
                onSuccess={handleAuthSuccess}
                onSaveFormData={() => {
                    // Save current form data to localStorage before OAuth redirect
                    try {
                        const formDataToSave = {
                            editorFormData,
                            editableResumeName,
                            spacingMultiplier,
                            fontSizeMultiplier,
                            sectionOrder,
                            selectedStylePackKey,
                            selectedIndustry,
                            timestamp: Date.now()
                        };
                        console.log('Saving form data to localStorage:', formDataToSave);
                        localStorage.setItem('resume_editor_form_data', JSON.stringify(formDataToSave));
                        console.log('Form data saved successfully');
                    } catch (error) {
                        console.warn('Could not save form data to localStorage:', error);
                    }
                }}
            />
            <PlaceholderWarningDialog open={showPlaceholderWarning} onOpenChange={setShowPlaceholderWarning} onConfirm={handleConfirmAction} onCancel={() => setPendingAction(null)}/>
            <AddSectionDialog open={isAddSectionDialogOpen} onOpenChange={setIsAddSectionDialogOpen} sectionProperties={sectionProperties} editorFormData={editorFormData} onSectionAdd={handleAddChosenSection}/>
            <TooltipDialog open={isTooltipDialogOpen} onOpenChange={setIsTooltipDialogOpen} title={tooltipContent.title} message={tooltipContent.message} />

            {/* Mobile Nav & Dialog */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-sm border-t border-border shadow-lg z-50 flex items-center justify-around px-4">
                {/* Form Button */}
                <Button
                    variant={activeMobileView === 'edit' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveMobileView('edit');
                        // Ensure customize dialog is closed when switching to form
                        setIsCustomizeDialogOpen(false);
                    }}
                    className="flex flex-col items-center gap-1 h-12 px-3 min-w-0 flex-1"
                >
                    <Edit2 className="h-4 w-4" />
                    <span className="text-xs font-medium">Form</span>
                </Button>

                {/* Preview Button */}
                <Button
                    variant={activeMobileView === 'preview' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveMobileView('preview');
                        // Ensure customize dialog is closed when switching to preview
                        setIsCustomizeDialogOpen(false);
                    }}
                    className="flex flex-col items-center gap-1 h-12 px-3 min-w-0 flex-1"
                >
                    <Eye className="h-4 w-4" />
                    <span className="text-xs font-medium">Preview</span>
                </Button>

                {/* Customize Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsCustomizeDialogOpen(true);
                    }}
                    className="flex flex-col items-center gap-1 h-12 px-3 min-w-0 flex-1"
                >
                    <Settings2 className="h-4 w-4" />
                    <span className="text-xs font-medium">Customize</span>
                </Button>
            </div>
            <Dialog open={isCustomizeDialogOpen} onOpenChange={setIsCustomizeDialogOpen}>
                <DialogContent className="sm:max-w-md bg-card">
                    <DialogHeader>
                        <DialogTitle className="flex items-center text-lg font-semibold">
                            <Settings2 className="h-5 w-5 mr-2 text-primary" /> Customize Resume
                        </DialogTitle>
                        <DialogDescription>Tailor your resume's style, layout, and industry focus.</DialogDescription>
                    </DialogHeader>
                    <CustomizePanel
                        spacingMultiplier={spacingMultiplier}
                        fontSizeMultiplier={fontSizeMultiplier}
                        selectedStylePackKey={selectedStylePackKey}
                        selectedPresetKey={selectedPresetKey}
                        selectedIndustry={selectedIndustry}
                        currentTemplateForEditor={currentTemplateForEditor}
                        industryOptions={industryOptions}
                        onSpacingChange={handleSpacingChange}
                        onFontSizeChange={handleFontSizeChange}
                        onStylePackChange={handleStylePackChange}
                        onPresetChange={handlePresetChange}
                        onIndustryChange={handleIndustryChange}
                    />
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Done</Button></DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ResumeEditorPage;