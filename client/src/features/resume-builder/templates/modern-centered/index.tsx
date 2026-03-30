import React, { useEffect } from 'react'
import type { TemplateProps, ResumeSection } from '../shared/template.types'
import { buildCSSVars } from '../shared/buildCSSVars'
import { SECTION_COMPONENTS, SummarySection, CustomSection } from './sections'
import styles from './ModernCentered.module.css'
import { sanitizeUrl } from '../shared/utils'

const SectionRenderer = ({ section }: { section: ResumeSection }) => {
  if (section.key === 'custom') {
    return <CustomSection entries={section.entries} name={section.name} />
  }
  
  const Component = SECTION_COMPONENTS[section.key]
  if (!Component) return null
  return <Component entries={section.entries} name={section.name} />
}

const Header = ({ personalInfo }: { personalInfo: TemplateProps['data']['personalInfo'] }) => {
  const { fullName, title, email, phone, location, contactLinks } = personalInfo

  const contactItems = []
  if (location) contactItems.push(<span key="loc">{location}</span>)
  if (email) contactItems.push(<a key="email" href={`mailto:${email}`}>{email}</a>)
  if (phone) contactItems.push(<a key="phone" href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a>)
  
  if (contactLinks && contactLinks.length > 0) {
    contactLinks.forEach((link, i) => {
      contactItems.push(<a key={`link-${i}`} href={sanitizeUrl(link.url)}>{link.text}</a>)
    })
  }

  return (
    <header className={styles.header}>
      <h1 className={styles.name}>{fullName}</h1>
      {title && <h2 className={styles.title}>{title}</h2>}
      
      {contactItems.length > 0 && (
        <div className={styles.contactLine}>
          {contactItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className={styles.contactSeparator}>|</span>}
              {item}
            </React.Fragment>
          ))}
        </div>
      )}
    </header>
  )
}

const ModernCentered: React.FC<TemplateProps> = ({ data, customization }) => {
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

  // Build the ordered, visible section list based on customization.sectionOrder
  const orderedSections = customization.sectionOrder
    .map(key => {
      // Summary is a special case (virtual section)
      if (key === 'summary') {
        return { key: 'summary', isSummary: true, visible: !!personalInfo.summary }
      }
      // Real sections
      const sec = sections.find(s => s.key === key)
      return sec ? { ...sec, isSummary: false } : null
    })
    .filter((s): s is (ResumeSection & { isSummary: false }) | { key: 'summary'; isSummary: true; visible: boolean } => 
      !!s && s.visible && (s.isSummary || (Array.isArray((s as any).entries) && (s as any).entries.length > 0))
    )

  return (
    <div id="resume" className={styles.root} style={cssVars}>
      <Header personalInfo={personalInfo} />
      {orderedSections.map(section => {
        if (section.isSummary) {
          return <SummarySection key="summary" content={personalInfo.summary} name={personalInfo.summaryLabel} />
        }
        return <SectionRenderer key={section.key} section={section as ResumeSection} />
      })}
    </div>
  )
}

export default ModernCentered
