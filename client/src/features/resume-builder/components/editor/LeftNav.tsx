import React, { useState, useRef, useCallback } from 'react'
import {
  Plus, Trash2, GripVertical, CheckCircle2, MinusCircle, ArrowUpDown, X, FileText
} from 'lucide-react'
import { useEditorUIStore } from '../../store/useEditorUIStore'
import { useResumeStore } from '../../store/useResumeStore'
import { SECTION_DEFINITIONS } from '../../config/fieldDefinitions'
import type { SectionKey } from '../../templates/shared/template.types'
import { Modal } from '@/shared/components/Modal/Modal'
import { ICON_MAP } from '../../config/icons'
import styles from './LeftNav.module.css'




export default function LeftNav() {
  const activeSection = useEditorUIStore((s) => s.activeSection)
  const setActiveSection = useEditorUIStore((s) => s.setActiveSection)
  const mobileNavOpen = useEditorUIStore((s) => s.mobileNavOpen)
  const closeMobileNav = useEditorUIStore((s) => s.closeMobileNav)

  const sections = useResumeStore((s) => s.data.sections)
  const setSectionVisibility = useResumeStore((s) => s.toggleSectionVisibility)
  
  const [isAddModalOpen, setAddModalOpen] = useState(false)
  const [isRemoveMode, setRemoveMode] = useState(false)
  const [isRearrangeMode, setRearrangeMode] = useState(false)

  // Drag state
  const dragIndexRef = useRef<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // Static section — Personal Info is always at the top (Header)
  const staticSections = [
    { key: 'personalInfo' as const, label: 'Personal Info' }
  ]

  const sectionOrder = useResumeStore((s) => s.customization.sectionOrder)
  
  const visibleDynamicKeys = sectionOrder.filter(key => {
    if (key === 'personalInfo' as any) return false
    const s = sections.find(sec => sec.key === key)
    return s && s.visible
  }) as (SectionKey | 'summary')[]

  const hiddenDynamicKeys = [
    ...SECTION_DEFINITIONS
      .map(d => d.key as string)
      .concat(['summary'])
      .filter(k => k !== 'profile' && k !== 'contact')
      .filter(k => !sections.find(s => s.key === (k as any))?.visible) as SectionKey[]
  ]

  const isComplete = (key: string) => {
    if (key === 'personalInfo' || key === 'summary') return true
    const sec = sections.find((s) => s.key === key)
    return (sec?.entries?.length ?? 0) > 0
  }

  const handleAddSection = (key: SectionKey | 'summary') => {
    setSectionVisibility(key as SectionKey, true)
    setActiveSection(key)
    setAddModalOpen(false)
  }

  const handleRemoveSection = (key: SectionKey) => {
    setSectionVisibility(key, false)
    if (activeSection === key) setActiveSection('personalInfo')
  }

  // ─── Drag & Drop ───
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    dragIndexRef.current = index
    e.dataTransfer.effectAllowed = 'move'
    // Make the drag ghost semi-transparent
    const el = e.currentTarget as HTMLElement
    el.style.opacity = '0.5'
  }, [])

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = '1'
    dragIndexRef.current = null
    setDragOverIndex(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = dragIndexRef.current
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragOverIndex(null)
      return
    }

    // Reorder the sections array in the store
    const currentSections = useResumeStore.getState().data.sections
    const currentOrder = useResumeStore.getState().customization.sectionOrder
    
    // We must use the SAME array as the one rendered in the UI to match indices
    const visibleDynamicKeys = currentOrder.filter(key => {
      if (key === 'personalInfo' as any) return false
      const s = currentSections.find(sec => sec.key === key)
      return s && s.visible
    }) as (SectionKey | 'summary')[]

    // Perform the swap on keys based on UI indices
    const newVisibleOrder = [...visibleDynamicKeys]
    const [movedKey] = newVisibleOrder.splice(dragIndex, 1)
    newVisibleOrder.splice(dropIndex, 0, movedKey)
    
    // Build the new full sectionOrder
    const finalOrder = currentOrder.filter(k => !visibleDynamicKeys.includes(k as any))
    
    // Maintain 'personalInfo' at top if it was first
    let newFullOrder: SectionKey[] = []
    if (currentOrder[0] === 'personalInfo' as any) {
      newFullOrder = ['personalInfo' as any, ...newVisibleOrder, ...finalOrder.filter(k => k !== 'personalInfo' as any)] as SectionKey[]
    } else {
      newFullOrder = [...newVisibleOrder, ...finalOrder] as SectionKey[]
    }

    useResumeStore.getState().reorderSections(newFullOrder)
    
    // Also update the order property in data.sections for internal consistency if needed
    const newSections = currentSections.map(s => {
      const idx = newVisibleOrder.indexOf(s.key as any)
      if (idx !== -1) return { ...s, order: idx + 1 }
      return s
    })

    useResumeStore.setState((state) => ({
      data: { ...state.data, sections: newSections }
    }))
    
    setDragOverIndex(null)
    dragIndexRef.current = null
  }, [dragIndexRef, setDragOverIndex])

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        className={`${styles.navBackdrop} ${mobileNavOpen ? styles.backdropOpen : ''}`} 
        onClick={closeMobileNav}
      />
      
      <nav className={`${styles.nav} ${mobileNavOpen ? styles.navOpen : ''}`}>
        <div className={styles.navHead}>
          <div className={styles.navHeadTitle}>
            <FileText size={18} className={styles.logoIcon} />
            <span>Customize Resume</span>
          </div>
          <button className={styles.mobileCloseBtn} onClick={closeMobileNav}>
            <X size={20} />
          </button>
        </div>
        
        <div className={styles.mobileHint}>Click on a section to edit its content.</div>

      
      <div className={styles.navList}>
        {staticSections.map((sec) => (
          <div
            key={sec.key}
            className={`${styles.navItem} ${activeSection === sec.key ? styles.active : ''} ${styles.done}`}
            onClick={() => !isRemoveMode && !isRearrangeMode && setActiveSection(sec.key)}
          >
            <span className={styles.navIcon}>{ICON_MAP[sec.key] || <FileText size={16} />}</span>
            <span className={styles.navLabel}>{sec.label}</span>
            {isRemoveMode ? (
              <span className={styles.lockedIcon} title="Cannot remove mandatory section">🔒</span>
            ) : (
              <CheckCircle2 size={13} className={styles.checkIcon} />
            )}
          </div>
        ))}

        {visibleDynamicKeys.map((key, index) => {
          const def = SECTION_DEFINITIONS.find(d => d.key === key)
          const label = key === 'summary' ? 'Summary' : def?.sectionLabel
          if (!label) return null
          return (
            <div
              key={key}
              className={`${styles.navItem} ${activeSection === key ? styles.active : ''} ${isComplete(key) ? styles.done : ''} ${isRearrangeMode ? styles.rearrangeActive : ''} ${dragOverIndex === index ? styles.dragOver : ''}`}
              onClick={() => !isRemoveMode && !isRearrangeMode && setActiveSection(key as any)}
              draggable={isRearrangeMode}
              onDragStart={isRearrangeMode ? (e) => handleDragStart(e, index) : undefined}
              onDragEnd={isRearrangeMode ? handleDragEnd : undefined}
              onDragOver={isRearrangeMode ? (e) => handleDragOver(e, index) : undefined}
              onDrop={isRearrangeMode ? (e) => handleDrop(e, index) : undefined}
            >
              {isRearrangeMode && (
                <GripVertical size={14} className={styles.dragHandleAlways} />
              )}
              <span className={styles.navIcon}>{ICON_MAP[key] || <FileText size={16} />}</span>
              <span className={styles.navLabel}>{label}</span>
              
              {!isRemoveMode && !isRearrangeMode && isComplete(key) && (
                <CheckCircle2 size={13} className={styles.checkIcon} />
              )}
              
              {isRemoveMode && (
                <button 
                  className={styles.deleteBtn}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (key !== 'summary') handleRemoveSection(key as SectionKey);
                  }}
                  title={key === 'summary' ? 'Hide Summary content to remove' : `Remove ${label}`}
                  disabled={key === 'summary'}
                  style={key === 'summary' ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className={styles.spacer} />

      <div className={styles.manageActions}>
        <button 
          className={styles.actionBtn} 
          onClick={() => { setAddModalOpen(true); setRemoveMode(false); setRearrangeMode(false); }}
        >
          <Plus size={14} /> Add Section
        </button>
        <button 
          className={`${styles.actionBtn} ${isRemoveMode ? styles.actionBtnActiveRed : ''}`} 
          onClick={() => { setRemoveMode(!isRemoveMode); setRearrangeMode(false); }}
        >
          <MinusCircle size={14} /> {isRemoveMode ? 'Done Removing' : 'Remove Section'}
        </button>
        <button 
          className={`${styles.actionBtn} ${isRearrangeMode ? styles.actionBtnActive : ''}`} 
          onClick={() => { setRearrangeMode(!isRearrangeMode); setRemoveMode(false); }}
        >
          <ArrowUpDown size={14} /> {isRearrangeMode ? 'Done Reordering' : 'Shuffle Layout'}
        </button>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Add a Section">
        {hiddenDynamicKeys.length === 0 ? (
          <p className={styles.emptyText}>You've added all available sections — nice!</p>
        ) : (
          <div className={styles.modalGrid}>
            {hiddenDynamicKeys.map((key) => {
              const label = key === 'summary' ? 'Professional Summary' : SECTION_DEFINITIONS.find(d => d.key === key)?.sectionLabel
              if (!label) return null
              return (
                <button key={key} className={styles.modalAddBtn} onClick={() => handleAddSection(key as any)}>
                  <div className={styles.modalAddIcon}>{ICON_MAP[key] || <FileText size={20} />}</div>
                  <span className={styles.modalAddLabel}>{label}</span>
                </button>
              )
            })}
          </div>
        )}
      </Modal>
      </nav>
    </>
  )
}
