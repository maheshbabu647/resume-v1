import { useState, useEffect } from 'react'
import type { AtsMatchResult } from '../types/scoring.types'
import { useResumeStore } from '../../resume-builder/store/useResumeStore'
import { useJdMatchStore } from '../store/useJdMatchStore'
import { calculateAtsMatch } from '../lib/atsMatchEngine'

/**
 * Live ATS match score. Returns null when no JD-Spec is loaded (the UI shows an
 * "add a JD" empty state rather than a misleading 0). Recomputes on resume edits
 * and JD changes, debounced 250ms. Fully client-side — no network per keystroke.
 */
export function useAtsMatch(): AtsMatchResult | null {
  const resumeData = useResumeStore((s) => s.data)
  const jdSpec = useJdMatchStore((s) => s.jdSpec)
  const [result, setResult] = useState<AtsMatchResult | null>(null)

  useEffect(() => {
    if (!jdSpec) { setResult(null); return }
    const timer = setTimeout(() => setResult(calculateAtsMatch(resumeData, jdSpec)), 250)
    return () => clearTimeout(timer)
  }, [resumeData, jdSpec])

  return result
}
