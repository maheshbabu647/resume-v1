import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  Zap, FileText, Upload, List, X, Check, AlertTriangle,
  Loader2, Lightbulb,
  Sparkles, ArrowRight, CheckCircle2, ArrowLeft,
  Clock, Mail
} from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/apiClient'
import { UpgradeModal } from '@/shared/components/UpgradeModal/UpgradeModal'
import { AuthRequireModal } from '@/shared/components/AuthRequireModal/AuthRequireModal'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { useUsage } from '@/core/hooks/useUsage'
import { preprocessJD, serializeResume } from '@/features/scoring/lib/jdPreprocessor'
import { projectAtsScore, matchedTermsInText } from '@/features/scoring/lib/atsMatchEngine'
import SmartTailorStudio from '@/features/scoring/components/SmartTailorStudio'
import type { JDSpec, SmartTailorBuckets } from '@/features/scoring/types/scoring.types'
import { trackJDScoreViewed, trackJDTailorRequested } from '@/shared/lib/analytics'
import { CfpLogo } from '@/shared/components/CfpLogo/CfpLogo'
import styles from './JDTailorPage.module.css'

import { TEMPLATE_REGISTRY } from '../resume-builder/templates/registry'

// ── Template registry ──────────────────────────────────────────────────────────
const TEMPLATES = Object.values(TEMPLATE_REGISTRY).map(t => ({
  id: t.id,
  name: t.name,
  color: t.id === 'modern-centered' ? '#1e2d4a' : t.id === 'classic-sidebar' ? '#006c49' : '#1a2744',
  thumbnailUrl: t.thumbnailUrl
}))

type Stage = 'input' | 'analyzing' | 'results' | 'smart' | 'tailoring'
type ResumeSource = 'paste' | 'upload' | 'existing'

interface JDFitResult {
  fitScore: number
  label: string
  seniorityLevel: string
  semanticOverlapScore: number
  requiredSkills: { skill: string; presentInResume: boolean }[]
  preferredSkills: { skill: string; presentInResume: boolean }[]
  missingKeywords: { keyword: string; importance: string; context: string }[]
  improvementSuggestions: { rank: number; suggestion: string; impact: 'high' | 'medium' | 'low' }[]
}

interface ExistingResume {
  _id: string
  title: string
  updatedAt: string
  sections: any[]
  personalInfo: any
}

// ── Score helpers ─────────────────────────────────────────────────────────────
function scoreColor(score: number) {
  if (score >= 80) return 'var(--green)'
  if (score >= 60) return 'var(--amber)'
  return 'var(--coral)'
}

function scoreTone(score: number) {
  if (score >= 80) return { label: 'Strong match', bg: 'var(--green-light)', fg: 'var(--green)' }
  if (score >= 60) return { label: 'Close — fixable', bg: 'var(--amber-light)', fg: 'var(--amber)' }
  return { label: 'Needs work', bg: 'var(--coral-light)', fg: 'var(--coral)' }
}

const ANALYZING_PHASES = [
  'Reading your resume…',
  'Parsing the job description…',
  'Matching keywords against ATS rules…',
  'Generating your report…',
]

