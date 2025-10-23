

import React, { useEffect, useCallback, Suspense, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from 'framer-motion';
import { get, set, cloneDeep, isEqual } from 'lodash';

// UI Components & Icons
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Eye, Settings2, RefreshCw, AlertCircle, Edit2, Sparkles, Lightbulb, Target, Briefcase, GraduationCap, Award, ChevronRight, TrendingUp, Check, X, Zap } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
                <DialogContent className="sm:max-w-5xl bg-gradient-to-br from-card to-card/80 max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader className="pb-4 border-b border-border/50">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent-purple/20 border border-primary/30">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold">Review AI Enhancements</DialogTitle>
                                    <DialogDescription className="text-sm mt-1">
                                        Compare the improvements and choose what to apply
                                    </DialogDescription>
                                </div>
                            </div>
                            {enhanceDiffs.length > 0 && (() => {
                                const sections = Object.entries(
                                    enhanceDiffs.reduce((acc, diff) => {
                                        const section = diff.path.split('.')[0];
                                        if (!acc[section]) acc[section] = [];
                                        acc[section].push(diff);
                                        return acc;
                                    }, {})
                                ).filter(([sectionName, diffs]) => diffs.length > 0);
                                
                                const totalChanges = enhanceDiffs.length;
                                const acceptedCount = Object.values(enhanceDecisions).filter(d => d === 'accepted').length;
                                const progressPercent = totalChanges > 0 ? (acceptedCount / totalChanges) * 100 : 0;
                                
                                return (
                                    <div className="hidden sm:flex flex-col items-end gap-2">
                                        <Badge variant="outline" className="gap-1.5 px-3 py-1">
                                            <TrendingUp className="h-3.5 w-3.5" />
                                            {acceptedCount} of {totalChanges} accepted
                                        </Badge>
                                        <Progress value={progressPercent} className="w-32 h-2" />
                                    </div>
                                );
                            })()}
                        </div>
                    </DialogHeader>
                    
                    <div className="flex-1 overflow-y-auto py-4 px-1">
                        {enhanceDiffs.length === 0 && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-12 text-center"
                            >
                                <div className="p-4 rounded-full bg-muted/50 mb-4">
                                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <p className="text-lg font-medium text-muted-foreground">No changes suggested</p>
                                <p className="text-sm text-muted-foreground/70 mt-1">Your resume looks great already!</p>
                            </motion.div>
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
                                
                                if (sections.length === 0) return null;
                                
                                const currentSection = sections[currentReviewSection];
                                if (!currentSection) return null;
                                
                                const [sectionName, diffs] = currentSection;
                                
                                console.log('[Review] All sections:', sections.map(([name, diffs]) => ({ name, count: diffs.length })));
                                console.log('[Review] Current section:', sectionName, 'diffs:', diffs.length);
                                
                                return (
                                    <motion.div
                                        key={currentReviewSection}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4"
                                    >
                                        {/* Section Header */}
                                        <div className="flex items-center justify-between px-2">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-bold capitalize flex items-center gap-2">
                                                    {sectionName}
                                                    <Badge variant="secondary" className="text-xs">
                                                        {diffs.length} change{diffs.length !== 1 ? 's' : ''}
                                                    </Badge>
                                                </h3>
                                                <p className="text-xs text-muted-foreground">
                                                    Section {currentReviewSection + 1} of {sections.length}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Changes List */}
                                        <div className="space-y-3">
                                            {diffs.map(({ path, before, after }, idx) => {
                                                const decision = enhanceDecisions[path];
                                                const isAccepted = decision === 'accepted';
                                                const isRejected = decision === 'rejected';
                                                return (
                                                    <motion.div
                                                        key={path}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        className={cn(
                                                            "relative p-4 rounded-xl border-2 transition-all",
                                                            isAccepted && "border-success/50 bg-success/5",
                                                            isRejected && "border-destructive/50 bg-destructive/5",
                                                            !isAccepted && !isRejected && "border-border bg-card/50 hover:border-primary/30"
                                                        )}
                                                    >
                                                        {/* Status Badge */}
                                                        {(isAccepted || isRejected) && (
                                                            <div className="absolute -top-2 -right-2">
                                                                <Badge 
                                                                    className={cn(
                                                                        "gap-1 shadow-lg",
                                                                        isAccepted && "bg-success text-white border-success",
                                                                        isRejected && "bg-destructive text-white border-destructive"
                                                                    )}
                                                                >
                                                                    {isAccepted ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                                                    {isAccepted ? 'Applied' : 'Rejected'}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Path Label */}
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                            <p className="text-xs font-medium text-muted-foreground">{path}</p>
                                                        </div>
                                                        
                                                        {/* Before/After Comparison */}
                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                                            {/* Before */}
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="px-2 py-0.5 rounded bg-destructive/10 border border-destructive/30">
                                                                        <span className="text-xs font-semibold text-destructive">Before</span>
                                                                    </div>
                                                                </div>
                                                                <div className="relative p-3 rounded-lg bg-background border border-border min-h-[60px] text-sm leading-relaxed">
                                                                    {typeof before === 'string' && before ? (
                                                                        <p className="whitespace-pre-wrap text-muted-foreground">{before}</p>
                                                                    ) : (
                                                                        <span className="text-muted-foreground/50 italic">Empty</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            {/* After */}
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="px-2 py-0.5 rounded bg-success/10 border border-success/30">
                                                                        <span className="text-xs font-semibold text-success">After (AI Enhanced)</span>
                                                                    </div>
                                                                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                                                                </div>
                                                                <div className="relative p-3 rounded-lg bg-primary/5 border-2 border-primary/20 min-h-[60px] text-sm leading-relaxed">
                                                                    {typeof after === 'string' && after ? (
                                                                        <p className="whitespace-pre-wrap font-medium">{after}</p>
                                                                    ) : (
                                                                        <span className="text-muted-foreground/50 italic">Empty</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Action Buttons */}
                                                        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
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
                                                                        className="flex-1 gap-2 bg-success hover:bg-success/90 text-white"
                                                                    >
                                                                        <Check className="h-3.5 w-3.5" />
                                                                        Accept Change
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => setEnhanceDecisions(prev => ({ ...prev, [path]: 'rejected' }))}
                                                                        className="flex-1 gap-2 border-2"
                                                                    >
                                                                        <X className="h-3.5 w-3.5" />
                                                                        Reject
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {(isAccepted || isRejected) && (
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="ghost" 
                                                                    onClick={() => setEnhanceDecisions(prev => { const copy = { ...prev }; delete copy[path]; return copy; })}
                                                                    className="w-full gap-2"
                                                                >
                                                                    <RefreshCw className="h-3.5 w-3.5" />
                                                                    Undo Decision
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                );
                            })()
                        )}
                    </div>
                    
                    {/* Footer with Navigation */}
                    <div className="border-t border-border/50 pt-4 pb-2 space-y-3">
                        {enhanceDiffs.length > 0 && (() => {
                            const sections = Object.entries(
                                enhanceDiffs.reduce((acc, diff) => {
                                    const section = diff.path.split('.')[0];
                                    if (!acc[section]) acc[section] = [];
                                    acc[section].push(diff);
                                    return acc;
                                }, {})
                            ).filter(([sectionName, diffs]) => diffs.length > 0);
                            
                            if (sections.length === 0) return null;
                            
                            return (
                                <>
                                    {/* Progress on Mobile */}
                                    <div className="sm:hidden flex items-center justify-between px-2">
                                        <span className="text-xs text-muted-foreground">
                                            {Object.values(enhanceDecisions).filter(d => d === 'accepted').length} of {enhanceDiffs.length} accepted
                                        </span>
                                        <Progress 
                                            value={(Object.values(enhanceDecisions).filter(d => d === 'accepted').length / enhanceDiffs.length) * 100} 
                                            className="w-24 h-2" 
                                        />
                                    </div>
                                    
                                    {/* Navigation Buttons */}
                                    <div className="flex items-center justify-between gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => setCurrentReviewSection(Math.max(0, currentReviewSection - 1))}
                                            disabled={currentReviewSection === 0}
                                            className="flex-1 sm:flex-none gap-2 border-2"
                                        >
                                            <ChevronRight className="h-4 w-4 rotate-180" />
                                            <span className="hidden sm:inline">Previous</span>
                                        </Button>
                                        
                                        <div className="flex items-center gap-1.5">
                                            {sections.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentReviewSection(idx)}
                                                    className={cn(
                                                        "h-2 rounded-full transition-all",
                                                        currentReviewSection === idx ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                                    )}
                                                    aria-label={`Go to section ${idx + 1}`}
                                                />
                                            ))}
                                        </div>
                                        
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                if (currentReviewSection === sections.length - 1) {
                                                    setIsEnhanceReviewOpen(false);
                                                } else {
                                                    setCurrentReviewSection(Math.min(sections.length - 1, currentReviewSection + 1));
                                                }
                                            }}
                                            className={cn(
                                                "flex-1 sm:flex-none gap-2 border-2",
                                                currentReviewSection === sections.length - 1 && "bg-primary text-primary-foreground hover:bg-primary/90"
                                            )}
                                        >
                                            <span className="hidden sm:inline">
                                                {currentReviewSection === sections.length - 1 ? 'Finish' : 'Next'}
                                            </span>
                                            <span className="sm:hidden">
                                                {currentReviewSection === sections.length - 1 ? 'Done' : 'Next'}
                                            </span>
                                            {currentReviewSection === sections.length - 1 ? (
                                                <Check className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </>
                            );
                        })()}
                        
                        {enhanceDiffs.length === 0 && (
                            <Button 
                                type="button" 
                                onClick={() => setIsEnhanceReviewOpen(false)}
                                className="w-full"
                            >
                                Close
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Enhance Entire Resume - Notes Dialog */}
            <Dialog open={isEnhanceDialogOpen} onOpenChange={(open) => { if (!isEnhancing) setIsEnhanceDialogOpen(open); }}>
                <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-card to-card/80 border-primary/20 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Sparkles className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent">
                                    Enhance Your Resume
                                </DialogTitle>
                                <DialogDescription className="text-sm mt-1">
                                    Let AI transform your resume into a professional masterpiece
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-5 py-2"
                    >
                        {/* Example Prompts */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-3">
                                <Lightbulb className="h-4 w-4 text-yellow-500" />
                                <Label className="text-sm font-semibold">Quick Examples (Click to Use)</Label>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {[
                                    { icon: Target, text: "Make it more achievement-focused", color: "border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/5" },
                                    { icon: Briefcase, text: "Optimize for leadership roles", color: "border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/5" },
                                    { icon: GraduationCap, text: "Emphasize technical skills", color: "border-green-500/30 hover:border-green-500 hover:bg-green-500/5" },
                                    { icon: Award, text: "Highlight quantifiable results", color: "border-orange-500/30 hover:border-orange-500 hover:bg-orange-500/5" },
                                    { icon: TrendingUp, text: "Add more action verbs", color: "border-pink-500/30 hover:border-pink-500 hover:bg-pink-500/5" },
                                    { icon: Zap, text: "Make it more concise", color: "border-cyan-500/30 hover:border-cyan-500 hover:bg-cyan-500/5" },
                                ].map((example, idx) => (
                                    <motion.button
                                        key={idx}
                                        type="button"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setEnhanceUserNotes(example.text)}
                                        disabled={isEnhancing}
                                        className={cn(
                                            "flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left",
                                            "bg-card/50 backdrop-blur-sm",
                                            example.color,
                                            isEnhancing && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        <example.icon className="h-4 w-4 flex-shrink-0 opacity-70" />
                                        <span className="text-xs font-medium">{example.text}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Input */}
                        <div className="space-y-2">
                            <Label htmlFor="enhance-notes" className="text-sm font-semibold flex items-center gap-2">
                                <Edit2 className="h-3.5 w-3.5" />
                                Or Write Your Own Instructions
                            </Label>
                            <Textarea
                                id="enhance-notes"
                                placeholder="e.g., Focus on project management experience and leadership skills..."
                                value={enhanceUserNotes}
                                onChange={(e) => setEnhanceUserNotes(e.target.value)}
                                rows={4}
                                className="resize-none border-2 focus:border-primary transition-colors"
                                disabled={isEnhancing}
                            />
                            {enhanceUserNotes && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="flex items-center gap-2 text-xs text-muted-foreground"
                                >
                                    <Check className="h-3 w-3 text-success" />
                                    <span>{enhanceUserNotes.length} characters</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEnhanceUserNotes('')}
                                        disabled={isEnhancing}
                                        className="h-6 px-2 ml-auto"
                                    >
                                        Clear
                                    </Button>
                                </motion.div>
                            )}
                        </div>

                        {/* Info Card */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="p-4 rounded-lg bg-primary/5 border border-primary/20"
                        >
                            <div className="flex gap-3">
                                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                <div className="space-y-1 text-xs text-muted-foreground">
                                    <p className="font-medium text-foreground">AI will analyze your resume and:</p>
                                    <ul className="space-y-1 ml-1">
                                        <li className="flex items-center gap-2">
                                            <div className="h-1 w-1 rounded-full bg-primary" />
                                            Improve clarity and impact of your descriptions
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="h-1 w-1 rounded-full bg-primary" />
                                            Optimize keyword usage for ATS systems
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="h-1 w-1 rounded-full bg-primary" />
                                            Suggest improvements based on your notes
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                    
                    <DialogFooter className="gap-2 sm:gap-0 mt-2">
                        <DialogClose asChild>
                            <Button 
                                type="button" 
                                variant="outline" 
                                disabled={isEnhancing}
                                className="border-2"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button 
                            onClick={handleEnhanceEntireResume} 
                            disabled={isEnhancing}
                            className="bg-gradient-to-r from-primary to-accent-purple hover:opacity-90 transition-opacity gap-2 min-w-[140px]"
                            size="lg"
                        >
                            {isEnhancing ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                    Enhancing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4" />
                                    Enhance Resume
                                </>
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