# Comprehensive Flow: Resume Builder

This document outlines the detailed user journey, button interactions, and junction points for building a resume from a template.

## 1. Landing & Entry
* **Location**: `https://careerforge.pro/`
* **Junction Options**:
  * `[Build my resume free]` → Redirects to `/register` (if unauthenticated).
  * `[Go to Dashboard]` → Redirects to `/dashboard` (if authenticated).
  * `[See a sample resume]` → Redirects to `/templates` page.

## 2. Dashboard Workspace
* **Location**: `/dashboard`
* **Content**: Greeting, Usage Sidebar, and "My Resumes" grid.
* **New Resume Journey**:
  * **Trigger**: Click `[ + New Resume ]` card.
  * **Branch**: Opens "Choose a template" modal.
  * **Action**: User clicks one of the template thumbnails.
  * **Result**: Navigates to `/resume/new` loading the selected template.
* **Existing Resume Journey**:
  * **Trigger**: Grid shows previously created resumes.
  * **Action**: Click `[ Edit ]` button on a card or click `[...]` for options.
  * **Options Menu**: `[ Edit ]`, `[ Duplicate ]`, `[ Delete ]` (Requires confirmation).

## 3. The Editor Interface
* **Location**: `/resume/:id` or `/resume/new`
* **Layout**: The editor is divided into distinct zones for navigation, content entry, and advanced utilities.

### A. Top Navigation Bar (`Toolbar.tsx`)
* `[ 🏠 Home Icon ]` → Saves and returns to `/dashboard`.
* `[ Resume Title Input ]` → Click to quickly rename the currently active resume.
* **Save Status Indicator** → Displays real-time auto-saving status ("Saving...", "Saved").
* **View Mode toggle** (Mobile only) → Switch between `Form` view and `Preview` view.
* `[ Template ]` button → Opens Template Switcher to change layouts completely without losing structured data.
* `[ Download PDF ]` → Renders current preview as PDF and triggers browser download.

### B. Left Navigation Panel (`LeftNav.tsx`)
Manages the structured sections within your document.
* **Static Sections**: `Personal Info` is anchored.
* **Dynamic Sections**: `Summary`, `Experience`, `Education`, `Projects`, etc.
* **Section Item Statuses**: Shows a green checkmark `[✓]` if a section has filled content.
* **Bottom Controls**:
  * `[ + Add Section ]` → Opens a modal to add predefined categories (Languages, Certifications, etc.). Selecting one activates it.
  * `[ - Remove Section ]` → Toggles removal mode. Red `[ Trash ]` icons appear next to dynamic sections.
  * `[ ↑↓ Shuffle Layout ]` → Enables drag-and-drop mode. Grab handles appear to let you visually reorder sections.

### C. Center Form Panel (`FormPanel.tsx`)
Where users input data. The form dynamically changes based on the section selected in the Left Navigation.
* **Header**: Shows current section name (which can be renamed by clicking on the title text directly).
* `[ Tips (Lightbulb) ]` → Opens Right slide-out panel with expert "Pro Tips", "Purpose", and "Good vs Bad" examples for the active field.
* **Form Behaviours**:
  * **Standard Text Fields**: Auto-save on change.
  * **Groups (e.g. Experience)**:
    * `[ + Add Role / Item ]` → Appends a new blank entry.
    * `[ Trash ]` → Removes that specific block.
    * `[ Wand ]` (AI Assistant in Bullets) → Automatically generates professional bullet points based on the job title entered.
* **Bottom Navigation**: `[ ← Previous Section ]` / `[ Next Section → ]` buttons allow linear traversal through the form without using the left panel.

### D. Right Sidebar Analytics & Tools (`RightSidebarUtils.tsx`)
* `[ ↺ Undo ]` / `[ ↻ Redo ]` → Full version control for the current session.
* `[ 📊 Resume Strength ]` → Opens Resume Quality Drawer side-panel. Requires authentication. Shows out of 100 score on length, buzzwords, and structure.
* `[ 🪄 Match JD ]` → Opens Job Description Match Drawer. Connects directly to the JD Score feature.
* `[ ⚙️ Customize ]` → Opens the Style Options Drawer.
  * **Style Preset Grid**: Rapidly switch thematic color blocks.
  * **Section Layout**: Quick presets (e.g., "Student", "Experienced").
  * **Accent Color**: Hex color picker.
  * **Font Family**: Dropdown (Inter, Lato, Roboto, etc.).
  * **Text & Spacing Presets**: "Compact", "Normal", "Relaxed".
  * `[ Advanced Customization ]` dropdown: Fine-tune sliders for Name Size, Body Text, Line Height, Page Margin, Section Gap.

## 4. End States
1. **Save and Exit** → User clicks `Home`. Resume state is preserved. Return to Dashboard.
2. **Download** → User finalizes visually on the canvas and clicks `[ Download PDF ]`. Output is generated client-side for absolute privacy and layout fidelity.
