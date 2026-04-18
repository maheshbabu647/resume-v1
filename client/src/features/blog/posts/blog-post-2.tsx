import { BlogPostLayout } from '../BlogPostLayout'
import blogCover from '@/assets/blog-post-1-cover.png' // Using same cover as placeholder if 2 doesn't exist

const TOC = [
  { id: 'stop-canva', text: '1. Stop. Before You Open Canva.' },
  { id: 'one-rule', text: '2. The One Rule That Governs Everything' },
  { id: 'anatomy', text: '3. The Anatomy of a Perfect Indian Fresher Resume' },
  { id: 'section-1-header', text: '4. Section 1: The Header' },
  { id: 'section-2-objective', text: '5. Section 2: The Objective' },
  { id: 'section-3-education', text: '6. Section 3: Education' },
  { id: 'section-4-technical-skills', text: '7. Section 4: Technical Skills' },
  { id: 'section-5-projects', text: '8. Section 5: Projects' },
  { id: 'section-6-internships', text: '9. Section 6: Internships (If You Have Them)' },
  { id: 'section-7-certifications', text: '10. Section 7: Certifications' },
  { id: 'section-8-extracurricular', text: '11. Section 8: Extracurricular Activities' },
  { id: 'section-9-declaration', text: '12. Section 9: Declaration (Optional)' },
  { id: 'formatting-rules', text: '13. The Formatting Rules' },
  { id: 'notepad-test', text: '14. The Notepad Test — Your Final Quality Check' },
  { id: 'complete-template', text: '15. The Complete Template' },
  { id: 'checklist', text: '16. The 2-Minute Pre-Submission Checklist' }
]

