import { create } from 'zustand'
import type { SectionKey, ResumeData, CustomizationConfig } from '../templates/shared/template.types'
import { DEFAULT_STYLE_PACK_KEY, getStylePack } from '../config/stylePacks'
import { DEFAULT_SPACING, DEFAULT_SIZING } from '../templates/shared/buildCSSVars'
import { SECTION_DEFINITIONS } from '../config/fieldDefinitions'

interface ResumeState {
  resumeId: string | null
  templateId: string
  title: string
  data: ResumeData
  customization: CustomizationConfig
  
  // History for undo/redo
  history: ResumeData[]
  future: ResumeData[]
  
  // Actions
  setResumeId: (id: string) => void
  setTemplateId: (id: string) => void
  setTitle: (title: string) => void
  setPersonalField: (field: string, value: any) => void
  setTemplateStyle: (stylePackKey: string) => void
  setSpacing: (spacing: Partial<CustomizationConfig['spacing']>) => void
  setSizing: (sizing: Partial<CustomizationConfig['sizing']>) => void
  setCustomization: (config: Partial<CustomizationConfig>) => void
  updateSectionName: (sectionKey: SectionKey, name: string) => void
  updateSectionEntries: (sectionKey: SectionKey, entries: any[]) => void
  addSectionEntry: (sectionKey: SectionKey, entry: any) => void
  removeSectionEntry: (sectionKey: SectionKey, index: number) => void
  reorderSections: (newOrder: SectionKey[]) => void
  toggleSectionVisibility: (sectionKey: SectionKey, visible: boolean) => void
  undo: () => void
  redo: () => void
  snapshot: () => void
  loadResume: (resume: any | null) => void
}

const defaultData: ResumeData = {
  personalInfo: {
    fullName: '',
    title: '',
    summary: '',
    email: '',
    phone: '',
    location: '',
    contactLinks: []
  },
  sections: [
    { key: 'experience', visible: true, order: 1, entries: [] },
    { key: 'education', visible: true, order: 2, entries: [] },
    { key: 'skills', visible: true, order: 3, entries: [] }
  ]
}

const ALL_SECTION_KEYS: SectionKey[] = [
  'summary' as any,
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'awards',
  'languages',
  'volunteering',
  'publications',
  'presentations',
  'licensure',
  'barAdmissions',
  'memberships',
  'clinicalExperience',
  'grants',
  'teachingExperience',
  'securityClearance',
  'internships',
  'events',
  'custom'
]

const defaultCustomization: CustomizationConfig = {
  stylePack: getStylePack(DEFAULT_STYLE_PACK_KEY),
  spacing: DEFAULT_SPACING,
  sizing: DEFAULT_SIZING,
  sectionOrder: ALL_SECTION_KEYS
}

