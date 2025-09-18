// import Handlebars from 'handlebars';

// // --- Handlebars Helpers ---
// // This 'if' helper ensures sections or links only appear if the user has provided data for them.
// Handlebars.registerHelper('if', function(conditional, options) {
//   // Supports checking for non-empty arrays as well as truthy values.
//   if ((Array.isArray(conditional) && conditional.length > 0) || (!Array.isArray(conditional) && conditional)) {
//     return options.fn(this);
//   } else {
//     return options.inverse(this);
//   }
// });

// /// --- Add the new 'any' helper here ---
// Handlebars.registerHelper('any', function (...args) {
//   args.pop();
//   return args.some(conditional => {
//     return (Array.isArray(conditional) && conditional.length > 0) || (!Array.isArray(conditional) && conditional);
//   });
// });

// Handlebars.registerHelper('is_array', function (value) {
//   return Array.isArray(value);
// });


// Handlebars.registerHelper('formatAsList', function(text) {
//   if (!text || typeof text !== 'string') {
//     return '';
//   }
//   const items = text.split('\n')
//                     .filter(line => line.trim() !== '')
//                     .map(line => `<li>${Handlebars.escapeExpression(line.trim())}</li>`)
//                     .join('');
  
//   if (items) {
//     return new Handlebars.SafeString(`<ul>${items}</ul>`);
//   }
//   return '';
// });

// Handlebars.registerHelper('eq', function (a, b) {
//   return a === b;
// });

// Handlebars.registerHelper('sanitizeUrl', function(url) {
//   if (!url || typeof url !== 'string') {
//     return '#'; 
//   }
//   const cleanedUrl = url.replace(/^https?:\/\//, '');
//   return `https://${cleanedUrl}`;
// });

// /**
//  * Assembles a complete, self-contained HTML resume snippet from modular pieces and user data.
//  * This version is designed to be injected into a div to prevent iframe flickering.
//  * @param {string} htmlShell - This parameter is no longer used but is kept for API consistency.
//  * @param {string} baseCss - The foundational CSS for the template.
//  * @param {Array} sections - The library of all available section modules.
//  * @param {Array} stylePacks - The library of all available style themes.
//  * @param {string} selectedStylePackKey - The key of the currently selected style pack.
//  * @param {object} sectionOrder - Defines which sections to show and in what order (e.g., { header: [...], main_column: [...] }).
//  * @param {object} currentFormData - The user's complete form data.
//  * @param {number} spacingMultiplier - The value for adjusting template spacing.
//  * @returns {string} The final, renderable HTML string for the resume.
//  */
// const generateResumeHtml = (
//   htmlShell, // No longer used, but kept in signature to avoid breaking component props.
//   baseCss,
//   sections,
//   stylePacks,
//   selectedStylePackKey,
//   sectionOrder,
//   currentFormData,
//   spacingMultiplier
// ) => {
//   // 1. Safety Check: Ensure all necessary template pieces are available.
//   if (!baseCss || !Array.isArray(sections) || !Array.isArray(stylePacks) || !sectionOrder) {
//     return '<div style="display: flex; justify-content: center; align-items: center; height: 100%; color: hsl(var(--muted-foreground)); font-family: sans-serif;">Template pieces are missing. Cannot render preview.</div>';
//   }

//   // 2. Combine Styles: Find the selected style pack, merge it with base CSS, and add dynamic spacing.
//   const selectedStylePack = stylePacks.find(pack => pack.key === selectedStylePackKey);
//   const stylePackCss = selectedStylePack ? selectedStylePack.css : '/* No style pack selected */';
  
//   const finalCssContent  = `
//       /* --- Base Template CSS --- */
//       ${baseCss || ''}

//       /* --- Selected Style Pack CSS --- */
//       ${stylePackCss}

//       /* --- Dynamic Spacing & Appearance CSS --- */
//       .rt-container { 
//         --rt-spacing: ${spacingMultiplier || 1}; 
//       }
//   `;

//   // 3. Prepare Section HTML: Create a map for quick lookup of section HTML by its key.
//   const sectionsHtmlMap = sections.reduce((acc, section) => {
//     acc[section.key] = section.html;
//     return acc;
//   }, {});

//   // 4. Assemble HTML for each layout slot (e.g., header, main_column).
//   const enabledSectionsConfig = currentFormData?.sectionsConfig || {};
//   const assembledSlots = {};

//   for (const slotKey in sectionOrder) {
//     if (Object.prototype.hasOwnProperty.call(sectionOrder, slotKey)) {
//       const orderedSectionKeys = sectionOrder[slotKey] || [];
      
