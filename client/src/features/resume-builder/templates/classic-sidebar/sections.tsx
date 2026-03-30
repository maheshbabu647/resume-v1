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

const ExperienceSection = ({ entries }: { entries: any[] }) => <ExperienceLikeRenderer entries={entries} subtitleKeys={['jobTitle', 'company']} />
const InternshipsSection = ({ entries }: { entries: any[] }) => <ExperienceLikeRenderer entries={entries} subtitleKeys={['jobTitle', 'company']} />
const VolunteeringSection = ({ entries }: { entries: any[] }) => <ExperienceLikeRenderer entries={entries} subtitleKeys={['role', 'organization']} />
const ClinicalExperienceSection = ({ entries }: { entries: any[] }) => <ExperienceLikeRenderer entries={entries} subtitleKeys={['rotationName', 'institution']} />
const TeachingExperienceSection = ({ entries }: { entries: any[] }) => <ExperienceLikeRenderer entries={entries} subtitleKeys={['courseTitle', 'institution']} />

const EducationSection = ({ entries }: { entries: any[] }) => (
  <>
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
  </>
)

const ProjectsSection = ({ entries }: { entries: any[] }) => (
  <>
    {entries.map((e: any, i: number) => (
      <EntryBlock
        key={i}
        title={e.projectName}
        subtitle={e.role}
        metaRight={e.technologies}
      >
        {formatAsList(e.description)}
        {renderLinks(e.links)}
      </EntryBlock>
    ))}
  </>
)

const CertificationsSection = ({ entries }: { entries: any[] }) => (
  <>
    {entries.map((e: any, i: number) => (
      <EntryBlock key={i} title={e.certificationName} subtitle={e.issuingOrg} metaRight={e.issueDate}>
        {e.credentialId && <p>ID: {e.credentialId}</p>}
      </EntryBlock>
    ))}
  </>
)

const AwardsSection = ({ entries }: { entries: any[] }) => (
  <>
    {entries.map((e: any, i: number) => (
      <EntryBlock key={i} title={e.awardName} subtitle={e.awardedBy} metaRight={e.dateReceived}>
        {formatAsList(e.description)}
      </EntryBlock>
    ))}
  </>
)

const EventsSection = ({ entries }: { entries: any[] }) => (
  <>
    {entries.map((e: any, i: number) => (
      <EntryBlock key={i} title={e.eventName} subtitle={e.organizer} metaRight={e.eventDate}>
        {e.achievement && <p><strong>{e.achievement}</strong></p>}
        {formatAsList(e.description)}
      </EntryBlock>
    ))}
  </>
)

const PublicationsSection = ({ entries }: { entries: any[] }) => (
  <>
    {entries.map((e: any, i: number) => (
      <EntryBlock key={i} title={e.title} subtitle={e.journal} metaRight={e.publicationDate}>
        {e.authors && <p><em>{e.authors}</em></p>}
        {formatAsList(e.summary)}
      </EntryBlock>
    ))}
  </>
)

const PresentationsSection = ({ entries }: { entries: any[] }) => (
  <>
    {entries.map((e: any, i: number) => (
      <EntryBlock key={i} title={e.presentationTitle} subtitle={e.conferenceName} metaRight={e.date}>
        {formatAsList(e.description)}
      </EntryBlock>
    ))}
  </>
)

const MembershipsSection = ({ entries }: { entries: any[] }) => (
  <>
    {entries.map((e: any, i: number) => (
      <EntryBlock key={i} title={e.organizationName} subtitle={e.role} metaRight={e.membershipDates} />
    ))}
  </>
)

const GrantsSection = ({ entries }: { entries: any[] }) => (
  <>
    {entries.map((e: any, i: number) => (
      <EntryBlock key={i} title={e.grantTitle} subtitle={e.fundingBody} metaRight={<>{e.grantPeriod}{e.awardAmount ? <><br />{e.awardAmount}</> : ''}</>}>
        {e.role && <p><strong>Role:</strong> {e.role}</p>}
        {formatAsList(e.description)}
      </EntryBlock>
    ))}
  </>
)

const LicensureSection = ({ entries }: { entries: any[] }) => (
  <>
    {entries.map((e: any, i: number) => (
      <EntryBlock key={i} title={e.licenseName} subtitle={e.issuingBody} metaRight={e.expirationDate}>
        {e.licenseNumber && <p>License #: {e.licenseNumber}</p>}
      </EntryBlock>
    ))}
  </>
)

const BarAdmissionsSection = ({ entries }: { entries: any[] }) => (
  <>
    {entries.map((e: any, i: number) => (
      <EntryBlock key={i} title={e.jurisdiction} metaRight={e.admissionYear}>
        {e.barNumber && <p>{e.barNumber}</p>}
      </EntryBlock>
    ))}
  </>
)

const SecurityClearanceSection = ({ entries }: { entries: any[] }) => (
  <>
    {entries.map((e: any, i: number) => (
      <EntryBlock key={i} title={e.clearanceLevel} subtitle={e.issuingAgency} metaRight={e.investigationDate}>
        {e.polygraph && <p>Polygraph: {e.polygraph}</p>}
      </EntryBlock>
    ))}
  </>
)

// Skills section — renders in sidebar, but fallback for main area
const SkillsSection = ({ entries }: { entries: any[] }) => (
  <ul className={styles.skillsList}>
    {entries.map((e: any, i: number) => (
      <li key={i}><strong>{e.category}:</strong> {e.skills}</li>
    ))}
  </ul>
)

const LanguagesSection = ({ entries }: { entries: any[] }) => (
  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
    {entries.map((e: any, i: number) => (
      <li key={i}><strong>{e.language}</strong> — {e.proficiency}</li>
    ))}
  </ul>
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
}
