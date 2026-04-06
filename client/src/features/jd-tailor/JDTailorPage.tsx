import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  Zap, FileText, Upload, List, X, Check, AlertTriangle,
  Loader2, ChevronRight, BarChart2, Lightbulb, Wand2,
  Target, BookOpen, FileSearch
} from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/apiClient'
import { UpgradeModal } from '@/shared/components/UpgradeModal/UpgradeModal'
import { useUsage } from '@/core/hooks/useUsage'
import { preprocessJD, serializeResume } from '@/features/scoring/lib/jdPreprocessor'
import { trackJDScoreViewed, trackJDTailorRequested } from '@/shared/lib/analytics'
import styles from './JDTailorPage.module.css'

// ── Template registry ──────────────────────────────────────────────────────────
const TEMPLATES = [
  { id: 'modern-centered', name: 'Modern Centered', color: '#1e2d4a' },
  { id: 'minimal-left',    name: 'Minimal Left',    color: '#1a2744' },
  { id: 'compact-tech',    name: 'Compact Tech',    color: '#006c49' },
]

type Stage = 'input' | 'analyzing' | 'results' | 'tailoring'
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

// ── Score color util ───────────────────────────────────────────────────────────
function scoreColor(score: number) {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#f59e0b'
  if (score >= 40) return '#f97316'
  return '#ef4444'
}