// ── Score hero ring ──────────────────────────────────────────────────────────
function ScoreHeroRing({ score, projected }: { score: number; projected?: number }) {
  const r = 96
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.max(0, Math.min(100, score)) / 100) * circ
  const projectedOffset = projected !== undefined
    ? circ - (Math.max(0, Math.min(100, projected)) / 100) * circ
    : null
  const color = scoreColor(score)

  return (
    <div className={styles.scoreHeroRing}>
      <svg className={styles.scoreHeroSvg} viewBox="0 0 220 220">
        <circle cx="110" cy="110" r={r} fill="none" stroke="var(--border-soft)" strokeWidth="14" />
        {projectedOffset !== null && (
          <circle
            cx="110" cy="110" r={r} fill="none"
            stroke="var(--green)"
            strokeOpacity="0.18"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={projectedOffset}
            transform="rotate(-90 110 110)"
            style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(.2,.8,.2,1)' }}
          />
        )}
        <circle
          cx="110" cy="110" r={r} fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 110 110)"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(.2,.8,.2,1)' }}
        />
      </svg>
      <div className={styles.scoreHeroCenter}>
        <span className={styles.scoreHeroEyebrow}>ATS Score</span>
        <span className={styles.scoreHeroNum}>{score}</span>
        <span className={styles.scoreHeroOf}>out of 100</span>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function JDTailorPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const { isAtLimit, remaining, isGuest } = useUsage()

  const [stage, setStage] = useState<Stage>('input')
  const [resumeSource, setResumeSource] = useState<ResumeSource>('paste')
  const [jdSource, setJdSource] = useState<'paste' | 'upload'>('paste')
  const [resumeText, setResumeText] = useState('')
  const [jdText, setJdText] = useState((location.state as { jd?: string } | null)?.jd ?? '')
  const [isDragging, setIsDragging] = useState(false)
  const [isDraggingJd, setIsDraggingJd] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedJdFile, setUploadedJdFile] = useState<File | null>(null)
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null)
  const [fitResult, setFitResult] = useState<JDFitResult | null>(null)
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [upgradeFeature, setUpgradeFeature] = useState<'jdScore' | 'jdTailoring'>('jdScore')
  const [analyzingPhase, setAnalyzingPhase] = useState(0)
  // Smart Tailor: the deterministic JD-Spec drives the skill triage + live projection.
  const [jdSpec, setJdSpec] = useState<JDSpec | null>(null)
  const [smartBuckets, setSmartBuckets] = useState<SmartTailorBuckets | null>(null)
  const [tailorMode, setTailorMode] = useState<'quick' | 'smart'>('quick')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const jdFileInputRef = useRef<HTMLInputElement>(null)
  // Holds the in-flight JD-Spec fetch fired alongside tailoring, so the editor opens
  // with a ready live ATS score instead of falling back to the "+ JD" empty state.
  const jdSpecCarryRef = useRef<Promise<JDSpec | null> | null>(null)

  const fetchJdSpecForCarry = (text: string): Promise<JDSpec | null> =>
    apiClient.post('/ai/jd-spec', { jdText: preprocessJD(text) })
      .then(res => res.data.data as JDSpec)
      .catch(() => null)

  // Animate the analyzing phases — steps through each phase, then holds on
  // the final one until the analysis result has arrived.
  useEffect(() => {
    if (stage !== 'analyzing') { setAnalyzingPhase(0); return }
    const interval = setInterval(() => {
      setAnalyzingPhase(p => Math.min(p + 1, ANALYZING_PHASES.length))
    }, 800)
    return () => clearInterval(interval)
  }, [stage])

  // Only move to the report once every phase has finished animating AND the
  // analysis result is ready — whichever takes longer.
  useEffect(() => {
    if (stage !== 'analyzing' || !fitResult) return
    if (analyzingPhase < ANALYZING_PHASES.length) return
    const timeout = setTimeout(() => setStage('results'), 450)
    return () => clearTimeout(timeout)
  }, [stage, fitResult, analyzingPhase])

  // Fetch existing resumes
  const { data: resumes = [] } = useQuery<ExistingResume[]>({
    queryKey: ['resumes'],
    queryFn: async () => {
      const res = await apiClient.get('/resumes')
      return res.data.data.resumes
    },
    enabled: isAuthenticated
  })

  // Parse uploaded resume file
  const parseFileMutation = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData()
      fd.append('resume', file)
      const res = await apiClient.post('/ai/parse-resume', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return res.data.data
    },
    onSuccess: (data) => {
      const lines: string[] = []
      if (data.personalInfo?.fullName) lines.push(data.personalInfo.fullName)
      if (data.personalInfo?.summary) lines.push(data.personalInfo.summary)
      data.sections?.forEach((s: any) => {
        lines.push(s.name || s.key)
        s.entries?.forEach((e: any) => {
          Object.values(e).forEach(v => { if (typeof v === 'string') lines.push(v) })
          if (Array.isArray(e.bullets)) lines.push(...e.bullets)
        })
      })
      setResumeText(lines.join('\n'))
    }
  })

  // Extract raw text from JD file
  const extractJdMutation = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData()
      fd.append('resume', file)
      const res = await apiClient.post('/ai/extract-text', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return res.data.data as string
    },
    onSuccess: (text) => {
      setJdText(text)
    }
  })

  // Analyze JD match
  const analyzeMutation = useMutation({
    mutationFn: async (payload: { serializedResume: string; preprocessedJD: string }) => {
      const res = await apiClient.post('/ai/analyze-jd', payload)
      return res.data.data as JDFitResult
    },
    onSuccess: (data) => {
      setFitResult(data)
      trackJDScoreViewed()
    },
    onError: (err: any) => {
      const code = err?.response?.data?.error?.code ?? err?.response?.data?.code
      if (code === 'GUEST_LIMIT_HIT') {
        window.dispatchEvent(new CustomEvent('guest-limit-hit', { detail: err?.response?.data?.data ?? { feature: 'jdScore' } }))
      } else if (code === 'QUOTA_EXCEEDED') {
        setUpgradeFeature('jdScore'); setShowUpgradeModal(true)
      }
      setStage('input')
    }
  })

  // Tailor new resume
  const tailorMutation = useMutation({
    mutationFn: async (payload: { resumeText: string; jdText: string; templateId: string }) => {
      const res = await apiClient.post('/ai/tailor-new', payload)
      return res.data.data
    },
    onSuccess: async (data) => {
      sessionStorage.setItem('careerforge_tailored_resume', JSON.stringify(data))
      // Carry the JD-Spec into the editor so the live ATS score shows immediately.
      // The fetch was fired in parallel when tailoring started; await it now.
      try {
        const spec = jdSpecCarryRef.current ? await jdSpecCarryRef.current : null
        if (spec) {
          localStorage.setItem('cf_jdmatch_new', JSON.stringify({ jdText, jdSpec: spec }))
          localStorage.removeItem('cf_jddraft_new')
        } else {
          // Fallback: no spec — seed the draft so the editor opens with the JD pre-filled.
          localStorage.removeItem('cf_jdmatch_new')
          localStorage.setItem('cf_jddraft_new', jdText)
        }
      } catch { /* ignore */ }
      navigate(`/resume/new?tailored=true&template=${tailorMutation.variables?.templateId ?? 'modern-centered'}`)
    },
    onError: (err: any) => {
      const code = err?.response?.data?.error?.code ?? err?.response?.data?.code
      if (code === 'GUEST_LIMIT_HIT') {
        window.dispatchEvent(new CustomEvent('guest-limit-hit', { detail: err?.response?.data?.data ?? { feature: 'jdTailoring' } }))
      } else if (code === 'QUOTA_EXCEEDED') {
        setUpgradeFeature('jdTailoring'); setShowUpgradeModal(true)
      }
      setShowTemplatePicker(false)
      setStage('results')
    }
  })

  // Fetch the deterministic JD-Spec, then open the Smart Tailor screen.
  const jdSpecMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await apiClient.post('/ai/jd-spec', { jdText: preprocessJD(text) })
      return res.data.data as JDSpec
    },
    onSuccess: (spec) => { setJdSpec(spec); setStage('smart') },
    onError: (err: any) => {
      const code = err?.response?.data?.error?.code ?? err?.response?.data?.code
      if (code === 'GUEST_LIMIT_HIT') {
        window.dispatchEvent(new CustomEvent('guest-limit-hit', { detail: err?.response?.data?.data ?? { feature: 'jdScore' } }))
      } else if (code === 'QUOTA_EXCEEDED') {
        setUpgradeFeature('jdScore'); setShowUpgradeModal(true)
      }
    },
  })

  // Smart Tailor — full structured resume honoring the user's per-skill buckets.
  const tailorSmartMutation = useMutation({
    mutationFn: async (payload: { resumeText: string; jdText: string; templateId: string } & SmartTailorBuckets) => {
      const res = await apiClient.post('/ai/tailor-smart', payload)
      return res.data.data
    },
    onSuccess: (data) => {
      sessionStorage.setItem('careerforge_tailored_resume', JSON.stringify(data))
      // We already hold the exact JD-Spec — carry it so the editor shows the live score at once.
      try {
        if (jdSpec) {
          localStorage.setItem('cf_jdmatch_new', JSON.stringify({ jdText, jdSpec }))
          localStorage.removeItem('cf_jddraft_new')
        } else {
          localStorage.removeItem('cf_jdmatch_new')
          localStorage.setItem('cf_jddraft_new', jdText)
        }
      } catch { /* ignore */ }
      navigate(`/resume/new?tailored=true&template=${tailorSmartMutation.variables?.templateId ?? 'modern-centered'}`)
    },
    onError: (err: any) => {
      const code = err?.response?.data?.error?.code ?? err?.response?.data?.code
      if (code === 'GUEST_LIMIT_HIT') {
        window.dispatchEvent(new CustomEvent('guest-limit-hit', { detail: err?.response?.data?.data ?? { feature: 'jdTailoring' } }))
      } else if (code === 'QUOTA_EXCEEDED') {
        setUpgradeFeature('jdTailoring'); setShowUpgradeModal(true)
      }
      setShowTemplatePicker(false)
      setStage('smart')
    },
  })

  // ── Get resume text based on source ─────────────────────────────────────────
  const getResumeText = (): string => {
    if (resumeSource === 'paste') return resumeText
    if (resumeSource === 'upload') return resumeText
    if (resumeSource === 'existing') {
      const r = resumes.find(r => r._id === selectedResumeId)
      if (!r) return ''
      const rd = {
        personalInfo: {
          fullName: r.personalInfo?.fullName ?? '',
          title: r.personalInfo?.title ?? '',
          summary: r.personalInfo?.summary ?? '',
          email: r.personalInfo?.email ?? '',
          phone: r.personalInfo?.phone ?? '',
          location: r.personalInfo?.location ?? '',
          contactLinks: r.personalInfo?.contactLinks ?? [],
        },
        sections: r.sections ?? [],
      }
      return serializeResume(rd as any)
    }
    return ''
  }

  // ── Analyze handler ──────────────────────────────────────────────────────────
  const handleAnalyze = () => {
    const text = getResumeText()
    const currentJd = jdText
    if (!text.trim() || text.trim().length < 50) return
    if (!currentJd.trim() || currentJd.trim().length < 50) return
    // Pre-check: if guest is at limit, show auth modal immediately
    if (isGuest && isAtLimit('jdScore')) {
      window.dispatchEvent(new CustomEvent('guest-limit-hit', { detail: { feature: 'jdScore' } }))
      return
    }
    setStage('analyzing')
    let preprocessedJD = preprocessJD(currentJd)
    // Safety fallback: if preprocessing stripped too much content, use the normalized raw JD
    if (preprocessedJD.trim().length < 50) {
      preprocessedJD = currentJd.trim().slice(0, 12000)
    }
    const serializedResume = text.length > 6000 ? text.slice(0, 6000) : text
    analyzeMutation.mutate({ serializedResume, preprocessedJD })
  }

  // ── Tailor handler ───────────────────────────────────────────────────────────
  const handleTailor = (templateId: string) => {
    const text = getResumeText()
    trackJDTailorRequested()
    // Fire the JD-Spec fetch in parallel with tailoring so it's ready to carry into the editor.
    jdSpecCarryRef.current = fetchJdSpecForCarry(jdText)
    tailorMutation.mutate({ resumeText: text, jdText, templateId })
    setStage('tailoring')
  }

  // ── Smart Tailor handlers ────────────────────────────────────────────────────
  const handleSmartTailorClick = () => {
    if (isGuest && isAtLimit('jdTailoring')) {
      window.dispatchEvent(new CustomEvent('guest-limit-hit', { detail: { feature: 'jdTailoring' } }))
      return
    }
    if (jdSpec) { setStage('smart'); return }    // already have the spec — go straight in
    jdSpecMutation.mutate(jdText)                 // otherwise fetch it first, then enter
  }

  const handleSmartContinue = (buckets: SmartTailorBuckets) => {
    setSmartBuckets(buckets)
    setTailorMode('smart')
    setShowTemplatePicker(true)
  }

  const handleSmartTailor = (templateId: string) => {
    if (!smartBuckets) return
    trackJDTailorRequested()
    tailorSmartMutation.mutate({ resumeText: getResumeText(), jdText, templateId, ...smartBuckets })
    setStage('tailoring')
  }

  // ── File drag/drop handlers ──────────────────────────────────────────────────
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [])

  const processFile = (file: File) => {
    setUploadedFile(file)
    setResumeText('')
    parseFileMutation.mutate(file)
  }

  const handleDropJd = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingJd(false)
    const file = e.dataTransfer.files[0]
    if (file) processJdFile(file)
  }, [])

  const processJdFile = (file: File) => {
    setUploadedJdFile(file)
    setJdText('')
    extractJdMutation.mutate(file)
  }

  // ── Validation ───────────────────────────────────────────────────────────────
  const resumeReady = (() => {
    if (resumeSource === 'paste') return resumeText.trim().length >= 50
    if (resumeSource === 'upload') return resumeText.trim().length >= 50
    if (resumeSource === 'existing') return !!selectedResumeId
    return false
  })()
  const jdReady = jdText.trim().length >= 50
  const canAnalyze = resumeReady && jdReady && stage !== 'analyzing'

  // ── Step 01 — resume source ───────────────────────────────────────────────────
  const renderResumeStep = () => (
    <div className={styles.stepBlock}>
      <div className={styles.stepBlockHead}>
        <span className={styles.stepNumber}>01</span>
        <div className={styles.stepHeadText}>
          <h2 className={styles.stepTitle}>Choose your resume</h2>
          <p className={styles.stepSub}>We compare this against the job description below</p>
        </div>
      </div>

      <div className={styles.stepBody}>
        <div className={styles.segmented}>
          <button className={`${styles.segBtn} ${resumeSource === 'paste' ? styles.segBtnActive : ''}`} onClick={() => setResumeSource('paste')}>
            <FileText size={13} /> Paste Text
          </button>
          <button className={`${styles.segBtn} ${resumeSource === 'upload' ? styles.segBtnActive : ''}`} onClick={() => setResumeSource('upload')}>
            <Upload size={13} /> Upload File
          </button>
          <button className={`${styles.segBtn} ${resumeSource === 'existing' ? styles.segBtnActive : ''}`} onClick={() => setResumeSource('existing')}>
            <List size={13} /> My Resumes
          </button>
        </div>

        {resumeSource === 'paste' && (
          <div className={styles.textareaCard}>
            <textarea
              className={styles.textarea}
              placeholder="Paste your resume content here — all sections, bullets, experience..."
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
            />
            <div className={styles.textareaFooter}>
              <span className={resumeText.trim().length >= 50 ? styles.textareaFooterOk : ''}>
                {resumeText.trim().length >= 50 ? '✓ Looks good' : `${resumeText.length} characters (min 50)`}
              </span>
              <span>{resumeText.length} chars</span>
            </div>
          </div>
        )}

        {resumeSource === 'upload' && (
          <>
            {!uploadedFile ? (
              <div
                className={`${styles.uploadBox} ${isDragging ? styles.isDragging : ''}`}
                onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className={styles.uploadIconBox}><Upload size={20} /></div>
                <div className={styles.uploadLabel}>Drag your resume here, or click to browse</div>
                <div className={styles.uploadSub}>PDF or DOCX, up to 5MB</div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  onChange={e => { if (e.target.files?.[0]) processFile(e.target.files[0]) }}
                />
              </div>
            ) : (
              <div className={`${styles.uploadBox} ${styles.uploadDone}`}>
                <div className={styles.uploadIconBox}>
                  {parseFileMutation.isPending ? <Loader2 size={20} className={styles.spin} /> : <CheckCircle2 size={20} />}
                </div>
                <div className={styles.uploadLabel}>{uploadedFile.name}</div>
                <div className={`${styles.uploadSub} ${styles.uploadSubDone}`}>
                  {parseFileMutation.isPending ? 'Parsing…' : `Parsed — ${resumeText.length} characters extracted`}
                </div>
                <button className={styles.uploadClearBtn} onClick={(e) => { e.stopPropagation(); setUploadedFile(null); setResumeText('') }}>
                  Remove and choose another
                </button>
              </div>
            )}
          </>
        )}

        {resumeSource === 'existing' && (
          <>
            {!isAuthenticated ? (
              <div className={styles.authGate}>
                <div className={styles.authGateIcon}><Zap size={20} /></div>
                <p className={styles.authGateTitle}>Unlock your saved resumes</p>
                <p className={styles.authGateSub}>Sign in to compare against your existing resumes and track your tailoring history.</p>
                <button className={styles.authGateBtn} onClick={() => setShowAuthModal(true)}>Sign In Now</button>
              </div>
            ) : resumes.length === 0 ? (
              <div className={styles.emptyResumes}>
                No resumes found. <a href="/resume/new">Create one first</a>.
              </div>
            ) : (
              <div className={styles.savedResumeGrid}>
                {resumes.map(r => (
                  <button
                    key={r._id}
                    className={`${styles.savedResumeCard} ${selectedResumeId === r._id ? styles.savedResumeCardActive : ''}`}
                    onClick={() => setSelectedResumeId(r._id)}
                  >
                    {selectedResumeId === r._id && (
                      <span className={styles.savedResumeCheck}><Check size={12} /></span>
                    )}
                    <div className={styles.savedResumeTop}>
                      <div className={styles.savedResumeThumb}>
                        <span /><span /><span /><span />
                      </div>
                    </div>
                    <div className={styles.savedResumeTitle}>{r.title}</div>
                    <div className={styles.savedResumeMeta}>
                      Updated {new Date(r.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )

  // ── Step 02 — job description ─────────────────────────────────────────────────
  const renderJDStep = () => (
    <div className={styles.stepBlock}>
      <div className={styles.stepBlockHead}>
        <span className={styles.stepNumber}>02</span>
        <div className={styles.stepHeadText}>
          <h2 className={styles.stepTitle}>Add the job description</h2>
          <p className={styles.stepSub}>Paste the full posting — requirements, responsibilities, qualifications</p>
        </div>
      </div>

      <div className={styles.stepBody}>
        <div className={styles.segmented}>
          <button className={`${styles.segBtn} ${jdSource === 'paste' ? styles.segBtnActive : ''}`} onClick={() => setJdSource('paste')}>
            <FileText size={13} /> Paste Text
          </button>
          <button className={`${styles.segBtn} ${jdSource === 'upload' ? styles.segBtnActive : ''}`} onClick={() => setJdSource('upload')}>
            <Upload size={13} /> Upload File
          </button>
        </div>

        {jdSource === 'paste' && (
          <div className={styles.textareaCard}>
            <textarea
              className={styles.textarea}
              placeholder="Paste the full job description here — requirements, responsibilities, qualifications..."
              value={jdText}
              onChange={e => setJdText(e.target.value)}
            />
            <div className={styles.textareaFooter}>
              <span className={jdText.trim().length >= 50 ? styles.textareaFooterOk : ''}>
                {jdText.trim().length >= 50 ? '✓ Looks good' : `${jdText.length} characters (min 50)`}
              </span>
              <span>{jdText.length} chars</span>
            </div>
          </div>
        )}

        {jdSource === 'upload' && (
          <>
            {!uploadedJdFile ? (
              <div
                className={`${styles.uploadBox} ${isDraggingJd ? styles.isDragging : ''}`}
                onDragOver={e => { e.preventDefault(); setIsDraggingJd(true) }}
                onDragLeave={() => setIsDraggingJd(false)}
                onDrop={handleDropJd}
                onClick={() => jdFileInputRef.current?.click()}
              >
                <div className={styles.uploadIconBox}><Upload size={20} /></div>
                <div className={styles.uploadLabel}>Drag the JD file here, or click to browse</div>
                <div className={styles.uploadSub}>PDF or DOCX, up to 5MB</div>
                <input
                  ref={jdFileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  onChange={e => { if (e.target.files?.[0]) processJdFile(e.target.files[0]) }}
                />
              </div>
            ) : (
              <div className={`${styles.uploadBox} ${styles.uploadDone}`}>
                <div className={styles.uploadIconBox}>
                  {extractJdMutation.isPending ? <Loader2 size={20} className={styles.spin} /> : <CheckCircle2 size={20} />}
                </div>
                <div className={styles.uploadLabel}>{uploadedJdFile.name}</div>
                <div className={`${styles.uploadSub} ${styles.uploadSubDone}`}>
                  {extractJdMutation.isPending ? 'Extracting…' : `Extracted — ${jdText.length} characters`}
                </div>
                <button className={styles.uploadClearBtn} onClick={(e) => { e.stopPropagation(); setUploadedJdFile(null); setJdText('') }}>
                  Remove and choose another
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )

  // ── Analyzing screen ─────────────────────────────────────────────────────────
  const renderAnalyzing = () => (
    <div className={styles.analyzing}>
      <div className={styles.analyzingInner}>
        <div className={styles.analyzingOrb}>
          <Sparkles size={26} color="#fff" />
        </div>
        <h2 className={styles.analyzingTitle}>Analyzing your match</h2>
        <p className={styles.analyzingSub}>This usually takes a few seconds. We're comparing your resume against the job description in detail.</p>
        <div className={styles.analyzingPhases}>
          {ANALYZING_PHASES.map((phase, i) => (
            <div key={phase} className={`${styles.analyzingPhase} ${i <= analyzingPhase ? styles.analyzingPhaseActive : ''}`}>
              <span className={`${styles.analyzingPhaseDot} ${i < analyzingPhase ? styles.analyzingPhaseDotDone : i === analyzingPhase ? styles.analyzingPhaseDotCurrent : ''}`}>
                {i < analyzingPhase && <Check size={9} color="#fff" />}
              </span>
              <span className={`${styles.analyzingPhaseText} ${i <= analyzingPhase ? styles.analyzingPhaseTextActive : ''}`}>{phase}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ── Results / report screen ─────────────────────────────────────────────────
  const renderResults = () => {
    if (!fitResult) return null
    const tone = scoreTone(fitResult.fitScore)

    const requiredTotal = fitResult.requiredSkills.length
    const requiredMatched = fitResult.requiredSkills.filter(s => s.presentInResume).length
    const preferredTotal = fitResult.preferredSkills.length
    const preferredMatched = fitResult.preferredSkills.filter(s => s.presentInResume).length

    const requiredMissing = fitResult.requiredSkills.filter(s => !s.presentInResume)
    const preferredMissing = fitResult.preferredSkills.filter(s => !s.presentInResume)
    const criticalKeywords = fitResult.missingKeywords.filter(k => k.importance === 'required')

    const strengths = [
      ...fitResult.requiredSkills.filter(s => s.presentInResume).map(s => ({ skill: s.skill, type: 'Required skill' })),
      ...fitResult.preferredSkills.filter(s => s.presentInResume).map(s => ({ skill: s.skill, type: 'Preferred skill' })),
    ].slice(0, 6)

    // Projected score if the missing required/preferred skills were addressed.
    const projected = Math.min(100, fitResult.fitScore + requiredMissing.length * 6 + preferredMissing.length * 3)
    const scoreGap = Math.max(0, projected - fitResult.fitScore)
    const smartProjected = Math.max(fitResult.fitScore, projected - 3)
    const matchedTotal = requiredMatched + preferredMatched
    const skillsTotal = requiredTotal + preferredTotal

    const breakdownCards = [
      {
        key: 'required',
        label: 'Required skills',
        weight: 'Core requirement',
        score: requiredTotal > 0 ? Math.round((requiredMatched / requiredTotal) * 100) : 100,
        hint: requiredTotal > 0 ? `${requiredMatched} of ${requiredTotal} matched` : 'None listed in this JD',
      },
      {
        key: 'preferred',
        label: 'Preferred skills',
        weight: 'Nice to have',
        score: preferredTotal > 0 ? Math.round((preferredMatched / preferredTotal) * 100) : 100,
        hint: preferredTotal > 0 ? `${preferredMatched} of ${preferredTotal} matched` : 'None listed in this JD',
      },
      {
        key: 'semantic',
        label: 'Semantic overlap',
        weight: 'Content similarity',
        score: fitResult.semanticOverlapScore,
        hint: 'Resume ↔ JD content match',
      },
    ]

    const handleTailorClick = () => {
      if (isGuest && isAtLimit('jdTailoring')) {
        window.dispatchEvent(new CustomEvent('guest-limit-hit', { detail: { feature: 'jdTailoring' } }))
        return
      }
      setTailorMode('quick')
      setShowTemplatePicker(true)
    }

    const tailoringBlocked = !isGuest && isAtLimit('jdTailoring')

    return (
      <div className={styles.report}>

        {/* Score hero */}
        <div className={styles.scoreHero}>
          <ScoreHeroRing score={fitResult.fitScore} projected={projected} />
          <div>
            <span className={styles.scoreBadge} style={{ background: tone.bg, color: tone.fg }}>
              <span className={styles.scoreBadgeDot} style={{ background: tone.fg }} />
              {tone.label}
            </span>
            {scoreGap > 0 ? (
              <h1 className={styles.scoreHeading}>
                You're <span className={styles.scoreHeadingAccent}>{scoreGap} point{scoreGap === 1 ? '' : 's'}</span> away from a top score.
              </h1>
            ) : (
              <h1 className={styles.scoreHeading}>
                Your resume is a <span className={styles.scoreHeadingAccent}>{fitResult.label}</span> for this role.
              </h1>
            )}
            <p className={styles.scoreDesc}>
              {skillsTotal > 0 ? (
                <>Matched <strong>{matchedTotal} of {skillsTotal}</strong> key skills. </>
              ) : null}
              The {requiredMissing.length} required and {preferredMissing.length} preferred skill{(requiredMissing.length + preferredMissing.length) === 1 ? '' : 's'} missing below are mostly fixable — pick how aggressive you want to be.
            </p>
            <div className={styles.scoreMetaTiles}>
              <div className={styles.metaTile}>
                <div className={styles.metaTileLabel}>Seniority expected</div>
                <div className={styles.metaTileValue}>{fitResult.seniorityLevel}</div>
              </div>
              <div className={styles.metaTileDivider} />
              <div className={styles.metaTile}>
                <div className={styles.metaTileLabel}>Required gaps</div>
                <div className={styles.metaTileValue} style={{ color: requiredMissing.length > 0 ? 'var(--coral)' : undefined }}>{requiredMissing.length}</div>
                <div className={styles.metaTileSub}>skill{requiredMissing.length === 1 ? '' : 's'} missing</div>
              </div>
              <div className={styles.metaTileDivider} />
              <div className={styles.metaTile}>
                <div className={styles.metaTileLabel}>Projected score</div>
                <div className={styles.metaTileValue} style={{ color: 'var(--green)' }}>{projected}</div>
                <div className={styles.metaTileSub}>if you fix the gaps</div>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown strip */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionEyebrow}>How your score breaks down</div>
          <div className={styles.breakdownGrid}>
            {breakdownCards.map(card => (
              <div key={card.key} className={styles.breakdownCard}>
                <div className={styles.breakdownHead}>
                  <span className={styles.breakdownLabel}>{card.label}</span>
                  <span className={styles.breakdownWeight}>{card.weight}</span>
                </div>
                <div className={styles.breakdownScoreRow}>
                  <span className={styles.breakdownScore} style={{ color: scoreColor(card.score) }}>{card.score}</span>
                  <span className={styles.breakdownOf}>/100</span>
                </div>
                <div className={styles.breakdownBarTrack}>
                  <div className={styles.breakdownBarFill} style={{ width: `${card.score}%`, background: scoreColor(card.score) }} />
                </div>
                <div className={styles.breakdownHint}>{card.hint}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths + gaps */}
        <div className={styles.sectionBlock}>
          <div className={styles.twoCol}>
            <div>
              <div className={styles.sectionEyebrow}>What's already working</div>
              <div className={styles.strengthsCard}>
                {strengths.length === 0 ? (
                  <div className={styles.emptyStrengths}>No matched skills detected yet.</div>
                ) : strengths.map((s, i) => (
                  <div key={i} className={styles.strengthRow}>
                    <span className={styles.strengthCheck}><Check size={12} /></span>
                    <div>
                      <div className={styles.strengthLabel}>{s.skill}</div>
                      <div className={styles.strengthSub}>{s.type} · present in your resume</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className={styles.sectionEyebrow}>What's missing from the JD</div>
              <div className={styles.gapsCard}>
                <div className={styles.gapsGroup}>
                  <div className={styles.gapsGroupHead}>
                    <span className={styles.gapsDot} style={{ background: 'var(--coral)' }} />
                    <span className={styles.gapsGroupTitle}>Required</span>
                    <span className={styles.gapsGroupHint}>{requiredMissing.length} missing</span>
                  </div>
                  {requiredMissing.length === 0 ? (
                    <span className={styles.gapsEmpty}>You cover every required skill — nice.</span>
                  ) : (
                    <div className={styles.gapsChips}>
                      {requiredMissing.map((s, i) => (
                        <span key={i} className={`${styles.gapChip} ${styles.gapChipRequired}`}>{s.skill}</span>
                      ))}
                    </div>
                  )}
                </div>

                {preferredTotal > 0 && (
                  <>
                    <div className={styles.gapsDivider} />
                    <div className={styles.gapsGroup}>
                      <div className={styles.gapsGroupHead}>
                        <span className={styles.gapsDot} style={{ background: 'var(--brand)' }} />
                        <span className={styles.gapsGroupTitle}>Preferred</span>
                        <span className={styles.gapsGroupHint}>{preferredMissing.length} missing</span>
                      </div>
                      {preferredMissing.length === 0 ? (
                        <span className={styles.gapsEmpty}>You cover every preferred skill too.</span>
                      ) : (
                        <div className={styles.gapsChips}>
                          {preferredMissing.map((s, i) => (
                            <span key={i} className={`${styles.gapChip} ${styles.gapChipPreferred}`}>{s.skill}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {criticalKeywords.length > 0 && (
                  <>
                    <div className={styles.gapsDivider} />
                    <div className={styles.gapsGroup}>
                      <div className={styles.gapsGroupHead}>
                        <span className={styles.gapsDot} style={{ background: 'var(--coral)' }} />
                        <span className={styles.gapsGroupTitle}>Critical missing keywords</span>
                      </div>
                      <div className={styles.gapsChips}>
                        {criticalKeywords.map((k, i) => (
                          <span key={i} className={`${styles.gapChip} ${styles.gapChipRequired}`} title={k.context}>
                            <AlertTriangle size={11} /> {k.keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Improvement suggestions */}
        {fitResult.improvementSuggestions.length > 0 && (
          <div className={styles.sectionBlock}>
            <div className={styles.sectionEyebrow}>
              <Lightbulb size={12} style={{ verticalAlign: '-2px', marginRight: 6 }} />
              Actionable improvements
            </div>
            <div className={styles.suggestionsCard}>
              {fitResult.improvementSuggestions.map((s, i) => (
                <div key={i} className={styles.suggestionRow}>
                  <span className={`${styles.suggestionRank} ${s.impact === 'high' ? styles.rankHigh : s.impact === 'medium' ? styles.rankMedium : styles.rankLow}`}>
                    {s.rank}
                  </span>
                  <div>
                    <div className={styles.suggestionText}>{s.suggestion}</div>
                    <span className={`${styles.impactTag} ${s.impact === 'high' ? styles.impactHigh : s.impact === 'medium' ? styles.impactMedium : styles.impactLow}`}>
                      {s.impact} impact
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Decision moment */}
        <div className={styles.decisionSection}>
          <div className={styles.sectionEyebrow}>Close the gap</div>
          <h2 className={styles.decisionHeading}>How should we tailor your resume?</h2>
          <p className={styles.decisionDesc}>
            Both options open the editor with all changes prefilled — every edit is highlighted and you can accept or reject any of them. The right pick depends on how much time you have and how honestly you want to frame your gaps.
          </p>
          <div className={styles.decisionGrid}>
            <button
              className={`${styles.decisionCard} ${tailoringBlocked ? styles.decisionCardDisabled : ''}`}
              style={{
                '--accent': 'var(--coral)',
                '--accent-light': 'var(--coral-light)',
                '--accent-shadow': 'rgba(255, 92, 53, 0.18)',
                '--accent-shadow-hover': 'rgba(255, 92, 53, 0.35)',
                '--accent-ring': 'rgba(255, 92, 53, 0.08)',
              } as React.CSSProperties}
              onClick={handleTailorClick}
              disabled={tailoringBlocked}
            >
              <div className={styles.decisionTopRow}>
                <div className={styles.decisionIconBox}><Zap size={22} /></div>
                <span className={styles.decisionTime}><Clock size={12} /> ~5 seconds</span>
              </div>
              <span className={styles.decisionEyebrow}>The fast way</span>
              <h3 className={styles.decisionCardTitle}>Quick Tailor</h3>
              <p className={styles.decisionCardDesc}>
                We add every missing keyword to your skills section automatically. Good when you just need "good enough", fast.
              </p>
              <div className={styles.decisionFooter}>
                <div>
                  <div className={styles.decisionProjectedLabel}>Projected score</div>
                  <div className={styles.decisionProjectedValue}>{fitResult.fitScore} → {projected}</div>
                </div>
                <span className={styles.decisionCta}>
                  Quick Tailor <ArrowRight size={14} />
                </span>
              </div>
            </button>

            <button
              className={`${styles.decisionCard} ${tailoringBlocked ? styles.decisionCardDisabled : ''}`}
              style={{
                '--accent': 'var(--brand)',
                '--accent-light': 'var(--brand-light)',
                '--accent-shadow': 'rgba(80, 70, 228, 0.18)',
                '--accent-shadow-hover': 'rgba(80, 70, 228, 0.35)',
                '--accent-ring': 'rgba(80, 70, 228, 0.08)',
              } as React.CSSProperties}
              onClick={handleSmartTailorClick}
              disabled={tailoringBlocked || jdSpecMutation.isPending}
            >
              <span className={styles.decisionBadge}>Recommended</span>
              <div className={styles.decisionTopRow}>
                <div className={styles.decisionIconBox}><Sparkles size={22} /></div>
                <span className={styles.decisionTime}><Clock size={12} /> ~1 minute</span>
              </div>
              <span className={styles.decisionEyebrow}>The honest way</span>
              <h3 className={styles.decisionCardTitle}>Smart Tailor</h3>
              <p className={styles.decisionCardDesc}>
                Triage each skill yourself — keep the ones you have, honestly "mention" the ones you don't, drop the rest. Watch your ATS score update as you decide.
              </p>
              <div className={styles.decisionFooter}>
                <div>
                  <div className={styles.decisionProjectedLabel}>Projected score</div>
                  <div className={styles.decisionProjectedValue}>{fitResult.fitScore} → {smartProjected}</div>
                </div>
                <span className={styles.decisionCta}>
                  {jdSpecMutation.isPending
                    ? <><Loader2 size={14} className={styles.spin} /> Preparing…</>
                    : <>Smart Tailor <ArrowRight size={14} /></>}
                </span>
              </div>
            </button>
          </div>

          {tailoringBlocked ? (
            <div className={styles.decisionNote}>
              <Zap size={11} />
              {isGuest ? (
                <button className={styles.decisionUpgradeLink} onClick={() => window.dispatchEvent(new CustomEvent('guest-limit-hit', { detail: { feature: 'jdTailoring' } }))}>
                  Sign up to continue tailoring →
                </button>
              ) : (
                <button className={styles.decisionUpgradeLink} onClick={() => { setUpgradeFeature('jdTailoring'); setShowUpgradeModal(true) }}>
                  Quota used — upgrade to tailor →
                </button>
              )}
            </div>
          ) : (
            <div className={styles.decisionNote}>
              <Zap size={11} />
              {remaining('jdTailoring') === 'Unlimited' ? 'Unlimited tailorings' : `${remaining('jdTailoring')} tailoring${remaining('jdTailoring') === 1 ? '' : 's'} left`}
            </div>
          )}
        </div>

        {/* Cross-feature CTA — carry resume + JD into the cover letter generator */}
        <div className={styles.sectionBlock}>
          <div className={styles.suggestionsCard}>
            <div className={styles.suggestionRow}>
              <span className={`${styles.suggestionRank} ${styles.rankMedium}`}>
                <Mail size={14} />
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <div>
                  <div className={styles.suggestionText}>Applying to this role? Write a matching cover letter.</div>
                  <span className={styles.impactTag} style={{ background: 'transparent', padding: 0 }}>
                    We'll carry over this resume and job description automatically.
                  </span>
                </div>
                <button
                  className={styles.analyzeBtn}
                  onClick={() => navigate('/cover-letter', { state: { resumeText: getResumeText(), jdText } })}
                >
                  <Mail size={16} /> Write Cover Letter <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isTailoring = tailorMutation.isPending || tailorSmartMutation.isPending

  const handleBack = () => {
    if (stage === 'smart') {
      setStage('results')
      return
    }
    if (stage === 'results') {
      setStage('input')
      setFitResult(null)
      return
    }
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1)
    } else {
      navigate(isAuthenticated ? '/dashboard' : '/')
    }
  }

  const stageLabel = stage === 'input' ? 'Set up'
    : stage === 'analyzing' ? 'Analyzing'
    : stage === 'results' ? 'Report'
    : stage === 'smart' ? 'Smart Tailor'
    : 'Tailoring'

  const readinessOk = (ok: boolean, label: string) => (
    <div className={styles.readinessItem}>
      <span className={`${styles.readinessDot} ${ok ? styles.readinessDotOk : ''}`}>
        {ok && <Check size={10} color="#fff" />}
      </span>
      <span className={`${styles.readinessLabel} ${ok ? styles.readinessLabelOk : ''}`}>{label}</span>
    </div>
  )

  return (
    <div className={styles.page}>
      <Helmet>
        <link rel="canonical" href="https://careerforge.pro/jd-tailor" />
      </Helmet>

      {/* Header */}
      <header className={styles.tailorHeader}>
        <CfpLogo className={styles.tailorHeaderLogo} />
        <span className={styles.tailorHeaderCrumb}>
          ATS Score &amp; Tailor <span className={styles.tailorHeaderSep}>/</span> <strong>{stageLabel}</strong>
        </span>
        <button className={styles.backBtn} onClick={handleBack}>
          <ArrowLeft size={15} /> {stage === 'results' ? 'Edit inputs' : 'Back'}
        </button>
      </header>

      {/* Input stage */}
      {stage === 'input' && (
        <div className={styles.inputScreen}>
          <div className={styles.heroSection}>
            <div className={styles.eyebrow}>Tailor to a job</div>
            <h1 className={styles.heroTitle}>
              Two inputs. <span className={styles.heroAccent}>One ATS-ready resume.</span>
            </h1>
            <p className={styles.heroSub}>
              Add your resume and a job description — we'll score your match, surface the gaps, and generate a tailored resume in minutes.
            </p>
          </div>

          {renderResumeStep()}
          {renderJDStep()}

          <div className={styles.ctaBarWrap}>
            <div className={styles.ctaBar}>
              <div className={styles.readiness}>
                {readinessOk(resumeReady, 'Resume')}
                {readinessOk(jdReady, 'Job description')}
              </div>
              <button className={styles.analyzeBtn} onClick={handleAnalyze} disabled={!canAnalyze}>
                <Sparkles size={16} /> Analyze match <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analyzing stage */}
      {stage === 'analyzing' && renderAnalyzing()}

      {/* Results stage */}
      {stage === 'results' && renderResults()}

      {/* Smart Tailor stage */}
      {stage === 'smart' && jdSpec && (
        <div className={styles.smartScreen}>
          <SmartTailorStudio
            spec={jdSpec}
            resumeText={getResumeText()}
            baselineScore={projectAtsScore(jdSpec, matchedTermsInText(jdSpec, getResumeText())).score}
            generating={tailorSmartMutation.isPending}
            ctaLabel="Continue"
            onGenerate={handleSmartContinue}
            onBack={() => setStage('results')}
          />
        </div>
      )}

      {/* Tailoring in-progress */}
      {stage === 'tailoring' && (
        <div className={styles.tailoringWrap}>
          <Loader2 size={36} className={styles.spin} color="var(--brand)" />
          <p className={styles.tailoringTitle}>Tailoring your resume…</p>
          <p className={styles.tailoringSub}>
            Our AI is rewriting your resume for this role, injecting relevant keywords and strengthening your bullets.
          </p>
        </div>
      )}

      {/* Template Picker Modal */}
      {showTemplatePicker && (
        <div className={styles.modalOverlay} onClick={() => { if (!isTailoring) setShowTemplatePicker(false) }}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            {!isTailoring ? (
              <>
                <div className={styles.modalHeader}>
                  <h2 className={styles.modalTitle}>Choose a Template</h2>
                  <button className={styles.modalClose} onClick={() => setShowTemplatePicker(false)}>
                    <X size={18} />
                  </button>
                </div>
                <div className={styles.modalBody}>
                  <p className={styles.modalSub}>
                    Your AI-tailored resume will be pre-loaded into the editor with this template. You can change it later.
                  </p>
                  <div className={styles.templateGrid}>
                    {TEMPLATES.map(t => (
                      <button
                        key={t.id}
                        className={styles.templateCard}
                        onClick={() => (tailorMode === 'smart' ? handleSmartTailor(t.id) : handleTailor(t.id))}
                      >
                        {t.thumbnailUrl ? (
                          <img src={t.thumbnailUrl} alt={t.name} className={styles.templateThumbImage} />
                        ) : (
                          <div className={styles.templateThumb} style={{ '--c': t.color } as React.CSSProperties}>
                            <div className={styles.thumbLines}>
                              <div className={styles.tl} style={{ width: '60%' }} />
                              <div className={styles.tl} style={{ width: '40%', height: 3 }} />
                              {[80, 90, 70].map((w, i) => (
                                <div key={i} className={styles.tl} style={{ width: `${w}%`, opacity: 0.3 }} />
                              ))}
                            </div>
                          </div>
                        )}
                        <span className={styles.templateName}>{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.modalLoadingOverlay}>
                <Loader2 size={40} className={styles.spin} color="var(--brand)" />
                <p className={styles.loadingTitle}>Generating tailored resume…</p>
                <p className={styles.loadingSubText}>
                  Injecting JD keywords, strengthening bullets, and building your new resume. This takes ~15-30 seconds.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upgrade modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger={upgradeFeature}
        currentPlan="seeker"
      />

      <AuthRequireModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => { setShowAuthModal(false); navigate(0) }}
        title="Welcome back to CareerForge"
        subtitle="Sign in to access your resumes and continue tailoring."
      />
    </div>
  )
}
