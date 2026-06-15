import { useState, useEffect } from 'react'
import type { ResumeStrengthScore } from '../types/scoring.types'
import { useResumeStore } from '../../resume-builder/store/useResumeStore'
import { calculateResumeStrength } from '../lib/resumeStrengthEngine'

/**
 * Live advanced (content-only) resume strength. Recomputes on every store change,
 * debounced 250ms. Fully client-side — no network.
 */
export function useResumeStrengthScore(): ResumeStrengthScore | null {
  const resumeData = useResumeStore((s) => s.data)
  const [score, setScore] = useState<ResumeStrengthScore | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setScore(calculateResumeStrength(resumeData)), 250)
    return () => clearTimeout(timer)
  }, [resumeData])

  return score
}
