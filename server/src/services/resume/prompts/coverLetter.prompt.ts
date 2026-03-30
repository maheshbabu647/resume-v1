// coverLetter.prompt.ts — generates a professional, tailored cover letter
// Returns JSON: { subject, body }

type CoverLetterTone = 'professional' | 'enthusiastic' | 'concise' | 'creative'

const TONE_INSTRUCTIONS: Record<CoverLetterTone, string> = {
  professional: 'Write in a formal, polished, and confident tone. Use industry-standard language. Avoid exclamation marks.',
  enthusiastic: 'Write in an energetic and passionate tone. Show genuine excitement for the role and company. Use positive, forward-looking language.',
  concise: 'Be extremely concise and direct. Every sentence must carry weight. Avoid filler words. Aim for 3 tight paragraphs.',
  creative: 'Write in a distinctive, engaging voice that stands out. Use a compelling opening hook. Show personality while remaining professional.',
}

export const buildCoverLetterPrompt = (resumeText: string, jdText: string, tone: CoverLetterTone): string => `
You are a world-class career coach and professional writing expert. Your task is to write a compelling, tailored cover letter for a specific job application.

## Tone Instruction
${TONE_INSTRUCTIONS[tone]}

## Job Description
${jdText}

## Candidate's Resume
${resumeText}

## Your Task
1. Extract the candidate's name, most relevant experience, and strongest achievements from the resume
2. Identify the company name and role from the JD
3. Write a focused cover letter that directly maps the candidate's experience to the JD's requirements
4. Naturally weave in 2-3 specific keywords from the JD
5. Keep it to 3-4 paragraphs, ~300-400 words total

## CRITICAL RULES
- Address the letter "Dear Hiring Manager," if no specific contact is mentioned
- NEVER fabricate experience, skills, or numbers not in the resume
- Make the opening sentence compelling — do NOT start with "I am writing to apply..."
- End with a confident call to action referencing next steps
- Include a professional subject line for email use

## Output Format
Respond with ONLY valid JSON (no markdown, no explanation):
{
  "subject": "Application for <Role> — <Candidate Name>",
  "recipientName": "Hiring Manager",
  "companyName": "<extracted from JD or 'the company'>",
  "roleName": "<extracted from JD>",
  "body": "<full cover letter text, use \\n\\n for paragraph breaks>",
  "wordCount": <number>
}
`.trim()