// ── Animated score ring ────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 55
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = scoreColor(score)

  return (
    <div className={styles.scoreCircleWrap}>
      <svg className={styles.scoreCircleSvg} viewBox="0 0 130 130">
        <circle className={styles.scoreCircleTrack} cx="65" cy="65" r={r} />
        <circle
          className={styles.scoreCircleFill}
          cx="65" cy="65" r={r}
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className={styles.scoreNumCenter}>
        <span className={styles.scoreNum}>{score}</span>
        <span className={styles.scoreOf}>/100</span>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function JDTailorPage() {
  const navigate = useNavigate()
  const { isAtLimit, remaining } = useUsage()

  const [stage, setStage] = useState<Stage>('input')
  const [resumeSource, setResumeSource] = useState<ResumeSource>('paste')
  const [jdSource, setJdSource] = useState<'paste' | 'upload'>('paste')
  const [resumeText, setResumeText] = useState('')
  const [jdText, setJdText] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isDraggingJd, setIsDraggingJd] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedJdFile, setUploadedJdFile] = useState<File | null>(null)
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null)
  const [fitResult, setFitResult] = useState<JDFitResult | null>(null)
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeFeature, setUpgradeFeature] = useState<'jdScore' | 'jdTailoring'>('jdScore')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const jdFileInputRef = useRef<HTMLInputElement>(null)

  // Fetch existing resumes
  const { data: resumes = [] } = useQuery<ExistingResume[]>({
    queryKey: ['resumes'],
    queryFn: async () => {
      const res = await apiClient.get('/resumes')
      return res.data.data.resumes
    }
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
      setStage('results')
      trackJDScoreViewed()
    },
    onError: (err: any) => {
      const code = err?.response?.data?.error?.code
      if (code === 'QUOTA_EXCEEDED') { setUpgradeFeature('jdScore'); setShowUpgradeModal(true) }
      setStage('input')
    }
  })

  // Tailor new resume
  const tailorMutation = useMutation({
    mutationFn: async (payload: { resumeText: string; jdText: string; templateId: string }) => {
      const res = await apiClient.post('/ai/tailor-new', payload)
      return res.data.data
    },
    onSuccess: (data) => {
      sessionStorage.setItem('careerforge_tailored_resume', JSON.stringify(data))
      navigate(`/resume/new?tailored=true&template=${tailorMutation.variables?.templateId ?? 'modern-centered'}`)
    },
    onError: (err: any) => {
      const code = err?.response?.data?.error?.code
      if (code === 'QUOTA_EXCEEDED') { setUpgradeFeature('jdTailoring'); setShowUpgradeModal(true) }
      setShowTemplatePicker(false)
      setStage('results')
    }
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
    setStage('analyzing')
    const preprocessedJD = preprocessJD(currentJd)
    const serializedResume = text.length > 6000 ? text.slice(0, 6000) : text
    analyzeMutation.mutate({ serializedResume, preprocessedJD })
  }

  // ── Tailor handler ───────────────────────────────────────────────────────────
  const handleTailor = (templateId: string) => {
    const text = getResumeText()
    trackJDTailorRequested()
    tailorMutation.mutate({ resumeText: text, jdText, templateId })
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

  // ── Content for left panel based on resumeSource ─────────────────────────────
  const renderResumePanel = () => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}><FileSearch size={16} /></div>
        <div>
          <h3 className={styles.cardTitle}>Your Resume</h3>
          <p className={styles.cardSub}>We compare this against the JD</p>
        </div>
      </div>

      {/* Source selector */}
      <div className={styles.sourceTabs}>
        <button className={`${styles.sourceTab} ${resumeSource === 'paste' ? styles.sourceTabActive : ''}`} onClick={() => setResumeSource('paste')}>
          <FileText size={12} /> Paste Text
        </button>
        <button className={`${styles.sourceTab} ${resumeSource === 'upload' ? styles.sourceTabActive : ''}`} onClick={() => setResumeSource('upload')}>
          <Upload size={12} /> Upload File
        </button>
        <button className={`${styles.sourceTab} ${resumeSource === 'existing' ? styles.sourceTabActive : ''}`} onClick={() => setResumeSource('existing')}>
          <List size={12} /> My Resumes
        </button>
      </div>

      {resumeSource === 'paste' && (
        <>
          <textarea
            className={styles.textarea}
            placeholder="Paste your resume content here — all sections, bullets, experience..."
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
              <span className={styles.uploadLabel}>Drag your resume here</span>
              <span className={styles.uploadSub}>PDF or DOCX, up to 5MB</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                onChange={e => { if (e.target.files?.[0]) processFile(e.target.files[0]) }}
              />
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
              ✓ Parsed successfully — {resumeText.length} chars extracted
            </span>
          )}
        </>
      )}

      {resumeSource === 'existing' && (
        <>
          {resumes.length === 0 ? (
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
                  <div className={`${styles.resumeItemCheck}`}>
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
        <button className={`${styles.sourceTab} ${jdSource === 'paste' ? styles.sourceTabActive : ''}`} onClick={() => setJdSource('paste')}>
          <FileText size={12} /> Paste Text
        </button>
        <button className={`${styles.sourceTab} ${jdSource === 'upload' ? styles.sourceTabActive : ''}`} onClick={() => setJdSource('upload')}>
          <Upload size={12} /> Upload File
        </button>
      </div>

      {jdSource === 'paste' && (
        <>
          <textarea
            className={styles.textarea}
            placeholder="Paste the full job description here — requirements, responsibilities, qualifications..."
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
              <span className={styles.uploadLabel}>Drag JD file here</span>
              <span className={styles.uploadSub}>PDF or DOCX, up to 5MB</span>
              <input
                ref={jdFileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                onChange={e => { if (e.target.files?.[0]) processJdFile(e.target.files[0]) }}
              />
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
              ✓ Extracted successfully — {jdText.length} chars
            </span>
          )}
        </>
      )}
    </div>
  )

  // ── Results View ─────────────────────────────────────────────────────────────
  const renderResults = () => {
    if (!fitResult) return null
    const color = scoreColor(fitResult.fitScore)

    return (
      <div className={styles.results}>
        {/* Re-analyze bar */}
        <div className={styles.reAnalyzeBar}>
          <span className={styles.reAnalyzeText}>
            Analysis complete
          </span>
          <button
            style={{ background: 'none', border: '1.5px solid var(--outline-variant)', borderRadius: 'var(--radius-lg)', padding: '6px 14px', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--on-surface)', fontFamily: 'var(--font-sans)' }}
            onClick={() => { setStage('input'); setFitResult(null) }}
          >
            ← Edit Inputs
          </button>
        </div>

        <div className={styles.resultsGrid} style={{ marginTop: 'var(--space-5)' }}>
          {/* Score card */}
          <div className={styles.scoreCard}>
            <ScoreRing score={fitResult.fitScore} />
            <div className={styles.scoreLabel} style={{ color }}>{fitResult.label}</div>
            <div className={styles.scoreMeta}>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Seniority expected</span>
                <span className={styles.metaVal}>{fitResult.seniorityLevel}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Semantic overlap</span>
                <span className={styles.metaVal}>{fitResult.semanticOverlapScore}/100</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Missing keywords</span>
                <span className={styles.metaVal} style={{ color: '#ef4444' }}>
                  {fitResult.missingKeywords.filter(k => k.importance === 'required').length} required
                </span>
              </div>
            </div>

            <button
              className={styles.tailorBtn}
              onClick={() => setShowTemplatePicker(true)}
              disabled={isAtLimit('jdTailoring')}
              style={{ all: 'unset', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0.75rem 1rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 'var(--radius-xl)', color: 'white', fontWeight: 700, fontSize: 'var(--text-sm)', cursor: isAtLimit('jdTailoring') ? 'not-allowed' : 'pointer', opacity: isAtLimit('jdTailoring') ? 0.5 : 1, fontFamily: 'var(--font-sans)', transition: 'opacity 0.2s, transform 0.15s', boxSizing: 'border-box' }}
            >
              <Wand2 size={15} />
              Tailor My Resume
            </button>
            {isAtLimit('jdTailoring') && (
              <button style={{ all: 'unset', fontSize: '11px', color: '#818cf8', cursor: 'pointer', textAlign: 'center', fontFamily: 'var(--font-sans)' }} onClick={() => { setUpgradeFeature('jdTailoring'); setShowUpgradeModal(true) }}>
                Quota used — upgrade to tailor →
              </button>
            )}
            <div className={styles.quotaStrip}>
              <Zap size={11} />
              {remaining('jdTailoring') === 'Unlimited' ? 'Unlimited tailorings' : `${remaining('jdTailoring')} tailoring${remaining('jdTailoring') === 1 ? '' : 's'} left`}
            </div>
          </div>

          {/* Detail panels */}
          <div className={styles.detailsCard}>
            {/* Required skills */}
            <div className={styles.resultSection}>
              <h4 className={styles.resultSectionTitle}>
                <Target size={14} /> Required Skills
                <span className={`${styles.rsBadge} ${fitResult.requiredSkills.filter(s => !s.presentInResume).length > 0 ? styles.rsBadgeMissing : styles.rsBadgePresent}`}>
                  {fitResult.requiredSkills.filter(s => s.presentInResume).length}/{fitResult.requiredSkills.length} matched
                </span>
              </h4>
              <div className={styles.chips}>
                {fitResult.requiredSkills.map((s, i) => (
                  <span key={i} className={`${styles.chip} ${s.presentInResume ? styles.chipPresent : styles.chipMissing}`}>
                    {s.presentInResume ? <Check size={10} /> : <AlertTriangle size={10} />}
                    {s.skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred skills */}
            {fitResult.preferredSkills.length > 0 && (
              <div className={styles.resultSection}>
                <h4 className={styles.resultSectionTitle}>
                  <BarChart2 size={14} /> Preferred Skills
                </h4>
                <div className={styles.chips}>
                  {fitResult.preferredSkills.map((s, i) => (
                    <span key={i} className={`${styles.chip} ${s.presentInResume ? styles.chipPresent : styles.chipPreferred}`}>
                      {s.presentInResume ? <Check size={10} /> : <AlertTriangle size={10} />}
                      {s.skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Improvement suggestions */}
            {fitResult.improvementSuggestions.length > 0 && (
              <div className={styles.resultSection}>
                <h4 className={styles.resultSectionTitle}>
                  <Lightbulb size={14} /> Actionable Improvements
                </h4>
                <div className={styles.suggestionList}>
                  {fitResult.improvementSuggestions.map((s, i) => (
                    <div key={i} className={styles.suggestionRow}>
                      <div className={`${styles.suggestionRank} ${s.impact === 'high' ? styles.rankHigh : s.impact === 'medium' ? styles.rankMedium : styles.rankLow}`}>
                        {s.rank}
                      </div>
                      <div style={{ flex: 1 }}>
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

            {/* Missing keywords */}
            {fitResult.missingKeywords.filter(k => k.importance === 'required').length > 0 && (
              <div className={styles.resultSection}>
                <h4 className={styles.resultSectionTitle}>
                  <AlertTriangle size={14} /> Critical Missing Keywords
                </h4>
                <div className={styles.chips}>
                  {fitResult.missingKeywords.filter(k => k.importance === 'required').map((k, i) => (
                    <span key={i} className={`${styles.chip} ${styles.chipMissing}`} title={k.context}>
                      <AlertTriangle size={10} /> {k.keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Helmet>
        <link rel="canonical" href="https://careerforge.pro/jd-tailor" />
      </Helmet>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroBadge}><Zap size={10} /> AI-Powered</div>
        <h1 className={styles.heroTitle}>JD Score & Tailor</h1>
        <p className={styles.heroSub}>
          Get a detailed match score, identify skill gaps, and instantly generate a tailored resume — optimized for any job description.
        </p>
      </div>

      <div className={styles.main}>
        {/* Steps */}
        <div className={styles.steps}>
          {[
            { label: 'Provide Inputs', done: stage !== 'input', active: stage === 'input' },
            { label: 'Analyze Match', done: stage === 'results' || stage === 'tailoring', active: stage === 'analyzing' },
            { label: 'Tailor Resume', done: stage === 'tailoring', active: stage === 'results' },
          ].map((s, i) => (
            <div key={i} className={`${styles.step} ${s.active ? styles.stepActive : ''} ${s.done ? styles.stepDone : ''}`}>
              <div className={styles.stepNum}>
                {s.done ? <Check size={12} /> : i + 1}
              </div>
              <span className={styles.stepLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Input stage */}
        {(stage === 'input' || stage === 'analyzing') && (
          <>
            <div className={styles.inputGrid}>
              {renderResumePanel()}
              {renderJDPanel()}
            </div>

            {/* Analyze CTA */}
            <div className={styles.ctaBar}>
              <div className={styles.ctaMeta}>
                <div className={styles.ctaIconBox}><BarChart2 size={18} /></div>
                <div className={styles.ctaMetaText}>
                  <span className={styles.ctaLabel}>Ready to analyze your match?</span>
                  <span className={styles.ctaSub}>
                    Uses 1 JD Score credit ·{' '}
                    {remaining('jdScore') === 'Unlimited' ? 'Unlimited' : `${remaining('jdScore')} left`}
                  </span>
                </div>
              </div>
              <button
                className={styles.analyzeBtn}
                style={{ all: 'unset', display: 'flex', alignItems: 'center', gap: 8, minWidth: 160, padding: '0.75rem 2rem', borderRadius: 'var(--radius-xl)', background: canAnalyze ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'var(--surface-container-high)', color: canAnalyze ? 'white' : 'var(--on-surface-variant)', fontWeight: 700, fontSize: 'var(--text-sm)', cursor: canAnalyze ? 'pointer' : 'not-allowed', justifyContent: 'center', fontFamily: 'var(--font-sans)', transition: 'opacity 0.2s', boxSizing: 'border-box' }}
                onClick={handleAnalyze}
                disabled={!canAnalyze}
              >
                {stage === 'analyzing' ? (
                  <><Loader2 size={16} className={styles.spin} /> Analyzing…</>
                ) : (
                  <>Analyze Match <ChevronRight size={16} /></>
                )}
              </button>
            </div>
          </>
        )}

        {/* Results stage */}
        {stage === 'results' && renderResults()}

        {/* Tailoring in-progress */}
        {stage === 'tailoring' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem' }}>
            <Loader2 size={40} className={styles.spin} color="#6366f1" />
            <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--on-surface)' }}>Tailoring your resume…</p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--on-surface-variant)', maxWidth: 360, textAlign: 'center' }}>
              Our AI is rewriting your resume for this role, injecting relevant keywords and strengthening your bullets.
            </p>
          </div>
        )}
      </div>

      {/* Template Picker Modal */}
      {showTemplatePicker && (
        <div className={styles.modalOverlay} onClick={() => { if (!tailorMutation.isPending) setShowTemplatePicker(false) }}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            {!tailorMutation.isPending ? (
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
                        onClick={() => handleTailor(t.id)}
                      >
                        <div className={styles.templateThumb} style={{ '--c': t.color } as React.CSSProperties}>
                          <div className={styles.thumbLines}>
                            <div className={styles.tl} style={{ width: '60%' }} />
                            <div className={styles.tl} style={{ width: '40%', height: 3 }} />
                            {[80, 90, 70].map((w, i) => (
                              <div key={i} className={styles.tl} style={{ width: `${w}%`, opacity: 0.3 }} />
                            ))}
                          </div>
                        </div>
                        <span className={styles.templateName}>{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.modalLoadingOverlay}>
                <Loader2 size={40} className={styles.spin} color="#6366f1" />
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
    </div>
  )
}
