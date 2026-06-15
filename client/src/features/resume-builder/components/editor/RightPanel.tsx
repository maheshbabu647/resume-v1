import { Palette, Target, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react'
import { useEditorUIStore } from '../../store/useEditorUIStore'
import { useResumeStrengthScore } from '../../../scoring/hooks/useResumeStrengthScore'
import { useAtsMatch } from '../../../scoring/hooks/useAtsMatch'
import { getScoreColor } from '../../../scoring/lib/scoreColor'
import StylePanelContent from './StylePanelContent'
import ScorePanelContent from './ScorePanelContent'
import styles from './RightPanel.module.css'

const TABS = [
  { id: 'style' as const, label: 'Style', icon: Palette },
  { id: 'score' as const, label: 'Score', icon: Target },
]

export default function RightPanel() {
  const rightPanelTab = useEditorUIStore((s) => s.rightPanelTab)
  const setRightPanelTab = useEditorUIStore((s) => s.setRightPanelTab)
  const mobileViewMode = useEditorUIStore((s) => s.mobileViewMode)
  const rightPanelCollapsed = useEditorUIStore((s) => s.rightPanelCollapsed)
  const toggleRightPanelCollapsed = useEditorUIStore((s) => s.toggleRightPanelCollapsed)
  const setScoreSubTab = useEditorUIStore((s) => s.setScoreSubTab)

  const strength = useResumeStrengthScore()
  const ats = useAtsMatch()

  const openTab = (id: 'style' | 'score') => {
    if (rightPanelCollapsed) toggleRightPanelCollapsed()
    setRightPanelTab(id)
  }

  return (
    <aside className={`${styles.panel} ${rightPanelCollapsed ? styles.collapsed : ''} ${mobileViewMode !== 'insights' ? styles.hiddenOnMobile : ''}`}>
      {rightPanelCollapsed ? (
        <div className={styles.collapsedRail}>
          <button className={styles.collapseToggle} onClick={toggleRightPanelCollapsed} title="Expand panel">
            <ChevronLeft size={14} />
          </button>
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button key={tab.id} className={styles.railBtn} onClick={() => openTab(tab.id)} title={tab.label}>
                <Icon size={16} />
              </button>
            )
          })}
          {ats && (
            <div className={styles.railScoreBadge} title={`ATS Match: ${ats.score}/100`}
              style={{ color: getScoreColor(ats.score) }} onClick={() => { setScoreSubTab('fit'); openTab('score') }}>
              <Target size={12} />
              <span>{ats.score}</span>
            </div>
          )}
          {strength && (
            <div className={styles.railScoreBadge} title={`Resume Strength: ${strength.totalScore}/100`}
              style={{ color: getScoreColor(strength.totalScore) }} onClick={() => { setScoreSubTab('strength'); openTab('score') }}>
              <TrendingUp size={12} />
              <span>{strength.totalScore}</span>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className={styles.tabBar}>
            {TABS.map((tab) => {
              const Icon = tab.icon
              const active = rightPanelTab === tab.id
              return (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${active ? styles.tabActive : ''}`}
                  onClick={() => setRightPanelTab(tab.id)}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              )
            })}
            <button className={styles.collapseToggle} onClick={toggleRightPanelCollapsed} title="Collapse panel">
              <ChevronRight size={14} />
            </button>
          </div>

          <div className={styles.content}>
            {rightPanelTab === 'style' && <StylePanelContent />}
            {rightPanelTab === 'score' && <ScorePanelContent />}
          </div>
        </>
      )}
    </aside>
  )
}
