// const escapeHtml = (value) => {
//   if (value === null || value === undefined) {
//     return '';
//   }
//   const str = String(value);
//   return str
//     .replace(/&/g, '&amp;')
//     .replace(/</g, '&lt;')
//     .replace(/>/g, '&gt;')
//     .replace(/"/g, '&quot;')
//     .replace(/'/g, '&#39;');
// };

// const generalPreviewHtml = (code, data) => {
//     if (!code) {
//         return '<p style="text-align:center; padding:20px;">Template code is missing.</p>';
//     }

//     if (!data || Object.keys(data).length === 0) {
//         return code;
//     }

//     let processedCode = code;
//     const loopRegex = /\{\{#each\s+([\w.-]+)\s*\}\}([\s\S]*?)\{\{\/each\s*\1\s*\}\}/gi;

//     processedCode = processedCode.replace(loopRegex, (fullMatch, arrayName, itemHtmlTemplate) => {
//         const dataArray = data[arrayName];

//         if (Array.isArray(dataArray) && dataArray.length > 0) {
//         let allRenderedItemsHtml = '';

//         dataArray.forEach(itemObject => {
//             if (typeof itemObject !== 'object' || itemObject === null) {
//             return;
//             }

//             let currentItemRenderHtml = itemHtmlTemplate;

//             for (const propertyName in itemObject) {
//             if (Object.prototype.hasOwnProperty.call(itemObject, propertyName)) {
//                 const propertyValue = itemObject[propertyName];
//                 const escapedPropertyValue = escapeHtml(propertyValue);

//                 const placeholderInItemRegex = new RegExp(`\\{\\{\\s*this\\.${propertyName}\\s*\\}\\}`, 'gi');
//                 currentItemRenderHtml = currentItemRenderHtml.replace(placeholderInItemRegex, escapedPropertyValue);
//             }
//             }
//             allRenderedItemsHtml += currentItemRenderHtml;
//         });
//         return allRenderedItemsHtml;
//         }
//         return '';
//     });

//     const replaceSimpleAndNestedPlaceholders = (currentHtml, dataObject, pathPrefix = '') => {
//         let htmlBeingProcessed = currentHtml;

//         for (const key in dataObject) {
//         if (Object.prototype.hasOwnProperty.call(dataObject, key)) {
//             const value = dataObject[key];
//             const fullPlaceholderKey = pathPrefix ? `${pathPrefix}.${key}` : key;

//             if (Array.isArray(value)) {
//             continue;
//             } else if (typeof value === 'object' && value !== null) {
//             htmlBeingProcessed = replaceSimpleAndNestedPlaceholders(htmlBeingProcessed, value, fullPlaceholderKey);
//             } else {
//             const escapedValue = escapeHtml(value);
//             const placeholderRegex = new RegExp(`\\{\\{\\s*${fullPlaceholderKey.replace(/\./g, '\\.')}\\s*\\}\\}`, 'gi');
//             htmlBeingProcessed = htmlBeingProcessed.replace(placeholderRegex, escapedValue);
//             }
//         }
//         }
//         return htmlBeingProcessed;
//     };

//     processedCode = replaceSimpleAndNestedPlaceholders(processedCode, data);

//     return processedCode;
// };

// const resumeHtml = (code , data) => {
//     return generalPreviewHtml(code, data)
// }

// export default resumeHtml



// import { get } from 'lodash';

// // Basic HTML sanitizer to prevent XSS. 
// // For a production app, a more robust library like DOMPurify is recommended.
// const escapeHtml = (value) => {
//   if (value === null || value === undefined) {
//     return '';
//   }
//   const str = String(value);
//   return str
//     .replace(/&/g, '&amp;')
//     .replace(/</g, '&lt;')
//     .replace(/>/g, '&gt;')
//     .replace(/"/g, '&quot;')
//     .replace(/'/g, '&#39;');
// };

// /**
//  * Processes a template string with given data, supporting {{placeholder}}, {{#each ...}}, and {{#if ...}} blocks.
//  * @param {string} code - The HTML template code with Handlebars-like syntax.
//  * @param {object} data - The data object to populate the template.
//  * @returns {string} The processed HTML string.
//  */
// const generateResumeHtml = (code, data, spacingMultiplier = 1) => {
//     if (!code) {
//         return '<p style="text-align:center; padding:20px;">Template code is missing.</p>';
//     }
//     console.log(data)
//     const containerTag = '<div class="resume__container" id="resume">';
//     const containerTagWithStyle = `<div class="resume__container" id="resume" style="--spacing-multiplier: ${spacingMultiplier};">`;
//     code = code.replace(containerTag, containerTagWithStyle);

