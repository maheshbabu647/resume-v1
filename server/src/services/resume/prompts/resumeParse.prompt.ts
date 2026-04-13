export const buildResumeParsePrompt = (rawText: string): string => `
You are an expert resume parser. Extract all information from the following resume text and structure it into a precise JSON format.

## Instructions
- Extract ALL data present in the resume — do not skip any section
- For fields not present, use empty string "" or empty array []
- For singular 'dates' fields, combine start and end dates (e.g. "Jan 2020 – Present" or "2018 - 2022"). Do NOT output separate startDate and endDate.
- For skills, group them into logical categories if they appear grouped, else use "Technical Skills" as default category.
- For contactLinks, extract LinkedIn, GitHub, Portfolio, Website etc. — use the display text as "text" and full URL as "url"
- Each section entry must be its own object in the entries array
- The "sections" array must only include sections that have actual content from the resume
- Ensure exact property names are used as defined in the schema below.

## Output JSON Schema

{
  "personalInfo": {
    "fullName": "string",
    "title": "string (professional title if present)",
    "email": "string",
    "phone": "string",
    "location": "string (City, State/Country)",
    "summary": "string (professional summary/objective paragraph)",
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

## Important Rules
- ONLY include sections whose keys appear in the schema above
- ONLY include sections that have actual data from the resume
- Respond with ONLY valid JSON — no markdown, no explanation, no code fences
- Preserve bullet point text in "description" fields with newline characters
- Pay special attention to exact property names! For example, output "skillList" not "skills", "qualification" not "degree", "dates" not "startDate".
- **Categorization Rule**: Put all Hackathons, Workshops, and Tech Competitions in the "events" section. Use "awards" ONLY for honors, rewards, and formal recognitions. Do NOT mix them.
- **Section Visibility**: The "sections" array must ONLY include sections with at least one entry. Do NOT return empty sections. Set "visible": true for every section you include.

## Resume Text to Parse:
---
${rawText}
---
`.trim()

