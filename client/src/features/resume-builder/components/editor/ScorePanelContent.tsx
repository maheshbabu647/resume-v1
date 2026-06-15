import { useState } from 'react'
import { useEditorUIStore } from '../../store/useEditorUIStore'
import StrengthReport from '../../../scoring/components/StrengthReport'
import AtsReport from '../../../scoring/components/AtsReport'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { AuthRequireModal } from '@/shared/components/AuthRequireModal/AuthRequireModal'
import styles from './ScorePanelContent.module.css'

export default function ScorePanelContent() {
  const scoreSubTab = useEditorUIStore((s) => s.scoreSubTab)
  const setScoreSubTab = useEditorUIStore((s) => s.setScoreSubTab)
  const [authModalOpen, setAuthModalOpen] = useState(!useAuthStore.getState().isAuthenticated)

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

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

      {isAuthenticated ? (
        <div className={styles.content}>
          {scoreSubTab === 'strength' ? <StrengthReport /> : <AtsReport />}
        </div>
      ) : (
        <div className={styles.lockedContent}>
          <p className={styles.lockedText}>Log in to see your resume strength and ATS match scores.</p>
        </div>
      )}

      <AuthRequireModal
        isOpen={authModalOpen && !isAuthenticated}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setAuthModalOpen(false)}
        title="Authentication Required"
        subtitle="Please log in to use AI scoring and JD matchmaking."
      />
    </div>
  )
}
