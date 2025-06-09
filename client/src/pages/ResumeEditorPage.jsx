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

// Custom Components (Lazy Loaded)
const ResumePreview = React.lazy(() => import("@/components/Resume/ResumePreview"));
const ResumeForm = React.lazy(() => import("@/components/Resume/ResumeForm"));

// Hooks & Contexts
import useAuthContext from "@/hooks/useAuth";
import useTemplateContext from "@/hooks/useTemplate";
import useResumeContext from "@/hooks/useResume";

// API & Utilities
import { downloadResume as apiDownloadResume, generateAISummary } from "@/api/resumeServiceApi";
import { cn } from "@/lib/utils";

// Helper function to initialize form data
const initializeFormDataFromDefinitions = (definitions) => {
  const initialData = {};
  if (!Array.isArray(definitions)) {
    console.warn("ResumeEditorPage: Field definitions is not an array:", definitions);
    return initialData;
  }
  definitions.forEach(fieldDef => {
    const keys = fieldDef.name.split('.');
    let currentLevel = initialData;
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
  });
  return initialData;
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

  // This one useEffect handles all initial page setup and state preservation logic.
  useEffect(() => {
    const setupPage = async () => {
      if (isAuthLoading) return;
      if (!isAuthenticated) {
        navigate('/login', { state: { from: location }, replace: true });
        return;
      }

      setPageIsLoading(true);
      setPageError(null);
      try {
        if (existingResumeId) {
          // --- EDIT MODE ---
          // FIX: Always load the resume based on the ID in the URL.
          // This ensures that after saving a new resume and navigating, the correct data is loaded.
          setMode('edit');
          const loadedResume = await loadResumeForEditor(existingResumeId);
          if (!loadedResume) throw new Error("Failed to load your resume.");
          setCurrentTemplateForEditor(loadedResume.templateId);
          setEditableResumeName(loadedResume.resumeName || 'Untitled Resume');
          
        } else if (newResumeTemplateId) {
          // --- CREATE MODE ---
          // This condition correctly preserves state when returning from preview.
          if (currentResumeDetail?.templateId?._id !== newResumeTemplateId || Object.keys(editorFormData).length === 0) {
            setMode('create');
            let templates = allTemplates;
            if (templates.length === 0) {
              templates = await getAllTemplates();
            }
            const targetTemplate = templates.find(t => t._id === newResumeTemplateId);
            if (!targetTemplate) throw new Error(`Template with ID ${newResumeTemplateId} not found.`);
            if (!targetTemplate.templateCode || !targetTemplate.templateFieldDefinition) throw new Error(`Template is incomplete.`);
            
            setCurrentTemplateForEditor(targetTemplate);
            prepareNewResumeForEditor(targetTemplate);
            const initialData = initializeFormDataFromDefinitions(targetTemplate.templateFieldDefinition);
            setEditorFormData(initialData);
            setEditableResumeName(`My New ${targetTemplate.templateName || 'Resume'}`);
          } else {
             // We are returning from preview, data is already in context.
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

  // This effect cleans up the context state ONLY when the user navigates away completely.
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

  const handleSimpleChange = useCallback((fieldPath, value) => {
    setEditorFormData(prevData => {
        const newData = cloneDeep(prevData);
        set(newData, fieldPath, value);
        return newData;
    });
  }, [setEditorFormData]);

  const handleArrayItemChange = useCallback((arrayPath, itemIndex, fieldName, value) => {
    setEditorFormData(prevData => {
        const newData = cloneDeep(prevData);
        const itemPath = `${arrayPath}[${itemIndex}].${fieldName}`;
        set(newData, itemPath, value);
        return newData;
    });
  }, [setEditorFormData]);

  const handleAddItemToArray = useCallback((arrayPath, defaultItem = {}) => {
    setEditorFormData(prevData => {
        const newData = cloneDeep(prevData);
        const currentArray = get(newData, arrayPath, []);
        currentArray.push(cloneDeep(defaultItem));
        set(newData, arrayPath, currentArray);
        return newData;
    });
  }, [setEditorFormData]);

  const handleRemoveItemFromArray = useCallback((arrayPath, index) => {
    setEditorFormData(prevData => {
        const newData = cloneDeep(prevData);
        const currentArray = get(newData, arrayPath, []);
        currentArray.splice(index, 1);
        set(newData, arrayPath, currentArray);
        return newData;
    });
  }, [setEditorFormData]);

  const handleResumeNameChange = (e) => setEditableResumeName(e.target.value);

  const handleSaveResume = async () => {
    if ((mode === 'create' && !currentTemplateForEditor?._id) || (mode === 'edit' && !currentResumeDetail?._id)) {
      setFeedbackDetailsForDialog({ title: 'Save Error', message: 'Essential details are missing.', type: 'error' });
      setShowFeedbackDialog(true); return;
    }
    if (!editorFormData || Object.keys(editorFormData).length === 0) {
      setFeedbackDetailsForDialog({ title: 'Save Error', message: 'Form data is empty.', type: 'error' });
      setShowFeedbackDialog(true); return;
    }
    let nameToSave = editableResumeName.trim() || (currentTemplateForEditor ? `My ${currentTemplateForEditor.templateName || 'Resume'}` : 'Untitled Resume');
    const savedResult = await saveOrUpdateCurrentResume(editorFormData, nameToSave);
    if (savedResult?._id) {
      setFeedbackDetailsForDialog({ title: 'Success!', message: 'Resume saved successfully!', type: 'success' });
      setShowFeedbackDialog(true);
      setEditableResumeName(savedResult.resumeName);
      if (mode === 'create') {
        // Navigate to the new edit page, which will trigger the useEffect to load the saved data
        navigate(`/resume/edit/${savedResult._id}`, { replace: true });
      }
    }
  };

  const handleDownloadPdf = async () => {
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
    if (mode === 'create' && newResumeTemplateId) {
        navigate(`/resume/view/${newResumeTemplateId}`, { 
            state: { 
                formData: editorFormData, 
                resumeName: editableResumeName || `Preview: My New ${currentTemplateForEditor?.templateName || 'Resume'}`
            } 
        });
    } else if (mode === 'edit' && existingResumeId) {
        navigate(`/resume/saved/view/${existingResumeId}`);
    } else {
        setPageError("Cannot preview: Resume or Template ID is not available.");
    }
  };
  
  const handleGenerateAISummary = async () => {
    if (!editorFormData || Object.keys(editorFormData).length === 0) {
      setAiSummaryError("Please fill in some resume details first."); return;
    }
    setIsGeneratingSummary(true);
    setAiSummaryError(null);
    try {
      const summary = await generateAISummary(editorFormData);
      const summaryFieldPath = 'professionalProfile.summary';
      setEditorFormData(prevData => {
        const newData = cloneDeep(prevData);
        set(newData, summaryFieldPath, summary);
        return newData;
      });
      setFeedbackDetailsForDialog({ title: 'AI Summary Generated!', message: 'The summary has been updated.', type: 'success' });
      setShowFeedbackDialog(true);
    } catch (error) {
      setAiSummaryError(error.message || "Failed to generate AI summary.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };
  
  const handleDialogClose = (isOpen) => {
    if (!isOpen) {
        setShowFeedbackDialog(false);
    }
  };
  
  const isInitiallyLoading = pageIsLoading || isAuthLoading || isLoadingTemplates || (mode === 'edit' && isLoadingCurrentResume);

  if (isInitiallyLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-background"><LoadingSpinner size="large" label="Preparing Editor..." /></div>;
  }
  
  if (pageError) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
            <Alert variant="destructive" className="max-w-lg w-full">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Error Loading Editor</AlertTitle>
            <AlertDescription>{pageError}</AlertDescription>
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
              {/* <Button variant="outline" size="sm" onClick={handleGenerateAISummary} disabled= {isGeneratingSummary || isSavingResume} className="border-border text-xs sm:text-sm text-primary hover:bg-primary/10 hover:border-primary h-8 px-2 sm:px-3"> */}
              <Button variant="outline" size="sm" onClick={handleGenerateAISummary} disabled="true" className="border-border text-xs sm:text-sm text-primary hover:bg-primary/10 hover:border-primary h-8 px-2 sm:px-3">
                {isGeneratingSummary ? <Loader2 size={14} className="animate-spin sm:mr-1.5" /> : <Sparkles size={14} className="sm:mr-1.5" />} <span className="hidden sm:inline">{isGeneratingSummary ? 'AI...' : 'AI Summary'}</span>
              </Button>
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
        
        {aiSummaryError && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-3">
            <Alert variant="destructive"><AlertCircle className="h-5 w-5" /><AlertTitle>AI Summary Error</AlertTitle><AlertDescription>{aiSummaryError}</AlertDescription></Alert>
          </div>
        )}

        <main className="flex-grow container mx-auto px-1 sm:px-2 md:px-4 py-3 md:py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} 
              className="lg:sticky lg:top-[75px] h-fit"
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
                    />
                  </Suspense>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }} 
              className="lg:sticky lg:top-[75px] h-fit"
            >
              <Suspense fallback={<div className="flex justify-center items-center min-h-[calc(100vh-100px)] bg-muted/20 rounded-xl border border-border"><LoadingSpinner label="Loading preview..." /></div>}>
                <ResumePreview
                  ref={resumePreviewRef}
                  templateCode={currentTemplateForEditor?.templateCode || ''}
                  currentFormData={editorFormData || {}}
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
    </>
  );
};

export default ResumeEditorPage;
