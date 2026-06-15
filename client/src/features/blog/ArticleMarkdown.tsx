// ============================================================
// ArticleMarkdown.tsx — renders DB-backed article content.
// Markdown via react-markdown (+ GFM tables), HTML passthrough
// for articles authored in the admin editor.
// Heading IDs match extractToc() so the sidebar TOC can link.
// ============================================================

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ReactNode } from 'react'

export interface TocEntry {
  id: string
  text: string
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

/** Pull H2s out of markdown or HTML content for the table of contents. */
export function extractToc(content: string, format: 'markdown' | 'html'): TocEntry[] {
  const entries: TocEntry[] = []
  const seen = new Set<string>()

  const push = (raw: string) => {
    const text = raw.replace(/<[^>]+>/g, '').replace(/[*_`#]/g, '').trim()
    if (!text) return
    let id = slugifyHeading(text)
    let n = 2
    while (seen.has(id)) id = `${slugifyHeading(text)}-${n++}`
    seen.add(id)
    entries.push({ id, text })
  }

  if (format === 'html') {
    const re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi
    let m
    while ((m = re.exec(content))) push(m[1])
  } else {
    for (const line of content.split('\n')) {
      const m = /^##\s+(.+)$/.exec(line)
      if (m) push(m[1])
    }
  }
  return entries
}

function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    return textOf((node as { props: { children?: ReactNode } }).props.children)
  }
  return ''
}

interface Props {
  content: string
  contentFormat: 'markdown' | 'html'
}

export function ArticleMarkdown({ content, contentFormat }: Props) {
  if (contentFormat === 'html') {
    // Trusted content: only admins can author articles.
    // Inject ids on h2s so the TOC anchors work.
    const seen = new Set<string>()
    const html = content.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (_full, attrs: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, '').trim()
      let id = slugifyHeading(text)
      let n = 2
      while (seen.has(id)) id = `${slugifyHeading(text)}-${n++}`
      seen.add(id)
      return `<h2${attrs} id="${id}">${inner}</h2>`
    })
    return <div dangerouslySetInnerHTML={{ __html: html }} />
  }

  const seen = new Set<string>()
  const headingId = (children: ReactNode) => {
    const text = textOf(children)
    let id = slugifyHeading(text)
    let n = 2
    while (seen.has(id)) id = `${slugifyHeading(text)}-${n++}`
    seen.add(id)
    return id
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h2 id={headingId(children)}>{children}</h2>,
        h2: ({ children }) => <h2 id={headingId(children)}>{children}</h2>,
        a: ({ href, children }) => {
          const isExternal = !!href && /^https?:\/\//.test(href) && !href.includes('careerforge.pro')
          return (
            <a href={href} {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              {children}
            </a>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
