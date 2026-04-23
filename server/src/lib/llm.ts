import { GoogleGenerativeAI, type GenerationConfig } from '@google/generative-ai'
import { env } from '../config/env'
import { AI } from '../config/constants'
import { AppError } from './AppError'
import { logger } from '../config/logger'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
const model  = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

interface LLMCallOptions {
  jsonMode?: boolean
  maxOutputTokens?: number
  temperature?: number
}

export const callLLM = async (prompt: string, opts: LLMCallOptions = {}): Promise<string> => {
  const generationConfig: GenerationConfig = {
    maxOutputTokens: opts.maxOutputTokens ?? AI.MAX_OUTPUT_TOKENS,
    ...(opts.temperature !== undefined && { temperature: opts.temperature }),
    ...(opts.jsonMode && { responseMimeType: 'application/json' }),
  }
  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    })
    return result.response.text()
  } catch (err: any) {
    logger.error({ err }, '[LLM] Error')
    throw new AppError('LLM_ERROR', 500, 'AI service temporarily unavailable.')
  }
}

export const callLLMJSON = async <T>(prompt: string, opts: Omit<LLMCallOptions, 'jsonMode'> = {}): Promise<T> => {
  let raw = await callLLM(prompt, { ...opts, jsonMode: true })
  try {
    // Strip markdown code block wrappers if the LLM includes them despite jsonMode
    raw = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
    return JSON.parse(raw) as T
  } catch {
    logger.error({ raw: raw.slice(0, 1000) }, '[LLM] JSON parse failed')
    throw new AppError('LLM_ERROR', 500, 'AI returned an unexpected format.')
  }
}
