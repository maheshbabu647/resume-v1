import { useState, useRef, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  FileText, Upload, List, X, Check, Loader2,
  FileSignature, BookOpen, Copy, Download, Zap,
  Sparkles, RotateCcw
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
  { id: 'professional', name: 'Professional', desc: 'Formal & polished',    emoji: '💼' },
  { id: 'enthusiastic', name: 'Enthusiastic', desc: 'Energetic & passionate', emoji: '🚀' },
  { id: 'concise',      name: 'Concise',      desc: 'Direct & to the point', emoji: '⚡' },
  { id: 'creative',     name: 'Creative',     desc: 'Distinctive & memorable', emoji: '✨' },
]

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CoverLetterPage() {
  const { remaining, isGuest, isAtLimit } = useUsage()
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)

  // Input state
  const [resumeSource, setResumeSource] = useState<ResumeSource>('paste')
  const [jdSource, setJdSource]         = useState<JdSource>('paste')
  const [resumeText, setResumeText]     = useState('')
  const [jdText, setJdText]             = useState('')
  const [selectedTone, setSelectedTone] = useState<Tone>('professional')
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null)
  const [isDragging, setIsDragging]     = useState(false)
  const [isDraggingJd, setIsDraggingJd] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedJdFile, setUploadedJdFile] = useState<File | null>(null)
  const [result, setResult]             = useState<CoverLetterResult | null>(null)
  const [copied, setCopied]             = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showAuthModal, setShowAuthModal]       = useState(false)

  const fileInputRef   = useRef<HTMLInputElement>(null)
  const jdFileInputRef = useRef<HTMLInputElement>(null)

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
    mutationFn: async (payload: { resumeText: string; jdText: string; tone: Tone }) => {
      const res = await apiClient.post('/ai/cover-letter', payload)
      return res.data.data as CoverLetterResult
    },
    onSuccess: (data) => {
      setResult(data)
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
    setResult(null)
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

  // ── Render: Resume panel ───────────────────────────────────────────────────
  const renderResumePanel = () => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}><FileSignature size={16} /></div>
        <div>
          <h3 className={styles.cardTitle}>Your Resume</h3>
          <p className={styles.cardSub}>We use this to personalise your letter</p>
        </div>
      </div>

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
        <>
          <textarea
            className={styles.textarea}
            placeholder="Paste your resume here — name, experience, skills, education..."
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
          />
          <span className={styles.charCount}>{resumeText.length} chars (min 50)</span>
        </>
      )}

      {resumeSource === 'upload' && (
        <>
          {!uploadedFile ? (
            <div
              className={`${styles.uploadZone} ${isDragging ? styles.isDragging : ''}`}
              onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={styles.uploadIcon}><Upload size={18} /></div>
              <span className={styles.uploadLabel}>Drop your resume here</span>
              <span className={styles.uploadSub}>PDF or DOCX, up to 5MB</span>
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }}
                onChange={e => { if (e.target.files?.[0]) processFile(e.target.files[0]) }} />
            </div>
          ) : (
            <div className={styles.uploadedFile}>
              <FileText size={16} color="#22c55e" />
              <span className={styles.uploadedFileName}>{uploadedFile.name}</span>
              {parseFileMutation.isPending && <Loader2 size={14} className={styles.spin} />}
              {parseFileMutation.isSuccess && <Check size={14} color="#22c55e" />}
              <button className={styles.clearFileBtn} onClick={() => { setUploadedFile(null); setResumeText('') }}>
                <X size={14} />
              </button>
            </div>
          )}
          {parseFileMutation.isSuccess && (
            <span className={styles.charCount} style={{ color: '#22c55e' }}>
              ✓ Extracted — {resumeText.length} chars
            </span>
          )}
        </>
      )}

      {resumeSource === 'existing' && (
        <>
          {!isAuthenticated ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <div style={{ background: 'rgba(99,102,241,0.1)', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#6366f1' }}>
                <Zap size={20} />
              </div>
              <p style={{ color: 'var(--on-surface)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' }}>Unlock your saved resumes</p>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>Sign in to use your professional resumes and track your application history.</p>
              <button 
                style={{ all: 'unset', background: '#6366f1', color: 'white', padding: '10px 20px', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setShowAuthModal(true)}
              >
                Sign In Now
              </button>
            </div>
          ) : resumes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--on-surface-variant)', fontSize: 'var(--text-sm)' }}>
              No resumes found. <a href="/resume/new" style={{ color: 'var(--secondary)' }}>Create one first</a>.
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
          )}
        </>
      )}
    </div>
  )

  // ── Render: JD panel ───────────────────────────────────────────────────────
  const renderJDPanel = () => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon} style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
          <BookOpen size={16} />
        </div>
        <div>
          <h3 className={styles.cardTitle}>Job Description</h3>
          <p className={styles.cardSub}>Paste or upload the full JD</p>
        </div>
      </div>

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
        <>
          <textarea
            className={styles.textarea}
            placeholder="Paste the full job description — role, requirements, company..."
            value={jdText}
            onChange={e => setJdText(e.target.value)}
          />
          <span className={styles.charCount}>{jdText.length} chars (min 50)</span>
        </>
      )}

      {jdSource === 'upload' && (
        <>
          {!uploadedJdFile ? (
            <div
              className={`${styles.uploadZone} ${isDraggingJd ? styles.isDragging : ''}`}
              onDragOver={e => { e.preventDefault(); setIsDraggingJd(true) }}
              onDragLeave={() => setIsDraggingJd(false)}
              onDrop={handleDropJd}
              onClick={() => jdFileInputRef.current?.click()}
            >
              <div className={styles.uploadIcon}><Upload size={18} /></div>
              <span className={styles.uploadLabel}>Drop JD file here</span>
              <span className={styles.uploadSub}>PDF or DOCX, up to 5MB</span>
              <input ref={jdFileInputRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }}
                onChange={e => { if (e.target.files?.[0]) processJdFile(e.target.files[0]) }} />
            </div>
          ) : (
            <div className={styles.uploadedFile}>
              <FileText size={16} color="#f59e0b" />
              <span className={styles.uploadedFileName}>{uploadedJdFile.name}</span>
              {extractJdMutation.isPending && <Loader2 size={14} className={styles.spin} />}
              {extractJdMutation.isSuccess && <Check size={14} color="#f59e0b" />}
              <button className={styles.clearFileBtn} onClick={() => { setUploadedJdFile(null); setJdText('') }}>
                <X size={14} />
              </button>
            </div>
          )}
          {extractJdMutation.isSuccess && (
            <span className={styles.charCount} style={{ color: '#f59e0b' }}>
              ✓ Extracted — {jdText.length} chars
            </span>
          )}
        </>
      )}
    </div>
  )

  // ── Render: Tone + CTA ────────────────────────────────────────────────────
  const renderControls = () => (
    <>
      {/* Tone card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon} style={{ background: 'rgba(168,85,247,0.12)', color: '#a855f7' }}>
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className={styles.cardTitle}>Writing Tone</h3>
            <p className={styles.cardSub}>Choose the voice for your letter</p>
          </div>
        </div>

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

      {/* CTA bar */}
      <div className={styles.ctaBar}>
        <div className={styles.ctaMeta}>
          <div className={styles.ctaIconBox}><FileSignature size={18} /></div>
          <div className={styles.ctaMetaText}>
            <span className={styles.ctaLabel}>Generate your cover letter</span>
            <span className={styles.ctaSub}>
              Uses 1 Cover Letter credit ·{' '}
              {remaining('coverLetter' as any) === 'Unlimited' ? 'Unlimited' : `${remaining('coverLetter' as any)} left`}
            </span>
          </div>
        </div>

        <button
          style={{
            all: 'unset',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            minWidth: 180,
            padding: '0.75rem 2rem',
            borderRadius: 'var(--radius-xl)',
            background: canGenerate ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'var(--surface-container-high)',
            color: canGenerate ? 'white' : 'var(--on-surface-variant)',
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
            cursor: canGenerate ? 'pointer' : 'not-allowed',
            justifyContent: 'center',
            fontFamily: 'var(--font-sans)',
            transition: 'opacity 0.2s',
            boxSizing: 'border-box',
          }}
          onClick={handleGenerate}
          disabled={!canGenerate}
        >
          {generateMutation.isPending
            ? <><Loader2 size={16} className={styles.spin} /> Generating…</>
            : <><Sparkles size={16} /> Generate Letter</>
          }
        </button>
      </div>
    </>
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
            <button className={`${styles.actionBtn} ${styles.actionBtnPrimary}`} onClick={handleReset}>
              <RotateCcw size={14} /> New Letter
            </button>
          </div>
        </div>

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
      </div>
    )
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <Helmet>
        <link rel="canonical" href="https://careerforge.pro/cover-letter" />
      </Helmet>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroBadge}><Zap size={10} /> AI-Powered</div>
        <h1 className={styles.heroTitle}>Cover Letter Generator</h1>
        <p className={styles.heroSub}>
          Drop your resume and any job description. Our AI writes a tailored, ATS-friendly cover letter in seconds.
        </p>
      </div>

      <div className={styles.main}>
        {generateMutation.isPending ? (
          /* Generating state */
          <div className={styles.generatingWrap}>
            <Loader2 size={44} className={styles.spin} color="#818cf8" />
            <p className={styles.generatingTitle}>Writing your cover letter…</p>
            <p className={styles.generatingSubText}>
              Personalising your application for this role, injecting the right keywords, and crafting a compelling narrative. Takes about 15 seconds.
            </p>
          </div>
        ) : result ? (
          /* Results */
          renderResults()
        ) : (
          /* Input stage */
          <>
            <div className={styles.inputGrid}>
              {renderResumePanel()}
              {renderJDPanel()}
            </div>
            {renderControls()}
          </>
        )}
      </div>

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
