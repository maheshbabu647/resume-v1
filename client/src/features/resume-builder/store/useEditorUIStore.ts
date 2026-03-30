import { create } from 'zustand'
import type { SectionKey } from '../templates/shared/template.types'

type ActiveSectionType = SectionKey | 'personalInfo' | 'summary'
type DrawerName = 'score' | 'jdfit' | 'style' | null

interface EditorUIStore {
  activeSection: ActiveSectionType
  activeDrawer: DrawerName
  previewScale: number
  isSaving: boolean
  showTemplateGallery: boolean
  showExamplesPanel: boolean
  isDirty: boolean
  
  // Mobile responsive state
  mobileViewMode: 'edit' | 'preview'
  mobileNavOpen: boolean
  globalNavOpen: boolean
  
  setDirty: (dirty: boolean) => void
  setActiveSection: (key: ActiveSectionType) => void
  openDrawer: (name: DrawerName) => void
  closeDrawer: () => void
  setSaving: (saving: boolean) => void
  toggleTemplateGallery: () => void
  toggleExamplesPanel: () => void
  setMobileViewMode: (mode: 'edit' | 'preview') => void
  toggleMobileNav: () => void
  closeMobileNav: () => void
  toggleGlobalNav: () => void
  closeGlobalNav: () => void
}

export const useEditorUIStore = create<EditorUIStore>()((set) => ({
  activeSection: 'personalInfo',
  activeDrawer: null,
  previewScale: 1,
  isSaving: false,
  showTemplateGallery: false,
  showExamplesPanel: false,
  isDirty: false,
  
  mobileViewMode: 'edit',
  mobileNavOpen: false,
  globalNavOpen: false,

  setDirty: (dirty) => set({ isDirty: dirty }),
  setActiveSection: (key) => set({ activeSection: key, showExamplesPanel: false, mobileNavOpen: false, mobileViewMode: 'edit' }), // Auto-switch to edit & close nav on select
  openDrawer: (name) => set({ activeDrawer: name }),
  closeDrawer: () => set({ activeDrawer: null }),
  setSaving: (saving) => set({ isSaving: saving }),
  toggleTemplateGallery: () => set((s) => ({ showTemplateGallery: !s.showTemplateGallery })),
  toggleExamplesPanel: () => set((s) => ({ showExamplesPanel: !s.showExamplesPanel })),
  
  setMobileViewMode: (mode) => set({ mobileViewMode: mode }),
  toggleMobileNav: () => set((s) => ({ mobileNavOpen: !s.mobileNavOpen, globalNavOpen: false })),
  closeMobileNav: () => set({ mobileNavOpen: false }),
  toggleGlobalNav: () => set((s) => ({ globalNavOpen: !s.globalNavOpen, mobileNavOpen: false })),
  closeGlobalNav: () => set({ globalNavOpen: false }),
}))

