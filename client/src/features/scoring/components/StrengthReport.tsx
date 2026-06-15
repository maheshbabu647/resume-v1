import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useResumeStrengthScore } from '../hooks/useResumeStrengthScore'
import { getScoreColor } from '../lib/scoreColor'
import type { StrengthDimension } from '../types/scoring.types'
import styles from './ScoreReports.module.css'

const DIMENSION_LABELS: Record<StrengthDimension, string> = {
  impact: 'Impact & metrics',
  language: 'Action language',
  specificity: 'Specificity',
  density: 'Signal density',
  substance: 'Substance',
}

export default function StrengthReport() {
  const score = useResumeStrengthScore()
  if (!score) return <div className={styles.loading}>Evaluating…</div>

  const { totalScore, label, dimensionScores, dimensionMax, failedChecks } = score
  const color = getScoreColor(totalScore)
  const dims = Object.keys(dimensionScores) as StrengthDimension[]

  return (
    <div className={styles.report}>
      <div className={styles.ringWrap}>
        <div className={styles.ring} style={{ borderColor: color, color }}>{totalScore}</div>
        <div className={styles.ringMeta}>
          <span className={styles.ringLabel} style={{ color }}>{label}</span>
          <span className={styles.ringSub}>Content quality only — your template's ATS-safety isn't counted here.</span>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Breakdown</h4>
        <div className={styles.bars}>
          {dims.map((dim) => {
            const val = dimensionScores[dim]
            const max = dimensionMax[dim]
            const pct = Math.round((val / max) * 100)
            return (
              <div key={dim} className={styles.barRow}>
                <span className={styles.barLabel}>{DIMENSION_LABELS[dim]}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${pct}%`, background: getScoreColor(pct) }} />
                </div>
                <span className={styles.barVal}>{val}/{max}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Improvement areas</h4>
        {failedChecks.length === 0 ? (
          <div className={styles.perfect}>
            <CheckCircle2 size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />
            Strong, specific content across the board. Nicely done.
          </div>
        ) : (
          <div className={styles.checks}>
            {failedChecks.map((check, idx) => (
              <div key={`${check.checkId}-${idx}`} className={styles.checkCard}>
                <div className={styles.checkHead}>
                  <span className={styles.checkDim}>{DIMENSION_LABELS[check.dimension]}</span>
                  <span className={styles.checkPts}>−{check.pointsLost} pts</span>
                </div>
                <div className={styles.checkMsg}>{check.message}</div>
                {check.affectedItems && check.affectedItems.length > 0 && (
                  <div className={styles.affected}>
                    <span className={styles.affectedLabel}>Affected:</span>
                    {check.affectedItems.map((item, i) => (
                      <div key={i} className={styles.affectedItem}>
                        <AlertCircle size={12} style={{ marginTop: 2, flexShrink: 0 }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
