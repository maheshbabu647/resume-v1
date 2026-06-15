import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Save, Download, FileDown, Trash2, Loader2, Check, FileSignature, Target, Wand2 } from 'lucide-react'
import { apiClient } from '@/shared/lib/apiClient'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { UpgradeModal } from '@/shared/components/UpgradeModal/UpgradeModal'
import { AuthRequireModal } from '@/shared/components/AuthRequireModal/AuthRequireModal'
import pageStyles from './CoverLetterPage.module.css'
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
  keywordsUsed?: string[]
  updatedAt: string
}

type FormState = Pick<CoverLetterDoc, 'title' | 'subject' | 'recipientName' | 'companyName' | 'roleName'>

const REWRITE_PRESETS = [
  { id: 'concise', label: 'More concise', instruction: 'Make this paragraph more concise and punchy without losing key details.' },
  { id: 'confident', label: 'More confident', instruction: 'Rewrite this paragraph with a more confident, assertive tone.' },
  { id: 'enthusiastic', label: 'More enthusiastic', instruction: 'Rewrite this paragraph to sound more enthusiastic and passionate about the role.' },
  { id: 'simplify', label: 'Simplify language', instruction: 'Simplify the language in this paragraph, using shorter sentences and plainer words.' },
  { id: 'formal', label: 'More formal', instruction: 'Rewrite this paragraph in a more formal, polished register.' },
  { id: 'expand', label: 'Add more detail', instruction: 'Expand this paragraph slightly with more specific detail, staying strictly within the facts already given.' },
] as const

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export default function CoverLetterEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const user = useAuthStore(s => s.user)
  const [form, setForm] = useState<FormState | null>(null)
  const [paragraphs, setParagraphs] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const [rewritingIndex, setRewritingIndex] = useState<number | null>(null)
  const [presetByIndex, setPresetByIndex] = useState<Record<number, string>>({})
  const [pdfLoading, setPdfLoading] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

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
      setForm({
        title: data.title,
        subject: data.subject,
        recipientName: data.recipientName,
        companyName: data.companyName,
        roleName: data.roleName,
      })
      setParagraphs(data.body.split(/\n\n+/))
    }
  }, [data])

  const body = paragraphs.join('\n\n')

  const isDirty = !!data && !!form && (
    form.title !== data.title ||
    form.subject !== data.subject ||
    form.recipientName !== data.recipientName ||
    form.companyName !== data.companyName ||
    form.roleName !== data.roleName ||
    body !== data.body
  )

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!form) return
      const wordCount = body.trim().split(/\s+/).filter(Boolean).length
      const res = await apiClient.patch(`/cover-letters/${id}`, { ...form, body, wordCount })
      return res.data.data as CoverLetterDoc
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['coverLetter', id], updated)
      queryClient.invalidateQueries({ queryKey: ['coverLetters'] })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async () => apiClient.delete(`/cover-letters/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverLetters'] })
      navigate('/dashboard')
    }
  })

  const rewriteMutation = useMutation({
    mutationFn: async ({ index, instruction }: { index: number; instruction: string }) => {
      const res = await apiClient.post('/ai/cover-letter/rewrite-paragraph', {
        paragraph: paragraphs[index],
        instruction,
        tone: data?.tone,
      })
      return { index, rewritten: res.data.data.rewritten as string }
    },
    onMutate: ({ index }) => setRewritingIndex(index),
    onSuccess: ({ index, rewritten }) => {
      setParagraphs(prev => prev.map((p, i) => (i === index ? rewritten.trim() : p)))
    },
    onError: (err: any) => {
      const code = err?.response?.data?.error?.code ?? err?.response?.data?.code
      if (code === 'QUOTA_EXCEEDED') setShowUpgradeModal(true)
    },
    onSettled: () => setRewritingIndex(null),
  })

  const handleRewrite = (index: number) => {
    if (!isAuthenticated) { setShowAuthModal(true); return }
    const presetId = presetByIndex[index] ?? REWRITE_PRESETS[0].id
    const preset = REWRITE_PRESETS.find(p => p.id === presetId) ?? REWRITE_PRESETS[0]
    rewriteMutation.mutate({ index, instruction: preset.instruction })
  }

  const handleDownload = () => {
    if (!form) return
    const content = `Subject: ${form.subject}\n\nDear ${form.recipientName},\n\n${body}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.title || 'Cover Letter'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadPDF = async () => {
    if (!form) return
    if (!isAuthenticated) { setShowAuthModal(true); return }
    setPdfLoading(true)
    try {
      const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
      const paragraphsHtml = paragraphs
        .filter(p => p.trim())
        .map(p => `<p>${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`)
        .join('')
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /><style>
        @page { size: A4; margin: 25mm 22mm; }
        body { font-family: Georgia, 'Times New Roman', serif; color: #1f2430; font-size: 12pt; line-height: 1.7; }
        .letterhead { border-bottom: 3px solid #6366f1; padding-bottom: 12px; margin-bottom: 28px; }
        .letterhead h1 { margin: 0; font-size: 20pt; letter-spacing: 0.04em; color: #1f2430; }
        .letterhead .contact { margin-top: 4px; font-size: 10pt; color: #555; }
        .date { margin-bottom: 18px; font-size: 11pt; color: #555; }
        .recipient { margin-bottom: 4px; }
        .subject { margin-bottom: 18px; font-weight: bold; }
        p { margin: 0 0 14px; }
        .signoff { margin-top: 24px; }
      </style></head><body>
        <div class="letterhead">
          <h1>${escapeHtml(user?.name ?? '')}</h1>
          <div class="contact">${escapeHtml(user?.email ?? '')}</div>
        </div>
        <div class="date">${today}</div>
        <div class="subject">Re: ${escapeHtml(form.subject)}</div>
        <div class="recipient">Dear ${escapeHtml(form.recipientName || 'Hiring Manager')},</div>
        ${paragraphsHtml}
        <div class="signoff">Sincerely,<br/>${escapeHtml(user?.name ?? '')}</div>
      </body></html>`

      const res = await apiClient.post(
        '/export/pdf',
        { resumeId: null, html, filename: `${form.title || 'Cover Letter'}.pdf` },
        { responseType: 'blob' }
      )
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `${form.title || 'Cover Letter'}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      queryClient.invalidateQueries({ queryKey: ['usage'] })
    } catch (err: any) {
      if (err?.response?.data instanceof Blob && err.response.data.type === 'application/json') {
        const text = await err.response.data.text()
        const errorData = JSON.parse(text)?.error
        if (errorData?.code === 'QUOTA_EXCEEDED') { setShowUpgradeModal(true); return }
      }
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setPdfLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className={pageStyles.page}>
        <div className={pageStyles.generatingWrap}>
          <Loader2 size={36} className={pageStyles.spin} color="#818cf8" />
          <p className={pageStyles.generatingTitle}>Loading your cover letter…</p>
        </div>
      </div>
    )
  }

  if (isError || !data || !form) {
    return (
      <div className={pageStyles.page}>
        <div className={pageStyles.generatingWrap}>
          <p className={pageStyles.generatingTitle}>Cover letter not found</p>
          <Link to="/dashboard" className={pageStyles.actionBtn}>Back to dashboard</Link>
        </div>
      </div>
    )
  }

  const wordCount = body.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className={pageStyles.page}>
      <Helmet>
        <title>{form.title || 'Cover Letter'} · CareerForge</title>
      </Helmet>

      <div className={styles.header}>
        <Link to="/dashboard" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
        <input
          className={styles.titleInput}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Cover letter title"
        />
        <span className={styles.updatedAt}>
          Last saved {new Date(data.updatedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
        </span>
      </div>

      <div className={styles.editorLayout}>
        {/* ── Left pane: letter details + actions ── */}
        <aside className={styles.sidebarLeft}>
          <div className={pageStyles.card}>
            <div className={pageStyles.cardHeader}>
              <div className={pageStyles.cardIcon}><FileSignature size={16} /></div>
              <div>
                <h3 className={pageStyles.cardTitle}>Letter Details</h3>
                <p className={pageStyles.cardSub}>{form.roleName || 'Role'} at {form.companyName || 'Company'}</p>
              </div>
            </div>
            <div className={styles.fieldStack}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Email Subject</span>
                <input className={styles.fieldInput} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Recipient Name</span>
                <input className={styles.fieldInput} value={form.recipientName} onChange={(e) => setForm({ ...form, recipientName: e.target.value })} />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Company Name</span>
                <input className={styles.fieldInput} value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Role Name</span>
                <input className={styles.fieldInput} value={form.roleName} onChange={(e) => setForm({ ...form, roleName: e.target.value })} />
              </label>
            </div>
          </div>

          <div className={pageStyles.card}>
            <div className={styles.sidebarActions}>
              <button
                className={`${pageStyles.actionBtn} ${pageStyles.actionBtnPrimary}`}
                onClick={() => saveMutation.mutate()}
                disabled={!isDirty || saveMutation.isPending}
              >
                {saveMutation.isPending ? <Loader2 size={14} className={pageStyles.spin} /> : saved ? <Check size={14} /> : <Save size={14} />}
                {saveMutation.isPending ? 'Saving…' : saved ? 'Saved' : isDirty ? 'Save changes' : 'Saved'}
              </button>
              <button className={pageStyles.actionBtn} onClick={handleDownloadPDF} disabled={pdfLoading}>
                {pdfLoading ? <Loader2 size={14} className={pageStyles.spin} /> : <FileDown size={14} />}
                {pdfLoading ? 'Generating…' : 'Download PDF'}
              </button>
              <button className={pageStyles.actionBtn} onClick={handleDownload}>
                <Download size={14} /> Download .txt
              </button>
              <button
                className={`${pageStyles.actionBtn} ${styles.dangerBtn}`}
                onClick={() => { if (confirm('Delete this cover letter? This cannot be undone.')) deleteMutation.mutate() }}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? <Loader2 size={14} className={pageStyles.spin} /> : <Trash2 size={14} />}
                Delete
              </button>
            </div>
          </div>
        </aside>

        {/* ── Center pane: letter body, editable per paragraph ── */}
        <main className={styles.editorCenter}>
          <div className={pageStyles.letterCard}>
            <div className={pageStyles.letterHeader}>
              <div className={pageStyles.letterSubjectRow}>
                <span className={pageStyles.letterSubjectLabel}>Letter Body</span>
                <span className={pageStyles.resultsBarSub}>{wordCount} words · {data.tone} tone</span>
              </div>
            </div>
            <div className={styles.paragraphList}>
              {paragraphs.map((para, i) => (
                <div key={i} className={styles.paragraphBlock}>
                  <textarea
                    className={styles.paragraphTextarea}
                    value={para}
                    onChange={(e) => setParagraphs(prev => prev.map((p, idx) => (idx === i ? e.target.value : p)))}
                    rows={Math.max(3, Math.ceil(para.length / 70))}
                  />
                  <div className={styles.paragraphToolbar}>
                    <select
                      className={styles.paragraphSelect}
                      value={presetByIndex[i] ?? REWRITE_PRESETS[0].id}
                      onChange={(e) => setPresetByIndex(prev => ({ ...prev, [i]: e.target.value }))}
                    >
                      {REWRITE_PRESETS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                    </select>
                    <button
                      className={styles.rewriteBtn}
                      onClick={() => handleRewrite(i)}
                      disabled={rewritingIndex === i && rewriteMutation.isPending}
                    >
                      {rewritingIndex === i && rewriteMutation.isPending
                        ? <Loader2 size={13} className={pageStyles.spin} />
                        : <Wand2 size={13} />}
                      Rewrite with AI
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* ── Right pane: quality panel ── */}
        <aside className={styles.sidebarRight}>
          {!!data.keywordsUsed?.length && (
            <div className={pageStyles.card}>
              <div className={pageStyles.cardHeader}>
                <div className={pageStyles.cardIcon} style={{ background: 'rgba(34,197,94,0.12)', color: '#16a34a' }}>
                  <Target size={16} />
                </div>
                <div>
                  <h3 className={pageStyles.cardTitle}>JD Match Quality</h3>
                  <p className={pageStyles.cardSub}>Keywords from the job description woven into this letter</p>
                </div>
              </div>
              <div className={pageStyles.letterMetaTags}>
                {data.keywordsUsed.map((kw, i) => (
                  <span key={i} className={pageStyles.letterTag} style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.2)', color: '#16a34a' }}>
                    <Check size={11} style={{ marginRight: 4, verticalAlign: '-1px' }} />{kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
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
        subtitle="Sign in to access your resumes and continue editing your cover letter."
      />
    </div>
  )
}
