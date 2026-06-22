import type { ISection } from '../../../models/Resume.model'
import {
  RESUME_WRITING_CRAFT,
  KEYWORD_INTEGRATION_RULES,
  RESUME_COVERAGE_SELF_CHECK,
} from './resumeCraft.prompt'

interface JdTailorPromptInput { personalInfo: any; sections: ISection[]; jdText: string }

export const buildJdTailorPrompt = ({ personalInfo, sections, jdText }: JdTailorPromptInput): string => `
You are an elite resume writer and ATS optimization specialist. Tailor the candidate's existing resume to the job description — rewriting to the professional standard below, never a keyword dump.

## Instructions
- Rewrite the bullets in each entry's "description" to the writing craft below; preserve newline separation between bullets.
- Rewrite the professional summary and the targeted title to align with the JD.
- Keep the SAME section structure, keys, order, and entry field names as the input — only improve the text content.
- Do NOT invent experience; only reframe what is already there.
- Extract the company name and role name from the JD.

${RESUME_WRITING_CRAFT}

${KEYWORD_INTEGRATION_RULES}

## Job Description
${jdText}

## Current Resume (JSON)
{
  "personalInfo": ${JSON.stringify(personalInfo, null, 2)},
  "sections": ${JSON.stringify(sections, null, 2)}
}

${RESUME_COVERAGE_SELF_CHECK}

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
