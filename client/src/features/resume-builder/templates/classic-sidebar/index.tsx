import React, { useEffect } from 'react'
import type { TemplateProps, ResumeSection } from '../shared/template.types'
import { buildCSSVars } from '../shared/buildCSSVars'
import { SECTION_COMPONENTS, SummarySection } from './sections'
import { sanitizeUrl } from '../shared/utils'
import styles from './ClassicSidebar.module.css'

/* ─── Sidebar Contact Panel ─── */
const SidebarContact = ({ personalInfo }: { personalInfo: TemplateProps['data']['personalInfo'] }) => {
  const { email, phone, location, contactLinks } = personalInfo
  return (
    <div className={styles.sidebarSection}>
      <h3 className={styles.sidebarSectionTitle}>Contact</h3>
      {email && <div className={styles.sidebarItem}><a href={`mailto:${email}`}>{email}</a></div>}
      {phone && <div className={styles.sidebarItem}><a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a></div>}
      {location && <div className={styles.sidebarItem}>{location}</div>}
      {contactLinks?.map((link, i) => (
        <div key={i} className={styles.sidebarItem}>
          <a href={sanitizeUrl(link.url)}>{link.text}</a>
        </div>
      ))}
    </div>
  )
}

/* ─── Sidebar Skills ─── */
const SidebarSkills = ({ entries }: { entries: any[] }) => (
  <div className={styles.sidebarSection}>
    <h3 className={styles.sidebarSectionTitle}>Skills</h3>
    {entries.map((e: any, i: number) => (
      <div key={i}>
        <div className={styles.sidebarSkillCategory}>{e.category}</div>
        <div className={styles.sidebarSkillItems}>{e.skills}</div>
      </div>
    ))}
  </div>
)

/* ─── Sidebar Languages ─── */
const SidebarLanguages = ({ entries }: { entries: any[] }) => (
  <div className={styles.sidebarSection}>
    <h3 className={styles.sidebarSectionTitle}>Languages</h3>
    {entries.map((e: any, i: number) => (
      <div key={i} className={styles.languageItem}>
        <span>{e.language}</span>
        <span className={styles.languageLevel}>{e.proficiency}</span>
      </div>
    ))}
  </div>
)

/* ─── Section Renderer ─── */
const SectionRenderer = ({ section }: { section: ResumeSection }) => {
  if (section.key === 'custom') {
    const CustomComp = SECTION_COMPONENTS['custom']
    return CustomComp ? <CustomComp entries={section.entries} name={section.name} /> : null
  }

  const Component = SECTION_COMPONENTS[section.key]
  if (!Component) return null
  return <Component entries={section.entries} name={section.name} />
}

/* ─── Main Template ─── */
const ClassicSidebar: React.FC<TemplateProps> = ({ data, customization }) => {
  const { personalInfo, sections } = data
  const cssVars = buildCSSVars(customization)

  useEffect(() => {
    if (customization.stylePack.fontImportUrl) {
      const href = customization.stylePack.fontImportUrl
      const existing = document.querySelector(`link[href="${href}"]`)
      if (!existing) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        document.head.appendChild(link)
      }
    }
  }, [customization.stylePack.fontImportUrl])

  // Determine which sections go in sidebar vs main
  const sidebarKeys = new Set(['skills', 'languages'])

  const sidebarSections = sections.filter(s => sidebarKeys.has(s.key) && s.visible && s.entries.length > 0)
  
  // Build ordered main sections from sectionOrder
  const orderedSections = customization.sectionOrder
    .map(key => {
      if (key === 'summary') {
        return { key: 'summary', isSummary: true, visible: !!personalInfo.summary }
      }
      if (sidebarKeys.has(key as string)) return null // Skip sidebar items from main
      const sec = sections.find(s => s.key === key)
      return sec ? { ...sec, isSummary: false } : null
    })
    .filter((s): s is (ResumeSection & { isSummary: false }) | { key: 'summary'; isSummary: true; visible: boolean } =>
      !!s && s.visible && (s.isSummary || (Array.isArray((s as any).entries) && (s as any).entries.length > 0))
    )

  return (
    <div id="resume" className={styles.root} style={cssVars}>
      {/* Left Sidebar */}
      <aside className={styles.sidebar}>
        <div>
          <h1 className={styles.sidebarName}>{personalInfo.fullName}</h1>
          {personalInfo.title && <p className={styles.sidebarTitle}>{personalInfo.title}</p>}
        </div>
        <SidebarContact personalInfo={personalInfo} />
        {sidebarSections.map(sec => {
          if (sec.key === 'skills') return <SidebarSkills key="skills" entries={sec.entries} />
          if (sec.key === 'languages') return <SidebarLanguages key="languages" entries={sec.entries} />
          return null
        })}
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {orderedSections.map(section => {
          if (section.isSummary) {
            return <SummarySection key="summary" content={personalInfo.summary} name={personalInfo.summaryLabel} />
          }
          return <SectionRenderer key={section.key} section={section as ResumeSection} />
        })}
      </main>
    </div>
  )
}

export default ClassicSidebar
