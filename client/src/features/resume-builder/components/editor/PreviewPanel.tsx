import { Suspense, useRef, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useEditorUIStore } from '../../store/useEditorUIStore'
import { useResumeStore } from '../../store/useResumeStore'
import { TEMPLATE_REGISTRY } from '../../templates/registry'
import styles from './PreviewPanel.module.css'

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
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return
      // A4 width in pixels is roughly 794px. We add ~64px for padding margins.
      // Subtract a smaller margin on small screens to maximize size
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

      {/* Resume Paper */}
      <div className={styles.viewport} ref={viewportRef}>
        <div 
          className={styles.scaleWrapper}
          style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: 'top center',
            height: scale < 1 ? `calc(297mm * ${scale})` : 'auto'
          }}
        >
          <div className={`${styles.paper} print-area`}>
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
    </div>
  )
}
