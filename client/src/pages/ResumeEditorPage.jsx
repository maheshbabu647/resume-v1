// import React, { useEffect, useState, useCallback, useRef, Suspense } from "react";
// import { Helmet } from "react-helmet-async";
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { get, set, cloneDeep } from 'lodash';

// // UI Components & Icons
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Slider } from "@/components/ui/slider";
// import { Label } from "@/components/ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { Eye, Download, Save, ArrowLeft, Loader2, AlertCircle, RefreshCw, Edit2, CheckCircle2 } from "lucide-react";
// import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
// import EnhancementDialog from '@/components/Resume/EnhancementDialog'

// // Custom Components (Lazy Loaded)
// const ResumePreview = React.lazy(() => import("@/components/Resume/ResumePreview"));
// const ResumeForm = React.lazy(() => import("@/components/Resume/ResumeForm"));

// // Hooks & Contexts
// import useAuthContext from "@/hooks/useAuth";
// import useTemplateContext from "@/hooks/useTemplate";
// import useResumeContext from "@/hooks/useResume";

// // API & Utilities
// import { downloadResume as apiDownloadResume, enhanceResumeField } from "@/api/resumeServiceApi";
// import { cn } from "@/lib/utils";
// import AuthDialog from '@/components/Auth/AuthDialog.jsx';

// // Helper function to initialize form data based on template definitions
// const initializeFormDataFromDefinitions = (definitions, selectedIndustry) => {
//   const content = {};
//   const sectionsConfig = {};

//   if (!Array.isArray(definitions)) {
//     return { content, sectionsConfig };
//   }

//   // 1. Group fields and find metadata for each unique section
//   const uniqueSections = definitions.reduce((acc, field) => {
//     if (field.section && !acc[field.section]) {
//       const sectionDef = definitions.find(def => def.section === field.section && (def.isCore !== undefined || def.recommendedFor));
//       acc[field.section] = {
//         isCore: sectionDef?.isCore || false,
//         recommendedFor: sectionDef?.recommendedFor || null,
//         isToggleable: definitions.some(def => def.section === field.section && def.type === 'group' && def.repeatable)
//       };
//     }
//     return acc;
//   }, {});

//   // 2. Build the sectionsConfig with the corrected logic
//   for (const sectionKey in uniqueSections) {
//     const { isCore, recommendedFor, isToggleable } = uniqueSections[sectionKey];
    
//     if (isToggleable) {
//       // Default to disabled and enable only if a condition is met
//       let isEnabled = false; 

//       if (isCore) {
//         // Condition 1: Core sections are always enabled.
//         isEnabled = true;
//       } else if (!selectedIndustry) {
//         // Condition 2: If NO industry is selected, enable all toggleable sections by default.
//         isEnabled = true;
//       } else {
//         // Condition 3: An industry IS selected.
//         if (!recommendedFor) {
//           // It's a generic, non-core section (like 'Interests'), so enable it.
//           isEnabled = true;
//         } else {
//           // It has industry recommendations. Enable ONLY if it's a match.
//           isEnabled = recommendedFor.includes(selectedIndustry);
//         }
//       }
//       sectionsConfig[sectionKey] = { enabled: isEnabled };
//     }
//   }

//   // 3. Populate the 'content' object with default values
//   definitions.forEach(fieldDef => {
//     console.log("hello",fieldDef.name)
//     const keys = fieldDef.name.split('.');
//     let currentLevel = content;
//     keys.forEach((key, index) => {
//       if (index === keys.length - 1) {
//         if (fieldDef.type === 'group' && fieldDef.repeatable) {
//           currentLevel[key] = [];
//         } else {
//           currentLevel[key] = fieldDef.defaultValue ?? '';
//         }
//       } else {
//         currentLevel[key] = currentLevel[key] || {};
//         currentLevel = currentLevel[key];
//       }
//     });
//   });

//   return { content, sectionsConfig };
// };


// const ResumeEditorPage = () => {
//   const { newResumeTemplateId, existingResumeId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const resumePreviewRef = useRef();

//   const { isAuthenticated, isLoading: isAuthLoading } = useAuthContext();
//   const {
//     templates: allTemplates,
//     getAllTemplates,
//     isLoadingTemplates
//   } = useTemplateContext();

//   const {
//     currentResumeDetail,
//     editorFormData,
//     setEditorFormData,
//     isSavingResume,
//     resumeError,
//     loadResumeForEditor,
//     prepareNewResumeForEditor,
//     saveOrUpdateCurrentResume,
//     clearCurrentEditorData,
//     isLoadingCurrentResume
//   } = useResumeContext();

//   const [mode, setMode] = useState(null);
//   const [pageIsLoading, setPageIsLoading] = useState(true);
//   const [pageError, setPageError] = useState(null);
//   const [currentTemplateForEditor, setCurrentTemplateForEditor] = useState(null);
//   const [editableResumeName, setEditableResumeName] = useState('');
//   const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
//   const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
//   const [feedbackDetailsForDialog, setFeedbackDetailsForDialog] = useState({ title: '', message: '', type: 'success' });
//   const [spacingMultiplier, setSpacingMultiplier] = useState(1);
//   const [showAuthDialog, setShowAuthDialog] = useState(false);
//   const [isEnhancing, setIsEnhancing] = useState(false);
//   const [enhancementSuggestions, setEnhancementSuggestions] = useState(null);
//   const [activeEnhancementInfo, setActiveEnhancementInfo] = useState({ path: null, originalText: '' });
  
//   useEffect(() => {
//     const setupPage = async () => {
//       if (isAuthLoading) return;

//       setPageIsLoading(true);
//       setPageError(null);
//       try {
//         if (existingResumeId) {
//           setMode('edit');
//           const loadedResume = await loadResumeForEditor(existingResumeId);
//           if (!loadedResume) throw new Error("Failed to load your resume.");
          
//           if (!loadedResume.resumeData.content || !loadedResume.resumeData.sectionsConfig) {
//               console.warn("Older data format detected. Migrating to new structure.");
//               const migratedData = {
//                   content: loadedResume.resumeData,
//                   sectionsConfig: initializeFormDataFromDefinitions(loadedResume.templateId.templateFieldDefinition, null).sectionsConfig
//               };
//               setEditorFormData(migratedData);
//           } else {
//               setEditorFormData(loadedResume.resumeData);
//           }
          
//           setCurrentTemplateForEditor(loadedResume.templateId);
//           setEditableResumeName(loadedResume.resumeName || 'Untitled Resume');
//           setSpacingMultiplier(loadedResume.spacingMultiplier || 1);
          
//         } else if (newResumeTemplateId) {
//           const queryParams = new URLSearchParams(location.search);
//           const selectedIndustry = queryParams.get('industry');

//           const isReturningFromPreview = currentResumeDetail?.templateId?._id === newResumeTemplateId && editorFormData?.content;

//           if (!isReturningFromPreview) {
//             setMode('create');
//             let templates = allTemplates.length > 0 ? allTemplates : await getAllTemplates();
//             const targetTemplate = templates.find(t => t._id === newResumeTemplateId);
//             if (!targetTemplate) throw new Error(`Template with ID ${newResumeTemplateId} not found.`);
            
//             setCurrentTemplateForEditor(targetTemplate);
            
//             // --- FIX: Re-added the missing call to prepare the context ---
//             // This function likely sets up essential details in your resume context,
//             // such as the template ID, which are needed for the save operation to succeed when creating a new resume.
//             prepareNewResumeForEditor(targetTemplate); 
            
//             const initialData = initializeFormDataFromDefinitions(targetTemplate.templateFieldDefinition, selectedIndustry);
//             setEditorFormData(initialData);

//             const nameSuffix = selectedIndustry ? `${targetTemplate.templateName} - ${selectedIndustry}` : (targetTemplate.templateName || 'Resume');
//             setEditableResumeName(`My New ${nameSuffix}`);

