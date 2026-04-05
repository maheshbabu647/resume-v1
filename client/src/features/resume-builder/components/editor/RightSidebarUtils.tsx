import { useState } from 'react'
import { BarChart3, Wand2, Settings, RotateCcw, RotateCw, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useEditorUIStore } from '../../store/useEditorUIStore'
import { useResumeStore } from '../../store/useResumeStore'
import { STYLE_PACKS } from '../../config/stylePacks'
import { DEFAULT_SPACING, DEFAULT_SIZING } from '../../templates/shared/buildCSSVars'
import { SECTION_ORDER_PRESETS } from '../../config/sectionOrder'
import type { SectionKey } from '../../templates/shared/template.types'
import { trackTemplateChanged } from '@/shared/lib/analytics'
import styles from './RightSidebarUtils.module.css'

type DrawerName = 'score' | 'jdfit' | 'style'

import { ResumeQualityDrawer } from '../../../scoring/components/ResumeQualityDrawer'
import { useResumeQualityScore } from '../../../scoring/hooks/useResumeQualityScore'
import { JDFitDrawer } from '../../../scoring/components/JDFitDrawer'// ─── ATS Score ───
const ScoreContent = () => {
  const scoreData = useResumeQualityScore()
  if (!scoreData) return <div className={styles.scoreTip} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-2)' }}>Evaluating...</div>
  return <ResumeQualityDrawer scoreData={scoreData} />
}

// ─── JD Tailor ───
const JDContent = () => <JDFitDrawer />

