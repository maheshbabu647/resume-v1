import React, { useState } from 'react'
import { Check, AlertTriangle, Loader2, X } from 'lucide-react'
import { Button } from '../../../shared/components/Button/Button'
import { UpgradeModal } from '../../../shared/components/UpgradeModal/UpgradeModal'
import { useJDFitScore } from '../hooks/useJDFitScore'
import { useResumeStore } from '../../resume-builder/store/useResumeStore'
import { preprocessJD, serializeResume } from '../lib/jdPreprocessor'
import styles from './JDFit.module.css'

interface Props {
  onClose?: () => void
}

export const JDFitDrawer: React.FC<Props> = ({ onClose }) => {
  const resume = useResumeStore()
  const { mutate: analyze, isPending, data: scoreData, error } = useJDFitScore()
  const [jdTitle, setJdTitle] = useState('')
  const [jdText, setJdText] = useState('')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const quotaExceeded = (error as any)?.response?.data?.error?.code === 'QUOTA_EXCEEDED'

  const handleAnalyze = () => {
    if (!jdText.trim() || !jdTitle.trim()) return

    const serializedResume = serializeResume(resume.data)
    const preprocessedJD = preprocessJD(jdTitle, jdText)
    
    analyze({ serializedResume, preprocessedJD })
  }

  const renderChips = (skills: { skill: string; presentInResume: boolean }[], type: 'required' | 'preferred') => (
    <div className={styles.chipsContainer}>
      {skills.map((s, idx) => (
        <span 
          key={idx} 
          className={`${styles.chip} ${s.presentInResume ? styles.present : styles.missing}`}
          title={s.presentInResume ? 'Found in resume' : `Missing ${type} skill`}
        >
          {s.presentInResume ? <Check size={12} /> : <AlertTriangle size={12} />}
          {s.skill}
        </span>
      ))}
    </div>
  )

  const content = (
    <div className={styles.content}>
      <div className={styles.inputSection}>
        <h3>1. Paste the Job Information</h3>
        <input 
          className={styles.jdInput} 
          style={{ minHeight: 'auto' }}
          placeholder="Job Title (e.g. Senior Frontend Engineer)"
          value={jdTitle}
          onChange={(e) => setJdTitle(e.target.value)}
        />
        <textarea
          className={styles.jdInput}
          placeholder="Paste the full job description here..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
        />
        <Button 
          className={styles.analyzeBtn} 
          onClick={handleAnalyze} 
          disabled={isPending || jdText.length < 50 || !jdTitle.trim()}
        >
          {isPending ? <Loader2 size={16} className="spin" /> : null}
          {isPending ? 'Analyzing Match...' : 'Calculate Fit Score'}
        </Button>
        
        {error && (
          <div className={styles.errorBox}>
            {quotaExceeded ? (
              <div className={styles.quotaError}>
                <p>You've used all your JD tailorings for this month.</p>
                <Button variant="primary" size="sm" onClick={() => setShowUpgradeModal(true)}>
                  Upgrade Plan
                </Button>
              </div>
            ) : (
              'Failed to analyze the JD. Please try again.'
            )}
          </div>
        )}
      </div>

      {scoreData && !isPending && (
        <div className={styles.resultsSection}>
          <div className={styles.scoreHeader}>
            <div className={styles.scoreCircle}>
              {scoreData.fitScore}
            </div>
            <div className={styles.scoreInfo}>
              <div className={styles.scoreLabel}>{scoreData.label}</div>
              <div className={styles.seniorityText}>Expected Seniority: <strong>{scoreData.seniorityLevel}</strong></div>
              <div className={styles.seniorityText}>Semantic Overlap: <strong>{scoreData.semanticOverlapScore}/100</strong></div>
            </div>
          </div>

          <div className={styles.resultBlock}>
            <h4>Top Priorities (Missing Required Skills)</h4>
            {scoreData.missingKeywords.filter(k => k.importance === 'required').length > 0 ? (
              <div className={styles.chipsContainer}>
                {scoreData.missingKeywords.filter(k => k.importance === 'required').map(k => (
                  <span key={k.keyword} className={`${styles.chip} ${styles.missing}`} title={k.context}>
                    <AlertTriangle size={12} /> {k.keyword}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>You hit all the required keywords!</p>
            )}
          </div>

          <div className={styles.resultBlock}>
            <h4>Actionable Advice</h4>
            <div className={styles.suggestionList}>
              {scoreData.improvementSuggestions.map(s => (
                <div key={s.rank} className={styles.suggestionCard}>
                  <div className={styles.rankBadge}>{s.rank}</div>
                  <div>
                    <div className={styles.suggestionText}>{s.suggestion}</div>
                    <span className={styles.impactBadge}>{s.impact} impact</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.resultBlock}>
            <h4>All Keyword Checklist</h4>
            <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-2)' }}>Required Skills</p>
            {renderChips(scoreData.requiredSkills, 'required')}
            
            {scoreData.preferredSkills.length > 0 && (
              <>
                <p style={{ fontSize: '0.75rem', margin: '0.5rem 0 0', color: 'var(--text-2)' }}>Preferred Skills</p>
                {renderChips(scoreData.preferredSkills, 'preferred')}
              </>
            )}
          </div>
        </div>
      )}
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        trigger="jdTailoring" 
      />
    </div>
  )

  if (!onClose) {
    return content;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Job Description Match</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>
        {content}
      </div>
    </div>
  )
}


