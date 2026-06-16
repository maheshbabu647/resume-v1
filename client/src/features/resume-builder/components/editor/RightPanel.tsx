import { Palette, Target, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEditorUIStore } from '../../store/useEditorUIStore'
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
