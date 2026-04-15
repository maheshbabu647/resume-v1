import { Suspense, useRef, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useEditorUIStore } from '../../store/useEditorUIStore'
import { useResumeStore } from '../../store/useResumeStore'
import { TEMPLATE_REGISTRY } from '../../templates/registry'
import styles from './PreviewPanel.module.css'

// A4 dimensions at 96 DPI
const A4_HEIGHT_PX = 1123 // 297mm ≈ 1123px

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

  // Calculate the number of pages for the page-break indicators
  const pageCount = Math.ceil(paperHeight / A4_HEIGHT_PX)

  return (
    <div className={`${styles.panel} ${mobileViewMode !== 'preview' ? styles.hiddenOnMobile : ''}`}>
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

      {/* Resume Paper — supports multi-page content */}
      <div className={styles.viewport} ref={viewportRef}>
        <div 
          className={styles.scaleWrapper}
          style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: 'top center',
            // Use the actual paper height (not a fixed single page) for the scaled container
            height: scale < 1 ? `${paperHeight * scale}px` : 'auto'
          }}
        >
          <div className={`${styles.paper} print-area`} ref={paperRef}>
            <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading template...</div>}>
              {TemplateComponent ? (
                <TemplateComponent data={data} customization={customization} />
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center' }}>Template not found</div>
              )}
            </Suspense>

            {/* Page-break indicators — visual guides showing where pages end */}
            {pageCount > 1 && Array.from({ length: pageCount - 1 }, (_, i) => (
              <div
                key={i}
                className={styles.pageBreakLine}
                style={{ top: `${(i + 1) * A4_HEIGHT_PX}px` }}
              >
                <span className={styles.pageBreakLabel}>Page {i + 1} ends · Page {i + 2} begins</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
