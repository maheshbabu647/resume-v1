import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, Sparkles, Copy, Download, FileDown, Trash2, Save, Loader2, Check } from 'lucide-react'
import { apiClient } from '@/shared/lib/apiClient'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { UpgradeModal } from '@/shared/components/UpgradeModal/UpgradeModal'
import { AuthRequireModal } from '@/shared/components/AuthRequireModal/AuthRequireModal'
import styles from './CoverLetterEditPage.module.css'

interface CoverLetterDoc {
  _id: string
  title: string
  subject: string
  recipientName: string
  companyName: string
  roleName: string
  body: string
  tone: string
  wordCount: number
  updatedAt: string
}

// Passed by CoverLetterPage when navigating after generation, so
// "Generate another version" can pre-fill the input form.
interface EditNavState {
  resumeText?: string
  jdText?: string
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export default function CoverLetterEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const navState = (location.state as EditNavState | null) ?? null
  const queryClient = useQueryClient()
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const user = useAuthStore(s => s.user)

  const [title, setTitle]   = useState('')
  const [body, setBody]     = useState('')
  const [copied, setCopied] = useState(false)
  const [justSaved, setJustSaved]   = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showAuthModal, setShowAuthModal]       = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['coverLetter', id],
    queryFn: async () => {
      const res = await apiClient.get(`/cover-letters/${id}`)
      return res.data.data as CoverLetterDoc
    },
    enabled: !!id,
  })

  useEffect(() => {
    if (data) {
      setTitle(data.title)
      setBody(data.body)
    }
  }, [data])

  const isDirty = !!data && (title !== data.title || body !== data.body)

  // ── Save mutation ─────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async () => {
      const wordCount = body.trim().split(/\s+/).filter(Boolean).length
      const res = await apiClient.patch(`/cover-letters/${id}`, { title, body, wordCount })
      return res.data.data as CoverLetterDoc
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['coverLetter', id], updated)
      queryClient.invalidateQueries({ queryKey: ['coverLetters'] })
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 2500)
    },
  })

  // ── Delete mutation ───────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: async () => apiClient.delete(`/cover-letters/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverLetters'] })
      navigate('/cover-letter')
    },
  })

  // ── Copy ──────────────────────────────────────────────────────────────────
  const handleCopy = async () => {
    await navigator.clipboard.writeText(body)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  // ── Download .txt ─────────────────────────────────────────────────────────
  const handleDownloadTxt = () => {
    if (!data) return
    const content = `Subject: ${data.subject}\n\nDear ${data.recipientName || 'Hiring Manager'},\n\n${body}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title || 'Cover Letter'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Download PDF ──────────────────────────────────────────────────────────
  const handleDownloadPdf = async () => {
    if (!data) return
    if (!isAuthenticated) { setShowAuthModal(true); return }
    setPdfLoading(true)
    try {
      const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
      const paragraphsHtml = body
        .split(/\n\n+/)
        .filter(p => p.trim())
        .map(p => `<p>${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`)
        .join('')
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
        @page{size:A4;margin:25mm 22mm}
        body{font-family:Georgia,'Times New Roman',serif;color:#1f2430;font-size:12pt;line-height:1.7}
        .lh{border-bottom:3px solid #6366f1;padding-bottom:12px;margin-bottom:28px}
        .lh h1{margin:0;font-size:20pt;color:#1f2430}
        .lh .c{margin-top:4px;font-size:10pt;color:#555}
        .date{margin-bottom:18px;font-size:11pt;color:#555}
        .sub{margin-bottom:18px;font-weight:bold}
        p{margin:0 0 14px}
        .sig{margin-top:24px}
      </style></head><body>
        <div class="lh"><h1>${escapeHtml(user?.name ?? '')}</h1><div class="c">${escapeHtml(user?.email ?? '')}</div></div>
        <div class="date">${today}</div>
        <div class="sub">Re: ${escapeHtml(data.subject)}</div>
        <div>Dear ${escapeHtml(data.recipientName || 'Hiring Manager')},</div>
        ${paragraphsHtml}
        <div class="sig">Sincerely,<br/>${escapeHtml(user?.name ?? '')}</div>
      </body></html>`
      const res = await apiClient.post(
        '/export/pdf',
        { resumeId: null, html, filename: `${title || 'Cover Letter'}.pdf` },
        { responseType: 'blob' }
      )
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `${title || 'Cover Letter'}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      queryClient.invalidateQueries({ queryKey: ['usage'] })
    } catch (err: any) {
      if (err?.response?.data instanceof Blob && err.response.data.type === 'application/json') {
        const text = await err.response.data.text()
        const parsed = JSON.parse(text)?.error
        if (parsed?.code === 'QUOTA_EXCEEDED') { setShowUpgradeModal(true); return }
      }
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setPdfLoading(false)
    }
  }

  // ── Loading / error states ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.stateWrap}>
          <Loader2 size={32} className={styles.spin} color="var(--brand)" />
          <p className={styles.stateText}>Loading your cover letter…</p>
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className={styles.page}>
        <div className={styles.stateWrap}>
          <p className={styles.stateText}>Cover letter not found.</p>
          <Link to="/cover-letter" className={styles.backLink}>
            <ChevronLeft size={15} /> Back to Cover Letters
          </Link>
        </div>
      </div>
    )
  }

  const wordCount = body.trim().split(/\s+/).filter(Boolean).length

  // Save button label / state
  const saveLabel = saveMutation.isPending ? 'Saving…' : justSaved ? 'Saved' : isDirty ? 'Save changes' : 'Saved'
  const saveIcon  = saveMutation.isPending
    ? <Loader2 size={14} className={styles.spin} />
    : (justSaved || !isDirty) ? <Check size={14} /> : <Save size={14} />

  return (
    <div className={styles.page}>
      <Helmet>
        <title>{title || 'Cover Letter'} · CareerForge</title>
      </Helmet>

      {/* Back + title */}
      <div className={styles.topBar}>
        <Link to="/cover-letter" className={styles.backLink}>
          <ChevronLeft size={15} /> Cover Letters
        </Link>
        <input
          className={styles.titleInput}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Cover letter title"
        />
      </div>

      {/* Action bar — identical layout to what results view had */}
      <div className={styles.actionBar}>
        <button
          className={styles.actionBtn}
          onClick={() => navigate('/cover-letter', { state: navState ?? undefined })}
        >
          <Sparkles size={14} /> Generate another version
        </button>
        <button className={styles.actionBtn} onClick={handleDownloadPdf} disabled={pdfLoading}>
          {pdfLoading ? <Loader2 size={14} className={styles.spin} /> : <FileDown size={14} />}
          Download PDF
        </button>
        <button className={styles.actionBtn} onClick={handleDownloadTxt}>
          <Download size={14} /> Download .txt
        </button>
        <button
          className={`${styles.actionBtn} ${copied ? styles.actionBtnCopied : ''}`}
          onClick={handleCopy}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>

        {/* Save — primary, shows dirty state clearly */}
        <button
          className={`${styles.actionBtnSave} ${isDirty ? styles.actionBtnSaveDirty : ''} ${justSaved ? styles.actionBtnSaveDone : ''}`}
          onClick={() => saveMutation.mutate()}
          disabled={!isDirty || saveMutation.isPending}
        >
          {saveIcon} {saveLabel}
        </button>

        <button
          className={styles.actionBtnDelete}
          onClick={() => { if (confirm('Delete this cover letter? This cannot be undone.')) deleteMutation.mutate() }}
          disabled={deleteMutation.isPending}
          title="Delete"
        >
          {deleteMutation.isPending ? <Loader2 size={14} className={styles.spin} /> : <Trash2 size={14} />}
        </button>
      </div>

      {/* Unsaved indicator */}
      {isDirty && (
        <div className={styles.unsavedBanner}>
          <span className={styles.unsavedDot} /> Unsaved changes — click <strong>Save changes</strong> to keep them
        </div>
      )}

      {/* Meta tags */}
      {(data.subject || data.roleName || data.companyName || data.tone) && (
        <div className={styles.metaRow}>
          {data.subject && (
            <span className={styles.metaSubject}><strong>Re:</strong> {data.subject}</span>
          )}
          {data.roleName && data.companyName && (
            <span className={styles.metaTag}>{data.roleName} · {data.companyName}</span>
          )}
          {data.tone && (
            <span className={styles.metaTag} style={{ textTransform: 'capitalize' }}>{data.tone}</span>
          )}
        </div>
      )}

      {/* Letter card */}
      <div className={styles.letterCard}>
        <div className={styles.letterSalutation}>
          Dear {data.recipientName || 'Hiring Manager'},
        </div>
        <textarea
          className={styles.bodyTextarea}
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Your cover letter body…"
        />
        <div className={styles.letterFooter}>
          <span className={styles.wordCount}>{wordCount} words</span>
          <span className={styles.lastSaved}>
            {isDirty
              ? 'Unsaved changes'
              : `Saved ${new Date(data.updatedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`}
          </span>
        </div>
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
        subtitle="Sign in to download your cover letter as PDF."
      />
    </div>
  )
}
