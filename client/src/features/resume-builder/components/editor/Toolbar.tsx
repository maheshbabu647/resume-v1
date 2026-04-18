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

      const htmlPayload = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            ${stylesHtml}
            <style>
              body { margin: 0; padding: 0; background: white !important; }
              .print-area { transform: none !important; box-shadow: none !important; width: 210mm !important; min-height: auto !important; }

              /* ── Multi-page pagination rules ── */
              @page { size: A4; margin: 10mm 0; }

              /* Let @page margins handle per-page spacing; remove root top/bottom padding */
              #resume {
                padding-top: 0 !important;
                padding-bottom: 0 !important;
                min-height: auto !important;
              }

              /* Sections can span pages — don't push entire sections to next page */
              .template-section { break-inside: auto !important; }

              /* Section titles must stay with at least one entry */
              .template-section-title { break-after: avoid; }

              /* Individual entries (jobs, education, etc.) must not split across pages */
              .template-entry { break-inside: avoid; }

              /* Hide page-break visual indicators */
              .pageBreakLine { display: none !important; }
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
