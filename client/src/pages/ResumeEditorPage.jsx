import React, { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { get, set, cloneDeep } from 'lodash';

// UI Components & Icons
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Eye, Download, Save, ArrowLeft, Loader2, AlertCircle, RefreshCw, Edit2, Sparkles, CheckCircle2 } from "lucide-react";
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
import EnhancementDialog from '@/components/Resume/EnhancementDialog'

// Custom Components (Lazy Loaded)
const ResumePreview = React.lazy(() => import("@/components/Resume/ResumePreview"));
const ResumeForm = React.lazy(() => import("@/components/Resume/ResumeForm"));

// Hooks & Contexts
import useAuthContext from "@/hooks/useAuth";
import useTemplateContext from "@/hooks/useTemplate";
import useResumeContext from "@/hooks/useResume";

// API & Utilities
import { downloadResume as apiDownloadResume, generateAISummary, enhanceResumeField } from "@/api/resumeServiceApi";
import { cn } from "@/lib/utils";
import AuthDialog from '@/components/Auth/AuthDialog.jsx';


// --- NEW HELPER FUNCTION ---
// Initializes the complete form data structure with content and section configs.
const initializeFormDataFromDefinitions = (definitions) => {
  const content = {};
  const sectionsConfig = {};

  if (Array.isArray(definitions)) {
    definitions.forEach(fieldDef => {
      // Logic for populating the 'content' object
      const keys = fieldDef.name.split('.');
      let currentLevel = content;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          if (fieldDef.type === 'group' && fieldDef.repeatable) {
            currentLevel[key] = fieldDef.startWithEmpty === false && fieldDef.defaultItem
                ? [cloneDeep(fieldDef.defaultItem)]
                : [];
          } else if (fieldDef.type === 'group' && !fieldDef.repeatable) {
            currentLevel[key] = {};
            if (Array.isArray(fieldDef.subFields)) {
              fieldDef.subFields.forEach(subField => {
                currentLevel[key][subField.name] = subField.defaultValue ?? '';
              });
            }
          } else {
            currentLevel[key] = fieldDef.defaultValue ?? '';
          }
        } else {
          currentLevel[key] = currentLevel[key] || {};
          currentLevel = currentLevel[key];
        }
      });

      // NEW logic: If a field is a repeatable group, it's a section we can toggle.
      if (fieldDef.type === 'group' && fieldDef.repeatable) {
        sectionsConfig[fieldDef.name] = { enabled: true }; // Enable by default
      }
    });
  }

  // Return the complete object with both content and config
  return { content, sectionsConfig };
};


