import React, { useEffect, useState, useCallback, useRef, Suspense, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { get, set, cloneDeep, isEqual } from 'lodash';

// UI Components & Icons
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// CHANGED: Added Accordion components for the collapsible panel
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
// CHANGED: Added the Brush icon
import { Eye, Download, Save, ArrowLeft, PlusCircle, AlertCircle, RefreshCw, Edit2, CheckCircle2, Palette, Layers, Briefcase, Settings2 } from "lucide-react";
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
import EnhancementDialog from '@/components/Resume/EnhancementDialog'
import EditorHeader from '@/components/Resume/EditorHeader'; 

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


// Helper to get unique section properties from template definitions
// NEW CODE
const getSectionProperties = (definitions) => {
  if (!Array.isArray(definitions)) return {};
  return definitions.reduce((acc, field) => {
    if (field.section && !acc[field.section]) {
      const sectionDef = definitions.find(def => def.section === field.section);
      acc[field.section] = {
        label: sectionDef?.sectionLabel || field.section.charAt(0).toUpperCase() + field.section.slice(1).replace(/([A-Z])/g, ' $1').trim(),
        isCore: sectionDef?.isCore || false,
        recommendedFor: sectionDef?.recommendedFor || null,
        isToggleable: !sectionDef?.isCore // A section is toggleable if it is NOT core
      };
    }
    return acc;
  }, {});
};

// REPLACE the old function at the top of ResumeEditorPage.jsx with this one:

// NEW CODE
const initializeFormDataFromDefinitions = (definitions, selectedIndustry) => {
  const content = {};
  const sectionsConfig = {};
  if (!Array.isArray(definitions)) return { content, sectionsConfig };

  const uniqueSections = getSectionProperties(definitions);

  for (const sectionKey in uniqueSections) {
    const { isCore, recommendedFor } = uniqueSections[sectionKey];
    let isEnabled = isCore || !selectedIndustry || !recommendedFor || recommendedFor.includes(selectedIndustry);
    sectionsConfig[sectionKey] = { enabled: isEnabled };
  }

  definitions.forEach(fieldDef => {
    if (fieldDef.defaultValue !== undefined) { set(content, fieldDef.name, fieldDef.defaultValue); }
    else if (fieldDef.type === 'group' && fieldDef.repeatable) {
      const sampleItem = {};
      if (Array.isArray(fieldDef.subFields)) {
        fieldDef.subFields.forEach(subField => { sampleItem[subField.name] = subField.defaultValue !== undefined ? subField.defaultValue : subField.livePreviewPlaceholder || ''; });
      }
      set(content, fieldDef.name, [sampleItem]);
    } else { set(content, fieldDef.name, fieldDef.livePreviewPlaceholder || ''); }
  });

  return { content, sectionsConfig };
};

const ResumeEditorPage = () => {
  const { newResumeTemplateId, existingResumeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const resumePreviewRef = useRef();
  const nameInputRef = useRef(null);

  const { isAuthenticated, isLoading: isAuthLoading } = useAuthContext();
  const { templates: allTemplates, getAllTemplates, isLoadingTemplates } = useTemplateContext();
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

  // Component State
  const [mode, setMode] = useState(null);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [currentTemplateForEditor, setCurrentTemplateForEditor] = useState(null);
  const [editableResumeName, setEditableResumeName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackDetailsForDialog, setFeedbackDetailsForDialog] = useState({ title: '', message: '', type: 'success' });
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementSuggestions, setEnhancementSuggestions] = useState(null);
  const [activeEnhancementInfo, setActiveEnhancementInfo] = useState({ path: null, originalText: '' });
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [showPlaceholderWarning, setShowPlaceholderWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [isAddSectionDialogOpen, setIsAddSectionDialogOpen] = useState(false);

  // State for modular templates
  const [spacingMultiplier, setSpacingMultiplier] = useState(1);
  const [selectedStylePackKey, setSelectedStylePackKey] = useState(null);
  const [sectionOrder, setSectionOrder] = useState(null);
  const [selectedPresetKey, setSelectedPresetKey] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // --- PAGE SETUP EFFECT ---
  useEffect(() => {
    const setupPage = async () => {
      if (isAuthLoading) return;

      setPageIsLoading(true);
      setPageError(null);
      const { presetKey, virtualPreset } = location.state || {};
      try {
        if (existingResumeId) {
          setMode('edit');
          const loadedResume = await loadResumeForEditor(existingResumeId);
          if (!loadedResume) throw new Error("Failed to load your resume.");
          
          const template = loadedResume.templateId;
          setCurrentTemplateForEditor(template);

          if (!loadedResume.resumeData.content || !loadedResume.resumeData.sectionsConfig) {
              const migratedData = { content: loadedResume.resumeData, sectionsConfig: initializeFormDataFromDefinitions(template.templateFieldDefinition, loadedResume.selectedIndustry).sectionsConfig };
              setEditorFormData(migratedData);
          } else {
              setEditorFormData(loadedResume.resumeData);
          }
          
          setEditableResumeName(loadedResume.resumeName || 'Untitled Resume');
          setSpacingMultiplier(loadedResume.spacingMultiplier || 1);
          setSelectedIndustry(loadedResume.selectedIndustry || null);
          
          const initialStyleKey = loadedResume.stylePackKey || template.templateComponents.stylePacks?.[0]?.key || null;
          const initialOrder = loadedResume.sectionOrder || template.templateComponents.sectionPresets?.[0]?.order || null;
          setSelectedStylePackKey(initialStyleKey);
          setSectionOrder(initialOrder);

          const initialPreset = template.templateComponents.sectionPresets?.find(p => isEqual(p.order, initialOrder));
          setSelectedPresetKey(initialPreset?.key || null);

        } else if (newResumeTemplateId) {
          const queryParams = new URLSearchParams(location.search);
          const industryFromQuery = queryParams.get('industry');
          setSelectedIndustry(industryFromQuery);

          const isReturningFromPreview = currentResumeDetail?.templateId?._id === newResumeTemplateId && editorFormData?.content;

          if (!isReturningFromPreview) {
            setMode('create');
            let templates = allTemplates.length > 0 ? allTemplates : await getAllTemplates();
            const targetTemplate = templates.find(t => t._id === newResumeTemplateId);
            if (!targetTemplate) throw new Error(`Template with ID ${newResumeTemplateId} not found.`);
            
            setCurrentTemplateForEditor(targetTemplate);
            prepareNewResumeForEditor(targetTemplate); 

            // This block determines the initial editor settings based on the user's choice.
            let initialStyleKey = null;
            let initialOrder = null;
            let initialPresetKey = null;
            let initialIndustry = null;

            if (presetKey) {
              // Case 1: A curated preset was selected.
              console.log(`Applying curated preset: ${presetKey}`);
              const preset = targetTemplate.presets.find(p => p.key === presetKey);
              if (preset) {
                initialStyleKey = preset.stylePackKey;
                const sectionPreset = targetTemplate.templateComponents.sectionPresets.find(sp => sp.key === preset.sectionPresetKey);
                initialOrder = sectionPreset?.order;
                initialPresetKey = sectionPreset?.key; // Set the key for the dropdown
                initialIndustry = preset.industry;
              }
            } else if (virtualPreset) {
              // Case 2: A custom combination was built.
              console.log('Applying virtual preset (combination)', virtualPreset);
              initialStyleKey = virtualPreset.stylePackKey;
              const sectionPreset = targetTemplate.templateComponents.sectionPresets.find(sp => sp.key === virtualPreset.sectionPresetKey);
              initialOrder = sectionPreset?.order;
              initialPresetKey = sectionPreset?.key;
              initialIndustry = virtualPreset.industry;
            }

            // Case 3: User skipped or no valid preset was found. Fallback to template defaults.
            if (!initialOrder) {
              console.log('No preset found or skipped. Applying template defaults.');
              const defaultPreset = targetTemplate.templateComponents.sectionPresets?.[0];
              const defaultStyleKey = targetTemplate.templateComponents.stylePacks?.[0]?.key;
              initialOrder = defaultPreset?.order || null;
              initialPresetKey = defaultPreset?.key || null;
              initialStyleKey = defaultStyleKey || null;
            }
            
            // Apply the determined settings to the component's state.
            setSelectedStylePackKey(initialStyleKey);
            setSectionOrder(initialOrder);
            setSelectedPresetKey(initialPresetKey);
            setSelectedIndustry(initialIndustry);

            // Initialize the form data with the chosen industry to toggle sections correctly.
            const initialData = initializeFormDataFromDefinitions(targetTemplate.templateFieldDefinition, initialIndustry);
            setEditorFormData(initialData);
            setEditableResumeName(initialIndustry ? `My ${initialIndustry} Resume` : `My New ${targetTemplate.templateName || 'Resume'}`);
              
          } else {
              setMode('create');
              const returningTemplate = currentResumeDetail.templateId;
              setCurrentTemplateForEditor(returningTemplate);              
              setEditableResumeName(editableResumeName || `My New ${currentResumeDetail.templateId.templateName || 'Resume'}`);

              const defaultStyleKey = returningTemplate.templateComponents.stylePacks?.[0]?.key || null;
              const defaultPreset = returningTemplate.templateComponents.sectionPresets?.[0];
              setSelectedStylePackKey(defaultStyleKey);
              setSectionOrder(defaultPreset?.order || null);
              setSelectedPresetKey(defaultPreset?.key || null);
              setSpacingMultiplier(1);
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

  // --- EFFECT FOR AUTO-FOCUSING NAME INPUT ---
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  // --- CLEANUP & ERROR EFFECTS ---
  useEffect(() => { return () => { if (!window.location.pathname.startsWith('/resume/')) clearCurrentEditorData(); }; }, [location.pathname, clearCurrentEditorData]);
  useEffect(() => { if (resumeError && saveStatus === 'saving') { setFeedbackDetailsForDialog({ title: 'Operation Failed', message: resumeError.message || 'An unexpected error occurred.', type: 'error' }); setShowFeedbackDialog(true); } }, [resumeError, saveStatus]);

  // --- FORM DATA HANDLERS ---
  // const handleSimpleChange = useCallback((fieldPath, value) => { setIsDirty(true); setEditorFormData(prev => set(cloneDeep(prev), `content.${fieldPath}`, value)); }, [setEditorFormData]);
  // const handleArrayItemChange = useCallback((arrayPath, idx, field, value) => { setIsDirty(true); setEditorFormData(prev => set(cloneDeep(prev), `content.${arrayPath}[${idx}].${field}`, value)); }, [setEditorFormData]);
  // const handleAddItemToArray = useCallback((arrayPath, item = {}) => { setIsDirty(true); setEditorFormData(prev => { const d = cloneDeep(prev); const a = get(d, `content.${arrayPath}`, []); a.push(item); set(d, `content.${arrayPath}`, a); return d; }); }, [setEditorFormData]);
  // const handleRemoveItemFromArray = useCallback((arrayPath, idx) => { setIsDirty(true); setEditorFormData(prev => { const d = cloneDeep(prev); const a = get(d, `content.${arrayPath}`, []); a.splice(idx, 1); set(d, `content.${arrayPath}`, a); return d; }); }, [setEditorFormData]);
  // const handleSectionToggle = useCallback((sectionKey) => { setIsDirty(true); setEditorFormData(prev => { const d = cloneDeep(prev); const s = get(d, `sectionsConfig.${sectionKey}.enabled`, false); set(d, `sectionsConfig.${sectionKey}.enabled`, !s); return d; }); }, [setEditorFormData]);
  // --- FORM DATA HANDLERS ---
  const handleSimpleChange = useCallback((fieldPath, value) => { setIsDirty(true); setEditorFormData(prev => set(cloneDeep(prev), `content.${fieldPath}`, value)); }, [setEditorFormData]);
  const handleArrayItemChange = useCallback((arrayPath, idx, field, value) => { setIsDirty(true); setEditorFormData(prev => set(cloneDeep(prev), `content.${arrayPath}[${idx}].${field}`, value)); }, [setEditorFormData]);
  const handleAddItemToArray = useCallback((arrayPath, item = {}) => { setIsDirty(true); setEditorFormData(prev => { const d = cloneDeep(prev); const a = get(d, `content.${arrayPath}`); const n = Array.isArray(a) ? [...a] : []; n.push(item); set(d, `content.${arrayPath}`, n); return d; }); }, [setEditorFormData]);
  const handleRemoveItemFromArray = useCallback((arrayPath, idx) => { setIsDirty(true); setEditorFormData(prev => { const d = cloneDeep(prev); const a = get(d, `content.${arrayPath}`); if (!Array.isArray(a)) return d; const n = [...a]; n.splice(idx, 1); set(d, `content.${arrayPath}`, n); return d; }); }, [setEditorFormData]);
  const handleSectionToggle = useCallback((sectionKey) => { setIsDirty(true); setEditorFormData(prev => { const d = cloneDeep(prev); set(d, `sectionsConfig.${sectionKey}.enabled`, !get(d, `sectionsConfig.${sectionKey}.enabled`, false)); return d; }); }, [setEditorFormData]);
  
  const handleAddChosenSection = (sectionKey) => {
    handleSectionToggle(sectionKey); // Reuses the existing toggle logic
    setIsAddSectionDialogOpen(false); // Closes the dialog after adding
  };
  
  // --- DESIGN & METADATA HANDLERS ---
  const handleStylePackChange = useCallback((key) => { setIsDirty(true); setSelectedStylePackKey(key); }, []);
  const handlePresetChange = useCallback((key) => {
    const preset = currentTemplateForEditor.templateComponents.sectionPresets.find(p => p.key === key);
    if (preset) {
      setIsDirty(true);
      setSelectedPresetKey(key);
      setSectionOrder(preset.order);
    }
  }, [currentTemplateForEditor]);
  const handleSpacingChange = useCallback((value) => { setIsDirty(true); setSpacingMultiplier(value[0]); }, []);
  const handleResumeNameChange = (e) => { setIsDirty(true); setEditableResumeName(e.target.value); };
  
  // NEW CODE
const handleIndustryChange = useCallback((industry) => {
    setIsDirty(true);
    setSelectedIndustry(industry);
    setEditorFormData(prev => {
        const newFormData = cloneDeep(prev);
        const definitions = currentTemplateForEditor.templateFieldDefinition;
        const sectionProps = getSectionProperties(definitions);
        for (const sectionKey in sectionProps) {
            const props = sectionProps[sectionKey];
            const isEnabled = props.isCore || !industry || !props.recommendedFor || props.recommendedFor.includes(industry);
            if (!newFormData.sectionsConfig[sectionKey]) newFormData.sectionsConfig[sectionKey] = {};
            newFormData.sectionsConfig[sectionKey].enabled = isEnabled;
        }
        return newFormData;
    });
}, [currentTemplateForEditor, setEditorFormData]);

  // --- ACTION HANDLERS ---
  const handleSaveResume = async () => {
    if (hasUntouchedPlaceholders(editorFormData.content)) {
      setPendingAction('save');
      setShowPlaceholderWarning(true);
      return; 
    }
    await executeSaveResume();
  };

  const executeSaveResume = async () => {
    if (!isAuthenticated) {
      setPendingAction('save');
      setShowAuthDialog(true);
      return;
    }
    setSaveStatus('saving');
    console.log(selectedIndustry)
    const savedResult = await saveOrUpdateCurrentResume(
      editorFormData,
      editableResumeName.trim(),
      spacingMultiplier,
      sectionOrder,
      selectedStylePackKey,
      selectedIndustry
    );
    if (savedResult?._id) {
      setFeedbackDetailsForDialog({ title: 'Success!', message: 'Resume saved successfully!', type: 'success' });
      setShowFeedbackDialog(true);
      setIsDirty(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2500);
      if (mode === 'create') navigate(`/resume/edit/${savedResult._id}`, { replace: true });
    } else {
      setSaveStatus('idle');
    }
  };


  const handleDownloadPdf = async () => {
    if (hasUntouchedPlaceholders(editorFormData.content)) {
      setPendingAction('download');
      setShowPlaceholderWarning(true);
      return; 
    }
    await executeDownloadPdf();
  };

  const executeDownloadPdf = async () => {
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
      await apiDownloadResume(cleanHtmlForPdf);
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
            spacingMultiplier,
            sectionOrder,
            stylePackKey: selectedStylePackKey,
            selectedIndustry,
            template: currentTemplateForEditor
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

  const handleAuthSuccess = async () => {
    if (pendingAction === 'save') {
      await executeSaveResume();
    } else if (pendingAction === 'download') {
      await executeDownloadPdf();
    }
    setPendingAction(null);
  };

  // --- UTILITY & HELPER FUNCTIONS ---
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

  const handleConfirmAction = () => {
    setShowPlaceholderWarning(false);
    if (pendingAction === 'save') {
      executeSaveResume();
    } else if (pendingAction === 'download') {
      executeDownloadPdf();
    }
    setPendingAction(null);
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
  
  // --- MEMOIZED CALCULATIONS ---
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
        const placeholderRegex = /\[.*\]/;
        
        if (field.type === 'group' && field.repeatable) {
          const items = get(editorFormData.content, field.name, []);
          if (items.length > 0) {
              const firstItemIsStillPlaceholder = Object.values(items[0]).every(
                val => typeof val === 'string' && (val === '' || placeholderRegex.test(val))
              );
              if (items.length > 1 || !firstItemIsStillPlaceholder) {
                  isSectionCompleted = true;
                  break;
              }
          }
        } else {
          const value = get(editorFormData.content, field.name, '');
          if (typeof value === 'string' && value.trim() !== '' && !placeholderRegex.test(value)) { 
            isSectionCompleted = true; 
            break; 
          }
        }
      }
      if (isSectionCompleted) { completedCount++; }
    });

    const total = activeSections.length;
    const progress = total > 0 ? (completedCount / total) * 100 : 0;
    return { completed: completedCount, total, progress };
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

  const sectionProperties = useMemo(() => {
    return getSectionProperties(currentTemplateForEditor?.templateFieldDefinition || []);
  }, [currentTemplateForEditor]);

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
      <div className="flex flex-col min-h-screen bg-muted/20 dark:bg-background text-foreground">
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

        <main className="flex-grow container mx-auto px-1 sm:px-2 md:px-4 py-3 md:py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} 
              className="lg:sticky lg:top-[95px] h-fit lg:col-span-5"
            >
              <Card className="bg-card border-border shadow-xl">
                <CardContent className="p-0 max-h-[calc(100vh-120px)] overflow-y-auto">
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
  onOpenAddSectionDialog={() => setIsAddSectionDialogOpen(true)}
  sectionProperties={sectionProperties}
/>
                  </Suspense>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }} 
              className="lg:sticky lg:top-[75px] h-fit lg:col-span-7"
            >   
            {/* --- CHANGED: Old controls card replaced with the new Toolbar --- */}
              <div className="flex items-center justify-between gap-4 p-3 border border-border bg-card rounded-lg shadow-sm mb-3">
                {/* Spacing Control */}
                <div className="flex-grow space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="spacing-slider" className="text-sm font-medium">Spacing</Label>
                    <span className="text-sm font-mono text-muted-foreground">{spacingMultiplier.toFixed(2)}x</span>
                  </div>
                  <Slider id="spacing-slider" min={0.8} max={1.5} step={0.05} value={[spacingMultiplier]} onValueChange={handleSpacingChange} />
                </div>

                {/* Customization Popover */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="ml-4 flex-shrink-0">
                      <Settings2 className="mr-2 h-4 w-4" />
                      Customize
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="grid gap-4">
                      <div className="space-y-1">
                        <h4 className="font-medium leading-none">Advanced Customization</h4>
                        <p className="text-sm text-muted-foreground">Tailor your resume's style, layout, and industry focus.</p>
                      </div>
                      <div className="grid gap-4 pt-2">
                        {/* Style Pack Selector */}
                        <div className="space-y-2">
                          <Label htmlFor="style-pack-selector" className="flex items-center text-sm font-medium"><Palette size={14} className="mr-2"/> Style / Theme</Label>
                          <Select value={selectedStylePackKey || ''} onValueChange={handleStylePackChange}>
                            <SelectTrigger id="style-pack-selector"><SelectValue placeholder="Select a style..." /></SelectTrigger>
                            <SelectContent>
                              {currentTemplateForEditor?.templateComponents?.stylePacks?.map(pack => (
                                <SelectItem key={pack.key} value={pack.key}>{pack.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {/* Section Order Preset Selector */}
                        <div className="space-y-2">
                          <Label htmlFor="preset-selector" className="flex items-center text-sm font-medium"><Layers size={14} className="mr-2"/> Section Order</Label>
                          <Select value={selectedPresetKey || ''} onValueChange={handlePresetChange}>
                            <SelectTrigger id="preset-selector"><SelectValue placeholder="Select an order..." /></SelectTrigger>
                            <SelectContent>
                              {currentTemplateForEditor?.templateComponents?.sectionPresets?.map(preset => (
                                <SelectItem key={preset.key} value={preset.key}>{preset.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {/* Industry Selector */}
                        <div className="space-y-2">
                          <Label htmlFor="industry-selector" className="flex items-center text-sm font-medium"><Briefcase size={14} className="mr-2"/> Industry</Label>
                          <Select value={selectedIndustry || ''} onValueChange={handleIndustryChange} disabled={industryOptions.length === 0}>
                            <SelectTrigger id="industry-selector"><SelectValue placeholder="Select industry..." /></SelectTrigger>
                            <SelectContent>
                              {industryOptions.length > 0 ? industryOptions.map(industry => (
                                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                              )) : <div className="px-2 py-1.5 text-sm text-muted-foreground">No industries defined</div>}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              {/* --- END OF CHANGE --- */}

              <Suspense fallback={<div className="flex justify-center items-center min-h-[calc(100vh-100px)] bg-muted/20 rounded-xl border border-border"><LoadingSpinner label="Loading preview..." /></div>}>
                <ResumePreview 
                  ref={resumePreviewRef}
                  currentFormData={editorFormData || {}}
                  spacingMultiplier={spacingMultiplier}
                  htmlShell={currentTemplateForEditor?.templateComponents?.htmlShell}
                  baseCss={currentTemplateForEditor?.templateComponents?.baseCss}
                  sections={currentTemplateForEditor?.templateComponents?.sections}
                  stylePacks={currentTemplateForEditor?.templateComponents?.stylePacks}
                  selectedStylePackKey={selectedStylePackKey}
                  sectionOrder={sectionOrder}
                  zoomLevel={zoomLevel}
                  setZoomLevel={setZoomLevel}
                />
              </Suspense>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Dialogs */}
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
      
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
        onSuccess={handleAuthSuccess}
      />
      
      <Dialog open={showPlaceholderWarning} onOpenChange={setShowPlaceholderWarning}>
        <DialogContent className="sm:max-w-md bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center text-lg font-semibold text-amber-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              Placeholder Text Detected
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="py-4 text-muted-foreground">
            It looks like you may have left some placeholder text (like "[Your Name]") in your resume. Are you sure you want to continue?
          </DialogDescription>
          <DialogFooter className="sm:justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={() => setPendingAction(null)}>
                Go Back and Edit
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleConfirmAction}>
              Continue Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isAddSectionDialogOpen} onOpenChange={setIsAddSectionDialogOpen}>
  <DialogContent className="sm:max-w-md bg-card">
    <DialogHeader>
      <DialogTitle className="flex items-center text-lg font-semibold">
        <PlusCircle className="h-5 w-5 mr-2 text-primary" />
        Add New Section
      </DialogTitle>
    </DialogHeader>
    <DialogDescription>
      Select a section from the list below to add it to your resume.
    </DialogDescription>
    <div className="py-4 max-h-80 overflow-y-auto space-y-2 pr-2">
      {Object.keys(sectionProperties)
        // Filter to show only sections that can be toggled AND are currently disabled
        .filter(key => sectionProperties[key].isToggleable && !get(editorFormData, `sectionsConfig.${key}.enabled`, false))
        .map(key => (
          <Button 
            key={key} 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => handleAddChosenSection(key)}
          >
            {sectionProperties[key].label}
          </Button>
        ))
      }
    </div>
    <DialogFooter>
        <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
        </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </>
  );
};

export default ResumeEditorPage;