//       const finalSectionsHtml = orderedSectionKeys
//         .filter(key => {
//           const isToggleable = enabledSectionsConfig[key] !== undefined;
//           // A section is included if it's not a toggleable section, OR if it is and it's enabled.
//           return !isToggleable || enabledSectionsConfig[key].enabled;
//         })
//         .map(key => sectionsHtmlMap[key] || ``)
//         .join('');
//       assembledSlots[slotKey] = finalSectionsHtml;
//     }
//   }
  
//   // 5. Build the Final, Self-Contained HTML Snippet.
//   // This is the core of the flicker-free solution. We create a string containing
//   // the styles and the resume content together, which can be safely injected into a div.

//   const finalHtmlSnippet = `
//     <style>
//       ${finalCssContent}
//     </style>
//     <div class="rt-container" id="resume">
//       ${assembledSlots['header'] || ''}
      
//       <div class="rt-body">
//         <div class="rt-left-column">${assembledSlots['left_column'] || ''}</div>
//         <div class="rt-right-column">${assembledSlots['right_column'] || ''}</div>
//       </div>

//       <div class="rt-main-column">${assembledSlots['main_column'] || ''}</div>

//     </div>
//   `;

//   // 6. Compile with Handlebars: Inject the user's actual data into the fully assembled template.
//   try {
//     const template = Handlebars.compile(finalHtmlSnippet);
//     return template({
//       content: currentFormData?.content || {},
//       sectionsConfig: enabledSectionsConfig,
//     });
//   } catch (error) {
//     console.error("Handlebars compilation error:", error);
//     return `<div style="display: flex; justify-content: center; align-items: center; height: 100%; color: red; font-family: sans-serif;">Error rendering template: ${error.message}</div>`;
//   }
// };

// export default generateResumeHtml;

// import Handlebars from 'handlebars';
// import { get, set } from 'lodash';

// // --- Handlebars Helpers (No changes needed here) ---
// Handlebars.registerHelper('if', function(conditional, options) {
//   if ((Array.isArray(conditional) && conditional.length > 0) || (!Array.isArray(conditional) && conditional)) {
//     return options.fn(this);
//   } else {
//     return options.inverse(this);
//   }
// });

// Handlebars.registerHelper('any', function (...args) {
//   args.pop();
//   return args.some(conditional => {
//     return (Array.isArray(conditional) && conditional.length > 0) || (!Array.isArray(conditional) && conditional);
//   });
// });

// Handlebars.registerHelper('is_array', function (value) {
//   return Array.isArray(value);
// });

// Handlebars.registerHelper('formatAsList', function(text) {
//   if (!text || typeof text !== 'string') {
//     return '';
//   }
//   const items = text.split('\n')
//                     .filter(line => line.trim() !== '')
//                     .map(line => `<li>${Handlebars.escapeExpression(line.trim())}</li>`)
//                     .join('');
  
//   if (items) {
//     return new Handlebars.SafeString(`<ul>${items}</ul>`);
//   }
//   return '';
// });

// Handlebars.registerHelper('eq', function (a, b) {
//   return a === b;
// });

// Handlebars.registerHelper('sanitizeUrl', function(url) {
//   if (!url || typeof url !== 'string') {
//     return '#'; 
//   }
//   const cleanedUrl = url.replace(/^https?:\/\//, '');
//   return `https://${cleanedUrl}`;
// });


// const generateResumeHtml = (
//   htmlShell,
//   baseCss,
//   sections,
//   stylePacks,
//   selectedStylePackKey,
//   sectionOrder,
//   currentFormData,
//   spacingMultiplier,
//   editedSections,
//   templateFieldDefinition
// ) => {
//   // Steps 1-5 remain the same
//   if (!baseCss || !Array.isArray(sections) || !Array.isArray(stylePacks) || !sectionOrder) {
//     return '<div style="display: flex; justify-content: center; align-items: center; height: 100%; color: hsl(var(--muted-foreground)); font-family: sans-serif;">Template pieces are missing. Cannot render preview.</div>';
//   }

//   const selectedStylePack = stylePacks.find(pack => pack.key === selectedStylePackKey);
//   const stylePackCss = selectedStylePack ? selectedStylePack.css : '';
//   const finalCssContent  = `
//       ${baseCss || ''}
//       ${stylePackCss}
//       .rt-container { --rt-spacing: ${spacingMultiplier || 1}; }
//   `;

//   const sectionsHtmlMap = sections.reduce((acc, section) => {
//     acc[section.key] = section.html;
//     return acc;
//   }, {});

