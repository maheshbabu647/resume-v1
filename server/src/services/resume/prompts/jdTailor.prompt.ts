import type { ISection } from '../../../models/Resume.model'

interface JdTailorPromptInput { sections: ISection[]; jdText: string }

export const buildJdTailorPrompt = ({ sections, jdText }: JdTailorPromptInput): string => `
You are an expert resume writer and career coach. Tailor the candidate's resume sections to match the job description.

## Instructions
- Rewrite bullets to highlight relevant skills, tools, and achievements
- Use keywords from the JD naturally — do NOT invent experience
- Keep the same section structure and entry format
- Extract company name and role name from the JD

## Job Description
${jdText}

## Current Resume Sections (JSON)
${JSON.stringify(sections, null, 2)}

## Output Format
Respond with ONLY valid JSON:
{
  "jdCompanyName": "<company name or 'Unknown'>",
  "jdRoleName": "<role name>",
  "rewrittenSections": [ { "key": "...", "visible": true, "order": 0, "entries": [...] } ]
}
`.trim()
