import { useEffect } from 'react';
import { isEqual } from 'lodash';
import { initializeFormDataFromDefinitions, getInitiallyEditedSections  } from '@/utils/EditorUtils';

/**
 * A hook to encapsulate the complex page setup logic for the resume editor.
 */
export const usePageSetupEffect = ({
    // Router data
    existingResumeId,
    newResumeTemplateId,
    location,
    // Context data & methods
    isAuthLoading,
    loadResumeForEditor,
    currentResumeDetail,
    editorFormData,
    allTemplates,
    getAllTemplates,
    prepareNewResumeForEditor,
    setEditedSections,
    // State setters
    setPageIsLoading,
    setPageError,
    setMode,
    setCurrentTemplateForEditor,
    setEditorFormData,
    setEditableResumeName,
    setSpacingMultiplier,
    setFontSizeMultiplier,
    setSelectedIndustry,
    setSelectedStylePackKey,
    setSectionOrder,
    setSelectedPresetKey,
}) => {
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
                        // This block handles older resume data that needs migrating
                        const migratedData = { 
                            content: loadedResume.resumeData, 
                            sectionsConfig: initializeFormDataFromDefinitions(template.templateFieldDefinition, loadedResume.selectedIndustry).sectionsConfig 
                        };
                        setEditorFormData(migratedData);

                        // Use 'migratedData' to set the initial sections
                        const initialSections = getInitiallyEditedSections(
                            migratedData.content,
                            template.templateFieldDefinition
                        );
                        setEditedSections(initialSections);

                    } else {
                        // This block handles modern resume data
                        setEditorFormData(loadedResume.resumeData);

                        // Use the direct 'loadedResume.resumeData' to set the initial sections
                        const initialSections = getInitiallyEditedSections(
                            loadedResume.resumeData.content,
                            template.templateFieldDefinition
                        );
                        setEditedSections(initialSections);
                    }

                    setEditableResumeName(loadedResume.resumeName || 'Untitled Resume');
                    setSpacingMultiplier(loadedResume.spacingMultiplier || 1);
                    setFontSizeMultiplier(loadedResume.fontSizeMultiplier || 1);
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

                        let initialStyleKey = null;
                        let initialOrder = null;
                        let initialPresetKey = null;
                        let initialIndustry = null;

                        if (presetKey) {
                            const preset = targetTemplate.presets.find(p => p.key === presetKey);
                            if (preset) {
                                initialStyleKey = preset.stylePackKey;
                                const sectionPreset = targetTemplate.templateComponents.sectionPresets.find(sp => sp.key === preset.sectionPresetKey);
                                initialOrder = sectionPreset?.order;
                                initialPresetKey = sectionPreset?.key;
                                initialIndustry = preset.industry;
                            }
                        } else if (virtualPreset) {
                            initialStyleKey = virtualPreset.stylePackKey;
                            const sectionPreset = targetTemplate.templateComponents.sectionPresets.find(sp => sp.key === virtualPreset.sectionPresetKey);
                            initialOrder = sectionPreset?.order;
                            initialPresetKey = sectionPreset?.key;
                            initialIndustry = virtualPreset.industry;
                        }

                        if (!initialOrder) {
                            const defaultPreset = targetTemplate.templateComponents.sectionPresets?.[0];
                            const defaultStyleKey = targetTemplate.templateComponents.stylePacks?.[0]?.key;
                            initialOrder = defaultPreset?.order || null;
                            initialPresetKey = defaultPreset?.key || null;
                            initialStyleKey = defaultStyleKey || null;
                        }
                        
                        setSelectedStylePackKey(initialStyleKey);
                        setSectionOrder(initialOrder);
                        setSelectedPresetKey(initialPresetKey);
                        setSelectedIndustry(initialIndustry);
                        setFontSizeMultiplier(1);

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
                        setFontSizeMultiplier(1);
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
    }, [existingResumeId, newResumeTemplateId, isAuthLoading, location.search]); // The hook's own dependencies
};