//   const enabledSectionsConfig = currentFormData?.sectionsConfig || {};
//   const assembledSlots = {};
//   for (const slotKey in sectionOrder) {
//     if (Object.prototype.hasOwnProperty.call(sectionOrder, slotKey)) {
//       const orderedSectionKeys = sectionOrder[slotKey] || [];
//       const finalSectionsHtml = orderedSectionKeys
//         .filter(key => !enabledSectionsConfig[key] || enabledSectionsConfig[key].enabled)
//         .map(key => sectionsHtmlMap[key] || ``)
//         .join('');
//       assembledSlots[slotKey] = finalSectionsHtml;
//     }
//   }
  
//   const finalHtmlSnippet = `
//     <style>${finalCssContent}</style>
//     <div class="rt-container" id="resume">
//       ${assembledSlots['header'] || ''}
//       <div class="rt-body">
//         <div class="rt-left-column">${assembledSlots['left_column'] || ''}</div>
//         <div class="rt-right-column">${assembledSlots['right_column'] || ''}</div>
//       </div>
//       <div class="rt-main-column">${assembledSlots['main_column'] || ''}</div>
//     </div>
//   `;
  
//   // --- CORRECTED LOGIC BLOCK (Step 6) ---
//   const previewContent = {};
//   const realContent = currentFormData?.content || {};

//   if (templateFieldDefinition) {
//     templateFieldDefinition.forEach(fieldDef => {
//       const sectionKey = fieldDef.section;
//       const hasBeenEdited = editedSections?.has(sectionKey);
      
//       // CORRECTED PATH LOGIC
//       const dataPath = (fieldDef.section && fieldDef.name !== fieldDef.section) ? `${fieldDef.section}.${fieldDef.name}` : fieldDef.name;

//       if (fieldDef.type === 'group' && fieldDef.repeatable) {
//         const realItemsArray = get(realContent, dataPath) || [];
//         if (hasBeenEdited) {
//           set(previewContent, dataPath, realItemsArray);
//         } else {
//           const placeholderArray = realItemsArray.map(() => {
//             const placeholderItem = {};
//             (fieldDef.subFields || []).forEach(subField => {
//                 if (subField.type === 'group' && subField.repeatable) {
//                     const sampleSubItem = {};
//                      (subField.subFields || []).forEach(subSubField => {
//                          sampleSubItem[subSubField.name] = subSubField.livePreviewPlaceholder || '';
//                      });
//                      placeholderItem[subField.name] = [sampleSubItem];
//                 } else {
//                     placeholderItem[subField.name] = subField.livePreviewPlaceholder || '';
//                 }
//             });
//             return placeholderItem;
//           });
//           set(previewContent, dataPath, placeholderArray);
//         }
//       } else {
//         if (hasBeenEdited) {
//           set(previewContent, dataPath, get(realContent, dataPath));
//         } else {
//           set(previewContent, dataPath, fieldDef.livePreviewPlaceholder || '');
//         }
//       }
//     });
//   }

//   // 7. Compile with Handlebars
//   try {
//     const template = Handlebars.compile(finalHtmlSnippet);
//     return template({
//       content: previewContent,
//       sectionsConfig: enabledSectionsConfig,
//     });
//   } catch (error) {
//     console.error("Handlebars compilation error:", error);
//     return `<div style="display: flex; justify-content: center; align-items: center; height: 100%; color: red; font-family: sans-serif;">Error rendering template: ${error.message}</div>`;
//   }
// };

// export default generateResumeHtml;


import Handlebars from 'handlebars';
import { get, set } from 'lodash';

