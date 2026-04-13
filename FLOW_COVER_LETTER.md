# Comprehensive Flow: Cover Letter Generator

This document details the user journey for automatically generating hyper-personalized cover letters.

## 1. Landing & Entry
* **Triggers**:
  1. From Dashboard Mobile Bottom Nav → `[ Letters ]` icon.
  2. Direct link `/cover-letter`.
* **Page Details**: "Cover Letter Generator" branding.

## 2. Input Assembly Stage
* **State**: To generate a letter, three components are needed: Resume context, JD context, and intended Tone.

### A. Resume Source (Context 1)
Identical logic to the JD Tailor pipeline.
* Tabs: `[ Paste Text ]`, `[ Upload File ]`, `[ My Resumes ]`.

### B. Job Description Source (Context 2)
Identical logic to the JD Tailor pipeline. Provide the target criteria.
* Tabs: `[ Paste Text ]`, `[ Upload File ]`.

### C. Voice & Tone Selection
* **Grid Selection**:
  * `[ 💼 Professional ]` - Formal and polished (Default).
  * `[ 🚀 Enthusiastic ]` - Energetic and passionate.
  * `[ ⚡ Concise ]` - Direct and to the point.
  * `[ ✨ Creative ]` - Distinctive and memorable.
  * **Action**: Clicking a card highlights it actively.

### D. Generation Execution
* **Button**: `[ ✨ Generate Letter ]`
* **Conditions**: Resume inputs and JD inputs are valid and loaded.
* **Action**: 
  * Uses 1 "coverLetter" credit limit.
  * UI morphs hiding inputs, revealing `Generating...` loading state with descriptive text analyzing the current progression.

## 3. Results & Actions Stage
* **State**: API response completed. Displaying the finalized document.

### A. Results Header Bar
* Badges indicating "Generated", Role Name Match, Word Count, and Tone applied.
* **Top Right Actions**:
  * `[ Copy Letter ]` → Triggers copy to clipboard behavior. Button icon changes to a green check `[✓] Copied!`.
  * `[ Download .txt ]` → Generates a `.txt` Blob locally named `Cover Letter - [Role].txt` and triggers local browser download.
  * `[ ↺ New Letter ]` → Resets the component state entirely, returning the user to the Input Assembly stage with blank forms.

### B. The Letter Canvas
* **Header Block**:
  * Email Subject recommendation (optimised for open rate).
  * Identified Recipient Name and target Company based on JD context.
* **Body Block**:
  * The raw text area of the generated letter.
* **Footer Status**:
  * Word count validation and explicit Tone verification tag.
