import React from 'react'
import type { SectionKey } from '../shared/template.types'
import { SectionWrapper } from '../shared/SectionWrapper'
import { EntryBlock } from '../shared/EntryBlock'
import { sanitizeUrl, formatAsList } from '../shared/utils'
import styles from './ModernCentered.module.css'

// ─── Helpers ───

const renderLinks = (links: any[]) => {
  if (!links || links.length === 0) return null
  return (
    <>
      {links.map((link, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && ' | '}
          <a href={sanitizeUrl(link.url)}>{link.text}</a>
        </React.Fragment>
      ))}
    </>
  )
}

// ─── Sections ───

export const SummarySection = ({ content, name }: { content: string, name?: string }) => {
  if (!content) return null
  return (
    <SectionWrapper title={name || "Summary"}>
      <div className="template-entry-body">
        {formatAsList(content) || <p>{content}</p>}
      </div>
    </SectionWrapper>
  )
}

// Reusable experience block (Work, Internships, Volunteering, Clinical)
const ExperienceLikeRenderer = ({ entries, subtitleKeys }: { entries: any[], subtitleKeys: [string, string] }) => {
  return (
    <>
      {entries.map((entry, i) => {
        let title = entry.jobTitle || entry.role || entry.rotationName
        let subtitleLeft = entry[subtitleKeys[0]]
        let subtitleRight = entry[subtitleKeys[1]]
        
        let subtitle = subtitleLeft
        if (subtitleRight) subtitle += ` | ${subtitleRight}`
        
        return (
          <EntryBlock 
            key={i} 
            title={title} 
            subtitle={subtitle}
            metaRight={
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                {entry.dates && <div>{entry.dates}</div>}
                {entry.location && <div>{entry.location}</div>}
                {entry.hours && <div>{entry.hours} Hours</div>}
              </div>
            }
          >
            {formatAsList(entry.description || entry.achievements)}
            {entry.links && entry.links.length > 0 && (
              <div style={{ marginTop: '4px' }}>
                {renderLinks(entry.links)}
              </div>
            )}
          </EntryBlock>
        )
      })}
    </>
  )
}

export const ExperienceSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Experience"}>
    <ExperienceLikeRenderer entries={entries} subtitleKeys={['company', 'employmentType']} />
  </SectionWrapper>
)

export const InternshipsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Internships"}>
    <ExperienceLikeRenderer entries={entries} subtitleKeys={['company', 'employmentType']} />
  </SectionWrapper>
)

export const VolunteeringSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Volunteer Experience"}>
    <ExperienceLikeRenderer entries={entries} subtitleKeys={['organization', '']} />
  </SectionWrapper>
)

export const ClinicalExperienceSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Clinical Experience"}>
    <ExperienceLikeRenderer entries={entries} subtitleKeys={['institution', '']} />
  </SectionWrapper>
)

export const EducationSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Education"}>
    {entries.map((entry, i) => {
      let subtitle = entry.institution
      if (entry.honorsOrMinor) subtitle += ` | ${entry.honorsOrMinor}`
      
      return (
        <EntryBlock 
          key={i} 
          title={entry.qualification} 
          subtitle={subtitle}
          metaRight={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
              {entry.dates && <div>{entry.dates}</div>}
              {entry.gpa && <div>{entry.gpa}</div>}
            </div>
          }
        >
          {formatAsList(entry.description)}
        </EntryBlock>
      )
    })}
  </SectionWrapper>
)

export const SkillsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Skills"}>
    <ul className={styles.skillsList}>
      {entries.map((entry, i) => (
        <li key={i}>
          <strong>{entry.category}:</strong> {entry.skillList}
        </li>
      ))}
    </ul>
  </SectionWrapper>
)

export const ProjectsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Projects"}>
    {entries.map((entry, i) => {
      let subtitle = ''
      if (entry.role && entry.techStack) subtitle = `${entry.role} | ${entry.techStack}`
      else if (entry.role) subtitle = entry.role
      else if (entry.techStack) subtitle = entry.techStack

      return (
        <EntryBlock 
          key={i} 
          title={entry.projectName} 
          subtitle={subtitle}
          metaRight={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
              {entry.dates && <div>{entry.dates}</div>}
              {entry.links && renderLinks(entry.links)}
            </div>
          }
        >
          {formatAsList(entry.description)}
        </EntryBlock>
      )
    })}
  </SectionWrapper>
)

export const CertificationsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Certifications"}>
    {entries.map((entry, i) => (
      <EntryBlock 
        key={i} 
        title={entry.name} 
        subtitle={entry.issuer}
        metaRight={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            {entry.date && <div>Issued {entry.date}</div>}
            {entry.verificationLink && <div><a href={sanitizeUrl(entry.verificationLink)}>Verify</a></div>}
          </div>
        }
      >
        {entry.credentialId && <p style={{ fontSize: 'var(--font-size-meta)' }}>Credential ID: {entry.credentialId}</p>}
      </EntryBlock>
    ))}
  </SectionWrapper>
)

export const AwardsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Awards & Honors"}>
    {entries.map((entry, i) => (
      <EntryBlock 
        key={i} 
        title={entry.awardName} 
        subtitle={entry.issuer}
        metaRight={entry.date}
      >
        {formatAsList(entry.description) || (entry.description && <p>{entry.description}</p>)}
      </EntryBlock>
    ))}
  </SectionWrapper>
)

export const LanguagesSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Languages"}>
    <ul className={styles.languagesWrap}>
      {entries.map((entry, i) => (
        <li key={i}>{entry.language} <span style={{ color: '#666' }}>({entry.proficiency})</span></li>
      ))}
    </ul>
  </SectionWrapper>
)

