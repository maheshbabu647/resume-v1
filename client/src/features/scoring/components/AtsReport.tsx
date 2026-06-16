import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Target, Upload, FileText, X, Check, AlertTriangle, Loader2,
  RefreshCw, Wand2, CheckCircle2, Sparkles,
} from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/apiClient'
import { useUsage } from '@/core/hooks/useUsage'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { UpgradeModal } from '@/shared/components/UpgradeModal/UpgradeModal'
import { AuthRequireModal } from '@/shared/components/AuthRequireModal/AuthRequireModal'
import { trackJDTailorRequested } from '@/shared/lib/analytics'
import { useResumeStore } from '../../resume-builder/store/useResumeStore'
import { useJdMatchStore } from '../store/useJdMatchStore'
import { useAtsMatch } from '../hooks/useAtsMatch'
import { useFetchJdSpec } from '../hooks/useFetchJdSpec'
import { getScoreColor } from '../lib/scoreColor'
import { serializeResume } from '../lib/jdPreprocessor'
import SmartTailorStudio from './SmartTailorStudio'
import type { AtsSkillMatch, SmartTailorBuckets } from '../types/scoring.types'
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
  const resumeKey = useJdMatchStore((s) => s.resumeKey) ?? 'new'
  const ats = useAtsMatch()
  const fetchSpec = useFetchJdSpec()
  const { isGuest, isAtLimit } = useUsage()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const resume = useResumeStore()

  // Guests can see scores + reports, but updating the JD (one server call) needs auth.
  // Their typed JD draft is persisted so it survives login (incl. an OAuth reload).
  const DRAFT_KEY = `cf_jddraft_${resumeKey}`

  // JD input UI
  const [editing, setEditing] = useState(false)
  const [jdSource, setJdSource] = useState<'paste' | 'upload'>('paste')
  const [draft, setDraft] = useState(() => { try { return localStorage.getItem(`cf_jddraft_${resumeKey}`) || '' } catch { return '' } })
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [showUpgrade, setShowUpgrade] = useState(false)
  const [upgradeFeature, setUpgradeFeature] = useState<'jdScore' | 'jdTailoring'>('jdScore')

  // Auth gate for JD updates — remember what the user was trying to do, resume it after login.
  const [authOpen, setAuthOpen] = useState(false)
  const pendingRef = useRef<{ type: 'calc' } | { type: 'file'; file: File } | { type: 'startChange' } | null>(null)

  // Persist the in-progress JD draft (guest, no spec yet) so login never loses it.
  useEffect(() => {
    try {
      if (!jdSpec && draft) localStorage.setItem(DRAFT_KEY, draft)
      else if (!draft) localStorage.removeItem(DRAFT_KEY)
    } catch { /* ignore */ }
  }, [draft, jdSpec, DRAFT_KEY])

  // Tailor flow
  const [smartOpen, setSmartOpen] = useState(false)

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

  // Returns true if allowed to proceed now; otherwise stashes the action and opens the auth modal.
  const requireAuthThen = (action: { type: 'calc' } | { type: 'file'; file: File } | { type: 'startChange' }): boolean => {
    if (isAuthenticated) return true
    pendingRef.current = action
    setAuthOpen(true)
    return false
  }

  const doExtract = (f: File) => { setFile(f); setDraft(''); extractJd.mutate(f) }

  const processFile = (f: File) => {
    if (!requireAuthThen({ type: 'file', file: f })) return
    doExtract(f)
  }
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]; if (f) processFile(f)
  }, [isAuthenticated])

  /* ── Calculate (fetch JD-Spec once) ── */
  // Runs the actual call WITHOUT re-checking auth (avoids a stale-closure re-prompt right after login).
  const runCalc = async (text: string) => {
    if (text.trim().length < 50) return
    try {
      await fetchSpec.mutateAsync(text)
      setEditing(false); setFile(null)
      try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
    } catch { /* error surfaced via store */ }
  }

  const handleCalculate = () => {
    if (draft.trim().length < 50) return
    if (!requireAuthThen({ type: 'calc' })) return
    if (isGuest && isAtLimit('jdScore')) {
      window.dispatchEvent(new CustomEvent('guest-limit-hit', { detail: { feature: 'jdScore' } }))
      return
    }
    runCalc(draft)
  }

  // After login: the draft is intact (state preserved, or rehydrated after OAuth) — resume the action.
  const handleAuthSuccess = () => {
    setAuthOpen(false)
    const pending = pendingRef.current
    pendingRef.current = null
    if (pending?.type === 'file') doExtract(pending.file)
    else if (pending?.type === 'calc') runCalc(draft)
    else if (pending?.type === 'startChange') {
      setDraft(jdText); setJdSource('paste'); setFile(null); setEditing(true)
    }
  }

  const startChange = () => {
    if (!requireAuthThen({ type: 'startChange' })) return
    setDraft(jdText); setJdSource('paste'); setFile(null); setEditing(true)
  }

  /* ── Tailor ── */
  const tailorMutation = useMutation({
    mutationFn: async (payload: { resumeId: string; jdText: string; personalInfo: any; sections: any[] }) => {
      const res = await apiClient.post('/ai/jd-tailor', payload)
      return res.data.data
    },
    onSuccess: (data) => {
      // Apply the rewrite in full — no accept/reject popup. Undo reverts it.
      useResumeStore.getState().applyTailored(data.rewrittenPersonalInfo, data.rewrittenSections || [])
      queryClient.invalidateQueries({ queryKey: ['usage'] })
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

  /* ── Smart Tailor (editor): triage skills → honest rewrite → apply in full ── */
  const tailorSmartMutation = useMutation({
    mutationFn: async (buckets: SmartTailorBuckets) => {
      const res = await apiClient.post('/ai/tailor-smart', {
        resumeText: serializeResume(resume.data),
        jdText,
        ...buckets,
      })
      return res.data.data
    },
    onSuccess: (data) => {
      // Apply the full tailored resume directly (incl. new skills/sections). No popup.
      useResumeStore.getState().applyTailored(data.personalInfo, data.sections || [])
      setSmartOpen(false)
      queryClient.invalidateQueries({ queryKey: ['usage'] })
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

  const openSmart = () => {
    if (isGuest && isAtLimit('jdTailoring')) {
      window.dispatchEvent(new CustomEvent('guest-limit-hit', { detail: { feature: 'jdTailoring' } }))
      return
    }
    setSmartOpen(true)
  }

  const handleSmartGenerate = (buckets: SmartTailorBuckets) => {
    tailorSmartMutation.mutate(buckets)
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
        <AuthRequireModal
          isOpen={authOpen}
          onClose={() => { setAuthOpen(false); pendingRef.current = null }}
          onSuccess={handleAuthSuccess}
          title="Sign in to score against a JD"
          subtitle="Your job description stays right here — sign in and we'll calculate your ATS score instantly."
        />
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
        <p className={styles.tailorSub}>Smart Tailor lets you triage each skill and keeps every line honest. Quick tailor just adds the keywords for you. Changes apply straight to your resume — Undo reverts them.</p>
        <button className={styles.primaryBtn} onClick={openSmart} disabled={tailorSmartMutation.isPending}>
          <Sparkles size={15} /> Smart Tailor
        </button>
        <button className={styles.secondaryBtn} onClick={handleTailor} disabled={tailorMutation.isPending} style={{ marginTop: 8 }}>
          {tailorMutation.isPending ? <><Loader2 size={15} className="spin" /> Generating…</> : <><Wand2 size={15} /> Quick tailor</>}
        </button>
        {tailorMutation.isError && <div className={styles.errorBox} style={{ marginTop: 8 }}>Failed to tailor. Please try again.</div>}
      </div>

      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} trigger={upgradeFeature} />
      <AuthRequireModal
        isOpen={authOpen}
        onClose={() => { setAuthOpen(false); pendingRef.current = null }}
        onSuccess={handleAuthSuccess}
        title="Sign in to change the JD"
        subtitle="Your current job description and score stay right here — sign in to swap in a new one."
      />
      {smartOpen && jdSpec && (
        <div className={styles.smartOverlay}>
          <div className={styles.smartOverlayBar}>
            <span className={styles.smartOverlayTitle}><Sparkles size={15} /> Smart Tailor</span>
            <button className={styles.smartOverlayClose} onClick={() => setSmartOpen(false)} disabled={tailorSmartMutation.isPending}>
              <X size={18} />
            </button>
          </div>
          <div className={styles.smartOverlayBody}>
            <SmartTailorStudio
              baseline={ats}
              generating={tailorSmartMutation.isPending}
              ctaLabel="Generate changes"
              onGenerate={handleSmartGenerate}
              onBack={() => setSmartOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
