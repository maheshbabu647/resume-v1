/**
 * @fileoverview Editor Utilities - Helper functions for resume editor operations
 * @module utils/EditorUtils
 * @description Provides utility functions for managing template field definitions,
 * calculating progress, initializing form data, and detecting placeholder content.
 */

import { get, set } from 'lodash';

// ============================================================================
// SECTION MANAGEMENT
// ============================================================================

/**
 * Parses template definitions to extract unique section properties
 * @function getSectionProperties
 * @param {Array<Object>} definitions - The template field definition array
 * @returns {Object} An object mapping section keys to their properties
 * @property {string} label - Display label for the section
 * @property {boolean} isCore - Whether the section is a core section (always visible)
 * @property {Array<string>|null} recommendedFor - Industries this section is recommended for
 * @property {boolean} isToggleable - Whether the section can be toggled on/off
 * @description Extracts and organizes section metadata from template field definitions,
 * determining which sections can be toggled and which industries they're recommended for.
 * @example
 * const properties = getSectionProperties(templateDefs);
 * console.log(properties.experience.label); // "Work Experience"
 * console.log(properties.experience.isCore); // true
 */
export const getSectionProperties = (definitions) => {
  if (!Array.isArray(definitions)) return {};
  return definitions.reduce((acc, field) => {
    if (field.section && !acc[field.section]) {
      const sectionDef = definitions.find(def => def.section === field.section);
      acc[field.section] = {
        label: sectionDef?.sectionLabel || field.section.charAt(0).toUpperCase() + field.section.slice(1).replace(/([A-Z])/g, ' $1').trim(),
        isCore: sectionDef?.isCore || false,
        recommendedFor: sectionDef?.recommendedFor || null,
        isToggleable: !sectionDef?.isCore
      };
    }
    return acc;
  }, {});
};

// ============================================================================
// FORM DATA INITIALIZATION
// ============================================================================

/**
 * Initializes form data structure based on template definitions and selected industry
 * @function initializeFormDataFromDefinitions
 * @param {Array<Object>} definitions - The template field definition array
 * @param {string|null} selectedIndustry - The target industry (determines section visibility)
 * @returns {Object} Form data structure
 * @returns {Object} return.content - The initialized content data with default values
 * @returns {Object} return.sectionsConfig - Configuration for section visibility
 * @description Creates the initial form data structure with appropriate default values
 * and section visibility based on the selected industry. Core sections are always enabled,
 * while industry-specific sections are conditionally enabled.
 * @example
 * const formData = initializeFormDataFromDefinitions(template.fieldDefs, 'Technology');
 * // Returns: { content: {...}, sectionsConfig: { experience: { enabled: true }, ...} }
 */
export const initializeFormDataFromDefinitions = (definitions, selectedIndustry) => {
    const content = {};
    const sectionsConfig = {};
    if (!Array.isArray(definitions)) return { content, sectionsConfig };

    const uniqueSections = getSectionProperties(definitions);

    for (const sectionKey in uniqueSections) {
        const { isCore, recommendedFor } = uniqueSections[sectionKey];
        let isEnabled;
        
        if (!selectedIndustry) {
            // When no industry is selected (skip mode), only enable core sections
            isEnabled = isCore;
        } else {
            // When industry is selected, enable core sections or industry-recommended sections
            isEnabled = isCore || !recommendedFor || recommendedFor.includes(selectedIndustry);
        }
        
        sectionsConfig[sectionKey] = { enabled: isEnabled };
    }

    definitions.forEach(fieldDef => {
        const path = (fieldDef.section && fieldDef.name !== fieldDef.section) ? `${fieldDef.section}.${fieldDef.name}` : fieldDef.name;
        if (fieldDef.defaultValue !== undefined) { 
            set(content, path, fieldDef.defaultValue); 
        } else if (fieldDef.type === 'group' && fieldDef.repeatable) {
            const sampleItem = {};
            if (Array.isArray(fieldDef.subFields)) {
                fieldDef.subFields.forEach(subField => { 
                    sampleItem[subField.name] = subField.defaultValue !== undefined ? subField.defaultValue : ''; 
                });
            }
            set(content, path, [sampleItem]);
        } else { 
            set(content, path, ''); 
        }
    });

    return { content, sectionsConfig };
};

/**
 * Initializes sectionsConfig based on which sections have actual data in the content
 * @function initializeSectionsConfigFromData
 * @param {Array<Object>} definitions - The template field definition array
 * @param {Object} contentData - The actual content data (from parsed resume)
 * @returns {Object} sectionsConfig - Configuration for section visibility
 * @description Creates sectionsConfig that enables only sections that have actual data.
 * Core sections are always checked, and sections with data are enabled.
 * @example
 * const config = initializeSectionsConfigFromData(template.fieldDefs, parsedContent);
 * // Returns: { profile: { enabled: true }, experience: { enabled: false }, ...}
 */
