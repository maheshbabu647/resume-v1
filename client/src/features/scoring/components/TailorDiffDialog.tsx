import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Check, X, ChevronRight, ChevronLeft,
  Wand2, SkipForward, Loader2, Sparkles
} from 'lucide-react'
import type { FieldDiffStep } from './tailorDiffUtils'
import styles from './TailorDiffDialog.module.css'

interface TailorDiffDialogProps {
  isOpen:          boolean
  isPending:       boolean
  steps:           FieldDiffStep[]
  jdCompanyName?:  string
  jdRoleName?:     string
  onComplete:      (acceptedIds: Set<string>) => void
  onClose:         () => void
}

export const TailorDiffDialog = ({
  isOpen,
  isPending,
  steps,
  jdCompanyName,
  jdRoleName,
  onComplete,
  onClose,
}: TailorDiffDialogProps) => {
  const [stepIdx,   setStepIdx]   = useState(0)
  const [accepted,  setAccepted]  = useState<Set<string>>(new Set())
  const [completed, setCompleted] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  /* Reset when opened with new steps */
  useEffect(() => {
    if (isOpen) {
      setStepIdx(0)
      setAccepted(new Set())
      setCompleted(false)
    }
  }, [isOpen, steps])

  /* Escape to close */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && !isPending) onClose() }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, isPending, onClose])

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  /* Scroll content to top when step changes */
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [stepIdx])

  const finishReview = useCallback((finalAccepted: Set<string>) => {
    setCompleted(true)
    onComplete(finalAccepted)
    setTimeout(onClose, 1400)
  }, [onComplete, onClose])

  const advance = useCallback((newAccepted: Set<string>) => {
    if (stepIdx >= steps.length - 1) {
      finishReview(newAccepted)
    } else {
      setStepIdx(i => i + 1)
      setAccepted(newAccepted)
    }
  }, [stepIdx, steps.length, finishReview])

  const handleKeep = () => {
    const step = steps[stepIdx]
    const updated = new Set(accepted)
    updated.add(step.id)
    advance(updated)
  }

  const handleReject = () => {
    advance(new Set(accepted)) // don't add current to accepted
  }

  const handleSkipAll = () => {
    // Accept all remaining (including current)
    const updated = new Set(accepted)
    for (let i = stepIdx; i < steps.length; i++) {
      updated.add(steps[i].id)
    }
    finishReview(updated)
  }

  if (!isOpen) return null

  const currentStep  = steps[stepIdx]
  const progressNext = steps.length > 0 ? ((stepIdx + 1) / steps.length) * 100 : 100

  return (
    <div className={styles.backdrop} onClick={() => !isPending && onClose()}>
      <div className={styles.dialog} onClick={e => e.stopPropagation()}>

        {/* ── Header ─────────────────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.wandIcon}>
              <Wand2 size={16} />
            </div>
            <div>
              <h2 className={styles.title}>Review AI Changes</h2>
              {(jdRoleName || jdCompanyName) && (
                <span className={styles.subtitle}>
                  {jdRoleName && <span className={styles.roleName}>{jdRoleName}</span>}
                  {jdCompanyName && <> at <span className={styles.companyName}>{jdCompanyName}</span></>}
                </span>
              )}
            </div>
          </div>
          {!isPending && !completed && (
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          )}
        </div>

        {/* ── Progress bar ────────────────────────────────────── */}
        {!isPending && !completed && steps.length > 0 && (
          <div className={styles.progressWrap}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progressNext}%` }}
              />
            </div>
            <span className={styles.progressLabel}>
              {stepIdx + 1} / {steps.length}
            </span>
          </div>
        )}

        {/* ── Generating state ─────────────────────────────────── */}
        {isPending && (
          <div className={styles.pendingState}>
            <div className={styles.pendingIconWrap}>
              <Loader2 size={32} className={styles.spin} />
            </div>
            <p className={styles.pendingTitle}>Tailoring your resume…</p>
            <p className={styles.pendingSubtitle}>
              Injecting JD keywords, strengthening bullet points, and aligning your experience for this role.
            </p>
          </div>
        )}

        {/* ── Completed state ──────────────────────────────────── */}
        {completed && (
          <div className={styles.completedState}>
            <div className={styles.completedIconWrap}>
              <Check size={24} />
            </div>
            <p className={styles.completedTitle}>Resume Updated!</p>
            <p className={styles.completedSubtitle}>
              {accepted.size} of {steps.length} suggestion{steps.length !== 1 ? 's' : ''} applied.
            </p>
          </div>
        )}

        {/* ── No changes state ─────────────────────────────────── */}
        {!isPending && !completed && steps.length === 0 && (
          <div className={styles.pendingState}>
            <div className={styles.completedIconWrap} style={{ background: 'rgba(99,102,241,0.15)', borderColor: 'rgba(99,102,241,0.3)', color: '#818cf8' }}>
              <Sparkles size={22} />
            </div>
            <p className={styles.pendingTitle}>Already Optimised</p>
            <p className={styles.pendingSubtitle}>
              The AI didn't find anything substantial to change.
              Your resume already matches this job description well!
            </p>
            <button className={styles.acceptBtn} style={{ marginTop: '16px' }} onClick={onClose}>
              Close
            </button>
          </div>
        )}

        {/* ── Diff step content ────────────────────────────────── */}
        {!isPending && !completed && currentStep && (
          <div ref={contentRef} className={styles.stepContent}>

            {/* Breadcrumb: Section → Entry → Field */}
            <div className={styles.breadcrumb}>
              <span className={styles.bcSection}>
                {currentStep.sectionKey === 'personalInfo'
                  ? <><Sparkles size={11} /> Professional Info</>
                  : <><Wand2 size={11} /> {currentStep.sectionName}</>
                }
              </span>
              {currentStep.entryIndex >= 0 && (
                <>
                  <span className={styles.bcSep}>/</span>
                  <span className={styles.bcEntry}>{currentStep.entryLabel}</span>
                </>
              )}
              <span className={styles.bcSep}>/</span>
              <span className={styles.bcField}>{currentStep.fieldLabel}</span>
            </div>

            {/* Before / After cards */}
            <div className={styles.diffArea}>
              {/* Before */}
              <div className={styles.diffCard}>
                <div className={styles.diffCardHeader}>
                  <span className={styles.diffCardLabel}>Before</span>
                  <span className={styles.diffCardTag}>Original</span>
                </div>
                <div className={styles.diffCardBody}>
                  {currentStep.before
                    ? currentStep.before.split('\n').map((line, i) => (
                        <p key={i} className={`${styles.diffLine} ${line.startsWith('•') || line.startsWith('-') ? styles.bulletLine : ''}`}>
                          {line}
                        </p>
                      ))
                    : <p className={styles.emptyLine}>(empty)</p>
                  }
                </div>
              </div>

              {/* Arrow */}
              <div className={styles.diffArrow}>
                <ChevronRight size={16} />
              </div>

              {/* After */}
              <div className={`${styles.diffCard} ${styles.diffCardAfter}`}>
                <div className={styles.diffCardHeader}>
                  <span className={styles.diffCardLabel}>After</span>
                  <span className={`${styles.diffCardTag} ${styles.afterTag}`}>AI Improved</span>
                </div>
                <div className={styles.diffCardBody}>
                  {currentStep.after.split('\n').map((line, i) => (
                    <p key={i} className={`${styles.diffLine} ${styles.afterLine} ${line.startsWith('•') || line.startsWith('-') ? styles.bulletLine : ''}`}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Action bar */}
            <div className={styles.actionBar}>
              <button className={styles.skipAllBtn} onClick={handleSkipAll}>
                <SkipForward size={12} /> Accept All Remaining
              </button>

              <div className={styles.mainActions}>
                <button className={styles.rejectBtn} onClick={handleReject}>
                  <X size={13} /> Keep Original
                </button>
                <button className={styles.acceptBtn} onClick={handleKeep}>
                  <Check size={13} />
                  {stepIdx >= steps.length - 1 ? 'Apply & Finish' : 'Apply & Continue'}
                  {stepIdx < steps.length - 1 && <ChevronRight size={13} />}
                </button>
              </div>
            </div>

            {/* Back nav */}
            {stepIdx > 0 && (
              <div className={styles.navHint}>
                <button className={styles.prevBtn} onClick={() => setStepIdx(i => i - 1)}>
                  <ChevronLeft size={12} /> Back
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