export default function BlogPost2() {
  return (
    <BlogPostLayout
      slug="ats-friendly-resume-format-indian-freshers-2026"
      heroImagePath={blogCover}
      tocEntries={TOC}
    >
      <blockquote>
        <p><em>You read Blog 1. You now know what ATS is and why it buries resumes.</em></p>
        <p><em>This is the blog where you fix yours.</em></p>
      </blockquote>

      <hr />

      <h2 id="stop-canva">1. Stop. Before You Open Canva.</h2>
      <p>
        Most freshers in India start building their resume by opening Canva, picking the template that looks the most impressive, and filling in their details.
      </p>
      <p>
        It feels productive. The result looks polished. Then they upload it to the TCS portal and hear nothing back for three weeks.
      </p>
      <p>
        Here's the problem: <strong>Canva templates are designed for human eyes. ATS systems don't have eyes.</strong>
        <br/><br/>
        <em>Canva is great for visual resumes and portfolios — but not for ATS-driven hiring systems.</em>
      </p>
      <p>
        They have parsers — software that reads raw text from your document and tries to make sense of what it finds. When it encounters a two-column Canva layout with sidebar icons, text boxes, and a photo in the corner, the parser gets confused. It scrambles sections. Skills end up merged with education. Contact details vanish. The parser can't build a clean profile from the chaos — so your score drops, and the recruiter never sees you.
      </p>
      <p>
        Today's blog is the fix. It's the complete, section-by-section guide to building a resume that passes every ATS used by Indian companies — from TCS iON to Naukri RChilli to Taleo to Workday — and still reads like a professional document when a human opens it. Every section covered. Every formatting decision explained. A real template at the end. Let's build.
      </p>

      <hr />

      <h2 id="one-rule">2. The One Rule That Governs Everything</h2>
      <p>
        Before we get into sections, margins, and fonts, there is a single rule that overrides every other formatting decision:
      </p>
      <p><strong>If you can't copy the text cleanly into Notepad, your resume will fail ATS.</strong></p>
      <p>
        That's it. That's the rule. Open Notepad on your computer. Copy everything from your current resume and paste it in. What you see in that Notepad window is exactly what an ATS parser sees when it processes your file.
      </p>
      <p>
        If it's clean — sections in order, words readable, no jumbled fragments — your resume will parse correctly. If it's chaos — words from two columns merged into one line, skills scattered between education bullets, your name appearing halfway down the document — ATS will not be able to make sense of it, and your score will reflect that.
      </p>
      <p>
        Every formatting decision in this guide is designed to pass that Notepad test.
      </p>

      <hr />

      <h2 id="anatomy">3. The Anatomy of a Perfect Indian Fresher Resume</h2>
      <p>
        Here is the exact section order that works for Indian freshers applying to TCS, Infosys, Wipro, HCL, Accenture, Cognizant, startups, and every other employer that uses ATS:
      </p>

      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}>{`1.  HEADER (Contact Information)
2.  OBJECTIVE
3.  EDUCATION
4.  TECHNICAL SKILLS
5.  PROJECTS
6.  INTERNSHIPS (if any)
7.  CERTIFICATIONS
8.  EXTRACURRICULAR ACTIVITIES
9.  DECLARATION (optional — for campus/government applications)`}</pre>

      <p><strong>Why this order specifically?</strong></p>
      <p>
        Because this is how Indian recruiters — especially at mass campus drives — are trained to read a fresher resume. Your CGPA needs to be visible in the first 10 seconds. Your projects need to be prominent, because they are your substitute for work experience. Your skills need to be keyword-dense to pass ATS scoring.
      </p>
      <p>
        Experienced professionals put skills at the bottom. Freshers in India put education and skills near the top. This is not wrong — it's correct for your situation. Now let's build each section properly.
      </p>

      <hr />

      <h2 id="section-1-header">4. Section 1: The Header</h2>
      <p><strong>What it is:</strong> Your name and contact information. The first thing the ATS parses and the first thing a recruiter sees.</p>
      <p><strong>What to include:</strong></p>

      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}>{`PRIYA SHARMA
+91-98765-43210  |  priya.sharma@gmail.com  |  Hyderabad, Telangana
linkedin.com/in/priyasharma  |  github.com/priyasharma`}</pre>

      <p><strong>The rules:</strong></p>
      <ul>
        <li><strong>Your name</strong> — Bold. Slightly larger than everything else (16–18pt). Nothing flashy — just your full name, clean.</li>
        <li><strong>Phone number</strong> — Use +91 format. Don't write 0-9876543210. Write +91-98765-43210. This is the international format that Indian ATS systems and global platforms expect.</li>
        <li><strong>Email</strong> — Professional only. The rule is simple: <code>firstname.lastname@gmail.com</code> is professional. <code>cooldev2001@gmail.com</code> is not. 35% of employers in surveys say an unprofessional email address is an immediate negative signal.</li>
        <li><strong>Location</strong> — City + State only. Not your full home address. Not your pin code. Not your street name. A recruiter doesn't need to know which street you live on. They need to know you are in the right city or are willing to relocate.</li>
        <li><strong>LinkedIn</strong> — Include the URL. Customize it first. Go to LinkedIn → Edit Profile → Edit URL. Change it from <code>linkedin.com/in/priya-sharma-b4a93x291</code> to <code>linkedin.com/in/priyasharma</code>. Clean URLs look professional and are easier for ATS to parse correctly.</li>
        <li><strong>GitHub</strong> — Include it if you are in a technical field. Even if your repositories are limited, a GitHub link signals that you take your craft seriously.</li>
      </ul>

      <p><strong>What NOT to include:</strong></p>
      <ul>
        <li>❌ Photo (remove it — for private sector, IT, MNC applications)</li>
        <li>❌ Date of birth</li>
        <li>❌ Marital status</li>
        <li>❌ Father's name</li>
        <li>❌ Religion or caste</li>
        <li>❌ Full home address with street and pin code</li>
        <li>❌ WhatsApp number as a separate line (your phone number is already there)</li>
      </ul>
      <p>The photo, DOB, and personal details belong in a government job biodata form — not in a professional resume for private sector applications.</p>

      <hr />

      <h2 id="section-2-objective">5. Section 2: The Objective</h2>
      <p><strong>What it is:</strong> A 2–3 line statement at the top of your resume that tells the recruiter exactly who you are, what you can do, and what role you are applying for.</p>
      <p>Freshers should use an <strong>Objective</strong> (where you're going) rather than a <strong>Summary</strong> (where you've been). You haven't been anywhere professionally yet — and that's fine. The objective is honest and effective.</p>
      
      <p><strong>The formula:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}>{`[Degree] graduate in [Branch] from [College], with strong foundation in 
[Top 2-3 Skills]. Seeking a [Target Role] at [Company/Type of Company] 
to [Value you bring or what you want to contribute].`}</pre>

      <p><strong>A weak objective (what 80% of freshers write):</strong></p>
      <blockquote><p>"Seeking a challenging position in a reputed organization where I can utilize my skills and grow professionally."</p></blockquote>
      <p>This says nothing. It could be written by anyone. It has no keywords. It won't help your ATS score.</p>

      <p><strong>A strong objective:</strong></p>
      <blockquote><p>"B.Tech Computer Science graduate from VIT Vellore with strong foundation in Java, Python, and Data Structures. Seeking a Software Developer role to build scalable backend systems and contribute to product development in a technology-driven organization."</p></blockquote>

      <p><strong>Why this works:</strong></p>
      <ul>
        <li>Contains degree and branch (ATS can categorize you correctly)</li>
        <li>Contains specific technical keywords (Java, Python, Data Structures — ATS keyword match)</li>
        <li>Contains target role (ATS matches you to the right job opening)</li>
        <li>Contains a clear value statement (human reader understands your intent)</li>
      </ul>
      <p><strong>Customize it for every application.</strong> Change the target role and 1–2 skills to match the JD. This 30-second customization meaningfully improves your ATS keyword match.</p>

      <hr />

      <h2 id="section-3-education">6. Section 3: Education</h2>
      <p><strong>What it is:</strong> Your academic qualifications, listed in reverse chronological order (most recent first).</p>
      <p><strong>For Indian freshers, this is your most important section</strong> — because CGPA is often the first filter companies apply. TCS requires 60% / 6.0 CGPA. Infosys requires similar minimums. Wipro, Cognizant, and HCL all have eligibility cutoffs. The recruiter needs to see your CGPA immediately.</p>
      
      <p><strong>How to format it:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}>{`EDUCATION

B.Tech in Computer Science Engineering
XYZ College of Engineering, Hyderabad | 2021 – 2025 | CGPA: 8.2 / 10.0

Class XII — CBSE
ABC School, Hyderabad | 2021 | Percentage: 88%

Class X — CBSE
ABC School, Hyderabad | 2019 | Percentage: 91%`}</pre>

      <p><strong>The decisions explained:</strong></p>
      <ul>
        <li><strong>Should you include 10th and 12th?</strong> Yes — for Indian companies especially. TCS, Infosys, and Wipro explicitly check 10th and 12th percentages as part of eligibility screening. Include both if your scores are above 60–70%. If below 60%, include only degree-level education unless a company specifically asks.</li>
        <li><strong>Should you list your CGPA or percentage?</strong> Always list your CGPA if it is 7.0 or above. If it is between 6.0 and 6.9, list it (you clear the minimum for most companies). If it is below 6.0, you can choose not to list it — but be aware that it may come up in background checks, so never fabricate it. Also use the format <code>X.X / 10.0</code> for Workday compatibility.</li>
        <li><strong>Should you list relevant coursework?</strong> For highly relevant courses, yes — briefly. "Relevant Coursework: Data Structures, DBMS, Operating Systems, Computer Networks" directly in your education section adds searchable keywords without taking much space.</li>
        <li><strong>Should you include your college address?</strong> No. College name + city is sufficient.</li>
      </ul>

      <hr />

      <h2 id="section-4-technical-skills">7. Section 4: Technical Skills</h2>
      <p><strong>What it is:</strong> A keyword-dense list of technologies, tools, languages, and platforms you know.</p>
      <p>This section is the <strong>heart of your ATS score.</strong> More than any other section, the skills section determines how high you rank in the ATS against a specific job description. Every keyword here is a potential match point.</p>
      
      <p><strong>How to format it:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}>{`TECHNICAL SKILLS

Programming Languages:  Java, Python, C, C++, SQL
Web Technologies:       HTML, CSS, JavaScript, React.js, Node.js
Databases:              MySQL, MongoDB, PostgreSQL
Tools & Platforms:      Git, GitHub, VS Code, IntelliJ IDEA, Postman
Cloud:                  AWS (EC2, S3 — basics), Firebase
Operating Systems:      Windows, Linux (Ubuntu)
Soft Skills:            Problem-solving, Team Collaboration, Time Management`}</pre>

      <p><strong>The rules:</strong></p>
      <ul>
        <li><strong>Categorize.</strong> Don't dump a wall of comma-separated words. Group skills by type. This helps both the ATS categorize your skills correctly and makes it easier for human reviewers to scan.</li>
        <li><strong>List only what you can speak to in an interview.</strong> A recruiter who calls you for an interview has your resume in front of them. If you listed "Machine Learning" and they ask you one basic question about it, you need to have an answer. Only list skills you are genuinely ready to discuss — even at a basic level.</li>
        <li><strong>Don't use rating bars or percentages.</strong> "Python — ████████░░ 80%" is completely invisible to ATS. Write "Python" and nothing else. The word is the keyword. The rating system adds zero value and may actually confuse parsing.</li>
        <li><strong>Include full terms alongside abbreviations.</strong> "DBMS (Database Management Systems)" or "OOP (Object-Oriented Programming)" ensures ATS matches both the abbreviation and the full term, since different JDs use different versions.</li>
      </ul>

      <p><strong>Skills by stream (quick reference):</strong></p>
      <ul>
        <li><strong>For CSE/IT:</strong> Java, Python, C++, SQL, JavaScript, React, Node.js, Git, DBMS, Data Structures, Algorithms, REST APIs, HTML/CSS, Linux, Agile</li>
        <li><strong>For ECE (core roles):</strong> VLSI, Embedded C, MATLAB, Arduino, PCB Design, IoT, Microcontrollers, Raspberry Pi, VHDL, Signal Processing</li>
        <li><strong>For ECE (IT pivot):</strong> Python, SQL, IoT, Embedded Systems, Java, Machine Learning basics, MATLAB, Arduino</li>
        <li><strong>For Mechanical:</strong> AutoCAD, SolidWorks, CATIA, ANSYS, MATLAB, CAD/CAM, Thermodynamics, Finite Element Analysis, MS Project</li>
        <li><strong>For B.Com / Commerce:</strong> Tally ERP 9, MS Excel, GST, TDS, SAP FICO basics, Busy Accounting, Financial Statements, Zoho Books</li>
      </ul>

      <hr />

      <h2 id="section-5-projects">8. Section 5: Projects</h2>
      <p><strong>What it is:</strong> Your substitute for work experience. The section that separates you from every other fresher with the same CGPA and same skills list.</p>
      <p><strong>This is where 80% of your interview questions will come from.</strong> Every technical project bullet you write is a potential interview thread. Write them with that awareness.</p>
      
      <p><strong>How to format it:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}>{`PROJECTS

E-Commerce Web Application | React.js, Node.js, MongoDB, Express.js
• Built a full-stack e-commerce platform with user authentication, 
  product catalog, and payment gateway integration
• Implemented RESTful APIs for product management and order processing 
  using Node.js and Express
• Deployed on AWS EC2 with MongoDB Atlas as cloud database; 
  handled 50+ concurrent test users during load testing
• GitHub: github.com/priyasharma/ecommerce-app

Stock Price Prediction System | Python, Scikit-learn, Pandas, Matplotlib
• Developed an ML model using Linear Regression and LSTM networks to 
  predict stock prices based on 5 years of historical data
• Achieved 87% accuracy on test dataset using cross-validation 
  with Mean Absolute Error of ±2.3%
• Visualized prediction vs actual price trends using Matplotlib dashboards`}</pre>

      <p><strong>The structure for each project:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}>{`Project Name | Technologies Used (comma-separated)
• What it does (1 line — the product)
• How you built it (tools, architecture, methods)
• What happened / outcome (numbers, scale, improvement)
• GitHub link (if available)`}</pre>

      <p><strong>The rules:</strong></p>
      <ul>
        <li><strong>Tech stack in the title line.</strong> The comma-separated list of technologies right after the project name is incredibly valuable for ATS. "React.js, Node.js, MongoDB" on one line gives the parser three strong keyword matches without any ambiguity.</li>
        <li><strong>Quantify everything possible.</strong> "Handled 50+ concurrent users" is better than "built a scalable system." "Achieved 87% accuracy" is better than "the model performed well." Numbers make bullets credible to humans and add specificity that ATS can parse.</li>
        <li><strong>Include 2–4 projects.</strong> Quality beats quantity. Two well-described, keyword-rich projects with GitHub links beat six vague bullet points about things you "worked on."</li>
        <li><strong>Use action verbs.</strong> Built, Developed, Implemented, Deployed, Designed, Integrated, Optimized, Automated, Analyzed. Never use "worked on," "participated in," or "assisted with."</li>
        <li><strong>GitHub link per project.</strong> Not mandatory, but each link signals that the work is real, verifiable, and that you take your projects seriously.</li>
      </ul>

      <hr />

      <h2 id="section-6-internships">9. Section 6: Internships (If You Have Them)</h2>
      <p><strong>What it is:</strong> Paid or unpaid internships, industrial training, or significant virtual internships.</p>
      <p>If you have internship experience, it goes between Projects and Certifications and is treated like a mini work experience section.</p>
      
      <p><strong>How to format it:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}>{`INTERNSHIPS

Software Development Intern | ABC Tech Solutions, Hyderabad
June 2024 – August 2024 (8 weeks)
• Developed and maintained RESTful APIs for the company's internal 
  HR management system using Spring Boot and MySQL
• Reduced API response time by 40% through query optimization 
  and connection pooling
• Collaborated with a team of 4 developers in an Agile sprint cycle`}</pre>

      <p>If you don't have an internship — do not worry. The majority of Indian freshers who get placed at TCS, Infosys, and Wipro do not have formal internship experience. That's why the Projects section exists.</p>
      <p>What counts as "internship" if you have no formal one: NPTEL lab projects, Internshala virtual internships (they issue a certificate — include it), college-arranged factory visits if substantial, meaningful freelance work.</p>

      <hr />

      <h2 id="section-7-certifications">10. Section 7: Certifications</h2>
      <p><strong>What it is:</strong> Online courses, platform certifications, and professional credentials that verify your skills.</p>
      <p>Certifications do two things: they add credibility for the human reviewer and they add searchable keywords for the ATS.</p>
      
      <p><strong>How to format it:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}>{`CERTIFICATIONS

Google Data Analytics Professional Certificate — Google / Coursera (2024)
AWS Cloud Practitioner Essentials — Amazon Web Services (2024)
Python for Everybody — University of Michigan / Coursera (2023)
Data Structures and Algorithms — NPTEL (Score: 76%) (2023)`}</pre>

      <p><strong>What to include:</strong></p>
      <ul>
        <li><strong>Tier 1 (high value):</strong> Google Career Certificates, AWS Cloud Practitioner, Meta Front End / Back End, Microsoft Azure Fundamentals, Cisco CCNA, CFA Institute certifications</li>
        <li><strong>Tier 2 (solid):</strong> NPTEL courses (especially with 60%+ score), HackerRank certifications, Infosys Springboard, IBM certifications on Coursera</li>
        <li><strong>Tier 3 (supplementary):</strong> Udemy, Coursera individual courses — include if highly relevant to the target role</li>
      </ul>
      <p><strong>What NOT to include:</strong> Seminars you attended (unless you presented), one-hour YouTube "courses," or anything that doesn't have a verifiable certificate.</p>

      <hr />

      <h2 id="section-8-extracurricular">11. Section 8: Extracurricular Activities</h2>
      <p><strong>What it is:</strong> Leadership roles, competitions, clubs, sports achievements, and volunteer work.</p>
      <p>This section exists to show that you are more than your CGPA — that you have initiative, leadership, and team experience outside the classroom.</p>
      
      <p><strong>How to format it:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}>{`EXTRACURRICULAR ACTIVITIES

Technical Club Head | IEEE Student Chapter, XYZ College (2023–2024)
• Led a team of 12 members, organized 4 workshops on IoT and 
  Machine Learning attended by 150+ students
• Coordinated inter-college hackathon with participation from 8 colleges

Participant | Smart India Hackathon 2024
• Developed an AI-powered water quality monitoring system prototype 
  with Team of 6; reached state-level finals

NSS Volunteer | National Service Scheme (2022–2024)
• Contributed 120+ hours across rural literacy and health camp programs`}</pre>

      <p><strong>The rule: write activities like work experience.</strong> Don't say "was a member of the coding club." Say "Led weekly coding challenges for 35+ club members, increasing participation by 60%." Even small roles become impressive when written with outcomes and action verbs.</p>
      <p>What impresses recruiters: Technical club leadership, hackathon participation (even if you didn't win), NSS/NCC with substantial hours, sports at state/national level, student council roles, publication or paper presentation.</p>
      <p>What doesn't add value: Generic hobbies (reading, music, movies, travelling) — unless you have something specific and verifiable to say about them. "Reading" tells a recruiter nothing. Leave it off.</p>

      <hr />

      <h2 id="section-9-declaration">12. Section 9: Declaration (Optional)</h2>
      <p><strong>What it is:</strong> A statement confirming that the information on your resume is truthful.</p>
      <p>This is a distinctly Indian resume tradition. Global resume formats don't include it. But for campus placement drives, PSU applications, and government-adjacent companies, it's expected.</p>
      
      <p><strong>Standard wording:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}>{`DECLARATION

I hereby declare that all the information provided above is true,
accurate, and correct to the best of my knowledge and belief.

Place: Hyderabad
Date:  [Date of submission]
Signature: ________________`}</pre>

      <p><strong>When to include it:</strong></p>
      <ul>
        <li>✅ Campus placement drives (TCS, Infosys, Wipro, Cognizant — mass hiring)</li>
        <li>✅ Government and PSU applications</li>
        <li>✅ Traditional manufacturing or core engineering companies</li>
        <li>❌ Startups and product companies — leave it off</li>
        <li>❌ International companies and global MNCs — leave it off</li>
        <li>❌ Creative or tech-first companies (Flipkart, Swiggy, Razorpay) — leave it off</li>
      </ul>

      <hr />

      <h2 id="formatting-rules">13. The Formatting Rules — Covered One by One</h2>
      <p>You have the sections. Now let's go through every formatting decision that affects ATS parsing and human readability.</p>

      <h3>Font</h3>
      <ul>
        <li><strong>Use:</strong> Calibri, Arial, Georgia, or Times New Roman.</li>
        <li><strong>Size:</strong> 10–11pt for body text. 12–14pt for section headings. 16–18pt for your name.</li>
        <li><strong>Avoid:</strong> Decorative fonts (Papyrus, Comic Sans, anything from design libraries). Anything below 10pt (too small for human reading and sometimes confuses parsers). Anything above 12pt for body (wastes page space you don't have).</li>
      </ul>
      <p><strong>Why these fonts specifically?</strong> They are "web-safe" — pre-installed on virtually every operating system. Any ATS, on any server, in any country, can render them correctly. A custom font that you downloaded might not exist on the server running the ATS, causing it to substitute an unexpected font or scramble text.</p>

      <h3>Margins</h3>
      <ul>
        <li><strong>Standard:</strong> 0.75 to 1 inch on all sides.</li>
        <li><strong>Minimum:</strong> 0.5 inch. Below this, the resume looks crowded and some parsers misread text near the edge.</li>
      </ul>
      <p><strong>Why margins matter:</strong> ATS parsers use coordinate systems to determine where text is on the page. Text that goes too close to the edge can be interpreted as a header or footer (which many ATS systems skip entirely).</p>

      <h3>Line Spacing</h3>
      <ul>
        <li><strong>Use:</strong> Single spacing (1.0) or 1.15 within sections. Add a small space (6–8pt) between section blocks.</li>
        <li><strong>Avoid:</strong> Double spacing (wastes precious page real estate). No spacing between bullets (makes the resume hard to scan).</li>
      </ul>

      <h3>Bullet Points</h3>
      <ul>
        <li><strong>Use:</strong> Simple round bullets (•) or simple dashes (–).</li>
        <li><strong>Avoid:</strong> Custom symbols, checkmarks, stars, arrows, icons downloaded from design libraries. ATS systems expect standard Unicode bullet characters. Custom symbols from design tools may render as question marks or boxes.</li>
      </ul>
      <p><strong>Length per bullet:</strong> 1–2 lines maximum. If a bullet runs to 3 lines, break it into two bullets or tighten the language.</p>

      <h3>File Format: PDF or DOCX?</h3>
      <p>This is a question almost every fresher asks. Here's the honest answer:</p>
      <p><strong>For most Indian job applications: save as text-based PDF.</strong></p>
      <p>Modern ATS systems used in India — including Naukri RChilli, Taleo, Workday, and iCIMS — parse text-based PDFs reliably. PDF preserves your formatting exactly as intended, regardless of which device the recruiter opens it on.</p>
      <p>The critical distinction is <strong>text-based PDF vs. image-based PDF:</strong></p>
      <ul>
        <li><strong>Text-based PDF</strong> — exported from Microsoft Word, Google Docs, or a resume builder. ATS can extract every word. ✅</li>
        <li><strong>Image-based PDF</strong> — exported from Canva as a flat image, or created by scanning a printed document. ATS sees a picture, not text. The parser extracts nothing. ❌</li>
      </ul>
      <p><strong>When to use DOCX:</strong> If a job portal explicitly says "upload Word document only," or if you are applying to a government portal that requires editable .doc/.docx format. Use DOCX for those cases.</p>
      <p><strong>How to check if your PDF is text-based:</strong> Open the PDF on your computer. Try to click on text and drag to highlight it. If you can highlight and copy the words — it's text-based and ATS-readable. If clicking selects the entire page as one image — it's image-based and will fail ATS.</p>

      <h3>File Name</h3>
      <p>This is small, but matters.</p>
      <ul>
        <li><strong>Right:</strong> <code>Priya_Sharma_Resume.pdf</code></li>
        <li><strong>Wrong:</strong> <code>resume.pdf</code>, <code>My Resume Final v3.pdf</code>, <code>PriyaResumeCanvaExport.pdf</code></li>
      </ul>
      <p>The file name is often the first thing a recruiter sees before opening the document. A clean, professional file name signals that you are detail-oriented. It also makes it easier for recruiters to find your file when they have 200 downloaded resumes in a folder.</p>

      <h3>Length: One Page. No Exceptions.</h3>
      <p>Indian campus recruiters process hundreds of resumes per day during placement season. They expect one page. Some explicitly reject multi-page fresher resumes without reading them.</p>
      <p><strong>If you are struggling to fit into one page:</strong></p>
      <ul>
        <li>Reduce font size to 10pt (minimum)</li>
        <li>Reduce margins to 0.6 inch</li>
        <li>Remove the Declaration section if applying to private companies</li>
        <li>Remove Class 10 details if your degree-level credentials are strong</li>
        <li>Cut hobbies section entirely</li>
        <li>Tighten bullet points — every bullet should be 1.5 lines, not 3</li>
      </ul>
      <p><strong>If you still can't fit:</strong> Remove your lowest-impact project and keep your two strongest. Quality beats quantity every time.</p>

      <hr />

      <h2 id="notepad-test">14. The Notepad Test — Your Final Quality Check</h2>
      <p>Before you submit any resume anywhere, run this test:</p>
      <ol>
        <li>Select all text in your resume (Ctrl+A)</li>
        <li>Copy it (Ctrl+C)</li>
        <li>Open Notepad (Windows) or TextEdit in plain text mode (Mac)</li>
        <li>Paste it (Ctrl+V)</li>
        <li>Read what you see</li>
      </ol>
      
      <p><strong>A passing result looks like:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}>{`PRIYA SHARMA
+91-98765-43210 | priya.sharma@gmail.com | Hyderabad, Telangana

OBJECTIVE
B.Tech Computer Science graduate from VIT Vellore...

EDUCATION
B.Tech in Computer Science Engineering
XYZ College of Engineering | 2021-2025 | CGPA: 8.2/10`}</pre>

      <p>Clean. Structured. Readable. Section by section, top to bottom.</p>
      
      <p><strong>A failing result looks like:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', fontFamily: 'var(--font-mono)', border: '1px solid var(--error-container)', color: 'var(--on-error-container)' }}>{`PRIYASHARMA +91-98765 Java Python C++ priya.sharma@gmail.com B.Tech