//           } else {
//               setMode('create');
//               setCurrentTemplateForEditor(currentResumeDetail.templateId);
//               setEditableResumeName(editableResumeName || `My New ${currentResumeDetail.templateId.templateName || 'Resume'}`);
//           }
//         } else {
//           throw new Error("Invalid page access.");
//         }
//       } catch (err) {
//         setPageError(err.message);
//       } finally {
//         setPageIsLoading(false);
//       }
//     };
    
//     setupPage();
    
//   }, [existingResumeId, newResumeTemplateId, isAuthenticated, isAuthLoading, location.search]);

//   useEffect(() => {
//     return () => {
//       if (!window.location.pathname.startsWith('/resume/')) {
//         clearCurrentEditorData();
//       }
//     };
//   }, [location.pathname, clearCurrentEditorData]);

//   useEffect(() => {
//     if (resumeError && isSavingResume) {
//       setFeedbackDetailsForDialog({ title: 'Operation Failed', message: resumeError.message || 'An unexpected error occurred.', type: 'error' });
//       setShowFeedbackDialog(true);
//     }
//   }, [resumeError, isSavingResume]);

//   const handleSimpleChange = useCallback((fieldPath, value) => {
//     setEditorFormData(prevData => {
//         const newData = cloneDeep(prevData);
//         set(newData, `content.${fieldPath}`, value);
//         return newData;
//     });
//   }, [setEditorFormData]);

//   const handleArrayItemChange = useCallback((arrayPath, itemIndex, fieldName, value) => {
//     setEditorFormData(prevData => {
//         const newData = cloneDeep(prevData);
//         const itemPath = `content.${arrayPath}[${itemIndex}].${fieldName}`;
//         set(newData, itemPath, value);
//         return newData;
//     });
//   }, [setEditorFormData]);

//   const handleAddItemToArray = useCallback((arrayPath, defaultItem = {}) => {
//     setEditorFormData(prevData => {
//         const newData = cloneDeep(prevData);
//         const currentArray = get(newData, `content.${arrayPath}`, []);
//         currentArray.push(cloneDeep(defaultItem));
//         set(newData, `content.${arrayPath}`, currentArray);
//         return newData;
//     });
//   }, [setEditorFormData]);

//   const handleRemoveItemFromArray = useCallback((arrayPath, index) => {
//     setEditorFormData(prevData => {
//         const newData = cloneDeep(prevData);
//         const currentArray = get(newData, `content.${arrayPath}`, []);
//         currentArray.splice(index, 1);
//         set(newData, `content.${arrayPath}`, currentArray);
//         return newData;
//     });
//   }, [setEditorFormData]);

//   const handleSectionToggle = useCallback((sectionKey) => {
//     setEditorFormData(prevData => {
//         const newData = cloneDeep(prevData);
//         const currentStatus = get(newData, `sectionsConfig.${sectionKey}.enabled`, false);
//         set(newData, `sectionsConfig.${sectionKey}.enabled`, !currentStatus);
//         return newData;
//     });
//   }, [setEditorFormData]);


//   const handleResumeNameChange = (e) => setEditableResumeName(e.target.value);

//   const handleSaveResume = async () => {
//     if (!isAuthenticated) {
//         setShowAuthDialog(true);
//         return;
//     }
//     const savedResult = await saveOrUpdateCurrentResume(editorFormData, editableResumeName.trim(), spacingMultiplier);
//     if (savedResult?._id) {
//       setFeedbackDetailsForDialog({ title: 'Success!', message: 'Resume saved successfully!', type: 'success' });
//       setShowFeedbackDialog(true);
//       if (mode === 'create') {
//         navigate(`/resume/edit/${savedResult._id}`, { replace: true });
//       }
//     }
//   };

//   const handleDownloadPdf = async () => {
//     if (!isAuthenticated) {
//         setShowAuthDialog(true);
//         return;
//     }
//     if (!resumePreviewRef.current) return;
//     setIsDownloadingPdf(true);
//     try {
//       const htmlContent = resumePreviewRef.current.innerHTML;
//       await apiDownloadResume(htmlContent);
//     } catch (error) {
//       setPageError('Failed to download PDF.');
//     } finally {
//       setIsDownloadingPdf(false);
//     }
//   };

//   const handlePreviewPage = () => {
//     const targetPath = mode === 'create' 
//       ? `/resume/view/${newResumeTemplateId}` 
//       : `/resume/saved/view/${existingResumeId}`;
    
//     navigate(targetPath, {
//         state: { 
//             formData: editorFormData, 
//             resumeName: editableResumeName,
//             spacingMultiplier: spacingMultiplier
//         } 
//     });
//   };
  
//   const handleEnhanceField = async (fieldPath, textToEnhance, jobContext) => {
//       if (!textToEnhance || textToEnhance.trim() === '') {
//           setFeedbackDetailsForDialog({ title: 'Cannot Enhance', message: 'Please enter some text before using AI enhancement.', type: 'error' });
//           setShowFeedbackDialog(true);
//           return;
//       }
//       setIsEnhancing(true);
//       setActiveEnhancementInfo({ path: fieldPath, originalText: textToEnhance });
//       try {
//           const suggestions = await enhanceResumeField(textToEnhance, jobContext);
//           setEnhancementSuggestions(suggestions);
//       } catch (error) {
//           setFeedbackDetailsForDialog({ title: 'AI Enhancement Failed', message: error.message, type: 'error' });
//           setShowFeedbackDialog(true);
//       } finally {
//           setIsEnhancing(false);
//       }
//   };

//   const handleAcceptSuggestion = (suggestionText) => {
//     if (activeEnhancementInfo.path) {
//         const arrayMatch = activeEnhancementInfo.path.match(/^(.*)\[(\d+)\]\.(.*)$/);
//         if (arrayMatch) {
//             const [, arrayName, itemIndex, fieldName] = arrayMatch;
//             handleArrayItemChange(arrayName, parseInt(itemIndex, 10), fieldName, suggestionText);
//         } else {
//             handleSimpleChange(activeEnhancementInfo.path, suggestionText);
//         }
//     }
//     setEnhancementSuggestions(null);
//     setActiveEnhancementInfo({ path: null, originalText: '' });
//   };
  
//   const handleDialogClose = (isOpen) => !isOpen && setShowFeedbackDialog(false);
  
//   const isInitiallyLoading = pageIsLoading || isAuthLoading || isLoadingTemplates || (mode === 'edit' && isLoadingCurrentResume);

//   if (isInitiallyLoading) {
//     return <div className="flex items-center justify-center min-h-screen bg-background"><LoadingSpinner size="large" label="Preparing Editor..." /></div>;
//   }
  
//   if (pageError) {
//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
//             <Alert variant="destructive" className="max-w-lg w-full">
//             <AlertCircle className="h-5 w-5" /><AlertTitle>Error Loading Editor</AlertTitle><AlertDescription>{pageError}</AlertDescription>
//             </Alert>
//             <Button variant="outline" onClick={() => window.location.reload()} className="mt-6"><RefreshCw className="mr-2 h-4 w-4" /> Try Again</Button>
//     </div>
//     );
//   }

//   const seoTitle = mode === 'edit' ? `${editableResumeName || "Edit Resume"} | CareerForge Editor` : `Create ${currentTemplateForEditor?.templateName || "New Resume"} | CareerForge Editor`;

