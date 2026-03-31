const fs = require('fs');
const path = require('path');

const templates = ['classic-sidebar', 'executive-minimal'];

const SECTION_TITLES = {
  ExperienceSection: 'Experience',
  InternshipsSection: 'Internships',
  VolunteeringSection: 'Volunteer Experience',
  ClinicalExperienceSection: 'Clinical Experience',
  TeachingExperienceSection: 'Teaching Experience',
  EducationSection: 'Education',
  ProjectsSection: 'Projects',
  CertificationsSection: 'Certifications',
  AwardsSection: 'Awards & Honors',
  EventsSection: 'Workshops & Hackathons',
  PublicationsSection: 'Publications',
  PresentationsSection: 'Presentations',
  MembershipsSection: 'Professional Memberships',
  GrantsSection: 'Grants & Funding',
  LicensureSection: 'Licensure',
  BarAdmissionsSection: 'Bar Admissions',
  SecurityClearanceSection: 'Security Clearance',
  SkillsSection: 'Skills',
  LanguagesSection: 'Languages'
};

for (const tmpl of templates) {
  const file = path.join('g:', 'careerforge_v2', 'client', 'src', 'features', 'resume-builder', 'templates', tmpl, 'sections.tsx');
  let content = fs.readFileSync(file, 'utf8');

  for (const [compName, title] of Object.entries(SECTION_TITLES)) {
    // We are looking for something like:
    // const ExperienceSection = ({ entries }: { entries: any[] }) => (
    //   <> ... </>
    // )
    // OR
    // const ExperienceSection = ({ entries }: { entries: any[] }) => <ExperienceLikeRenderer ... />
    
    // We want to replace it with:
    // const ExperienceSection = ({ entries, name }: { entries: any[], name?: string }) => (
    //   <SectionWrapper title={name || "TITLE"}>
    //     ...
    //   </SectionWrapper>
    // )
    
    // So let's match the function signature:
    const regex = new RegExp(`const\\s+${compName}\\s*=\\s*\\(\\s*\\{\\s*entries\\s*\\}\\s*:\\s*\\{\\s*entries\\s*:\\s*any\\[\\]\\s*\\}\\s*\\)\\s*=>\\s*([\\s\\S]*?)(?=\\nconst |\\n\\/\\/|\\nexport )`, 'g');
    
    content = content.replace(regex, (match, body) => {
      let inner = body.trim();
      // Remove <> and </> if it wraps the whole body
      if (inner.startsWith('<>') && inner.endsWith('</>')) {
        inner = inner.slice(2, -3).trim();
      } else if (inner.startsWith('(') && inner.endsWith(')')) {
        let inside = inner.slice(1, -1).trim();
        if (inside.startsWith('<>') && inside.endsWith('</>')) {
           inner = inside.slice(2, -3).trim();
        } else {
           inner = inside;
        }
      }
      
      return `const ${compName} = ({ entries, name }: { entries: any[], name?: string }) => (\n  <SectionWrapper title={name || "${title}"}>\n    ${inner}\n  </SectionWrapper>\n)\n\n`;
    });
  }

  // Also we need to make sure SectionWrapper is imported in classic-sidebar/sections.tsx and executive-minimal/sections.tsx
  if (!content.includes('SectionWrapper')) {
    content = content.replace("import { EntryBlock }", "import { SectionWrapper } from '../shared/SectionWrapper'\nimport { EntryBlock }");
  }

  fs.writeFileSync(file, content);
  console.log('Fixed', file);
}
