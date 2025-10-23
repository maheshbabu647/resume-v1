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
    setCurrentResumeDetail,
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
            
            console.log('[PageSetup] Effect triggered', { 
                existingResumeId, 
                newResumeTemplateId, 
                hasLocationState: !!location.state,
                stateMode: location.state?.mode
            });
            
            setPageIsLoading(true);
            setPageError(null);
            const { presetKey, virtualPreset, mode: stateMode, optimizedResumeData, skipSetupDialog, atsResults, jobDescription, resumeText } = location.state || {};
            
            // Handle ATS Optimization Mode
            if (stateMode === 'ats-optimize' && newResumeTemplateId && optimizedResumeData) {
                console.log('[ATS Mode] Entering ATS optimization setup');
                try {
                    console.log('[ATS Mode] Setting up ATS-optimized resume');
                    console.log('[ATS Mode] Optimized data received:', optimizedResumeData);
                    setMode('create');
                    
                    let templates = allTemplates.length > 0 ? allTemplates : await getAllTemplates();
                    const targetTemplate = templates.find(t => t._id === newResumeTemplateId);
                    if (!targetTemplate) throw new Error(`Template with ID ${newResumeTemplateId} not found.`);
                    
                    setCurrentTemplateForEditor(targetTemplate);
                    
                    // Initialize sectionsConfig properly - only enable sections with actual data
                    const { getSectionProperties } = await import('@/utils/EditorUtils');
                    const uniqueSections = getSectionProperties(targetTemplate.templateFieldDefinition);
                    const sectionsConfig = {};
                    const optimizedContent = optimizedResumeData.content || {};
                    
                    console.log('[ATS Mode] Optimized content structure:', JSON.stringify(optimizedContent, null, 2));
                    console.log('[ATS Mode] Unique sections found:', Object.keys(uniqueSections));
                    
                    // Helper to check if a section has actual data (not empty, not placeholder)
                    const sectionHasData = (sectionKey) => {
                        const sectionFields = targetTemplate.templateFieldDefinition.filter(f => f.section === sectionKey);
                        
                        console.log(`[ATS Mode] Checking section "${sectionKey}", found ${sectionFields.length} fields`);
                        
                        if (sectionFields.length === 0) {
                            console.log(`[ATS Mode] Section "${sectionKey}": No fields found in template definition`);
                            return false;
                        }
                        
                        let hasData = sectionFields.some(field => {
                            // The field.name is the actual path in the content
                            // For example, field.name might be "personalInfo.name" or "experience"
                            let value;
                            
                            // First, try to get the value using the field name as-is
                            // This handles both nested paths like "personalInfo.name" and top-level like "experience"
                            const pathParts = field.name.split('.');
                            
                            if (pathParts.length > 1) {
                                // Nested path: personalInfo.name -> optimizedContent.personalInfo.name
                                value = pathParts.reduce((obj, key) => obj?.[key], optimizedContent);
                            } else {
                                // Top-level: experience -> optimizedContent.experience
                                value = optimizedContent[field.name];
                            }
                            
                            console.log(`[ATS Mode]   Field "${field.name}" (section: ${field.section}): value =`, value, `(type: ${typeof value}, isArray: ${Array.isArray(value)})`);
                            
                            // Check if value has actual data (not empty, not placeholder)
                            if (Array.isArray(value)) {
                                // For arrays, check if there are items with non-empty values
                                if (value.length === 0) {
                                    console.log(`[ATS Mode]   Field "${field.name}": empty array`);
                                    return false;
                                }
                                
                                const hasArrayData = value.some(item => {
                                    if (typeof item === 'object' && item !== null) {
                                        return Object.values(item).some(val => {
                                            if (val === null || val === undefined) return false;
                                            const strVal = String(val).trim();
                                            return strVal !== '' && !/^\[.*\]$/.test(strVal);
                                        });
                                    }
                                    if (item === null || item === undefined) return false;
                                    const strVal = String(item).trim();
                                    return strVal !== '' && !/^\[.*\]$/.test(strVal);
                                });
                                console.log(`[ATS Mode]   Field "${field.name}": array has data = ${hasArrayData}`);
                                return hasArrayData;
                            }
                            
                            // For non-arrays, check if value exists and is not empty or placeholder
                            if (value === null || value === undefined) {
                                console.log(`[ATS Mode]   Field "${field.name}": null/undefined`);
                                return false;
                            }
                            const strVal = String(value).trim();
                            const hasStringData = strVal !== '' && !/^\[.*\]$/.test(strVal);
                            console.log(`[ATS Mode]   Field "${field.name}": string has data = ${hasStringData}, value = "${strVal.substring(0, 50)}..."`);
                            return hasStringData;
                        });
                        
                        console.log(`[ATS Mode] Section "${sectionKey}" field-based result: hasData = ${hasData}`);
                        
                        // FIRST FALLBACK: Check if the section name itself exists as a key in content
                        // For example, if section is "profile", check optimizedContent.profile
                        if (!hasData && optimizedContent[sectionKey]) {
                            const sectionValue = optimizedContent[sectionKey];
                            
                            if (Array.isArray(sectionValue)) {
                                const arrayHasData = sectionValue.length > 0 && sectionValue.some(item => {
                                    if (typeof item === 'object' && item !== null) {
                                        return Object.values(item).some(val => {
                                            if (val === null || val === undefined) return false;
                                            const strVal = String(val).trim();
                                            return strVal !== '' && !/^\[.*\]$/.test(strVal);
                                        });
                                    }
                                    return false;
                                });
                                if (arrayHasData) {
                                    console.log(`[ATS Mode] Section "${sectionKey}" DIRECT match: Found array data in content["${sectionKey}"]`);
                                    hasData = true;
                                }
                            } else if (typeof sectionValue === 'object' && sectionValue !== null) {
                                const objectHasData = Object.values(sectionValue).some(val => {
                                    if (val === null || val === undefined) return false;
                                    if (Array.isArray(val)) {
                                        return val.length > 0 && val.some(item => {
                                            if (typeof item === 'object' && item !== null) {
                                                return Object.values(item).some(v => v && String(v).trim() !== '');
                                            }
                                            return item && String(item).trim() !== '';
                                        });
                                    }
                                    const strVal = String(val).trim();
                                    return strVal !== '' && !/^\[.*\]$/.test(strVal);
                                });
                                if (objectHasData) {
                                    console.log(`[ATS Mode] Section "${sectionKey}" DIRECT match: Found object data in content["${sectionKey}"]`, Object.keys(sectionValue));
                                    hasData = true;
                                }
                            }
                        }
                        
                        // SECOND FALLBACK: Check if any top-level key in content matches field base names
                        // For example, if section is "profile", check for "personalInfo" or other variations
                        if (!hasData && sectionFields.length > 0) {
                            // Get the base key from the first field (e.g., "personalInfo" from "personalInfo.name")
                            const firstFieldPath = sectionFields[0].name.split('.');
                            const baseKey = firstFieldPath[0];
                            
                            if (optimizedContent[baseKey]) {
                                const baseValue = optimizedContent[baseKey];
                                
                                // Check if this object/array has any meaningful data
                                if (Array.isArray(baseValue)) {
                                    const arrayHasData = baseValue.length > 0 && baseValue.some(item => {
                                        if (typeof item === 'object' && item !== null) {
                                            return Object.values(item).some(val => {
                                                if (val === null || val === undefined) return false;
                                                const strVal = String(val).trim();
                                                return strVal !== '' && !/^\[.*\]$/.test(strVal);
                                            });
                                        }
                                        return false;
                                    });
                                    if (arrayHasData) {
                                        console.log(`[ATS Mode] Section "${sectionKey}" fallback check: Found array data in "${baseKey}"`);
                                        return true;
                                    }
                                } else if (typeof baseValue === 'object' && baseValue !== null) {
                                    const objectHasData = Object.values(baseValue).some(val => {
                                        if (val === null || val === undefined) return false;
                                        const strVal = String(val).trim();
                                        return strVal !== '' && !/^\[.*\]$/.test(strVal);
                                    });
                                    if (objectHasData) {
                                        console.log(`[ATS Mode] Section "${sectionKey}" fallback check: Found object data in "${baseKey}"`);
                                        return true;
                                    }
                                }
                            }
                        }
                        
                        console.log(`[ATS Mode] Section "${sectionKey}" final result: hasData = ${hasData}`);
                        return hasData;
                    };
                    
                    // Initialize sectionsConfig with explicit enabled/disabled for each section
                    // Important: Must explicitly set enabled: false for sections without data
                    // because ResumeForm defaults to true if not set (line 689 in ResumeForm.jsx)
                    for (const sectionKey in uniqueSections) {
                        const hasData = sectionHasData(sectionKey);
                        // Explicitly set enabled: true only for sections with data
                        // Set enabled: false for sections without data so they go to "Add Section"
                        sectionsConfig[sectionKey] = { 
                            enabled: hasData
                        };
                        console.log(`[ATS Mode] Section "${sectionKey}": hasData=${hasData}, enabled=${sectionsConfig[sectionKey].enabled}`);
                    }
                    
                    // Properly structured form data with initialized sectionsConfig
                    const properlyStructuredData = {
                        content: optimizedContent,
                        sectionsConfig: sectionsConfig
                    };
                    
                    console.log('[ATS Mode] Properly structured form data:', properlyStructuredData);
                    console.log('[ATS Mode] sectionsConfig being set:', properlyStructuredData.sectionsConfig);
                    
                    // Set optimized resume data in the editor
                    setEditorFormData(properlyStructuredData);
                    console.log('[ATS Mode] ✅ setEditorFormData called with:', { 
                        hasContent: !!properlyStructuredData.content,
                        hasSectionsConfig: !!properlyStructuredData.sectionsConfig,
                        enabledSections: Object.keys(properlyStructuredData.sectionsConfig).filter(k => properlyStructuredData.sectionsConfig[k].enabled)
                    });
                    
                    // Update currentResumeDetail with the properly structured data too
                    setCurrentResumeDetail({
                        _id: null,
                        templateId: targetTemplate,
                        resumeData: properlyStructuredData,
                        resumeName: `ATS-Optimized Resume ${new Date().toLocaleDateString()}`,
                    });
                    console.log('[ATS Mode] ✅ setCurrentResumeDetail called');
                    
                    // Set default styling
                    const defaultStyleKey = targetTemplate.templateComponents.stylePacks?.[0]?.key || null;
                    const defaultPreset = targetTemplate.templateComponents.sectionPresets?.[0];
                    setSelectedStylePackKey(defaultStyleKey);
                    setSectionOrder(defaultPreset?.order || null);
                    setSelectedPresetKey(defaultPreset?.key || null);
                    setSpacingMultiplier(1);
                    setFontSizeMultiplier(1);
                    
                    // Set resume name based on job or default
                    setEditableResumeName(`ATS-Optimized Resume ${new Date().toLocaleDateString()}`);
                    
                    // Calculate edited sections from optimized data
                    if (properlyStructuredData.content) {
                        const { getInitiallyEditedSections } = await import('@/utils/EditorUtils');
                        const calculatedEditedSections = getInitiallyEditedSections(
                            properlyStructuredData.content,
                            targetTemplate.templateFieldDefinition
                        );
                        setEditedSections(calculatedEditedSections);
                        console.log('[ATS Mode] Edited sections calculated:', calculatedEditedSections);
                    }
                    
                    setPageIsLoading(false);
                    console.log('[ATS Mode] ✅ Setup complete - all state set');
                    return;
                } catch (err) {
                    console.error('[ATS Mode] ❌ Setup failed:', err);
                    setPageError(err.message);
                    setPageIsLoading(false);
                    return;
                }
            }
            
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