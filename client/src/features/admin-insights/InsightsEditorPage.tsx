// ============================================================
// InsightsEditorPage.tsx — Admin article editor (/admin/insights/:id)
// Ported from career_forge_new_design/cfp-insights-editor.jsx
// Ghost/Medium-style writing surface wired to /v1/admin/articles.
// New articles author rich HTML; migrated markdown articles are
// edited as raw markdown to stay lossless.
// ============================================================

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuthStore } from '@/core/auth/useAuthStore'
import {
  useAdminArticle,
  useCreateArticle,
  useUpdateArticle,
  usePublishArticle,
  useArchiveArticle,
  type ArticleInput,
  type ArticleStatus,
} from '@/features/blog/articlesApi'
import styles from './InsightsEditor.module.css'

// ── Categories (primary tag) ────────────────────────────────────
export const INSIGHT_CATEGORIES = [
  { id: 'resume', label: 'Resume Tips', col: '#5046E4' },
  { id: 'ats', label: 'ATS Hacks', col: '#FF5C35' },
  { id: 'interview', label: 'Interview Prep', col: '#7C3AED' },
  { id: 'job-search', label: 'Job Search', col: '#0891B2' },
  { id: 'career-stories', label: 'Career Stories', col: '#16A34A' },
  { id: 'salary', label: 'Salary Negotiation', col: '#F59E0B' },
] as const

type CategoryId = (typeof INSIGHT_CATEGORIES)[number]['id']

// ── Block / heading formats (Paragraph + the levels we style on the article page) ──
const HEADING_OPTIONS: Array<{ tag: 'p' | 'h2' | 'h3'; label: string; shortLabel: string }> = [
  { tag: 'p', label: 'Paragraph', shortLabel: '¶' },
  { tag: 'h2', label: 'Heading', shortLabel: 'H2' },
  { tag: 'h3', label: 'Subheading', shortLabel: 'H3' },
]

type ActiveFormats = { block: string; bold: boolean; italic: boolean; ul: boolean; ol: boolean }
const DEFAULT_ACTIVE_FORMATS: ActiveFormats = { block: 'p', bold: false, italic: false, ul: false, ol: false }

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
}

// ── Icons ───────────────────────────────────────────────────────
function EIcon({ name, size = 18, color = 'currentColor', sw = 1.7 }: { name: string; size?: number; color?: string; sw?: number }) {
  const p: Record<string, React.ReactElement> = {
    arrowL: <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>,
    arrow: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
    check: <polyline points="5 12 10 17 20 7" />,
    x: <><line x1="6" y1="6" x2="18" y2="18" /><line x1="6" y1="18" x2="18" y2="6" /></>,
    bold: <><path d="M6 4h8a4 4 0 010 8H6z" /><path d="M6 12h9a4 4 0 010 8H6z" /></>,
    italic: <><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></>,
    h2: <><path d="M4 6v12M4 12h8M12 6v12" /><path d="M17 18c0-2 4-2.5 4-5 0-1.5-1.5-2-2.5-1.2" /></>,
    quote: <><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /></>,
    list: <><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="3.5" cy="6" r="1" /><circle cx="3.5" cy="12" r="1" /><circle cx="3.5" cy="18" r="1" /></>,
    listOl: <><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4M4 10h2M6 18H4l2-2.5a1 1 0 00-2-1.2" /></>,
    link: <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></>,
    divider: <line x1="3" y1="12" x2="21" y2="12" />,
    sparkle: <path d="M12 3l1.5 5L19 9.5 13.5 11 12 16l-1.5-5L5 9.5 10.5 8z" />,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 008 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H2a2 2 0 010-4h.09A1.65 1.65 0 004.6 8a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V2a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H22a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    chevD: <polyline points="6 9 12 15 18 9" />,
    clock: <><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></>,
    cta: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M8 12h8" /><path d="M13 9l3 3-3 3" /></>,
    steps: <><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4M4 10h2M6 18H4l2-2.5a1 1 0 00-2-1.2" /></>,
    info: <><circle cx="12" cy="12" r="9" /><line x1="12" y1="11" x2="12" y2="16" /><circle cx="12" cy="8" r="0.5" fill="currentColor" /></>,
    table: <><rect x="3" y="4" width="18" height="16" rx="1.5" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="3" y1="16" x2="21" y2="16" /><line x1="9.5" y1="4" x2="9.5" y2="20" /><line x1="15" y1="4" x2="15" y2="20" /></>,
    code: <><polyline points="8 6 3 12 8 18" /><polyline points="16 6 21 12 16 18" /></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {p[name]}
    </svg>
  )
}