//     if (!data || Object.keys(data).length === 0) {
//         // Return code after removing blocks that depend on data
//         let cleanedCode = code.replace(/\{\{#each\s+[\w.-]+\s*\}\}[\s\S]*?\{\{\/each\s*[\w.-]+\s*\}\}/gi, '');
//         cleanedCode = cleanedCode.replace(/\{\{#if\s+[\w.-]+\s*\}\}[\s\S]*?\{\{\/if\s*[\w.-]+\s*\}\}/gi, '');
//         return cleanedCode;
//     }

//     let processedCode = code;

//     // --- 1. Handle Conditional Blocks: {{#if property}}...{{/if}} ---
//     // This regex now correctly handles nested structures and multiline content.
//     const ifRegex = /\{\{#if\s+([\w.-]+)\s*\}\}([\s\S]*?)\{\{\/if\s*\1\s*\}\}/gi;
//     processedCode = processedCode.replace(ifRegex, (fullMatch, conditionPath, innerHtml) => {
//         const value = get(data, conditionPath);
//         // Render the inner block if the value is "truthy" (not null, undefined, false, 0, or empty string/array)
//         const isTruthy = Array.isArray(value) ? value.length > 0 : !!value;
//         return isTruthy ? innerHtml : '';
//     });


//     // --- 2. Handle Loop Blocks: {{#each array}}...{{/each}} ---
//     const loopRegex = /\{\{#each\s+([\w.-]+)\s*\}\}([\s\S]*?)\{\{\/each\s*\1\s*\}\}/gi;
//     processedCode = processedCode.replace(loopRegex, (fullMatch, arrayName, itemHtmlTemplate) => {
//         const dataArray = get(data, arrayName);

//         if (Array.isArray(dataArray) && dataArray.length > 0) {
//             let allRenderedItemsHtml = '';
//             dataArray.forEach(itemObject => {
//                 let currentItemRenderHtml = itemHtmlTemplate;
                
//                 // Replace `this.property` placeholders within the loop item
//                 if (typeof itemObject === 'object' && itemObject !== null) {
//                     for (const propertyName in itemObject) {
//                         if (Object.prototype.hasOwnProperty.call(itemObject, propertyName)) {
//                             const propertyValue = itemObject[propertyName];
//                             const placeholderInItemRegex = new RegExp(`\\{\\{\\s*this\\.${propertyName}\\s*\\}\\}`, 'gi');
//                             currentItemRenderHtml = currentItemRenderHtml.replace(placeholderInItemRegex, escapeHtml(propertyValue));
//                         }
//                     }
//                 } else if (typeof itemObject === 'string') {
//                     // Handle simple arrays of strings, e.g., {{#each skills}}<li>{{this}}</li>{{/each}}
//                      const placeholderInItemRegex = new RegExp(`\\{\\{\\s*this\\s*\\}\\}`, 'gi');
//                      currentItemRenderHtml = currentItemRenderHtml.replace(placeholderInItemRegex, escapeHtml(itemObject));
//                 }

//                 // Clean up any remaining `this` placeholders if some properties didn't exist
//                 currentItemRenderHtml = currentItemRenderHtml.replace(/\{\{\s*this\.[\w.-]+\s*\}\}/gi, '');
//                 allRenderedItemsHtml += currentItemRenderHtml;
//             });
//             return allRenderedItemsHtml;
//         }
//         return ''; // Return empty string if array is not found or empty
//     });

//     // --- 3. Handle Simple & Nested Placeholders: {{path.to.value}} ---
//     const replaceSimpleAndNestedPlaceholders = (currentHtml, dataObject, pathPrefix = '') => {
//         let htmlBeingProcessed = currentHtml;

//         for (const key in dataObject) {
//             if (Object.prototype.hasOwnProperty.call(dataObject, key)) {
//                 const value = dataObject[key];
//                 const fullPlaceholderKey = pathPrefix ? `${pathPrefix}.${key}` : key;

//                 if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
//                     // Recurse into nested objects
//                     htmlBeingProcessed = replaceSimpleAndNestedPlaceholders(htmlBeingProcessed, value, fullPlaceholderKey);
//                 } else if (!Array.isArray(value)) { 
//                     // It's a simple value (string, number, boolean), not an array
//                     const placeholderRegex = new RegExp(`\\{\\{\\s*${fullPlaceholderKey.replace(/\./g, '\\.')}\\s*\\}\\}`, 'gi');
//                     htmlBeingProcessed = htmlBeingProcessed.replace(placeholderRegex, escapeHtml(value));
//                 }
//             }
//         }
//         return htmlBeingProcessed;
//     };
    
//     processedCode = replaceSimpleAndNestedPlaceholders(processedCode, data);

//     // --- 4. Final Cleanup: Remove any remaining placeholders ---
//     processedCode = processedCode.replace(/\{\{[\s\S]*?\}\}/g, '');

//     return processedCode;
// };

// export default generateResumeHtml;


import { get } from 'lodash';

// Basic HTML sanitizer to prevent XSS. 
const escapeHtml = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};