// ─── FONT OPTIONS ───
const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap' },
  { label: 'Lato', value: 'Lato', url: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap' },
  { label: 'Georgia', value: 'Georgia', url: '' },
  { label: 'Merriweather', value: 'Merriweather', url: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap' },
  { label: 'Roboto', value: 'Roboto', url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap' },
  { label: 'Open Sans', value: 'Open Sans', url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap' },
  { label: 'Playfair Display', value: 'Playfair Display', url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap' },
]

// ─── Customize Drawer ───
const StyleContent = () => {
  const customization = useResumeStore((s) => s.customization)
  const setTemplateStyle = useResumeStore((s) => s.setTemplateStyle)
  const setSpacing = useResumeStore((s) => s.setSpacing)
  const setSizing = useResumeStore((s) => s.setSizing)
  const setCustomization = useResumeStore((s) => s.setCustomization)

  const [showAdvanced, setShowAdvanced] = useState(false)

  const { stylePack, spacing, sizing } = customization

  const handleFontChange = (fontValue: string) => {
    const fontOpt = FONT_OPTIONS.find(f => f.value === fontValue)
    if (!fontOpt) return
    // Load the font if needed
    if (fontOpt.url) {
      const existing = document.querySelector(`link[href="${fontOpt.url}"]`)
      if (!existing) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = fontOpt.url
        document.head.appendChild(link)
      }
    }
    setCustomization({
      stylePack: { ...stylePack, fontFamily: fontOpt.value, fontImportUrl: fontOpt.url || undefined }
    })
  }

  const handleAccentChange = (color: string) => {
    setCustomization({
      stylePack: { ...stylePack, accentColor: color }
    })
  }

  // Spacing presets
  const spacingPresets = {
    Compact:  { sectionGap: 0.8,  entryGap: 0.5,  pagePadding: 28, bulletGap: 0.15 },
    Normal:   { ...DEFAULT_SPACING },
    Relaxed:  { sectionGap: 1.6,  entryGap: 1.0,  pagePadding: 44, bulletGap: 0.3 },
  }

  // Size presets
  const sizePresets = {
    Small:  { baseFontSize: 9.5,  nameFontSize: 18, sectionTitleSize: 11.5, entryTitleSize: 10.5, metaFontSize: 9,  lineHeight: 1.35 },
    Medium: { ...DEFAULT_SIZING },
    Large:  { baseFontSize: 11.5, nameFontSize: 22, sectionTitleSize: 14.5, entryTitleSize: 12.5, metaFontSize: 11, lineHeight: 1.5 },
  }

  const currentSpacingPreset = Object.entries(spacingPresets).find(
    ([, v]) => v.sectionGap === spacing.sectionGap && v.pagePadding === spacing.pagePadding
  )?.[0] || ''

  const currentSizePreset = Object.entries(sizePresets).find(
    ([, v]) => v.baseFontSize === sizing.baseFontSize && v.nameFontSize === sizing.nameFontSize
  )?.[0] || ''

  // Section order: reorder data.sections to match a preset
  const sections = useResumeStore((s) => s.data.sections)
  const handleSectionOrderPreset = (presetOrder: (SectionKey | 'summary')[]) => {
    // 1. Update the master sectionOrder in customization
    setCustomization({ sectionOrder: presetOrder as SectionKey[] })

    // 2. Also update internal order on data.sections for consistency if legacy logic relies on it
    const newSections = sections.map(s => {
      const idx = presetOrder.indexOf(s.key as any)
      return { ...s, order: idx === -1 ? 99 : idx + 1 }
    })
    
    useResumeStore.setState((state) => ({
      data: { ...state.data, sections: newSections }
    }))
  }

  return (
    <div className={styles.styleContent}>
      {/* Style Pack Preset */}
      <div className={styles.styleRow}>
        <span className={styles.styleLabel}>Style Preset</span>
        <div className={styles.presetGrid}>
          {STYLE_PACKS.map((pack) => (
            <button
              key={pack.key}
              className={`${styles.presetCard} ${stylePack.key === pack.key ? styles.presetCardActive : ''}`}
              onClick={() => {
                trackTemplateChanged(stylePack.key, pack.key)
                setTemplateStyle(pack.key)
              }}
            >
              <div className={styles.presetSwatch} style={{ background: pack.accentColor }} />
              <span className={styles.presetName}>{pack.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section Order Preset */}
      <div className={styles.styleRow}>
        <span className={styles.styleLabel}>Section Layout</span>
        <div className={styles.orderPresetList}>
          {SECTION_ORDER_PRESETS.map((preset) => (
            <button
              key={preset.key}
              className={styles.orderPresetBtn}
              onClick={() => handleSectionOrderPreset(preset.order)}
              title={preset.description}
            >
              <span className={styles.orderPresetName}>{preset.name}</span>
              <span className={styles.orderPresetDesc}>{preset.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accent Color */}
      <div className={styles.styleRow}>
        <span className={styles.styleLabel}>Accent Color</span>
        <input
          type="color"
          value={stylePack.accentColor}
          onChange={(e) => handleAccentChange(e.target.value)}
          className={styles.colorPicker}
        />
      </div>

      {/* Font Family */}
      <div className={styles.styleRow}>
        <span className={styles.styleLabel}>Font Family</span>
        <select
          className={styles.selectInput}
          value={stylePack.fontFamily}
          onChange={(e) => handleFontChange(e.target.value)}
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div className={styles.styleRow}>
        <span className={styles.styleLabel}>Text Size</span>
        <div className={styles.sizeButtons}>
          {Object.keys(sizePresets).map((s) => (
            <button
              key={s}
              className={`${styles.sizeBtn} ${currentSizePreset === s ? styles.sizeBtnActive : ''}`}
              onClick={() => setSizing(sizePresets[s as keyof typeof sizePresets])}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div className={styles.styleRow}>
        <span className={styles.styleLabel}>Spacing</span>
        <div className={styles.sizeButtons}>
          {Object.keys(spacingPresets).map((s) => (
            <button
              key={s}
              className={`${styles.sizeBtn} ${currentSpacingPreset === s ? styles.sizeBtnActive : ''}`}
              onClick={() => setSpacing(spacingPresets[s as keyof typeof spacingPresets])}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Section Toggle */}
      <button className={styles.advancedToggle} onClick={() => setShowAdvanced(!showAdvanced)}>
        {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        Advanced Customization
      </button>

      {showAdvanced && (
        <div className={styles.advancedSection}>
          {/* Individual font sizes */}
          <div className={styles.advRow}>
            <span className={styles.advLabel}>Name Size</span>
            <input type="range" min={14} max={28} step={0.5} value={sizing.nameFontSize}
              onChange={(e) => setSizing({ nameFontSize: Number(e.target.value) })} className={styles.slider} />
            <span className={styles.advVal}>{sizing.nameFontSize}pt</span>
          </div>
          <div className={styles.advRow}>
            <span className={styles.advLabel}>Section Title</span>
            <input type="range" min={9} max={18} step={0.5} value={sizing.sectionTitleSize}
              onChange={(e) => setSizing({ sectionTitleSize: Number(e.target.value) })} className={styles.slider} />
            <span className={styles.advVal}>{sizing.sectionTitleSize}pt</span>
          </div>
          <div className={styles.advRow}>
            <span className={styles.advLabel}>Body Text</span>
            <input type="range" min={8} max={14} step={0.5} value={sizing.baseFontSize}
              onChange={(e) => setSizing({ baseFontSize: Number(e.target.value) })} className={styles.slider} />
            <span className={styles.advVal}>{sizing.baseFontSize}pt</span>
          </div>
          <div className={styles.advRow}>
            <span className={styles.advLabel}>Line Height</span>
            <input type="range" min={1.0} max={2.0} step={0.05} value={sizing.lineHeight}
              onChange={(e) => setSizing({ lineHeight: Number(e.target.value) })} className={styles.slider} />
            <span className={styles.advVal}>{sizing.lineHeight.toFixed(2)}</span>
          </div>
          <div className={styles.advRow}>
            <span className={styles.advLabel}>Page Margin</span>
            <input type="range" min={16} max={56} step={2} value={spacing.pagePadding}
              onChange={(e) => setSpacing({ pagePadding: Number(e.target.value) })} className={styles.slider} />
            <span className={styles.advVal}>{spacing.pagePadding}px</span>
          </div>
          <div className={styles.advRow}>
            <span className={styles.advLabel}>Section Gap</span>
            <input type="range" min={0.4} max={2.4} step={0.1} value={spacing.sectionGap}
              onChange={(e) => setSpacing({ sectionGap: Number(e.target.value) })} className={styles.slider} />
            <span className={styles.advVal}>{spacing.sectionGap.toFixed(1)}rem</span>
          </div>
          <div className={styles.advRow}>
            <span className={styles.advLabel}>Entry Gap</span>
            <input type="range" min={0.2} max={1.5} step={0.05} value={spacing.entryGap}
              onChange={(e) => setSpacing({ entryGap: Number(e.target.value) })} className={styles.slider} />
            <span className={styles.advVal}>{spacing.entryGap.toFixed(2)}rem</span>
          </div>

          {/* Reset */}
          <button
            className={styles.resetBtn}
            onClick={() => {
              setSpacing(DEFAULT_SPACING)
              setSizing(DEFAULT_SIZING)
            }}
          >
            Reset to Defaults
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Drawer Definitions ───
interface DrawerDef {
  id: DrawerName
  icon: React.ReactNode
  tooltip: string
  title: string
  content: React.ReactNode
}

const DRAWERS: DrawerDef[] = [
  { id: 'score', icon: <BarChart3 size={20} />, tooltip: 'Resume Strength', title: 'Resume Strength', content: <ScoreContent /> },
  { id: 'jdfit', icon: <Wand2 size={20} />, tooltip: 'Match JD', title: 'Match JD', content: <JDContent /> },
  { id: 'style', icon: <Settings size={20} />, tooltip: 'Customize', title: 'Customize', content: <StyleContent /> },
]

export const RightSidebarUtils = () => {
  const activeDrawer = useEditorUIStore((s) => s.activeDrawer)
  const openDrawer = useEditorUIStore((s) => s.openDrawer)
  const closeDrawer = useEditorUIStore((s) => s.closeDrawer)

  const undo = useResumeStore((s) => s.undo)
  const redo = useResumeStore((s) => s.redo)
  const historyLen = useResumeStore((s) => s.history.length)
  const futureLen = useResumeStore((s) => s.future.length)

  const currentDrawer = DRAWERS.find((d) => d.id === activeDrawer)

  return (
    <>
      {/* Sliding Drawer */}
      {currentDrawer && (
        <div className={styles.drawer}>
          <div className={styles.drawerHead}>
            <h3 className={styles.drawerTitle}>{currentDrawer.title}</h3>
            <button className={styles.drawerClose} onClick={closeDrawer}><X size={16} /></button>
          </div>
          <div className={styles.drawerBody}>
            {currentDrawer.content}
          </div>
        </div>
      )}

      {/* Icon Sidebar */}
      <aside className={styles.sidebar}>
        <button
          className={`${styles.utilBtn} ${historyLen === 0 ? styles.utilBtnDisabled : ''}`}
          onClick={undo}
          title="Undo (Ctrl+Z)"
          disabled={historyLen === 0}
        >
          <RotateCcw size={18} />
        </button>
        <button
          className={`${styles.utilBtn} ${futureLen === 0 ? styles.utilBtnDisabled : ''}`}
          onClick={redo}
          title="Redo (Ctrl+Y)"
          disabled={futureLen === 0}
        >
          <RotateCw size={18} />
        </button>
        <div className={styles.divider} />
        {DRAWERS.map((d) => (
          <button
            key={d.id}
            className={`${styles.utilBtn} ${activeDrawer === d.id ? styles.utilBtnActive : ''}`}
            onClick={() => activeDrawer === d.id ? closeDrawer() : openDrawer(d.id as Parameters<typeof openDrawer>[0])}
            title={d.tooltip}
          >
            {d.icon}
          </button>
        ))}
      </aside>
    </>
  )
}