//   return (
//     <>
//       <Helmet><title>{seoTitle}</title></Helmet>
//       <div className="flex flex-col min-h-screen bg-muted/20 dark:bg-background text-foreground">
//         <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border shadow-sm px-2 sm:px-4 py-2.5">
//           <div className="container mx-auto flex items-center justify-between gap-1 sm:gap-2">
//             <div className="flex items-center gap-1 sm:gap-2 flex-shrink min-w-0">
//               <Button variant="ghost" size="icon" onClick={() => navigate(existingResumeId ? '/dashboard' : '/templates')} aria-label="Go back" className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
//                 <ArrowLeft size={18} />
//               </Button>
//               <div className="flex items-center gap-1.5 min-w-0 relative group">
//                 <Input
//                     value={editableResumeName}
//                     onChange={handleResumeNameChange}
//                     placeholder="Untitled Resume"
//                     className="text-sm sm:text-base font-semibold p-1 h-9 border-transparent hover:border-input focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-muted truncate bg-transparent max-w-[120px] xs:max-w-[150px] sm:max-w-[200px] md:max-w-xs pr-6"
//                     aria-label="Resume Name"
//                    />
//                    <Edit2 size={12} className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-hover:text-primary transition-colors"/>
//               </div>
//             </div>
//             <div className="text-xs text-muted-foreground truncate hidden lg:block mx-4 flex-grow text-center">
//                 Using Template: <span className="font-medium text-foreground">{currentTemplateForEditor?.templateName || 'Loading...'}</span>
//             </div>
//             <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
//               <Button variant="outline" size="sm" onClick={handlePreviewPage} className="border-border text-xs sm:text-sm h-8 px-2 sm:px-3"><Eye size={14} className="sm:mr-1.5" /> <span className="hidden sm:inline">Preview</span></Button>
//               <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={isDownloadingPdf || isSavingResume} className="border-border text-xs sm:text-sm h-8 px-2 sm:px-3">
//                 {isDownloadingPdf ? <Loader2 size={14} className="animate-spin sm:mr-1.5" /> : <Download size={14} className="sm:mr-1.5" />} <span className="hidden sm:inline">{isDownloadingPdf ? '...' : 'PDF'}</span>
//               </Button>
//               <Button size="sm" onClick={handleSaveResume} disabled={isSavingResume || isLoadingCurrentResume} className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm h-8 px-2 sm:px-3">
//                 {isSavingResume ? <Loader2 size={14} className="animate-spin sm:mr-1.5" /> : <Save size={14} className="sm:mr-1.5" />} <span className="hidden sm:inline">{isSavingResume ? 'Saving...' : (mode === 'create' ? 'Save' : 'Update')}</span>
//               </Button>
//             </div>
//           </div>
//         </header>

//         <main className="flex-grow container mx-auto px-1 sm:px-2 md:px-4 py-3 md:py-4">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 items-start">
//             <motion.div 
//               initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} 
//               className="lg:sticky lg:top-[75px] h-fit lg:col-span-5"
//             >
//               <Card className="bg-card border-border shadow-xl">
//                 <CardContent className="p-0 max-h-[calc(100vh-100px)] overflow-y-auto">
//                   <Suspense fallback={<div className="p-6 min-h-[400px] flex items-center justify-center"><LoadingSpinner label="Loading form..." /></div>}>
//                     <ResumeForm
//                       templateFieldDefinition={currentTemplateForEditor?.templateFieldDefinition || []}
//                       formData={editorFormData || {}}
//                       onFormChange={handleSimpleChange}
//                       onArrayChange={handleArrayItemChange}
//                       onAddItem={handleAddItemToArray}
//                       onRemoveItem={handleRemoveItemFromArray}
//                       onSectionToggle={handleSectionToggle}
//                       onEnhanceField={handleEnhanceField}
//                       isEnhancing={isEnhancing}
//                     />
//                   </Suspense>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             <motion.div 
//               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }} 
//               className="lg:sticky lg:top-[75px] h-fit lg:col-span-7"
//             >   
//               <div className="bg-card border rounded-b-none rounded-t-xl p-3 flex items-center gap-4 shadow-sm">
//                 <Label htmlFor="spacing-slider" className="text-sm font-medium text-muted-foreground whitespace-nowrap">Spacing</Label>
//                 <Slider
//                   id="spacing-slider"
//                   min={0.8}
//                   max={1.5}
//                   step={0.05}
//                   value={[spacingMultiplier]}
//                   onValueChange={(value) => setSpacingMultiplier(value[0])}
//                   className="w-full"
//                 />
//                 <span className="text-sm font-mono text-foreground w-12 text-center">{spacingMultiplier.toFixed(2)}x</span>
//               </div>

//               <Suspense fallback={<div className="flex justify-center items-center min-h-[calc(100vh-100px)] bg-muted/20 rounded-xl border border-border"><LoadingSpinner label="Loading preview..." /></div>}>
//                 <ResumePreview
//                   ref={resumePreviewRef}
//                   templateCode={currentTemplateForEditor?.templateCode || ''}
//                   currentFormData={editorFormData || {}}
//                   spacingMultiplier={spacingMultiplier} 
//                 />
//               </Suspense>
//             </motion.div>
//           </div>
//         </main>
//       </div>

//       <Dialog open={showFeedbackDialog} onOpenChange={handleDialogClose}>
//         <DialogContent className="sm:max-w-md bg-card">
//           <DialogHeader><DialogTitle className={cn("flex items-center text-lg font-semibold", feedbackDetailsForDialog.type === 'success' ? "text-green-600" : "text-destructive")}>
//               {feedbackDetailsForDialog.type === 'success' ? <CheckCircle2 className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
//               {feedbackDetailsForDialog.title}
//           </DialogTitle></DialogHeader>
//           <DialogDescription className="py-4 text-muted-foreground">{feedbackDetailsForDialog.message}</DialogDescription>
//           <DialogFooter className="sm:justify-end"><DialogClose asChild><Button type="button">Close</Button></DialogClose></DialogFooter>
//         </DialogContent>
//       </Dialog>
      
//       <EnhancementDialog
//             suggestions={enhancementSuggestions}
//             originalText={activeEnhancementInfo.originalText}
//             onAccept={handleAcceptSuggestion}
//             onOpenChange={() => setEnhancementSuggestions(null)} 
//       />

//       <AuthDialog 
//         open={showAuthDialog} 
//         onOpenChange={setShowAuthDialog}
//       />
//     </>
//   );
// };

// export default ResumeEditorPage;


// import React, { useEffect, useState, useCallback, useRef, Suspense, useMemo } from "react";
// import { Helmet } from "react-helmet-async";
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { get, set, cloneDeep } from 'lodash';

// // UI Components & Icons
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Slider } from "@/components/ui/slider";
// import { Label } from "@/components/ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { Eye, Download, Save, ArrowLeft, Loader2, AlertCircle, RefreshCw, Edit2, CheckCircle2 } from "lucide-react";
// import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
// import EnhancementDialog from '@/components/Resume/EnhancementDialog'

// // Custom Components (Lazy Loaded)
// const ResumePreview = React.lazy(() => import("@/components/Resume/ResumePreview"));
// const ResumeForm = React.lazy(() => import("@/components/Resume/ResumeForm"));

// // Hooks & Contexts
// import useAuthContext from "@/hooks/useAuth";
// import useTemplateContext from "@/hooks/useTemplate";
// import useResumeContext from "@/hooks/useResume";

// // API & Utilities
// import { downloadResume as apiDownloadResume, enhanceResumeField } from "@/api/resumeServiceApi";
// import { cn } from "@/lib/utils";
// import AuthDialog from '@/components/Auth/AuthDialog.jsx';

// // Helper function to initialize form data based on template definitions
// const initializeFormDataFromDefinitions = (definitions, selectedIndustry) => {
//   const content = {};
//   const sectionsConfig = {};

//   if (!Array.isArray(definitions)) {
//     return { content, sectionsConfig };
//   }

//   // 1. Group fields and find metadata for each unique section
//   const uniqueSections = definitions.reduce((acc, field) => {
//     if (field.section && !acc[field.section]) {
//       const sectionDef = definitions.find(def => def.section === field.section && (def.isCore !== undefined || def.recommendedFor));
//       acc[field.section] = {
//         isCore: sectionDef?.isCore || false,
//         recommendedFor: sectionDef?.recommendedFor || null,
//         isToggleable: definitions.some(def => def.section === field.section && def.type === 'group' && def.repeatable)
//       };
//     }
//     return acc;
//   }, {});

