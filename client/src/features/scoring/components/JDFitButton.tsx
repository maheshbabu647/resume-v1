import React, { useState } from 'react'
import { Target } from 'lucide-react'
import { JDFitDrawer } from './JDFitDrawer'
import styles from './JDFit.module.css'

export const JDFitButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={styles.triggerBtn}
        title="Check Job Fit"
      >
        <Target size={16} />
        <span>Match JD</span>
      </button>
      
      {isOpen && <JDFitDrawer onClose={() => setIsOpen(false)} />}
    </>
  )
}
