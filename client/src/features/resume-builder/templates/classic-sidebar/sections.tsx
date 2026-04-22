import React from 'react'
import type { SectionKey } from '../shared/template.types'
import { SectionWrapper } from '../shared/SectionWrapper'
import { EntryBlock } from '../shared/EntryBlock'
import { sanitizeUrl, formatAsList } from '../shared/utils'
import styles from './ClassicSidebar.module.css'

// ─── Helpers ───

const renderLinks = (links: any[]) => {
  if (!links || links.length === 0) return null
  return (
    <>
      {links.map((link: any, idx: number) => (
        <React.Fragment key={idx}>
          {idx > 0 && ' | '}
          <a href={sanitizeUrl(link.url)}>{link.text}</a>
        </React.Fragment>
      ))}
    </>
  )
}

// ─── Sections (identical logic to modern-centered, reusing shared components) ───

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

const ExperienceLikeRenderer = ({ entries, subtitleKeys }: { entries: any[], subtitleKeys: [string, string] }) => (
  <>
    {entries.map((e: any, i: number) => (
      <EntryBlock
        key={i}
        title={e[subtitleKeys[0]]}
        subtitle={e[subtitleKeys[1]]}
        metaRight={<>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}{e.location ? <><br />{e.location}</> : ''}</>}
      >
        {formatAsList(e.description || e.responsibilities)}
      </EntryBlock>
    ))}
  </>
)

const ExperienceSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Experience"}>
    <ExperienceLikeRenderer entries={entries} subtitleKeys={['jobTitle', 'company']} />
  </SectionWrapper>
)


const InternshipsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Internships"}>
    <ExperienceLikeRenderer entries={entries} subtitleKeys={['jobTitle', 'company']} />
  </SectionWrapper>
)


const VolunteeringSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Volunteer Experience"}>
    <ExperienceLikeRenderer entries={entries} subtitleKeys={['role', 'organization']} />
  </SectionWrapper>
)


const ClinicalExperienceSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Clinical Experience"}>
    <ExperienceLikeRenderer entries={entries} subtitleKeys={['rotationName', 'institution']} />
  </SectionWrapper>
)


const TeachingExperienceSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Teaching Experience"}>
    <ExperienceLikeRenderer entries={entries} subtitleKeys={['courseTitle', 'institution']} />
  </SectionWrapper>
)


const EducationSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Education"}>
    {entries.map((e: any, i: number) => (
      <EntryBlock
        key={i}
        title={e.degree || e.qualification}
        subtitle={e.institution}
        metaRight={<>{e.completionDate || e.graduationDate}{e.gpa ? <><br />GPA: {e.gpa}</> : ''}</>}
      >
        {e.honorsOrMinor && <p>{e.honorsOrMinor}</p>}
        {formatAsList(e.additionalDetails)}
      </EntryBlock>
    ))}
  </SectionWrapper>
)


const ProjectsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Projects"}>
    {entries.map((entry: any, i: number) => {
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


const CertificationsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Certifications"}>
    {entries.map((e: any, i: number) => (
      <EntryBlock key={i} title={e.name} subtitle={e.issuer} metaRight={e.date}>
        {e.credentialId && <p>ID: {e.credentialId}</p>}
      </EntryBlock>
    ))}
  </SectionWrapper>
)


const AwardsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Awards & Honors"}>
    {entries.map((e: any, i: number) => (
      <EntryBlock key={i} title={e.awardName} subtitle={e.issuer} metaRight={e.date}>
        {formatAsList(e.description)}
      </EntryBlock>
    ))}
  </SectionWrapper>
)


const EventsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Workshops & Hackathons"}>
    {entries.map((e: any, i: number) => (
      <EntryBlock key={i} title={e.eventName} subtitle={e.organizer} metaRight={e.date}>
        {e.achievement && <p><strong>{e.achievement}</strong></p>}
        {formatAsList(e.description)}
      </EntryBlock>
    ))}
  </SectionWrapper>
)


const PublicationsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Publications"}>
    {entries.map((e: any, i: number) => (
      <EntryBlock key={i} title={e.title} subtitle={e.journal} metaRight={e.date}>
        {e.authors && <p><em>{e.authors}</em></p>}
        {formatAsList(e.summary)}
      </EntryBlock>
    ))}
  </SectionWrapper>
)


const PresentationsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Presentations"}>
    {entries.map((e: any, i: number) => (
      <EntryBlock key={i} title={e.presentationTitle} subtitle={e.conferenceName} metaRight={e.date}>
        {formatAsList(e.description)}
      </EntryBlock>
    ))}
  </SectionWrapper>
)


const MembershipsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Professional Memberships"}>
    {entries.map((e: any, i: number) => (
      <EntryBlock key={i} title={e.organization} subtitle={e.role} metaRight={e.dates} />
    ))}
  </SectionWrapper>
)


const GrantsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Grants & Funding"}>
    {entries.map((e: any, i: number) => (
      <EntryBlock key={i} title={e.grantTitle} subtitle={e.fundingBody} metaRight={<>{e.dates}{e.amount ? <><br />{e.amount}</> : ''}</>}>
        {e.role && <p><strong>Role:</strong> {e.role}</p>}
        {formatAsList(e.description)}
      </EntryBlock>
    ))}
  </SectionWrapper>
)


const LicensureSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Licensure"}>
    {entries.map((e: any, i: number) => (
      <EntryBlock key={i} title={e.licenseName} subtitle={e.issuingBody} metaRight={e.expirationDate}>
        {e.licenseNumber && <p>License #: {e.licenseNumber}</p>}
      </EntryBlock>
    ))}
  </SectionWrapper>
)


const BarAdmissionsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Bar Admissions"}>
    {entries.map((e: any, i: number) => (
      <EntryBlock key={i} title={e.stateBar} metaRight={e.admissionYear}>
        {e.barNumber && <p>{e.barNumber}</p>}
      </EntryBlock>
    ))}
  </SectionWrapper>
)


const SecurityClearanceSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Security Clearance"}>
    {entries.map((e: any, i: number) => (
      <EntryBlock key={i} title={e.clearanceLevel} subtitle={e.issuingAgency} metaRight={e.investigationDate}>
        {e.polygraph && <p>Polygraph: {e.polygraph}</p>}
      </EntryBlock>
    ))}
  </SectionWrapper>
)


// Skills section — renders in sidebar, but fallback for main area
const SkillsSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Skills"}>
    <ul className={styles.skillsList}>
    {entries.map((e: any, i: number) => (
      <li key={i}><strong>{e.category}:</strong> {e.skillList}</li>
    ))}
  </ul>
  </SectionWrapper>
)


const LanguagesSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Languages"}>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
    {entries.map((e: any, i: number) => (
      <li key={i}>
        <strong>{e.language}</strong>
        {e.proficiency && ` (${e.proficiency})`}
      </li>
    ))}
  </ul>
  </SectionWrapper>
)


const DeclarationSection = ({ entries, name }: { entries: any[], name?: string }) => (
  <SectionWrapper title={name || "Declaration"}>
    {entries.map((e: any, i: number) => (
      <div key={i} className="template-entry-body">
        {e.statement && <p style={{ marginBottom: '8px' }}>{e.statement}</p>}
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '2px', fontSize: 'var(--font-size-meta)' }}>
          {e.place && <span><strong>Place:</strong> {e.place}</span>}
          {e.date && <span><strong>Date:</strong> {e.date}</span>}
          {e.name && <span style={{ marginTop: '6px', fontStyle: 'italic' }}>{e.name}</span>}
        </div>
      </div>
    ))}
  </SectionWrapper>
)


const CustomSection = ({ entries }: { entries: any[] }) => (
  <>
    {entries.map((entry: any, i: number) => (
      <SectionWrapper key={i} title={entry.sectionTitle || 'Details'}>
        <div className="template-entry-body">
          {formatAsList(entry.content)}
        </div>
      </SectionWrapper>
    ))}
  </>
)

export const SECTION_COMPONENTS: Partial<Record<SectionKey, React.FC<{ entries: any[], name?: string }>>> = {
  experience: ExperienceSection,
  education: EducationSection,
  skills: SkillsSection,
  projects: ProjectsSection,
  certifications: CertificationsSection,
  awards: AwardsSection,
  languages: LanguagesSection,
  volunteering: VolunteeringSection,
  publications: PublicationsSection,
  presentations: PresentationsSection,
  licensure: LicensureSection,
  barAdmissions: BarAdmissionsSection,
  custom: CustomSection,
  memberships: MembershipsSection,
  clinicalExperience: ClinicalExperienceSection,
  grants: GrantsSection,
  teachingExperience: TeachingExperienceSection,
  securityClearance: SecurityClearanceSection,
  events: EventsSection,
  internships: InternshipsSection,
  declaration: DeclarationSection,
}
