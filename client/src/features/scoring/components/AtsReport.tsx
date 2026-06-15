import { useState, useRef, useCallback } from 'react'
import {
  Target, Upload, FileText, X, Check, AlertTriangle, Loader2,
  RefreshCw, Wand2, CheckCircle2,
} from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/apiClient'
import { useUsage } from '@/core/hooks/useUsage'
import { UpgradeModal } from '@/shared/components/UpgradeModal/UpgradeModal'
import { trackJDTailorRequested } from '@/shared/lib/analytics'
import { useResumeStore } from '../../resume-builder/store/useResumeStore'
import { useJdMatchStore } from '../store/useJdMatchStore'
import { useAtsMatch } from '../hooks/useAtsMatch'
import { useFetchJdSpec } from '../hooks/useFetchJdSpec'
import { getScoreColor } from '../lib/scoreColor'
import { TailorDiffDialog } from './TailorDiffDialog'
import { buildFieldDiffs, applyAcceptedDiffs } from './tailorDiffUtils'
import type { FieldDiffStep } from './tailorDiffUtils'
import type { AtsSkillMatch } from '../types/scoring.types'
import styles from './ScoreReports.module.css'

const COMPONENT_LABELS: { key: 'required' | 'preferred' | 'title' | 'context'; label: string }[] = [
  { key: 'required',  label: 'Required skills' },
  { key: 'preferred', label: 'Preferred skills' },
  { key: 'title',     label: 'Title match' },
  { key: 'context',   label: 'Responsibilities' },
]