//   // 2. Build the sectionsConfig with the corrected logic
//   for (const sectionKey in uniqueSections) {
//     const { isCore, recommendedFor, isToggleable } = uniqueSections[sectionKey];
    
//     if (isToggleable) {
//       // Default to disabled and enable only if a condition is met
//       let isEnabled = false; 

//       if (isCore) {
//         // Condition 1: Core sections are always enabled.
//         isEnabled = true;
//       } else if (!selectedIndustry) {
//         // Condition 2: If NO industry is selected, enable all toggleable sections by default.
//         isEnabled = true;
//       } else {
//         // Condition 3: An industry IS selected.
//         if (!recommendedFor) {
//           // It's a generic, non-core section (like 'Interests'), so enable it.
//           isEnabled = true;
//         } else {
//           // It has industry recommendations. Enable ONLY if it's a match.
//           isEnabled = recommendedFor.includes(selectedIndustry);
//         }
//       }
//       sectionsConfig[sectionKey] = { enabled: isEnabled };
//     }
//   }

//   // 3. Populate the 'content' object with default values
//   definitions.forEach(fieldDef => {
//     const keys = fieldDef.name.split('.');
//     let currentLevel = content;
//     keys.forEach((key, index) => {
//       if (index === keys.length - 1) {
//         if (fieldDef.type === 'group' && fieldDef.repeatable) {
//           currentLevel[key] = [];
//         } else {
//           currentLevel[key] = fieldDef.defaultValue ?? '';
//         }
//       } else {
//         currentLevel[key] = currentLevel[key] || {};
//         currentLevel = currentLevel[key];
//       }
//     });
//   });

//   return { content, sectionsConfig };
// };


// const ResumeEditorPage = () => {
//   const { newResumeTemplateId, existingResumeId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const resumePreviewRef = useRef();

//   const { isAuthenticated, isLoading: isAuthLoading } = useAuthContext();
//   const {
//     templates: allTemplates,
//     getAllTemplates,
//     isLoadingTemplates
//   } = useTemplateContext();

//   const {
//     currentResumeDetail,
//     editorFormData,
//     setEditorFormData,
//     isSavingResume,
//     resumeError,
//     loadResumeForEditor,
//     prepareNewResumeForEditor,
//     saveOrUpdateCurrentResume,
//     clearCurrentEditorData,
//     isLoadingCurrentResume
//   } = useResumeContext();

//   const [mode, setMode] = useState(null);
//   const [pageIsLoading, setPageIsLoading] = useState(true);
//   const [pageError, setPageError] = useState(null);
//   const [currentTemplateForEditor, setCurrentTemplateForEditor] = useState(null);
//   const [editableResumeName, setEditableResumeName] = useState('');
//   const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
//   const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
//   const [feedbackDetailsForDialog, setFeedbackDetailsForDialog] = useState({ title: '', message: '', type: 'success' });
//   const [spacingMultiplier, setSpacingMultiplier] = useState(1);
//   const [showAuthDialog, setShowAuthDialog] = useState(false);
//   const [isEnhancing, setIsEnhancing] = useState(false);
//   const [enhancementSuggestions, setEnhancementSuggestions] = useState(null);
//   const [activeEnhancementInfo, setActiveEnhancementInfo] = useState({ path: null, originalText: '' });
  
//   useEffect(() => {
//     const setupPage = async () => {
//       if (isAuthLoading) return;

//       setPageIsLoading(true);
//       setPageError(null);
//       try {
//         if (existingResumeId) {
//           setMode('edit');
//           const loadedResume = await loadResumeForEditor(existingResumeId);
//           if (!loadedResume) throw new Error("Failed to load your resume.");
          
//           if (!loadedResume.resumeData.content || !loadedResume.resumeData.sectionsConfig) {
//               console.warn("Older data format detected. Migrating to new structure.");
//               const migratedData = {
//                   content: loadedResume.resumeData,
//                   sectionsConfig: initializeFormDataFromDefinitions(loadedResume.templateId.templateFieldDefinition, null).sectionsConfig
//               };
//               setEditorFormData(migratedData);
//           } else {
//               setEditorFormData(loadedResume.resumeData);
//           }
          
//           setCurrentTemplateForEditor(loadedResume.templateId);
//           setEditableResumeName(loadedResume.resumeName || 'Untitled Resume');
//           setSpacingMultiplier(loadedResume.spacingMultiplier || 1);
          
//         } else if (newResumeTemplateId) {
//           const queryParams = new URLSearchParams(location.search);
//           const selectedIndustry = queryParams.get('industry');

//           const isReturningFromPreview = currentResumeDetail?.templateId?._id === newResumeTemplateId && editorFormData?.content;

//           if (!isReturningFromPreview) {
//             setMode('create');
//             let templates = allTemplates.length > 0 ? allTemplates : await getAllTemplates();
//             const targetTemplate = templates.find(t => t._id === newResumeTemplateId);
//             if (!targetTemplate) throw new Error(`Template with ID ${newResumeTemplateId} not found.`);
            
//             setCurrentTemplateForEditor(targetTemplate);
            
//             prepareNewResumeForEditor(targetTemplate); 
            
//             const initialData = initializeFormDataFromDefinitions(targetTemplate.templateFieldDefinition, selectedIndustry);
//             setEditorFormData(initialData);

//             const nameSuffix = selectedIndustry ? `${targetTemplate.templateName} - ${selectedIndustry}` : (targetTemplate.templateName || 'Resume');
//             setEditableResumeName(`My New ${nameSuffix}`);

//           } else {
//               setMode('create');
//               setCurrentTemplateForEditor(currentResumeDetail.templateId);
//               setEditableResumeName(editableResumeName || `My New ${currentResumeDetail.templateId.templateName || 'Resume'}`);
//           }
//         } else {
//           throw new Error("Invalid page access.");
//         }
//       } catch (err) {
//         setPageError(err.message);
//       } finally {
//         setPageIsLoading(false);
//       }
//     };
    
//     setupPage();
    
//   }, [existingResumeId, newResumeTemplateId, isAuthenticated, isAuthLoading, location.search]);

//   useEffect(() => {
//     return () => {
//       if (!window.location.pathname.startsWith('/resume/')) {
//         clearCurrentEditorData();
//       }
//     };
//   }, [location.pathname, clearCurrentEditorData]);

//   useEffect(() => {
//     if (resumeError && isSavingResume) {
//       setFeedbackDetailsForDialog({ title: 'Operation Failed', message: resumeError.message || 'An unexpected error occurred.', type: 'error' });
//       setShowFeedbackDialog(true);
//     }
//   }, [resumeError, isSavingResume]);

//   const handleSimpleChange = useCallback((fieldPath, value) => {
//     setEditorFormData(prevData => {
//         const newData = cloneDeep(prevData);
//         set(newData, `content.${fieldPath}`, value);
//         return newData;
//     });
//   }, [setEditorFormData]);

//   const handleArrayItemChange = useCallback((arrayPath, itemIndex, fieldName, value) => {
//     setEditorFormData(prevData => {
//         const newData = cloneDeep(prevData);
//         const itemPath = `content.${arrayPath}[${itemIndex}].${fieldName}`;
//         set(newData, itemPath, value);
//         return newData;
//     });
//   }, [setEditorFormData]);

//   const handleAddItemToArray = useCallback((arrayPath, defaultItem = {}) => {
//     setEditorFormData(prevData => {
//         const newData = cloneDeep(prevData);
//         const currentArray = get(newData, `content.${arrayPath}`, []);
//         currentArray.push(cloneDeep(defaultItem));
//         set(newData, `content.${arrayPath}`, currentArray);
//         return newData;
//     });
//   }, [setEditorFormData]);

