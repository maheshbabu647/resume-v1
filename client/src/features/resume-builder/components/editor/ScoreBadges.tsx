import { Target, TrendingUp, Plus, Loader2 } from 'lucide-react'
import { useResumeStrengthScore } from '../../../scoring/hooks/useResumeStrengthScore'
import { useAtsMatch } from '../../../scoring/hooks/useAtsMatch'
import { useJdMatchStore } from '../../../scoring/store/useJdMatchStore'
import { getScoreColor } from '../../../scoring/lib/scoreColor'
import { useEditorUIStore } from '../../store/useEditorUIStore'
import styles from './ScoreBadges.module.css'

/**
 * Two always-visible score pills in the toolbar: live ATS match + resume strength.
 * Shown to everyone (incl. guests) — clicking either opens the right-panel Score tab on
 * the matching sub-report. When no JD is loaded the ATS pill shows an "+ JD" affordance
 * instead of a misleading 0.
 */
export function ScoreBadges() {
  const strength = useResumeStrengthScore()
  const ats = useAtsMatch()
  const jdStatus = useJdMatchStore((s) => s.status)

  const setRightPanelTab = useEditorUIStore((s) => s.setRightPanelTab)
  const setScoreSubTab = useEditorUIStore((s) => s.setScoreSubTab)
  const rightPanelCollapsed = useEditorUIStore((s) => s.rightPanelCollapsed)
  const toggleRightPanelCollapsed = useEditorUIStore((s) => s.toggleRightPanelCollapsed)
  const setMobileViewMode = useEditorUIStore((s) => s.setMobileViewMode)

  const open = (sub: 'strength' | 'fit') => {
    setScoreSubTab(sub)
    setRightPanelTab('score')
    if (rightPanelCollapsed) toggleRightPanelCollapsed()
    setMobileViewMode('insights')
  }

  return (
    <div className={styles.wrap}>
      <button className={styles.badge} onClick={() => open('fit')} title="ATS match score — based on the job description">
        <Target size={13} className={styles.icon} />
        <span className={styles.label}>ATS</span>
        {jdStatus === 'loading' ? (
          <Loader2 size={12} className={`spin ${styles.num}`} />
        ) : ats ? (
          <span className={styles.num} style={{ color: getScoreColor(ats.score) }}>{ats.score}</span>
        ) : (
          <span className={styles.add}><Plus size={11} /> JD</span>
        )}
      </button>

      <button className={styles.badge} onClick={() => open('strength')} title="Resume strength — content quality">
        <TrendingUp size={13} className={styles.icon} />
        <span className={styles.label}>Strength</span>
        {strength ? (
          <span className={styles.num} style={{ color: getScoreColor(strength.totalScore) }}>{strength.totalScore}</span>
        ) : (
          <Loader2 size={12} className={`spin ${styles.num}`} />
        )}
      </button>
    </div>
  )
}
