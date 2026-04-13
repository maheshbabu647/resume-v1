import type { ISection } from '../../../models/Resume.model'

interface JdTailorPromptInput { personalInfo: any; sections: ISection[]; jdText: string }

export const buildJdTailorPrompt = ({ personalInfo, sections, jdText }: JdTailorPromptInput): string => `
You are an expert resume writer and career coach. Tailor the candidate's resume to match the job description.

## Instructions
- Rewrite bullets to highlight relevant skills, tools, and achievements
- Rewrite the professional summary and targeted title to align with the JD
- Use keywords from the JD naturally — do NOT invent experience
- Keep the same section structure and entry format
- Extract company name and role name from the JD

## Job Description
${jdText}

## Current Resume (JSON)
{
  "personalInfo": ${JSON.stringify(personalInfo, null, 2)},
  "sections": ${JSON.stringify(sections, null, 2)}
}

## Output Format
Respond with ONLY valid JSON:
{
  "jdCompanyName": "<company name or 'Unknown'>",
  "jdRoleName": "<role name>",
  "rewrittenPersonalInfo": {
    "title": "<targeted professional title>",
    "summary": "<rewritten summary>"
  },
  "rewrittenSections": [ { "key": "...", "visible": true, "order": 0, "entries": [...] } ]
}
`.trim()