Hyderabad Education Computer Science XYZ College 
CSS HTML Java JavaScript CGPA 8.2`}</pre>

      <p>Scrambled. Sections merged. Keywords appearing out of context. This is what an ATS parser sees when it encounters a two-column Canva template. This is why the resume scores 32 and the recruiter never opens it.</p>
      <p>If your paste test produces scrambled text — your resume needs to be rebuilt with a single-column structure.</p>

      <hr />

      <h2 id="complete-template">15. The Complete Template</h2>
      <p>Here is a clean, full-page ATS template for Indian freshers. Everything below fits on one page at 11pt Calibri with 0.75 inch margins.</p>
      
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}>{`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRIYA SHARMA
+91-98765-43210 | priya.sharma@gmail.com | Hyderabad, Telangana
linkedin.com/in/priyasharma | github.com/priyasharma
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OBJECTIVE
B.Tech Computer Science graduate from XYZ College, Hyderabad, with 
strong foundation in Java, Python, and full-stack web development. 
Seeking a Software Developer role to build scalable systems and 
contribute to product innovation in a technology-driven organization.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EDUCATION

B.Tech in Computer Science Engineering
XYZ College of Engineering, Hyderabad | 2021 – 2025 | CGPA: 8.2 / 10.0

Class XII — CBSE | ABC School, Hyderabad | 2021 | 88%
Class X  — CBSE | ABC School, Hyderabad | 2019 | 91%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TECHNICAL SKILLS

