import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  FileText, Upload, List, X, Check, Loader2,
  Copy, Download, Zap,
  Sparkles, RotateCcw, Save, Target
} from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/apiClient'
import { UpgradeModal } from '@/shared/components/UpgradeModal/UpgradeModal'
import { AuthRequireModal } from '@/shared/components/AuthRequireModal/AuthRequireModal'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { useUsage } from '@/core/hooks/useUsage'
import { serializeResume } from '@/features/scoring/lib/jdPreprocessor'
import { trackCoverLetterGenerated } from '@/shared/lib/analytics'
import styles from './CoverLetterPage.module.css'

// ── Types ──────────────────────────────────────────────────────────────────────
type Tone = 'professional' | 'enthusiastic' | 'concise' | 'creative'
type ResumeSource = 'paste' | 'upload' | 'existing'
type JdSource = 'paste' | 'upload'

interface CoverLetterResult {
  subject: string
  recipientName: string
  companyName: string
  roleName: string
  body: string
  wordCount: number
  keywordsUsed?: string[]
}

interface ExistingResume {
  _id: string
  title: string
  updatedAt: string
  sections: any[]
  personalInfo: any
}

// ── Tone config ────────────────────────────────────────────────────────────────
const TONES: { id: Tone; name: string; desc: string; emoji: string }[] = [
  { id: 'professional', name: 'Professional', desc: 'Formal & polished',      emoji: '💼' },
  { id: 'enthusiastic', name: 'Enthusiastic', desc: 'Energetic & passionate', emoji: '🚀' },
  { id: 'concise',      name: 'Concise',      desc: 'Direct & to the point',  emoji: '⚡' },
  { id: 'creative',     name: 'Creative',     desc: 'Distinctive & memorable', emoji: '✨' },
]

// ── Main Page ─────────────────────────────────────────────────────────────────
interface CoverLetterNavState {
  resumeText?: string
  jdText?: string
  resumeId?: string
}

