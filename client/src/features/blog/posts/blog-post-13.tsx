import { BlogPostLayout } from '../BlogPostLayout'
import blogCover from '@/assets/blog-post-1-cover.png'

const TOC = [
  {
    "id": "why-cse-freshers-need-a-different-approach",
    "text": "Why CSE Freshers Need a Different Approach"
  },
  {
    "id": "the-three-types-of-cse-jobs-and-why-your-resume-differs-for-each",
    "text": "The Three Types of CSE Jobs \u2014 And Why Your Resume Differs for Each"
  },
  {
    "id": "the-cse-fresher-skills-section-stream-specific",
    "text": "The CSE Fresher Skills Section: Stream-Specific"
  },
  {
    "id": "the-cse-fresher-projects-section-what-makes-one-stand-out",
    "text": "The CSE Fresher Projects Section: What Makes One Stand Out"
  },
  {
    "id": "adding-competitive-programming-to-your-cse-resume",
    "text": "Adding Competitive Programming to Your CSE Resume"
  },
  {
    "id": "the-github-profile-what-cse-recruiters-actually-look-for",
    "text": "The GitHub Profile: What CSE Recruiters Actually Look For"
  },
  {
    "id": "the-complete-cse-fresher-resume-a-full-template",
    "text": "The Complete CSE Fresher Resume: A Full Template"
  },
  {
    "id": "the-one-page-rule-for-cse-freshers-is-it-negotiable",
    "text": "The One-Page Rule for CSE Freshers \u2014 Is It Negotiable?"
  },
  {
    "id": "tailoring-your-cse-resume-for-specific-roles",
    "text": "Tailoring Your CSE Resume for Specific Roles"
  },
  {
    "id": "the-cse-resume-checklist",
    "text": "The CSE Resume Checklist"
  }
]

