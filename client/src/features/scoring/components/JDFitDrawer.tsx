import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Check, AlertTriangle, Loader2, X, Upload, FileText, Wand2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../../shared/lib/apiClient'
import { Button } from '../../../shared/components/Button/Button'
import { UpgradeModal } from '../../../shared/components/UpgradeModal/UpgradeModal'
import { useJDFitScore } from '../hooks/useJDFitScore'
import { useResumeStore } from '../../resume-builder/store/useResumeStore'
import { preprocessJD, serializeResume } from '../lib/jdPreprocessor'
import { trackJDTailorRequested } from '@/shared/lib/analytics'
import { useUsage } from '@/core/hooks/useUsage'
import { TailorDiffDialog } from './TailorDiffDialog'
import { buildFieldDiffs, applyAcceptedDiffs } from './tailorDiffUtils'
import type { FieldDiffStep } from './tailorDiffUtils'
import styles from './JDFit.module.css'

interface Props {
  onClose?: () => void
}

export const JDFitDrawer: React.FC<Props> = ({ onClose }) => {
  const queryClient = useQueryClient()
  const resume = useResumeStore()
  const { mutate: analyze, isPending, data: scoreData, error } = useJDFitScore()
  const { isGuest, isAtLimit } = useUsage()

  const [jdSource,       setJdSource]       = useState<'paste' | 'upload'>('paste')
  const [jdText,         setJdText]         = useState('')
  const [isDraggingJd,   setIsDraggingJd]   = useState(false)
  const [uploadedJdFile, setUploadedJdFile] = useState<File | null>(null)

  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeFeature,   setUpgradeFeature]   = useState<'jdScore' | 'jdTailoring'>('jdScore')

  /* ── Diff dialog state ─────────────────────────────────────────────────── */
  const [diffOpen,         setDiffOpen]         = useState(false)
  const [fieldDiffSteps,   setFieldDiffSteps]   = useState<FieldDiffStep[]>([])
  const [pendingTailorData, setPendingTailorData] = useState<any>(null)

  const jdFileInputRef = useRef<HTMLInputElement>(null)

  /* ── Mutations ─────────────────────────────────────────────────────────── */
  const extractJdMutation = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData()
      fd.append('resume', file)
      const res = await apiClient.post('/ai/extract-text', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return res.data.data as string
    },
    onSuccess: (text) => setJdText(text)
  })

  const tailorMutation = useMutation({
    mutationFn: async (payload: {
      resumeId: string; jdText: string; personalInfo: any; sections: any[]
    }) => {
      const res = await apiClient.post('/ai/jd-tailor', payload)
      return res.data.data
    },
    onSuccess: (data) => {
      /* Build field-level diffs, filtered to only show actual changes */
      const steps = buildFieldDiffs({
        originalSections:      resume.data.sections,
        rewrittenSections:     data.rewrittenSections || [],
        originalPersonalInfo:  resume.data.personalInfo,
        rewrittenPersonalInfo: data.rewrittenPersonalInfo || null,
      })

      setPendingTailorData(data)
      setFieldDiffSteps(steps)
      setDiffOpen(true)
    },
    onError: (err: any) => {
      const code = err?.response?.data?.error?.code ?? err?.response?.data?.code
      if (code === 'GUEST_LIMIT_HIT') {
        window.dispatchEvent(new CustomEvent('guest-limit-hit', {
          detail: err?.response?.data?.data ?? { feature: 'jdTailoring' }
        }))
      } else if (code === 'QUOTA_EXCEEDED') {
        setUpgradeFeature('jdTailoring')
        setShowUpgradeModal(true)
      }
    }
  })

  /* ── JD file handling ──────────────────────────────────────────────────── */
  const processJdFile = (file: File) => {
    setUploadedJdFile(file)
    setJdText('')
    extractJdMutation.mutate(file)
  }

  const handleDropJd = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingJd(false)
    const file = e.dataTransfer.files[0]
    if (file) processJdFile(file)
  }, [])

  const errorCode = (error as any)?.response?.data?.error?.code ?? (error as any)?.response?.data?.code
  const quotaExceeded = errorCode === 'QUOTA_EXCEEDED'
  const guestLimitHit = errorCode === 'GUEST_LIMIT_HIT'

  useEffect(() => {
    if (guestLimitHit) {
      window.dispatchEvent(new CustomEvent('guest-limit-hit', {
        detail: (error as any)?.response?.data?.data ?? { feature: 'jdScore' }
      }))
    }
  }, [guestLimitHit, error])

  /* ── Analyze ────────────────────────────────────────────────────────────── */
  const handleAnalyze = () => {
    if (!jdText.trim() || jdText.length < 50) return
    if (isGuest && isAtLimit('jdScore')) {
      window.dispatchEvent(new CustomEvent('guest-limit-hit', { detail: { feature: 'jdScore' } }))
      return
    }
    const serializedResume = serializeResume(resume.data)
    const preprocessedJD  = preprocessJD(jdText)
    analyze({ serializedResume, preprocessedJD })
  }

  /* ── Tailor ─────────────────────────────────────────────────────────────── */
  const handleTailor = async () => {
    if (isGuest && isAtLimit('jdTailoring')) {
      window.dispatchEvent(new CustomEvent('guest-limit-hit', { detail: { feature: 'jdTailoring' } }))
      return
    }
    trackJDTailorRequested()

    let currentResumeId = resume.resumeId
    if (!currentResumeId) {
      try {
        const payload = {
          title:         resume.title.trim() || 'Untitled Resume',
          templateId:    resume.templateId   || 'modern-centered',
          personalInfo:  resume.data.personalInfo,
          sections:      resume.data.sections,
          customization: resume.customization
        }
        const res = await apiClient.post('/resumes', payload)
        currentResumeId = res.data.data._id
        useResumeStore.getState().setResumeId(currentResumeId!)
      } catch {
        alert('Please save your resume first.')
        return
      }
    }

    tailorMutation.mutate({
      resumeId:    currentResumeId!,
      jdText,
      personalInfo: resume.data.personalInfo,
      sections:     resume.data.sections,
    })
  }

  /* ── Diff dialog callbacks ──────────────────────────────────────────────── */
  const handleDiffComplete = (acceptedIds: Set<string>) => {
    if (!pendingTailorData) return
    applyAcceptedDiffs({
      acceptedIds,
      allSteps:              fieldDiffSteps,
      originalSections:      resume.data.sections,
      rewrittenSections:     pendingTailorData.rewrittenSections || [],
      originalPersonalInfo:  resume.data.personalInfo,
      rewrittenPersonalInfo: pendingTailorData.rewrittenPersonalInfo || null,
      updateSectionEntries:  useResumeStore.getState().updateSectionEntries,
      setPersonalField:      useResumeStore.getState().setPersonalField,
    })
    queryClient.invalidateQueries({ queryKey: ['usage'] })
  }

  const handleDiffClose = () => {
    setDiffOpen(false)
    if (onClose) onClose()
  }

  /* ── Render chips ───────────────────────────────────────────────────────── */
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

  /* ── Main content ───────────────────────────────────────────────────────── */
  const content = (
    <div className={styles.content}>

      {/* JD Input */}
      <div className={styles.inputSection}>
        <h3>1. Provide the Job Description</h3>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          {(['paste', 'upload'] as const).map(src => (
            <button
              key={src}
              type="button"
              onClick={() => setJdSource(src)}
              style={{
                padding: '6px 12px', fontSize: '12px', borderRadius: '4px',
                border: '1px solid var(--outline-variant)',
                background: jdSource === src ? 'var(--surface-container-high)' : 'transparent',
                color: jdSource === src ? 'var(--on-surface)' : 'var(--on-surface-variant)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
              }}
            >
              {src === 'paste' ? <><FileText size={12} /> Paste Text</> : <><Upload size={12} /> Upload File</>}
            </button>
          ))}
        </div>

        {jdSource === 'paste' && (
          <textarea
            className={styles.jdInput}
            placeholder="Paste the full job description here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
        )}

        {jdSource === 'upload' && (
          <div style={{ marginBottom: '16px' }}>
            {!uploadedJdFile ? (
              <div
                style={{
                  border: '1px dashed var(--outline-variant)', borderRadius: '8px',
                  padding: '24px', textAlign: 'center',
                  background: isDraggingJd ? 'rgba(99,102,241,0.05)' : 'transparent',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
                onDragOver={e => { e.preventDefault(); setIsDraggingJd(true) }}
                onDragLeave={() => setIsDraggingJd(false)}
                onDrop={handleDropJd}
                onClick={() => jdFileInputRef.current?.click()}
              >
                <div style={{ color: 'var(--on-surface-variant)', marginBottom: '8px' }}>
                  <Upload size={20} style={{ margin: '0 auto' }} />
                </div>
                <span style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--on-surface)', marginBottom: '4px' }}>Drag JD file here</span>
                <span style={{ display: 'block', fontSize: '12px', color: 'var(--on-surface-variant)' }}>PDF or DOCX, up to 5MB</span>
                <input
                  ref={jdFileInputRef} type="file" accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  onChange={e => { if (e.target.files?.[0]) processJdFile(e.target.files[0]) }}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '6px', background: 'var(--surface-container-high)', border: '1px solid var(--outline-variant)' }}>
                <FileText size={16} color="#f59e0b" />
                <span style={{ flex: 1, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{uploadedJdFile.name}</span>
                {extractJdMutation.isPending && <Loader2 size={14} className="spin" />}
                {extractJdMutation.isSuccess  && <Check size={14} color="#f59e0b" />}
                <button type="button" style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => { setUploadedJdFile(null); setJdText('') }}>
                  <X size={14} />
                </button>
              </div>
            )}
            {extractJdMutation.isSuccess && (
              <span style={{ display: 'block', marginTop: '8px', fontSize: '12px', color: '#f59e0b' }}>
                ✓ Extracted — {jdText.length} chars
              </span>
            )}
          </div>
        )}

        <Button className={styles.analyzeBtn} onClick={handleAnalyze} disabled={isPending || jdText.length < 50}>
          {isPending ? <Loader2 size={16} className="spin" /> : null}
          {isPending ? 'Analyzing Match...' : 'Calculate Fit Score'}
        </Button>

        {error && (
          <div className={styles.errorBox}>
            {quotaExceeded ? (
              <div className={styles.quotaError}>
                <p>You've used all your credits for this month.</p>
                <Button variant="primary" size="sm" onClick={() => setShowUpgradeModal(true)}>Upgrade Plan</Button>
              </div>
            ) : 'Failed to analyze the JD. Please try again.'}
          </div>
        )}
      </div>

      {/* Score results */}
      {scoreData && !isPending && (
        <div className={styles.resultsSection}>
          <div className={styles.scoreHeader}>
            <div className={styles.scoreCircle}>{scoreData.fitScore}</div>
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

          {/* Tailor action */}
          <div style={{ marginTop: '24px', padding: '16px', background: 'var(--surface-container-low)', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '14px' }}>Tailor My Resume</h4>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
              Let AI rewrite your resume sections to align with this JD.
              <br />
              <span style={{ fontSize: '11px', color: 'var(--outline)', fontStyle: 'italic' }}>
                You'll review each individual change before it's applied.
              </span>
            </p>
            <Button
              variant="primary"
              onClick={handleTailor}
              disabled={tailorMutation.isPending}
              style={{ width: '100%', display: 'flex', gap: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none' }}
            >
              {tailorMutation.isPending ? <Loader2 size={16} className="spin" /> : <Wand2 size={16} />}
              {tailorMutation.isPending ? 'Generating AI Changes...' : 'Tailor To Job Description'}
            </Button>
            {tailorMutation.error && (
              <span style={{ display: 'block', marginTop: '8px', fontSize: '12px', color: 'var(--error)' }}>
                Failed to tailor resume. Please try again.
              </span>
            )}
          </div>
        </div>
      )}

      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} trigger={upgradeFeature} />

      {/* Field-level diff review dialog */}
      <TailorDiffDialog
        isOpen={diffOpen}
        isPending={tailorMutation.isPending}
        steps={fieldDiffSteps}
        jdCompanyName={pendingTailorData?.jdCompanyName}
        jdRoleName={pendingTailorData?.jdRoleName}
        onComplete={handleDiffComplete}
        onClose={handleDiffClose}
      />
    </div>
  )

  if (!onClose) return content

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