// --- Handlebars Helpers (No changes needed here) ---
Handlebars.registerHelper('if', function(conditional, options) {
  if ((Array.isArray(conditional) && conditional.length > 0) || (!Array.isArray(conditional) && conditional)) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper('any', function (...args) {
  args.pop();
  return args.some(conditional => {
    return (Array.isArray(conditional) && conditional.length > 0) || (!Array.isArray(conditional) && conditional);
  });
});

Handlebars.registerHelper('is_array', function (value) {
  return Array.isArray(value);
});

Handlebars.registerHelper('formatAsList', function(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  const items = text.split('\n')
                    .filter(line => line.trim() !== '')
                    .map(line => `<li>${Handlebars.escapeExpression(line.trim())}</li>`)
                    .join('');
  
  if (items) {
    return new Handlebars.SafeString(`<ul>${items}</ul>`);
  }
  return '';
});

Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

Handlebars.registerHelper('sanitizeUrl', function(url) {
  if (!url || typeof url !== 'string') {
    return '#'; 
  }
  const cleanedUrl = url.replace(/^https?:\/\//, '');
  return `https://${cleanedUrl}`;
});

const doesSectionHaveData = (sectionKey, content, fieldDefinitions) => {
  const sectionFields = fieldDefinitions.filter(f => f.section === sectionKey);
  if (sectionFields.length === 0) return false;

  const placeholderRegex = /\[.*\]/;

  return sectionFields.some(fieldDef => {
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
};

const generateResumeHtml = (
  htmlShell,
  baseCss,
  sections,
  stylePacks,
  selectedStylePackKey,
  sectionOrder,
  currentFormData,
  spacingMultiplier,
  editedSections,
  templateFieldDefinition
) => {
  // Steps 1-5 remain the same
  if (!baseCss || !Array.isArray(sections) || !Array.isArray(stylePacks) || !sectionOrder) {
    return '<div style="display: flex; justify-content: center; align-items: center; height: 100%; color: hsl(var(--muted-foreground)); font-family: sans-serif;">Template pieces are missing. Cannot render preview.</div>';
  }

  const selectedStylePack = stylePacks.find(pack => pack.key === selectedStylePackKey);
  const stylePackCss = selectedStylePack ? selectedStylePack.css : '';
  const finalCssContent  = `
      ${baseCss || ''}
      ${stylePackCss}
      .rt-container { --rt-spacing: ${spacingMultiplier || 1}; }
  `;

  const sectionsHtmlMap = sections.reduce((acc, section) => {
    acc[section.key] = section.html;
    return acc;
  }, {});

  const enabledSectionsConfig = currentFormData?.sectionsConfig || {};
  const assembledSlots = {};
  for (const slotKey in sectionOrder) {
    if (Object.prototype.hasOwnProperty.call(sectionOrder, slotKey)) {
      const orderedSectionKeys = sectionOrder[slotKey] || [];
      const finalSectionsHtml = orderedSectionKeys
        .filter(key => !enabledSectionsConfig[key] || enabledSectionsConfig[key].enabled)
        .map(key => sectionsHtmlMap[key] || ``)
        .join('');
      assembledSlots[slotKey] = finalSectionsHtml;
    }
  }
  
  const finalHtmlSnippet = `
    <style>${finalCssContent}</style>
    <div class="rt-container" id="resume">
      ${assembledSlots['header'] || ''}
      <div class="rt-body">
        <div class="rt-left-column">${assembledSlots['left_column'] || ''}</div>
        <div class="rt-right-column">${assembledSlots['right_column'] || ''}</div>
      </div>
      <div class="rt-main-column">${assembledSlots['main_column'] || ''}</div>
    </div>
  `;
  
  // --- CORRECTED LOGIC BLOCK (Step 6) ---
  const previewContent = {};
  const realContent = currentFormData?.content || {};

  if (templateFieldDefinition) {
    templateFieldDefinition.forEach(fieldDef => {
      const sectionKey = fieldDef.section;
      const hasBeenEdited = editedSections?.has(sectionKey);
      
      const hasData = doesSectionHaveData(sectionKey, realContent, templateFieldDefinition);

      // CORRECTED PATH LOGIC
      const dataPath = (fieldDef.section && fieldDef.name !== fieldDef.section) ? `${fieldDef.section}.${fieldDef.name}` : fieldDef.name;

      if (fieldDef.type === 'group' && fieldDef.repeatable) {
        const realItemsArray = get(realContent, dataPath) || [];
        if (hasBeenEdited && hasData) {
          set(previewContent, dataPath, realItemsArray);
        } else {
          const placeholderArray = realItemsArray.map(() => {
            const placeholderItem = {};
            (fieldDef.subFields || []).forEach(subField => {
                if (subField.type === 'group' && subField.repeatable) {
                    const sampleSubItem = {};
                     (subField.subFields || []).forEach(subSubField => {
                         sampleSubItem[subSubField.name] = subSubField.livePreviewPlaceholder || '';
                     });
                     placeholderItem[subField.name] = [sampleSubItem];
                } else {
                    placeholderItem[subField.name] = subField.livePreviewPlaceholder || '';
                }
            });
            return placeholderItem;
          });
          set(previewContent, dataPath, placeholderArray);
        }
      } else {
        if (hasBeenEdited && hasData) {
          set(previewContent, dataPath, get(realContent, dataPath));
        } else {
          set(previewContent, dataPath, fieldDef.livePreviewPlaceholder || '');
        }
      }
    });
  }

  // 7. Compile with Handlebars
  try {
    const template = Handlebars.compile(finalHtmlSnippet);
    return template({
      content: previewContent,
      sectionsConfig: enabledSectionsConfig,
    });
  } catch (error) {
    console.error("Handlebars compilation error:", error);
    return `<div style="display: flex; justify-content: center; align-items: center; height: 100%; color: red; font-family: sans-serif;">Error rendering template: ${error.message}</div>`;
  }
};

export default generateResumeHtml;