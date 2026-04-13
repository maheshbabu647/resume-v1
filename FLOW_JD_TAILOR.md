# Comprehensive Flow: Standalone JD Score & Tailor

This document outlines the entire user journey through the Job Description Analysis and Auto-Tailoring tool.

## 1. Landing & Entry
* **Triggers**:
  1. From Dashboard Mobile Bottom Nav → `[ More ]` icon → Select `[ Target (JD Tailor) ]`.
  2. Direct link traversal `/jd-tailor`.
* **Page Header**: "JD Score & Tailor" - Indicates the 3-Step process.

## 2. Step 1: Input Stage
* **State**: The user must provide both their Resume content and the target Job Description content.

### A. Resume Source Junction (Left Card)
* **Tab 1: `[ Paste Text ]`** (Default)
  * Displays a full `<textarea>`. Requires at least 50 characters to activate validation.
* **Tab 2: `[ Upload File ]`**
  * Displays a Drag & Drop zone. Clicking opens native file browser limit: .pdf, .docx (5MB limit).
  * **Action**: On drop/selection, triggers parsing API.
  * **Transitions**: "Parsing..." loader → Extracted text preview & Success tick. `[ X ]` to clear.
* **Tab 3: `[ My Resumes ]`**
  * Queries database for user's existing resumes.
  * Displays as a clickable list. Selecting one designates it as the source text.

### B. Job Description Source (Right Card)
* **Tab 1: `[ Paste Text ]`** (Default)
  * `<textarea>` for full raw job description.
* **Tab 2: `[ Upload File ]`**
  * Drag & Drop zone for JD PDF/DOCX.
  * **Action**: On drop/selection, triggers raw text extraction API.

### C. Execute Action Bar
* **Condition Check**: Requires both inputs to be resolved and have >50 chars.
* **Button**: `[ Analyze Match ]`
* **On Click**:
  * Uses 1 "JD Score" credit.
  * Transitions UI to Stage 2 (`analyzing` loader).

## 3. Step 2: Analysis Results View
* **State**: After receiving the API response, the UI transforms to show deep metrics and actions.
* **Top Header Actions**: `[ ← Edit Inputs ]` Returns to Step 1 without deleting data.

### Analytics Breakdown:
1. **The Score Ring**: Large circular gauge showing Fit Score (0-100).
2. **Label Profile**: Displays dynamic label (e.g., "Good Match", "Needs Work").
3. **Senority & Semantic**:
   * "Seniority expected": AI evaluation (Entry level, Mid-level, Senior).
   * "Semantic overlap": Raw matching metric (0-100).
4. **Skills Checklist Modules**:
   * Required Skills section: Green checks `[✓]` for present, Orange alerts `[!]` for missing.
   * Preferred Skills section.
5. **Actionable Improvements Module**:
   * Ranked 1-N suggestions for the resume text.
   * Impact badging ("High Impact", "Medium Impact").

### The Decision Junction: Tailor Action
* **Button**: `[ 🪄 Tailor My Resume ]`
* **Action**: Opens "Choose a Template" Modal.
* **Blocker**: Disables and shows "Upgrade Plan" link if "jdTailoring" quota is 0.

## 4. Step 3: Auto-Tailoring & Editor Handoff
* **Trigger**: Selecting a template thumbnail in the modal.
* **State**: Transition to Tailoring.
* **Action**: 
  * Consumes 1 "jdTailoring" credit.
  * UI shows large spinner: "Tailoring your resume... This takes ~15-30 seconds."
  * System generates entirely new optimized structure in the background.
* **End State Navigation**:
  * Automatically redirects to `/resume/new?tailored=true&template={selected_id}`.
  * The Editor securely consumes the generated data from `sessionStorage` and prepares the document for final review and PDF download.
