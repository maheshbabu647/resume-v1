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
      <div dangerouslySetInnerHTML={{ __html: `{/* # Resume Format for CSE/IT Freshers in India — 2026 ATS-Ready Template and Complete Guide */}

{/* **By CareerForge.pro** | Resume Advice for Indian Freshers | 15 min read */}

<hr />

<p>&gt; *More CSE graduates enter the Indian job market every year than*</p>
<p>&gt; *any other engineering stream.*</p>
<p>&gt;</p>
<p>&gt; *That's not a problem. It's a signal that your resume needs to be*</p>
<p>&gt; *significantly better than the average — because the average is what*</p>
<p>&gt; *you're competing against.*</p>
<p>&gt;</p>
<p>&gt; *This blog tells you exactly how to build it.*</p>

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

<p>**What they are looking for:** Trainable freshers with solid fundamentals. Clean academic record (CGPA 6.0+ at graduation, 10th, and 12th). Good aptitude scores. Basic programming knowledge. The ability to learn quickly and follow structured processes.</p>

<p>**Resume strategy for service companies:**</p>
<p>- CGPA must be visible immediately — these companies have eligibility cutoffs</p>
<p>- Fundamental skills dominate: Java, Python, C, SQL, Data Structures, DBMS, OOP</p>
<p>- Projects are important but treated as training evidence, not product experience</p>
<p>- Keep it to one page, strictly — multiple reports from campus placement interactions confirm that two-page fresher resumes are deprioritised at high-volume service company drives</p>
<p>- Declaration section expected for campus drives</p>

<p>**Keywords these companies' ATS systems scan for:**</p>
<p>Java, Python, C, C++, SQL, MySQL, DBMS, Data Structures, Algorithms, OOP, SDLC, Agile, Git, HTML, CSS, JavaScript, REST API</p>

<hr />

<h3>Type 2 — Product Companies and Tech-First MNCs (Amazon, Microsoft, Google, Flipkart, Swiggy, Razorpay, Freshworks, Zoho)</h3>

<p>These companies hire far fewer freshers but pay significantly more. Their selection process is harder — typically involving multiple technical rounds focused on Data Structures and Algorithms (DSA), system design basics, and code quality.</p>

<p>**What they are looking for:** Technical depth. Problem-solving ability. Strong project work — not just academic projects, but evidence of building something non-trivial. Competitive programming activity. GitHub presence. Domain-specific expertise (backend, ML, data, etc.)</p>

<p>**Resume strategy for product companies:**</p>
<p>- DSA and competitive programming ratings (LeetCode, Codeforces, HackerRank) belong on the resume — explicitly</p>
<p>- Projects must demonstrate technical ambition — not just CRUD applications</p>
<p>- Deployment, scale, and architecture decisions should be mentioned</p>
<p>- GitHub link is expected and will be reviewed</p>
<p>- Objective should name the specific role and demonstrate domain focus</p>
<p>- Declaration can be omitted — product companies do not expect it</p>

<p>**Keywords product companies' systems scan for:**</p>
<p>Data Structures, Algorithms, System Design, REST APIs, Microservices, Docker, Kubernetes, React.js, Node.js, Python, Django, Flask, PostgreSQL, MongoDB, Redis, AWS, CI/CD, Git, GitHub, LeetCode, Open Source</p>

<hr />

<h3>Type 3 — Startups and Early-Stage Companies</h3>

<p>Startups want versatile builders. They care about what you've shipped, not just what you've studied. A candidate who built a live project that real people use is far more compelling to a startup recruiter than one with a 9.2 CGPA and no visible work.</p>

<p>**What they are looking for:** Initiative, breadth, speed of learning, ownership. Evidence that you've built things that work — ideally deployed and live.</p>

<p>**Resume strategy for startups:**</p>
<p>- Projects with GitHub and live demo links carry significant weight</p>
<p>- Language is more conversational, less formal — but still professional</p>
<p>- Declaration can be omitted</p>
<p>- Highlight any freelance work, open-source contributions, or personal products</p>
<p>- Communication ability matters — mention any writing, content, or community work if relevant</p>

<hr />

<h2 id="the-cse-fresher-skills-section-stream-specific">The CSE Fresher Skills Section: Stream-Specific</h2>

<p>This is the most keyword-dense section of your resume. For CSE freshers, it needs to be thorough — but only include what you can discuss in an interview.</p>

<hr />

<h3>For Software Developer / Backend Roles</h3>

<pre style={{ background: 'var(--surface-container-high)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}><code>
<p>TECHNICAL SKILLS</p>

<p>Programming Languages:    Java, Python, C, C++, SQL</p>
<p>Frameworks:               Spring Boot, Django, Flask, Express.js</p>
<p>Web Technologies:         HTML5, CSS3, JavaScript, React.js, Node.js</p>
<p>Databases:                MySQL, PostgreSQL, MongoDB, SQLite</p>
<p>Tools & Platforms:        Git, GitHub, VS Code, IntelliJ IDEA, </p>
<p>                          Postman, Linux (Ubuntu), JIRA</p>
<p>Cloud (Basics):           AWS (EC2, S3, Lambda — fundamentals)</p>
<p>Concepts:                 REST API Development, OOP, SDLC,</p>
<p>                          Data Structures & Algorithms, Agile, MVC</p>
<p>&lt;/code&gt;&lt;/pre&gt;</p>

<hr />

<h3>For Data Science / Data Analyst Roles</h3>

<pre style={{ background: 'var(--surface-container-high)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}><code>
<p>TECHNICAL SKILLS</p>

<p>Programming Languages:    Python, R, SQL</p>
<p>Libraries & Frameworks:   Pandas, NumPy, Scikit-learn, TensorFlow,</p>
<p>                          Keras, Matplotlib, Seaborn, NLTK, OpenCV</p>
<p>Databases:                MySQL, PostgreSQL, MongoDB</p>
<p>BI & Visualisation:       Tableau, Power BI, Google Looker Studio,</p>
<p>                          MS Excel (Advanced)</p>
<p>Tools:                    Jupyter Notebook, Google Colab, Git,</p>
<p>                          VS Code, Anaconda</p>
<p>Concepts:                 Machine Learning, Deep Learning, NLP,</p>
<p>                          EDA, Feature Engineering, Statistical Analysis,</p>
<p>                          Data Cleaning, Model Evaluation</p>
<p>Cloud (Basics):           AWS SageMaker (basics), Google Colab Pro</p>
<p>&lt;/code&gt;&lt;/pre&gt;</p>

<hr />

<h3>For Full Stack / Web Development Roles</h3>

<pre style={{ background: 'var(--surface-container-high)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}><code>
<p>TECHNICAL SKILLS</p>

<p>Frontend:                 React.js, Next.js, HTML5, CSS3,</p>
<p>                          JavaScript (ES6+), TypeScript, Tailwind CSS</p>
<p>Backend:                  Node.js, Express.js, Django, Flask</p>
<p>Databases:                MySQL, MongoDB, PostgreSQL, Firebase</p>
<p>DevOps & Tools:           Git, GitHub, Docker (basics), AWS EC2,</p>
<p>                          Netlify, Vercel, Postman, VS Code</p>
<p>Concepts:                 REST APIs, GraphQL (basics), Responsive Design,</p>
<p>                          Authentication (JWT, OAuth), Web Security basics,</p>
<p>                          Agile, CI/CD basics</p>
<p>&lt;/code&gt;&lt;/pre&gt;</p>

<hr />

<h3>For DevOps / Cloud Roles</h3>

<pre style={{ background: 'var(--surface-container-high)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}><code>
<p>TECHNICAL SKILLS</p>

<p>Cloud Platforms:          AWS (EC2, S3, Lambda, RDS, VPC),</p>
<p>                          Google Cloud (GCE, GCS — basics)</p>
<p>DevOps Tools:             Docker, Kubernetes (basics), Jenkins,</p>
<p>                          GitHub Actions, Terraform (basics)</p>
<p>Programming:              Python, Bash/Shell Scripting, YAML</p>
<p>Operating Systems:        Linux (Ubuntu, CentOS), Windows Server</p>
<p>Monitoring:               Prometheus, Grafana (basics)</p>
<p>Concepts:                 CI/CD Pipelines, Infrastructure as Code,</p>
<p>                          Containerisation, Microservices, Git</p>
<p>&lt;/code&gt;&lt;/pre&gt;</p>

<hr />

<h2 id="the-cse-fresher-projects-section-what-makes-one-stand-out">The CSE Fresher Projects Section: What Makes One Stand Out</h2>

<p>We covered the projects section comprehensively in Blog 7. For CSE freshers specifically, here is what separates a standout project from an average one.</p>

<hr />

<h3>For Service Companies (Trainability Signal)</h3>

<p>Service company recruiters are not looking for a distributed system. They are looking for evidence that you understand the full cycle of building something — requirement, design, code, test, deploy — using standard, recognisable technologies.</p>

<p>**What works:**</p>
<p>- A functional CRUD application (student management, hospital management, inventory)</p>
<p>- With a recognisable tech stack (Java + Spring Boot + MySQL, or Python + Flask + MySQL)</p>
<p>- With at least 2–3 features described specifically</p>
<p>- With an outcome (simulated load, testing results, faculty review)</p>

<p>**Strong example for service company applications:**</p>
<pre style={{ background: 'var(--surface-container-high)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}><code>
<p>Online Exam Management System | Java, Spring Boot, MySQL, </p>
<p>Thymeleaf, Bootstrap</p>
<p>• Built a web-based exam management platform for faculty to </p>
<p>  create timed MCQ exams and for students to attempt them; </p>
<p>  supports 200+ concurrent simulated users</p>
<p>• Implemented role-based access using Spring Security with </p>
<p>  separate dashboards for admin, faculty, and student users</p>
<p>• Developed auto-grading logic with instant result generation </p>
<p>  and PDF export; integrated email notifications using </p>
<p>  JavaMail API</p>
<p>• Reduced manual exam setting time by estimated 70% vs </p>
<p>  paper-based process; zero test failures in 50-session </p>
<p>  load simulation</p>
<p>&lt;/code&gt;&lt;/pre&gt;</p>

<hr />

<h3>For Product Companies (Technical Depth Signal)</h3>

<p>Product company interviewers will review your GitHub. They will ask about your architecture decisions. They will ask why you chose one database over another. Your project description needs to demonstrate that you thought about these things — not just that you built something that works.</p>

<p>**What works:**</p>
<p>- Non-trivial architecture: microservices, real-time features, ML inference, queue-based processing</p>
<p>- Deployment details: where it runs, how you deployed it, what scale it handles</p>
<p>- Technical challenges: what was hard, how you solved it</p>
<p>- Open source contribution or a project with real users outside your college</p>

<p>**Strong example for product company applications:**</p>
<pre style={{ background: 'var(--surface-container-high)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}><code>
<p>Real-Time Collaborative Code Editor | React.js, Node.js, </p>
<p>WebSocket, Redis, MongoDB, Docker</p>
<p>• Built a browser-based collaborative code editor supporting </p>
<p>  simultaneous editing by multiple users with real-time </p>
<p>  synchronisation — similar to Google Docs for code</p>
<p>• Implemented Operational Transformation (OT) algorithm in </p>
<p>  Node.js for conflict resolution; used Redis pub/sub for </p>
<p>  broadcasting cursor positions and code changes across </p>
<p>  WebSocket connections</p>
<p>• Containerised the application with Docker; deployed on </p>
<p>  AWS EC2 with Nginx reverse proxy; sustained 20 concurrent </p>
<p>  user sessions in stress testing with p95 latency under 80ms</p>
<p>• github.com/yourname/collab-editor | 47 GitHub stars</p>
<p>&lt;/code&gt;&lt;/pre&gt;</p>

<hr />

<h3>For Startups (Ownership Signal)</h3>

<p>Startup recruiters want to see that you ship things. A project with a real deployment URL, real users (even 10 of them), and a described problem it solves says more than a technically impressive project that nobody uses.</p>

<p>**What works:**</p>
<p>- A live product with a URL</p>
<p>- A clear problem statement (who uses it, what for)</p>
<p>- Any real-world metrics (users, traffic, feedback)</p>
<p>- Evidence of iteration: "launched MVP in 2 weeks, added X after user feedback"</p>

<p>**Strong example for startup applications:**</p>
<pre style={{ background: 'var(--surface-container-high)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}><code>
<p>ResumeMatch.in — Job-Resume Matching Tool | React.js, </p>
<p>Python, FastAPI, PostgreSQL, AWS S3</p>
<p>• Built and launched a web tool that helps freshers identify </p>
<p>  keyword gaps between their resume and any job description; </p>
<p>  attracted 200+ users in the first month with zero paid </p>
<p>  marketing</p>
<p>• Developed keyword extraction using Python NLP (spaCy) </p>
<p>  with a scoring algorithm comparing JD term frequency </p>
<p>  against resume text; frontend in React.js</p>
<p>• Launched MVP in 11 days; iterated twice based on user </p>
<p>  feedback (added PDF upload, added score history); </p>
<p>  currently live at resumematch.in</p>
<p>&lt;/code&gt;&lt;/pre&gt;</p>

<hr />

<h2 id="adding-competitive-programming-to-your-cse-resume">Adding Competitive Programming to Your CSE Resume</h2>

<p>For product company and DSE-track applications, your competitive programming activity belongs on your resume. Service company ATS systems may not weight this heavily, but product company recruiters and interviewers look for it specifically.</p>

<p>**Where to put it:** Either in the Skills section as a separate "Competitive Programming" line, or in the Extracurriculars section if you have a rank or achievement.</p>

<p>**How to include it:**</p>

<pre style={{ background: 'var(--surface-container-high)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}><code>
<p>TECHNICAL SKILLS</p>
<p>...</p>
<p>Competitive Programming:  LeetCode — 400+ problems solved (Rating: 1,650)</p>
<p>                          Codeforces — Specialist (Rating: 1,420)</p>
<p>                          HackerRank — 5-star Python, 4-star Java</p>
<p>&lt;/code&gt;&lt;/pre&gt;</p>

<p>Or in Extracurriculars:</p>

<pre style={{ background: 'var(--surface-container-high)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}><code>
<p>Competitive Programming</p>
<p>• LeetCode: 400+ problems solved, max rating 1,650 (Knight)</p>
<p>• Codeforces: Specialist (Rating: 1,420); solved 200+ problems </p>
<p>  including Dynamic Programming, Graph algorithms, and Segment Trees</p>
<p>• HackerRank: 5-star badge in Python, 4-star in Java</p>
<p>&lt;/code&gt;&lt;/pre&gt;</p>

<p>Include only honest ratings and problem counts. These are publicly verifiable — the interviewer can and sometimes will check.</p>

<p>If your competitive programming activity is limited, do not fabricate it. Focus your resume on your projects instead. A strong project beats a mediocre competitive programming profile.</p>

<hr />

<h2 id="the-github-profile-what-cse-recruiters-actually-look-for">The GitHub Profile: What CSE Recruiters Actually Look For</h2>

<p>A GitHub link on a CSE resume is expected — especially for product company and startup applications. But a GitHub link that leads to an empty or poorly maintained profile is worse than no link.</p>

<p>Here is what to check before including your GitHub URL:</p>

<p>**Profile basics:** A profile photo, a bio (1–2 lines about your focus), and a location. Recruiters notice when a profile looks abandoned.</p>

<p>**Pinned repositories:** Pin your 4–6 strongest projects. These are the first thing a technical reviewer sees. Each pinned repo should have: a clear name, a README with description, tech stack, how to run it, and at least one screenshot or demo link.</p>

<p>**Commit activity:** A consistent green contribution graph signals regular coding activity. If your graph is sparse, start committing regularly — even small updates to existing projects, documentation improvements, or new personal projects. This takes time to build, so start now.</p>

<p>**README quality:** A well-written README is a writing sample and a technical communication sample simultaneously. Use headers, code blocks, and a clear structure: What it does → Tech stack → How to set it up → Screenshots/demo.</p>

<p>**Code quality:** Your code will be read in interviews for project-based companies. Clean variable names, consistent formatting, and comments on complex logic matter.</p>

<hr />

<h2 id="the-complete-cse-fresher-resume-a-full-template">The Complete CSE Fresher Resume: A Full Template</h2>

<p>Here is a complete one-page resume template for a CSE fresher targeting software developer and data roles. Adapt the content to your own profile.</p>

<pre style={{ background: 'var(--surface-container-high)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}><code>
<p>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
<p>ROHAN VERMA</p>
<p>+91-94001-23456 | rohan.verma@gmail.com | Pune, Maharashtra</p>
<p>linkedin.com/in/rohanverma | github.com/rohanverma</p>
<p>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>

<p>OBJECTIVE</p>
<p>B.Tech Computer Science graduate from ABC Institute of Technology </p>
<p>with strong foundation in Java, Spring Boot, and MySQL. Built a </p>
<p>full-stack exam management system handling 200+ concurrent simulated </p>
<p>users. Seeking a Software Developer role to build backend systems </p>
<p>and contribute to scalable product development.</p>

<p>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>

<p>EDUCATION</p>

<p>B.Tech in Computer Science Engineering</p>
<p>ABC Institute of Technology, Pune | 2022 – 2026 | CGPA: 8.1 / 10</p>
<p>Relevant Coursework: Data Structures, DBMS, Operating Systems,</p>
<p>                     Computer Networks, OOP, Software Engineering</p>

<p>Class XII — CBSE | DEF School, Pune | 2022 | 86%</p>
<p>Class X  — CBSE | DEF School, Pune | 2020 | 90%</p>

<p>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>

<p>TECHNICAL SKILLS</p>

<p>Languages:      Java, Python, C, SQL, JavaScript</p>
<p>Frameworks:     Spring Boot, React.js, Node.js, Flask</p>
<p>Databases:      MySQL, MongoDB, PostgreSQL</p>
<p>Tools:          Git, GitHub, IntelliJ IDEA, VS Code, Postman,</p>
<p>                Linux (Ubuntu), Docker (basics)</p>
<p>Cloud:          AWS (EC2, S3 — fundamentals)</p>
<p>Concepts:       REST API Development, OOP, SDLC, Agile,</p>
<p>                Data Structures & Algorithms, MVC</p>

<p>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>

<p>PROJECTS</p>

<p>Online Exam Management System | Java, Spring Boot, MySQL, </p>
<p>Thymeleaf, Spring Security</p>
<p>• Built a full-stack exam platform with timed MCQ exams, </p>
<p>  auto-grading, and role-based access for admin, faculty, </p>
<p>  and student users; supports 200+ concurrent simulated sessions</p>
<p>• Implemented Spring Security for authentication, JavaMail </p>
<p>  API for automated email alerts, and PDF report generation </p>
<p>  using iText library</p>
<p>• Reduced manual exam setting time by estimated 70% vs </p>
<p>  paper-based process; zero failures across 50-session </p>
<p>  load simulation</p>
<p>• github.com/rohanverma/exam-management</p>

<p>E-Commerce Platform | React.js, Node.js, MongoDB, Express.js, AWS</p>
<p>• Developed a full-stack e-commerce application with product </p>
<p>  cataloguing, cart management, user authentication, and </p>
<p>  Razorpay payment gateway integration</p>
<p>• Deployed backend on AWS EC2 with MongoDB Atlas; implemented </p>
<p>  JWT-based authentication and RESTful APIs using Express.js</p>
<p>• Handled 500+ concurrent test user sessions; page load </p>
<p>  time optimised from 3.8s to 1.2s through lazy loading and </p>
<p>  code splitting</p>

<p>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>

<p>CERTIFICATIONS</p>

<p>AWS Certified Cloud Practitioner</p>
<p>Amazon Web Services | November 2025</p>

<p>HackerRank Java (Intermediate) Certificate</p>
<p>HackerRank | Verified | August 2025</p>

<p>Programming, Data Structures and Algorithms using Python</p>
<p>NPTEL — IIT Madras | Score: 74% | April 2025</p>

<p>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>

<p>EXTRACURRICULAR ACTIVITIES</p>

<p>Technical Club Coordinator | IEEE Student Chapter, ABC Institute</p>
<p>2024 – 2025</p>
<p>• Led 14-member team; organised 5 workshops (180+ attendees) </p>
<p>  on React.js, Spring Boot, and Cloud fundamentals</p>
<p>• Coordinated intercollegiate hackathon with 12 colleges and </p>
<p>  300+ registrations</p>

<p>Competitive Programming</p>
<p>• LeetCode: 250+ problems solved (Rating: 1,420)</p>
<p>• HackerRank: 5-star badge in Java, 4-star in Python</p>

<p>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>

<p>DECLARATION</p>
<p>I hereby declare that all information provided above is </p>
<p>true and correct to the best of my knowledge.</p>

<p>Place: Pune     Date: [Date]     Signature: ____________</p>
<p>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
<p>&lt;/code&gt;&lt;/pre&gt;</p>

<hr />

<h2 id="the-one-page-rule-for-cse-freshers-is-it-negotiable">The One-Page Rule for CSE Freshers — Is It Negotiable?</h2>

<p>For service company applications and campus drives: no. One page is the standard, and multiple reports from campus placement interactions at large IT companies confirm that two-page fresher resumes are deprioritised. Recruiters process high volumes; a concise resume is a signal of good judgment.</p>

<p>For product company and startup applications: slightly more flexible. If you have three substantial projects, active competitive programming, an open-source contribution, and relevant certifications — two pages is acceptable. But test whether you genuinely need that space. Most fresher profiles fit in one page if the writing is tight and the content is prioritised.</p>

<p>**The discipline test:** If you can't fit your resume on one page, the first question to ask is not "should I add a page?" — it is "what am I including that doesn't earn its space?"</p>

<hr />

<h2 id="tailoring-your-cse-resume-for-specific-roles">Tailoring Your CSE Resume for Specific Roles</h2>

<p>A base CSE resume is the foundation. For each application, a 10-minute tailoring process makes it significantly more relevant.</p>

<p>**For a Java Backend Developer JD:**</p>
<p>Update objective to mention Java, Spring Boot, and the specific role title. Ensure Spring Boot, MySQL, REST API, Agile, and OOP are visible in the top third of the resume. Lead with the project most relevant to backend work.</p>

<p>**For a Python Data Analyst JD:**</p>
<p>Update objective to mention Python, SQL, and data analysis. Reorder skills to put Python, Pandas, SQL, and data tools first. Lead with the data project. Ensure Jupyter, Matplotlib, and Scikit-learn appear prominently.</p>

<p>**For a Full Stack Developer JD:**</p>
<p>Update objective to name the stack (React + Node, or Django + React). Ensure the full-stack project leads. Mention both frontend and backend skills explicitly in the first few skill lines.</p>

<p>**For a DevOps / Cloud Engineer JD:**</p>
<p>Update objective to mention cloud and DevOps. Surface Docker, AWS, Linux, and CI/CD in the skills section. Mention any deployment work in project bullets specifically.</p>

<p>The keyword strategy from Blog 5 applies to every one of these: read the JD, extract the terms, verify they appear in your resume in the right sections.</p>

<hr />

<h2 id="the-cse-resume-checklist">The CSE Resume Checklist</h2>

<pre style={{ background: 'var(--surface-container-high)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}><code>
<p>STRUCTURE</p>
<p>□ Single column, plain text, one page (for service </p>
<p>  companies) or max two pages (for product companies </p>
<p>  with substantial content)</p>
<p>□ Standard section headings</p>
<p>□ Notepad test passes cleanly</p>

<p>OBJECTIVE</p>
<p>□ Names specific role (matches JD job title)</p>
<p>□ Includes 2–3 skills from target JD</p>
<p>□ Includes one proof point (project outcome or certification)</p>

<p>EDUCATION</p>
<p>□ CGPA visible and above company minimum</p>
<p>□ 10th and 12th included (required for TCS, Infosys, Wipro)</p>
<p>□ Relevant coursework listed (4–6 courses matching JD)</p>

<p>SKILLS</p>
<p>□ Categorised and specific (not generic)</p>
<p>□ Hard technical skills only — no "team player" etc.</p>
<p>□ Matches target JD terminology precisely</p>
<p>□ Competitive programming included (for product companies)</p>

<p>PROJECTS</p>
<p>□ 2–3 projects with: Tech Stack + What + How + Outcome</p>
<p>□ Projects aligned to target role type (service vs product)</p>
<p>□ GitHub links included and repos are publicly readable</p>
<p>□ At least one metric per project</p>

<p>CERTIFICATIONS</p>
<p>□ From recognisable issuers</p>
<p>□ 2–4 entries maximum</p>

<p>EXTRACURRICULARS</p>
<p>□ Written with specifics and action verbs</p>
<p>□ No generic hobbies</p>

<p>GITHUB</p>
<p>□ Profile is public and has activity</p>
<p>□ Strongest projects are pinned with READMEs</p>
<p>□ URL in header matches linked profile</p>
<p>□ Code is clean enough to show in an interview</p>

<p>ATS</p>
<p>□ JD-specific keyword check completed (Blog 5 process)</p>
<p>□ Score checked against target JD (Blog 3 tool)</p>
<p>□ File saved as text-based PDF: Firstname_Lastname_Resume.pdf</p>
<p>&lt;/code&gt;&lt;/pre&gt;</p>

<hr />

<h2 id="read-next-in-this-series">Read Next in This Series</h2>

<p>→ **[Blog 1: What is ATS](#)** | **[Blog 2: Resume Format](#)** | **[Blog 3: ATS Score](#)**</p>
<p>→ **[Blog 4: Formatting Mistakes](#)** | **[Blog 5: Keywords](#)** | **[Blog 6: Objective](#)**</p>
<p>→ **[Blog 7: Projects Section](#)** | **[Blog 8: Skills Section](#)** | **[Blog 9: Education](#)**</p>
<p>→ **[Blog 10: Certifications](#)** | **[Blog 11: No Experience Resume](#)** | **[Blog 12: Action Verbs](#)**</p>

<p>→ **[Blog 14: Resume Format for ECE Freshers in India — Core + IT Pivot Guide](#)** *(Coming next)*</p>

<hr />

<h2 id="build-your-cse-resume-on-careerforge-pro">Build Your CSE Resume on CareerForge.pro</h2>

<p>CareerForge.pro's resume builder gives CSE freshers a structured, ATS-compatible template that puts your projects, skills, and education in exactly the right places — whether you're targeting TCS, Infosys, a product company, or a startup.</p>

<p>Use the **JD Score tool** to check your keyword match before every application — and the **AI Bullet Writer** to sharpen your project descriptions until they communicate exactly what you built.</p>

<p>**[Start Building Your CSE Resume on CareerForge.pro →](#)**</p>

<hr />

<p>*Published by CareerForge.pro — India's AI Resume Platform for Freshers.*</p>
<p>*© 2026 CareerForge.pro. All rights reserved.*</p>

<hr />

<h3>SEO Metadata</h3>

<p>**Primary Keywords:** resume format for CSE freshers India, resume for computer science freshers India, IT fresher resume format India</p>

<p>**Secondary Keywords:** CSE fresher resume template India, software developer fresher resume India, BTech CSE resume India 2026, resume for TCS Infosys CSE fresher, CSE fresher resume ATS India</p>

<p>**Word Count:** ~3,800 words</p>

<p>**Internal Links:**</p>
<p>- Blogs 1–12 (all previous in series, referenced throughout)</p>
<p>- Blog 5 (Keywords — explicitly referenced)</p>
<p>- Blog 7 (Projects — explicitly referenced)</p>
<p>- Blog 14 (ECE Resume — upcoming)</p>
<p>- CareerForge Resume Builder + JD Score + AI Bullet Writer (CTAs)</p>

<p>**Meta Description (159 chars):**</p>
<p>Complete CSE/IT fresher resume guide for India in 2026 — service vs product vs startup strategy, stream-specific skills, full template, and GitHub checklist.</p>
` }} />
    </BlogPostLayout>
  )
}
