import type { SectionKey } from '../templates/shared/template.types'

export type FieldType = 'text' | 'textarea' | 'email' | 'tel' | 'url' | 'group'

export interface AiConfig {
  enabled: boolean
  contextFields: string[]
  userNotesPrompt: string
}

export interface FieldDefinition {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  tooltip?: string
  required?: boolean
  rows?: number
  repeatable?: boolean
  singularLabel?: string
  pluralLabel?: string
  subFields?: FieldDefinition[]
  aiConfig?: AiConfig
}

export interface SectionDefinition {
  key: SectionKey
  sectionLabel: string
  sectionDescription: string
  isCore: boolean
  singularLabel?: string
  pluralLabel?: string
  recommendedFor?: string[]
  fields: FieldDefinition[]
}

const aiText = (fields: string[]): AiConfig => ({
  enabled: true,
  contextFields: fields,
  userNotesPrompt: 'What do you want to highlight here?'
})

export const SECTION_DEFINITIONS: SectionDefinition[] = [
  {
    key: 'profile' as any, // Special mapping to personalInfo
    sectionLabel: 'Professional Profile',
    sectionDescription: 'Basic contact and headline information.',
    isCore: true,
    fields: [
      { name: 'fullName', label: 'Full Name', type: 'text', required: true },
      { name: 'title', label: 'Professional Title', type: 'text' },
      { name: 'summary', label: 'Summary', type: 'textarea', rows: 4, aiConfig: aiText(['fullName', 'title']) }
    ]
  },
  {
    key: 'contact' as any, // Special mapping to personalInfo
    sectionLabel: 'Contact Information',
    sectionDescription: 'How recruiters can reach you.',
    isCore: true,
    fields: [
      { name: 'email', label: 'Email Address', type: 'email', required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel' },
      { name: 'location', label: 'Location (City, State)', type: 'text' },
      {
        name: 'contactLinks',
        label: 'Social & Web Links',
        type: 'group',
        repeatable: true,
        singularLabel: 'Link',
        pluralLabel: 'Links',
        subFields: [
          { name: 'text', label: 'Label (e.g. LinkedIn)', type: 'text' },
          { name: 'url', label: 'URL', type: 'url' }
        ]
      }
    ]
  },
  {
    key: 'experience',
    sectionLabel: 'Work Experience',
    sectionDescription: 'Add your professional experience.',
    isCore: false,
    singularLabel: 'Position',
    pluralLabel: 'Positions',
    fields: [
      { name: 'jobTitle', label: 'Job Title', type: 'text' },
      { name: 'company', label: 'Company', type: 'text' },
      { name: 'employmentType', label: 'Employment Type', type: 'text' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'dates', label: 'Dates', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 5, aiConfig: aiText(['jobTitle', 'company']) }
    ]
  },
  {
    key: 'education',
    sectionLabel: 'Education',
    sectionDescription: 'Add your academic qualifications.',
    isCore: true,
    singularLabel: 'Qualification',
    pluralLabel: 'Qualifications',
    fields: [
      { name: 'qualification', label: 'Degree & Major', type: 'text' },
      { name: 'institution', label: 'Institution', type: 'text' },
      { name: 'honorsOrMinor', label: 'Honors / Minor', type: 'text' },
      { name: 'dates', label: 'Dates', type: 'text' },
      { name: 'gpa', label: 'GPA', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3 }
    ]
  },
  {
    key: 'skills',
    sectionLabel: 'Skills',
    sectionDescription: 'List your technical and professional skills.',
    isCore: true,
    singularLabel: 'Skill Category',
    pluralLabel: 'Skill Categories',
    fields: [
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'skillList', label: 'Skills (comma separated)', type: 'text' }
    ]
  },
  {
    key: 'projects',
    sectionLabel: 'Projects',
    sectionDescription: 'Highlight key projects.',
    isCore: false,
    recommendedFor: ['Technology', 'Engineering', 'Creative/Media', 'Academia/Research'],
    singularLabel: 'Project',
    pluralLabel: 'Projects',
    fields: [
      { name: 'projectName', label: 'Project Name', type: 'text' },
      { name: 'role', label: 'Role', type: 'text' },
      { name: 'techStack', label: 'Tech Stack', type: 'text' },
      {
        name: 'links', label: 'Links', type: 'group', repeatable: true, subFields: [
          { name: 'text', label: 'Link Text', type: 'text' },
          { name: 'url', label: 'URL', type: 'url' }
        ]
      },
      { name: 'description', label: 'Description', type: 'textarea', rows: 4, aiConfig: aiText(['projectName', 'role', 'techStack']) }
    ]
  },
  {
    key: 'certifications',
    sectionLabel: 'Certifications',
    sectionDescription: 'List your certifications and licenses.',
    isCore: false,
    recommendedFor: ['Technology', 'Business/Finance', 'Healthcare'],
    singularLabel: 'Certification',
    pluralLabel: 'Certifications',
    fields: [
      { name: 'name', label: 'Certification Name', type: 'text', required: true },
      { name: 'issuer', label: 'Issuing Organization', type: 'text', required: true },
      { name: 'date', label: 'Issue Date', type: 'text' },
      { name: 'credentialId', label: 'Credential ID', type: 'text' },
      { name: 'verificationLink', label: 'Verification URL', type: 'url' }
    ]
  },
  {
    key: 'awards',
    sectionLabel: 'Awards & Honors',
    sectionDescription: 'Achievements and recognitions.',
    isCore: false,
    singularLabel: 'Award',
    pluralLabel: 'Awards',
    fields: [
      { name: 'awardName', label: 'Award Name', type: 'text', required: true },
      { name: 'issuer', label: 'Issuer', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 2 }
    ]
  },
  {
    key: 'languages',
    sectionLabel: 'Languages',
    sectionDescription: 'Languages you speak.',
    isCore: false,
    singularLabel: 'Language',
    pluralLabel: 'Languages',
    fields: [
      { name: 'language', label: 'Language', type: 'text', required: true },
      { name: 'proficiency', label: 'Proficiency', type: 'text', required: true }
    ]
  },
  {
    key: 'volunteering',
    sectionLabel: 'Volunteer Experience',
    sectionDescription: 'Your volunteer work.',
    isCore: false,
    singularLabel: 'Volunteer Role',
    pluralLabel: 'Volunteer Roles',
    fields: [
      { name: 'role', label: 'Role', type: 'text', required: true },
      { name: 'organization', label: 'Organization', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'dates', label: 'Dates', type: 'text', required: true },
      { name: 'achievements', label: 'Achievements', type: 'textarea', rows: 4 }
    ]
  },
  {
    key: 'publications',
    sectionLabel: 'Publications',
    sectionDescription: 'Published works or papers.',
    isCore: false,
    recommendedFor: ['Academia/Research', 'Healthcare', 'Legal'],
    singularLabel: 'Publication',
    pluralLabel: 'Publications',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'authors', label: 'Authors', type: 'text', required: true },
      { name: 'journal', label: 'Journal/Publisher', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'text', required: true },
      { name: 'volume', label: 'Volume', type: 'text' },
      { name: 'issue', label: 'Issue', type: 'text' },
      { name: 'pages', label: 'Pages', type: 'text' },
      { name: 'url', label: 'URL / DOI', type: 'url' },
      { name: 'summary', label: 'Summary', type: 'textarea', rows: 3 }
    ]
  },
  {
    key: 'presentations',
    sectionLabel: 'Presentations',
    sectionDescription: 'Conference presentations.',
    isCore: false,
    singularLabel: 'Presentation',
    pluralLabel: 'Presentations',
    fields: [
      { name: 'presentationTitle', label: 'Title', type: 'text', required: true },
      { name: 'conferenceName', label: 'Conference', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'text', required: true },
      { name: 'url', label: 'Link', type: 'url' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3 }
    ]
  },
  {
    key: 'licensure',
    sectionLabel: 'Licensure',
    sectionDescription: 'Professional licenses.',
    isCore: false,
    recommendedFor: ['Healthcare', 'Engineering', 'Business/Finance'],
    singularLabel: 'License',
    pluralLabel: 'Licenses',
    fields: [
      { name: 'licenseName', label: 'License Name', type: 'text', required: true },
      { name: 'issuingBody', label: 'Issuing Body', type: 'text', required: true },
      { name: 'licenseNumber', label: 'License Number', type: 'text' },
      { name: 'expirationDate', label: 'Expiration', type: 'text' }
    ]
  },
  {
    key: 'barAdmissions',
    sectionLabel: 'Bar Admissions',
    sectionDescription: 'For legal professionals.',
    isCore: false,
    recommendedFor: ['Legal'],
    singularLabel: 'Bar Admission',
    pluralLabel: 'Bar Admissions',
    fields: [
      { name: 'stateBar', label: 'State Bar', type: 'text', required: true },
      { name: 'admissionYear', label: 'Admission Year', type: 'text', required: true },
      { name: 'barNumber', label: 'Bar Number', type: 'text' }
    ]
  },
  {
    key: 'custom',
    sectionLabel: 'Custom Section',
    sectionDescription: 'Add anything else.',
    isCore: false,
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text' },
      { name: 'content', label: 'Content', type: 'textarea', rows: 5 }
    ]
  },
  {
    key: 'memberships',
    sectionLabel: 'Memberships',
    sectionDescription: 'Professional memberships.',
    isCore: false,
    singularLabel: 'Membership',
    pluralLabel: 'Memberships',
    fields: [
      { name: 'organization', label: 'Organization', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text' },
      { name: 'dates', label: 'Dates', type: 'text' }
    ]
  },
  {
    key: 'clinicalExperience',
    sectionLabel: 'Clinical Experience',
    sectionDescription: 'For healthcare professionals.',
    isCore: false,
    recommendedFor: ['Healthcare'],
    singularLabel: 'Clinical Rotation',
    pluralLabel: 'Clinical Rotations',
    fields: [
      { name: 'rotationName', label: 'Rotation Name', type: 'text', required: true },
      { name: 'institution', label: 'Institution', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'dates', label: 'Dates', type: 'text', required: true },
      { name: 'hours', label: 'Hours', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 4 }
    ]
  },
  {
    key: 'grants',
    sectionLabel: 'Grants & Funding',
    sectionDescription: 'For research professionals.',
    isCore: false,
    recommendedFor: ['Academia/Research'],
    singularLabel: 'Grant',
    pluralLabel: 'Grants',
    fields: [
      { name: 'grantTitle', label: 'Grant Title', type: 'text', required: true },
      { name: 'fundingBody', label: 'Funding Body', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text', required: true },
      { name: 'dates', label: 'Dates', type: 'text', required: true },
      { name: 'amount', label: 'Amount', type: 'text' },
      { name: 'grantNumber', label: 'Grant Number', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3 }
    ]
  },
  {
    key: 'teachingExperience',
    sectionLabel: 'Teaching Experience',
    sectionDescription: 'For academic professionals.',
    isCore: false,
    recommendedFor: ['Academia/Research'],
    singularLabel: 'Teaching Role',
    pluralLabel: 'Teaching Roles',
    fields: [
      { name: 'courseTitle', label: 'Course Title', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text', required: true },
      { name: 'university', label: 'University', type: 'text', required: true },
      { name: 'dates', label: 'Dates', type: 'text', required: true },
      { name: 'achievements', label: 'Achievements', type: 'textarea', rows: 4 }
    ]
  },
  {
    key: 'securityClearance',
    sectionLabel: 'Security Clearance',
    sectionDescription: 'For defense & government professionals.',
    isCore: false,
    recommendedFor: ['Government/Defense'],
    singularLabel: 'Clearance',
    pluralLabel: 'Clearances',
    fields: [
      { name: 'clearanceLevel', label: 'Clearance Level', type: 'text', required: true },
      { name: 'issuingAgency', label: 'Issuing Agency', type: 'text', required: true },
      { name: 'polygraph', label: 'Polygraph', type: 'text' },
      { name: 'date', label: 'Date', type: 'text' }
    ]
  },
  {
    key: 'events',
    sectionLabel: 'Workshops & Hackathons',
    sectionDescription: 'Competitions and workshops.',
    isCore: false,
    fields: [
      { name: 'eventName', label: 'Event Name', type: 'text', required: true },
      { name: 'organizer', label: 'Organizer', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'text', required: true },
      { name: 'achievement', label: 'Achievement', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 4 },
      {
        name: 'links', label: 'Links', type: 'group', repeatable: true, subFields: [
          { name: 'text', label: 'Link Text', type: 'text' },
          { name: 'url', label: 'URL', type: 'url' }
        ]
      }
    ]
  },
  {
    key: 'internships',
    sectionLabel: 'Internships',
    sectionDescription: 'Internship experience.',
    isCore: false,
    singularLabel: 'Internship',
    pluralLabel: 'Internships',
    fields: [
      { name: 'jobTitle', label: 'Job Title', type: 'text' },
      { name: 'company', label: 'Company', type: 'text' },
      { name: 'employmentType', label: 'Employment Type', type: 'text' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'dates', label: 'Dates', type: 'text' },
      {
        name: 'links', label: 'Links', type: 'group', repeatable: true, subFields: [
          { name: 'text', label: 'Link Text', type: 'text' },
          { name: 'url', label: 'URL', type: 'url' }
        ]
      },
      { name: 'description', label: 'Description', type: 'textarea', rows: 5 }
    ]
  },
  {
    key: 'declaration',
    sectionLabel: 'Declaration',
    sectionDescription: 'A formal statement confirming the accuracy of information provided.',
    isCore: false,
    singularLabel: 'Declaration',
    pluralLabel: 'Declarations',
    fields: [
      {
        name: 'statement',
        label: 'Declaration Statement',
        type: 'textarea',
        rows: 3,
        placeholder: 'I hereby declare that all the information stated above is true and correct to the best of my knowledge and belief.'
      },
      { name: 'place', label: 'Place', type: 'text', placeholder: 'e.g. Bengaluru' },
      { name: 'date', label: 'Date', type: 'text', placeholder: 'e.g. April 2025' },
      { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name (as signature)' }
    ]
  }
]