export default function AtsReport() {
  const queryClient = useQueryClient()
  const { jdText, jdSpec } = useJdMatchStore()
  const ats = useAtsMatch()
  const fetchSpec = useFetchJdSpec()
  const { isGuest, isAtLimit } = useUsage()
  const resume = useResumeStore()

  // JD input UI
  const [editing, setEditing] = useState(false)
  const [jdSource, setJdSource] = useState<'paste' | 'upload'>('paste')
  const [draft, setDraft] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [showUpgrade, setShowUpgrade] = useState(false)
  const [upgradeFeature, setUpgradeFeature] = useState<'jdScore' | 'jdTailoring'>('jdScore')

  // Tailor flow
  const [diffOpen, setDiffOpen] = useState(false)
  const [diffSteps, setDiffSteps] = useState<FieldDiffStep[]>([])
  const [pendingTailor, setPendingTailor] = useState<any>(null)

  const showInput = !jdSpec || editing
  const fetchError = useJdMatchStore((s) => s.error)
  const quotaHit = fetchError === 'quota'

  /* ── JD file extraction ── */
  const extractJd = useMutation({
    mutationFn: async (f: File) => {
      const fd = new FormData()
      fd.append('resume', f)
      const res = await apiClient.post('/ai/extract-text', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      return res.data.data as string
    },
    onSuccess: (text) => setDraft(text),
  })

  const processFile = (f: File) => { setFile(f); setDraft(''); extractJd.mutate(f) }
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]; if (f) processFile(f)
  }, [])

  /* ── Calculate (fetch JD-Spec once) ── */
  const handleCalculate = async () => {
    if (draft.trim().length < 50) return
    if (isGuest && isAtLimit('jdScore')) {
      window.dispatchEvent(new CustomEvent('guest-limit-hit', { detail: { feature: 'jdScore' } }))
      return
    }
    try {
      await fetchSpec.mutateAsync(draft)
      setEditing(false); setFile(null)
    } catch { /* error surfaced via store */ }
  }

  const startChange = () => { setDraft(jdText); setJdSource('paste'); setFile(null); setEditing(true) }

  /* ── Tailor ── */
  const tailorMutation = useMutation({
    mutationFn: async (payload: { resumeId: string; jdText: string; personalInfo: any; sections: any[] }) => {
      const res = await apiClient.post('/ai/jd-tailor', payload)
      return res.data.data
    },
    onSuccess: (data) => {
      const steps = buildFieldDiffs({
        originalSections: resume.data.sections,
        rewrittenSections: data.rewrittenSections || [],
        originalPersonalInfo: resume.data.personalInfo,
        rewrittenPersonalInfo: data.rewrittenPersonalInfo || null,
      })
      setPendingTailor(data); setDiffSteps(steps); setDiffOpen(true)
    },
    onError: (err: any) => {
      const code = err?.response?.data?.error?.code ?? err?.response?.data?.code
      if (code === 'GUEST_LIMIT_HIT') {
        window.dispatchEvent(new CustomEvent('guest-limit-hit', { detail: err?.response?.data?.data ?? { feature: 'jdTailoring' } }))
      } else if (code === 'QUOTA_EXCEEDED') {
        setUpgradeFeature('jdTailoring'); setShowUpgrade(true)
      }
    },
  })

  const handleTailor = async () => {
    if (isGuest && isAtLimit('jdTailoring')) {
      window.dispatchEvent(new CustomEvent('guest-limit-hit', { detail: { feature: 'jdTailoring' } }))
      return
    }
    trackJDTailorRequested()
    let currentResumeId = resume.resumeId
    if (!currentResumeId) {
      try {
        const res = await apiClient.post('/resumes', {
          title: resume.title.trim() || 'Untitled Resume',
          templateId: resume.templateId || 'modern-centered',
          personalInfo: resume.data.personalInfo,
          sections: resume.data.sections,
          customization: resume.customization,
        })
        currentResumeId = res.data.data._id
        useResumeStore.getState().setResumeId(currentResumeId!)
      } catch { alert('Please save your resume first.'); return }
    }
    tailorMutation.mutate({ resumeId: currentResumeId!, jdText, personalInfo: resume.data.personalInfo, sections: resume.data.sections })
  }

  const handleDiffComplete = (acceptedIds: Set<string>) => {
    if (!pendingTailor) return
    applyAcceptedDiffs({
      acceptedIds, allSteps: diffSteps,
      originalSections: resume.data.sections,
      rewrittenSections: pendingTailor.rewrittenSections || [],
      originalPersonalInfo: resume.data.personalInfo,
      rewrittenPersonalInfo: pendingTailor.rewrittenPersonalInfo || null,
      updateSectionEntries: useResumeStore.getState().updateSectionEntries as (key: string, entries: any[]) => void,
      setPersonalField: useResumeStore.getState().setPersonalField,
    })
    queryClient.invalidateQueries({ queryKey: ['usage'] })
  }

  /* ── Render: chips ── */
  const renderChips = (skills: AtsSkillMatch[]) => (
    <div className={styles.chips}>
      {skills.map((s) => (
        <span key={s.term} className={`${styles.chip} ${s.matched ? styles.chipOk : styles.chipMiss}`}
          title={s.matched ? `Found (match ${Math.round(s.matchValue * 100)}%)` : 'Missing from your resume'}>
          {s.matched ? <Check size={11} /> : <AlertTriangle size={11} />}
          {s.term}
          {s.weight >= 3 && <span className={styles.chipWeight}>•must</span>}
        </span>
      ))}
    </div>
  )

  /* ════════ JD INPUT ════════ */
  if (showInput) {
    const busy = fetchSpec.isPending
    return (
      <div className={styles.report}>
        <div className={styles.jdInputWrap}>
          <div className={styles.jdInputHead}>
            <span className={styles.jdInputTitle}>{jdSpec ? 'Change the job description' : 'Add a job description'}</span>
            <span className={styles.jdInputSub}>
              We analyze the JD once, then score your resume against it live as you edit — no JD, no ATS score.
            </span>
          </div>

          <div className={styles.jdTabs}>
            <button className={`${styles.jdTab} ${jdSource === 'paste' ? styles.jdTabActive : ''}`} onClick={() => setJdSource('paste')}>
              <FileText size={12} /> Paste
            </button>
            <button className={`${styles.jdTab} ${jdSource === 'upload' ? styles.jdTabActive : ''}`} onClick={() => setJdSource('upload')}>
              <Upload size={12} /> Upload
            </button>
          </div>

          {jdSource === 'paste' ? (
            <>
              <textarea className={styles.jdTextarea} placeholder="Paste the full job description here…"
                value={draft} onChange={(e) => setDraft(e.target.value)} />
              <span className={styles.charHint}>{draft.length} characters {draft.trim().length >= 50 ? '· ready' : '(min 50)'}</span>
            </>
          ) : (
            !file ? (
              <div className={`${styles.dropzone} ${dragging ? styles.dropzoneActive : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)} onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}>
                <Upload size={20} className={styles.dropIcon} />
                <span className={styles.dropTitle}>Drop a JD file or click to browse</span>
                <span className={styles.dropSub}>PDF or DOCX, up to 5MB</span>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }}
                  onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0]) }} />
              </div>
            ) : (
              <div className={styles.fileRow}>
                <FileText size={15} />
                <span className={styles.fileName}>{file.name}</span>
                {extractJd.isPending && <Loader2 size={14} className="spin" />}
                {extractJd.isSuccess && <Check size={14} color="#16a34a" />}
                <button className={styles.fileX} onClick={() => { setFile(null); setDraft('') }}><X size={14} /></button>
              </div>
            )
          )}

          {quotaHit ? (
            <div className={styles.errorBox}>
              You've used all your JD-score credits this month.{' '}
              <button className={styles.fileX} style={{ textDecoration: 'underline', color: '#dc2626' }}
                onClick={() => { setUpgradeFeature('jdScore'); setShowUpgrade(true) }}>Upgrade</button>
            </div>
          ) : fetchError && (
            <div className={styles.errorBox}>{fetchError}</div>
          )}

          <button className={styles.primaryBtn} onClick={handleCalculate} disabled={busy || draft.trim().length < 50}>
            {busy ? <><Loader2 size={15} className="spin" /> Analyzing JD…</> : <><Target size={15} /> Calculate ATS Score</>}
          </button>

          {jdSpec && (
            <button className={styles.ghostBtn} onClick={() => setEditing(false)}>Cancel</button>
          )}
        </div>

        <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} trigger={upgradeFeature} />
      </div>
    )
  }

  /* ════════ REPORT ════════ */
  if (!ats) return <div className={styles.loading}><Loader2 size={15} className="spin" /> Scoring…</div>

  const color = getScoreColor(ats.score)
  const missingRequired = ats.requiredSkills.filter((s) => !s.matched)

  return (
    <div className={styles.report}>
      <div className={styles.ringWrap}>
        <div className={styles.ring} style={{ borderColor: color, color }}>{ats.score}</div>
        <div className={styles.ringMeta}>
          <span className={styles.ringLabel} style={{ color }}>{ats.label}</span>
          <span className={styles.ringSub}>
            {ats.jobTitle ? <>For <strong>{ats.jobTitle}</strong> · </> : null}
            {ats.matchedCount}/{ats.totalCount} key skills · seniority <strong>{ats.seniority}</strong>
          </span>
        </div>
      </div>

      <div className={styles.changeRow}>
        <span className={styles.jdSummary}><FileText size={12} /> JD loaded · live score updates as you edit</span>
        <button className={styles.ghostBtn} onClick={startChange}><RefreshCw size={12} /> Change JD</button>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Score breakdown</h4>
        <div className={styles.bars}>
          {COMPONENT_LABELS.map(({ key, label }) => {
            const pct = Math.round(ats.components[key] * 100)
            return (
              <div key={key} className={styles.barRow}>
                <span className={styles.barLabel}>{label}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${pct}%`, background: getScoreColor(pct) }} />
                </div>
                <span className={styles.barVal}>{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Top priorities (missing required)</h4>
        {missingRequired.length > 0 ? renderChips(missingRequired)
          : <div className={styles.perfect}><CheckCircle2 size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />You hit every required skill.</div>}
      </div>

      {ats.requiredSkills.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Required skills</h4>
          {renderChips(ats.requiredSkills)}
        </div>
      )}

      {ats.preferredSkills.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Preferred skills</h4>
          {renderChips(ats.preferredSkills)}
        </div>
      )}

      <div className={styles.tailorCard}>
        <p className={styles.tailorTitle}>Tailor my resume to this JD</p>
        <p className={styles.tailorSub}>Let AI rewrite your sections to align with this role. You review every change before it's applied.</p>
        <button className={styles.primaryBtn} onClick={handleTailor} disabled={tailorMutation.isPending}>
          {tailorMutation.isPending ? <><Loader2 size={15} className="spin" /> Generating changes…</> : <><Wand2 size={15} /> Tailor to this JD</>}
        </button>
        {tailorMutation.isError && <div className={styles.errorBox} style={{ marginTop: 8 }}>Failed to tailor. Please try again.</div>}
      </div>

      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} trigger={upgradeFeature} />
      <TailorDiffDialog
        isOpen={diffOpen}
        isPending={tailorMutation.isPending}
        steps={diffSteps}
        jdCompanyName={pendingTailor?.jdCompanyName}
        jdRoleName={pendingTailor?.jdRoleName}
        onComplete={handleDiffComplete}
        onClose={() => setDiffOpen(false)}
      />
    </div>
  )
}
