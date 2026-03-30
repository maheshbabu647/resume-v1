import { useState, useEffect } from 'react'
import type { ResumeQualityScore } from '../types/scoring.types'
import { useResumeStore } from '../../resume-builder/store/useResumeStore'
import { calculateResumeQuality } from '../lib/resumeQualityEngine'

/**
 * Hook to get the current Resume Quality Score. 
 * Re-evaluates on every store change, debounced by 300ms.
 */
export function useResumeQualityScore() {
  const resumeData = useResumeStore((state) => state.data)
  const [scoreData, setScoreData] = useState<ResumeQualityScore | null>(null)

  useEffect(() => {
    // 300ms debounce
    const timer = setTimeout(() => {
      setScoreData(calculateResumeQuality(resumeData))
    }, 300)

    return () => clearTimeout(timer)
  }, [resumeData])

  return scoreData
}