const ResumeEditorPage = () => {
  const { newResumeTemplateId, existingResumeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const resumePreviewRef = useRef();

  const { isAuthenticated, isLoading: isAuthLoading } = useAuthContext();
  const {
    templates: allTemplates,
    getAllTemplates,
    isLoadingTemplates
  } = useTemplateContext();

  const {
    currentResumeDetail,
    editorFormData,
    setEditorFormData,
    isSavingResume,
    resumeError,
    loadResumeForEditor,
    prepareNewResumeForEditor,
    saveOrUpdateCurrentResume,
    clearCurrentEditorData,
    isLoadingCurrentResume
  } = useResumeContext();

  const [mode, setMode] = useState(null);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [currentTemplateForEditor, setCurrentTemplateForEditor] = useState(null);
  const [editableResumeName, setEditableResumeName] = useState('');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [aiSummaryError, setAiSummaryError] = useState(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackDetailsForDialog, setFeedbackDetailsForDialog] = useState({ title: '', message: '', type: 'success' });
  const [spacingMultiplier, setSpacingMultiplier] = useState(1);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementSuggestions, setEnhancementSuggestions] = useState(null);
  const [activeEnhancementInfo, setActiveEnhancementInfo] = useState({ path: null, originalText: '' });
  
  

  useEffect(() => {
    const setupPage = async () => {
      if (isAuthLoading) return;

      setPageIsLoading(true);
      setPageError(null);
      try {
        if (existingResumeId) {
          setMode('edit');
          const loadedResume = await loadResumeForEditor(existingResumeId);
          if (!loadedResume) throw new Error("Failed to load your resume.");
          
          // Ensure loaded data has the new structure
          if (!loadedResume.resumeData.content || !loadedResume.resumeData.sectionsConfig) {
             console.warn("Older data format detected. Consider migrating.");
             // For now, we can wrap it, but a migration script would be better
             const migratedData = {
                content: loadedResume.resumeData,
                sectionsConfig: initializeFormDataFromDefinitions(loadedResume.templateId.templateFieldDefinition).sectionsConfig
             };
             setEditorFormData(migratedData);
          }
          
          setCurrentTemplateForEditor(loadedResume.templateId);
          setEditableResumeName(loadedResume.resumeName || 'Untitled Resume');

          setSpacingMultiplier(loadedResume.spacingMultiplier || 1);
          
        } else if (newResumeTemplateId) {
          // Check if data is already in context from a preview navigation
          const isReturningFromPreview = currentResumeDetail?.templateId?._id === newResumeTemplateId && editorFormData?.content && editorFormData?.sectionsConfig;

          if (!isReturningFromPreview) {
            setMode('create');
            let templates = allTemplates.length > 0 ? allTemplates : await getAllTemplates();
            const targetTemplate = templates.find(t => t._id === newResumeTemplateId);
            if (!targetTemplate) throw new Error(`Template with ID ${newResumeTemplateId} not found.`);
            
            setCurrentTemplateForEditor(targetTemplate);
            prepareNewResumeForEditor(targetTemplate); // This might need adjustment in your context
            
            // --- MODIFIED: Use the new initializer ---
            const initialData = initializeFormDataFromDefinitions(targetTemplate.templateFieldDefinition);
            setEditorFormData(initialData);
            setEditableResumeName(`My New ${targetTemplate.templateName || 'Resume'}`);
          } else {
             setMode('create');
             setCurrentTemplateForEditor(currentResumeDetail.templateId);
             setEditableResumeName(editableResumeName || `My New ${currentResumeDetail.templateId.templateName || 'Resume'}`);
          }
        } else {
          throw new Error("Invalid page access.");
        }
      } catch (err) {
        setPageError(err.message);
      } finally {
        setPageIsLoading(false);
      }
    };
    
    setupPage();
    
  }, [existingResumeId, newResumeTemplateId, isAuthenticated, isAuthLoading]);

  useEffect(() => {
    return () => {
      if (!window.location.pathname.startsWith('/resume/')) {
        clearCurrentEditorData();
      }
    };
  }, [location.pathname, clearCurrentEditorData]);

  useEffect(() => {
    if (resumeError && isSavingResume) {
      setFeedbackDetailsForDialog({ title: 'Operation Failed', message: resumeError.message || 'An unexpected error occurred.', type: 'error' });
      setShowFeedbackDialog(true);
    }
  }, [resumeError, isSavingResume]);

  // --- MODIFIED: All handlers now target the `content` sub-object ---
  const handleSimpleChange = useCallback((fieldPath, value) => {
    setEditorFormData(prevData => {
        const newData = cloneDeep(prevData);
        set(newData, `content.${fieldPath}`, value);
        return newData;
    });
  }, [setEditorFormData]);

  const handleArrayItemChange = useCallback((arrayPath, itemIndex, fieldName, value) => {
    setEditorFormData(prevData => {
        const newData = cloneDeep(prevData);
        const itemPath = `content.${arrayPath}[${itemIndex}].${fieldName}`;
        set(newData, itemPath, value);
        return newData;
    });
  }, [setEditorFormData]);

  const handleAddItemToArray = useCallback((arrayPath, defaultItem = {}) => {
    setEditorFormData(prevData => {
        const newData = cloneDeep(prevData);
        const currentArray = get(newData, `content.${arrayPath}`, []);
        currentArray.push(cloneDeep(defaultItem));
        set(newData, `content.${arrayPath}`, currentArray);
        return newData;
    });
  }, [setEditorFormData]);

  const handleRemoveItemFromArray = useCallback((arrayPath, index) => {
    setEditorFormData(prevData => {
        const newData = cloneDeep(prevData);
        const currentArray = get(newData, `content.${arrayPath}`, []);
        currentArray.splice(index, 1);
        set(newData, `content.${arrayPath}`, currentArray);
        return newData;
    });
  }, [setEditorFormData]);

  // --- NEW: Handler for toggling sections on and off ---
  const handleSectionToggle = useCallback((sectionKey) => {
    setEditorFormData(prevData => {
        const newData = cloneDeep(prevData);
        const currentStatus = get(newData, `sectionsConfig.${sectionKey}.enabled`, false);
        set(newData, `sectionsConfig.${sectionKey}.enabled`, !currentStatus);
        return newData;
    });
  }, [setEditorFormData]);


  const handleResumeNameChange = (e) => setEditableResumeName(e.target.value);

  const handleSaveResume = async () => {
    if (!isAuthenticated) {
        setShowAuthDialog(true);
        return;
    }
    const savedResult = await saveOrUpdateCurrentResume(editorFormData, editableResumeName.trim(), spacingMultiplier);
    if (savedResult?._id) {
      setFeedbackDetailsForDialog({ title: 'Success!', message: 'Resume saved successfully!', type: 'success' });
      setShowFeedbackDialog(true);
      if (mode === 'create') {
        navigate(`/resume/edit/${savedResult._id}`, { replace: true });
      }
    }
  };

  const handleDownloadPdf = async () => {
    if (!isAuthenticated) {
        setShowAuthDialog(true);
        return;
    }
    if (!resumePreviewRef.current) return;
    setIsDownloadingPdf(true);
    try {
      const htmlContent = resumePreviewRef.current.innerHTML;
      await apiDownloadResume(htmlContent);
    } catch (error) {
      setPageError('Failed to download PDF.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePreviewPage = () => {
    const targetPath = mode === 'create' 
      ? `/resume/view/${newResumeTemplateId}` 
      : `/resume/saved/view/${existingResumeId}`;
    
    navigate(targetPath, {
        state: { 
            formData: editorFormData, 
            resumeName: editableResumeName
        } 
    });
  };
  
  // const handleGenerateAISummary = async () => {
  //   if (!editorFormData?.content || Object.keys(editorFormData.content).length === 0) {
  //     setAiSummaryError("Please fill in some resume details first."); return;
  //   }
  //   setIsGeneratingSummary(true);
  //   setAiSummaryError(null);
  //   try {
  //     const summary = await generateAISummary(editorFormData.content); // Pass only content to AI
      
  //     // --- MODIFIED: Set the summary within the `content` object ---
  //     const summaryFieldPath = 'content.summary'; // Assuming summary is at the top level of content
  //     setEditorFormData(prevData => {
  //       const newData = cloneDeep(prevData);
  //       set(newData, summaryFieldPath, summary);
  //       return newData;
  //     });

  //     setFeedbackDetailsForDialog({ title: 'AI Summary Generated!', message: 'The summary has been updated.', type: 'success' });
  //     setShowFeedbackDialog(true);
  //   } catch (error) {
  //     setAiSummaryError(error.message || "Failed to generate AI summary.");
  //   } finally {
  //     setIsGeneratingSummary(false);
  //   }
  // };


  const handleEnhanceField = async (fieldPath, textToEnhance, jobContext) => {
      // Prevent calling with empty text
      if (!textToEnhance || textToEnhance.trim() === '') {
          setFeedbackDetailsForDialog({ title: 'Cannot Enhance', message: 'Please enter some text before using AI enhancement.', type: 'error' });
          setShowFeedbackDialog(true);
          return;
      }

      setIsEnhancing(true);
      setActiveEnhancementInfo({ path: fieldPath, originalText: textToEnhance }); // Store path and text

      try {
          const suggestions = await enhanceResumeField(textToEnhance, jobContext);
          setEnhancementSuggestions(suggestions); // This will open the dialog
      } catch (error) {
          setFeedbackDetailsForDialog({ title: 'AI Enhancement Failed', message: error.message, type: 'error' });
          setShowFeedbackDialog(true);
      } finally {
          setIsEnhancing(false);
      }
  };

  const handleAcceptSuggestion = (suggestionText) => {
    if (activeEnhancementInfo.path) {
        // This regex checks if the path is for an array item, e.g., "workExperience[0].description"
        const arrayMatch = activeEnhancementInfo.path.match(/^(.*)\[(\d+)\]\.(.*)$/);

        if (arrayMatch) {
            // It's an array item! Call the correct handler.
            const [, arrayName, itemIndex, fieldName] = arrayMatch;
            handleArrayItemChange(arrayName, parseInt(itemIndex, 10), fieldName, suggestionText);
        } else {
            // It's a simple, top-level field.
            handleSimpleChange(activeEnhancementInfo.path, suggestionText);
        }
    }
    
    // This part remains the same
    setEnhancementSuggestions(null);
    setActiveEnhancementInfo({ path: null, originalText: '' });
  };
  
  const handleDialogClose = (isOpen) => !isOpen && setShowFeedbackDialog(false);
  
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
      <div className="flex flex-col min-h-screen bg-muted/20 dark:bg-background text-foreground">
        {/* Header remains the same */}
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border shadow-sm px-2 sm:px-4 py-2.5">
          <div className="container mx-auto flex items-center justify-between gap-1 sm:gap-2">
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink min-w-0">
              <Button variant="ghost" size="icon" onClick={() => navigate(existingResumeId ? '/dashboard' : '/templates')} aria-label="Go back" className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                <ArrowLeft size={18} />
              </Button>
              <div className="flex items-center gap-1.5 min-w-0 relative group">
                <Input
                    value={editableResumeName}
                    onChange={handleResumeNameChange}
                    placeholder="Untitled Resume"
                    className="text-sm sm:text-base font-semibold p-1 h-9 border-transparent hover:border-input focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-muted truncate bg-transparent max-w-[120px] xs:max-w-[150px] sm:max-w-[200px] md:max-w-xs pr-6"
                    aria-label="Resume Name"
                 />
                 <Edit2 size={12} className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-hover:text-primary transition-colors"/>
              </div>
            </div>
            <div className="text-xs text-muted-foreground truncate hidden lg:block mx-4 flex-grow text-center">
                Using Template: <span className="font-medium text-foreground">{currentTemplateForEditor?.templateName || 'Loading...'}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
              {/* <Button variant="outline" size="sm" onClick={handleGenerateAISummary} disabled={isGeneratingSummary} className="border-border text-xs sm:text-sm text-primary hover:bg-primary/10 hover:border-primary h-8 px-2 sm:px-3">
                {isGeneratingSummary ? <Loader2 size={14} className="animate-spin sm:mr-1.5" /> : <Sparkles size={14} className="sm:mr-1.5" />} <span className="hidden sm:inline">{isGeneratingSummary ? 'AI...' : 'AI Summary'}</span>
              </Button> */}
              <Button variant="outline" size="sm" onClick={handlePreviewPage} className="border-border text-xs sm:text-sm h-8 px-2 sm:px-3"><Eye size={14} className="sm:mr-1.5" /> <span className="hidden sm:inline">Preview</span></Button>
              <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={isDownloadingPdf || isSavingResume} className="border-border text-xs sm:text-sm h-8 px-2 sm:px-3">
                {isDownloadingPdf ? <Loader2 size={14} className="animate-spin sm:mr-1.5" /> : <Download size={14} className="sm:mr-1.5" />} <span className="hidden sm:inline">{isDownloadingPdf ? '...' : 'PDF'}</span>
              </Button>
              <Button size="sm" onClick={handleSaveResume} disabled={isSavingResume || isLoadingCurrentResume || isGeneratingSummary} className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm h-8 px-2 sm:px-3">
                {isSavingResume ? <Loader2 size={14} className="animate-spin sm:mr-1.5" /> : <Save size={14} className="sm:mr-1.5" />} <span className="hidden sm:inline">{isSavingResume ? 'Saving...' : (mode === 'create' ? 'Save' : 'Update')}</span>
              </Button>
            </div>
          </div>
        </header>

        {/* {aiSummaryError && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-3">
            <Alert variant="destructive"><AlertCircle className="h-5 w-5" /><AlertTitle>AI Summary Error</AlertTitle><AlertDescription>{aiSummaryError}</AlertDescription></Alert>
          </div>
        )} */}

        <main className="flex-grow container mx-auto px-1 sm:px-2 md:px-4 py-3 md:py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} 
              className="lg:sticky lg:top-[75px] h-fit lg:col-span-5"
            >
              <Card className="bg-card border-border shadow-xl">
                <CardContent className="p-0 max-h-[calc(100vh-100px)] overflow-y-auto">
                  <Suspense fallback={<div className="p-6 min-h-[400px] flex items-center justify-center"><LoadingSpinner label="Loading form..." /></div>}>
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
                    />
                  </Suspense>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }} 
              className="lg:sticky lg:top-[75px] h-fit lg:col-span-7"
            >       
              <div className="bg-card border rounded-b-none rounded-t-xl p-3 flex items-center gap-4 shadow-sm">
                <Label htmlFor="spacing-slider" className="text-sm font-medium text-muted-foreground whitespace-nowrap">Spacing</Label>
                <Slider
                  id="spacing-slider"
                  min={0.8}
                  max={1.5}
                  step={0.05}
                  value={[spacingMultiplier]}
                  onValueChange={(value) => setSpacingMultiplier(value[0])}
                  className="w-full"
                />
                <span className="text-sm font-mono text-foreground w-12 text-center">{spacingMultiplier.toFixed(2)}x</span>
              </div>

              <Suspense fallback={<div className="flex justify-center items-center min-h-[calc(100vh-100px)] bg-muted/20 rounded-xl border border-border"><LoadingSpinner label="Loading preview..." /></div>}>
                <ResumePreview
                  ref={resumePreviewRef}
                  templateCode={currentTemplateForEditor?.templateCode || ''}
                  currentFormData={editorFormData || {}}
                  spacingMultiplier={spacingMultiplier} 
                />
              </Suspense>
            </motion.div>
          </div>
        </main>
      </div>

      <Dialog open={showFeedbackDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md bg-card">
          <DialogHeader><DialogTitle className={cn("flex items-center text-lg font-semibold", feedbackDetailsForDialog.type === 'success' ? "text-green-600" : "text-destructive")}>
              {feedbackDetailsForDialog.type === 'success' ? <CheckCircle2 className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              {feedbackDetailsForDialog.title}
          </DialogTitle></DialogHeader>
          <DialogDescription className="py-4 text-muted-foreground">{feedbackDetailsForDialog.message}</DialogDescription>
          <DialogFooter className="sm:justify-end"><DialogClose asChild><Button type="button">Close</Button></DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>
      
      <EnhancementDialog
            suggestions={enhancementSuggestions}
            originalText={activeEnhancementInfo.originalText}
            onAccept={handleAcceptSuggestion}
            onOpenChange={() => setEnhancementSuggestions(null)} 
      />

      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
      />
    </>
  );
};

export default ResumeEditorPage;