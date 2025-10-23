

import React, { useEffect, useCallback, Suspense, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from 'framer-motion';
import { get, set, cloneDeep, isEqual } from 'lodash';

// UI Components & Icons
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Eye, Settings2, RefreshCw, AlertCircle, Edit2, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';

// Custom Components
import EditorHeader from '@/components/ResumeEditor/EditorHeader'; 
import CustomizePanel from "@/components/ResumeEditor/CustomizationPanel";
import AuthDialog from '@/components/Auth/AuthDialog.jsx';
import { TooltipDialog } from "@/components/ResumeEditor/TooltipDialog";
import { FeedbackDialog, PlaceholderWarningDialog, AddSectionDialog } from '@/components/ResumeEditor/EditorDialogs';
import ResumeSetupDialog from '@/components/ResumeEditor/ResumeSetupDialog';
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
import { initializeFormDataFromDefinitions, initializeSectionsConfigFromData, calculateProgressData } from '@/utils/EditorUtils';
import { cn } from "@/lib/utils";
import { enhanceEntireResume as apiEnhanceEntireResume } from '@/api/resumeServiceApi';
    
const ResumeEditorPage = () => {
    const editorState = useResumeEditorState();
    
    // Destructure from the state object
    const {
        newResumeTemplateId, existingResumeId, navigate, location,
        resumePreviewRef, nameInputRef,
        auth: { isAuthenticated, isLoading: isAuthLoading },
        templates: { templates: allTemplates, getAllTemplates, isLoadingTemplates },
        resume: {
            currentResumeDetail, editorFormData, setEditorFormData, isSavingResume,
            resumeError, loadResumeForEditor, prepareNewResumeForEditor,
            saveOrUpdateCurrentResume, clearCurrentEditorData, isLoadingCurrentResume,
            resumeSetupData, saveResumeSetupData, setCurrentResumeDetail
        },
        // All State & Setters
        mode, setMode, pageIsLoading, setPageIsLoading,
        pageError, setPageError, currentTemplateForEditor, setCurrentTemplateForEditor,
        editableResumeName, setEditableResumeName, isEditingName, setIsEditingName,
        previewUpdateKey, setPreviewUpdateKey,
        isDownloadingPdf, setIsDownloadingPdf, showFeedbackDialog, setShowFeedbackDialog,
        feedbackDetailsForDialog, setFeedbackDetailsForDialog, showAuthDialog, setShowAuthDialog,
 isDirty, setIsDirty,
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
        showResumeSetupDialog, setShowResumeSetupDialog,
    } = editorState;

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
        handleSaveResume, handleDownloadPdf, handlePreviewPage, executeSaveResume, executeDownloadPdf,
    } = useResumeEditorActions({
        isAuthenticated, editorFormData, editableResumeName, spacingMultiplier,
        fontSizeMultiplier,
        sectionOrder, selectedStylePackKey, selectedIndustry, mode,
        newResumeTemplateId, existingResumeId,
        currentTemplateForEditor, resumePreviewRef, setPendingAction,
        setShowPlaceholderWarning, setShowAuthDialog, setSaveStatus,
        setFeedbackDetailsForDialog, setIsDirty, setIsDownloadingPdf,
        setPageError, setShowFeedbackDialog,
        saveOrUpdateCurrentResume, handleSimpleChange, handleArrayItemChange,
    });  

    usePageSetupEffect({
      existingResumeId, newResumeTemplateId, location, isAuthLoading,
      loadResumeForEditor, currentResumeDetail, editorFormData, allTemplates,
      getAllTemplates, prepareNewResumeForEditor, setCurrentResumeDetail, 
      setPageIsLoading, setPageError, setMode, setCurrentTemplateForEditor, 
      setEditorFormData, setEditableResumeName, setSpacingMultiplier, 
      setFontSizeMultiplier, setSelectedIndustry, setSelectedStylePackKey,
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
        else if (pendingAction === 'enhance') { executeEnhance(); }
        setPendingAction(null);
    };

    const handleResumeSetupComplete = async (setupData) => {
        console.log('📋 Resume setup completed:', setupData);
        saveResumeSetupData(setupData);
        
        // If imported resume data is present, prefill the editor
        if (setupData.importedResumeData) {
            console.log('📥 Imported resume data detected:', setupData.importedResumeData);
            
            if (setupData.importedResumeData.content) {
                console.log('✅ Prefilling editor with imported resume data');
                console.log('📊 Data structure:', setupData.importedResumeData);
                
                // CRITICAL FIX: Ensure sectionsConfig is included
                // The imported data may only have 'content', but we need 'sectionsConfig' too
                let completeFormData = { ...setupData.importedResumeData };
                
                if (!completeFormData.sectionsConfig) {
                    console.log('🔧 sectionsConfig missing, initializing based on parsed data...');
                    // Initialize sectionsConfig based on which sections have actual data
                    const sectionsConfig = initializeSectionsConfigFromData(
                        currentTemplateForEditor.templateFieldDefinition,
                        setupData.importedResumeData.content
                    );
                    
                    // Use the imported content with data-based sectionsConfig
                    completeFormData = {
                        content: setupData.importedResumeData.content,
                        sectionsConfig: sectionsConfig
                    };
                    console.log('✅ sectionsConfig initialized based on data:', completeFormData.sectionsConfig);
                    console.log('📊 Sections with data enabled, sections without data disabled');
                } else {
                    console.log('✅ sectionsConfig already present');
                }
                
                setEditorFormData(completeFormData);
                setIsDirty(true);
                
                // Calculate and set edited sections from imported data
                if (currentTemplateForEditor?.templateFieldDefinition) {
                    const { getInitiallyEditedSections } = await import('@/utils/EditorUtils');
                    const calculatedEditedSections = getInitiallyEditedSections(
                        completeFormData.content,
                        currentTemplateForEditor.templateFieldDefinition
                    );
                    setEditedSections(calculatedEditedSections);
                    console.log('📝 Edited sections calculated:', calculatedEditedSections);
                }
                
                // Force preview update to reflect imported data
                setPreviewUpdateKey(prev => prev + 1);
                
                // Show success notification
                setTimeout(() => {
                    console.log('✨ Editor form data updated with complete structure:', completeFormData);
                }, 100);
            } else {
                console.warn('⚠️ Imported data exists but no content property found:', setupData.importedResumeData);
            }
        } else {
            console.log('ℹ️ No imported data, starting fresh');
        }
        
        setShowResumeSetupDialog(false);
    };
    
    // --- ENHANCE ENTIRE RESUME ---
    const [isEnhanceDialogOpen, setIsEnhanceDialogOpen] = useState(false);
    const [enhanceUserNotes, setEnhanceUserNotes] = useState('');
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [isEnhanceReviewOpen, setIsEnhanceReviewOpen] = useState(false);
    const [enhancedResumeData, setEnhancedResumeData] = useState(null);
    const [enhanceDiffs, setEnhanceDiffs] = useState([]);
    const [enhanceDecisions, setEnhanceDecisions] = useState({}); // path => 'accepted' | 'rejected'
    const [currentReviewSection, setCurrentReviewSection] = useState(0);
    const [currentlyVisibleSections, setCurrentlyVisibleSections] = useState([]);

    const executeEnhance = useCallback(() => {
        console.log('[Enhance] Opening enhance dialog');
        setIsEnhanceDialogOpen(true);
    }, []);

    const openEnhanceDialog = useCallback(() => {
        // Check authentication before opening enhance dialog
        if (!isAuthenticated) {
            console.log('[Enhance] User not authenticated, showing auth dialog');
            setPendingAction('enhance');
            setShowAuthDialog(true);
            return;
        }
        
        // User is authenticated, proceed with opening enhance dialog
        console.log('[Enhance] User authenticated, opening enhance dialog');
        executeEnhance();
    }, [isAuthenticated, setPendingAction, setShowAuthDialog, executeEnhance]);

    const handleEnhanceEntireResume = useCallback(async () => {
        try {
            setIsEnhancing(true);
            console.log('[Enhance] Handler invoked');
            console.log('[Enhance] editorFormData at invoke:', editorFormData);
            console.log('[Enhance] resumeSetupData at invoke:', resumeSetupData);
            // Helper: determine if a value counts as user-entered
            const isMeaningful = (val) => {
                if (val === null || val === undefined) return false;
                if (typeof val === 'string') {
                    const trimmed = val.trim();
                    if (!trimmed) return false;
                    // Exclude placeholder-like values such as [Company], [Role], etc.
                    if (/^\[.*\]$/.test(trimmed)) return false;
                    return true;
                }
                if (Array.isArray(val)) return val.length > 0;
                if (typeof val === 'number') return true;
                if (typeof val === 'boolean') return true;
                if (typeof val === 'object') return Object.keys(val).length > 0;
                return false;
            };

            // Recursively prune empty/placeholder entries, keeping only user-entered data
            const pruneContent = (node) => {
                if (Array.isArray(node)) {
                    const prunedArray = node
                        .map((item) => pruneContent(item))
                        .filter((item) => isMeaningful(item));
                    return prunedArray;
                }
                if (node && typeof node === 'object') {
                    const result = {};
                    Object.entries(node).forEach(([key, value]) => {
                        const prunedValue = pruneContent(value);
                        if (isMeaningful(prunedValue)) {
                            result[key] = prunedValue;
                        }
                    });
                    return result;
                }
                return node;
            };

            // Enhanced buildDiffs function to handle nested objects and arrays properly
            const buildDiffs = (originalNode, enhancedNode, basePath = '') => {
                const diffs = [];
                
                // Handle arrays
                if (Array.isArray(originalNode) && Array.isArray(enhancedNode)) {
                    const maxLength = Math.max(originalNode.length, enhancedNode.length);
                    for (let i = 0; i < maxLength; i++) {
                        const originalItem = originalNode[i];
                        const enhancedItem = enhancedNode[i];
                        const itemPath = basePath ? `${basePath}.${i}` : `${i}`;
                        
                        if (originalItem && enhancedItem && typeof originalItem === 'object' && typeof enhancedItem === 'object') {
                            // Recursively check nested objects in arrays
                            diffs.push(...buildDiffs(originalItem, enhancedItem, itemPath));
                        } else if (originalItem !== enhancedItem) {
                            // Only add if both values are meaningful strings
                            const beforeStr = typeof originalItem === 'string' ? originalItem : '';
                            const afterStr = typeof enhancedItem === 'string' ? enhancedItem : '';
                            if (beforeStr || afterStr) {
                                diffs.push({ path: itemPath, before: beforeStr, after: afterStr });
                            }
                        }
                    }
                }
                // Handle objects
                else if (originalNode && enhancedNode && typeof originalNode === 'object' && typeof enhancedNode === 'object') {
                    const allKeys = new Set([...Object.keys(originalNode), ...Object.keys(enhancedNode)]);
                    allKeys.forEach((key) => {
                        const keyPath = basePath ? `${basePath}.${key}` : key;
                        const originalValue = originalNode[key];
                        const enhancedValue = enhancedNode[key];
                        
                        if (originalValue && enhancedValue && typeof originalValue === 'object' && typeof enhancedValue === 'object') {
                            // Recursively check nested objects
                            diffs.push(...buildDiffs(originalValue, enhancedValue, keyPath));
                        } else if (originalValue !== enhancedValue) {
                            // Only add if both values are meaningful strings
                            const beforeStr = typeof originalValue === 'string' ? originalValue : '';
                            const afterStr = typeof enhancedValue === 'string' ? enhancedValue : '';
                            if (beforeStr || afterStr) {
                                diffs.push({ path: keyPath, before: beforeStr, after: afterStr });
                            }
                        }
                    });
                }
                // Handle primitive values
                else if (originalNode !== enhancedNode) {
                    const beforeStr = typeof originalNode === 'string' ? originalNode : '';
                    const afterStr = typeof enhancedNode === 'string' ? enhancedNode : '';
                    if (beforeStr || afterStr) {
                        diffs.push({ path: basePath, before: beforeStr, after: afterStr });
                    }
                }
                
                return diffs;
            };

            const rawContent = editorFormData?.content || {};
            const cleanedContent = pruneContent(rawContent);

            const payload = {
                resumeData: cleanedContent,
                globalContext: resumeSetupData || {},
                userNotes: (enhanceUserNotes || '').trim()
            };

            console.log('[Enhance] Generated payload:', payload);
            const enhanced = await apiEnhanceEntireResume(payload);
            console.log('[Enhance] Enhanced resume data:', enhanced);
            setEnhancedResumeData(enhanced);
            // Build diffs list: only string changes
            const originalContent = editorFormData?.content || {};
            const diffs = buildDiffs(originalContent, enhanced || {});
            console.log('[Enhance] Original content:', originalContent);
            console.log('[Enhance] Enhanced content:', enhanced);
            console.log('[Enhance] Generated diffs:', diffs);
            setEnhanceDiffs(diffs);
            setCurrentReviewSection(0);
            setIsEnhanceDialogOpen(false);
            setIsEnhanceReviewOpen(true);
            // Next steps (API call / dialog) will be implemented as per instruction
        } catch (error) {
            console.error('[Enhance] Failed to generate payload:', error);
        } finally {
            setIsEnhancing(false);
        }
    }, [editorFormData, resumeSetupData, enhanceUserNotes]);
    
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
        setEditedSections,
        setPageIsLoading,
        setPageError,
        setPreviewUpdateKey,
        isAuthenticated,
        pageIsLoading,
        currentTemplateForEditor
    });

    useEffect(() => { return () => { if (!window.location.pathname.startsWith('/resume/')) clearCurrentEditorData(); }; }, [location.pathname, clearCurrentEditorData]);
    useEffect(() => { if (resumeError && saveStatus === 'saving') { setFeedbackDetailsForDialog({ title: 'Operation Failed', message: resumeError.message || 'An unexpected error occurred.', type: 'error' }); setShowFeedbackDialog(true); } }, [resumeError, saveStatus]);
    
    // Show setup dialog for new resumes (skip for ATS optimization mode)
    useEffect(() => {
        // Check if coming from ATS optimization mode
        const locationState = location.state || {};
        const isATSMode = locationState.mode === 'ats-optimize' && locationState.skipSetupDialog;
        
        if (mode === 'create' && currentTemplateForEditor && !resumeSetupData && !pageIsLoading && !isATSMode) {
            setShowResumeSetupDialog(true);
        }
    }, [mode, currentTemplateForEditor, resumeSetupData, pageIsLoading, location.state]);
    
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
                    onEnhance={openEnhanceDialog}
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
                                onOpenAddSectionDialog={() => setIsAddSectionDialogOpen(true)}
                                sectionProperties={sectionProperties}
                                onShowTooltip={handleShowTooltip}
                                onSectionAdd={(sectionKey) => {
                                    // Optional: Add any additional logic when a section is added
                                    console.log(`New section added: ${sectionKey}`);
                                }}
                                resumeSetupData={resumeSetupData}
                                onGetEnabledSections={(sections) => setCurrentlyVisibleSections(sections)}
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
                                    key={previewUpdateKey}
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
                            editedSections: Array.from(editedSections), // Convert Set to Array for JSON serialization
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
            <AddSectionDialog open={isAddSectionDialogOpen} onOpenChange={setIsAddSectionDialogOpen} sectionProperties={sectionProperties} editorFormData={editorFormData} onSectionAdd={handleAddChosenSection} currentlyVisibleSections={currentlyVisibleSections} />
            <TooltipDialog open={isTooltipDialogOpen} onOpenChange={setIsTooltipDialogOpen} title={tooltipContent.title} message={tooltipContent.message} />
            <ResumeSetupDialog 
                open={showResumeSetupDialog} 
                onOpenChange={setShowResumeSetupDialog} 
                onComplete={handleResumeSetupComplete}
                templateFieldDefinition={currentTemplateForEditor?.templateFieldDefinition || []}
            />

            {/* Enhance Review Dialog */}
            <Dialog open={isEnhanceReviewOpen} onOpenChange={setIsEnhanceReviewOpen}>
                <DialogContent className="sm:max-w-3xl bg-card max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Review AI Enhancements</DialogTitle>
                        <DialogDescription>Compare suggested changes and accept or reject per field. Accepted changes update your form.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {enhanceDiffs.length === 0 && (
                            <p className="text-sm text-muted-foreground">No changes suggested.</p>
                        )}
                        {enhanceDiffs.length > 0 && (
                            (() => {
                                // Group by top-level section (before first dot) and filter out empty sections
                                const sections = Object.entries(
                                    enhanceDiffs.reduce((acc, diff) => {
                                        const section = diff.path.split('.')[0];
                                        if (!acc[section]) acc[section] = [];
                                        acc[section].push(diff);
                                        return acc;
                                    }, {})
                                ).filter(([sectionName, diffs]) => diffs.length > 0); // Only sections with actual changes
                                
                                if (sections.length === 0) return <p className="text-sm text-muted-foreground">No changes suggested.</p>;
                                
                                const currentSection = sections[currentReviewSection];
                                if (!currentSection) return <p className="text-sm text-muted-foreground">No more sections to review.</p>;
                                
                                const [sectionName, diffs] = currentSection;
                                
                                console.log('[Review] All sections:', sections.map(([name, diffs]) => ({ name, count: diffs.length })));
                                console.log('[Review] Current section:', sectionName, 'diffs:', diffs.length);
                                
                                return (
                                    <>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-sm text-muted-foreground">
                                                Section {currentReviewSection + 1} of {sections.length}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setCurrentReviewSection(Math.max(0, currentReviewSection - 1))}
                                                    disabled={currentReviewSection === 0}
                                                >
                                                    Previous
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setCurrentReviewSection(Math.min(sections.length - 1, currentReviewSection + 1))}
                                                    disabled={currentReviewSection === sections.length - 1}
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        <Card className="border border-border">
                                            <CardHeader>
                                                <CardTitle className="text-base">{sectionName} <span className="text-xs font-normal text-muted-foreground">({diffs.length} change{diffs.length !== 1 ? 's' : ''})</span></CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {diffs.map(({ path, before, after }) => {
                                                    const decision = enhanceDecisions[path];
                                                    const isAccepted = decision === 'accepted';
                                                    const isRejected = decision === 'rejected';
                                                    return (
                                                    <div key={path} className="p-3 rounded-md border bg-muted/30">
                                                        <div className="text-xs text-muted-foreground mb-1">{path}</div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div>
                                                                <Label className="text-xs">Before</Label>
                                                                <div className="mt-1 text-sm whitespace-pre-wrap bg-background border rounded p-2 min-h-[44px]">
                                                                    {typeof before === 'string' ? before : (before ? JSON.stringify(before, null, 2) : '\u2014')}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs">After</Label>
                                                                <div className="mt-1 text-sm whitespace-pre-wrap bg-background border rounded p-2 min-h-[44px]">
                                                                    {typeof after === 'string' ? after : (after ? JSON.stringify(after, null, 2) : '\u2014')}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 flex items-center gap-2">
                                                            {!isAccepted && !isRejected && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            try {
                                                                                handleSimpleChange(path, after || '');
                                                                                setEnhanceDecisions(prev => ({ ...prev, [path]: 'accepted' }));
                                                                            } catch (e) { console.warn('Apply change failed', e); }
                                                                        }}
                                                                    >Accept</Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => setEnhanceDecisions(prev => ({ ...prev, [path]: 'rejected' }))}
                                                                    >Reject</Button>
                                                                </>
                                                            )}
                                                            {isAccepted && (
                                                                <Button size="sm" disabled className="bg-green-600 text-white hover:bg-green-600 cursor-default">Accepted</Button>
                                                            )}
                                                            {isRejected && (
                                                                <Button size="sm" disabled variant="destructive" className="cursor-default">Rejected</Button>
                                                            )}
                                                            {(isAccepted || isRejected) && (
                                                                <Button size="sm" variant="ghost" className="text-xs" onClick={() => setEnhanceDecisions(prev => { const copy = { ...prev }; delete copy[path]; return copy; })}>Undo</Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    );
                                                })}
                                            </CardContent>
                                        </Card>
                                    </>
                                );
                            })()
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setIsEnhanceReviewOpen(false)}>Done</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Enhance Entire Resume - Notes Dialog */}
            <Dialog open={isEnhanceDialogOpen} onOpenChange={(open) => { if (!isEnhancing) setIsEnhanceDialogOpen(open); }}>
                <DialogContent className="sm:max-w-md bg-card">
                    <DialogHeader>
                        <DialogTitle className="flex items-center text-lg font-semibold">
                            <Sparkles className="h-5 w-5 mr-2 text-primary" /> Enhance Entire Resume
                        </DialogTitle>
                        <DialogDescription>Provide optional notes to guide enhancements. These will be sent along with your resume data and setup context.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="enhance-notes" className="text-sm font-medium">Additional Notes (Optional)</Label>
                            <Textarea
                                id="enhance-notes"
                                placeholder="Add any specific preferences or guidance for improving your resume..."
                                value={enhanceUserNotes}
                                onChange={(e) => setEnhanceUserNotes(e.target.value)}
                                rows={5}
                                className="mt-1"
                                disabled={isEnhancing}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isEnhancing}>Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleEnhanceEntireResume} disabled={isEnhancing}>
                            {isEnhancing ? (
                                <>
                                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : (
                                'Generate'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
            
            {/* Customize Dialog */}
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