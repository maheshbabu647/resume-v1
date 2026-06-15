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
3. Identify the 5-8 most important keywords/skills the JD emphasizes (tools, technologies, responsibilities, qualifications)
4. Write a focused cover letter that directly maps the candidate's experience to the JD's requirements
5. Naturally weave at least 4 of those JD keywords into the letter body, in context — never as a bullet list or a keyword dump
6. Keep it to 3-4 paragraphs, ~300-400 words total

## CRITICAL RULES
- Address the letter "Dear Hiring Manager," if no specific contact is mentioned
- NEVER fabricate experience, skills, or numbers not in the resume
- Only weave in a JD keyword if the candidate's resume genuinely supports it — do not claim skills the candidate doesn't have
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
  "wordCount": <number>,
  "keywordsUsed": ["<JD keyword actually woven into the body>", "..."]
}
`.trim()

const TONE_LABELS: Record<CoverLetterTone, string> = {
  professional: 'professional',
  enthusiastic: 'enthusiastic',
  concise: 'concise',
  creative: 'creative',
}

export const buildRewriteParagraphPrompt = (
  paragraph: string,
  instruction: string,
  tone?: CoverLetterTone,
  jdText?: string,
): string => `
You are an expert cover letter editor. Rewrite ONLY the single paragraph below, following the instruction. Preserve all facts, names, companies, and numbers exactly — never invent new experience, skills, or achievements.

## Original Paragraph
${paragraph}

## Instruction
${instruction}
${tone ? `\nKeep the rewrite consistent with a ${TONE_LABELS[tone]} tone.` : ''}
${jdText ? `\n## Job Description (for context/relevance only — do not quote directly)\n${jdText.slice(0, 3000)}` : ''}

## Output Format
Respond with ONLY valid JSON (no markdown, no explanation):
{
  "rewritten": "<the rewritten paragraph text only, no surrounding quotes>"
}
`.trim()
