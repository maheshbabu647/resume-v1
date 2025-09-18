import { useCallback } from 'react';

/**
 * Provides memoized handlers for changing the resume's design and metadata.
 */
export const useDesignHandlers = ({
    setIsDirty,
    setSelectedStylePackKey,
    currentTemplateForEditor,
    setSelectedPresetKey,
    setSectionOrder,
    setSpacingMultiplier,
    setEditableResumeName,
}) => {
    const handleStylePackChange = useCallback((key) => {
        setIsDirty(true);
        setSelectedStylePackKey(key);
    }, [setIsDirty, setSelectedStylePackKey]);

    const handlePresetChange = useCallback((key) => {
        if (!currentTemplateForEditor) return;
        const preset = currentTemplateForEditor.templateComponents.sectionPresets.find(p => p.key === key);
        if (preset) {
            setIsDirty(true);
            setSelectedPresetKey(key);
            setSectionOrder(preset.order);
        }
    }, [currentTemplateForEditor, setIsDirty, setSelectedPresetKey, setSectionOrder]);

    const handleSpacingChange = useCallback((value) => {
        setIsDirty(true);
        setSpacingMultiplier(value[0]);
    }, [setIsDirty, setSpacingMultiplier]);

    const handleResumeNameChange = (e) => {
        setIsDirty(true);
        setEditableResumeName(e.target.value);
    };

    return {
        handleStylePackChange,
        handlePresetChange,
        handleSpacingChange,
        handleResumeNameChange,
    };
};