// ── Auto-growing textarea ───────────────────────────────────────
function TextareaAuto({ value, onChange, placeholder, className }: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  className: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = ref.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${el.scrollHeight}px`
    }
  }, [value])
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={1}
      className={className}
    />
  )
}

// ── Info tooltip (hover/focus reveals best-practice guidance) ────
function InfoTip({ text }: { text: string }) {
  return (
    <span className={styles.infoTip} tabIndex={0}>
      <EIcon name="info" size={13} color="var(--muted-2)" sw={2} />
      <span className={styles.infoTipBubble}>{text}</span>
    </span>
  )
}

// ── Settings group ──────────────────────────────────────────────
function Group({ label, sub, tip, children }: { label: string; sub?: string; tip?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className={`${styles.groupLabel} ${sub ? styles.groupLabelTight : ''}`}>
        {label}
        {tip && <InfoTip text={tip} />}
      </div>
      {sub && <div className={styles.groupSub}>{sub}</div>}
      {children}
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────
export default function InsightsEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = !id || id === 'new'
  const user = useAuthStore((s) => s.user)

  const { data: article, isLoading } = useAdminArticle(isNew ? undefined : id)
  const createArticle = useCreateArticle()
  const updateArticle = useUpdateArticle()
  const publishArticle = usePublishArticle()
  const archiveArticle = useArchiveArticle()

  // ── Editor state ──
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')          // → excerpt
  const [categoryId, setCategoryId] = useState<CategoryId>('resume')
  const [extraTags, setExtraTags] = useState('')         // comma-separated
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [shortTitle, setShortTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [series, setSeries] = useState('')
  const [seriesDay, setSeriesDay] = useState('')
  const [status, setStatus] = useState<ArticleStatus>('draft')
  const [contentFormat, setContentFormat] = useState<'markdown' | 'html'>('html')
  const [markdownBody, setMarkdownBody] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [focusKeyword, setFocusKeyword] = useState('')
  const [featured, setFeatured] = useState(false)

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const [insertOpen, setInsertOpen] = useState(false)
  const [headingOpen, setHeadingOpen] = useState(false)
  const [activeFormats, setActiveFormats] = useState<ActiveFormats>(DEFAULT_ACTIVE_FORMATS)
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved')
  const [words, setWords] = useState(0)
  const [bodyEmpty, setBodyEmpty] = useState(true)

  const bodyRef = useRef<HTMLDivElement>(null)
  const hydratedRef = useRef(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savingRef = useRef(false)

  const cat = INSIGHT_CATEGORIES.find((c) => c.id === categoryId) ?? INSIGHT_CATEGORIES[0]
  const readTime = Math.max(1, Math.round(words / 220))
  const effectiveSlug = slugTouched && slug ? slug : slugify(title) || 'untitled-article'
  const authorName = user?.name ?? 'Admin'

  // ── Hydrate from an existing article ──
  useEffect(() => {
    if (!article || hydratedRef.current) return
    hydratedRef.current = true

    setTitle(article.title)
    setSubtitle(article.excerpt)
    setSlug(article.slug)
    setSlugTouched(true)
    setShortTitle(article.shortTitle)
    setMetaDescription(article.metaDescription)
    setSeries(article.series ?? '')
    setSeriesDay(article.seriesDay ? String(article.seriesDay) : '')
    setStatus(article.status)
    setContentFormat(article.contentFormat)
    setCoverImageUrl(article.ogImage ?? article.coverImage ?? '')
    setFeatured(article.tags.includes('Featured'))

    const matched = INSIGHT_CATEGORIES.find((c) => article.tags.includes(c.label))
    if (matched) setCategoryId(matched.id)
    setExtraTags(article.tags.filter((t) => t !== matched?.label && t !== 'Featured').join(', '))

    if (article.contentFormat === 'markdown') {
      setMarkdownBody(article.content)
      setWords(article.content.trim() ? article.content.trim().split(/\s+/).length : 0)
      setBodyEmpty(!article.content.trim())
    } else if (bodyRef.current) {
      bodyRef.current.innerHTML = article.content
      const text = bodyRef.current.textContent ?? ''
      setWords(text.trim() ? text.trim().split(/\s+/).length : 0)
      setBodyEmpty(!text.trim())
    }
  }, [article])

  // Seed an empty paragraph for new HTML articles
  useEffect(() => {
    if (contentFormat === 'html' && bodyRef.current && !bodyRef.current.innerHTML.trim()) {
      bodyRef.current.innerHTML = '<p><br/></p>'
    }
  }, [contentFormat])

  // ── Content getters ──
  const getContent = useCallback((): string => {
    if (contentFormat === 'markdown') return markdownBody
    return bodyRef.current?.innerHTML ?? ''
  }, [contentFormat, markdownBody])

  const getBodyText = useCallback((): string => {
    if (contentFormat === 'markdown') return markdownBody
    return bodyRef.current?.textContent ?? ''
  }, [contentFormat, markdownBody])

  // ── Save ──
  const buildPayload = useCallback((): ArticleInput | null => {
    const bodyText = getBodyText().trim()
    const content = getContent()
    if (title.trim().length < 3 || !bodyText) return null

    const excerpt = (subtitle.trim().length >= 10 ? subtitle.trim() : bodyText.slice(0, 180)).slice(0, 300)
    if (excerpt.length < 10) return null

    const tags = [
      cat.label,
      ...(featured ? ['Featured'] : []),
      ...extraTags.split(',').map((t) => t.trim()).filter(Boolean),
    ]

    return {
      slug: effectiveSlug,
      title: title.trim(),
      shortTitle: (shortTitle.trim() || title.trim()).slice(0, 200),
      excerpt,
      content,
      contentFormat,
      metaDescription: (metaDescription.trim().length >= 10 ? metaDescription.trim() : excerpt).slice(0, 300),
      readingTime: readTime,
      tags,
      ...(coverImageUrl.trim() && { ogImage: coverImageUrl.trim(), coverImage: coverImageUrl.trim() }),
      ...(series.trim() && { series: series.trim() }),
      ...(seriesDay && Number(seriesDay) > 0 && { seriesDay: Number(seriesDay) }),
    }
  }, [title, subtitle, shortTitle, metaDescription, series, seriesDay, cat.label, featured, extraTags, effectiveSlug, contentFormat, readTime, coverImageUrl, getContent, getBodyText])

  const save = useCallback(async (): Promise<string | null> => {
    if (savingRef.current) return null
    const payload = buildPayload()
    if (!payload) return null

    savingRef.current = true
    setSaveState('saving')
    try {
      if (isNew && !article) {
        const created = await createArticle.mutateAsync({ ...payload, status: 'draft' })
        setSaveState('saved')
        navigate(`/admin/insights/${created._id}`, { replace: true })
        return created._id
      }
      const targetId = article?._id ?? id!
      await updateArticle.mutateAsync({ id: targetId, body: payload })
      setSaveState('saved')
      return targetId
    } catch (err) {
      console.error('Save failed:', err)
      setSaveState('error')
      return null
    } finally {
      savingRef.current = false
    }
  }, [buildPayload, isNew, article, id, createArticle, updateArticle, navigate])

  // Debounced autosave on any edit
  const touch = useCallback(() => {
    setSaveState('unsaved')
    const text = getBodyText()
    setWords(text.trim() ? text.trim().split(/\s+/).length : 0)
    setBodyEmpty(!text.trim())
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => { void save() }, 2000)
  }, [getBodyText, save])

  useEffect(() => () => { if (saveTimer.current) clearTimeout(saveTimer.current) }, [])

  // ── Publish / archive ──
  const handlePublish = async () => {
    setPublishOpen(false)
    const targetId = await save()
    const finalId = targetId ?? article?._id ?? (isNew ? null : id!)
    if (!finalId) return
    try {
      await publishArticle.mutateAsync(finalId)
      setStatus('published')
    } catch (err) {
      console.error('Publish failed:', err)
      setSaveState('error')
    }
  }

  const handleArchive = async () => {
    setPublishOpen(false)
    const targetId = article?._id ?? (isNew ? null : id!)
    if (!targetId) return
    try {
      await archiveArticle.mutateAsync(targetId)
      setStatus('archived')
    } catch (err) {
      console.error('Archive failed:', err)
    }
  }

  // ── Active-format tracking (shows current block/inline style in the toolbar) ──
  const savedRangeRef = useRef<Range | null>(null)

  const updateActiveFormats = useCallback(() => {
    if (!bodyRef.current) return
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0 || !bodyRef.current.contains(sel.anchorNode)) return

    savedRangeRef.current = sel.getRangeAt(0).cloneRange()

    let blockTag = 'p'
    try {
      const fb = document.queryCommandValue('formatBlock')
      if (fb) blockTag = fb.toLowerCase()
    } catch { /* unsupported */ }

    let bold = false, italic = false, ul = false, ol = false
    try { bold = document.queryCommandState('bold') } catch { /* unsupported */ }
    try { italic = document.queryCommandState('italic') } catch { /* unsupported */ }
    try { ul = document.queryCommandState('insertUnorderedList') } catch { /* unsupported */ }
    try { ol = document.queryCommandState('insertOrderedList') } catch { /* unsupported */ }

    setActiveFormats({ block: blockTag, bold, italic, ul, ol })
  }, [])

  useEffect(() => {
    document.addEventListener('selectionchange', updateActiveFormats)
    return () => document.removeEventListener('selectionchange', updateActiveFormats)
  }, [updateActiveFormats])

  // ── ContentEditable commands ──
  // Toolbar/menu buttons steal focus from the editor before their click
  // handler runs, which collapses the selection. Restore the cursor to
  // where it last was inside the editor before running execCommand, so
  // insertions land at the right spot (e.g. a pull quote nested inside
  // the quote the user was editing).
  const restoreSelection = () => {
    const root = bodyRef.current
    if (!root) return
    root.focus()
    const range = savedRangeRef.current
    if (!range || !root.contains(range.startContainer)) return
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
  }
  const cmd = (command: string, value?: string) => {
    restoreSelection()
    document.execCommand(command, false, value)
    touch()
    updateActiveFormats()
  }
  const block = (tag: string) => {
    restoreSelection()
    document.execCommand('formatBlock', false, tag)
    touch()
    updateActiveFormats()
  }
  const insertHTML = (html: string) => {
    restoreSelection()
    document.execCommand('insertHTML', false, html)
    setInsertOpen(false)
    touch()
    updateActiveFormats()
  }
  const insertImage = () => {
    const url = prompt('Image URL:')
    if (!url || !url.trim()) { setInsertOpen(false); return }
    const alt = prompt('Alt text (describe the image for search engines & accessibility):') ?? ''
    insertHTML(`<figure data-img="1"><img src="${url.trim()}" alt="${alt.trim().replace(/"/g, '&quot;')}"/><figcaption>Add a caption…</figcaption></figure><p><br/></p>`)
  }

  // Clicking in the empty space below the content (the contentEditable root
  // itself), or on "dead" container chrome of a block element (the steps
  // wrapper, a step row, a CTA, a figure, a list itself rather than an
  // item), drops the cursor into a normal paragraph right after that block —
  // this is how you "step out" of a quote, list, heading, CTA, steps, etc.
  // and resume regular body text. Enter is left to behave natively
  // everywhere else, so nested elements (e.g. a pull quote inside a quote)
  // can still be inserted normally.
  const ESCAPABLE_SELECTOR = 'div[data-steps], .ie-step, .ie-step-b, div[data-cta], figure[data-img], ul, ol, hr'

  const handleBodyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const root = bodyRef.current
    if (!root) return

    const clicked = e.target as Element
    let anchor: Element | null = null

    if (clicked === root) {
      anchor = root.lastElementChild
      if (!anchor) return
    } else if (clicked.matches?.(ESCAPABLE_SELECTOR)) {
      let el: Element | null = clicked
      while (el && el.parentElement !== root) el = el.parentElement
      anchor = el
    } else {
      return
    }
    if (!anchor) return

    const anchorIsEmptyParagraph = anchor.tagName === 'P' && (anchor.textContent ?? '').trim() === ''
    const next = anchor.nextElementSibling
    const nextIsEmptyParagraph = !!next && next.tagName === 'P' && (next.textContent ?? '').trim() === ''

    let target: Element
    if (anchorIsEmptyParagraph) {
      target = anchor
    } else if (nextIsEmptyParagraph) {
      target = next!
    } else {
      const p = document.createElement('p')
      p.innerHTML = '<br>'
      anchor.insertAdjacentElement('afterend', p)
      target = p
      touch()
    }

    const range = document.createRange()
    range.selectNodeContents(target)
    range.collapse(false)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
    root.focus()
    updateActiveFormats()
  }

  // Enter inside a blockquote should extend the same quote with a new line
  // rather than splitting into a separate <blockquote> (the browser default).
  const handleBodyKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter' || e.shiftKey) return
    const root = bodyRef.current
    if (!root) return
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return
    const node = sel.anchorNode
    if (!node) return
    const el = node instanceof Element ? node : node.parentElement
    const bq = el?.closest('blockquote')
    if (bq && root.contains(bq)) {
      e.preventDefault()
      document.execCommand('insertHTML', false, '<br>')
      touch()
      updateActiveFormats()
    }
  }

  const tools = [
    { icon: 'bold', tip: 'Bold (Ctrl+B)', fn: () => cmd('bold'), active: activeFormats.bold },
    { icon: 'italic', tip: 'Italic (Ctrl+I)', fn: () => cmd('italic'), active: activeFormats.italic },
    { divider: true },
    { icon: 'quote', tip: 'Quote', fn: () => block('BLOCKQUOTE'), active: activeFormats.block === 'blockquote' },
    { icon: 'list', tip: 'Bullet list', fn: () => cmd('insertUnorderedList'), active: activeFormats.ul },
    { icon: 'listOl', tip: 'Numbered list', fn: () => cmd('insertOrderedList'), active: activeFormats.ol },
    { icon: 'link', tip: 'Link', fn: () => { const u = prompt('Link URL:'); if (u) cmd('createLink', u) } },
  ]

  const insertItems = [
    { icon: 'quote', label: 'Pull quote', fn: () => insertHTML('<blockquote data-pull="1">"Your standout line here."</blockquote><p><br/></p>') },
    { icon: 'steps', label: 'Numbered steps', fn: () => insertHTML('<div data-steps="1"><div class="ie-step"><span class="ie-step-n">01</span><div class="ie-step-b"><h4>First step title</h4><p>Describe what to do, plainly and concretely.</p></div></div><div class="ie-step"><span class="ie-step-n">02</span><div class="ie-step-b"><h4>Second step title</h4><p>One clear action per step works best.</p></div></div></div><p><br/></p>') },
    { icon: 'image', label: 'Image', fn: insertImage },
    { icon: 'divider', label: 'Divider', fn: () => insertHTML('<hr/><p><br/></p>') },
    { icon: 'cta', label: 'Inline CTA', fn: () => insertHTML('<div data-cta="1">Build your ATS-friendly resume free on CareerForge — see your score in 60 seconds.</div><p><br/></p>') },
    {
      icon: 'table', label: 'Table', fn: () => insertHTML(
        '<table><thead><tr><th>Column A</th><th>Column B</th><th>Column C</th></tr></thead><tbody>'
        + '<tr><td>Row 1</td><td>Row 1</td><td>Row 1</td></tr>'
        + '<tr><td>Row 2</td><td>Row 2</td><td>Row 2</td></tr>'
        + '</tbody></table><p><br/></p>'
      ),
    },
    {
      icon: 'code', label: 'Code / resume layout', fn: () => insertHTML(
        '<pre><code>PRIYA SHARMA\n+91-98765-43210  |  priya.sharma@gmail.com  |  Hyderabad, Telangana\nlinkedin.com/in/priyasharma  |  github.com/priyasharma</code></pre><p><br/></p>'
      ),
    },
  ]

  const canSave = useMemo(() => buildPayload() !== null, [buildPayload])

  // ── SEO checks ──
  const effectiveMetaDescription = (metaDescription.trim().length >= 10 ? metaDescription.trim() : subtitle.trim()).slice(0, 300)
  const keyword = focusKeyword.trim().toLowerCase()

  const hasH2 = contentFormat === 'html'
    ? /<h2[\s>]/i.test(bodyRef.current?.innerHTML ?? '')
    : /^##\s+/m.test(markdownBody)

  const firstParagraphText = (() => {
    if (contentFormat === 'markdown') {
      const block = markdownBody.split(/\n\s*\n/).find((p) => p.trim() && !p.trim().startsWith('#') && !p.trim().startsWith('>'))
      return (block ?? '').toLowerCase()
    }
    return (bodyRef.current?.querySelector('p')?.textContent ?? '').toLowerCase()
  })()

  const keywordChecks = keyword ? [
    { label: 'Focus keyword appears in the title', pass: title.toLowerCase().includes(keyword) },
    { label: 'Focus keyword appears in the URL slug', pass: effectiveSlug.includes(keyword.replace(/\s+/g, '-')) },
    { label: 'Focus keyword appears in the meta description', pass: effectiveMetaDescription.toLowerCase().includes(keyword) },
    { label: 'Focus keyword appears in the opening paragraph', pass: firstParagraphText.includes(keyword) },
  ] : []

  const healthChecks = [
    { label: `Title length is search-friendly (${title.trim().length}/60)`, pass: title.trim().length >= 40 && title.trim().length <= 60 },
    { label: `Meta description length is search-friendly (${effectiveMetaDescription.length}/155)`, pass: effectiveMetaDescription.length >= 120 && effectiveMetaDescription.length <= 155 },
    { label: 'Article has at least one H2 subheading', pass: hasH2 },
    { label: 'Cover image set (used for social/share previews)', pass: !!coverImageUrl.trim() },
  ]

  if (!isNew && isLoading) {
    return (
      <div className={styles.page} style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--brand)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Helmet>
        <title>{title ? `${title} — Editor` : 'New article — Editor'} | CareerForge Admin</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* ── Top bar ── */}
      <header className={styles.topBar}>
        <Link to="/admin/insights" title="Back to Insights" className={styles.backLink}>
          <EIcon name="arrowL" size={15} />
          <div className={styles.logoMark}>
            <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
              <path d="M42,21 A13,13 0 1 0 42,43" stroke="white" strokeWidth="6" strokeLinecap="round" />
              <line x1="42" y1="21" x2="48" y2="21" stroke="white" strokeWidth="6" strokeLinecap="round" />
              <line x1="42" y1="32" x2="47" y2="32" stroke="white" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>
        </Link>
        <div className={styles.vDivider} />
        <div className={styles.breadcrumb}>
          <span className={styles.breadcrumbRoot}>Insights</span>
          <EIcon name="arrow" size={12} color="var(--muted-2)" />
          <span className={styles.breadcrumbCurrent}>{title || 'New article'}</span>
        </div>

        <div className={styles.saveStatus}>
          {saveState === 'saving' && (<><div className={styles.savingDot} />Saving…</>)}
          {saveState === 'saved' && (<><EIcon name="check" size={13} color="var(--green)" sw={2.4} />Saved</>)}
          {saveState === 'unsaved' && 'Unsaved changes'}
          {saveState === 'error' && <span className={styles.errorText}>Save failed — check required fields</span>}
        </div>

        <div className={styles.topBarRight}>
          <span className={styles.wordCount}>{words} words · {readTime} min</span>
          <div className={styles.vDivider} style={{ margin: '0 4px' }} />
          {status === 'published' && (
            <a className={styles.ghostBtn} href={`/blog/${effectiveSlug}`} target="_blank" rel="noopener noreferrer">
              <EIcon name="eye" size={14} /> Preview
            </a>
          )}
          <button
            onClick={() => setSettingsOpen((s) => !s)}
            title="Post settings"
            className={`${styles.iconBtn} ${settingsOpen ? styles.iconBtnActive : ''}`}
          >
            <EIcon name="settings" size={16} />
          </button>
          <div className={styles.publishWrap}>
            <button className={styles.publishBtn} onClick={() => setPublishOpen((o) => !o)}>
              {status === 'published' ? 'Published' : 'Publish'} <EIcon name="chevD" size={13} color="#fff" sw={2.2} />
            </button>
            {publishOpen && (
              <>
                <div className={styles.menuBackdrop} onClick={() => setPublishOpen(false)} />
                <div className={styles.publishMenu}>
                  <div className={styles.publishMenuHead}>
                    <div className={styles.publishMenuTitle}>
                      {status === 'published' ? 'Article is live' : 'Ready to publish?'}
                    </div>
                    <div className={styles.publishMenuSub}>
                      {status === 'published'
                        ? `Live at /blog/${effectiveSlug}. Saving updates it immediately.`
                        : 'This article will go live on the blog immediately.'}
                    </div>
                  </div>
                  <div className={styles.publishMenuBody}>
                    {status !== 'published' && (
                      <button className={styles.publishNowBtn} onClick={handlePublish} disabled={!canSave}>
                        <EIcon name="sparkle" size={14} color="#fff" /> Publish now
                      </button>
                    )}
                    <button className={styles.draftBtn} onClick={() => { setPublishOpen(false); void save() }} disabled={!canSave}>
                      <EIcon name="check" size={14} color="var(--body)" /> {status === 'published' ? 'Save changes' : 'Save draft'}
                    </button>
                    {status === 'published' && !isNew && (
                      <button className={styles.unpublishBtn} onClick={handleArchive}>
                        Unpublish (archive)
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Canvas + settings ── */}
      <div className={styles.main}>
        <main className={`${styles.canvasScroll} ${settingsOpen ? styles.canvasScrollShifted : ''}`}>
          <div className={styles.canvas}>
            {/* Cover preview: uploaded image, featured hero, or category art placeholder */}
            <div
              className={`${styles.cover} ${!coverImageUrl.trim() && featured ? styles.coverHero : ''}`}
              style={{
                background: coverImageUrl.trim() || featured ? undefined : `linear-gradient(135deg, ${cat.col}28, ${cat.col}06)`,
                border: coverImageUrl.trim() || featured ? undefined : `1px solid ${cat.col}25`,
              }}
              onClick={() => setSettingsOpen(true)}
            >
              {coverImageUrl.trim() ? (
                <img src={coverImageUrl.trim()} alt="" className={styles.coverImg} />
              ) : featured ? (
                <div className={styles.coverHeroContent}>
                  <div className={styles.coverHeroBadge}>
                    <EIcon name="star" size={11} color="var(--coral)" /> Featured
                  </div>
                  <div className={styles.coverHeroTitle}>
                    {title.trim() || 'Your headline appears here, large and bold'}
                  </div>
                </div>
              ) : (
                <div className={styles.coverWord} style={{ color: cat.col }}>
                  {cat.label.split(' ')[0]}
                </div>
              )}
            </div>

            {/* Category pill */}
            <button
              onClick={() => setSettingsOpen(true)}
              className={styles.categoryPill}
              style={{ background: `${cat.col}15`, color: cat.col }}
            >
              {cat.label}
              <EIcon name="chevD" size={11} color={cat.col} sw={2.2} />
            </button>

            {/* Title */}
            <TextareaAuto
              value={title}
              onChange={(v) => { setTitle(v); touch() }}
              placeholder="Article title"
              className={styles.titleInput}
            />

            {/* Subtitle / excerpt */}
            <TextareaAuto
              value={subtitle}
              onChange={(v) => { setSubtitle(v); touch() }}
              placeholder="Add a subtitle that hooks the reader…"
              className={styles.subtitleInput}
            />

            {/* Author + meta row */}
            <div className={styles.metaRow}>
              <div className={styles.avatar}>{authorName[0]?.toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div className={styles.metaName}>{authorName}</div>
                <div className={styles.metaSub}>
                  <span className={`${styles.statusBadge} ${status === 'published' ? styles.statusPublished : status === 'archived' ? styles.statusArchived : ''}`}>
                    {status}
                  </span>
                  <span className={styles.metaDot} />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <EIcon name="clock" size={11} color="var(--muted)" /> {readTime} min read
                  </span>
                </div>
              </div>
            </div>

            {/* Formatting toolbar (rich HTML mode only) */}
            {contentFormat === 'html' && (
              <div className={styles.toolbar}>
                {/* Text style: Paragraph / Heading / Subheading */}
                <div className={styles.headingWrap}>
                  <button
                    className={`${styles.headingBtn} ${headingOpen ? styles.headingBtnOpen : ''}`}
                    onClick={() => setHeadingOpen((o) => !o)}
                    title="Text style"
                  >
                    {HEADING_OPTIONS.find((h) => h.tag === activeFormats.block)?.shortLabel ?? '¶'}
                    <EIcon name="chevD" size={11} sw={2.2} />
                  </button>
                  {headingOpen && (
                    <>
                      <div className={styles.menuBackdrop} style={{ zIndex: 40 }} onClick={() => setHeadingOpen(false)} />
                      <div className={styles.headingMenu}>
                        {HEADING_OPTIONS.map((h) => {
                          const active = activeFormats.block === h.tag
                          return (
                            <button
                              key={h.tag}
                              className={`${styles.headingItem} ${active ? styles.headingItemActive : ''}`}
                              onClick={() => { block(h.tag.toUpperCase()); setHeadingOpen(false) }}
                            >
                              <span className={h.tag === 'h2' ? styles.headingPreviewH2 : h.tag === 'h3' ? styles.headingPreviewH3 : styles.headingPreviewP}>
                                {h.label}
                              </span>
                              {active && <EIcon name="check" size={13} sw={2.4} color="var(--brand)" />}
                            </button>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
                <div className={styles.toolDivider} />
                {tools.map((t, i) =>
                  'divider' in t ? (
                    <div key={i} className={styles.toolDivider} />
                  ) : (
                    <button key={i} className={`${styles.toolBtn} ${t.active ? styles.toolBtnActive : ''}`} title={t.tip} onClick={t.fn}>
                      <EIcon name={t.icon!} size={16} />
                    </button>
                  )
                )}
                <div className={styles.toolDivider} />
                <div className={styles.insertWrap}>
                  <button
                    className={`${styles.insertBtn} ${insertOpen ? styles.insertBtnOpen : ''}`}
                    onClick={() => setInsertOpen((o) => !o)}
                    title="Insert block"
                  >
                    <EIcon name="plus" size={14} sw={2.2} /> Insert
                  </button>
                  {insertOpen && (
                    <>
                      <div className={styles.menuBackdrop} style={{ zIndex: 40 }} onClick={() => setInsertOpen(false)} />
                      <div className={styles.insertMenu}>
                        {insertItems.map((b) => (
                          <button key={b.label} className={styles.insertItem} onClick={b.fn}>
                            <div className={styles.insertItemIcon}>
                              <EIcon name={b.icon} size={13} color="var(--brand)" />
                            </div>
                            {b.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Body */}
            {contentFormat === 'markdown' ? (
              <TextareaAuto
                value={markdownBody}
                onChange={(v) => { setMarkdownBody(v); touch() }}
                placeholder="Write your article in markdown…"
                className={styles.ieBody}
              />
            ) : (
              <div className={styles.bodyWrap}>
                {bodyEmpty && (
                  <div className={styles.bodyPlaceholder}>
                    Start writing your story. Press <strong>Insert</strong> for quotes, dividers and CTAs.
                  </div>
                )}
                <div
                  ref={bodyRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={touch}
                  onClick={handleBodyClick}
                  onKeyDown={handleBodyKeyDown}
                  onKeyUp={updateActiveFormats}
                  className={styles.ieBody}
                />
              </div>
            )}
          </div>
        </main>

        {/* ── Settings slide-over ── */}
        <aside className={`${styles.settingsPanel} ${settingsOpen ? styles.settingsPanelOpen : ''}`}>
          <div className={styles.settingsHead}>
            <div className={styles.settingsTitle}>Post settings</div>
            <button className={styles.settingsClose} onClick={() => setSettingsOpen(false)}>
              <EIcon name="x" size={14} sw={2} />
            </button>
          </div>

          <div className={styles.settingsBody}>
            {/* Featured toggle */}
            <div className={`${styles.featuredToggle} ${featured ? styles.featuredToggleOn : ''}`}>
              <div className={`${styles.featuredIconBox} ${featured ? styles.featuredIconBoxOn : ''}`}>
                <EIcon name="star" size={15} color={featured ? '#fff' : 'var(--muted)'} />
              </div>
              <div style={{ flex: 1 }}>
                <div className={styles.featuredTitle}>
                  Feature this article
                  <InfoTip text="Pins this article to the hero spot at the top of the Insights page. Use it sparingly — for your single best or most timely piece, not every post — since featuring everything defeats the point." />
                </div>
                <div className={styles.featuredSub}>Pin to the top of Insights</div>
              </div>
              <button
                className={`${styles.toggle} ${featured ? styles.toggleOn : ''}`}
                onClick={() => { setFeatured((f) => !f); touch() }}
                aria-pressed={featured}
                aria-label="Feature this article"
              >
                <span className={styles.toggleKnob} />
              </button>
            </div>

            {/* SEO */}
            <Group
              label="SEO"
              sub="How this article will appear in Google search results"
              tip="This is a live preview, not an input — it pulls from your title, slug, and meta description below. Use it to sanity-check the result doesn't look cut off or generic before you publish."
            >
              <div className={styles.serpPreview}>
                <div className={styles.serpUrl}>careerforge.pro › blog › {effectiveSlug}</div>
                <div className={styles.serpTitle}>{title.trim() || 'Article title'}</div>
                <div className={styles.serpDesc}>{effectiveMetaDescription || 'Meta description will appear here…'}</div>
              </div>
              <div className={`${styles.charCount} ${title.trim().length > 60 ? styles.charCountOver : ''}`}>
                Title: {title.trim().length}/60
              </div>
            </Group>

            {/* Focus keyword */}
            <Group
              label="Focus keyword"
              sub="The main phrase this article should rank for"
              tip="Pick the exact phrase a real person would type into Google to find this article (e.g. 'ats resume format india', not just 'resume'). Be specific — specific phrases have less competition and convert better. This isn't saved anywhere; it only drives the 4 checks below, so write naturally and let it appear where it fits — don't force it in."
            >
              <input
                className={styles.textInput}
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="e.g. ats resume format india"
              />
              {keyword && (
                <div className={styles.seoChecklist}>
                  {keywordChecks.map((c) => (
                    <div key={c.label} className={styles.seoCheckItem}>
                      <EIcon name={c.pass ? 'check' : 'x'} size={13} sw={2.4} color={c.pass ? 'var(--green)' : 'var(--muted-2)'} />
                      <span className={c.pass ? '' : styles.seoCheckFail}>{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </Group>

            {/* SEO health checklist */}
            <Group
              label="SEO health"
              tip="General best-practice checks, independent of any keyword: title 40–60 characters, meta description 120–155 characters, at least one H2 subheading for skimmability and SEO structure, and a cover image set. Aim for all green, but 3 of 4 is fine — these are guardrails, not hard rules."
            >
              <div className={styles.seoChecklist}>
                {healthChecks.map((c) => (
                  <div key={c.label} className={styles.seoCheckItem}>
                    <EIcon name={c.pass ? 'check' : 'x'} size={13} sw={2.4} color={c.pass ? 'var(--green)' : 'var(--muted-2)'} />
                    <span className={c.pass ? '' : styles.seoCheckFail}>{c.label}</span>
                  </div>
                ))}
              </div>
            </Group>

            {/* Cover image */}
            <Group
              label="Cover image"
              sub="Used for social shares (Open Graph) and the article cover"
              tip="Paste a direct image URL (ending in .jpg/.png/.webp). Use a landscape image, roughly 1200×630px, so it crops cleanly as the blog-list thumbnail and the preview shown when the link is shared on WhatsApp/LinkedIn/X. Pick something on-topic and readable even when small — avoid busy or text-heavy images."
            >
              <input
                className={styles.textInput}
                value={coverImageUrl}
                onChange={(e) => { setCoverImageUrl(e.target.value); touch() }}
                placeholder="https://…"
              />
              {coverImageUrl.trim() && (
                <img src={coverImageUrl.trim()} alt="" className={styles.coverImagePreview} />
              )}
            </Group>

            {/* Category */}
            <Group
              label="Category"
              tip="Pick the single best-fit topic — this is the main grouping/filter on the Insights page and shows as a colored pill on the article. Choose one, even if the article could arguably fit two; use Extra tags below for secondary topics."
            >
              <div className={styles.categoryChips}>
                {INSIGHT_CATEGORIES.map((c) => {
                  const active = categoryId === c.id
                  return (
                    <button
                      key={c.id}
                      onClick={() => { setCategoryId(c.id); touch() }}
                      className={styles.categoryChip}
                      style={active ? { background: c.col, color: '#fff', borderColor: c.col } : undefined}
                    >
                      {!active && <span className={styles.categoryChipDot} style={{ background: c.col }} />}
                      {c.label}
                    </button>
                  )
                })}
              </div>
            </Group>

            {/* Tags */}
            <Group
              label="Extra tags"
              sub="Comma-separated, shown on cards"
              tip="Optional secondary topics, e.g. 'Fresher, Indian Job Market'. Keep it to 2–4 short tags — they're for extra context on the card, not a keyword dump. Skip this if Category already covers it well."
            >
              <input
                className={styles.textInput}
                value={extraTags}
                onChange={(e) => { setExtraTags(e.target.value); touch() }}
                placeholder="Fresher, Indian Job Market"
              />
            </Group>

            {/* URL slug */}
            <Group
              label="URL slug"
              tip="The web address after /blog/. Auto-generated from your title — only override it to make it shorter or to match your focus keyword exactly (e.g. ats-resume-format-india). Keep it lowercase, hyphenated, and short. Important: avoid changing it after publishing, since it breaks any links people already saved or shared."
            >
              <div className={styles.slugBox}>
                <span className={styles.slugPrefix}>/blog/</span>
                <input
                  className={styles.slugInput}
                  value={effectiveSlug}
                  onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); touch() }}
                />
              </div>
            </Group>

            {/* Short title */}
            <Group
              label="Short title"
              sub="Used in prev/next navigation cards"
              tip="A shortened version of the title for the tight prev/next navigation cards at the bottom of an article. Optional — leave blank and it just reuses the full title. Only fill this in if your title is long and would get awkwardly truncated there."
            >
              <input
                className={styles.textInput}
                value={shortTitle}
                onChange={(e) => { setShortTitle(e.target.value); touch() }}
                placeholder={title || 'Defaults to the title'}
              />
            </Group>

            {/* Meta description */}
            <Group
              label="Meta description"
              sub="Shown in Google results (max 155 chars)"
              tip="The gray text under your blue link in Google, and what shows when the link is shared. Write it like a one-sentence pitch that makes someone want to click — not a summary of the article. Aim for 120–155 characters; shorter gets truncated less but wastes the chance to entice. Leave blank to fall back to the subtitle."
            >
              <textarea
                className={styles.textInput}
                value={metaDescription}
                onChange={(e) => { setMetaDescription(e.target.value); touch() }}
                placeholder="Defaults to the subtitle…"
                rows={3}
              />
              <div className={`${styles.charCount} ${metaDescription.length > 155 ? styles.charCountOver : ''}`}>
                {metaDescription.length}/155
              </div>
            </Group>

            {/* Series */}
            <Group
              label="Series"
              sub="Optional — e.g. 90-Day Career Forge"
              tip="Only fill this in if the article is part of a numbered sequence you publish over time (e.g. a 90-day program, day 3). It shows as 'Day 3 of 90-Day Career Forge' on the article. Leave both fields blank for a standalone article — most posts won't use this."
            >
              <div className={styles.fieldRow}>
                <input
                  className={styles.textInput}
                  value={series}
                  onChange={(e) => { setSeries(e.target.value); touch() }}
                  placeholder="Series name"
                />
                <input
                  className={styles.textInput}
                  value={seriesDay}
                  onChange={(e) => { setSeriesDay(e.target.value.replace(/\D/g, '')); touch() }}
                  placeholder="Day #"
                  inputMode="numeric"
                  style={{ maxWidth: 90 }}
                />
              </div>
            </Group>

            {/* Stats */}
            <div className={styles.statRow}>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Words</div>
                <div className={styles.statValue}>{words}</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Read time</div>
                <div className={styles.statValue}>{readTime} min</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
