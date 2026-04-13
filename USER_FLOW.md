# CareerForge: User Journey & Flow Documentation

In order to keep documentation modular and highly detailed, the user flows, screen interactions, and logic branches for the CareerForge application have been separated into dedicated markdown files for each major feature.

Please refer to the following comprehensive guides:

## 1. [Resume Builder & Editor Flow](./FLOW_RESUME_BUILDER.md)
**Document**: `FLOW_RESUME_BUILDER.md`
Details the journey from creating a new resume, navigating the editor interfaces (Top bar, Left Navigation, Center Form, Right Tools), utilizing templates, to finally exporting the document. This includes all granular button interactions.

## 2. [Standalone JD Score & Tailor Flow](./FLOW_JD_TAILOR.md)
**Document**: `FLOW_JD_TAILOR.md`
Maps out the standalone `/jd-tailor` page. It covers the 3-step process heavily incorporating AI analysis: providing complex inputs (Paste, Upload, DB query), interpreting the deep analytics metric view, tracking quotas, and triggering the auto-generative tailoring sequence.

## 3. [Cover Letter Generator Flow](./FLOW_COVER_LETTER.md)
**Document**: `FLOW_COVER_LETTER.md`
Details the highly specialized sequence for crafting application letters. Documents input gathering, Tone selection options, generation states, and output actions (Clipboard copy, TXT Download).
