import React, { useEffect } from 'react'
import type { TemplateProps, ResumeSection } from '../shared/template.types'
import { buildCSSVars } from '../shared/buildCSSVars'
import { SECTION_COMPONENTS, SummarySection } from './sections'
import { sanitizeUrl } from '../shared/utils'
import styles from './ExecutiveMinimal.module.css'

const SectionRenderer = ({ section }: { section: ResumeSection }) => {
  if (section.key === 'custom') {
    const CustomComp = SECTION_COMPONENTS['custom']
    return CustomComp ? <CustomComp entries={section.entries} name={section.name} /> : null
  }

  const Component = SECTION_COMPONENTS[section.key]
  if (!Component) return null
  return <Component entries={section.entries} name={section.name} />
}

const Header = ({ personalInfo }: { personalInfo: TemplateProps['data']['personalInfo'] }) => {
  const { fullName, title, email, phone, location, contactLinks } = personalInfo

  const contactItems: React.ReactNode[] = []
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
      <div className={styles.nameRow}>
        <div>
          <h1 className={styles.name}>{fullName}</h1>
          {title && <h2 className={styles.title}>{title}</h2>}
        </div>
      </div>

      {contactItems.length > 0 && (
        <div className={styles.contactRow}>
          {contactItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className={styles.contactSep}>·</span>}
              {item}
            </React.Fragment>
          ))}
        </div>
      )}
    </header>
  )
}

const ExecutiveMinimal: React.FC<TemplateProps> = ({ data, customization }) => {
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

  // Build the ordered section list from customization.sectionOrder
  const orderedSections = customization.sectionOrder
    .map(key => {
      if (key === 'summary') {
        return { key: 'summary', isSummary: true, visible: !!personalInfo.summary }
      }
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

export default ExecutiveMinimal
