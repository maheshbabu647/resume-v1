import { Suspense, useRef, useEffect, useState } from 'react'
import { X, Minus, Plus } from 'lucide-react'
import { useEditorUIStore } from '../../store/useEditorUIStore'
import { useResumeStore } from '../../store/useResumeStore'
import { TEMPLATE_REGISTRY } from '../../templates/registry'
import styles from './PreviewPanel.module.css'

// A4 dimensions at 96 DPI
const A4_HEIGHT_PX = 1123 // 297mm ≈ 1123px
const PAGE_GAP_PX = 24 // visual gap between page sheets in the live preview
// Matches the PDF export's `@page { margin: 15mm 0 }` (Toolbar.tsx) — every
// template except classic-sidebar (which uses `@page { margin: 0 }`).
const PAGE_MARGIN_PX = 56.7 // 15mm at 96dpi

export default function PreviewPanel() {
  const showGallery = useEditorUIStore((s) => s.showTemplateGallery)
  const toggleGallery = useEditorUIStore((s) => s.toggleTemplateGallery)
  const mobileViewMode = useEditorUIStore((s) => s.mobileViewMode)
  
  const data = useResumeStore((s) => s.data)
  const customization = useResumeStore((s) => s.customization)
  const activeTemplateId = useResumeStore((s) => s.templateId)
  const setTemplateId = useResumeStore((s) => s.setTemplateId)
  
  const activeTemplateDef = TEMPLATE_REGISTRY[activeTemplateId as keyof typeof TEMPLATE_REGISTRY]
  const TemplateComponent = activeTemplateDef?.component

  const viewportRef = useRef<HTMLDivElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [paperHeight, setPaperHeight] = useState(A4_HEIGHT_PX)
  const [zoom, setZoom] = useState(100)
  const [pageBreaks, setPageBreaks] = useState<number[]>([A4_HEIGHT_PX])

  // Scale based on viewport width
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return
      const margin = window.innerWidth < 768 ? 20 : 64
      const availableWidth = entries[0].contentRect.width - margin
      const PAPER_WIDTH = 794
      
      if (availableWidth < PAPER_WIDTH) {
        setScale(availableWidth / PAPER_WIDTH)
      } else {
        setScale(1)
      }
    })
    
    if (viewportRef.current) observer.observe(viewportRef.current)
    return () => observer.disconnect()
  }, [])

  // Track the actual paper content height for multi-page support
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return
      const height = entries[0].borderBoxSize?.[0]?.blockSize ?? entries[0].contentRect.height
      // Snap to minimum of one A4 page
      setPaperHeight(Math.max(height, A4_HEIGHT_PX))
    })

    if (paperRef.current) observer.observe(paperRef.current)
    return () => observer.disconnect()
  }, [])

  // The PDF export uses `@page { margin: 15mm 0 }` for every template except
  // classic-sidebar (`margin: 0`) — see Toolbar.tsx. That margin eats into the
  // usable content height of every page, so mirror it here for break math.
  const isClassicSidebar = activeTemplateId === 'classic-sidebar'
  const pageMarginPx = isClassicSidebar ? 0 : PAGE_MARGIN_PX
  const pageContentHeight = A4_HEIGHT_PX - pageMarginPx * 2

  // Compute break-aware page offsets so the live preview matches the PDF
  // export's break-after/break-before/break-inside avoidance rules: don't
  // split a .template-entry, and keep a .template-section-title with its
  // first .template-entry.
  useEffect(() => {
    const computeBreaks = () => {
      const masterEl = paperRef.current
      if (!masterEl) return

      // .scaleWrapper is scaled via CSS transform, which getBoundingClientRect()
      // reflects in its returned rects. Normalize by the current scale factor so
      // measurements line up with the unscaled A4_HEIGHT_PX reference.
      const factor = (scale * (zoom / 100)) || 1
      const totalHeight = masterEl.getBoundingClientRect().height / factor

      if (totalHeight <= pageContentHeight) {
        setPageBreaks([pageContentHeight])
        return
      }

      const baseTop = masterEl.getBoundingClientRect().top
      const protectedRects: { top: number; bottom: number }[] = []

      masterEl.querySelectorAll('.template-section').forEach((sec) => {
        const title = sec.querySelector(':scope > .template-section-title')
        const content = sec.querySelector(':scope > .template-section-content')
        const firstEntry = content?.querySelector(':scope > .template-entry')
        if (title && firstEntry) {
          const titleRect = title.getBoundingClientRect()
          const entryRect = firstEntry.getBoundingClientRect()
          protectedRects.push({ top: (titleRect.top - baseTop) / factor, bottom: (entryRect.bottom - baseTop) / factor })
        }
      })

      masterEl.querySelectorAll('.template-entry').forEach((entry) => {
        const r = entry.getBoundingClientRect()
        protectedRects.push({ top: (r.top - baseTop) / factor, bottom: (r.bottom - baseTop) / factor })
      })

      const breaks: number[] = []
      let cursor = 0
      let guard = 0
      while (cursor < totalHeight && guard < 50) {
        guard++
        let next = cursor + pageContentHeight
        if (next >= totalHeight) {
          breaks.push(totalHeight)
          break
        }

        // Push the break point up to the start of any protected element
        // (entry, or section title + its first entry) it would otherwise split.
        let changed = true
        let iterations = 0
        while (changed && iterations < 20) {
          changed = false
          iterations++
          for (const r of protectedRects) {
            if (next > r.top && next < r.bottom && r.top > cursor) {
              next = r.top
              changed = true
            }
          }
        }

        if (next <= cursor) next = cursor + pageContentHeight
        breaks.push(next)
        cursor = next
      }

      setPageBreaks(breaks.length ? breaks : [totalHeight])
    }

    // Defer to next frame so layout/fonts have settled
    const raf = requestAnimationFrame(computeBreaks)
    return () => cancelAnimationFrame(raf)
  }, [data, customization, activeTemplateId, paperHeight, scale, zoom, pageContentHeight])

  const pageCount = pageBreaks.length
  const totalStackHeight = pageCount * A4_HEIGHT_PX + (pageCount - 1) * PAGE_GAP_PX

  return (
    <div className={`${styles.panel} ${mobileViewMode !== 'preview' ? styles.hiddenOnMobile : ''}`}>
      {/* Canvas toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarInfo}>
          A4 · 210 × 297mm · {pageCount} {pageCount === 1 ? 'page' : 'pages'}
        </div>
        <div className={`${styles.zoomControls} ${styles.hiddenOnMobile}`}>
          <button
            className={styles.zoomBtn}
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            title="Zoom out"
          >
            <Minus size={14} strokeWidth={2} />
          </button>
          <span className={styles.zoomValue}>{zoom}%</span>
          <button
            className={styles.zoomBtn}
            onClick={() => setZoom((z) => Math.min(150, z + 10))}
            title="Zoom in"
          >
            <Plus size={14} strokeWidth={2} />
          </button>
        </div>
        <div className={`${styles.fitBadge} ${pageCount === 1 ? styles.fitBadgeOk : styles.fitBadgeWarn} ${styles.hiddenOnMobile}`}>
          <span className={styles.fitDot} />
          {pageCount === 1 ? 'Page fits' : 'Overflows'}
        </div>
      </div>

      {/* Template Gallery */}
      <div className={`${styles.gallery} ${showGallery ? styles.galleryOpen : ''}`}>
        <button className={styles.galleryClose} onClick={toggleGallery}><X size={14} /> Close</button>
        <div className={styles.galleryScroller}>
          {Object.values(TEMPLATE_REGISTRY).map((t) => (
            <button
              key={t.id}
              className={`${styles.galleryCard} ${activeTemplateId === t.id ? styles.galleryCardActive : ''}`}
              onClick={() => { setTemplateId(t.id); toggleGallery() }}
            >
              <div className={styles.galleryThumb} style={{ '--c': '#1e2d4a' } as React.CSSProperties}>
                <div className={styles.thumbInner}>
                  <div className={styles.thumbLine} style={{ width: '70%' }} />
                  <div className={styles.thumbLine} style={{ width: '50%', opacity: 0.5 }} />
                  <div style={{ height: 6 }} />
                  {[80, 60, 70].map((w, i) => <div key={i} className={styles.thumbLine} style={{ width: `${w}%`, opacity: 0.3 }} />)}
                </div>
              </div>
              <span className={styles.galleryName}>{t.name}</span>
              {t.isAtsRecommended && <span className={styles.atsTag}>ATS ✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Resume Paper — rendered as separate A4 page sheets */}
      <div className={styles.viewport} ref={viewportRef}>
        <div
          className={styles.scaleWrapper}
          style={{
            transform: `scale(${scale * (zoom / 100)})`,
            transformOrigin: 'top center',
            // Reserve space for the scaled-down page stack so the viewport can scroll correctly
            height: scale < 1 ? `${totalStackHeight * scale * (zoom / 100)}px` : 'auto'
          }}
        >
          {/* Hidden full-height master — used only to measure total content height and as the print/export source */}
          <div className={`${styles.printMaster} print-area`} ref={paperRef}>
            <Suspense fallback={null}>
              {TemplateComponent ? (
                <TemplateComponent data={data} customization={customization} />
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center' }}>Template not found</div>
              )}
            </Suspense>
          </div>

          {/* Visible page stack — each sheet shows a clipped slice of the same content,
              cut at break-aware offsets so it matches the PDF export's pagination */}
          <div className={styles.pages}>
            {pageBreaks.map((pageEnd, i) => {
              const pageStart = i === 0 ? 0 : pageBreaks[i - 1]
              const clipHeight = pageEnd - pageStart
              return (
                <div className={styles.page} key={i}>
                  <div className={styles.pageMargin} style={{ padding: `${pageMarginPx}px 0` }}>
                    <div className={styles.pageClip} style={{ height: `${clipHeight}px` }}>
                      <div className={styles.pageInner} style={{ transform: `translateY(-${pageStart}px)` }}>
                        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading template...</div>}>
                          {TemplateComponent ? (
                            <TemplateComponent data={data} customization={customization} />
                          ) : (
                            <div style={{ padding: '2rem', textAlign: 'center' }}>Template not found</div>
                          )}
                        </Suspense>
                      </div>
                    </div>
                  </div>
                  {pageCount > 1 && <span className={styles.pageLabel}>Page {i + 1} of {pageCount}</span>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
