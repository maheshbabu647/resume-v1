import React, { useState } from 'react'
import { Activity } from 'lucide-react'
import { useResumeQualityScore } from '../hooks/useResumeQualityScore'
import { ResumeQualityDrawer } from './ResumeQualityDrawer'
import styles from './ResumeScore.module.css'

export const ResumeScoreButton: React.FC = () => {
  const scoreData = useResumeQualityScore()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  if (!scoreData) return null

  let colorClass = styles.needsWork
  if (scoreData.totalScore >= 40) colorClass = styles.fair
  if (scoreData.totalScore >= 60) colorClass = styles.good
  if (scoreData.totalScore >= 80) colorClass = styles.strong
  if (scoreData.totalScore >= 90) colorClass = styles.excellent

  return (
    <>
      <button 
        className={`${styles.scoreBtn} ${colorClass}`} 
        onClick={() => setIsOpen(true)}
        title="View Resume Strength"
      >
        <Activity size={16} />
        <span>{scoreData.totalScore}/100</span>
      </button>
      
      {isOpen && (
        <ResumeQualityDrawer 
          scoreData={scoreData} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  )
}