//   const handleRemoveItemFromArray = useCallback((arrayPath, index) => {
//     setEditorFormData(prevData => {
//         const newData = cloneDeep(prevData);
//         const currentArray = get(newData, `content.${arrayPath}`, []);
//         currentArray.splice(index, 1);
//         set(newData, `content.${arrayPath}`, currentArray);
//         return newData;
//     });
//   }, [setEditorFormData]);

//   const handleSectionToggle = useCallback((sectionKey) => {
//     setEditorFormData(prevData => {
//         const newData = cloneDeep(prevData);
//         const currentStatus = get(newData, `sectionsConfig.${sectionKey}.enabled`, false);
//         set(newData, `sectionsConfig.${sectionKey}.enabled`, !currentStatus);
//         return newData;
//     });
//   }, [setEditorFormData]);


//   const handleResumeNameChange = (e) => setEditableResumeName(e.target.value);

//   const handleSaveResume = async () => {
//     if (!isAuthenticated) {
//         setShowAuthDialog(true);
//         return;
//     }
//     const savedResult = await saveOrUpdateCurrentResume(editorFormData, editableResumeName.trim(), spacingMultiplier);
//     if (savedResult?._id) {
//       setFeedbackDetailsForDialog({ title: 'Success!', message: 'Resume saved successfully!', type: 'success' });
//       setShowFeedbackDialog(true);
//       if (mode === 'create') {
//         navigate(`/resume/edit/${savedResult._id}`, { replace: true });
//       }
//     }
//   };

//   const handleDownloadPdf = async () => {
//     if (!isAuthenticated) {
//         setShowAuthDialog(true);
//         return;
//     }
//     if (!resumePreviewRef.current) return;
//     setIsDownloadingPdf(true);
//     try {
//       const htmlContent = resumePreviewRef.current.innerHTML;
//       await apiDownloadResume(htmlContent);
//     } catch (error) {
//       setPageError('Failed to download PDF.');
//     } finally {
//       setIsDownloadingPdf(false);
//     }
//   };

//   const handlePreviewPage = () => {
//     const targetPath = mode === 'create' 
//       ? `/resume/view/${newResumeTemplateId}` 
//       : `/resume/saved/view/${existingResumeId}`;
    
//     navigate(targetPath, {
//         state: { 
//             formData: editorFormData, 
//             resumeName: editableResumeName,
//             spacingMultiplier: spacingMultiplier
//         } 
//     });
//   };
  
//   const handleEnhanceField = async (fieldPath, textToEnhance, jobContext) => {
//       if (!textToEnhance || textToEnhance.trim() === '') {
//           setFeedbackDetailsForDialog({ title: 'Cannot Enhance', message: 'Please enter some text before using AI enhancement.', type: 'error' });
//           setShowFeedbackDialog(true);
//           return;
//       }
//       setIsEnhancing(true);
//       setActiveEnhancementInfo({ path: fieldPath, originalText: textToEnhance });
//       try {
//           const suggestions = await enhanceResumeField(textToEnhance, jobContext);
//           setEnhancementSuggestions(suggestions);
//       } catch (error) {
//           setFeedbackDetailsForDialog({ title: 'AI Enhancement Failed', message: error.message, type: 'error' });
//           setShowFeedbackDialog(true);
//       } finally {
//           setIsEnhancing(false);
//       }
//   };

//   const handleAcceptSuggestion = (suggestionText) => {
//     if (activeEnhancementInfo.path) {
//         const arrayMatch = activeEnhancementInfo.path.match(/^(.*)\[(\d+)\]\.(.*)$/);
//         if (arrayMatch) {
//             const [, arrayName, itemIndex, fieldName] = arrayMatch;
//             handleArrayItemChange(arrayName, parseInt(itemIndex, 10), fieldName, suggestionText);
//         } else {
//             handleSimpleChange(activeEnhancementInfo.path, suggestionText);
//         }
//     }
//     setEnhancementSuggestions(null);
//     setActiveEnhancementInfo({ path: null, originalText: '' });
//   };
  
//   const handleDialogClose = (isOpen) => !isOpen && setShowFeedbackDialog(false);
  
//   // --- START: PROGRESS BAR CALCULATION ---
//   const progressData = useMemo(() => {
//     const definitions = currentTemplateForEditor?.templateFieldDefinition;
//     if (!definitions || !editorFormData?.content) {
//       return { completed: 0, total: 0, progress: 0 };
//     }

//     const sections = definitions.reduce((acc, field) => {
//       acc[field.section] = acc[field.section] || [];
//       acc[field.section].push(field);
//       return acc;
//     }, {});
//     const sectionKeys = Object.keys(sections);
//     const sectionsConfig = editorFormData.sectionsConfig || {};

//     const activeSections = sectionKeys.filter(key => {
//       const isToggleable = sectionsConfig[key] !== undefined;
//       return !isToggleable || sectionsConfig[key].enabled;
//     });

//     let completedCount = 0;
//     activeSections.forEach(sectionKey => {
//       const fields = sections[sectionKey];
//       let isSectionCompleted = false;

//       for (const field of fields) {
//         if (field.type === 'group' && field.repeatable) {
//           const items = get(editorFormData.content, field.name, []);
//           if (items.length > 0) {
//             isSectionCompleted = true;
//             break;
//           }
//         } else {
//           const value = get(editorFormData.content, field.name, '');
//           if (typeof value === 'string' && value.trim() !== '') {
//             isSectionCompleted = true;
//             break;
//           }
//         }
//       }

//       if (isSectionCompleted) {
//         completedCount++;
//       }
//     });

//     const total = activeSections.length;
//     const progress = total > 0 ? (completedCount / total) * 100 : 0;

//     return { completed: completedCount, total, progress };
//   }, [editorFormData, currentTemplateForEditor]);
//   // --- END: PROGRESS BAR CALCULATION ---

//   const isInitiallyLoading = pageIsLoading || isAuthLoading || isLoadingTemplates || (mode === 'edit' && isLoadingCurrentResume);

//   if (isInitiallyLoading) {
//     return <div className="flex items-center justify-center min-h-screen bg-background"><LoadingSpinner size="large" label="Preparing Editor..." /></div>;
//   }
  
//   if (pageError) {
//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
//             <Alert variant="destructive" className="max-w-lg w-full">
//             <AlertCircle className="h-5 w-5" /><AlertTitle>Error Loading Editor</AlertTitle><AlertDescription>{pageError}</AlertDescription>
//             </Alert>
//             <Button variant="outline" onClick={() => window.location.reload()} className="mt-6"><RefreshCw className="mr-2 h-4 w-4" /> Try Again</Button>
//     </div>
//     );
//   }

//   const seoTitle = mode === 'edit' ? `${editableResumeName || "Edit Resume"} | CareerForge Editor` : `Create ${currentTemplateForEditor?.templateName || "New Resume"} | CareerForge Editor`;

