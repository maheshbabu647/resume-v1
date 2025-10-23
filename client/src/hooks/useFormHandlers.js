/**
 * @fileoverview Form Handlers Hook - Provides optimized form manipulation functions
 * @module hooks/useFormHandlers
 * @description Custom React hook that provides memoized handlers for manipulating
 * resume form data, tracking dirty state, and managing section edit history.
 */

import { useCallback } from 'react';
import { set, get, cloneDeep } from 'lodash';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extracts the section key from a field path
 * @private
 * @function getSectionKeyFromPath
 * @param {string} path - The full field path (e.g., "experience.0.company")
 * @returns {string|null} The section key (e.g., "experience") or null
 */
const getSectionKeyFromPath = (path) => {
    if (!path) return null;
    return path.split('.')[0].split('[')[0];
};

// ============================================================================
// HOOK DEFINITION
// ============================================================================

/**
 * Custom hook for managing form data changes with state tracking
 * @hook
 * @function useFormHandlers
 * @param {Object} config - Hook configuration
 * @param {Function} config.setEditorFormData - State setter for form data
 * @param {Function} config.setIsDirty - State setter for dirty flag
 * @param {Function} config.setEditedSections - State setter for edited sections tracking
 * @returns {Object} Form manipulation handlers
 * @returns {Function} return.handleSimpleChange - Handler for simple field changes
 * @returns {Function} return.handleArrayItemChange - Handler for array item field changes
 * @returns {Function} return.handleAddItemToArray - Handler for adding items to arrays
 * @returns {Function} return.handleRemoveItemFromArray - Handler for removing items from arrays
 * @description Provides optimized, memoized handlers for all form data manipulations.
 * Automatically tracks which sections have been edited and marks the form as dirty.
 * @example
 * const { handleSimpleChange, handleArrayItemChange } = useFormHandlers({
 *   setEditorFormData,
 *   setIsDirty,
 *   setEditedSections
 * });
 * handleSimpleChange('profile.name', 'John Doe');
 */
export const useFormHandlers = ({ setEditorFormData, setIsDirty, setEditedSections }) => {
    /**
     * Handles simple field value changes
     * @function handleSimpleChange
     * @param {string} fieldPath - The path to the field (e.g., "profile.name")
     * @param {*} value - The new value to set
     * @returns {void}
     * @description Updates a single field value in the form data, marks the form as dirty,
     * and tracks which section was edited.
     */
    const handleSimpleChange = useCallback((fieldPath, value) => {
        setIsDirty(true);
        const sectionKey = getSectionKeyFromPath(fieldPath);
        if (sectionKey) {
            setEditedSections(prev => new Set(prev).add(sectionKey));
        }
        setEditorFormData(prev => set(cloneDeep(prev), `content.${fieldPath}`, value));
    }, [setEditorFormData, setIsDirty, setEditedSections]);

    /**
     * Handles field changes within array items
     * @function handleArrayItemChange
     * @param {string} arrayPath - The path to the array (e.g., "experience")
     * @param {number} idx - The index of the item in the array
     * @param {string} field - The field name within the item
     * @param {*} value - The new value to set
     * @returns {void}
     * @description Updates a field within an array item (e.g., updating company name
     * in the second experience entry).
     */
    const handleArrayItemChange = useCallback((arrayPath, idx, field, value) => {
        setIsDirty(true);
        const sectionKey = getSectionKeyFromPath(arrayPath);
        if (sectionKey) {
            setEditedSections(prev => new Set(prev).add(sectionKey));
        }
        setEditorFormData(prev => set(cloneDeep(prev), `content.${arrayPath}[${idx}].${field}`, value));
    }, [setEditorFormData, setIsDirty, setEditedSections]);

    /**
     * Adds a new item to an array field
     * @function handleAddItemToArray
     * @param {string} arrayPath - The path to the array (e.g., "experience")
     * @param {Object} [item={}] - The item to add (uses empty object as default)
     * @returns {void}
     * @description Appends a new item to an array field, initializing the array if needed.
     * Used for adding new experiences, education entries, skills, etc.
     */
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
  
    /**
     * Removes an item from an array field
     * @function handleRemoveItemFromArray
     * @param {string} arrayPath - The path to the array (e.g., "experience")
     * @param {number} idx - The index of the item to remove
     * @returns {void}
     * @description Removes an item at the specified index from an array field.
     * Returns unchanged data if the path doesn't point to an array.
     */
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