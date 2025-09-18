import { useCallback } from 'react';
import { set, get, cloneDeep } from 'lodash';

// This helper is specific to these handlers, so we can co-locate it here.
const getSectionKeyFromPath = (path) => {
    if (!path) return null;
    return path.split('.')[0].split('[')[0];
};

/**
 * A hook that provides memoized handlers for manipulating resume form data.
 */
export const useFormHandlers = ({ setEditorFormData, setIsDirty, setEditedSections }) => {
    const handleSimpleChange = useCallback((fieldPath, value) => {
        setIsDirty(true);
        const sectionKey = getSectionKeyFromPath(fieldPath);
        if (sectionKey) {
            setEditedSections(prev => new Set(prev).add(sectionKey));
        }
        setEditorFormData(prev => set(cloneDeep(prev), `content.${fieldPath}`, value));
    }, [setEditorFormData, setIsDirty, setEditedSections]);

    const handleArrayItemChange = useCallback((arrayPath, idx, field, value) => {
        setIsDirty(true);
        const sectionKey = getSectionKeyFromPath(arrayPath);
        if (sectionKey) {
            setEditedSections(prev => new Set(prev).add(sectionKey));
        }
        setEditorFormData(prev => set(cloneDeep(prev), `content.${arrayPath}[${idx}].${field}`, value));
    }, [setEditorFormData, setIsDirty, setEditedSections]);

    const handleAddItemToArray = useCallback((arrayPath, item = {}) => {
        setIsDirty(true);
        const sectionKey = getSectionKeyFromPath(arrayPath);
        if (sectionKey) {
            setEditedSections(prev => new Set(prev).add(sectionKey));
        }
        setEditorFormData(prev => { 
            const d = cloneDeep(prev); 
            const a = get(d, `content.${arrayPath}`); 
            const n = Array.isArray(a) ? [...a] : []; 
            n.push(item); 
            set(d, `content.${arrayPath}`, n); 
            return d; 
        });
    }, [setEditorFormData, setIsDirty, setEditedSections]);
  
    const handleRemoveItemFromArray = useCallback((arrayPath, idx) => {
        setIsDirty(true);
        const sectionKey = getSectionKeyFromPath(arrayPath);
        if (sectionKey) {
            setEditedSections(prev => new Set(prev).add(sectionKey));
        }
        setEditorFormData(prev => { 
            const d = cloneDeep(prev); 
            const a = get(d, `content.${arrayPath}`); 
            if (!Array.isArray(a)) return d; 
            const n = [...a]; 
            n.splice(idx, 1); 
            set(d, `content.${arrayPath}`, n); 
            return d; 
        });
    }, [setEditorFormData, setIsDirty, setEditedSections]);

    return {
        handleSimpleChange,
        handleArrayItemChange,
        handleAddItemToArray,
        handleRemoveItemFromArray,
    };
};