export const initializeSectionsConfigFromData = (definitions, contentData) => {
    const sectionsConfig = {};
    if (!Array.isArray(definitions) || !contentData) return sectionsConfig;

    const uniqueSections = getSectionProperties(definitions);

    // Helper function to check if a value has actual data (not empty, not placeholder)
    const hasData = (value) => {
        if (value === null || value === undefined || value === '') return false;
        if (typeof value === 'string') {
            const trimmed = value.trim();
            if (!trimmed || /^\[.*\]$/.test(trimmed)) return false;
            return true;
        }
        if (Array.isArray(value)) {
            return value.some(item => {
                if (typeof item === 'object' && item !== null) {
                    return Object.values(item).some(val => hasData(val));
                }
                return hasData(item);
            });
        }
        if (typeof value === 'object') {
            return Object.values(value).some(val => hasData(val));
        }
        return true; // numbers, booleans, etc.
    };

    // Check each section to see if it has data
    for (const sectionKey in uniqueSections) {
        const { isCore } = uniqueSections[sectionKey];
        
        // Get all fields belonging to this section
        const sectionFields = definitions.filter(fieldDef => 
            (fieldDef.section === sectionKey) || 
            (fieldDef.name === sectionKey && !fieldDef.section)
        );
        
        // Check if any field in this section has data
        const sectionHasData = sectionFields.some(fieldDef => {
            const path = (fieldDef.section && fieldDef.name !== fieldDef.section) 
                ? `${fieldDef.section}.${fieldDef.name}` 
                : fieldDef.name;
            const value = get(contentData, path);
            return hasData(value);
        });
        
        // Enable section if it's core OR if it has data
        sectionsConfig[sectionKey] = { enabled: isCore || sectionHasData };
    }

    return sectionsConfig;
};

// ============================================================================
// PLACEHOLDER DETECTION
// ============================================================================

/**
 * Recursively checks for placeholder text in form data
 * @function hasUntouchedPlaceholders
 * @param {*} data - The data to check (string, array, or object)
 * @returns {boolean} True if placeholder text (format: [Text]) is found
 * @description Recursively traverses form data to detect untouched placeholder values
 * that match the pattern [FieldName]. Used to warn users before saving/downloading.
 * @example
 * hasUntouchedPlaceholders('[Your Name]'); // true
 * hasUntouchedPlaceholders('John Doe'); // false
 * hasUntouchedPlaceholders({ name: '[Name]', email: 'test@test.com' }); // true
 */
export const hasUntouchedPlaceholders = (data) => {
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

// ============================================================================
// PROGRESS CALCULATION
// ============================================================================

/**
 * Calculates the completion progress of the resume
 * @function calculateProgressData
 * @param {Array<Object>} definitions - The template field definition array
 * @param {Object} formData - The current form data with content and sectionsConfig
 * @returns {Object} Progress information
 * @returns {number} return.completed - Number of completed sections
 * @returns {number} return.total - Total number of active sections
 * @returns {number} return.progress - Completion percentage (0-100)
 * @description Analyzes form data to determine resume completion status. A section
 * is considered complete if it has at least one non-placeholder, non-empty value.
 * Only enabled sections are counted toward the total.
 * @example
 * const progress = calculateProgressData(templateDefs, formData);
 * // Returns: { completed: 5, total: 8, progress: 62.5 }
 */
export const calculateProgressData = (definitions, formData) => {
    const sections = definitions.reduce((acc, field) => {
        acc[field.section] = acc[field.section] || [];
        acc[field.section].push(field);
        return acc;
    }, {});
    
    const sectionKeys = Object.keys(sections);
    const sectionsConfig = formData.sectionsConfig || {};

    const activeSections = sectionKeys.filter(key => {
        const isToggleable = sectionsConfig[key] !== undefined;
        return !isToggleable || sectionsConfig[key].enabled;
    });

    let completedCount = 0;
    activeSections.forEach(sectionKey => {
        const fields = sections[sectionKey];
        let isSectionCompleted = false;
        for (const field of fields) {
            const placeholderRegex = /^\[.*\]$/;
            
            // Construct the correct path to check for the field value
            const fieldPath = (field.section && field.name !== field.section) 
                ? `${field.section}.${field.name}` 
                : field.name;
            
            if (field.type === 'group' && field.repeatable) {
                const items = get(formData.content, fieldPath, []);
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
                const value = get(formData.content, fieldPath, '');
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
};
// ============================================================================
// SECTION STATE TRACKING
// ============================================================================

/**
 * Determines which sections have been edited based on content data
 * @function getInitiallyEditedSections
 * @param {Object} content - The resume content data
 * @param {Array<Object>} fieldDefinitions - Template field definitions
 * @returns {Set<string>} Set of section keys that contain user-entered data
 * @description Analyzes content to identify sections that have meaningful data
 * (non-empty, non-placeholder values). Used for visual indicators and tracking
 * which sections have been populated, especially after resume import.
 * @example
 * const editedSections = getInitiallyEditedSections(content, fieldDefs);
 * // Returns: Set { 'experience', 'education', 'skills' }
 */
export const getInitiallyEditedSections = (content, fieldDefinitions) => {
  if (!content || !Array.isArray(fieldDefinitions)) {
    return new Set();
  }

  const sectionsWithData = new Set();
  const placeholderRegex = /\[.*\]/;

  const allSectionKeys = [...new Set(fieldDefinitions.map(f => f.section).filter(Boolean))];

  allSectionKeys.forEach(sectionKey => {
    const sectionFields = fieldDefinitions.filter(f => f.section === sectionKey);
    
    const hasData = sectionFields.some(fieldDef => {
      const dataPath = (fieldDef.section && fieldDef.name !== fieldDef.section) 
        ? `${fieldDef.section}.${fieldDef.name}` 
        : fieldDef.name;
      const value = get(content, dataPath);

    if (fieldDef.type === 'group' && fieldDef.repeatable) {
      if (!Array.isArray(value) || value.length === 0) {
        return false; 
      }
      return value.some(item =>
        Object.values(item).some(fieldValue =>
          typeof fieldValue === 'string' && fieldValue.trim() !== ''
        )
      );
    }
      return typeof value === 'string' && value.trim() !== '' && !placeholderRegex.test(value);
    });

    if (hasData) {
      sectionsWithData.add(sectionKey);
    }
  });

  return sectionsWithData;
};