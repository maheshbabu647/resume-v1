import { get, set } from 'lodash';

/**
 * Parses template definitions to extract unique section properties.
 * @param {Array} definitions - The template field definition array.
 * @returns {Object} An object mapping section keys to their properties.
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

/**
 * Initializes form data structure based on template definitions and a selected industry.
 * @param {Array} definitions - The template field definition array.
 * @param {string} selectedIndustry - The industry to determine which sections are enabled.
 * @returns {Object} An object with `content` and `sectionsConfig`.
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
 * Recursively checks for placeholder text (e.g., "[Your Name]") in form data.
 * @param {*} data - The data to check (can be a string, array, or object).
 * @returns {boolean} True if placeholder text is found.
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

/**
 * Calculates the completion progress of the resume.
 * @param {Array} definitions - The template field definition array.
 * @param {Object} formData - The current form data.
 * @returns {Object} An object with `completed`, `total`, and `progress` percentage.
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
            const placeholderRegex = /\[.*\]/;
            if (field.type === 'group' && field.repeatable) {
                const items = get(formData.content, field.name, []);
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
                const value = get(formData.content, field.name, '');
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