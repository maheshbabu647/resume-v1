import { useEditorUIStore } from '../../store/useEditorUIStore'
import StrengthReport from '../../../scoring/components/StrengthReport'
import AtsReport from '../../../scoring/components/AtsReport'
import styles from './ScorePanelContent.module.css'

export default function ScorePanelContent() {
  const scoreSubTab = useEditorUIStore((s) => s.scoreSubTab)
  const setScoreSubTab = useEditorUIStore((s) => s.setScoreSubTab)

  // Scores + reports are visible to everyone. Only updating the JD (one server call)
  // requires auth — that gate lives inside AtsReport.
  return (
    <div className={styles.panel}>
      <div className={styles.tabBar}>
        <button
          className={`${styles.tab} ${scoreSubTab === 'strength' ? styles.tabActive : ''}`}
          onClick={() => setScoreSubTab('strength')}
        >
          Strength
        </button>
        <button
          className={`${styles.tab} ${scoreSubTab === 'fit' ? styles.tabActive : ''}`}
          onClick={() => setScoreSubTab('fit')}
        >
          ATS Score
        </button>
      </div>

      <div className={styles.content}>
        {scoreSubTab === 'strength' ? <StrengthReport /> : <AtsReport />}
      </div>
    </div>
  )
}
