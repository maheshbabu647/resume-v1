import { X, Lightbulb, Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react'
import { Input } from '@/shared/components/Input/Input'
import { Textarea } from '@/shared/components/Textarea/Textarea'
import { AiTextarea } from './AiTextarea'
import { useEditorUIStore } from '../../store/useEditorUIStore'
import { useResumeStore } from '../../store/useResumeStore'
import { SECTION_DEFINITIONS, type FieldDefinition } from '../../config/fieldDefinitions'
import { SECTION_TIPS } from '../../config/sectionTips'
import { ICON_MAP } from '../../config/icons'
import type { SectionKey } from '../../templates/shared/template.types'
import styles from './FormPanel.module.css'

const PersonalForm = () => {
  const info = useResumeStore((s) => s.data.personalInfo)
  const set = useResumeStore((s) => s.setPersonalField)
  
  // Find definition for contact (sharing personalInfo)
  const contactDef = SECTION_DEFINITIONS.find(d => d.key === 'contact' as any)

  return (
    <div className={styles.form}>
      <div className={styles.fieldRow}>
        <Input label="Full Name" value={info.fullName} onChange={(e) => set('fullName', e.target.value)} />
        <Input label="Professional Headline" value={info.title} onChange={(e) => set('title', e.target.value)} />
      </div>
      <div className={styles.fieldRow}>
        <Input label="Email Address" type="email" value={info.email} onChange={(e) => set('email', e.target.value)} />
        <Input label="Phone Number" value={info.phone} onChange={(e) => set('phone', e.target.value)} />
      </div>
      <Input label="Location (City, State)" value={info.location} onChange={(e) => set('location', e.target.value)} />
      
      {contactDef?.fields.filter(f => f.type === 'group').map(f => (
        <GroupFieldRenderer 
          key={f.name} 
          field={f} 
          value={info[f.name as keyof typeof info] as any[] || []} 
          onChange={(val) => set(f.name as any, val)} 
        />
      ))}
    </div>
  )
}

const SummaryForm = () => {
  const info = useResumeStore((s) => s.data.personalInfo)
  const set = useResumeStore((s) => s.setPersonalField)
  return (
    <div className={styles.form}>
      <AiTextarea
        label="Professional Summary"
        sectionKey="profile"
        fieldName="summary"
        currentValue={info.summary || ''}
        contextFields={{ fullName: info.fullName || '', title: info.title || '' }}
        onValueChange={(val) => set('summary', val)}
        placeholder="Results-driven professional with..."
      />
      <p className={styles.hint}>2–4 sentences. Lead with your role, years of experience, and biggest strength.</p>
    </div>
  )
}

const renderField = (f: FieldDefinition, val: string, onChange: (val: string) => void, sectionKey?: string, entry?: any) => {
  if (f.type === 'textarea') {
    if (f.aiConfig && sectionKey) {
      const contextFields: Record<string, string> = {}
      f.aiConfig.contextFields.forEach(cf => {
        contextFields[cf] = entry?.[cf] || ''
      })
      return (
        <AiTextarea 
          label={f.label} 
          sectionKey={sectionKey} 
          fieldName={f.name} 
          currentValue={val} 
          contextFields={contextFields} 
          onValueChange={onChange} 
          placeholder={f.placeholder} 
        />
      )
    }
    return <Textarea label={f.label} value={val} onChange={(e) => onChange(e.target.value)} rows={f.rows || 3} placeholder={f.placeholder} />
  }
  return <Input label={f.label} type={f.type === 'text' ? 'text' : f.type} value={val} onChange={(e) => onChange(e.target.value)} placeholder={f.placeholder} />
}

const GroupFieldRenderer = ({ field, value, onChange }: { field: FieldDefinition, value: any[], onChange: (val: any[]) => void }) => {
  const items = value || []
  
  const updateItem = (idx: number, subFieldName: string, subVal: string) => {
    const newItems = [...items]
    newItems[idx] = { ...newItems[idx], [subFieldName]: subVal }
    onChange(newItems)
  }

  const addItem = () => onChange([...items, {}])
  const removeItem = (idx: number) => onChange(items.filter((_, i) => i !== idx))

  return (
    <div className={styles.groupField}>
      <label className={styles.groupLabel}>{field.label}</label>
      <div className={styles.groupItems}>
        {items.map((item, idx) => (
          <div key={idx} className={styles.groupItem}>
            <div className={styles.groupItemFields}>
              {field.subFields?.map(sf => (
                <div key={sf.name} className={styles.subField}>
                  {renderField(sf, item[sf.name] || '', (v) => updateItem(idx, sf.name, v), undefined, undefined)}
                </div>
              ))}
            </div>
            <button className={styles.removeSubBtn} onClick={() => removeItem(idx)}>
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        <button className={styles.addSubBtn} onClick={addItem}>
          <Plus size={12} /> Add {field.singularLabel || 'Item'}
        </button>
      </div>
    </div>
  )
}

const DynamicSectionForm = ({ sectionKey }: { sectionKey: SectionKey }) => {
  const def = SECTION_DEFINITIONS.find(d => d.key === sectionKey)
  const sectionData = useResumeStore(s => s.data.sections.find(sec => sec.key === sectionKey))
  const entries = sectionData?.entries || []
  
  const addEntry = useResumeStore(s => s.addSectionEntry)
  const updateEntries = useResumeStore(s => s.updateSectionEntries)
  const removeEntry = useResumeStore(s => s.removeSectionEntry)

  if (!def) return <p>Section definitions missing.</p>

  const updateField = (idx: number, fieldName: string, value: string) => {
    const newEntries = [...entries]
    newEntries[idx] = { ...newEntries[idx], [fieldName]: value }
    updateEntries(sectionKey, newEntries)
  }

  return (
    <div className={styles.form}>
      {entries.map((entry, idx) => (
        <div key={idx} className={styles.entry}>
          <div className={styles.entryHeader}>
            <span className={styles.entryNum}>{def.sectionLabel.toUpperCase()} #{idx + 1}</span>
            <button className={styles.removeBtn} onClick={() => removeEntry(sectionKey, idx)}>
              <Trash2 size={13} /> Remove
            </button>
          </div>
          <div className={styles.entryFields}>
            {def.fields.map(f => {
              if (f.type === 'group') {
                return (
                  <div key={f.name} style={{ gridColumn: 'span 2' }}>
                    <GroupFieldRenderer 
                      field={f} 
                      value={entry[f.name] || []} 
                      onChange={(v) => updateField(idx, f.name, v as any)} 
                    />
                  </div>
                )
              }
              const isFullW = f.type === 'textarea'
              return (
                <div key={f.name} style={{ gridColumn: isFullW ? 'span 2' : 'span 1' }}>
                  {renderField(f, entry[f.name] ?? '', (v) => updateField(idx, f.name, v), sectionKey, entry)}
                </div>
              )
            })}
          </div>
        </div>
      ))}
      <button className={styles.addBtn} onClick={() => addEntry(sectionKey, {})}>
        <Plus size={14} /> Add {def.singularLabel || def.sectionLabel}
      </button>
    </div>
  )
}

export default function FormPanel() {
  const activeSection = useEditorUIStore((s) => s.activeSection)
  const setActiveSection = useEditorUIStore((s) => s.setActiveSection)
  const showExamples = useEditorUIStore((s) => s.showExamplesPanel)
  const toggleExamples = useEditorUIStore((s) => s.toggleExamplesPanel)
  const mobileViewMode = useEditorUIStore((s) => s.mobileViewMode)

  const sectionOrder = useResumeStore((s) => s.customization.sectionOrder)
  const personalInfo = useResumeStore((s) => s.data.personalInfo)

  const updateSectionName = useResumeStore((s) => s.updateSectionName)
  const setPersonalField = useResumeStore((s) => s.setPersonalField)
  const summaryLabel = useResumeStore((s) => s.data.personalInfo.summaryLabel)
  const def = SECTION_DEFINITIONS.find(d => d.key === activeSection)
  const defaultLabel = def?.sectionLabel || 'Section'
  const sectionData = useResumeStore(s => s.data.sections.find(sec => sec.key === activeSection))
  
  const label = activeSection === 'personalInfo' ? 'Personal Info' :
                activeSection === 'summary' ? 'Summary' :
                defaultLabel

  const tipsKey = activeSection === 'personalInfo' ? 'profile' : activeSection
  const tipsData = SECTION_TIPS[tipsKey]

  return (
    <div className={`${styles.panel} ${mobileViewMode !== 'edit' ? styles.hiddenOnMobile : ''}`}>
      {/* Horizontal Pill Navigator for Mobile */}
      <div className={styles.sectionNavigator}>
        <div className={styles.pillTrack}>
          {sectionOrder.map((key) => {
            // Summary is only visible if it's in use
            if (key === 'summary' as any && !personalInfo.summary) return null
            
            const def = SECTION_DEFINITIONS.find((d) => d.key === key)
            const isPersonalInfo = (key as unknown as string) === 'personalInfo'
            const label = isPersonalInfo ? 'Personal' : (key === 'summary' ? 'Summary' : def?.sectionLabel)
            const icon = ICON_MAP[key as SectionKey | 'personalInfo' | 'summary']
            
            return (
              <button
                key={key}
                className={`${styles.sectionPill} ${activeSection === key ? styles.pillActive : ''}`}
                onClick={() => setActiveSection(key as any)}
              >
                {icon}
                <span>{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className={styles.panelHead}>
        <div className={styles.headLeft}>
          {activeSection === 'summary' ? (
            <input
              className={styles.panelTitleInput}
              value={summaryLabel ?? 'Summary'}
              onChange={(e) => setPersonalField('summaryLabel', e.target.value)}
              placeholder="Summary"
            />
          ) : activeSection !== 'personalInfo' && sectionData ? (
            <input
              className={styles.panelTitleInput}
              value={sectionData.name ?? defaultLabel}
              onChange={(e) => updateSectionName(activeSection as SectionKey, e.target.value)}
              placeholder={defaultLabel}
            />
          ) : (
            <h2 className={styles.panelTitle}>{label}</h2>
          )}
        </div>
        <button className={styles.examplesBtn} onClick={toggleExamples}>
          <Lightbulb size={12} /> Tips
        </button>
      </div>

      <div className={styles.panelBody}>
        {activeSection === 'personalInfo' && <PersonalForm />}
        {activeSection === 'summary' && <SummaryForm />}
        {activeSection !== 'personalInfo' && activeSection !== 'summary' && (
          <DynamicSectionForm sectionKey={activeSection as SectionKey} />
        )}

        {/* Form Navigation Buttons (Previous / Next) */}
        {(() => {
          const sections = useResumeStore.getState().data.sections
          const allPotentialKeys = ['personalInfo' as any, ...sectionOrder]
          const visibleSections = allPotentialKeys.filter(key => {
            if (key === 'personalInfo' as any) return true
            if (key === 'summary' as any) return !!personalInfo.summary
            const sec = sections.find(s => s.key === key)
            return sec?.visible
          })
          
          const currentIndex = visibleSections.indexOf(activeSection as any)
          const prevKey = visibleSections[currentIndex - 1]
          const nextKey = visibleSections[currentIndex + 1]
          
          if (!prevKey && !nextKey) return null
          
          const handleNav = (key: any) => {
            setActiveSection(key)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }

          return (
            <div className={styles.formNavigation}>
              {prevKey ? (
                <button 
                  className={styles.navBtn} 
                  onClick={() => handleNav(prevKey)}
                  title="Previous Section"
                >
                  <ArrowLeft size={18} />
                </button>
              ) : <div />}
              
              {nextKey && (
                <button 
                  className={styles.navBtn} 
                  onClick={() => handleNav(nextKey)}
                  title="Next Section"
                >
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          )
        })()}
      </div>

      <div className={`${styles.examplesPanel} ${showExamples ? styles.examplesOpen : ''}`}>
        <div className={styles.examplesHead}>
          <span className={styles.examplesTitle}><Lightbulb size={14} /> Tips</span>
          <button className={styles.examplesClose} onClick={toggleExamples}><X size={16} /></button>
        </div>
        <div className={styles.examplesBody}>
          {tipsData ? (
            <>
              <p className={styles.tipPurpose}>{tipsData.purpose}</p>
              
              <span className={styles.sectionLabelTag}>Pro Tips</span>
              <ul className={styles.tipsList}>
                {tipsData.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>

              <span className={styles.sectionLabelTag}>Examples</span>
              {tipsData.examples.map((ex, i) => (
                <div key={i} className={`${styles.tipCard} ${styles[ex.type]}`}>
                  {ex.title && <strong>{ex.title}</strong>}
                  <div style={{ whiteSpace: 'pre-wrap' }}>{ex.content}</div>
                </div>
              ))}
            </>
          ) : (
            <div className={styles.tipCard}>
              Select a section to see specific tips and examples here.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
