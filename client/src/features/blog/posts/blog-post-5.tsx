import { BlogPostLayout } from '../BlogPostLayout'
import blogCover from '@/assets/blog-post-1-cover.png'

const TOC = [
  { id: 'problem-winging', text: '1. The Problem With Winging It' },
  { id: 'what-they-are', text: '2. What ATS Keywords Actually Are' },
  { id: 'one-source', text: '3. The One Source That Matters Most: The Job Description Itself' },
  { id: 'step-by-step', text: '4. Step-by-Step: How to Extract Keywords From Any JD' },
  { id: 'placement', text: '5. Where to Place Keywords: The Four High-Value Locations' },
  { id: 'abbreviation-rule', text: '6. The Abbreviation Rule: Cover Both Forms' },
  { id: 'keyword-stuffing', text: '7. What Keyword Stuffing Is — And Why It Backfires' },
  { id: 'missed-keywords', text: '8. The Two Keywords Almost Every Indian Fresher Misses' },
  { id: 'workflow', text: '9. The 10-Minute Keyword Update Workflow' },
  { id: 'worked-example', text: '10. A Worked Example: Before and After' },
  { id: 'what-next', text: '11. What Comes Next in This Series' }
]

export default function BlogPost5() {
  return (
    <BlogPostLayout
      slug="ats-keywords-for-indian-freshers-2026"
      heroImagePath={blogCover}
      tocEntries={TOC}
    >
      <blockquote>
        <p><em>You have the right format. Your resume parses cleanly.</em></p>
        <p><em>But the ATS is still ranking you low.</em></p>
        <p><em>The missing piece is almost always the same thing: keywords.</em></p>
      </blockquote>

      <hr />

      <h2 id="problem-winging">1. The Problem With Winging It</h2>
      <p>Here is something that happens to a lot of freshers.</p>
      <p>They apply to a Software Developer role at a mid-size IT company. The job description mentions Java, Spring Boot, MySQL, REST APIs, Agile, and Git. Their resume has Java and MySQL in the Skills section. It does not have Spring Boot, REST APIs, Agile, or Git — even though they have used all four in their final year project.</p>
      <p>They do not get shortlisted.</p>
      <p>Not because they aren't qualified. Because their resume does not speak the same language as the job description. The ATS scanned for "Spring Boot" and found nothing. It scanned for "REST APIs" and found nothing. It scanned for "Agile" and found nothing.</p>
      <p>The candidate was qualified. The resume was not aligned.</p>
      <p>This is the keyword problem. And unlike fixing your layout, fixing your keywords requires a specific, repeatable process — not a one-time change. This blog walks you through that process completely, with examples.</p>

      <hr />

      <h2 id="what-they-are">2. What ATS Keywords Actually Are</h2>
      <p>Keywords, in the context of ATS systems, are the specific words and phrases a recruiter uses to configure what they are looking for in a candidate.</p>
      <p>When a recruiter posts a job on Taleo, Workday, Naukri RMS, or any other ATS, they either manually enter keywords they want to screen for, or the system auto-extracts them from the job description. When your resume arrives, the ATS compares what's in your document against that keyword list and generates a match score.</p>
      <p>Keywords fall into a few categories:</p>
      <p><strong>Hard skills and technologies</strong> — The most important category for freshers. These are specific, verifiable, named things. Java. Python. SQL. AutoCAD. Tally ERP. Power BI. React.js. Spring Boot. These are what ATS systems most reliably scan for.</p>
      <p><strong>Role and qualification terms</strong> — Words that identify who you are as a candidate. "B.Tech Computer Science," "Software Developer," "Data Analyst," "Management Trainee," "Full Stack Developer." Including the exact job title from the JD in your objective or header matters more than most freshers realise.</p>
      <p><strong>Methodology and process terms</strong> — Agile, Scrum, SDLC, Waterfall, REST, OOP, MVC. These appear frequently in JDs and are searched by recruiters selecting for certain project environments.</p>
      <p><strong>Certification and credential terms</strong> — "AWS Cloud Practitioner," "Google Analytics," "NPTEL," "Cisco CCNA." If the JD lists a certification as required or preferred and you hold it, that term needs to be on your resume.</p>
      <p><strong>Soft skill terms</strong> — Communication, teamwork, problem-solving. These are less reliably searched in ATS keyword filters — recruiters often consider them during human review rather than as keyword criteria. Focus on hard skills and technical terms first.</p>

      <hr />

      <h2 id="one-source">3. The One Source That Matters Most: The Job Description Itself</h2>
      <p>There is no universal keyword list that works for every job. The keywords that matter for a TCS Systems Engineer role are different from those for an Infosys DSE role, which are different again from a data analyst role at a startup.</p>
      <p>The correct source for your keywords is always the <strong>specific job description you are applying to</strong> — not a generic list from the internet, not advice from a friend, not a template someone shared on LinkedIn.</p>
      <p>The reason is straightforward: the recruiter who wrote the JD either directly configured the ATS to search for terms from that JD, or the ATS extracted keywords from the JD automatically. Either way, the JD is your keyword dictionary for that specific application. Here is how to use it.</p>

      <hr />

      <h2 id="step-by-step">4. Step-by-Step: How to Extract Keywords From Any JD</h2>
      <p>This takes about 10 minutes the first time. It becomes faster with practice.</p>

      <h3>Step 1 — Copy the full JD into a blank document</h3>
      <p>Find the job posting on the company's career page, Naukri, LinkedIn, or wherever you saw it. Copy the entire text — job title, responsibilities, requirements, preferred qualifications, everything. Paste it into a blank Google Doc or Word file.</p>
      <p>Do not use a summarised version. Do not skim it. The full text matters because keywords sometimes appear in sections other than "Requirements" — in the job title itself, in the responsibilities description, in the preferred qualifications.</p>

      <h3>Step 2 — Do three passes through the JD</h3>
      <p>Each pass looks for something different.</p>
      <p><strong>First pass — Hard skills and tools</strong><br />Read once and highlight (or bold) every specific technology, tool, software, language, framework, platform, and certification you find. These are your primary keywords.</p>
      <p><em>Example extract from a software developer JD:</em></p>
      <blockquote><p>"Experience with Java or Python. Working knowledge of Spring Boot and REST API development. Familiarity with MySQL or PostgreSQL. Version control using Git. Exposure to Agile development methodology preferred."</p></blockquote>
      <p>Keywords from this section: Java, Python, Spring Boot, REST API, MySQL, PostgreSQL, Git, Agile</p>

      <p><strong>Second pass — Role and qualification terms</strong><br />Read again and note the job title, the degree requirements, and any specific seniority or background terms.</p>
      <p><em>Example:</em></p>
      <blockquote><p>"We are looking for a Software Developer (Fresher) with a B.Tech or B.E. in Computer Science, IT, or a related discipline."</p></blockquote>
      <p>Keywords from this section: Software Developer, B.Tech, B.E., Computer Science, Information Technology</p>

      <p><strong>Third pass — What repeats</strong><br />Go through once more and mark anything that appeared more than once across the JD. If "REST API" appeared in the summary, the responsibilities, and the requirements — that term is high priority. Frequency is a reliable signal of importance.</p>

      <h3>Step 3 — Map keywords against your resume</h3>
      <p>Take your keyword list and check each item:</p>
      <ul>
        <li>Is it currently in your resume?</li>
        <li>If yes — is it in the right section (Skills, Objective, or project description)?</li>
        <li>If no — do you genuinely have this skill or experience?</li>
      </ul>
      <p>For every "no but I have it" — add it. These are the easiest wins. They are skills and tools you've used, but simply didn't name on your resume because you didn't think to include them.</p>
      <p>For every "no and I don't have it" — skip it. Adding a keyword for a skill you don't have is misrepresentation. Even if it gets you through the ATS, you'll be asked about it in the interview. Don't fabricate.</p>

      <h3>Step 4 — Add the missing keywords in context</h3>
      <p>This is the most important part. Do not just append keywords to your skills section in a list. Place them where they appear natural and where they carry meaning.</p>
      <p>If the JD asks for REST APIs and you built a project that used REST APIs but your description says "developed the backend" — rewrite it to say "developed RESTful APIs using Spring Boot for product management and order processing."</p>
      <p>The keyword is now there. It's in context. The ATS matches it. The recruiter reads a clear, professional bullet point. Both needs are met.</p>

      <hr />

      <h2 id="placement">5. Where to Place Keywords: The Four High-Value Locations</h2>
      <p>ATS systems don't weight every section of your resume equally. Placement matters. Here are the sections where keywords carry the most weight, in order of impact.</p>

      <h3>Location 1 — The Objective / Summary (Top Priority)</h3>
      <p>The Objective is one of the first sections parsed. It sets the context for everything that follows. A keyword that appears in your Objective signals relevance immediately.</p>
      <p><strong>Without keyword placement:</strong><br />"Seeking a software engineering position to learn and contribute to technology projects."</p>
      <p><strong>With keyword placement:</strong><br />"B.Tech Computer Science graduate with hands-on experience in Java, Spring Boot, and MySQL. Seeking a Software Developer role to build scalable REST API-based applications in an Agile development environment."</p>
      <p>Same candidate. The second version contains: Java, Spring Boot, MySQL, Software Developer, REST API, Agile. Six keywords placed naturally in two sentences.</p>

      <h3>Location 2 — The Technical Skills Section (Easiest to Update)</h3>
      <p>The Skills section is the most concentrated keyword location on your resume. It's structured, clearly labelled, and ATS systems know exactly what to do with it. A well-built skills section is the fastest way to add missing keyword matches.</p>
      <p><strong>Less effective:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', fontFamily: 'var(--font-mono)' }}>{`SKILLS
• Java
• Python
• SQL
• Git
• Problem-solving
• Communication`}</pre>

      <p><strong>More effective:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', fontFamily: 'var(--font-mono)' }}>{`TECHNICAL SKILLS

Programming Languages:   Java, Python, C, C++, SQL
Frameworks & Libraries:  Spring Boot, React.js, Node.js
Databases:               MySQL, PostgreSQL, MongoDB
Tools:                   Git, GitHub, IntelliJ IDEA, VS Code, Postman
Methodologies:           Agile, SDLC, REST API development
Cloud (Basics):          AWS (EC2, S3), Firebase`}</pre>
      <p>The second version contains every keyword category that a tech JD typically looks for. It also makes it easy for the ATS to categorise your skills correctly, and easy for the recruiter to scan in seconds.</p>
      <p><strong>One important rule:</strong> List only skills you can actually discuss in an interview. A recruiter who calls you for an interview has your resume in front of them. If you listed "Docker" because it appeared in the JD but you've never touched it — that becomes a problem the moment someone asks about it.</p>

      <h3>Location 3 — Project Descriptions (Highest Contextual Value)</h3>
      <p>This is where keywords become most meaningful — because they appear inside descriptions of actual work you've done. A keyword in context carries more weight than the same keyword in a list.</p>
      <p>Compare:</p>
      <p><strong>Version A:</strong><br />• Built a web application for college project</p>
      <p><strong>Version B:</strong><br />• Developed a full-stack web application using React.js and Node.js with MySQL database integration, implementing RESTful APIs for user authentication, product management, and order processing</p>
      <p>Version B contains: React.js, Node.js, MySQL, REST APIs, user authentication — five keywords embedded inside a clear description of a real project. The ATS matches all five. The recruiter reads a competent engineer's description of their work.</p>
      <p>For every project on your resume, go back to the JD and ask: "Which technologies in this JD did I actually use in this project?" Make sure every one of them appears in your project description by name.</p>

      <h3>Location 4 — The Education Section (Often Missed)</h3>
      <p>Most freshers underuse their Education section for keywords. Two quick additions that help:</p>
      <p><strong>Relevant coursework</strong> — If the JD asks for "Data Structures" and you have a course called "Data Structures and Algorithms" in your degree, mention it.</p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', fontFamily: 'var(--font-mono)' }}>{`EDUCATION

B.Tech in Computer Science Engineering
XYZ College | 2021-2025 | CGPA: 8.2/10
Relevant Coursework: Data Structures, DBMS, Operating Systems, 
                     Computer Networks, Object-Oriented Programming`}</pre>
      <p>Each course name is a potential keyword match. "DBMS" and "Object-Oriented Programming" appear in many IT JDs.</p>
      <p><strong>Certifications in Education</strong> — If you have a specific course certification like "NPTEL Python" or "Coursera Data Structures," including it here (or in a separate Certifications section) adds keyword matches for the certification names.</p>

      <hr />

      <h2 id="abbreviation-rule">6. The Abbreviation Rule: Cover Both Forms</h2>
      <p>Many ATS systems do exact-match or near-exact-match keyword searches. This means "OOP" and "Object-Oriented Programming" are sometimes treated as two different terms.</p>
      <p>To be safe — include both the abbreviation and the full form, at least once each.</p>
      <p>You don't have to write them side by side everywhere. Use one form in your Skills section and the other naturally in a project description.</p>
      <p><strong>Examples:</strong></p>
      <ul>
        <li>Skills section: "OOP, DBMS, REST API, SQL"</li>
        <li>Project description: "Designed using Object-Oriented Programming principles, integrated with a Relational Database Management System via MySQL"</li>
        <li>Skills section: "AWS (Amazon Web Services)"</li>
        <li>Objective: "...seeking to apply cloud infrastructure knowledge including Amazon Web Services..."</li>
      </ul>
      <p>This gives the ATS the best chance of matching regardless of which form the JD and the ATS are configured to search for.</p>

      <hr />

      <h2 id="keyword-stuffing">7. What Keyword Stuffing Is — And Why It Backfires</h2>
      <p>Now that you understand how to add keywords, it's equally important to understand what not to do.</p>
      <p><strong>Keyword stuffing</strong> is when keywords are added to a resume in ways that are either dishonest, unnatural, or excessive. It's the difference between optimisation and manipulation.</p>
      <p>The most obvious form is <strong>hidden white text</strong> — pasting a large block of keywords in white font at the bottom of the resume, invisible to the human eye but theoretically readable by the ATS.</p>
      <p>This does not work reliably in 2026. Modern ATS platforms like Greenhouse, iCIMS, and Workday parse resumes into plain text during processing. When that happens, hidden white text becomes visible text in the parsed output. Recruiters see it. Some ATS systems flag it as suspicious content. The result is immediate rejection — not just of this application, but potentially from future applications to the same company.</p>
      <p>Beyond technical detection: ATS systems increasingly evaluate keywords in context. A term that appears 15 times in an unnatural pattern scores differently than the same term appearing twice inside coherent bullet points. Simply repeating keywords does not proportionally increase your score.</p>
      <p><strong>The practical rule:</strong> A keyword that appears once in your Skills section, once in a project description, and once in your Objective is well-placed. A keyword that appears eight times across a single resume, or that appears in sections where it has no business appearing, is stuffed — and it damages both your ATS score and your credibility with the human who reads it.</p>
      <p>Optimise honestly. Add keywords you genuinely have. Place them where they make sense. That's the full extent of what's needed.</p>

      <hr />

      <h2 id="missed-keywords">8. The Two Keywords Almost Every Indian Fresher Misses</h2>
      <p>Beyond the technical skills from the JD, two types of keywords consistently go missing from Indian fresher resumes.</p>

      <h3>The exact job title</h3>
      <p>If the JD is for "Software Developer (Fresher)" — that phrase, or something very close to it, should appear in your Objective. ATS systems often weight the job title as one of the highest-priority search terms. A recruiter searching for "Software Developer" in the ATS should find that phrase on your resume.</p>
      <p>It sounds obvious. But most resumes say "seeking a position in the software industry" rather than "seeking a Software Developer role" — and that distinction costs keyword matches.</p>

      <h3>The degree name as written in the JD</h3>
      <p>Many JDs specify: "B.Tech or B.E. in Computer Science, Information Technology, or Electronics." The ATS may be configured to filter for candidates who list "B.Tech" or "B.E." with a relevant branch.</p>
      <p>Your Education section should clearly state your degree as "B.Tech in Computer Science Engineering" — not just "Bachelor's" or "Engineering." The full, formal form of your degree matches the full, formal form the JD uses when it specifies educational requirements.</p>

      <hr />

      <h2 id="workflow">9. The 10-Minute Keyword Update Workflow</h2>
      <p>Here is the complete, repeatable process — condensed into a checklist you can follow for every application.</p>

      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', fontFamily: 'var(--font-mono)' }}>{`BEFORE APPLYING — 10 MINUTES

□ Copy the full JD text into a blank document

□ First pass: Highlight all hard skills, tools, 
  frameworks, languages, and certifications

□ Second pass: Note the exact job title and 
  degree requirements

□ Third pass: Mark terms that appear more than once

□ Check each highlighted term against your resume:
  → Present in Skills section? ✓
  → Present in Objective? (at least the job title) ✓
  → Present in relevant project descriptions? ✓

□ Add any genuinely-held skills that are missing:
  → To the Skills section (most missing keywords land here)
  → Into project bullet points (for tech you actually used)
  → Into the Objective (job title + 1-2 top skills)

□ Check abbreviations — have you covered both 
  the short form and the full form for key terms?

□ Read the updated Objective — does it sound 
  natural? Or like a keyword list?

□ Read the updated project bullets — do they 
  describe real work coherently?

□ Save as a new file: YourName_CompanyName_Role.pdf
  (Don't overwrite your base resume)

□ Run through CareerForge ATS Score with this JD 
  to verify keyword gaps are closed`}</pre>

      <hr />

      <h2 id="worked-example">10. A Worked Example: Before and After</h2>
      <p>Let's take a real scenario. A fresher is applying for this role:</p>
      
      <p><strong>JD extract:</strong><br />"Junior Software Developer. Requirements: Proficiency in Java or Python. Experience with Spring Boot or Django frameworks. Knowledge of MySQL or PostgreSQL. Version control with Git. Understanding of REST API concepts. Exposure to Agile methodology a plus. B.Tech/B.E. in CS, IT, or related stream."</p>

      <p><strong>Their resume before keyword alignment:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', fontFamily: 'var(--font-mono)', border: '1px solid var(--error-container)', color: 'var(--on-error-container)' }}>{`OBJECTIVE
Seeking a software development position to apply my technical 
skills and grow professionally.

TECHNICAL SKILLS
Languages:  Java, Python, C
Tools:      VS Code, IntelliJ
Databases:  MySQL

PROJECTS
Student Portal
• Created a student information management system
• Used Java for backend development
• Connected to a database for storing records`}</pre>

      <p><strong>ATS keyword matches found:</strong> Java, Python, MySQL — 3 out of the JD's approximately 9 primary keywords.</p>

      <p><strong>Their resume after keyword alignment:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}>{`OBJECTIVE
B.Tech Computer Science graduate with hands-on experience in Java, 
Spring Boot, and MySQL. Seeking a Junior Software Developer role to 
build REST API-based applications and contribute to Agile development 
teams.

TECHNICAL SKILLS
Languages:      Java, Python, C
Frameworks:     Spring Boot, Django (basics)
Databases:      MySQL, PostgreSQL (basics)
Tools:          Git, GitHub, IntelliJ IDEA, VS Code, Postman
Methodologies:  REST API development, Agile, SDLC

PROJECTS
Student Portal | Java, Spring Boot, MySQL, REST API
• Built a student information management system handling 
  500+ records for a department of 8 faculty users
• Developed RESTful APIs using Spring Boot for student 
  registration, attendance tracking, and grade management
• Implemented MySQL database with normalised schema; 
  used Git for version control across a 3-member team`}</pre>

      <p><strong>ATS keyword matches found:</strong> Java, Python, Spring Boot, MySQL, PostgreSQL, REST API, Git, Agile, SDLC, Junior Software Developer, B.Tech, Computer Science — 12 out of 9 primary JD keywords covered, plus secondary matches.</p>
      <p>Same candidate. Same project. Same actual skills. Different language. Dramatically different ATS match score.</p>

      <hr />

      <h2 id="what-next">11. What Comes Next in This Series</h2>
      <p>This blog completes the core ATS foundation of the series. You now have:</p>
      <ul>
        <li>Blog 1 → Understanding what ATS is and why it matters</li>
        <li>Blog 2 → The correct format and structure for an Indian fresher resume</li>
        <li>Blog 3 → How to check and interpret your ATS score</li>
        <li>Blog 4 → The specific formatting mistakes that cause ATS failure</li>
        <li>Blog 5 → How to find and place keywords (this blog)</li>
      </ul>
      <p>The next set of blogs moves into company-specific guidance, cover letters, and LinkedIn — applying what you know about ATS to specific situations.</p>

      <p>
        → <strong><a href="/blog/why-indian-fresher-resumes-are-invisible-to-ats-2026">Blog 1: What is ATS — And Why Your Resume Gets Rejected Before Any Human Reads It</a></strong>
      </p>

      <p>
        → <strong><a href="/blog/ats-friendly-resume-format-indian-freshers-2026">Blog 2: The Complete ATS-Friendly Resume Format for Indian Freshers</a></strong>
      </p>

      <p>
        → <strong><a href="/blog/how-to-check-your-ats-score-before-applying-india-2026">Blog 3: How to Check Your ATS Score Before Applying</a></strong>
      </p>

      <p>
        → <strong><a href="/blog/10-resume-formatting-mistakes-indian-freshers-2026">Blog 4: 10 Resume Formatting Mistakes Indian Freshers Make</a></strong>
      </p>

      <p>
        → <strong><a href="#">Blog 6: How to Write a Resume Objective for Freshers in India — With 20 Ready Examples</a></strong> <em>(Coming next)</em>
      </p>

    </BlogPostLayout>
  )
}
