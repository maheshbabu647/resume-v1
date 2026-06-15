import { useState } from 'react'
import { ChevronDown, ChevronUp, Settings } from 'lucide-react'
import { useResumeStore } from '../../store/useResumeStore'
import { STYLE_PACKS } from '../../config/stylePacks'
import { DEFAULT_SPACING, DEFAULT_SIZING } from '../../templates/shared/buildCSSVars'
import { SECTION_ORDER_PRESETS } from '../../config/sectionOrder'
import type { SectionKey } from '../../templates/shared/template.types'
import { trackTemplateChanged } from '@/shared/lib/analytics'
import styles from './StylePanelContent.module.css'

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

function SubLabel({ children }: { children: React.ReactNode }) {
  return <div className={styles.subLabel}>{children}</div>
}

function SegmentedControl({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className={styles.segmented}>
      {options.map((o) => (
        <button
          key={o}
          className={`${styles.segmentBtn} ${value === o ? styles.segmentBtnActive : ''}`}
          onClick={() => onChange(o)}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

export default function StylePanelContent() {
  const customization = useResumeStore((s) => s.customization)
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

  const handlePaletteChange = (packKey: string) => {
    const pack = STYLE_PACKS.find((p) => p.key === packKey)
    if (!pack) return
    trackTemplateChanged(stylePack.key, pack.key)
    setCustomization({
      stylePack: { ...stylePack, key: pack.key, accentColor: pack.accentColor }
    })
  }

  // Spacing presets
  const spacingPresets = {
    Compact: { sectionGap: 0.8, entryGap: 0.5, pagePadding: 28, bulletGap: 0.15 },
    Normal: { ...DEFAULT_SPACING },
    Relaxed: { sectionGap: 1.6, entryGap: 1.0, pagePadding: 44, bulletGap: 0.3 },
  }

  // Size presets
  const sizePresets = {
    Small: { baseFontSize: 9.5, nameFontSize: 18, sectionTitleSize: 11.5, entryTitleSize: 10.5, metaFontSize: 9, lineHeight: 1.35 },
    Medium: { ...DEFAULT_SIZING },
    Large: { baseFontSize: 11.5, nameFontSize: 22, sectionTitleSize: 14.5, entryTitleSize: 12.5, metaFontSize: 11, lineHeight: 1.5 },
  }

  const currentSpacingPreset = Object.entries(spacingPresets).find(
    ([, v]) => v.sectionGap === spacing.sectionGap && v.pagePadding === spacing.pagePadding
  )?.[0] || 'Normal'

  const currentSizePreset = Object.entries(sizePresets).find(
    ([, v]) => v.baseFontSize === sizing.baseFontSize && v.nameFontSize === sizing.nameFontSize
  )?.[0] || 'Medium'

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
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Style</h2>
        <p className={styles.subtitle}>Visual changes apply instantly to the preview.</p>
      </div>

      {/* Color palette */}
      <SubLabel>Color Palette</SubLabel>
      <div className={styles.paletteGrid}>
        {STYLE_PACKS.map((pack) => (
          <button
            key={pack.key}
            title={pack.name}
            className={`${styles.paletteSwatch} ${stylePack.key === pack.key ? styles.paletteSwatchActive : ''}`}
            onClick={() => handlePaletteChange(pack.key)}
          >
            <span className={styles.swatchAccent} style={{ background: pack.accentColor }} />
            <span className={styles.swatchDark} />
            <span className={styles.swatchLight} />
          </button>
        ))}
      </div>

      {/* Accent color */}
      <SubLabel>Accent Color</SubLabel>
      <input
        type="color"
        value={stylePack.accentColor}
        onChange={(e) => handleAccentChange(e.target.value)}
        className={styles.colorPicker}
      />

      {/* Font */}
      <SubLabel>Font</SubLabel>
      <div className={styles.fontGrid}>
        {FONT_OPTIONS.map((f) => (
          <button
            key={f.value}
            className={`${styles.fontBtn} ${stylePack.fontFamily === f.value ? styles.fontBtnActive : ''}`}
            style={{ fontFamily: f.value }}
            onClick={() => handleFontChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Size */}
      <SubLabel>Size</SubLabel>
      <SegmentedControl
        options={Object.keys(sizePresets)}
        value={currentSizePreset}
        onChange={(s) => setSizing(sizePresets[s as keyof typeof sizePresets])}
      />

      {/* Spacing */}
      <SubLabel>Spacing</SubLabel>
      <SegmentedControl
        options={Object.keys(spacingPresets)}
        value={currentSpacingPreset}
        onChange={(s) => setSpacing(spacingPresets[s as keyof typeof spacingPresets])}
      />

      {/* Section order */}
      <SubLabel>Section Order</SubLabel>
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

      {/* Advanced */}
      <button className={styles.advancedToggle} onClick={() => setShowAdvanced((a) => !a)}>
        <span className={styles.advancedToggleLabel}>
          <Settings size={13} />
          Advanced
        </span>
        {showAdvanced ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {showAdvanced && (
        <div className={styles.advancedSection}>
          <Slider label="Name Size" value={sizing.nameFontSize} min={14} max={28} step={0.5} unit="pt"
            onChange={(v) => setSizing({ nameFontSize: v })} />
          <Slider label="Section Title" value={sizing.sectionTitleSize} min={9} max={18} step={0.5} unit="pt"
            onChange={(v) => setSizing({ sectionTitleSize: v })} />
          <Slider label="Body Text" value={sizing.baseFontSize} min={8} max={14} step={0.5} unit="pt"
            onChange={(v) => setSizing({ baseFontSize: v })} />
          <Slider label="Line Height" value={sizing.lineHeight} min={1.0} max={2.0} step={0.05} unit="" decimals={2}
            onChange={(v) => setSizing({ lineHeight: v })} />
          <Slider label="Page Margin" value={spacing.pagePadding} min={16} max={56} step={2} unit="px"
            onChange={(v) => setSpacing({ pagePadding: v })} />
          <Slider label="Section Gap" value={spacing.sectionGap} min={0.4} max={2.4} step={0.1} unit="rem" decimals={1}
            onChange={(v) => setSpacing({ sectionGap: v })} />
          <Slider label="Entry Gap" value={spacing.entryGap} min={0.2} max={1.5} step={0.05} unit="rem" decimals={2}
            onChange={(v) => setSpacing({ entryGap: v })} />

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

function Slider({ label, value, min, max, step = 1, unit = '', decimals, onChange }: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  decimals?: number
  onChange: (value: number) => void
}) {
  const display = decimals != null ? value.toFixed(decimals) : value
  return (
    <div className={styles.sliderRow}>
      <div className={styles.sliderHead}>
        <span className={styles.sliderLabel}>{label}</span>
        <span className={styles.sliderVal}>{display}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={styles.slider}
      />
    </div>
  )
}