export const PublicationsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Publications"}>
    {entries.map((entry, i) => {
      const titleNode = entry.url ? <a href={sanitizeUrl(entry.url)}>{entry.title}</a> : entry.title
      return (
        <EntryBlock key={i} title={titleNode} subtitle={entry.authors}>
          <p>
            <em>{entry.journal}</em>
            {entry.volume && <>, <strong>{entry.volume}</strong></>}
            {entry.issue && ` (${entry.issue})`}
            {entry.pages && `, pp. ${entry.pages}`}
            {entry.date && `. (${entry.date}).`}
          </p>
          {entry.summary && <p style={{ marginTop: '4px' }}>{entry.summary}</p>}
        </EntryBlock>
      )
    })}
  </SectionWrapper>
)

export const PresentationsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Presentations"}>
    {entries.map((entry, i) => {
      const titleNode = entry.url ? <a href={sanitizeUrl(entry.url)}>{entry.presentationTitle}</a> : entry.presentationTitle
      const subtitle = `${entry.conferenceName} – ${entry.location} (${entry.date})`
      return (
        <EntryBlock key={i} title={titleNode} subtitle={subtitle}>
          {entry.description && <p>{entry.description}</p>}
        </EntryBlock>
      )
    })}
  </SectionWrapper>
)

export const MembershipsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Professional Memberships"}>
    {entries.map((entry, i) => (
      <EntryBlock key={i} title={entry.organization} subtitle={entry.role} metaRight={entry.dates} />
    ))}
  </SectionWrapper>
)

export const EventsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Workshops & Hackathons"}>
    {entries.map((entry, i) => {
      const subtitleNode = <>{entry.organizer} {entry.achievement && <> | <strong>{entry.achievement}</strong></>}</>
      return (
        <EntryBlock 
          key={i} 
          title={entry.eventName} 
          subtitle={subtitleNode}
          metaRight={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
              {entry.date && <div>{entry.date}</div>}
              {entry.links && entry.links.length > 0 && <div>{renderLinks(entry.links)}</div>}
            </div>
          }
        >
          {formatAsList(entry.description)}
        </EntryBlock>
      )
    })}
  </SectionWrapper>
)

export const LicensureSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Licensure"}>
    {entries.map((entry, i) => (
      <EntryBlock 
        key={i} 
        title={entry.licenseName} 
        subtitle={entry.issuingBody}
        metaRight={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            {entry.licenseNumber && <div>License #: {entry.licenseNumber}</div>}
            {entry.expirationDate && <div>Expires: {entry.expirationDate}</div>}
          </div>
        }
      />
    ))}
  </SectionWrapper>
)

export const BarAdmissionsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Bar Admissions"}>
    <ul className={styles.languagesWrap}>
      {entries.map((entry, i) => (
        <li key={i}>
          {entry.stateBar} <span style={{ color: '#666' }}>(Admitted {entry.admissionYear}{entry.barNumber && `, No. ${entry.barNumber}`})</span>
        </li>
      ))}
    </ul>
  </SectionWrapper>
)

export const GrantsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Grants & Funding"}>
    {entries.map((entry, i) => (
      <EntryBlock 
        key={i} 
        title={entry.grantTitle} 
        subtitle={`${entry.role} | ${entry.fundingBody}`}
        metaRight={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            {entry.dates && <div>{entry.dates}</div>}
            {entry.amount && <div>{entry.amount}</div>}
          </div>
        }
      >
        {entry.grantNumber && <p style={{ fontSize: 'var(--font-size-meta)', marginBottom: '4px' }}>Grant #: {entry.grantNumber}</p>}
        {entry.description && <p>{entry.description}</p>}
      </EntryBlock>
    ))}
  </SectionWrapper>
)

export const TeachingExperienceSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Teaching Experience"}>
    {entries.map((entry, i) => (
      <EntryBlock 
        key={i} 
        title={entry.courseTitle} 
        subtitle={`${entry.role} | ${entry.university}`}
        metaRight={entry.dates}
      >
        {formatAsList(entry.achievements)}
      </EntryBlock>
    ))}
  </SectionWrapper>
)

export const SecurityClearanceSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Security Clearance"}>
    {entries.map((entry, i) => (
      <div key={i} className="template-entry">
        <p>
          <strong>{entry.clearanceLevel}:</strong> {entry.issuingAgency}
          {entry.polygraph && `, ${entry.polygraph}`}. 
          {entry.date && ` (Last Investigation: ${entry.date})`}
        </p>
      </div>
    ))}
  </SectionWrapper>
)

// Custom is special: each entry is technically its own section visually
export const CustomSection = ({ entries }: { entries: any[], name?: string }) => (
  <>
    {entries.map((entry, i) => (
      <SectionWrapper key={i} title={entry.sectionTitle || 'Details'}>
        <div className="template-entry-body">
          {formatAsList(entry.content)}
        </div>
      </SectionWrapper>
    ))}
  </>
)

export const SECTION_COMPONENTS: Partial<Record<SectionKey, React.FC<{ entries: any[], name?: string }>>> = {
  experience:        ExperienceSection,
  education:         EducationSection,
  skills:            SkillsSection,
  projects:          ProjectsSection,
  certifications:    CertificationsSection,
  awards:            AwardsSection,
  languages:         LanguagesSection,
  volunteering:      VolunteeringSection,
  publications:      PublicationsSection,
  presentations:     PresentationsSection,
  licensure:         LicensureSection,
  barAdmissions:     BarAdmissionsSection,
  custom:            CustomSection,
  memberships:       MembershipsSection,
  clinicalExperience: ClinicalExperienceSection,
  grants:            GrantsSection,
  teachingExperience: TeachingExperienceSection,
  securityClearance: SecurityClearanceSection,
  events:            EventsSection,
  internships:       InternshipsSection,
}