const processBlockWithContext = (htmlBlock, contextObject) => {
    let processedHtml = htmlBlock;

    // 1. Process conditional blocks within the item (e.g., {{#if this.gpa}})
    const ifRegex = /\{\{#if\s+this\.([\w.-]+)\s*\}\}([\s\S]*?)\{\{\/if\s+this\.\1\s*\}\}/gi;
    processedHtml = processedHtml.replace(ifRegex, (match, propertyName, innerBlock) => {
        const value = get(contextObject, propertyName);
        const isTruthy = Array.isArray(value) ? value.length > 0 : !!value;
        return isTruthy ? innerBlock : '';
    });

    // 2. Process simple placeholders within the item (e.g., {{this.institution}})
    for (const key in contextObject) {
        if (Object.prototype.hasOwnProperty.call(contextObject, key)) {
            const placeholderRegex = new RegExp(`\\{\\{\\s*this\\.${key}\\s*\\}\\}`, 'gi');
            processedHtml = processedHtml.replace(placeholderRegex, escapeHtml(contextObject[key]));
        }
    }
    
    // Handle {{this}} for simple string arrays
    if(typeof contextObject === 'string') {
        processedHtml = processedHtml.replace(/\{\{\s*this\s*\}\}/gi, escapeHtml(contextObject));
    }

    return processedHtml;
};


/**
 * The main template processing function.
 * @param {string} code - The HTML template code with Handlebars-like syntax.
 * @param {object} data - The full data object, including `content` and `sectionsConfig`.
 * @returns {string} The processed HTML string.
 */
const generateResumeHtml = (code, data, spacingMultiplier = 1) => {
    if (!code) {
        return '<p style="text-align:center; padding:20px;">Template code is missing.</p>';
    }

    // Apply spacing multiplier
    const containerTag = '<div class="resume__container" id="resume">';
    const containerTagWithStyle = `<div class="resume__container" id="resume" style="--spacing-multiplier: ${spacingMultiplier};">`;
    code = code.replace(containerTag, containerTagWithStyle);

    if (!data || Object.keys(data).length === 0) {
        let cleanedCode = code.replace(/\{\{#each\s+[\w.-]+\s*\}\}[\s\S]*?\{\{\/each\s*[\w.-]+\s*\}\}/gi, '');
        cleanedCode = cleanedCode.replace(/\{\{#if\s+[\w.-]+\s*\}\}[\s\S]*?\{\{\/if\s*[\w.-]+\s*\}\}/gi, '');
        return cleanedCode;
    }

    let processedCode = code;

    // --- 1. Handle TOP-LEVEL Conditional Blocks: {{#if sectionsConfig.education.enabled}} ---
    const topLevelIfRegex = /\{\{#if\s+([\w.-]+)\s*\}\}([\s\S]*?)\{\{\/if\s+\1\s*\}\}/gi;
    processedCode = processedCode.replace(topLevelIfRegex, (fullMatch, conditionPath, innerHtml) => {
        // Exclude 'this.' paths, as those are handled inside loops
        if (conditionPath.startsWith('this.')) {
            return fullMatch;
        }
        const value = get(data, conditionPath);
        const isTruthy = Array.isArray(value) ? value.length > 0 : !!value;
        return isTruthy ? innerHtml : '';
    });

    // --- 2. Handle Loop Blocks: {{#each content.education}} ---
    const loopRegex = /\{\{#each\s+([\w.-]+)\s*\}\}([\s\S]*?)\{\{\/each\s+\1\s*\}\}/gi;
    processedCode = processedCode.replace(loopRegex, (fullMatch, arrayName, itemHtmlTemplate) => {
        const dataArray = get(data, arrayName);
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            return ''; // Return empty string if array is not found or empty
        }
        
        // For each item in the array, process its HTML block with the item as the context
        return dataArray.map(itemObject => processBlockWithContext(itemHtmlTemplate, itemObject)).join('');
    });

    // --- 3. Handle Remaining Simple & Nested Placeholders: {{content.name}} ---
    const replacePlaceholders = (html, dataObject, prefix = '') => {
        let currentHtml = html;
        for (const key in dataObject) {
            if (Object.prototype.hasOwnProperty.call(dataObject, key)) {
                const value = dataObject[key];
                const fullKey = prefix ? `${prefix}.${key}` : key;
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    currentHtml = replacePlaceholders(currentHtml, value, fullKey);
                } else if (!Array.isArray(value)) {
                    const regex = new RegExp(`\\{\\{\\s*${fullKey.replace(/\./g, '\\.')}\\s*\\}\\}`, 'gi');
                    currentHtml = currentHtml.replace(regex, escapeHtml(value));
                }
            }
        }
        return currentHtml;
    };
    
    processedCode = replacePlaceholders(processedCode, data);

    // --- 4. Final Cleanup: Remove any remaining placeholders ---
    processedCode = processedCode.replace(/\{\{[\s\S]*?\}\}/g, '');

    return processedCode;
};

export default generateResumeHtml;