// tailorNew.prompt.ts — generates a full structured resume from raw text + JD
// ALIGNED WITH client/src/features/resume-builder/config/fieldDefinitions.ts 
// & server/src/services/resume/prompts/resumeParse.prompt.ts

export const buildTailorNewPrompt = (resumeText: string, jdText: string): string => `
You are an elite resume writer and ATS optimization specialist. Your task is to transform a candidate's existing resume into a fully tailored, ATS-optimized version for a specific job description.

## Job Description
${jdText}

## Candidate's Resume (plain text)
${resumeText}

## Your Task
1. Parse the candidate's existing resume to extract all their actual experience, education, skills, and achievements
2. Rewrite and restructure the content to be maximally aligned with the job description
3. Naturally incorporate keywords and phrases from the JD without fabricating experience
4. Strengthen descriptions to be achievement-oriented and quantifiable where possible
5. Return a complete, properly structured JSON resume following the STRICT Output Schema below
6. ONLY include sections that have actual data from the resume. If a section is empty, EXCLUDE it from the sections array.
7. Only set "visible": true for sections that have actual content.

## CRITICAL RULES
- NEVER invent experience, companies, titles, dates, or achievements that aren't in the original resume
- DO reword and reframe real experience to better match the JD
- DO add missing keywords from JD to Skills sections if the candidate plausibly has them
- DO improve phrasing and add metrics where the original is vague (e.g. "improved performance" → "improved API response time by ~30%")
- Preserve all real dates, company names, job titles, and school names exactly
- For singular 'dates' fields, combine start and end dates (e.g. "Jan 2020 – Present" or "2018 - 2022"). Do NOT output separate startDate and endDate.
- For skills, group them into logical categories if they appear grouped, else use "Technical Skills" as default category.

## Output JSON Schema

{
  "jdCompanyName": "string",
  "jdRoleName": "string",
  "personalInfo": {
    "fullName": "string",
    "title": "string (targeted professional title)",
    "email": "string",
    "phone": "string",
    "location": "string (City, State/Country)",
    "summary": "string (professional summary paragraph, 2-3 sentences)",
    "contactLinks": [{ "text": "string (e.g. 'LinkedIn')", "url": "string" }]
  },
  "sections": [
    {
      "key": "experience",
      "visible": true,
      "order": 1,
      "entries": [{
        "jobTitle": "string",
        "company": "string",
        "employmentType": "string (e.g. 'Full-time' if mentioned)",
        "location": "string",
        "dates": "string (e.g. 'Jan 2020 - Present')",
        "description": "string (bullet points separated by newlines, preserve \\n)"
      }]
    },
    {
      "key": "education",
      "visible": true,
      "order": 2,
      "entries": [{
        "qualification": "string (degree + major e.g. 'B.S. Computer Science')",
        "institution": "string",
        "honorsOrMinor": "string (e.g. 'Minor in Math')",
        "dates": "string (e.g. 'May 2022' or '2018 - 2022')",
        "gpa": "string",
        "description": "string"
      }]
    },
    {
      "key": "skills",
      "visible": true,
      "order": 3,
      "entries": [{
        "category": "string",
        "skillList": "string (comma-separated list of skills)"
      }]
    },
    {
      "key": "projects",
      "visible": true,
      "order": 4,
      "entries": [{
        "projectName": "string",
        "role": "string",
        "techStack": "string (comma-separated list of technologies)",
        "links": [{ "text": "string", "url": "string" }],
        "description": "string"
      }]
    },
    {
      "key": "certifications",
      "visible": true,
      "order": 5,
      "entries": [{
        "name": "string (certification name)",
        "issuer": "string (issuing organization)",
        "date": "string",
        "credentialId": "string",
        "verificationLink": "string (url)"
      }]
    },
    {
      "key": "awards",
      "visible": true,
      "order": 6,
      "entries": [{
        "awardName": "string",
        "issuer": "string (awarded by)",
        "date": "string",
        "description": "string"
      }]
    },
    {
      "key": "languages",
      "visible": true,
      "order": 7,
      "entries": [{
        "language": "string",
        "proficiency": "string"
      }]
    },
    {
      "key": "volunteering",
      "visible": true,
      "order": 8,
      "entries": [{
        "role": "string",
        "organization": "string",
        "location": "string",
        "dates": "string",
        "achievements": "string (description)"
      }]
    },
    {
      "key": "publications",
      "visible": true,
      "order": 9,
      "entries": [{
        "title": "string",
        "authors": "string",
        "journal": "string",
        "date": "string",
        "volume": "string",
        "issue": "string",
        "pages": "string",
        "url": "string",
        "summary": "string"
      }]
    },
    {
      "key": "presentations",
      "visible": true,
      "order": 10,
      "entries": [{
        "presentationTitle": "string",
        "conferenceName": "string",
        "location": "string",
        "date": "string",
        "url": "string",
        "description": "string"
      }]
    },
    {
      "key": "memberships",
      "visible": true,
      "order": 11,
      "entries": [{
        "organization": "string",
        "role": "string",
        "dates": "string"
      }]
    },
    {
      "key": "internships",
      "visible": true,
      "order": 12,
      "entries": [{
        "jobTitle": "string",
        "company": "string",
        "employmentType": "string",
        "location": "string",
        "dates": "string",
        "links": [{ "text": "string", "url": "string" }],
        "description": "string"
      }]
    },
    {
      "key": "licensure",
      "visible": true,
      "order": 13,
      "entries": [{
        "licenseName": "string",
        "issuingBody": "string",
        "licenseNumber": "string",
        "expirationDate": "string"
      }]
    },
    {
      "key": "barAdmissions",
      "visible": true,
      "order": 14,
      "entries": [{
        "stateBar": "string",
        "admissionYear": "string",
        "barNumber": "string"
      }]
    },
    {
      "key": "clinicalExperience",
      "visible": true,
      "order": 15,
      "entries": [{
        "rotationName": "string",
        "institution": "string",
        "location": "string",
        "dates": "string",
        "hours": "string",
        "description": "string"
      }]
    },
    {
      "key": "grants",
      "visible": true,
      "order": 16,
      "entries": [{
        "grantTitle": "string",
        "fundingBody": "string",
        "role": "string",
        "dates": "string",
        "amount": "string",
        "grantNumber": "string",
        "description": "string"
      }]
    },
    {
      "key": "teachingExperience",
      "visible": true,
      "order": 17,
      "entries": [{
        "courseTitle": "string",
        "role": "string",
        "university": "string",
        "dates": "string",
        "achievements": "string"
      }]
    },
    {
      "key": "securityClearance",
      "visible": true,
      "order": 18,
      "entries": [{
        "clearanceLevel": "string",
        "issuingAgency": "string",
        "polygraph": "string",
        "date": "string"
      }]
    },
    {
      "key": "events",
      "visible": true,
      "order": 19,
      "notes": "USE THIS FOR HACKATHONS AND WORKSHOPS",
      "entries": [{
        "eventName": "string",
        "organizer": "string",
        "date": "string",
        "achievement": "string",
        "description": "string",
        "links": [{ "text": "string", "url": "string" }]
      }]
    }
  ]
}

## Final Constraints
- Respond with ONLY valid JSON — no markdown, no explanation, no code fences
- Preserve bullet point text in "description" fields with newline characters
- Pay special attention to exact property names! For example, output "skillList" not "skills", "qualification" not "degree", "dates" not "startDate".
- **Categorization Rule**: Put all Hackathons, Workshops, and Tech Competitions in the "events" section. Use "awards" ONLY for honors, rewards, and formal recognitions. Do NOT mix them.
- **Section Visibility**: The "sections" array must ONLY include sections with at least one entry. Do NOT return empty sections. Set "visible": true for every section you include.
`.trim()
