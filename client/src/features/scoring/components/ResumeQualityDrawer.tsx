import React from 'react'
import { AlertCircle } from 'lucide-react'
import type { ResumeQualityScore, ScoreDimension } from '../types/scoring.types'
import styles from './ResumeScore.module.css'

interface Props {
  scoreData: ResumeQualityScore
  onClose?: () => void
}

const DIMENSION_MAX = {
  completeness: 25,
  bulletQuality: 35,
  structure: 20,
  atsSafety: 10,
  keywordDensity: 10,
}

export const ResumeQualityDrawer: React.FC<Props> = ({ scoreData, onClose }) => {
  const { totalScore, label, dimensionScores, failedChecks } = scoreData

  let colorClass = styles.needsWork
  let borderColor = '#fecaca'
  
  if (totalScore >= 40) { colorClass = styles.fair; borderColor = '#fed7aa' }
  if (totalScore >= 60) { colorClass = styles.good; borderColor = '#fef08a' }
  if (totalScore >= 80) { colorClass = styles.strong; borderColor = '#bbf7d0' }
  if (totalScore >= 90) { colorClass = styles.excellent; borderColor = '#bfdbfe' }

  const content = (
    <div className={styles.content}>
      <div className={styles.scoreCircleContainer}>
        <div className={`${styles.scoreCircle} ${colorClass}`} style={{ borderColor }}>
          {totalScore}
        </div>
        <div className={styles.scoreLabel}>{label}</div>
      </div>

      <div className={styles.dimensionScores}>
        {Object.entries(dimensionScores).map(([key, val]) => (
          <div key={key} className={styles.dimensionRow}>
            <span className={styles.dimensionName}>
              {key.replace(/([A-Z])/g, ' $1')}
            </span>
            <span className={styles.dimensionValue}>
              {val} / {DIMENSION_MAX[key as ScoreDimension]}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.failedChecksSection}>
        <h3 className={styles.failedChecksTitle}>Improvement Areas</h3>
        
        {failedChecks.length === 0 ? (
          <div className={styles.perfectScore}>
            Your resume follows all best practices! You're ready to apply.
          </div>
        ) : (
          failedChecks.map((check, idx) => (
            <div key={`${check.checkId}-${idx}`} className={styles.failedCheckCard}>
              <div className={styles.failedCheckHeader}>
                <span className={styles.dimensionName} style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  {check.dimension.replace(/([A-Z])/g, ' $1').toUpperCase()}
                </span>
                <span className={styles.pointsLost}>-{check.pointsLost} pts</span>
              </div>
              <div className={styles.failedCheckMessage}>
                {check.message}
              </div>
              {check.affectedItems && check.affectedItems.length > 0 && (
                <div className={styles.affectedItems}>
                  <strong>Affected entries:</strong>
                  {check.affectedItems.map((item, i) => (
                    <div key={i} className={styles.affectedItem}>
                      <AlertCircle size={12} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )

  if (!onClose) {
    return content;
  }

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawer} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Resume Strength Analysis</h2>
          <button className={styles.closeBtn} onClick={onClose}><AlertCircle size={20} /></button>
        </div>
        {content}
      </div>
    </div>
  )
}