export default function CoverLetterPage() {
  const { remaining, isGuest, isAtLimit } = useUsage()
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const navigate = useNavigate()
  const location = useLocation()
  const navState = (location.state as CoverLetterNavState | null) ?? null

  // Input state
  const [resumeSource, setResumeSource] = useState<ResumeSource>(navState?.resumeId ? 'existing' : 'paste')
  const [jdSource, setJdSource]         = useState<JdSource>('paste')
  const [resumeText, setResumeText]     = useState(navState?.resumeText ?? '')
  const [jdText, setJdText]             = useState(navState?.jdText ?? '')
  const [selectedTone, setSelectedTone] = useState<Tone>('professional')
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(navState?.resumeId ?? null)
  const [isDragging, setIsDragging]     = useState(false)
  const [isDraggingJd, setIsDraggingJd] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedJdFile, setUploadedJdFile] = useState<File | null>(null)
  const [variants, setVariants]         = useState<CoverLetterResult[]>([])
  const [activeVariant, setActiveVariant] = useState(0)
  const result = variants[activeVariant] ?? null
  const [copied, setCopied]             = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showAuthModal, setShowAuthModal]       = useState(false)

  const fileInputRef   = useRef<HTMLInputElement>(null)
  const jdFileInputRef = useRef<HTMLInputElement>(null)

  // Clear the navigation state once consumed so it doesn't re-apply on back/refresh
  useEffect(() => {
    if (navState) navigate(location.pathname, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Fetch existing resumes ─────────────────────────────────────────────────
  const { data: resumes = [] } = useQuery<ExistingResume[]>({
    queryKey: ['resumes'],
    queryFn: async () => {
      const res = await apiClient.get('/resumes')
      return res.data.data.resumes
    },
    enabled: isAuthenticated
  })

  // ── Parse uploaded resume ─────────────────────────────────────────────────
  const parseFileMutation = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData()
      fd.append('resume', file)
      const res = await apiClient.post('/ai/parse-resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      return res.data.data
    },
    onSuccess: (data) => {
      const lines: string[] = []
      if (data.personalInfo?.fullName) lines.push(data.personalInfo.fullName)
      if (data.personalInfo?.summary)  lines.push(data.personalInfo.summary)
      data.sections?.forEach((s: any) => {
        lines.push(s.name || s.key)
        s.entries?.forEach((e: any) => {
          Object.values(e).forEach(v => { if (typeof v === 'string') lines.push(v) })
        })
      })
      setResumeText(lines.join('\n'))
    }
  })

  // ── Extract JD file text ──────────────────────────────────────────────────
  const extractJdMutation = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData()
      fd.append('resume', file)
      const res = await apiClient.post('/ai/extract-text', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      return res.data.data as string
    },
    onSuccess: (text) => setJdText(text)
  })

  // ── Generate cover letter ─────────────────────────────────────────────────
  const generateMutation = useMutation({
    mutationFn: async (payload: { resumeText: string; jdText: string; tone: Tone; isAlternate?: boolean }) => {
      const res = await apiClient.post('/ai/cover-letter', { resumeText: payload.resumeText, jdText: payload.jdText, tone: payload.tone })
      return { data: res.data.data as CoverLetterResult, isAlternate: !!payload.isAlternate }
    },
    onSuccess: ({ data, isAlternate }) => {
      if (isAlternate) {
        setVariants(v => {
          const next = [...v, data]
          setActiveVariant(next.length - 1)
          return next
        })
      } else {
        setVariants([data])
        setActiveVariant(0)
      }
      trackCoverLetterGenerated()
    },
    onError: (err: any) => {
      const code = err?.response?.data?.error?.code ?? err?.response?.data?.code
      if (code === 'GUEST_LIMIT_HIT') {
        window.dispatchEvent(new CustomEvent('guest-limit-hit', { detail: err?.response?.data?.data ?? { feature: 'coverLetter' } }))
      } else if (code === 'QUOTA_EXCEEDED') {
        setShowUpgradeModal(true)
      }
    }
  })

  // ── Save cover letter ──────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!result) throw new Error('No result to save')
      const res = await apiClient.post('/cover-letters', {
        title: `${result.roleName || 'Cover Letter'}${result.companyName ? ` — ${result.companyName}` : ''}`,
        subject: result.subject,
        recipientName: result.recipientName,
        companyName: result.companyName,
        roleName: result.roleName,
        body: result.body,
        tone: selectedTone,
        wordCount: result.wordCount,
        keywordsUsed: result.keywordsUsed ?? [],
      })
      return res.data.data
    },
    onSuccess: (data) => {
      navigate(`/cover-letter/${data._id}`)
    }
  })

  const handleSave = () => {
    if (!result) return
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    saveMutation.mutate()
  }

  // ── Get resume text ────────────────────────────────────────────────────────
  const getResumeText = (): string => {
    if (resumeSource === 'paste' || resumeSource === 'upload') return resumeText
    if (resumeSource === 'existing') {
      const r = resumes.find(r => r._id === selectedResumeId)
      if (!r) return ''
      return serializeResume({
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
      } as any)
    }
    return ''
  }

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleGenerate = () => {
    const rt = getResumeText()
    if (!rt.trim() || rt.trim().length < 50) return
    if (!jdText.trim() || jdText.trim().length < 50) return
    // Pre-check: if guest is at limit, show auth modal
    if (isGuest && isAtLimit('coverLetter')) {
      window.dispatchEvent(new CustomEvent('guest-limit-hit', { detail: { feature: 'coverLetter' } }))
      return
    }
    generateMutation.mutate({ resumeText: rt, jdText, tone: selectedTone })
  }

  const handleGenerateAlternate = () => {
    const rt = getResumeText()
    if (!rt.trim() || !jdText.trim()) return
    if (isGuest && isAtLimit('coverLetter')) {
      window.dispatchEvent(new CustomEvent('guest-limit-hit', { detail: { feature: 'coverLetter' } }))
      return
    }
    generateMutation.mutate({ resumeText: rt, jdText, tone: selectedTone, isAlternate: true })
  }

  const handleCopy = async () => {
    if (!result) return
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    await navigator.clipboard.writeText(result.body)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleDownload = () => {
    if (!result) return
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    const content = `Subject: ${result.subject}\n\nDear ${result.recipientName},\n\n${result.body}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Cover Letter - ${result.roleName || 'Application'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setVariants([])
    setActiveVariant(0)
    generateMutation.reset()
  }

  const processFile = (file: File) => {
    setUploadedFile(file)
    setResumeText('')
    parseFileMutation.mutate(file)
  }

  const processJdFile = (file: File) => {
    setUploadedJdFile(file)
    setJdText('')
    extractJdMutation.mutate(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [])

  const handleDropJd = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDraggingJd(false)
    const file = e.dataTransfer.files[0]
    if (file) processJdFile(file)
  }, [])

  // ── Validation ─────────────────────────────────────────────────────────────
  const resumeReady = (() => {
    if (resumeSource === 'paste' || resumeSource === 'upload') return resumeText.trim().length >= 50
    if (resumeSource === 'existing') return !!selectedResumeId
    return false
  })()
  const jdReady     = jdText.trim().length >= 50
  const canGenerate = resumeReady && jdReady && !generateMutation.isPending
  const creditsLeft = remaining('coverLetter' as any)

  // ── Render: Step 01 — Resume ───────────────────────────────────────────────
  const renderResumeStep = () => (
    <div className={styles.stepBlock}>
      <div className={styles.stepBlockHead}>
        <span className={styles.stepNumber}>01</span>
        <div className={styles.stepHeadText}>
          <h2 className={styles.stepTitle}>Your resume</h2>
          <p className={styles.stepSub}>We use this to personalise your letter</p>
        </div>
      </div>

      <div className={styles.stepBody}>
        <div className={styles.sourceTabs}>
          {(['paste', 'upload', 'existing'] as ResumeSource[]).map(s => (
            <button
              key={s}
              className={`${styles.sourceTab} ${resumeSource === s ? styles.sourceTabActive : ''}`}
              onClick={() => setResumeSource(s)}
            >
              {s === 'paste' ? <FileText size={12} /> : s === 'upload' ? <Upload size={12} /> : <List size={12} />}
              {s === 'paste' ? 'Paste' : s === 'upload' ? 'Upload' : 'My Resumes'}
            </button>
          ))}
        </div>

        {resumeSource === 'paste' && (
          <div className={styles.textareaCard}>
            <textarea
              className={styles.textarea}
              placeholder="Paste your resume here — name, experience, skills, education..."
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
            />
            <div className={styles.textareaFooter}>
              <span className={resumeText.trim().length >= 50 ? styles.textareaFooterOk : ''}>
                {resumeText.length} characters {resumeText.trim().length >= 50 ? '· looks good' : '(min 50)'}
              </span>
            </div>
          </div>
        )}

        {resumeSource === 'upload' && (
          !uploadedFile ? (
            <div
              className={`${styles.uploadZone} ${isDragging ? styles.isDragging : ''}`}
              onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={styles.uploadIcon}><Upload size={18} /></div>
              <div className={styles.uploadLabel}>Drop your resume here</div>
              <div className={styles.uploadSub}>or click to browse — PDF or DOCX, up to 5MB</div>
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }}
                onChange={e => { if (e.target.files?.[0]) processFile(e.target.files[0]) }} />
            </div>
          ) : (
            <div className={`${styles.uploadZone} ${styles.uploadDone}`}>
              <div className={styles.uploadIcon}>
                {parseFileMutation.isPending ? <Loader2 size={18} className={styles.spin} /> : <Check size={18} />}
              </div>
              <div className={styles.uploadLabel}>{uploadedFile.name}</div>
              <div className={`${styles.uploadSub} ${styles.uploadSubDone}`}>
                {parseFileMutation.isPending ? 'Extracting text…' : `Extracted ${resumeText.length} characters`}
              </div>
              <button className={styles.clearFileBtn} onClick={(e) => { e.stopPropagation(); setUploadedFile(null); setResumeText('') }}>
                <X size={12} /> Remove file
              </button>
            </div>
          )
        )}

        {resumeSource === 'existing' && (
          !isAuthenticated ? (
            <div className={styles.authGate}>
              <div className={styles.authGateIcon}><Zap size={20} /></div>
              <p className={styles.authGateTitle}>Unlock your saved resumes</p>
              <p className={styles.authGateSub}>Sign in to use your professional resumes and track your application history.</p>
              <button className={styles.authGateBtn} onClick={() => setShowAuthModal(true)}>Sign In Now</button>
            </div>
          ) : resumes.length === 0 ? (
            <div className={styles.emptyResumes}>
              No resumes found. <a href="/resume/new">Create one first</a>.
            </div>
          ) : (
            <div className={styles.resumeList}>
              {resumes.map(r => (
                <button
                  key={r._id}
                  className={`${styles.resumeItem} ${selectedResumeId === r._id ? styles.resumeItemSelected : ''}`}
                  onClick={() => setSelectedResumeId(r._id)}
                >
                  <div className={styles.resumeItemCheck}>
                    {selectedResumeId === r._id && <Check size={11} />}
                  </div>
                  <span className={styles.resumeItemTitle}>{r.title}</span>
                  <span className={styles.resumeItemDate}>
                    {new Date(r.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </button>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )

  // ── Render: Step 02 — Job description ──────────────────────────────────────
  const renderJDStep = () => (
    <div className={styles.stepBlock}>
      <div className={styles.stepBlockHead}>
        <span className={styles.stepNumber}>02</span>
        <div className={styles.stepHeadText}>
          <h2 className={styles.stepTitle}>Job description</h2>
          <p className={styles.stepSub}>Paste or upload the full JD for this role</p>
        </div>
      </div>

      <div className={styles.stepBody}>
        <div className={styles.sourceTabs}>
          {(['paste', 'upload'] as JdSource[]).map(s => (
            <button
              key={s}
              className={`${styles.sourceTab} ${jdSource === s ? styles.sourceTabActive : ''}`}
              onClick={() => setJdSource(s)}
            >
              {s === 'paste' ? <FileText size={12} /> : <Upload size={12} />}
              {s === 'paste' ? 'Paste Text' : 'Upload File'}
            </button>
          ))}
        </div>

        {jdSource === 'paste' && (
          <div className={styles.textareaCard}>
            <textarea
              className={styles.textarea}
              placeholder="Paste the full job description — role, requirements, company..."
              value={jdText}
              onChange={e => setJdText(e.target.value)}
            />
            <div className={styles.textareaFooter}>
              <span className={jdText.trim().length >= 50 ? styles.textareaFooterOk : ''}>
                {jdText.length} characters {jdText.trim().length >= 50 ? '· looks good' : '(min 50)'}
              </span>
            </div>
          </div>
        )}

        {jdSource === 'upload' && (
          !uploadedJdFile ? (
            <div
              className={`${styles.uploadZone} ${isDraggingJd ? styles.isDragging : ''}`}
              onDragOver={e => { e.preventDefault(); setIsDraggingJd(true) }}
              onDragLeave={() => setIsDraggingJd(false)}
              onDrop={handleDropJd}
              onClick={() => jdFileInputRef.current?.click()}
            >
              <div className={styles.uploadIcon}><Upload size={18} /></div>
              <div className={styles.uploadLabel}>Drop JD file here</div>
              <div className={styles.uploadSub}>or click to browse — PDF or DOCX, up to 5MB</div>
              <input ref={jdFileInputRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }}
                onChange={e => { if (e.target.files?.[0]) processJdFile(e.target.files[0]) }} />
            </div>
          ) : (
            <div className={`${styles.uploadZone} ${styles.uploadDone}`}>
              <div className={styles.uploadIcon}>
                {extractJdMutation.isPending ? <Loader2 size={18} className={styles.spin} /> : <Check size={18} />}
              </div>
              <div className={styles.uploadLabel}>{uploadedJdFile.name}</div>
              <div className={`${styles.uploadSub} ${styles.uploadSubDone}`}>
                {extractJdMutation.isPending ? 'Extracting text…' : `Extracted ${jdText.length} characters`}
              </div>
              <button className={styles.clearFileBtn} onClick={(e) => { e.stopPropagation(); setUploadedJdFile(null); setJdText('') }}>
                <X size={12} /> Remove file
              </button>
            </div>
          )
        )}
      </div>
    </div>
  )

  // ── Render: Step 03 — Tone ──────────────────────────────────────────────────
  const renderToneStep = () => (
    <div className={styles.stepBlock}>
      <div className={styles.stepBlockHead}>
        <span className={styles.stepNumber}>03</span>
        <div className={styles.stepHeadText}>
          <h2 className={styles.stepTitle}>Writing tone</h2>
          <p className={styles.stepSub}>Choose the voice for your letter</p>
        </div>
      </div>

      <div className={styles.stepBody}>
        <div className={styles.toneGrid}>
          {TONES.map(t => (
            <button
              key={t.id}
              className={`${styles.toneBtn} ${selectedTone === t.id ? styles.toneBtnActive : ''}`}
              onClick={() => setSelectedTone(t.id)}
            >
              <span className={styles.toneName}>{t.emoji} {t.name}</span>
              <span className={styles.toneDesc}>{t.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // ── Render: Results ────────────────────────────────────────────────────────
  const renderResults = () => {
    if (!result) return null
    return (
      <div className={styles.results}>
        {/* Results action bar */}
        <div className={styles.resultsBar}>
          <div className={styles.resultsBarLeft}>
            <div className={styles.resultsBarBadge}><Check size={12} /> Generated</div>
            <div className={styles.resultsBarMeta}>
              <span className={styles.resultsBarTitle}>
                {result.roleName} at {result.companyName}
              </span>
              <span className={styles.resultsBarSub}>{result.wordCount} words · {selectedTone} tone</span>
            </div>
          </div>
          <div className={styles.resultsBarActions}>
            <button className={`${styles.actionBtn} ${copied ? styles.actionBtnSuccess : ''}`} onClick={handleCopy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Letter'}
            </button>
            <button className={styles.actionBtn} onClick={handleDownload}>
              <Download size={14} /> Download .txt
            </button>
            <button className={`${styles.actionBtn} ${styles.actionBtnPrimary}`} onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? <Loader2 size={14} className={styles.spin} /> : <Save size={14} />}
              {saveMutation.isPending ? 'Saving…' : 'Save'}
            </button>
            <button className={styles.actionBtn} onClick={handleGenerateAlternate} disabled={generateMutation.isPending}>
              {generateMutation.isPending ? <Loader2 size={14} className={styles.spin} /> : <Sparkles size={14} />}
              {generateMutation.isPending ? 'Generating…' : 'Generate another version'}
            </button>
            <button className={styles.actionBtn} onClick={handleReset}>
              <RotateCcw size={14} /> New Letter
            </button>
          </div>
        </div>

        {/* Variant tabs — switch between generated versions */}
        {variants.length > 1 && (
          <div className={styles.variantTabs}>
            {variants.map((_, i) => (
              <button
                key={i}
                className={`${styles.variantTab} ${activeVariant === i ? styles.variantTabActive : ''}`}
                onClick={() => setActiveVariant(i)}
              >
                Version {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Letter card */}
        <div className={styles.letterCard}>
          <div className={styles.letterHeader}>
            <div className={styles.letterSubjectRow}>
              <span className={styles.letterSubjectLabel}>Email Subject</span>
              <span className={styles.letterSubject}>{result.subject}</span>
            </div>
            <div className={styles.letterMetaTags}>
              <span className={styles.letterTag}>To: {result.recipientName}</span>
              <span className={styles.letterTag}>{result.companyName}</span>
            </div>
          </div>
          <div className={styles.letterBody}>
            <p className={styles.letterBodyText}>{result.body}</p>
          </div>
          <div className={styles.wordCountStrip}>
            <FileText size={12} /> {result.wordCount} words&nbsp;&nbsp;·&nbsp;&nbsp;
            Tone: <strong style={{ marginLeft: 4 }}>{selectedTone}</strong>
          </div>
        </div>

        {/* Quality panel — JD keyword coverage */}
        {!!result.keywordsUsed?.length && (
          <div className={styles.qualityCard}>
            <div className={styles.qualityHeader}>
              <div className={styles.qualityIcon}><Target size={16} /></div>
              <div>
                <h3 className={styles.qualityTitle}>JD Match Quality</h3>
                <p className={styles.qualitySub}>Keywords from the job description woven into your letter</p>
              </div>
            </div>
            <div className={styles.letterMetaTags}>
              {result.keywordsUsed.map((kw, i) => (
                <span key={i} className={styles.keywordTag}>
                  <Check size={11} style={{ marginRight: 4, verticalAlign: '-1px' }} />{kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Main render ────────────────────────────────────────────────────────────
  const isGenerating = generateMutation.isPending && variants.length === 0

  return (
    <div className={styles.page}>
      <Helmet>
        <link rel="canonical" href="https://careerforge.pro/cover-letter" />
      </Helmet>

      {!isGenerating && !result && (
        <div className={styles.heroSection}>
          <div className={styles.eyebrow}>AI Cover Letter</div>
          <h1 className={styles.heroTitle}>
            Write a <span className={styles.heroAccent}>tailored cover letter</span> in seconds
          </h1>
          <p className={styles.heroSub}>
            Drop your resume and the job description — our AI crafts a personalised, ATS-friendly letter matched to the role.
          </p>
        </div>
      )}

      {isGenerating ? (
        <div className={styles.generatingWrap}>
          <div className={styles.generatingInner}>
            <div className={styles.generatingOrb}><Sparkles size={26} color="#fff" /></div>
            <h2 className={styles.generatingTitle}>Writing your cover letter…</h2>
            <p className={styles.generatingSubText}>
              Personalising your application for this role, injecting the right keywords, and crafting a compelling narrative. Takes about 15 seconds.
            </p>
          </div>
        </div>
      ) : result ? (
        renderResults()
      ) : (
        <>
          {renderResumeStep()}
          {renderJDStep()}
          {renderToneStep()}

          <div className={styles.ctaBarWrap}>
            <div className={styles.ctaBar}>
              <div className={styles.readiness}>
                <div className={styles.readinessItem}>
                  <div className={`${styles.readinessDot} ${resumeReady ? styles.readinessDotOk : ''}`}>
                    {resumeReady && <Check size={11} />}
                  </div>
                  <span className={`${styles.readinessLabel} ${resumeReady ? styles.readinessLabelOk : ''}`}>Resume</span>
                </div>
                <div className={styles.readinessItem}>
                  <div className={`${styles.readinessDot} ${jdReady ? styles.readinessDotOk : ''}`}>
                    {jdReady && <Check size={11} />}
                  </div>
                  <span className={`${styles.readinessLabel} ${jdReady ? styles.readinessLabelOk : ''}`}>Job description</span>
                </div>
                <span className={styles.ctaSub}>
                  {creditsLeft === 'Unlimited' ? 'Unlimited generations' : `${creditsLeft} left this month`}
                </span>
              </div>

              <button className={styles.generateBtn} onClick={handleGenerate} disabled={!canGenerate}>
                {generateMutation.isPending
                  ? <><Loader2 size={16} className={styles.spin} /> Generating…</>
                  : <><Sparkles size={16} /> Generate letter</>
                }
              </button>
            </div>
          </div>
        </>
      )}

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger="coverLetter"
        currentPlan="seeker"
      />

      <AuthRequireModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => { setShowAuthModal(false); window.location.reload() }}
        title="Welcome back to CareerForge"
        subtitle="Sign in to access your resumes and continue generating tailored cover letters."
      />
    </div>
  )
}
