import Handlebars from 'handlebars';

// --- Handlebars Helpers ---
// This 'if' helper ensures sections or links only appear if the user has provided data for them.
Handlebars.registerHelper('if', function(conditional, options) {
  // Supports checking for non-empty arrays as well as truthy values.
  if ((Array.isArray(conditional) && conditional.length > 0) || (!Array.isArray(conditional) && conditional)) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

/**
 * Assembles a complete, self-contained HTML resume snippet from modular pieces and user data.
 * This version is designed to be injected into a div to prevent iframe flickering.
 * @param {string} htmlShell - This parameter is no longer used but is kept for API consistency.
 * @param {string} baseCss - The foundational CSS for the template.
 * @param {Array} sections - The library of all available section modules.
 * @param {Array} stylePacks - The library of all available style themes.
 * @param {string} selectedStylePackKey - The key of the currently selected style pack.
 * @param {object} sectionOrder - Defines which sections to show and in what order (e.g., { header: [...], main_column: [...] }).
 * @param {object} currentFormData - The user's complete form data.
 * @param {number} spacingMultiplier - The value for adjusting template spacing.
 * @returns {string} The final, renderable HTML string for the resume.
 */
const generateResumeHtml = (
  htmlShell, // No longer used, but kept in signature to avoid breaking component props.
  baseCss,
  sections,
  stylePacks,
  selectedStylePackKey,
  sectionOrder,
  currentFormData,
  spacingMultiplier
) => {
  // 1. Safety Check: Ensure all necessary template pieces are available.
  if (!baseCss || !Array.isArray(sections) || !Array.isArray(stylePacks) || !sectionOrder) {
    return '<div style="display: flex; justify-content: center; align-items: center; height: 100%; color: hsl(var(--muted-foreground)); font-family: sans-serif;">Template pieces are missing. Cannot render preview.</div>';
  }

  // 2. Combine Styles: Find the selected style pack, merge it with base CSS, and add dynamic spacing.
  const selectedStylePack = stylePacks.find(pack => pack.key === selectedStylePackKey);
  const stylePackCss = selectedStylePack ? selectedStylePack.css : '/* No style pack selected */';
  
  const finalCssContent  = `
      /* --- Base Template CSS --- */
      ${baseCss || ''}

      /* --- Selected Style Pack CSS --- */
      ${stylePackCss}

      /* --- Dynamic Spacing & Appearance CSS --- */
      .rt-container { 
        --rt-spacing: ${spacingMultiplier || 1}; 
      }
  `;

  // 3. Prepare Section HTML: Create a map for quick lookup of section HTML by its key.
  const sectionsHtmlMap = sections.reduce((acc, section) => {
    acc[section.key] = section.html;
    return acc;
  }, {});

  // 4. Assemble HTML for each layout slot (e.g., header, main_column).
  const enabledSectionsConfig = currentFormData?.sectionsConfig || {};
  const assembledSlots = {};

  for (const slotKey in sectionOrder) {
    if (Object.prototype.hasOwnProperty.call(sectionOrder, slotKey)) {
      const orderedSectionKeys = sectionOrder[slotKey] || [];
      
      const finalSectionsHtml = orderedSectionKeys
        .filter(key => {
          const isToggleable = enabledSectionsConfig[key] !== undefined;
          // A section is included if it's not a toggleable section, OR if it is and it's enabled.
          return !isToggleable || enabledSectionsConfig[key].enabled;
        })
        .map(key => sectionsHtmlMap[key] || ``)
        .join('');
      assembledSlots[slotKey] = finalSectionsHtml;
    }
  }
  
  // 5. Build the Final, Self-Contained HTML Snippet.
  // This is the core of the flicker-free solution. We create a string containing
  // the styles and the resume content together, which can be safely injected into a div.

  const finalHtmlSnippet = `
    <style>
      ${finalCssContent}
    </style>
    <div class="rt-container" id="resume">
      ${assembledSlots['header'] || ''}
      
      <div class="rt-body">
        <div class="rt-left-column">${assembledSlots['left_column'] || ''}</div>
        <div class="rt-right-column">${assembledSlots['right_column'] || ''}</div>
      </div>

      <div class="rt-main-column">${assembledSlots['main_column'] || ''}</div>

    </div>
  `;

  console.log("final html content",finalHtmlSnippet)
  // console.log(enabledSectionsConfig)
console.log("DEBUG: baseCss received by function:", baseCss);
  // 6. Compile with Handlebars: Inject the user's actual data into the fully assembled template.
  try {
    const template = Handlebars.compile(finalHtmlSnippet);
    return template({
      content: currentFormData?.content || {},
      sectionsConfig: enabledSectionsConfig,
    });
  } catch (error) {
    console.error("Handlebars compilation error:", error);
    return `<div style="display: flex; justify-content: center; align-items: center; height: 100%; color: red; font-family: sans-serif;">Error rendering template: ${error.message}</div>`;
  }
};

export default generateResumeHtml;