export default function BlogPost13() {
  return (
    <BlogPostLayout
      slug="resume-format-cse-it-freshers-india-2026"
      heroImagePath={blogCover}
      tocEntries={TOC}
    >
      <blockquote><p><em>More CSE graduates enter the Indian job market every year than any other engineering stream. That's not a problem. It's a signal that your resume needs to be significantly better than the average — because the average is what you're competing against. This blog tells you exactly how to build it.</em></p></blockquote>

      <hr />

<h2 id="why-cse-freshers-need-a-different-approach">Why CSE Freshers Need a Different Approach</h2>

<p>The resume advice in Blogs 1 through 12 of this series covers foundations that apply to every fresher. This blog applies those foundations specifically to Computer Science and IT graduates — the largest pool of job seekers in Indian tech hiring.</p>

<p>India produces a very large number of engineering graduates in CSE and related streams every year. The IT sector remains among the highest-volume employers of fresh graduates, but that volume of hiring is matched by an even larger volume of applicants. The result: ATS filters work harder for CSE than for most other streams, because the keyword density of the candidate pool is higher.</p>

<p>A CSE fresher whose resume passes ATS at a reasonable score still competes against hundreds of others who did the same. What separates the ones who get interview calls from the ones who don't is what the human reviewer finds after the ATS — a resume that demonstrates genuine technical depth, not just a list of tools.</p>

<p>This blog covers both: how to pass the ATS, and how to impress the recruiter who opens it.</p>

<hr />

<h2 id="the-three-types-of-cse-jobs-and-why-your-resume-differs-for-each">The Three Types of CSE Jobs — And Why Your Resume Differs for Each</h2>

<p>Before writing a single word, understand what kind of company you are targeting. The resume that works for TCS will not work optimally for a product startup. The resume that lands a data analyst role is not the same document that lands a DevOps role.</p>

<hr />

<h3>Type 1 — Service-Based IT Companies (TCS, Infosys, Wipro, HCL, Cognizant, Capgemini)</h3>

<p>These are the mass recruiters. They hire large numbers of freshers annually, run standardised assessment drives (NQT, InfyTQ, Elite), and use ATS to manage very high application volumes.</p>

<p><strong>What they are looking for:</strong> Trainable freshers with solid fundamentals. Clean academic record (CGPA 6.0+ at graduation, 10th, and 12th). Good aptitude scores. Basic programming knowledge. The ability to learn quickly and follow structured processes.</p>

<p><strong>Resume strategy for service companies:</strong></p>
      <ul>
        <li>CGPA must be visible immediately — these companies have eligibility cutoffs</li>
        <li>Fundamental skills dominate: Java, Python, C, SQL, Data Structures, DBMS, OOP</li>
        <li>Projects are important but treated as training evidence, not product experience</li>
        <li>Keep it to one page, strictly — multiple reports from campus placement interactions confirm that two-page fresher resumes are deprioritised at high-volume service company drives</li>
        <li>Declaration section expected for campus drives</li>
      </ul>

<p><strong>Keywords these companies' ATS systems scan for:</strong></p>
<p>Java, Python, C, C++, SQL, MySQL, DBMS, Data Structures, Algorithms, OOP, SDLC, Agile, Git, HTML, CSS, JavaScript, REST API</p>

<hr />

<h3>Type 2 — Product Companies and Tech-First MNCs (Amazon, Microsoft, Google, Flipkart, Swiggy, Razorpay, Freshworks, Zoho)</h3>

<p>These companies hire far fewer freshers but pay significantly more. Their selection process is harder — typically involving multiple technical rounds focused on Data Structures and Algorithms (DSA), system design basics, and code quality.</p>

<p><strong>What they are looking for:</strong> Technical depth. Problem-solving ability. Strong project work — not just academic projects, but evidence of building something non-trivial. Competitive programming activity. GitHub presence. Domain-specific expertise (backend, ML, data, etc.)</p>

<p><strong>Resume strategy for product companies:</strong></p>
      <ul>
        <li>DSA and competitive programming ratings (LeetCode, Codeforces, HackerRank) belong on the resume — explicitly</li>
        <li>Projects must demonstrate technical ambition — not just CRUD applications</li>
        <li>Deployment, scale, and architecture decisions should be mentioned</li>
        <li>GitHub link is expected and will be reviewed</li>
        <li>Objective should name the specific role and demonstrate domain focus</li>
        <li>Declaration can be omitted — product companies do not expect it</li>
      </ul>

<p><strong>Keywords product companies' systems scan for:</strong></p>
<p>Data Structures, Algorithms, System Design, REST APIs, Microservices, Docker, Kubernetes, React.js, Node.js, Python, Django, Flask, PostgreSQL, MongoDB, Redis, AWS, CI/CD, Git, GitHub, LeetCode, Open Source</p>

<hr />

<h3>Type 3 — Startups and Early-Stage Companies</h3>

<p>Startups want versatile builders. They care about what you've shipped, not just what you've studied. A candidate who built a live project that real people use is far more compelling to a startup recruiter than one with a 9.2 CGPA and no visible work.</p>

<p><strong>What they are looking for:</strong> Initiative, breadth, speed of learning, ownership. Evidence that you've built things that work — ideally deployed and live.</p>

<p><strong>Resume strategy for startups:</strong></p>
      <ul>
        <li>Projects with GitHub and live demo links carry significant weight</li>
        <li>Language is more conversational, less formal — but still professional</li>
        <li>Declaration can be omitted</li>
        <li>Highlight any freelance work, open-source contributions, or personal products</li>
        <li>Communication ability matters — mention any writing, content, or community work if relevant</li>
      </ul>

<hr />

<h2 id="the-cse-fresher-skills-section-stream-specific">The CSE Fresher Skills Section: Stream-Specific</h2>

<p>This is the most keyword-dense section of your resume. For CSE freshers, it needs to be thorough — but only include what you can discuss in an interview.</p>

<hr />

<h3>For Software Developer / Backend Roles</h3>

<pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>TECHNICAL SKILLS

Programming Languages:    Java, Python, C, C++, SQL
Frameworks:               Spring Boot, Django, Flask, Express.js
Web Technologies:         HTML5, CSS3, JavaScript, React.js, Node.js
Databases:                MySQL, PostgreSQL, MongoDB, SQLite
Tools & Platforms:        Git, GitHub, VS Code, IntelliJ IDEA, 
                          Postman, Linux (Ubuntu), JIRA
Cloud (Basics):           AWS (EC2, S3, Lambda — fundamentals)
Concepts:                 REST API Development, OOP, SDLC,
                          Data Structures & Algorithms, Agile, MVC</code></pre>

<hr />

<h3>For Data Science / Data Analyst Roles</h3>

<pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>TECHNICAL SKILLS

Programming Languages:    Python, R, SQL
Libraries & Frameworks:   Pandas, NumPy, Scikit-learn, TensorFlow,
                          Keras, Matplotlib, Seaborn, NLTK, OpenCV
Databases:                MySQL, PostgreSQL, MongoDB
BI & Visualisation:       Tableau, Power BI, Google Looker Studio,
                          MS Excel (Advanced)
Tools:                    Jupyter Notebook, Google Colab, Git,
                          VS Code, Anaconda
Concepts:                 Machine Learning, Deep Learning, NLP,
                          EDA, Feature Engineering, Statistical Analysis,
                          Data Cleaning, Model Evaluation
Cloud (Basics):           AWS SageMaker (basics), Google Colab Pro</code></pre>

<hr />

<h3>For Full Stack / Web Development Roles</h3>

<pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>TECHNICAL SKILLS

Frontend:                 React.js, Next.js, HTML5, CSS3,
                          JavaScript (ES6+), TypeScript, Tailwind CSS
Backend:                  Node.js, Express.js, Django, Flask
Databases:                MySQL, MongoDB, PostgreSQL, Firebase
DevOps & Tools:           Git, GitHub, Docker (basics), AWS EC2,
                          Netlify, Vercel, Postman, VS Code
Concepts:                 REST APIs, GraphQL (basics), Responsive Design,
                          Authentication (JWT, OAuth), Web Security basics,
                          Agile, CI/CD basics</code></pre>

<hr />

<h3>For DevOps / Cloud Roles</h3>

<pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>TECHNICAL SKILLS

Cloud Platforms:          AWS (EC2, S3, Lambda, RDS, VPC),
                          Google Cloud (GCE, GCS — basics)
DevOps Tools:             Docker, Kubernetes (basics), Jenkins,
                          GitHub Actions, Terraform (basics)
Programming:              Python, Bash/Shell Scripting, YAML
Operating Systems:        Linux (Ubuntu, CentOS), Windows Server
Monitoring:               Prometheus, Grafana (basics)
Concepts:                 CI/CD Pipelines, Infrastructure as Code,
                          Containerisation, Microservices, Git</code></pre>

<hr />

<h2 id="the-cse-fresher-projects-section-what-makes-one-stand-out">The CSE Fresher Projects Section: What Makes One Stand Out</h2>

<p>We covered the projects section comprehensively in Blog 7. For CSE freshers specifically, here is what separates a standout project from an average one.</p>

<hr />

<h3>For Service Companies (Trainability Signal)</h3>

<p>Service company recruiters are not looking for a distributed system. They are looking for evidence that you understand the full cycle of building something — requirement, design, code, test, deploy — using standard, recognisable technologies.</p>

<p><strong>What works:</strong></p>
      <ul>
        <li>A functional CRUD application (student management, hospital management, inventory)</li>
        <li>With a recognisable tech stack (Java + Spring Boot + MySQL, or Python + Flask + MySQL)</li>
        <li>With at least 2–3 features described specifically</li>
        <li>With an outcome (simulated load, testing results, faculty review)</li>
      </ul>

<p><strong>Strong example for service company applications:</strong></p>
<pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>Online Exam Management System | Java, Spring Boot, MySQL, 
Thymeleaf, Bootstrap
• Built a web-based exam management platform for faculty to 
  create timed MCQ exams and for students to attempt them; 
  supports 200+ concurrent simulated users
• Implemented role-based access using Spring Security with 
  separate dashboards for admin, faculty, and student users
• Developed auto-grading logic with instant result generation 
  and PDF export; integrated email notifications using 
  JavaMail API
• Reduced manual exam setting time by estimated 70% vs 
  paper-based process; zero test failures in 50-session 
  load simulation</code></pre>

<hr />

<h3>For Product Companies (Technical Depth Signal)</h3>

<p>Product company interviewers will review your GitHub. They will ask about your architecture decisions. They will ask why you chose one database over another. Your project description needs to demonstrate that you thought about these things — not just that you built something that works.</p>

<p><strong>What works:</strong></p>
      <ul>
        <li>Non-trivial architecture: microservices, real-time features, ML inference, queue-based processing</li>
        <li>Deployment details: where it runs, how you deployed it, what scale it handles</li>
        <li>Technical challenges: what was hard, how you solved it</li>
        <li>Open source contribution or a project with real users outside your college</li>
      </ul>

<p><strong>Strong example for product company applications:</strong></p>
<pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>Real-Time Collaborative Code Editor | React.js, Node.js, 
WebSocket, Redis, MongoDB, Docker
• Built a browser-based collaborative code editor supporting 
  simultaneous editing by multiple users with real-time 
  synchronisation — similar to Google Docs for code
• Implemented Operational Transformation (OT) algorithm in 
  Node.js for conflict resolution; used Redis pub/sub for 
  broadcasting cursor positions and code changes across 
  WebSocket connections
• Containerised the application with Docker; deployed on 
  AWS EC2 with Nginx reverse proxy; sustained 20 concurrent 
  user sessions in stress testing with p95 latency under 80ms
• github.com/yourname/collab-editor | 47 GitHub stars</code></pre>

<hr />

<h3>For Startups (Ownership Signal)</h3>

<p>Startup recruiters want to see that you ship things. A project with a real deployment URL, real users (even 10 of them), and a described problem it solves says more than a technically impressive project that nobody uses.</p>

<p><strong>What works:</strong></p>
      <ul>
        <li>A live product with a URL</li>
        <li>A clear problem statement (who uses it, what for)</li>
        <li>Any real-world metrics (users, traffic, feedback)</li>
        <li>Evidence of iteration: "launched MVP in 2 weeks, added X after user feedback"</li>
      </ul>

<p><strong>Strong example for startup applications:</strong></p>
<pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>ResumeMatch.in — Job-Resume Matching Tool | React.js, 
Python, FastAPI, PostgreSQL, AWS S3
• Built and launched a web tool that helps freshers identify 
  keyword gaps between their resume and any job description; 
  attracted 200+ users in the first month with zero paid 
  marketing
• Developed keyword extraction using Python NLP (spaCy) 
  with a scoring algorithm comparing JD term frequency 
  against resume text; frontend in React.js
• Launched MVP in 11 days; iterated twice based on user 
  feedback (added PDF upload, added score history); 
  currently live at resumematch.in</code></pre>

<hr />

<h2 id="adding-competitive-programming-to-your-cse-resume">Adding Competitive Programming to Your CSE Resume</h2>

<p>For product company and DSE-track applications, your competitive programming activity belongs on your resume. Service company ATS systems may not weight this heavily, but product company recruiters and interviewers look for it specifically.</p>

<p><strong>Where to put it:</strong> Either in the Skills section as a separate "Competitive Programming" line, or in the Extracurriculars section if you have a rank or achievement.</p>

<p><strong>How to include it:</strong></p>

<pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>TECHNICAL SKILLS
...
Competitive Programming:  LeetCode — 400+ problems solved (Rating: 1,650)
                          Codeforces — Specialist (Rating: 1,420)
                          HackerRank — 5-star Python, 4-star Java</code></pre>

<p>Or in Extracurriculars:</p>

<pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>Competitive Programming
• LeetCode: 400+ problems solved, max rating 1,650 (Knight)
• Codeforces: Specialist (Rating: 1,420); solved 200+ problems 
  including Dynamic Programming, Graph algorithms, and Segment Trees
• HackerRank: 5-star badge in Python, 4-star in Java</code></pre>

<p>Include only honest ratings and problem counts. These are publicly verifiable — the interviewer can and sometimes will check.</p>

<p>If your competitive programming activity is limited, do not fabricate it. Focus your resume on your projects instead. A strong project beats a mediocre competitive programming profile.</p>

<hr />

<h2 id="the-github-profile-what-cse-recruiters-actually-look-for">The GitHub Profile: What CSE Recruiters Actually Look For</h2>

<p>A GitHub link on a CSE resume is expected — especially for product company and startup applications. But a GitHub link that leads to an empty or poorly maintained profile is worse than no link.</p>

<p>Here is what to check before including your GitHub URL:</p>

<p><strong>Profile basics:</strong> A profile photo, a bio (1–2 lines about your focus), and a location. Recruiters notice when a profile looks abandoned.</p>

<p><strong>Pinned repositories:</strong> Pin your 4–6 strongest projects. These are the first thing a technical reviewer sees. Each pinned repo should have: a clear name, a README with description, tech stack, how to run it, and at least one screenshot or demo link.</p>

<p><strong>Commit activity:</strong> A consistent green contribution graph signals regular coding activity. If your graph is sparse, start committing regularly — even small updates to existing projects, documentation improvements, or new personal projects. This takes time to build, so start now.</p>

<p><strong>README quality:</strong> A well-written README is a writing sample and a technical communication sample simultaneously. Use headers, code blocks, and a clear structure: What it does → Tech stack → How to set it up → Screenshots/demo.</p>

<p><strong>Code quality:</strong> Your code will be read in interviews for project-based companies. Clean variable names, consistent formatting, and comments on complex logic matter.</p>

<hr />

<h2 id="the-complete-cse-fresher-resume-a-full-template">The Complete CSE Fresher Resume: A Full Template</h2>

<p>Here is a complete one-page resume template for a CSE fresher targeting software developer and data roles. Adapt the content to your own profile.</p>

<pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROHAN VERMA
+91-94001-23456 | rohan.verma@gmail.com | Pune, Maharashtra
linkedin.com/in/rohanverma | github.com/rohanverma
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OBJECTIVE
B.Tech Computer Science graduate from ABC Institute of Technology 
with strong foundation in Java, Spring Boot, and MySQL. Built a 
full-stack exam management system handling 200+ concurrent simulated 
users. Seeking a Software Developer role to build backend systems 
and contribute to scalable product development.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EDUCATION

B.Tech in Computer Science Engineering
ABC Institute of Technology, Pune | 2022 – 2026 | CGPA: 8.1 / 10
Relevant Coursework: Data Structures, DBMS, Operating Systems,
                     Computer Networks, OOP, Software Engineering

Class XII — CBSE | DEF School, Pune | 2022 | 86%
Class X  — CBSE | DEF School, Pune | 2020 | 90%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TECHNICAL SKILLS

Languages:      Java, Python, C, SQL, JavaScript
Frameworks:     Spring Boot, React.js, Node.js, Flask
Databases:      MySQL, MongoDB, PostgreSQL
Tools:          Git, GitHub, IntelliJ IDEA, VS Code, Postman,
                Linux (Ubuntu), Docker (basics)
Cloud:          AWS (EC2, S3 — fundamentals)
Concepts:       REST API Development, OOP, SDLC, Agile,
                Data Structures & Algorithms, MVC

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROJECTS

Online Exam Management System | Java, Spring Boot, MySQL, 
Thymeleaf, Spring Security
• Built a full-stack exam platform with timed MCQ exams, 
  auto-grading, and role-based access for admin, faculty, 
  and student users; supports 200+ concurrent simulated sessions
• Implemented Spring Security for authentication, JavaMail 
  API for automated email alerts, and PDF report generation 
  using iText library
• Reduced manual exam setting time by estimated 70% vs 
  paper-based process; zero failures across 50-session 
  load simulation
• github.com/rohanverma/exam-management

E-Commerce Platform | React.js, Node.js, MongoDB, Express.js, AWS
• Developed a full-stack e-commerce application with product 
  cataloguing, cart management, user authentication, and 
  Razorpay payment gateway integration
• Deployed backend on AWS EC2 with MongoDB Atlas; implemented 
  JWT-based authentication and RESTful APIs using Express.js
• Handled 500+ concurrent test user sessions; page load 
  time optimised from 3.8s to 1.2s through lazy loading and 
  code splitting

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CERTIFICATIONS

AWS Certified Cloud Practitioner
Amazon Web Services | November 2025

HackerRank Java (Intermediate) Certificate
HackerRank | Verified | August 2025

Programming, Data Structures and Algorithms using Python
NPTEL — IIT Madras | Score: 74% | April 2025

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXTRACURRICULAR ACTIVITIES

Technical Club Coordinator | IEEE Student Chapter, ABC Institute
2024 – 2025
• Led 14-member team; organised 5 workshops (180+ attendees) 
  on React.js, Spring Boot, and Cloud fundamentals
• Coordinated intercollegiate hackathon with 12 colleges and 
  300+ registrations

Competitive Programming
• LeetCode: 250+ problems solved (Rating: 1,420)
• HackerRank: 5-star badge in Java, 4-star in Python

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DECLARATION
I hereby declare that all information provided above is 
true and correct to the best of my knowledge.

Place: Pune     Date: [Date]     Signature: ____________
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</code></pre>

<hr />

<h2 id="the-one-page-rule-for-cse-freshers-is-it-negotiable">The One-Page Rule for CSE Freshers — Is It Negotiable?</h2>

<p>For service company applications and campus drives: no. One page is the standard, and multiple reports from campus placement interactions at large IT companies confirm that two-page fresher resumes are deprioritised. Recruiters process high volumes; a concise resume is a signal of good judgment.</p>

<p>For product company and startup applications: slightly more flexible. If you have three substantial projects, active competitive programming, an open-source contribution, and relevant certifications — two pages is acceptable. But test whether you genuinely need that space. Most fresher profiles fit in one page if the writing is tight and the content is prioritised.</p>

<p><strong>The discipline test:</strong> If you can't fit your resume on one page, the first question to ask is not "should I add a page?" — it is "what am I including that doesn't earn its space?"</p>

<hr />

<h2 id="tailoring-your-cse-resume-for-specific-roles">Tailoring Your CSE Resume for Specific Roles</h2>

<p>A base CSE resume is the foundation. For each application, a 10-minute tailoring process makes it significantly more relevant.</p>

<p><strong>For a Java Backend Developer JD:</strong></p>
<p>Update objective to mention Java, Spring Boot, and the specific role title. Ensure Spring Boot, MySQL, REST API, Agile, and OOP are visible in the top third of the resume. Lead with the project most relevant to backend work.</p>

<p><strong>For a Python Data Analyst JD:</strong></p>
<p>Update objective to mention Python, SQL, and data analysis. Reorder skills to put Python, Pandas, SQL, and data tools first. Lead with the data project. Ensure Jupyter, Matplotlib, and Scikit-learn appear prominently.</p>

<p><strong>For a Full Stack Developer JD:</strong></p>
<p>Update objective to name the stack (React + Node, or Django + React). Ensure the full-stack project leads. Mention both frontend and backend skills explicitly in the first few skill lines.</p>

<p><strong>For a DevOps / Cloud Engineer JD:</strong></p>
<p>Update objective to mention cloud and DevOps. Surface Docker, AWS, Linux, and CI/CD in the skills section. Mention any deployment work in project bullets specifically.</p>

<p>The keyword strategy from Blog 5 applies to every one of these: read the JD, extract the terms, verify they appear in your resume in the right sections.</p>

<hr />

<h2 id="the-cse-resume-checklist">The CSE Resume Checklist</h2>

<pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>STRUCTURE
□ Single column, plain text, one page (for service 
  companies) or max two pages (for product companies 
  with substantial content)
□ Standard section headings
□ Notepad test passes cleanly

OBJECTIVE
□ Names specific role (matches JD job title)
□ Includes 2–3 skills from target JD
□ Includes one proof point (project outcome or certification)

EDUCATION
□ CGPA visible and above company minimum
□ 10th and 12th included (required for TCS, Infosys, Wipro)
□ Relevant coursework listed (4–6 courses matching JD)

SKILLS
□ Categorised and specific (not generic)
□ Hard technical skills only — no "team player" etc.
□ Matches target JD terminology precisely
□ Competitive programming included (for product companies)

PROJECTS
□ 2–3 projects with: Tech Stack + What + How + Outcome
□ Projects aligned to target role type (service vs product)
□ GitHub links included and repos are publicly readable
□ At least one metric per project

CERTIFICATIONS
□ From recognisable issuers
□ 2–4 entries maximum

EXTRACURRICULARS
□ Written with specifics and action verbs
□ No generic hobbies

GITHUB
□ Profile is public and has activity
□ Strongest projects are pinned with READMEs
□ URL in header matches linked profile
□ Code is clean enough to show in an interview

ATS
□ JD-specific keyword check completed (Blog 5 process)
□ Score checked against target JD (Blog 3 tool)
□ File saved as text-based PDF: Firstname_Lastname_Resume.pdf</code></pre>

<hr />

<h2 id="read-next-in-this-series">Read Next in This Series</h2>

<p>→ <strong><a href="/blog/why-indian-fresher-resumes-are-invisible-to-ats-2026">Blog 1: What is ATS</a></strong> | <strong><a href="/blog/ats-friendly-resume-format-indian-freshers-2026">Blog 2: Resume Format</a></strong> | <strong><a href="/blog/how-to-check-your-ats-score-before-applying-india-2026">Blog 3: ATS Score</a></strong></p>
<p>→ <strong><a href="/blog/10-resume-formatting-mistakes-indian-freshers-2026">Blog 4: Formatting Mistakes</a></strong> | <strong><a href="/blog/ats-keywords-for-indian-freshers-2026">Blog 5: Keywords</a></strong> | <strong><a href="/blog/how-to-write-a-resume-objective-for-freshers-in-india-2026">Blog 6: Objective</a></strong></p>
<p>→ <strong><a href="/blog/how-to-write-the-projects-section-on-your-resume-2026">Blog 7: Projects Section</a></strong> | <strong><a href="/blog/resume-skills-section-for-indian-freshers-2026">Blog 8: Skills Section</a></strong> | <strong><a href="/blog/how-to-write-the-education-section-on-an-indian-fresher-resume-2026">Blog 9: Education</a></strong></p>
<p>→ <strong><a href="/blog/how-to-write-certifications-resume-india-freshers-2026">Blog 10: Certifications</a></strong> | <strong><a href="/blog/how-to-write-a-resume-with-no-experience-india-freshers-2026">Blog 11: No Experience Resume</a></strong> | <strong><a href="/blog/blog-12-resume-action-verbs-india-freshers-2026">Blog 12: Action Verbs</a></strong></p>

<p>→ <strong><a href="/blog/resume-format-ece-freshers-india-2026">Blog 14: Resume Format for ECE Freshers in India — Core + IT Pivot Guide</a></strong> <em>(Coming next)</em></p>

<hr />

<h2 id="build-your-cse-resume-on-careerforge-pro">Build Your CSE Resume on CareerForge.pro</h2>

<p>CareerForge.pro's resume builder gives CSE freshers a structured, ATS-compatible template that puts your projects, skills, and education in exactly the right places — whether you're targeting TCS, Infosys, a product company, or a startup.</p>

<p>Use the <strong>JD Score tool</strong> to check your keyword match before every application — and the <strong>AI Bullet Writer</strong> to sharpen your project descriptions until they communicate exactly what you built.</p>

<p><strong><a href="#">Start Building Your CSE Resume on CareerForge.pro →</a></strong></p>

<hr />



</BlogPostLayout>
  )
}