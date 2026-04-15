export interface TipCard {
  title?: string
  content: string
  type: 'info' | 'good' | 'bad' | 'formula'
}

export interface SectionTip {
  purpose: string
  tips: string[]
  examples: TipCard[]
}

export const SECTION_TIPS: Record<string, SectionTip> = {
  profile: {
    purpose: "The first thing a recruiter reads. A strong profile tells the recruiter your title, level, and strongest selling point in under 60 words.",
    tips: [
      "Mirror the title in the job description you're applying for.",
      "Mention your years of experience and top-level specialization.",
      "Adding a middle initial can help with uniqueness for common names."
    ],
    examples: [
      { type: 'good', title: 'Strong Headline', content: 'Backend Engineer — Node.js & MongoDB' },
      { type: 'bad', title: 'Avoid Vague Titles', content: 'Results-Driven Professional' }
    ]
  },
  summary: {
    purpose: "A 2–4 sentence paragraph answering who you are, what you're best at, and what you bring to the role.",
    tips: [
      "Follow the formula: [Title] + [Years] + [Domain] + [Top Skills] + [Achievement].",
      "Include at least one quantified number (metric, team size, etc.).",
      "Never start with 'I' — lead with your title or a strong adjective."
    ],
    examples: [
      { 
        type: 'good', 
        title: 'Tech Summary Example', 
        content: 'Backend engineer with 2 years of experience building scalable REST APIs using Node.js and MongoDB. Specialized in system design and database optimization — reduced query latency by 40% at Razorpay by introducing Redis caching.' 
      },
      { type: 'bad', title: 'Weak Summary', content: 'I am a hardworking and passionate software engineer looking for opportunities to grow.' }
    ]
  },
  contact: {
    purpose: "Essential contact details for recruiters. Accuracy is non-negotiable.",
    tips: [
      "Use a professional email: firstname.lastname@gmail.com.",
      "Include country code for phone numbers: +91 98765 43210.",
      "Location should only be City, State — never your full street address.",
      "Link text for social/web should be short: 'LinkedIn', 'Portfolio', not full URLs."
    ],
    examples: [
      { type: 'good', title: 'Clean Links', content: 'LinkedIn: linkedin.com/in/arjun-mehta' },
      { type: 'bad', title: 'Avoid Unprofessional Emails', content: 'coolcoder99@yahoo.com' }
    ]
  },
  experience: {
    purpose: "The core of your resume. Focus on the impact you made, not just your daily tasks.",
    tips: [
      "Formula: [Strong Action Verb] + [What you did] + [Measurable Result].",
      "Aim for 3–5 bullets per role, fewer for older positions.",
      "Lead with your strongest bullet point.",
      "Use past tense for old roles, present tense for current ones."
    ],
    examples: [
      { 
        type: 'formula', 
        content: 'Engineered a Redis caching layer for the payments API, reducing average response time from 340ms to 120ms and cutting database load by 60%' 
      },
      { type: 'bad', title: 'Avoid Passive Lists', content: 'Worked on backend tasks and helped the team fix bugs.' }
    ]
  },
  education: {
    purpose: "Your academic credentials. Recent grads should highlight honors and GPA; seniors can be brief.",
    tips: [
      "Write out the full degree name (e.g., 'Bachelor of Technology').",
      "Include honors like 'First Class with Distinction' or 'Dean's List'.",
      "Only include GPA/Percentage if it's 8.0+ / 75%+ or if you're a recent grad."
    ],
    examples: [
      { type: 'good', content: 'Bachelor of Technology — Computer Science and Engineering | GPA: 9.2/10' }
    ]
  },
  skills: {
    purpose: "A scannable list of your technical and professional capabilities, grouped by category.",
    tips: [
      "Create 3–5 categories (Languages, Frameworks, Databases, Tools).",
      "List the most relevant skills first within each category.",
      "Match terminology exactly as seen in the job description."
    ],
    examples: [
      { type: 'good', title: 'Tech Stack Grouping', content: 'Languages: Python, TypeScript, Java\nDatabases: MongoDB, PostgreSQL' }
    ]
  },
  projects: {
    purpose: "Proof that you can build things. Essential for students and career changers.",
    tips: [
      "Line 1: What problem it solves. Line 2: Technical challenge or contribution.",
      "Include working links to GitHub or live demos if possible.",
      "Quantify results: 'Reduced tailoring time by 80%', 'Served 50+ concurrent requests'."
    ],
    examples: [
      { type: 'good', title: 'Strong Project Description', content: 'Built a full-stack resume builder with AI suggestions; implemented Gemini API integration reducing manual work by 80%.' }
    ]
  },
  certifications: {
    purpose: "Formal credentials that verify specialized skills (Cloud, Security, PM, etc.).",
    tips: [
      "Use full official names (e.g., 'AWS Certified Solutions Architect').",
      "Include Credential ID and a verification link to ensure it's verifiable."
    ],
    examples: [
      { type: 'good', content: 'AWS Certified Developer – Associate (Issued: Sep 2024)' }
    ]
  },
  awards: {
    purpose: "Recognition that validates your excellence. High-quality social proof.",
    tips: [
      "Mention the competitive context: 'Selected from 2,000+ applicants'.",
      "Explain why the award matters if it's not a common household name."
    ],
    examples: [
      { type: 'good', content: 'Employee of the Quarter — Q3 2024 (Recognized for reducing P1 incidents by 40%)' }
    ]
  },
  events: {
    purpose: "Participation in hackathons, workshops, and training. Shows initiative and community work.",
    tips: [
      "Be specific about achievements: 'Winner – Best Use of AI' rather than just 'Won'.",
      "Describe what you built and the stack used in 36-hour sprint context."
    ],
    examples: [
      { type: 'good', content: 'Smart India Hackathon 2024 — Grand Finalist (Top 36 of 75,000 teams)' }
    ]
  },
  volunteering: {
    purpose: "Social impact and community work. Shows leadership and character.",
    tips: [
      "Apply the same impact-first thinking as Work Experience.",
      "Quantify: 'Helped 200+ students', 'Raised ₹1.8L for school supplies'."
    ],
    examples: [
      { type: 'good', content: 'Open Source Contributor (Mozilla PDF.js) — 12 merged PRs fixing RTL issues' }
    ]
  },
  languages: {
    purpose: "Languages you speak. A differentiator for international and client-facing roles.",
    tips: [
      "Use standard levels: Native, Bilingual, Fluent, Professional, Conversational.",
      "Be honest — fluency will be tested in an interview."
    ],
    examples: [
      { type: 'good', content: 'English — Fluent | Hindi — Native' }
    ]
  },
  publications: {
    purpose: "Academic or professional written work. Essential for research and healthcare resumes.",
    tips: [
      "Use exact published titles and standard academic citation formats.",
      "Include a DOI link and a brief non-specialist summary of the impact."
    ],
    examples: [
      { type: 'good', content: 'A Graph Neural Network Approach to Protein Prediction (Nature Science, 2024)' }
    ]
  },
  presentations: {
    purpose: "Talks, panels, and poster sessions. Signals expertise and category authority.",
    tips: [
      "Include Conference Name, Location, and Month/Year.",
      "Mention reception: 'Attended by 180+ engineers' or '4,000+ views on slides'."
    ],
    examples: [
      { type: 'good', content: 'Scaling Event-Driven Architectures (PyCon India 2024 – Bengaluru)' }
    ]
  },
  memberships: {
    purpose: "Connection to professional communities (IEEE, ACM, IMA, etc.).",
    tips: [
      "Include if you have a leadership role (President, Committee Chair).",
      "Skip if you're just a generic member and need space."
    ],
    examples: [
      { type: 'good', content: 'Institute of Electrical and Electronics Engineers (IEEE) — Chapter President' }
    ]
  },
  grants: {
    purpose: "Research funding secured. Critical for academic CVs.",
    tips: [
      "Always include the amount (e.g., ₹45 Lakhs or $850k).",
      "Note your role clearly: Principal Investigator (PI) vs Co-PI."
    ],
    examples: [
      { type: 'good', content: 'ML Models for Air Quality Prediction (Awarded: ₹45 Lakhs, DST Govt of India)' }
    ]
  },
  teachingExperience: {
    purpose: "Course instruction, TA roles, and curriculum design.",
    tips: [
      "Mention end-of-term feedback or permanent materials you created.",
      "Quantify: 'Designed 12 lab sessions for 85 students'."
    ],
    examples: [
      { type: 'good', content: 'Lead Teaching Assistant (Data Structures) — Achieved 94% positive evaluation' }
    ]
  },
  clinicalExperience: {
    purpose: "Hands-on clinical training for healthcare professionals (Nursing, Medicine, etc.).",
    tips: [
      "Include Total Clinical Hours — it's often a minimum legal requirement.",
      "Highlight procedural zero-error records or specific ward impacts."
    ],
    examples: [
      { type: 'good', content: 'Pediatric ICU Rotation (120 Hours) — Administered IV medications with zero errors' }
    ]
  },
  licensure: {
    purpose: "Required professional licenses (RN, MBBS, PharmD, PE).",
    tips: [
      "Always include the License Number for instant verification.",
      "Verify expiration dates to ensure your license is current."
    ],
    examples: [
      { type: 'good', content: 'Registered Nurse (RN) — Karnataka Nursing Council | License #: MH1234' }
    ]
  },
  barAdmissions: {
    purpose: "Jurisdictions where you are licensed to practice law.",
    tips: [
      "Include Admission Year and State Bar Enrollment Number.",
      "Multiple state admissions are a significant differentiator."
    ],
    examples: [
      { type: 'good', content: 'Bar Council of Maharashtra — Enrollment No. MH/1234/2022' }
    ]
  },
  securityClearance: {
    purpose: "Active government security clearances (Defense, Intelligence).",
    tips: [
      "Use exact levels (Secret, Top Secret, TS/SCI).",
      "Highlight the date of the last investigation to show it's active."
    ],
    examples: [
      { type: 'good', content: 'SECRET Clearance — Ministry of Defence, Govt of India (Active 2024)' }
    ]
  },
  custom: {
    purpose: "Flexible section for anything that doesn't fit (Patents, Hobbies, Open Source).",
    tips: [
      "Use specific titles: 'Patents' or 'Extracurriculars' instead of 'Other'.",
      "Each line becomes a bullet point. Write one impact item per line."
    ],
    examples: [
      { type: 'good', title: 'Open Source Example', content: 'Maintainer of react-resume-kit — 340+ GitHub Stars' }
    ]
  },
  declaration: {
    purpose: "A formal statement used in Indian resumes confirming that all information provided is true and accurate. Place it at the very end of your resume.",
    tips: [
      "Use the standard wording: 'I hereby declare that the information furnished above is true and correct to the best of my knowledge and belief.'",
      "Include your Place and Date alongside your name — it makes the declaration look official.",
      "Your typed full name acts as the signature line.",
      "This section is optional for most corporate roles but expected in government, PSU, and academic applications."
    ],
    examples: [
      { type: 'good', title: 'Standard Declaration', content: 'I hereby declare that all the information stated above is true and correct to the best of my knowledge and belief.\n\nPlace: Bengaluru\nDate: April 2025\nArjun Mehta' }
    ]
  }
}
