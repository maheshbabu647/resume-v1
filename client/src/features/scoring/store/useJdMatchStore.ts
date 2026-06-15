import { create } from 'zustand'
import type { JDSpec } from '../types/scoring.types'

/**
 * Holds the active job description + its extracted JD-Spec for the editor's live ATS score.
 * The spec is fetched ONCE per JD (server /ai/jd-spec, cached 24h) and reused while the user
 * edits. Persisted to localStorage per-resume so a refresh keeps the JD in place.
 */

export type JdStatus = 'idle' | 'loading' | 'ready' | 'error'

interface JdMatchStore {
  resumeKey: string | null
  jdText: string
  jdSpec: JDSpec | null
  status: JdStatus
  error: string | null

  setStatus: (status: JdStatus, error?: string | null) => void
  setJd: (jdText: string, jdSpec: JDSpec) => void
  clearJd: () => void
  hydrate: (resumeKey: string) => void
}

const keyFor = (rk: string) => `cf_jdmatch_${rk}`

export const useJdMatchStore = create<JdMatchStore>((set, get) => ({
  resumeKey: null,
  jdText: '',
  jdSpec: null,
  status: 'idle',
  error: null,

  setStatus: (status, error = null) => set({ status, error }),

  setJd: (jdText, jdSpec) => {
    set({ jdText, jdSpec, status: 'ready', error: null })
    const rk = get().resumeKey
    if (rk) { try { localStorage.setItem(keyFor(rk), JSON.stringify({ jdText, jdSpec })) } catch { /* ignore */ } }
  },

  clearJd: () => {
    set({ jdText: '', jdSpec: null, status: 'idle', error: null })
    const rk = get().resumeKey
    if (rk) { try { localStorage.removeItem(keyFor(rk)) } catch { /* ignore */ } }
  },

  hydrate: (resumeKey) => {
    let jdText = ''
    let jdSpec: JDSpec | null = null
    let status: JdStatus = 'idle'
    try {
      const raw = localStorage.getItem(keyFor(resumeKey))
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.jdSpec) { jdText = parsed.jdText || ''; jdSpec = parsed.jdSpec; status = 'ready' }
      }
    } catch { /* ignore */ }
    set({ resumeKey, jdText, jdSpec, status, error: null })
  },
}))