Languages:     Java, Python, C, C++, SQL
Web:           HTML, CSS, JavaScript, React.js, Node.js, Express.js
Databases:     MySQL, MongoDB, PostgreSQL
Tools:         Git, GitHub, VS Code, IntelliJ IDEA, Postman, Linux
Cloud:         AWS (EC2, S3 — fundamentals), Firebase

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROJECTS

E-Commerce Platform | React.js, Node.js, MongoDB, Express.js, AWS
• Built a full-stack web application with user auth, product catalog,
  cart, and Razorpay payment integration serving 50+ test users
• Designed RESTful APIs for product management, orders, and user 
  sessions with JWT-based authentication
• Deployed on AWS EC2 with MongoDB Atlas; reduced load time by 35% 
  through lazy loading and database query optimization
• github.com/priyasharma/ecommerce-app

Student Attendance Management System | Java, Spring Boot, MySQL
• Developed a web-based attendance tracker for a department of 
  200+ students with automated email alerts for low attendance
• Implemented role-based access control for students, faculty, 
  and admin with Spring Security
• Reduced manual attendance marking effort by 80% for faculty

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CERTIFICATIONS

Google Data Analytics Certificate — Google / Coursera (2024)
AWS Cloud Practitioner Essentials — Amazon Web Services (2024)
Python for Data Science — NPTEL (Score: 72%) (2023)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXTRACURRICULAR ACTIVITIES

