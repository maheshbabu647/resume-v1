import { useCallback, useMemo } from 'react';
import { cloneDeep, set, get } from 'lodash';
import { getSectionProperties } from '@/utils/EditorUtils';

/**
 * A custom hook to manage resume section logic, including toggling,
 * industry-based configuration, and property memoization.
 */
export const useSectionHandlers = ({
  setEditorFormData,
  currentTemplateForEditor,
  setIsAddSectionDialogOpen,
  setIsDirty
}) => {
  /**
   * Memoized calculation of section properties from the template definition.
   */
  const sectionProperties = useMemo(() => {
    return getSectionProperties(currentTemplateForEditor?.templateFieldDefinition || []);
  }, [currentTemplateForEditor]);

  /**
   * Toggles the enabled state of a specific section.
   */
  const handleSectionToggle = useCallback((sectionKey) => {
    setEditorFormData(prev => {
      const newFormData = cloneDeep(prev);
      const currentStatus = get(newFormData, `sectionsConfig.${sectionKey}.enabled`, false);
      set(newFormData, `sectionsConfig.${sectionKey}.enabled`, !currentStatus);
      return newFormData;
    });
  }, [setEditorFormData]);

  /**
   * Adds the chosen section and closes the selection dialog.
   */
  const handleAddChosenSection = useCallback((sectionKey) => {
    handleSectionToggle(sectionKey);
    setIsAddSectionDialogOpen(false);
  }, [handleSectionToggle, setIsAddSectionDialogOpen]);

  /**
   * Updates section visibility based on the selected industry.
   */
  const handleIndustryChange = useCallback((industry) => {
    setEditorFormData(prev => {
        const newFormData = cloneDeep(prev);
        const definitions = currentTemplateForEditor.templateFieldDefinition;
        // Uses the memoized sectionProperties for efficiency
        for (const sectionKey in sectionProperties) {
            const props = sectionProperties[sectionKey];
            const isEnabled = props.isCore || !industry || !props.recommendedFor || props.recommendedFor.includes(industry);
            if (!newFormData.sectionsConfig[sectionKey]) newFormData.sectionsConfig[sectionKey] = {};
            newFormData.sectionsConfig[sectionKey].enabled = isEnabled;
        }
        setIsDirty(true); // Assuming setIsDirty is managed in the main component
        return newFormData;
    });
  }, [currentTemplateForEditor, sectionProperties, setEditorFormData]);

  return {
    sectionProperties,
    handleSectionToggle,
    handleAddChosenSection,
    handleIndustryChange,
  };
};