//   return (
//     <>
//       <Helmet><title>{seoTitle}</title></Helmet>
//       <div className="flex flex-col min-h-screen bg-muted/20 dark:bg-background text-foreground">
//         <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border shadow-sm px-2 sm:px-4 py-2.5">
//           <div className="container mx-auto">
//             <div className="flex items-center justify-between gap-1 sm:gap-2">
//               <div className="flex items-center gap-1 sm:gap-2 flex-shrink min-w-0">
//                 <Button variant="ghost" size="icon" onClick={() => navigate(existingResumeId ? '/dashboard' : '/templates')} aria-label="Go back" className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
//                   <ArrowLeft size={18} />
//                 </Button>
//                 <div className="flex items-center gap-1.5 min-w-0 relative group">
//                   <Input
//                       value={editableResumeName}
//                       onChange={handleResumeNameChange}
//                       placeholder="Untitled Resume"
//                       className="text-sm sm:text-base font-semibold p-1 h-9 border-transparent hover:border-input focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-muted truncate bg-transparent max-w-[120px] xs:max-w-[150px] sm:max-w-[200px] md:max-w-xs pr-6"
//                       aria-label="Resume Name"
//                      />
//                      <Edit2 size={12} className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-hover:text-primary transition-colors"/>
//                 </div>
//               </div>
//               <div className="text-xs text-muted-foreground truncate hidden lg:block mx-4 flex-grow text-center">
//                   Using Template: <span className="font-medium text-foreground">{currentTemplateForEditor?.templateName || 'Loading...'}</span>
//               </div>
//               <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
//                 <Button variant="outline" size="sm" onClick={handlePreviewPage} className="border-border text-xs sm:text-sm h-8 px-2 sm:px-3"><Eye size={14} className="sm:mr-1.5" /> <span className="hidden sm:inline">Preview</span></Button>
//                 <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={isDownloadingPdf || isSavingResume} className="border-border text-xs sm:text-sm h-8 px-2 sm:px-3">
//                   {isDownloadingPdf ? <Loader2 size={14} className="animate-spin sm:mr-1.5" /> : <Download size={14} className="sm:mr-1.5" />} <span className="hidden sm:inline">{isDownloadingPdf ? '...' : 'PDF'}</span>
//                 </Button>
//                 <Button size="sm" onClick={handleSaveResume} disabled={isSavingResume || isLoadingCurrentResume} className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm h-8 px-2 sm:px-3">
//                   {isSavingResume ? <Loader2 size={14} className="animate-spin sm:mr-1.5" /> : <Save size={14} className="sm:mr-1.5" />} <span className="hidden sm:inline">{isSavingResume ? 'Saving...' : (mode === 'create' ? 'Save' : 'Update')}</span>
//                 </Button>
//               </div>
//             </div>
//             {/* --- START: PROGRESS BAR UI --- */}
//             <div className="mt-2.5 px-1">
//                 <div className="flex justify-between items-center mb-1">
//                     <p className="text-xs font-medium text-muted-foreground">Resume Progress</p>
//                     <p className="text-xs font-semibold text-foreground">{progressData.completed} / {progressData.total} sections</p>
//                 </div>
//                 <div className="w-full bg-muted rounded-full h-1.5">
//                     <div 
//                         className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-in-out" 
//                         style={{ width: `${progressData.progress}%` }}
//                         aria-valuenow={progressData.progress}
//                         aria-valuemin="0"
//                         aria-valuemax="100"
//                         role="progressbar"
//                         aria-label="Resume completion progress"
//                     ></div>
//                 </div>
//             </div>
//             {/* --- END: PROGRESS BAR UI --- */}
//           </div>
//         </header>

//         <main className="flex-grow container mx-auto px-1 sm:px-2 md:px-4 py-3 md:py-4">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 items-start">
//             <motion.div 
//               initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} 
//               className="lg:sticky lg:top-[100px] h-fit lg:col-span-5"
//             >
//               <Card className="bg-card border-border shadow-xl">
//                 <CardContent className="p-0 max-h-[calc(100vh-125px)] overflow-y-auto">
//                   <Suspense fallback={<div className="p-6 min-h-[400px] flex items-center justify-center"><LoadingSpinner label="Loading form..." /></div>}>
//                     <ResumeForm
//                       templateFieldDefinition={currentTemplateForEditor?.templateFieldDefinition || []}
//                       formData={editorFormData || {}}
//                       onFormChange={handleSimpleChange}
//                       onArrayChange={handleArrayItemChange}
//                       onAddItem={handleAddItemToArray}
//                       onRemoveItem={handleRemoveItemFromArray}
//                       onSectionToggle={handleSectionToggle}
//                       onEnhanceField={handleEnhanceField}
//                       isEnhancing={isEnhancing}
//                     />
//                   </Suspense>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             <motion.div 
//               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }} 
//               className="lg:sticky lg:top-[75px] h-fit lg:col-span-7"
//             >   
//               <div className="bg-card border rounded-b-none rounded-t-xl p-3 flex items-center gap-4 shadow-sm">
//                 <Label htmlFor="spacing-slider" className="text-sm font-medium text-muted-foreground whitespace-nowrap">Spacing</Label>
//                 <Slider
//                   id="spacing-slider"
//                   min={0.8}
//                   max={1.5}
//                   step={0.05}
//                   value={[spacingMultiplier]}
//                   onValueChange={(value) => setSpacingMultiplier(value[0])}
//                   className="w-full"
//                 />
//                 <span className="text-sm font-mono text-foreground w-12 text-center">{spacingMultiplier.toFixed(2)}x</span>
//               </div>

//               <Suspense fallback={<div className="flex justify-center items-center min-h-[calc(100vh-100px)] bg-muted/20 rounded-xl border border-border"><LoadingSpinner label="Loading preview..." /></div>}>
//                 <ResumePreview
//                   ref={resumePreviewRef}
//                   templateCode={currentTemplateForEditor?.templateCode || ''}
//                   currentFormData={editorFormData || {}}
//                   spacingMultiplier={spacingMultiplier} 
//                 />
//               </Suspense>
//             </motion.div>
//           </div>
//         </main>
//       </div>

//       <Dialog open={showFeedbackDialog} onOpenChange={handleDialogClose}>
//         <DialogContent className="sm:max-w-md bg-card">
//           <DialogHeader><DialogTitle className={cn("flex items-center text-lg font-semibold", feedbackDetailsForDialog.type === 'success' ? "text-green-600" : "text-destructive")}>
//               {feedbackDetailsForDialog.type === 'success' ? <CheckCircle2 className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
//               {feedbackDetailsForDialog.title}
//           </DialogTitle></DialogHeader>
//           <DialogDescription className="py-4 text-muted-foreground">{feedbackDetailsForDialog.message}</DialogDescription>
//           <DialogFooter className="sm:justify-end"><DialogClose asChild><Button type="button">Close</Button></DialogClose></DialogFooter>
//         </DialogContent>
//       </Dialog>
      
//       <EnhancementDialog
//             suggestions={enhancementSuggestions}
//             originalText={activeEnhancementInfo.originalText}
//             onAccept={handleAcceptSuggestion}
//             onOpenChange={() => setEnhancementSuggestions(null)} 
//       />

//       <AuthDialog 
//         open={showAuthDialog} 
//         onOpenChange={setShowAuthDialog}
//       />
//     </>
//   );
// };

// export default ResumeEditorPage;


import React, { useEffect, useState, useCallback, useRef, Suspense, useMemo } from "react";
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
import { Eye, Download, Save, ArrowLeft, Loader2, AlertCircle, RefreshCw, Edit2, CheckCircle2 } from "lucide-react";
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
import { downloadResume as apiDownloadResume, enhanceResumeField } from "@/api/resumeServiceApi";
import { cn } from "@/lib/utils";
import AuthDialog from '@/components/Auth/AuthDialog.jsx';