Technical Club Lead | IEEE Student Chapter, XYZ College (2023–2024)
• Organized 4 workshops on IoT and Web Development; 
  160+ total attendance across events

Participant | Smart India Hackathon 2024
• Built an AI-based water quality monitoring prototype; 
  reached state-level finals with a team of 6

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DECLARATION
I hereby declare that all information provided above is true 
and correct to the best of my knowledge.

Place: Hyderabad     Date: [Date]     Signature: ________________
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`}</pre>

      <p>This is your baseline. Every word you write goes into this structure. Every JD you apply to — you update the Objective and verify that the skills in that JD appear in your skills and project sections.</p>

      <hr />

      <h2 id="checklist">16. The 2-Minute Pre-Submission Checklist</h2>
      <p>Print this. Use it before every application.</p>
      
      <h3>FORMAT</h3>
      <ul>
        <li>☐ Single column — no sidebars, no two-column layout</li>
        <li>☐ Standard font (Calibri / Arial / Georgia) at 10–12pt</li>
        <li>☐ Margins are 0.75 inch or wider</li>
        <li>☐ Saved as text-based PDF (or DOCX if portal requires it)</li>
        <li>☐ File named: Firstname_Lastname_Resume.pdf</li>
        <li>☐ Notepad paste test passes — text is clean and structured</li>
      </ul>

      <h3>CONTENT</h3>
      <ul>
        <li>☐ No photo, no DOB, no marital status, no religion</li>
        <li>☐ CGPA is visible in Education section</li>
        <li>☐ Objective mentions target role and at least 2 skills from JD</li>
        <li>☐ Skills section uses exact words from the JD</li>
        <li>☐ Each project has: Tech Stack + What it does + Result</li>
        <li>☐ Section headings are standard: Education, Skills, Projects, Certifications</li>
        <li>☐ Total length: exactly 1 page</li>
      </ul>

      <h3>KEYWORD CHECK</h3>
      <ul>
        <li>☐ I read the full JD before building this version</li>
        <li>☐ Every major skill in the JD appears somewhere on my resume</li>
        <li>☐ I have not used abbreviations where the JD used full forms</li>
        <li>☐ I have not keyword-stuffed — all skills appear in natural context</li>
      </ul>
      
      <p>If every box is checked — submit with confidence.</p>

      <hr />

      <h2>What Comes Next</h2>
      <p>You have the format. You have the template. You have the checklist.</p>
      <p>
        The next question most freshers ask is: <em>"How do I know if my resume is actually scoring well against a specific JD?"</em>
      </p>
      <p>
        That's the topic of the next blog in this series — <strong>How to Check Your ATS Score Before Applying.</strong> We'll walk through what an ATS score means, how to interpret it, what a passing score looks like for TCS vs. startups, and the specific fixes that move a 50 to an 85.
      </p>

      <hr />

      <h2>Build This Resume Right Now — Without Starting From Scratch</h2>
      <p>You've just read the most complete guide to Indian fresher resume format on the internet.</p>
      <p>
        Now here's the reality: even with all this knowledge, building this resume from scratch in Word — getting the margins right, making sure the PDF exports cleanly, checking the Notepad test — takes hours.
      </p>
      <p><strong>CareerForge.pro does all of this for you in minutes.</strong></p>
      <p>
        Every template on CareerForge is single-column, ATS-compliant, and designed specifically for the Indian job market. The structure you just read — Header → Objective → Education → Skills → Projects → Certifications → Extracurriculars — is pre-built and ready for your information.
      </p>
      <p>
        After building, run your resume against any job description using the <strong>CareerForge ATS Score tool.</strong> You'll see your exact score, which keywords you're missing, and how to fix them before you apply — not after you've heard nothing back for three weeks.
      </p>

      <hr />

      <h2>Also in This Series</h2>

      <p>
        → <strong><a href="/blog/why-indian-fresher-resumes-are-invisible-to-ats-2026">Blog 1: What is ATS — And Why Your Resume Gets Rejected Before Any Human Reads It</a></strong><br />
        <em>The foundational explainer. Understand the system before you optimize for it.</em>
      </p>

      <p>
        → <strong><a href="/blog/how-to-check-your-ats-score-before-applying-india-2026">Blog 3: How to Check Your ATS Score Before Applying</a></strong><br />
        <em>Your score, explained. What 85 means vs 52. How to go from failing to shortlisted.</em>
      </p>

      <p>
        → <strong><a href="/blog/10-resume-formatting-mistakes-indian-freshers-2026">Blog 4: 10 Resume Formatting Mistakes Indian Freshers Make</a></strong><br />
        <em>The specific errors that kill ATS scores — with before/after examples for each one.</em>
      </p>

      <p>
        → <strong><a href="/blog/ats-keywords-for-indian-freshers-2026">Blog 5: ATS Keywords for Indian Freshers — How to Find Them and Where to Place Them</a></strong><br />
        <em>The step-by-step keyword extraction process. No guessing.</em>
      </p>

    </BlogPostLayout>
  )
}
