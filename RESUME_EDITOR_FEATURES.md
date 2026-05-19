# CareerForge — Resume Editor Features

---

## Onboarding
When creating a new resume, the user chooses between two paths: **upload an existing resume** (PDF or DOCX) where AI automatically parses and pre-fills every section, or **start from scratch** with a blank editor. If arriving from the JD Tailor flow, the editor skips onboarding and loads the tailored content directly.

---

## Content Editing (Form)
The editor has a structured form panel where the user fills in their resume data section by section. Each section has clearly labelled input fields. Within any section, the user can **add or remove individual entries** (e.g., multiple jobs, multiple projects) without limit. At the bottom of each form is a **Previous / Next** navigation so the user can move linearly through sections without touching the sidebar.

---

## Live Preview
Every change made in the form instantly appears in the resume preview — no refresh needed. The preview renders the resume at actual A4 paper dimensions and **auto-scales** to fit smaller screens. When content exceeds one page, **page-break markers** appear in the preview showing exactly where each page ends and the next begins.

---

## Section Management
The user has full control over what sections appear in their resume:

- **Add Sections** — open a modal and pick from 23 available section types to add to the resume
- **Remove Sections** — enter remove mode and delete any section that's no longer needed
- **Reorder Sections (Drag & Drop)** — enter rearrange mode and drag sections into any custom order; the preview updates live
- **Predefined Section Order Presets** — apply a named layout preset that reorders all sections at once for a specific career profile: The Steady Climber (chronological), The Potential Star (education first), The Strategic Pivot (skills first), The Tech Specialist (projects + skills first), The Authority (senior/executive), The Academic (research first)
- Sections show a **completion checkmark** once they have at least one filled entry

---

## AI Writing Assistant
Textarea fields for open-ended descriptions (Summary, Work Experience, Projects, Internships) have an **AI Assist** button. Clicking it generates 3 AI-written alternatives for that field, using the surrounding context (job title, company, etc.) as input. The user can apply any option, regenerate for a new set, or close without changes. Usage is quota-based per plan.

---

## Section-Specific Writing Tips
Every section has a **Tips** button that opens a writing guide for that exact section — covering what recruiters look for, pro tips, and side-by-side good vs. bad examples.

---

## Resume Naming
The resume title is always editable inline at the top of the editor. It defaults to "Untitled Resume" if cleared and is used as the exported PDF filename.

---

## Save
The user can manually save at any time. The toolbar shows a live **Saved / Unsaved** status. First save creates a new record; subsequent saves update it. Unauthenticated users are prompted to sign in, after which the save completes automatically.

---

## Export to PDF
Exports the resume as a properly formatted A4 PDF. All fonts, colors, and backgrounds are preserved exactly as shown in the preview. Smart pagination rules prevent orphaned section headings and mid-entry page splits. The PDF is named after the resume title.

---

## Template Switching
The user can switch between three ATS-safe resume templates at any time — **Modern Centered**, **Classic Sidebar**, and **Executive Minimal** — without losing any data. Templates can be changed from both the toolbar and directly within the preview panel.

---

## Appearance Customization
All customization changes update the live preview instantly. Options include:

- **Style Presets** — one-click palettes that set a curated accent color + font combination (Monochrome Professional, Tech Innovator, Corporate Authority, Academic Scholar, Creative Minimalist, Modern Generalist)
- **Accent Color** — a free color picker to set any custom color, independent of the preset
- **Font Family** — choose from Inter, Lato, Georgia, Merriweather, Roboto, Open Sans, or Playfair Display
- **Text Size** — Small / Medium / Large preset scale that adjusts all type sizes proportionally
- **Spacing** — Compact / Normal / Relaxed preset that controls white space between sections and entries
- **Advanced sliders** — fine-grained individual control over name font size, section title size, body text size, line height, page margin, section gap, and entry gap, plus a Reset to Defaults button

---

## Resume Strength Score
A client-side quality score (0–100) calculated instantly from the current resume data — no AI call, no waiting. Scored across five dimensions: Completeness, Bullet Quality, Structure, ATS Safety, and Keyword Density. The user sees a breakdown per dimension and a list of specific improvement areas with explanations of what to fix.

---

## Job Description Fit Score & AI Tailoring
The user pastes or uploads a job description (PDF/DOCX), then:

1. **Calculate Fit Score** — AI returns a fit percentage, semantic overlap score, expected seniority level, a full required and preferred skill checklist (each marked present or missing in the resume), and ranked actionable suggestions
2. **Tailor to JD** — AI rewrites resume content to align with the JD, then presents every proposed change as a **field-by-field diff review** where the user accepts or rejects each individual change before anything is applied

---

## Undo / Redo
Up to 20 steps of undo and redo for all content edits. Undo/redo buttons are disabled when there is nothing to reverse or reapply.

---

## Unsaved Work Recovery
If the user navigates away before saving, the current resume state is stashed in local storage and automatically restored the next time they open the editor.