// Helper function to initialize form data based on template definitions
const initializeFormDataFromDefinitions = (definitions, selectedIndustry) => {
  const content = {};
  const sectionsConfig = {};

  if (!Array.isArray(definitions)) {
    return { content, sectionsConfig };
  }

  // 1. Group fields and find metadata for each unique section
  const uniqueSections = definitions.reduce((acc, field) => {
    if (field.section && !acc[field.section]) {
      const sectionDef = definitions.find(def => def.section === field.section && (def.isCore !== undefined || def.recommendedFor));
      acc[field.section] = {
        isCore: sectionDef?.isCore || false,
        recommendedFor: sectionDef?.recommendedFor || null,
        isToggleable: definitions.some(def => def.section === field.section && def.type === 'group' && def.repeatable)
      };
    }
    return acc;
  }, {});

  // 2. Build the sectionsConfig with the corrected logic
  for (const sectionKey in uniqueSections) {
    const { isCore, recommendedFor, isToggleable } = uniqueSections[sectionKey];
    
    if (isToggleable) {
      let isEnabled = false; 

      if (isCore) {
        isEnabled = true;
      } else if (!selectedIndustry) {
        isEnabled = true;
      } else {
        if (!recommendedFor) {
          isEnabled = true;
        } else {
          isEnabled = recommendedFor.includes(selectedIndustry);
        }
      }
      sectionsConfig[sectionKey] = { enabled: isEnabled };
    }
  }

  // 3. Populate the 'content' object with default values
  definitions.forEach(fieldDef => {
    const keys = fieldDef.name.split('.');
    let currentLevel = content;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        if (fieldDef.type === 'group' && fieldDef.repeatable) {
          currentLevel[key] = [];
        } else {
          currentLevel[key] = fieldDef.defaultValue ?? '';
        }
      } else {
        currentLevel[key] = currentLevel[key] || {};
        currentLevel = currentLevel[key];
      }
    });
  });

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
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackDetailsForDialog, setFeedbackDetailsForDialog] = useState({ title: '', message: '', type: 'success' });
  const [spacingMultiplier, setSpacingMultiplier] = useState(1);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementSuggestions, setEnhancementSuggestions] = useState(null);
  const [activeEnhancementInfo, setActiveEnhancementInfo] = useState({ path: null, originalText: '' });
  
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'success'
  
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
          
          if (!loadedResume.resumeData.content || !loadedResume.resumeData.sectionsConfig) {
              console.warn("Older data format detected. Migrating to new structure.");
              const migratedData = {
                  content: loadedResume.resumeData,
                  sectionsConfig: initializeFormDataFromDefinitions(loadedResume.templateId.templateFieldDefinition, null).sectionsConfig
              };
              setEditorFormData(migratedData);
          } else {
              setEditorFormData(loadedResume.resumeData);
          }
          
          setCurrentTemplateForEditor(loadedResume.templateId);
          setEditableResumeName(loadedResume.resumeName || 'Untitled Resume');
          setSpacingMultiplier(loadedResume.spacingMultiplier || 1);
          
        } else if (newResumeTemplateId) {
          const queryParams = new URLSearchParams(location.search);
          const selectedIndustry = queryParams.get('industry');

          const isReturningFromPreview = currentResumeDetail?.templateId?._id === newResumeTemplateId && editorFormData?.content;

          if (!isReturningFromPreview) {
            setMode('create');
            let templates = allTemplates.length > 0 ? allTemplates : await getAllTemplates();
            const targetTemplate = templates.find(t => t._id === newResumeTemplateId);
            if (!targetTemplate) throw new Error(`Template with ID ${newResumeTemplateId} not found.`);
            
            setCurrentTemplateForEditor(targetTemplate);
            prepareNewResumeForEditor(targetTemplate); 
            const initialData = initializeFormDataFromDefinitions(targetTemplate.templateFieldDefinition, selectedIndustry);
            setEditorFormData(initialData);

            const nameSuffix = selectedIndustry ? `${targetTemplate.templateName} - ${selectedIndustry}` : (targetTemplate.templateName || 'Resume');
            setEditableResumeName(`My New ${nameSuffix}`);

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
    
  }, [existingResumeId, newResumeTemplateId, isAuthenticated, isAuthLoading, location.search]);

  useEffect(() => {
    return () => {
      if (!window.location.pathname.startsWith('/resume/')) {
        clearCurrentEditorData();
      }
    };
  }, [location.pathname, clearCurrentEditorData]);

  useEffect(() => {
    if (resumeError && saveStatus === 'saving') {
      setFeedbackDetailsForDialog({ title: 'Operation Failed', message: resumeError.message || 'An unexpected error occurred.', type: 'error' });
      setShowFeedbackDialog(true);
    }
  }, [resumeError, saveStatus]);

  const handleSimpleChange = useCallback((fieldPath, value) => {
    if (!isDirty) setIsDirty(true);
    setEditorFormData(prevData => {
        const newData = cloneDeep(prevData);
        set(newData, `content.${fieldPath}`, value);
        return newData;
    });
  }, [setEditorFormData, isDirty]);

  const handleArrayItemChange = useCallback((arrayPath, itemIndex, fieldName, value) => {
    if (!isDirty) setIsDirty(true);
    setEditorFormData(prevData => {
        const newData = cloneDeep(prevData);
        const itemPath = `content.${arrayPath}[${itemIndex}].${fieldName}`;
        set(newData, itemPath, value);
        return newData;
    });
  }, [setEditorFormData, isDirty]);

  const handleAddItemToArray = useCallback((arrayPath, defaultItem = {}) => {
    if (!isDirty) setIsDirty(true);
    setEditorFormData(prevData => {
        const newData = cloneDeep(prevData);
        const currentArray = get(newData, `content.${arrayPath}`, []);
        currentArray.push(cloneDeep(defaultItem));
        set(newData, `content.${arrayPath}`, currentArray);
        return newData;
    });
  }, [setEditorFormData, isDirty]);

  const handleRemoveItemFromArray = useCallback((arrayPath, index) => {
    if (!isDirty) setIsDirty(true);
    setEditorFormData(prevData => {
        const newData = cloneDeep(prevData);
        const currentArray = get(newData, `content.${arrayPath}`, []);
        currentArray.splice(index, 1);
        set(newData, `content.${arrayPath}`, currentArray);
        return newData;
    });
  }, [setEditorFormData, isDirty]);

  const handleSectionToggle = useCallback((sectionKey) => {
    if (!isDirty) setIsDirty(true);
    setEditorFormData(prevData => {
        const newData = cloneDeep(prevData);
        const currentStatus = get(newData, `sectionsConfig.${sectionKey}.enabled`, false);
        set(newData, `sectionsConfig.${sectionKey}.enabled`, !currentStatus);
        return newData;
    });
  }, [setEditorFormData, isDirty]);


  const handleResumeNameChange = (e) => {
      if (!isDirty) setIsDirty(true);
      setEditableResumeName(e.target.value);
  };

  const handleSpacingChange = (value) => {
    if (!isDirty) setIsDirty(true);
    setSpacingMultiplier(value[0]);
  };

  const handleSaveResume = async () => {
    if (!isAuthenticated) {
        setShowAuthDialog(true);
        return;
    }
    setSaveStatus('saving');
    const savedResult = await saveOrUpdateCurrentResume(editorFormData, editableResumeName.trim(), spacingMultiplier);
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
            resumeName: editableResumeName,
            spacingMultiplier: spacingMultiplier
        } 
    });
  };
  
  const handleEnhanceField = async (fieldPath, textToEnhance, jobContext) => {
      if (!textToEnhance || textToEnhance.trim() === '') {
          setFeedbackDetailsForDialog({ title: 'Cannot Enhance', message: 'Please enter some text before using AI enhancement.', type: 'error' });
          setShowFeedbackDialog(true);
          return;
      }
      setIsEnhancing(true);
      setActiveEnhancementInfo({ path: fieldPath, originalText: textToEnhance });
      try {
          const suggestions = await enhanceResumeField(textToEnhance, jobContext);
          setEnhancementSuggestions(suggestions);
      } catch (error) {
          setFeedbackDetailsForDialog({ title: 'AI Enhancement Failed', message: error.message, type: 'error' });
          setShowFeedbackDialog(true);
      } finally {
          setIsEnhancing(false);
      }
  };

  const handleAcceptSuggestion = (suggestionText) => {
    if (activeEnhancementInfo.path) {
        const arrayMatch = activeEnhancementInfo.path.match(/^(.*)\[(\d+)\]\.(.*)$/);
        if (arrayMatch) {
            const [, arrayName, itemIndex, fieldName] = arrayMatch;
            handleArrayItemChange(arrayName, parseInt(itemIndex, 10), fieldName, suggestionText);
        } else {
            handleSimpleChange(activeEnhancementInfo.path, suggestionText);
        }
    }
    setEnhancementSuggestions(null);
    setActiveEnhancementInfo({ path: null, originalText: '' });
  };
  
  const handleDialogClose = (isOpen) => !isOpen && setShowFeedbackDialog(false);
  
  const progressData = useMemo(() => {
    const definitions = currentTemplateForEditor?.templateFieldDefinition;
    if (!definitions || !editorFormData?.content) {
      return { completed: 0, total: 0, progress: 0 };
    }

    const sections = definitions.reduce((acc, field) => {
      acc[field.section] = acc[field.section] || [];
      acc[field.section].push(field);
      return acc;
    }, {});
    const sectionKeys = Object.keys(sections);
    const sectionsConfig = editorFormData.sectionsConfig || {};

    const activeSections = sectionKeys.filter(key => {
      const isToggleable = sectionsConfig[key] !== undefined;
      return !isToggleable || sectionsConfig[key].enabled;
    });

    let completedCount = 0;
    activeSections.forEach(sectionKey => {
      const fields = sections[sectionKey];
      let isSectionCompleted = false;
      for (const field of fields) {
        if (field.type === 'group' && field.repeatable) {
          const items = get(editorFormData.content, field.name, []);
          if (items.length > 0) { isSectionCompleted = true; break; }
        } else {
          const value = get(editorFormData.content, field.name, '');
          if (typeof value === 'string' && value.trim() !== '') { isSectionCompleted = true; break; }
        }
      }
      if (isSectionCompleted) { completedCount++; }
    });

    const total = activeSections.length;
    const progress = total > 0 ? (completedCount / total) * 100 : 0;
    return { completed: completedCount, total, progress };
  }, [editorFormData, currentTemplateForEditor]);

  // --- NEW: DYNAMIC PROGRESS BAR COLOR CALCULATION ---
  const progressBarColor = useMemo(() => {
    const { progress } = progressData;
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-600';
    if (progress >= 50) return 'bg-sky-500';
    if (progress >= 25) return 'bg-yellow-400';
    return 'bg-amber-400';
  }, [progressData]);

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
        {/* --- NEW COMPACT & DYNAMIC HEADER --- */}
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border shadow-sm px-2 sm:px-4 py-2.5">
          <div className="container mx-auto flex items-center justify-between gap-4">
            {/* Left Side: Identity & Status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigate(existingResumeId ? '/dashboard' : '/templates')} aria-label="Go back" className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:bg-accent hover:text-accent-foreground flex-shrink-0">
                  <ArrowLeft size={18} />
                </Button>
                <div className="flex items-center gap-1.5 min-w-0 relative group">
                  <Input
                      value={editableResumeName}
                      onChange={handleResumeNameChange}
                      placeholder="Untitled Resume"
                      className="text-base sm:text-lg font-semibold p-1 h-9 border-transparent hover:border-input focus-visible:ring-1 focus-visible:ring-primary truncate bg-transparent pr-6"
                      aria-label="Resume Name"
                     />
                     <Edit2 size={12} className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-hover:text-primary transition-colors"/>
                </div>
              </div>
              <div className="mt-1.5 pl-10 sm:pl-11 max-w-xs">
                  <div className="flex justify-between items-center mb-1">
                      <p className="text-xs font-medium text-muted-foreground">Progress</p>
                      <p className="text-xs font-semibold text-foreground">{progressData.completed} / {progressData.total}</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                      <div 
                          className={cn("h-1.5 rounded-full transition-all duration-300 ease-in-out", progressBarColor)}
                          style={{ width: `${progressData.progress}%` }}
                          role="progressbar"
                      ></div>
                  </div>
              </div>
            </div>

            {/* Right Side: Actions & Context */}
            <div className="flex flex-col items-end flex-shrink-0">
                <p className="text-xs text-muted-foreground mb-1.5">Using Template: <span className="font-medium text-foreground">{currentTemplateForEditor?.templateName || '...'}</span></p>
                <div className="flex items-center gap-1 sm:gap-1.5">
                    <Button variant="outline" size="sm" onClick={handlePreviewPage} className="border-border text-xs sm:text-sm h-8 px-2 sm:px-3"><Eye size={14} className="sm:mr-1.5" /> <span className="hidden sm:inline">Preview</span></Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={isDownloadingPdf || saveStatus === 'saving'} className="border-border text-xs sm:text-sm h-8 px-2 sm:px-3">
                      {isDownloadingPdf ? <Loader2 size={14} className="animate-spin sm:mr-1.5" /> : <Download size={14} className="sm:mr-1.5" />} <span className="hidden sm:inline">{isDownloadingPdf ? '...' : 'PDF'}</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveResume}
                      disabled={saveStatus === 'saving' || !isDirty}
                      className={cn("text-xs sm:text-sm h-8 px-2 sm:px-3 w-[88px] transition-all", saveStatus === 'success' && 'bg-green-500 hover:bg-green-600')}
                    >
                      {saveStatus === 'saving' ? <Loader2 size={16} className="animate-spin" /> : saveStatus === 'success' ? <span className="flex items-center"><CheckCircle2 size={14} className="mr-1.5" /> Saved!</span> : <span className="flex items-center"><Save size={14} className="mr-1.5" /> {isDirty ? 'Save' : 'Saved'}</span>}
                    </Button>
                </div>
            </div>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-1 sm:px-2 md:px-4 py-3 md:py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} 
              // --- ADJUSTED STICKY TOP POSITION FOR NEW HEADER ---
              className="lg:sticky lg:top-[95px] h-fit lg:col-span-5"
            >
              <Card className="bg-card border-border shadow-xl">
                <CardContent className="p-0 max-h-[calc(100vh-120px)] overflow-y-auto">
                  <Suspense fallback={<div className="p-6 min-h-[400px] flex items-center justify-center"><LoadingSpinner label="Loading form..." /></div>}>
                    <ResumeForm {...{templateFieldDefinition: currentTemplateForEditor?.templateFieldDefinition || [], formData: editorFormData || {}, onFormChange: handleSimpleChange, onArrayChange: handleArrayItemChange, onAddItem: handleAddItemToArray, onRemoveItem: handleRemoveItemFromArray, onSectionToggle: handleSectionToggle, onEnhanceField: handleEnhanceField, isEnhancing}} />
                  </Suspense>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }} 
              className="lg:sticky lg:top-[75px] h-fit lg:col-span-7"
            >   
              <div className="bg-card border rounded-b-none border-border rounded-t-xl p-3 flex items-center gap-4 shadow-sm">
                <Label htmlFor="spacing-slider" className="text-sm font-medium text-muted-foreground whitespace-nowrap">Appearance</Label>
                <Slider {...{id: "spacing-slider", min: 0.8, max: 1.5, step: 0.05, value: [spacingMultiplier], onValueChange: handleSpacingChange, className: "w-full"}} />
                <span className="text-sm font-mono text-foreground w-12 text-center">{spacingMultiplier.toFixed(2)}x</span>
              </div>
              <Suspense fallback={<div className="flex justify-center items-center min-h-[calc(100vh-100px)] bg-muted/20 rounded-xl border border-border"><LoadingSpinner label="Loading preview..." /></div>}>
                <ResumePreview {...{ref: resumePreviewRef, templateCode: currentTemplateForEditor?.templateCode || '', currentFormData: editorFormData || {}, spacingMultiplier}} />
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
      
      <EnhancementDialog {...{suggestions: enhancementSuggestions, originalText: activeEnhancementInfo.originalText, onAccept: handleAcceptSuggestion, onOpenChange: () => setEnhancementSuggestions(null)}} />
      <AuthDialog {...{open: showAuthDialog, onOpenChange: setShowAuthDialog}} />
    </>
  );
};

export default ResumeEditorPage;