export const useResumeStore = create<ResumeState>((set, _get) => {
  // Helper: push current data onto history before mutation
  const withSnapshot = (mutator: (state: ResumeState) => Partial<ResumeState>) => 
    set((state) => ({
      history: [...state.history.slice(-19), structuredClone(state.data)],
      future: [],
      ...mutator(state)
    }))

  return {
    resumeId: null,
    templateId: 'modern-centered',
    title: 'Untitled Resume',
    data: defaultData,
    customization: defaultCustomization,
    history: [] as ResumeData[],
    future: [] as ResumeData[],

    snapshot: () => set((state) => ({
      history: [...state.history.slice(-19), structuredClone(state.data)],
      future: []
    })),

    setTemplateId: (id: string) => set({ templateId: id }),

    undo: () => set((state) => {
      if (state.history.length === 0) return state
      const prev = state.history[state.history.length - 1]
      return {
        data: prev,
        history: state.history.slice(0, -1),
        future: [structuredClone(state.data), ...state.future.slice(0, 19)]
      }
    }),

    redo: () => set((state) => {
      if (state.future.length === 0) return state
      const next = state.future[0]
      return {
        data: next,
        history: [...state.history, structuredClone(state.data)],
        future: state.future.slice(1)
      }
    }),

    setResumeId: (id) => set({ resumeId: id }),
    setTitle: (title) => set({ title }),

    loadResume: (resume) => {
      if (!resume) {
        set({
          resumeId: null,
          title: 'Untitled Resume',
          data: defaultData,
          customization: defaultCustomization,
          history: [],
          future: []
        })
        return
      }

      const safeCustomization = {
        stylePack: resume.customization?.stylePack || defaultCustomization.stylePack,
        spacing: resume.customization?.spacing || defaultCustomization.spacing,
        sizing: resume.customization?.sizing || defaultCustomization.sizing,
        sectionOrder: resume.customization?.sectionOrder || defaultCustomization.sectionOrder,
      }

      // Ensure all keys are present in sectionOrder even if loading an old resume
      const loadedOrder = resume.customization?.sectionOrder || defaultCustomization.sectionOrder
      const mergedOrder = [...new Set([...loadedOrder, ...ALL_SECTION_KEYS])]

      set({
        resumeId: resume._id,
        templateId: resume.templateId || 'modern-centered',
        title: resume.title || 'Untitled Resume',
        data: {
          personalInfo: { ...defaultData.personalInfo, ...(resume.personalInfo || {}) },
          sections: resume.sections?.length ? resume.sections : defaultData.sections,
        },
        customization: {
          ...safeCustomization,
          sectionOrder: mergedOrder
        },
        history: [],
        future: []
      })
    },

    setPersonalField: (field, value) => withSnapshot((state) => ({
      data: {
        ...state.data,
        personalInfo: {
          ...state.data.personalInfo,
          [field]: value
        }
      }
    })),

    setTemplateStyle: (stylePackKey) => set((state) => ({
      customization: {
        ...state.customization,
        stylePack: getStylePack(stylePackKey)
      }
    })),

    setSpacing: (spacing) => set((state) => ({
      customization: {
        ...state.customization,
        spacing: { ...state.customization.spacing, ...spacing }
      }
    })),

    setSizing: (sizing) => set((state) => ({
      customization: {
        ...state.customization,
        sizing: { ...state.customization.sizing, ...sizing }
      }
    })),

    setCustomization: (config) => set((state) => ({
      customization: { ...state.customization, ...config }
    })),

    updateSectionName: (sectionKey, name) => withSnapshot((state) => ({
      data: {
        ...state.data,
        sections: state.data.sections.map((sec) => 
          sec.key === sectionKey ? { ...sec, name } : sec
        )
      }
    })),

    updateSectionEntries: (sectionKey, entries) => withSnapshot((state) => ({
      data: {
        ...state.data,
        sections: state.data.sections.map(s => 
          s.key === sectionKey ? { ...s, entries } : s
        )
      }
    })),

    addSectionEntry: (sectionKey, entry) => withSnapshot((state) => ({
      data: {
        ...state.data,
        sections: state.data.sections.map(s => 
          s.key === sectionKey ? { ...s, entries: [...s.entries, entry] } : s
        )
      }
    })),

    removeSectionEntry: (sectionKey, index) => withSnapshot((state) => ({
      data: {
        ...state.data,
        sections: state.data.sections.map(s => 
          s.key === sectionKey ? { ...s, entries: s.entries.filter((_, i) => i !== index) } : s
        )
      }
    })),

    reorderSections: (newOrder) => set((state) => ({
      customization: {
        ...state.customization,
        sectionOrder: newOrder
      }
    })),

    toggleSectionVisibility: (sectionKey, visible) => set((state) => {
      const snap = {
        history: [...state.history.slice(-19), structuredClone(state.data)],
        future: [] as ResumeData[]
      }
      const exists = state.data.sections.some(s => s.key === sectionKey)
      
      if (visible && !exists) {
        const def = SECTION_DEFINITIONS.find(d => d.key === sectionKey)
        const blankEntry: Record<string, any> = {}
        if (def) {
          for (const f of def.fields) {
            blankEntry[f.name] = f.type === 'group' && f.repeatable ? [] : ''
          }
        }
        return {
          ...snap,
          data: {
            ...state.data,
            sections: [
              ...state.data.sections,
              { key: sectionKey, visible: true, order: state.data.sections.length + 1, entries: [blankEntry] }
            ]
          }
        }
      }
      
      if (!visible) {
        return {
          ...snap,
          data: {
            ...state.data,
            sections: state.data.sections.map(s =>
              s.key === sectionKey ? { ...s, visible: false } : s
            )
          }
        }
      }
      
      const sec = state.data.sections.find(s => s.key === sectionKey)
      if (sec && sec.entries.length === 0) {
        const def = SECTION_DEFINITIONS.find(d => d.key === sectionKey)
        const blankEntry: Record<string, any> = {}
        if (def) {
          for (const f of def.fields) {
            blankEntry[f.name] = f.type === 'group' && f.repeatable ? [] : ''
          }
        }
        return {
          ...snap,
          data: {
            ...state.data,
            sections: state.data.sections.map(s =>
              s.key === sectionKey ? { ...s, visible: true, entries: [blankEntry] } : s
            )
          }
        }
      }
      
      return {
        ...snap,
        data: {
          ...state.data,
          sections: state.data.sections.map(s =>
            s.key === sectionKey ? { ...s, visible } : s
          )
        }
      }
    })
  }
})
