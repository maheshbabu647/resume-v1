import { create } from 'zustand'
import type { SectionKey } from '../templates/shared/template.types'

type ActiveSectionType = SectionKey | 'personalInfo' | 'summary'
type RightPanelTab = 'style' | 'score'
type ScoreSubTab = 'strength' | 'fit'
type MobileViewMode = 'edit' | 'preview' | 'insights'

interface EditorUIStore {
  activeSection: ActiveSectionType
  leftNavCollapsed: boolean
  rightPanelTab: RightPanelTab
  rightPanelCollapsed: boolean
  scoreSubTab: ScoreSubTab
  previewScale: number
  isSaving: boolean
  showTemplateGallery: boolean
  showExamplesPanel: boolean
  isDirty: boolean

  // Mobile responsive state
  mobileViewMode: MobileViewMode
  mobileNavOpen: boolean
  globalNavOpen: boolean

  setDirty: (dirty: boolean) => void
  setActiveSection: (key: ActiveSectionType) => void
  toggleLeftNavCollapsed: () => void
  setRightPanelTab: (tab: RightPanelTab) => void
  toggleRightPanelCollapsed: () => void
  setScoreSubTab: (tab: ScoreSubTab) => void
  setSaving: (saving: boolean) => void
  toggleTemplateGallery: () => void
  toggleExamplesPanel: () => void
  setMobileViewMode: (mode: MobileViewMode) => void
  toggleMobileNav: () => void
  closeMobileNav: () => void
  toggleGlobalNav: () => void
  closeGlobalNav: () => void
}

export const useEditorUIStore = create<EditorUIStore>()((set) => ({
  activeSection: 'personalInfo',
  leftNavCollapsed: false,
  rightPanelTab: 'style',
  rightPanelCollapsed: false,
  scoreSubTab: 'strength',
  previewScale: 1,
  isSaving: false,
  showTemplateGallery: false,
  showExamplesPanel: false,
  isDirty: false,

  mobileViewMode: 'edit',
  mobileNavOpen: false,
  globalNavOpen: false,

  setDirty: (dirty) => set({ isDirty: dirty }),
  setActiveSection: (key) => set({ activeSection: key, showExamplesPanel: false, mobileNavOpen: false, mobileViewMode: 'edit' }), // Close nav & switch to edit view on select
  toggleLeftNavCollapsed: () => set((s) => ({ leftNavCollapsed: !s.leftNavCollapsed })),
  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
  toggleRightPanelCollapsed: () => set((s) => ({ rightPanelCollapsed: !s.rightPanelCollapsed })),
  setScoreSubTab: (tab) => set({ scoreSubTab: tab }),
  setSaving: (saving) => set({ isSaving: saving }),
  toggleTemplateGallery: () => set((s) => ({ showTemplateGallery: !s.showTemplateGallery })),
  toggleExamplesPanel: () => set((s) => ({ showExamplesPanel: !s.showExamplesPanel })),

  setMobileViewMode: (mode) => set({ mobileViewMode: mode }),
  toggleMobileNav: () => set((s) => ({ mobileNavOpen: !s.mobileNavOpen, globalNavOpen: false })),
  closeMobileNav: () => set({ mobileNavOpen: false }),
  toggleGlobalNav: () => set((s) => ({ globalNavOpen: !s.globalNavOpen, mobileNavOpen: false })),
  closeGlobalNav: () => set({ globalNavOpen: false }),
}))

