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



// Helper to perform addition
Handlebars.registerHelper('add', function(a, b) {
  return a + b;
});

// Helper to check for divisibility (for the two-column logic)
Handlebars.registerHelper('isDivisibleBy', function(a, b) {
  return (a % b) === 0;
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
  fontSizeMultiplier,
  editedSections,
  templateFieldDefinition
) => {
  // Steps 1-5 remain the same
  if (!baseCss || !Array.isArray(sections) || !Array.isArray(stylePacks) || !sectionOrder) {
    return '<div style="display: flex; justify-content: center; align-items: center; height: 100%; color: hsl(var(--muted-foreground)); font-family: sans-serif;">Template pieces are missing. Cannot render preview.</div>';
  }
  const selectedStylePack = stylePacks.find(pack => pack.key === selectedStylePackKey);
  const stylePackCss = selectedStylePack ? selectedStylePack.css : '';

  console
  const finalCssContent  = `
      ${baseCss || ''}
      ${stylePackCss}
      .rt-container { --rt-spacing: ${spacingMultiplier || 1};
                     --rt-font-size: ${fontSizeMultiplier || 1};
     }
      
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