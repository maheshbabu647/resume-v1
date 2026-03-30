import { AI } from '../../../config/constants'

interface SuggestPromptInput {
  sectionKey: string; fieldName: string; currentValue: string
  contextFields?: Record<string, string>; userNotes?: string
}

export const buildSuggestPrompt = ({ sectionKey, fieldName, currentValue, contextFields, userNotes }: SuggestPromptInput): string => `
You are an expert resume writer. Improve the following resume field.

Section: ${sectionKey} | Field: ${fieldName}
${contextFields ? `Context: ${JSON.stringify(contextFields)}` : ''}
${userNotes ? `Candidate notes: ${userNotes}` : ''}

Current content: ${currentValue}

Write exactly ${AI.SUGGESTION_COUNT} improved alternatives. Start with action verbs. Add impact where plausible. Keep to 1-2 sentences.

Respond with ONLY a JSON array: ["suggestion 1", "suggestion 2", "suggestion 3"]
`.trim()
