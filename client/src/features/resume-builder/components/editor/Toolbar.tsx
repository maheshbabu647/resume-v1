import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Download, Save, LayoutTemplate, Loader2, Edit2, Eye, PenLine, Menu, List } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/shared/components/Button/Button'
import { apiClient } from '@/shared/lib/apiClient'
import { UpgradeModal } from '@/shared/components/UpgradeModal/UpgradeModal'
import { trackResumeDownloaded, trackTemplateGalleryOpened } from '@/shared/lib/analytics'
import { useEditorUIStore } from '../../store/useEditorUIStore'
import { useResumeStore } from '../../store/useResumeStore'
import { useAuthStore } from '@/core/auth/useAuthStore'
import { AuthRequireModal } from '@/shared/components/AuthRequireModal/AuthRequireModal'
import styles from './Toolbar.module.css'

export const Toolbar = () => {
  const queryClient = useQueryClient()
  const [isExporting, setIsExporting] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeTrigger, setUpgradeTrigger] = useState<'pdfDownloads' | 'general'>('general')
  
  const isSaving = useEditorUIStore((s) => s.isSaving)
  const isDirty = useEditorUIStore((s) => s.isDirty)
  
  const title = useResumeStore((s) => s.title)
  const setTitle = useResumeStore((s) => s.setTitle)
  const toggleGallery = useEditorUIStore((s) => s.toggleTemplateGallery)
  const mobileViewMode = useEditorUIStore((s) => s.mobileViewMode)
  const setMobileViewMode = useEditorUIStore((s) => s.setMobileViewMode)
  const toggleMobileNav = useEditorUIStore((s) => s.toggleMobileNav)
  const toggleGlobalNav = useEditorUIStore((s) => s.toggleGlobalNav)
  const [authModalArgs, setAuthModalArgs] = useState<{ isOpen: boolean; pendingAction?: 'save' | 'export' }>({ isOpen: false })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleTitleBlur = () => {
    if (!title.trim()) {
      setTitle('Untitled Resume')
    }
  }

  const handleExportPDF = async () => {
    if (!useAuthStore.getState().isAuthenticated) {
      setAuthModalArgs({ isOpen: true, pendingAction: 'export' })
      return
    }

    const printArea = document.querySelector('.print-area')
    if (!printArea) return

    setIsExporting(true)

    try {
      let stylesHtml = ''
      document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach(el => {
        if (el.tagName === 'LINK') {
          const href = (el as HTMLLinkElement).href
          stylesHtml += `<link rel="stylesheet" href="${href}">`
        } else {
          stylesHtml += el.outerHTML
        }
      })

      // ── Template-aware print overrides ──────────────────────────────────
      const templateId = useResumeStore.getState().templateId
      const isClassicSidebar = templateId === 'classic-sidebar'

      let classicSidebarCSS = ''
      if (isClassicSidebar) {
        const resumeEl = document.getElementById('resume')
        // Read the live computed accent color (set as inline CSS variable on #resume)
        const accentColor = resumeEl
          ? (getComputedStyle(resumeEl).getPropertyValue('--accent-color').trim() || '#1a2332')
          : '#1a2332'

        // Round document height up to a multiple of one A4 page.
        // This forces the flex container (and therefore the aside child via
        // align-items:stretch) to fill the bottom of the last page.
        const A4_PX = 1123
        const contentHeight = (printArea as HTMLElement).scrollHeight
        const pages = Math.ceil(Math.max(contentHeight, A4_PX) / A4_PX)
        const minHeightPx = pages * A4_PX

        classicSidebarCSS = `
          /*
           * Classic Sidebar print overrides
           *
           * PROBLEM: .paper (PreviewPanel) has background:white which was
           * painting over every sidebar color trick. Fix: clear it.
           *
           * SIDEBAR COLOR: body background is a gradient that covers the FULL
           * document canvas height — including any empty space at the bottom of
           * the last page. The aside itself keeps its CSS background too, so
           * page 1 is doubly covered.
           *
           * LAST PAGE FILL: min-height rounds #resume up to full page multiples,
           * so align-items:stretch carries the aside to the page bottom.
           */
          body {
            background: linear-gradient(
              to right,
              ${accentColor} 210px,
              white 210px
            ) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Make the resume root transparent so body gradient shows through */
          #resume {
            background: transparent !important;
            min-height: ${minHeightPx}px !important;
          }
          /* Keep aside's original background for page-1 content area,
             but ensure it's transparent enough to let text read on body gradient */
          #resume aside {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Section padding for breathing room after page-2+ breaks */
          #resume main > .template-section {
            padding-top: 20px;
          }
          #resume main > .template-section:first-child {
            padding-top: 0;
          }
        `
      }

      const htmlPayload = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            ${stylesHtml}
            <style>
              /* Force ALL backgrounds and colors to print */
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              html { margin: 0; padding: 0; }
              body { margin: 0; padding: 0; background: white; }

              /* Remove .paper white background so it never blocks sidebar color */
              .print-area {
                transform: none !important;
                box-shadow: none !important;
                background: transparent !important;
                width: 210mm !important;
                min-height: auto !important;
              }

              /* @page margins: Classic Sidebar uses 0 (full-bleed color reaches edges).
                 All other templates use 15mm top/bottom so page-2+ content
                 has breathing room from the top/bottom edge. */
              @page { size: A4; margin: ${isClassicSidebar ? '0' : '15mm 0'}; }

              #resume {
                padding-top: 0 !important;
                padding-bottom: 0 !important;
                ${!isClassicSidebar ? 'min-height: auto !important;' : ''}
              }

              /* Pagination: sections can span pages, entries stay together */
              .template-section  { break-inside: auto !important; }
              /* Prevent section title from being orphaned at page bottom:
                 break-after:avoid on title + break-before:avoid on first entry
                 forces them to move together to the next page */
              .template-section-title { break-after: avoid; }
              .template-section-content > .template-entry:first-child { break-before: avoid; }
              .template-entry    { break-inside: avoid; }
              .pageBreakLine     { display: none !important; }

              ${classicSidebarCSS}
            </style>
          </head>
          <body>
            ${printArea.outerHTML}
          </body>
        </html>
      `

      const resumeId = useResumeStore.getState().resumeId
      const filename = title.trim() || 'resume'

      const response = await apiClient.post(
        '/export/pdf',
        { resumeId: resumeId || null, html: htmlPayload, filename },
        { responseType: 'blob' }
      )

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = blobUrl
      link.setAttribute('download', `${filename}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(blobUrl)

      // Track the download
      trackResumeDownloaded(resumeId ?? 'unsaved', 'pdf')
      
      // Refresh usage counter
      queryClient.invalidateQueries({ queryKey: ['usage'] })
      
      queryClient.invalidateQueries({ queryKey: ['usage'] })
      
    } catch (err: any) {
      let errorData = err?.response?.data
      
      // If response is a blob (the case for /export/pdf), we need to parse it to JSON
      if (errorData instanceof Blob && errorData.type === 'application/json') {
        const text = await errorData.text()
        try { errorData = JSON.parse(text).error } catch { /* ignore */ }
      } else {
        errorData = errorData?.error
      }

      if (errorData?.code === 'QUOTA_EXCEEDED') {
        setUpgradeTrigger('pdfDownloads')
        setShowUpgradeModal(true)
      } else {
        console.error('Failed to export PDF:', err)
        alert('Failed to generate PDF. Please try again.')
      }
    } finally {
      setIsExporting(false)
    }
  }

  const handleSave = async () => {
    if (!useAuthStore.getState().isAuthenticated) {
      setAuthModalArgs({ isOpen: true, pendingAction: 'save' })
      return
    }

    const { title, data, customization, resumeId, setResumeId, templateId } = useResumeStore.getState()
    const { setSaving, setDirty } = useEditorUIStore.getState()
    
    setSaving(true)
    try {
      const payload = {
        title: title.trim() || 'Untitled Resume',
        templateId: templateId || 'modern-centered',
        personalInfo: data.personalInfo,
        sections: data.sections,
        customization
      }

      if (resumeId) {
        await apiClient.patch(`/resumes/${resumeId}`, payload)
      } else {
        const res = await apiClient.post('/resumes', payload)
        setResumeId(res.data.data._id)
      }
      setDirty(false)
    } catch (err) {
      console.error('Failed to save resume:', err)
      alert('Failed to save resume. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    const unsub = useResumeStore.subscribe((state, prevState) => {
      if (state.data !== prevState.data || state.customization !== prevState.customization || state.title !== prevState.title) {
        useEditorUIStore.getState().setDirty(true)
      }
    })
    return unsub
  }, [])

  const handleAuthSuccess = () => {
    const action = authModalArgs.pendingAction;
    setAuthModalArgs({ isOpen: false, pendingAction: undefined })
    
    if (action === 'save') {
      setTimeout(handleSave, 50)
    } else if (action === 'export') {
      setTimeout(handleExportPDF, 50)
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.toolbar}>
        <div className={styles.left}>
          <Link to="/dashboard" className={styles.backBtn}>
            <ChevronLeft size={16} />
          </Link>
          <div className={styles.dividerDesk} />
          
          <div className={styles.titleWrapper}>
            <input
              className={styles.titleInput}
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              placeholder="Untitled Resume"
            />
            <Edit2 size={12} className={styles.editIcon} />
          </div>
          <div className={styles.spacer} />
          {(isSaving || isDirty) && (
            <span className={styles.saveStatus}>
              {isSaving ? 'Saving…' : '● Unsaved'}
            </span>
          )}
          {!isSaving && !isDirty && (
            <span className={styles.savedStatus}>● Saved</span>
          )}
        </div>

        <div className={styles.right}>
          {/* Desktop Actions */}
          <div className={styles.desktopActions}>
            <Button variant="ghost" size="sm" onClick={() => { trackTemplateGalleryOpened(); toggleGallery() }}>
              <LayoutTemplate size={14} /> Switch Template
            </Button>
            <Button variant="ghost" size="sm" onClick={handleExportPDF} disabled={isExporting}>
              {isExporting ? <Loader2 size={14} className="spin" /> : <Download size={14} />} 
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </Button>
          </div>

          {/* Mobile-only Top Right Group */}
          <div className={styles.mobileActionsGroup}>
            <button className={styles.mobileActionIconBtn} onClick={handleSave} disabled={isSaving} title="Save">
              {isSaving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
            </button>
            <button className={styles.mobileActionIconBtn} onClick={handleExportPDF} disabled={isExporting} title="Export PDF">
              {isExporting ? <Loader2 size={16} className="spin" /> : <Download size={16} />}
            </button>
            <button className={styles.mobileActionIconBtn} onClick={toggleGlobalNav} title="Menu">
              <Menu size={16} />
            </button>
          </div>

          {/* Original Save button (visible on desktop) */}
          <Button variant="secondary" size="md" className={styles.saveBtn} onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 size={14} className="spin" /> : <Save size={14} />}
            <span className={styles.saveBtnText}>{isSaving ? 'Saving...' : 'Save'}</span>
          </Button>
        </div>
      </header>

      <div className={styles.mobileSubHeader}>
        <button className={styles.mobileSectionBtnAlt} onClick={toggleMobileNav} title="Sections">
          <List size={14} />
        </button>

        <div className={styles.mobileCenterToggle}>
          <div className={styles.toggleTrack}>
            <button 
              className={`${styles.toggleBtn} ${mobileViewMode === 'edit' ? styles.toggleActive : ''}`}
              onClick={() => setMobileViewMode('edit')}
            >
              <PenLine size={12} /> <span>Edit</span>
            </button>
            <button 
              className={`${styles.toggleBtn} ${mobileViewMode === 'preview' ? styles.toggleActive : ''}`}
              onClick={() => setMobileViewMode('preview')}
            >
              <Eye size={12} /> <span>Preview</span>
            </button>
          </div>
        </div>
        
        {mobileViewMode === 'preview' && (
          <button className={styles.mobileTemplateBtn} onClick={toggleGallery} title="Templates">
             <LayoutTemplate size={16} />
          </button>
        )}
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger={upgradeTrigger}
      />

      <AuthRequireModal
        isOpen={authModalArgs.isOpen}
        onClose={() => setAuthModalArgs({ isOpen: false })}
        onSuccess={handleAuthSuccess}
        title="Authentication Required"
        subtitle={`Please log in to ${authModalArgs.pendingAction === 'export' ? 'download' : 'save'} your resume.`}
      />
    </div>
  )
}
