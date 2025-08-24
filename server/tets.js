// A NodeJS script (ES Module) to generate a PDF from a static HTML string.
// Required dependency: puppeteer

import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Replicate __dirname functionality in ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 1. Your HTML Content with a new body rule ---
const htmlContent = `
<style>
    /* *** ADDED THIS RULE *** */
    body {
        margin: 0;
    }
    /* --- Base Template CSS --- */
    #resume {
        --primary-text-color: #2D2D2D;
        --secondary-text-color: #6B6B6B;
        --divider-color: #E9ECEF;
        --accent-color: #005A5A;
        --font-family-body: 'Lato', sans-serif;
        --font-family-heading: 'Lato', sans-serif;
        --font-size-base: 11pt;
        --base-line-height: calc(var(--font-size-base) * 1.4);
        --rt-spacing: 1;
        --space-bullet-list: calc(var(--base-line-height) * 0.25 * var(--rt-spacing));
        --space-after-subheading: calc(var(--base-line-height) * 0.5 * var(--rt-spacing));
        --space-after-section-title: calc(var(--base-line-height) * 1.0 * var(--rt-spacing));
        --space-between-entries: calc(var(--base-line-height) * 1.25 * var(--rt-spacing));
        --space-between-sections: calc(var(--base-line-height) * 1.25 * var(--rt-spacing));
        --space-page-margin: calc(var(--base-line-height) * 4.0 * var(--rt-spacing));
        background-color: #fff;
        color: var(--primary-text-color);
        font-family: var(--font-family-body);
        font-size: var(--font-size-base);
        line-height: 1.4;
        width: 210mm;
        min-height: 297mm;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }
    #resume h1, #resume h2, #resume h3, #resume p, #resume ul, #resume li {
        margin: 0; padding: 0;
    }
    #resume ul { list-style: none; }
    #resume .rt-body {
        display: grid;
        grid-template-columns: 1fr 2fr;
        flex-grow: 1;
    }
    #resume .rt-left-column,
    #resume .rt-right-column {
        padding: var(--space-page-margin);
    }
    #resume .rt-left-column { padding-right: calc(var(--space-page-margin) / 1.5); }
    #resume .rt-right-column { padding-left: calc(var(--space-page-margin) / 1.5); }
    #resume .rt-section {
        margin-bottom: var(--space-between-sections);
    }
    #resume .rt-section-title {
        font-family: var(--font-family-heading);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: var(--space-after-section-title);
        padding-bottom: var(--space-after-subheading);
    }
    @media print {
        body {
            background-color: #fff;
        }
        #resume {
            box-shadow: none;
            margin: 0;
        }
        .rt-section,
        .rt-entry,
        .rt-entry-compact {
            break-inside: avoid;
        }
        .rt-section-title {
            break-after: avoid;
        }
    }
    @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0;300;0;400;0;700;0;900&display=swap');
    #resume {
        --accent-color: #005A5A;
        --font-family-body: 'Lato', sans-serif;
        --font-family-heading: 'Lato', sans-serif;
        --font-size-name: 32px;
        --font-size-section-title: 15px;
        --font-size-entry-title: 12pt;
        --font-size-base: 11pt;
        --font-size-meta: 11pt;
    }
    #resume .rt-header {
        background: linear-gradient(135deg, #005A5A 0%, #007A7A 100%);
        color: white;
        padding-top: calc(var(--space-page-margin) * 0.65);
        padding-bottom: calc(var(--space-page-margin) * 0.65);
        padding-left: var(--space-page-margin);
        padding-right: var(--space-page-margin);
        text-align: center;
    }
    #resume .rt-name { font-size: var(--font-size-name); font-weight: 700; margin-bottom: var(--space-after-subheading); }
    #resume .rt-title { font-size: 16px; font-weight: 400; margin-bottom: var(--space-between-entries); }
    #resume .rt-contact-info { display: flex; justify-content: center; gap: var(--space-between-entries); font-size: 14px; }
    #resume .rt-left-column { background-color: #f8f9fa; border-right: 1px solid var(--divider-color); }
    #resume .rt-section-title { font-size: var(--font-size-section-title); font-weight: 700; color: var(--primary-text-color); border-bottom: 2px solid var(--accent-color); text-transform: uppercase; }
    #resume .rt-right-column .rt-entry {
        margin-bottom: var(--space-between-entries);
        border-left: 3px solid var(--accent-color); padding-left: 20px; position: relative;
    }
    #resume .rt-right-column .rt-entry:before {
        content: ''; position: absolute; left: -6px; top: 8px; width: 9px; height: 9px; background: var(--accent-color); border-radius: 50%;
    }
    #resume .rt-entry-title { font-size: var(--font-size-entry-title); font-weight: 700; color: var(--primary-text-color); margin-bottom: var(--space-after-subheading); }
    #resume .rt-entry-meta { font-size: var(--font-size-meta); color: var(--secondary-text-color); margin-bottom: var(--space-after-subheading); }
    #resume .rt-entry-description li { font-size: 10.5pt; margin-bottom: var(--space-bullet-list); padding-left: 10px; position: relative; }
    #resume .rt-entry-compact { margin-bottom: var(--space-between-entries); }
    #resume .rt-entry-title-small {
        font-weight: 700; font-size: var(--font-size-entry-title); color: var(--primary-text-color); margin-bottom: var(--space-bullet-list);
    }
    #resume .rt-entry-meta-small { font-size: var(--font-size-meta); color: var(--secondary-text-color); margin-bottom: 2px; }
    #resume .rt-skill-item { margin-bottom: var(--space-after-subheading); }
    #resume .rt-bullet-list li {
        font-size: 11px; margin-bottom: var(--space-bullet-list); position: relative; padding-left: 18px;
    }
    #resume .rt-bullet-list li::before {
        content: '•'; color: var(--accent-color); font-weight: bold; position: absolute; left: 0; top: 0;
    }
    #resume .rt-italic { font-style: italic; }
    #resume .rt-skill-bar { height: 6px; background-color: var(--divider-color); border-radius: 3px; overflow: hidden; }
    #resume .rt-skill-level { height: 100%; background: linear-gradient(90deg, #005A5A, #007A7A); border-radius: 3px; }
    .rt-container {
        --rt-spacing: 1;
    }
</style>
<div class="rt-container" id="resume">
    <header class="rt-header"><h1 class="rt-name">[Your Name]</h1><p class="rt-title">[Your Professional Title]</p><div class="rt-contact-info"><div class="rt-contact-item">[your.email@example.com]</div><div class="rt-contact-item">[Your Phone Number]</div><div class="rt-contact-item">[linkedin.com/in/yourprofile]</div><div class="rt-contact-item">[City, State]</div></div></header>
    <div class="rt-body">
        <div class="rt-left-column"><section class="rt-section"><h2 class="rt-section-title">Core Skills</h2><div class="rt-skill-item"><div class="rt-skill-name">[Skill Name]</div><div class="rt-skill-bar"><div class="rt-skill-level" style="width: 90%;"></div></div></div></section><section class="rt-section"><h2 class="rt-section-title">Education</h2><div class="rt-entry-compact"><h3 class="rt-entry-title-small">[Your Degree]</h3><p class="rt-entry-meta-small">[Name of Institution]</p><p class="rt-entry-meta-small rt-italic">[Graduation Year]</p></div></section><section class="rt-section"><h2 class="rt-section-title">Certifications</h2><ul class="rt-bullet-list"><li>[Name of Certification]</li></ul></section><section class="rt-section"><h2 class="rt-section-title">Languages</h2><ul class="rt-bullet-list"><li> ([Proficiency Level])</li></ul></section></div>
        <div class="rt-right-column"><section class="rt-section"><h2 class="rt-section-title">Professional Summary</h2><p class="rt-summary">[Write a 2-4 sentence summary of your experience, skills, and career goals. Tailor this to the job you are applying for to highlight your most relevant qualifications.]</p></section><section class="rt-section"><h2 class="rt-section-title">Professional Experience</h2><div class="rt-entry"><h3 class="rt-entry-title">[Job Title]</h3><div class="rt-entry-meta"><span>[Company Name]</span> | <span>[City, State]</span> | <span>[Month Year] - [Month Year]</span></div><div class="rt-entry-description"><ul><li>[Start with an action verb to describe a key responsibility or achievement.]</li><li>[Quantify your accomplishments with numbers and metrics to show impact.]</li></ul></div></div></section></div>
    </div>
    <div class="rt-main-column"></div>
</div>
`;

// --- 2. The PDF Generation Function ---
async function createPdf() {
    console.log("Starting PDF generation...");
    let browser;
    try {
        browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        // --- Diagnostic Screenshot (Optional) ---
        // If the PDF is still wrong, uncomment the line below to see what the browser is rendering.
        // await page.screenshot({ path: 'debug-screenshot.png' });

        const outputPath = path.join(__dirname, 'resume.pdf');
        
        // *** THIS IS THE KEY CHANGE ***
        // We now explicitly define the PDF dimensions, leaving nothing to chance.
        await page.pdf({
            path: outputPath,
            width: '210mm',
            height: '297mm',
            printBackground: true,
            margin: {
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px'
            }
        });
        console.log(`✅ PDF successfully generated and saved to ${outputPath}`);
    } catch (error) {
        console.error("❌ An error occurred during PDF generation:", error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// --- Run the function ---
createPdf();