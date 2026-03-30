/**
 * Exact feedback messages extracted from Appendix C / System A documentation.
 */

export const CHECKS = {
  // Dimension 2 — Bullet Quality
  'bullet-action-verb': `X of your bullets don't start with a strong action verb. Instead of "Responsible for managing the team", write "Led a team of 5 engineers to deliver..." — see the suggested verb list below.`,
  'bullet-quantified': `Your [Job Title] bullets don't include any numbers or metrics. Recruiters at top companies consistently rank quantified achievements higher. Instead of "Improved the checkout flow", write "Improved checkout flow, reducing drop-off by 23% and increasing conversions by $120K/month."`,
  'bullet-length-min': `Some bullets are too brief to be meaningful. "Developed new features" gives recruiters nothing to evaluate. Expand it: what feature, how did you build it, what happened as a result?`,
  'bullet-length-max': `Some bullets are too long — recruiters skim. Aim for 1–2 lines max (under 220 characters). Move supporting detail to a second bullet.`,
  'bullet-thin-section': `Your [Job Title] entry only has 1 bullet. Add at least 2–3 bullets describing your key contributions. One bullet signals you didn't do much in this role.`,
  'bullet-no-weak-openers': `Remove "Responsible for", "Helped", or "Assisted" from your bullets. These words signal passivity. Own your work: "Led", "Built", "Drove", "Delivered".`,

  // Dimension 3 — Structure
  'structure-has-summary': `Add a 2–3 sentence professional summary at the top. This is the first thing recruiters read and it sets the framing for your entire resume.`,
  'structure-skills-categorized': `Organize your skills into categories (e.g. Languages, Frameworks, Tools, Soft Skills). A categorized list is faster to scan than a flat one.`,
  'structure-skills-count': `You have fewer than 8 skills listed. Most roles match on 10–20 keywords. Add the tools, languages, and frameworks you actually use day-to-day.`,

  // Dimension 4 — ATS Safety
  'ats-single-column': `Your resume template uses a multi-column layout. Most ATS systems read columns as a single stream, which scrambles your content. Switch to a single-column template before applying.`,
  'ats-standard-headings': `Rename "[Current Title]" to "[Standard Title]". ATS systems search for standard headings. Non-standard section names mean recruiters can't filter you in.`,

  // Generic fallback if not specified specifically in spec
  'completeness-header': `Ensure your resume header contains your name, professional title, email, phone, and at least one URL (like LinkedIn or a portfolio).`,
  'completeness-summary': `Your summary is missing or too short. Add a professional summary of at least 40 characters to introduce yourself.`,
  'completeness-core-section': `Your resume lacks core professional experience. Make sure you have entries in Experience, Internships, or Projects.`,
  'completeness-no-empty-sections': `You have visible sections with no saved entries. Either add content to them or hide the section from the sidebar.`,
  'structure-non-experience-sections': `Your resume is heavily weighted on experience. Try adding at least 2 extra sections like Education, Skills, Projects, Certifications, or Volunteering.`,
  'ats-no-images-in-text': `Avoid using profile photos, skill-bar charts, or text embedded in images, as ATS parsers cannot read them.`,
  'keyword-skills-count': `Your resume has fewer than 10 total skills. Broaden your skills section to ensure you hit enough key terms for applicant tracking systems.`,
  'keyword-no-duplicate-sections': `You have duplicate section titles. Each section title must be unique to avoid confusing ATS parsers.`,
  'keyword-title-in-header': `Include a professional title in your resume header right by your name to immediately signal your role level to recruiters.`
} as const
