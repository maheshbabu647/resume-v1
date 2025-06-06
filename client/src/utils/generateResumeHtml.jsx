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



import { get } from 'lodash';

// Basic HTML sanitizer to prevent XSS. 
// For a production app, a more robust library like DOMPurify is recommended.
const escapeHtml = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  const str = String(value);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Processes a template string with given data, supporting {{placeholder}}, {{#each ...}}, and {{#if ...}} blocks.
 * @param {string} code - The HTML template code with Handlebars-like syntax.
 * @param {object} data - The data object to populate the template.
 * @returns {string} The processed HTML string.
 */
const generateResumeHtml = (code, data) => {
    if (!code) {
        return '<p style="text-align:center; padding:20px;">Template code is missing.</p>';
    }

    if (!data || Object.keys(data).length === 0) {
        // Return code after removing blocks that depend on data
        let cleanedCode = code.replace(/\{\{#each\s+[\w.-]+\s*\}\}[\s\S]*?\{\{\/each\s*[\w.-]+\s*\}\}/gi, '');
        cleanedCode = cleanedCode.replace(/\{\{#if\s+[\w.-]+\s*\}\}[\s\S]*?\{\{\/if\s*[\w.-]+\s*\}\}/gi, '');
        return cleanedCode;
    }

    let processedCode = code;

    // --- 1. Handle Conditional Blocks: {{#if property}}...{{/if}} ---
    // This regex now correctly handles nested structures and multiline content.
    const ifRegex = /\{\{#if\s+([\w.-]+)\s*\}\}([\s\S]*?)\{\{\/if\s*\1\s*\}\}/gi;
    processedCode = processedCode.replace(ifRegex, (fullMatch, conditionPath, innerHtml) => {
        const value = get(data, conditionPath);
        // Render the inner block if the value is "truthy" (not null, undefined, false, 0, or empty string/array)
        const isTruthy = Array.isArray(value) ? value.length > 0 : !!value;
        return isTruthy ? innerHtml : '';
    });


    // --- 2. Handle Loop Blocks: {{#each array}}...{{/each}} ---
    const loopRegex = /\{\{#each\s+([\w.-]+)\s*\}\}([\s\S]*?)\{\{\/each\s*\1\s*\}\}/gi;
    processedCode = processedCode.replace(loopRegex, (fullMatch, arrayName, itemHtmlTemplate) => {
        const dataArray = get(data, arrayName);

        if (Array.isArray(dataArray) && dataArray.length > 0) {
            let allRenderedItemsHtml = '';
            dataArray.forEach(itemObject => {
                let currentItemRenderHtml = itemHtmlTemplate;
                
                // Replace `this.property` placeholders within the loop item
                if (typeof itemObject === 'object' && itemObject !== null) {
                    for (const propertyName in itemObject) {
                        if (Object.prototype.hasOwnProperty.call(itemObject, propertyName)) {
                            const propertyValue = itemObject[propertyName];
                            const placeholderInItemRegex = new RegExp(`\\{\\{\\s*this\\.${propertyName}\\s*\\}\\}`, 'gi');
                            currentItemRenderHtml = currentItemRenderHtml.replace(placeholderInItemRegex, escapeHtml(propertyValue));
                        }
                    }
                } else if (typeof itemObject === 'string') {
                    // Handle simple arrays of strings, e.g., {{#each skills}}<li>{{this}}</li>{{/each}}
                     const placeholderInItemRegex = new RegExp(`\\{\\{\\s*this\\s*\\}\\}`, 'gi');
                     currentItemRenderHtml = currentItemRenderHtml.replace(placeholderInItemRegex, escapeHtml(itemObject));
                }

                // Clean up any remaining `this` placeholders if some properties didn't exist
                currentItemRenderHtml = currentItemRenderHtml.replace(/\{\{\s*this\.[\w.-]+\s*\}\}/gi, '');
                allRenderedItemsHtml += currentItemRenderHtml;
            });
            return allRenderedItemsHtml;
        }
        return ''; // Return empty string if array is not found or empty
    });

    // --- 3. Handle Simple & Nested Placeholders: {{path.to.value}} ---
    const replaceSimpleAndNestedPlaceholders = (currentHtml, dataObject, pathPrefix = '') => {
        let htmlBeingProcessed = currentHtml;

        for (const key in dataObject) {
            if (Object.prototype.hasOwnProperty.call(dataObject, key)) {
                const value = dataObject[key];
                const fullPlaceholderKey = pathPrefix ? `${pathPrefix}.${key}` : key;

                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    // Recurse into nested objects
                    htmlBeingProcessed = replaceSimpleAndNestedPlaceholders(htmlBeingProcessed, value, fullPlaceholderKey);
                } else if (!Array.isArray(value)) { 
                    // It's a simple value (string, number, boolean), not an array
                    const placeholderRegex = new RegExp(`\\{\\{\\s*${fullPlaceholderKey.replace(/\./g, '\\.')}\\s*\\}\\}`, 'gi');
                    htmlBeingProcessed = htmlBeingProcessed.replace(placeholderRegex, escapeHtml(value));
                }
            }
        }
        return htmlBeingProcessed;
    };
    
    processedCode = replaceSimpleAndNestedPlaceholders(processedCode, data);

    // --- 4. Final Cleanup: Remove any remaining placeholders ---
    processedCode = processedCode.replace(/\{\{[\s\S]*?\}\}/g, '');

    return processedCode;
};

export default generateResumeHtml;
