import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Sparkles, Target, PenLine, ArrowLeft, ArrowRight } from 'lucide-react'
import styles from './Dashboard.module.css'

const DEFAULT_TEMPLATE = 'modern-centered'

export function GetStartedFlow() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)

  return (
    <div className={styles.getStarted}>
      <div className={styles.getStartedHead}>
        {step === 2 && (
          <button className={styles.getStartedBack} onClick={() => setStep(1)}>
            <ArrowLeft size={13} /> Back
          </button>
        )}
        <span className={styles.getStartedEyebrow}>Step {step} of 2</span>
      </div>

      {step === 1 ? (
        <>
          <h2 className={styles.getStartedTitle}>Do you have an existing resume?</h2>
          <p className={styles.getStartedSub}>We'll set you up the fastest way based on your answer.</p>
          <div className={styles.getStartedGrid}>
            <button className={styles.getStartedCard} data-accent="brand" onClick={() => setStep(2)}>
              <div className={styles.getStartedIconBox}><FileText size={20} /></div>
              <div className={styles.getStartedCardTitle}>Yes, I have one</div>
              <div className={styles.getStartedCardDesc}>Upload it and we'll prefill the editor — or score &amp; tailor it to a job.</div>
              <span className={styles.getStartedCta}>Continue <ArrowRight size={13} /></span>
            </button>
            <button
              className={styles.getStartedCard}
              data-accent="coral"
              onClick={() => navigate(`/resume/new?template=${DEFAULT_TEMPLATE}`, { state: { onboardingStep: 'flow' } })}
            >
              <div className={styles.getStartedIconBox}><Sparkles size={20} /></div>
              <div className={styles.getStartedCardTitle}>No, starting fresh</div>
              <div className={styles.getStartedCardDesc}>We'll walk you through a quick guided setup, step by step.</div>
              <span className={styles.getStartedCta}>Start from scratch <ArrowRight size={13} /></span>
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className={styles.getStartedTitle}>Do you have a job description for the role?</h2>
          <p className={styles.getStartedSub}>If you do, we can score your resume against it and tailor it to match.</p>
          <div className={styles.getStartedGrid}>
            <button className={styles.getStartedCard} data-accent="green" onClick={() => navigate('/jd-tailor')}>
              <div className={styles.getStartedIconBox}><Target size={20} /></div>
              <div className={styles.getStartedCardTitle}>Yes — score &amp; tailor it</div>
              <div className={styles.getStartedCardDesc}>Get your ATS score against the JD and tailor your resume to close the gaps.</div>
              <span className={styles.getStartedCta}>Go to ATS Score &amp; Tailor <ArrowRight size={13} /></span>
            </button>
            <button
              className={styles.getStartedCard}
              data-accent="brand"
              onClick={() => navigate(`/resume/new?template=${DEFAULT_TEMPLATE}`, { state: { onboardingStep: 'upload' } })}
            >
              <div className={styles.getStartedIconBox}><PenLine size={20} /></div>
              <div className={styles.getStartedCardTitle}>No — just build it</div>
              <div className={styles.getStartedCardDesc}>Upload your resume and we'll prefill the editor so you can polish it.</div>
              <span className={styles.getStartedCta}>Upload &amp; build <ArrowRight size={13} /></span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
