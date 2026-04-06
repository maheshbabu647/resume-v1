import { useState, useRef, useCallback } from 'react'
import { FileUp, FileText, PenLine, ChevronRight, ArrowLeft, Check, AlertCircle, Loader2 } from 'lucide-react'
import { apiClient } from '@/shared/lib/apiClient'
import { trackResumeStartedFresh, trackResumeImported } from '@/shared/lib/analytics'
import { useResumeStore } from '../../store/useResumeStore'
import styles from './ResumeOnboarding.module.css'

type Step = 'choice' | 'upload' | 'processing' | 'error'

interface ResumeOnboardingProps {
  onComplete: () => void
}

const PROCESSING_STEPS = [
  { id: 'extract', label: 'Extracting text from your resume' },
  { id: 'analyze', label: 'Analyzing your experience & skills' },
  { id: 'organize', label: 'Structuring your data' },
  { id: 'prefill', label: 'Prefilling your resume editor' },
]

export default function ResumeOnboarding({ onComplete }: ResumeOnboardingProps) {
  const [step, setStep] = useState<Step>('choice')
  const [isDragOver, setIsDragOver] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const loadResume = useResumeStore(s => s.loadResume)

  const handleStartFresh = () => {
    trackResumeStartedFresh()
    onComplete()
  }

  const processFile = useCallback(async (file: File) => {
    setStep('processing')
    setProcessingStep(0)

    // Animate steps
    const stepTimer = (delay: number, stepIdx: number) =>
      new Promise<void>(res => setTimeout(() => { setProcessingStep(stepIdx); res() }, delay))

    // Step 1 — uploading
    await stepTimer(400, 1)

    try {
      const formData = new FormData()
      formData.append('resume', file)

      // Step 2 — analyzing (server starts working)
      const parsePromise = apiClient.post('/ai/parse-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      // Show fake progress steps while real request is in flight
      await stepTimer(1200, 2)
      await stepTimer(2400, 3)

      const response = await parsePromise
      const parsed = response.data.data

      setProcessingStep(4) // All done
      await new Promise(res => setTimeout(res, 600))

      trackResumeImported()

      // Load into store
      loadResume({
        _id: null,
        title: parsed.personalInfo?.fullName
          ? `${parsed.personalInfo.fullName}'s Resume`
          : 'Imported Resume',
        templateId: useResumeStore.getState().templateId,
        personalInfo: {
          ...parsed.personalInfo,
          contactLinks: parsed.personalInfo?.contactLinks || []
        },
        sections: parsed.sections || [],
        customization: null
      })

      onComplete()
    } catch (err: any) {
      let msg = err?.response?.data?.error?.message || 'Failed to parse your resume. Please try again.'
      if (err?.response?.status === 429 || err?.response?.data?.error?.code === 'RATE_LIMITED') {
        msg = 'you have reached your limit please try again.'
      }
      setErrorMsg(msg)
      setStep('error')
    }
  }, [loadResume, onComplete])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        {/* ─── Step 0: Choice ─── */}
        {step === 'choice' && (
          <div className={styles.choiceStep}>
            <div className={styles.choiceHeader}>
              <div className={styles.brandIcon}>
                <FileText size={26} color="white" />
              </div>
              <h2 className={styles.choiceTitle}>Let's build your resume</h2>
              <p className={styles.choiceSubtitle}>Start fresh with a blank editor, or upload an existing resume and let AI fill it in for you.</p>
            </div>

            <div className={styles.choiceOptions}>
              {/* Option 1: Upload */}
              <button className={`${styles.choiceBtn} ${styles.choiceBtnPrimary}`} onClick={() => setStep('upload')}>
                <div className={`${styles.choiceIconWrap} ${styles.choiceIconWrapPrimary}`}>
                  <FileUp size={20} />
                </div>
                <div>
                  <p className={styles.choiceBtnLabel}>Upload Existing Resume</p>
                  <p className={styles.choiceBtnDesc}>Upload a PDF or Word doc — AI will parse and prefill the editor</p>
                </div>
                <ChevronRight size={16} className={styles.choiceBtnChevron} />
              </button>

              {/* Option 2: Start Fresh */}
              <button className={styles.choiceBtn} onClick={handleStartFresh}>
                <div className={styles.choiceIconWrap}>
                  <PenLine size={20} />
                </div>
                <div>
                  <p className={styles.choiceBtnLabel}>Start from Scratch</p>
                  <p className={styles.choiceBtnDesc}>Blank editor — build your resume section by section</p>
                </div>
                <ChevronRight size={16} className={styles.choiceBtnChevron} />
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 1: Upload ─── */}
        {step === 'upload' && (
          <div className={styles.uploadStep}>
            <div className={styles.stepHeader}>
              <button className={styles.backBtn} onClick={() => setStep('choice')}>
                <ArrowLeft size={14} /> Back
              </button>
              <h2 className={styles.stepTitle}>Upload Your Resume</h2>
            </div>

            <div
              className={`${styles.dropzone} ${isDragOver ? styles.dropzoneActive : ''}`}
              onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={styles.dropzoneIcon}>
                <FileUp size={26} />
              </div>
              <p className={styles.dropzoneTitle}>Drag & drop your resume here</p>
              <p className={styles.dropzoneHint}>or click to browse files</p>
              <div className={styles.formatBadges}>
                <span className={styles.formatBadge}>PDF</span>
                <span className={styles.formatBadge}>DOCX</span>
                <span className={styles.formatBadge}>Max 5MB</span>
              </div>
              <button className={styles.uploadBtn} onClick={e => { e.stopPropagation(); fileInputRef.current?.click() }}>
                <FileUp size={14} /> Choose File
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* ─── Step 2: Processing ─── */}
        {step === 'processing' && (
          <div className={styles.processingStep}>
            <div className={styles.processingAnim}>
              <Loader2 size={32} className={styles.processingSpinner} />
            </div>
            <h2 className={styles.processingTitle}>Analyzing your resume...</h2>
            <p className={styles.processingSubtitle}>Our AI is reading and structuring your data</p>

            <div className={styles.processingSteps}>
              {PROCESSING_STEPS.map((s, i) => {
                const isDone = i < processingStep
                const isActive = i === processingStep
                return (
                  <div
                    key={s.id}
                    className={`${styles.processingStepRow} ${isDone ? styles.done : ''} ${isActive ? styles.active : ''}`}
                  >
                    <div className={`${styles.stepDot} ${isDone ? styles.done : ''} ${isActive ? styles.active : ''}`}>
                      {isDone && <Check size={12} strokeWidth={3} />}
                    </div>
                    {s.label}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ─── Error Step ─── */}
        {step === 'error' && (
          <div className={styles.errorStep}>
            <div className={styles.errorIcon}>
              <AlertCircle size={32} />
            </div>
            <h2 className={styles.errorTitle}>Something went wrong</h2>
            <p className={styles.errorMsg}>{errorMsg}</p>
            <div className={styles.errorActions}>
              <button className={styles.retryBtn} onClick={() => { setStep('upload'); setErrorMsg('') }}>
                Try Again
              </button>
              <button className={styles.cancelBtn} onClick={handleStartFresh}>
                Start Fresh Instead
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
