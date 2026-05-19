import { BlogPostLayout } from '../BlogPostLayout'
import blogCover from '@/assets/blog-post-1-cover.png'

const TOC = [
  { id: 'first-the-truth-about-no-experience', text: 'First, The Truth About "No Experience"' },
  { id: 'the-mindset-shift-experience-is-not-the-same-as-employment', text: 'The Mindset Shift: Experience Is Not the Same as Employment' },
  { id: 'what-replaces-work-experience-on-a-fresher-resume', text: 'What Replaces Work Experience on a Fresher Resume' },
  { id: 'the-section-order-for-a-no-experience-resume', text: 'The Section Order for a No-Experience Resume' },
  { id: 'the-objective-framing-no-experience-as-an-asset', text: 'The Objective: Framing No Experience as an Asset' },
  { id: 'how-to-describe-academic-projects-without-underselling-them', text: 'How to Describe Academic Projects Without Underselling Them' },
  { id: 'a-complete-no-experience-resume-structure-filled-in', text: 'A Complete No-Experience Resume Structure: Filled In' },
  { id: 'the-three-things-that-separate-a-strong-no-experience-resume-from-a-weak-one', text: 'The Three Things That Separate a Strong No-Experience Resume From a Weak One' },
  { id: 'the-checklist-no-experience-resume-before-submission', text: 'The Checklist: No-Experience Resume Before Submission' },
]

export default function BlogPost11() {
  return (
    <BlogPostLayout
      slug="how-to-write-a-resume-with-no-experience-india-freshers-2026"
      heroImagePath={blogCover}
      tocEntries={TOC}
    >
      <blockquote>
        <p><em>"I have no internship. I have no work experience. What do I even put on my resume?" This is the most common question Indian freshers ask. And the answer is longer — and more useful — than most people expect.</em></p>
      </blockquote>

      <hr />

      <h2 id="first-the-truth-about-no-experience">First, The Truth About "No Experience"</h2>

      <p>Here is something worth understanding before you write a single word:</p>
      <p><strong>The majority of Indian freshers who get hired at TCS, Infosys, Wipro, and comparable companies every year have no formal work experience.</strong></p>
      <p>This is not an exception. It is the norm. Indian IT companies structure their entire fresher hiring model around candidates who have never worked professionally. They know what a fresher profile looks like. They are not surprised by the absence of work history. They are looking for something else entirely.</p>
      <p>What they are looking for is evidence of three things:</p>
      <p><strong>Eligibility</strong> — Do you meet the academic criteria? (CGPA, 10th/12th percentage, correct degree)</p>
      <p><strong>Capability</strong> — Can you demonstrate any practical skill, even through academic or personal work?</p>
      <p><strong>Potential</strong> — Does this person look like someone who takes initiative, learns deliberately, and will be worth training?</p>
      <p>A resume with no internship can address all three. It just requires you to use every non-work section of your resume with the same intentionality that an experienced candidate uses their Work Experience section.</p>
      <p>That's what this blog covers.</p>

      <hr />

      <h2 id="the-mindset-shift-experience-is-not-the-same-as-employment">The Mindset Shift: Experience Is Not the Same as Employment</h2>

      <p>The word "experience" on a resume does not exclusively mean paid employment. It means demonstrated exposure to skills, tools, and situations relevant to the role.</p>
      <p>A fresher who built a full-stack web application as a final year project has experience with React.js, Node.js, and MySQL. They have not been paid for that experience. But the experience — the work done, the problems solved, the tools used — is real and verifiable.</p>
      <p>A fresher who led their college technical club for a year has experience with team coordination, event planning, and communication. Again, unpaid. Still real.</p>
      <p>A fresher who completed a Google Data Analytics certification and analysed a public dataset as a project has experience with Python, Pandas, and data visualisation. The learning was self-directed. The output is their project. The experience is documented.</p>
      <p>Once you understand this, the resume-writing task changes. You are no longer trying to fill a Work Experience section you don't have. You are presenting real evidence of real skills through the sections you do have — Projects, Education, Certifications, and Extracurriculars.</p>
      <p>The structure and the writing discipline are the same. The source of the evidence is different.</p>

      <hr />

      <h2 id="what-replaces-work-experience-on-a-fresher-resume">What Replaces Work Experience on a Fresher Resume</h2>

      <p>Here is the hierarchy of what fills the experience gap, ordered by impact:</p>

      <hr />

      <h3>1. Academic and Personal Projects (Highest Impact)</h3>
      <p>We covered the projects section in detail in <a href="/blog/how-to-write-the-projects-section-on-your-resume-2026">Blog 7</a>. For a fresher with no internship, this section is not just important — it is your most critical section after Education.</p>
      <p>Two or three well-written project entries, each with a technology stack, a clear description of what was built, and a quantified or specific outcome, communicate more useful information to a recruiter than a vague internship entry that says "assisted the team with various tasks."</p>
      <p>If you have projects — build this section first and build it with full attention. Every project gets the four-bullet treatment:</p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>{`Project Name | Tech Stack
• What it is (the product/system, one line)
• How you built it (specific tools and methods)
• What resulted (outcome, scale, metric)
• GitHub link (if the repo is ready to show)`}</code></pre>
      <p>If you don't have strong projects yet — the most useful thing you can do for your resume right now is not to polish the formatting. It is to build something. A weekend project, a data analysis on a public dataset, a simple automation tool. Something that produces a describable output you can then write about.</p>

      <hr />

      <h3>2. Virtual Internships and Online Programme Completions</h3>
      <p>Several organisations offer structured virtual internship programmes that result in a certificate of completion and sometimes a letter of experience. These are legitimate for inclusion on a resume and are specifically understood by Indian recruiters — especially for freshers who didn't secure a formal internship during college.</p>
      <p><strong>Recognised programmes worth including:</strong></p>
      <p><strong>Internshala Virtual Internships</strong> — Internshala offers structured virtual internship programmes across domains like web development, machine learning, data science, digital marketing, and more. Completions come with a certificate that is recognisable to Indian recruiters, especially at smaller companies and startups.</p>
      <p><strong>AICTE Internship Portal (NEAT)</strong> — Government-backed internship programme. Certificates carry strong credibility for government and PSU applications.</p>
      <p><strong>TCS iON Young Professional</strong> — A TCS-run skills development programme with recognised completion certificates. Specifically relevant when applying to TCS.</p>
      <p><strong>Infosys Springboard</strong> — Infosys's free learning platform. Completion certificates for their courses carry reasonable weight, especially for Infosys applications.</p>
      <p><strong>Google / Microsoft / AWS through Coursera</strong> — Covered in <a href="/blog/how-to-write-certifications-resume-india-freshers-2026">Blog 10</a>. These are not technically internships, but their project-based components give you real work to describe as projects.</p>
      <p><strong>Forage Virtual Work Experience</strong> — A platform that partners with companies (including Deloitte, JPMorgan, KPMG, BCG) to offer virtual internship simulations. Completions are accepted on resumes. Increasingly recognised in India for finance, consulting, and analytics roles.</p>
      <p><strong>How to list a virtual internship:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>{`Data Science Virtual Internship
Internshala | Remote | June – July 2025 (6 weeks)
• Completed a structured programme in exploratory data
  analysis, data visualisation, and predictive modelling
  using Python, Pandas, and Scikit-learn
• Built a customer churn prediction model achieving
  79% classification accuracy on the provided dataset
• Certificate of Completion issued by Internshala (2025)`}</code></pre>
      <p>Be accurate about the nature of the programme. Don't describe a virtual internship as if it were a full-time position at a company. The honest framing — "Virtual Internship" or "Online Programme" — is understood and accepted by Indian recruiters for fresher profiles. What matters is what you learned and what you built during it.</p>

      <hr />

      <h3>3. College Fests, Hackathons, and Technical Competitions</h3>
      <p>If you participated in any technical competition — Smart India Hackathon, HackVerse, college-level hackathons, coding competitions on HackerRank or CodeChef, paper presentations at intercollegiate fests — these belong on your resume.</p>
      <p>The key is the same as for projects: describe what you built or did, not just that you attended.</p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>{`Participant | Smart India Hackathon 2025 (State Level Finalist)
• Built a real-time crop disease detection system using
  a CNN model (TensorFlow, Keras) trained on 15,000+
  annotated leaf images; achieved 84% validation accuracy
• Designed a Flask API to serve predictions via a mobile
  interface; integrated with WhatsApp Bot for farmer alerts
• Reached state-level finals out of 180+ teams;
  evaluated by panel from IIT Hyderabad`}</code></pre>
      <p>Even if you didn't reach finals — if you built something, describe what you built. The quality of the work is what the recruiter evaluates, not only the placement.</p>

      <hr />

      <h3>4. Certifications From Recognised Issuers</h3>
      <p>Covered in detail in <a href="/blog/how-to-write-certifications-resume-india-freshers-2026">Blog 10</a>. For a fresher with no experience, certifications serve an additional purpose: they signal that you identified a skill the job market needs and pursued it deliberately, without being asked to.</p>
      <p>A fresher with no internship who holds an AWS Cloud Practitioner certificate and has a project that uses AWS is demonstrating something about their initiative that a blank resume cannot. Use this.</p>
      <p>The pairing matters: a certification backed by a project that used those skills is significantly more credible than a certification alone. Build the project that demonstrates the certification's subject matter.</p>

      <hr />

      <h3>5. NSS / NCC / Volunteer Work / Social Initiatives</h3>
      <p>For freshers with nothing in the categories above, or to supplement the sections that exist, National Service Scheme (NSS) and National Cadet Corps (NCC) participation are legitimate and recognisable by Indian recruiters.</p>
      <p><strong>NSS:</strong> If you completed 240+ hours across two years of NSS, that is substantial. List it with specific activities and impact.</p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>{`NSS Volunteer | XYZ College Chapter | 2022 – 2024
• Contributed 250+ hours across rural literacy camps,
  health awareness drives, and tree plantation programmes
  in 3 villages in Ranga Reddy district, Telangana
• Organised a 2-day blood donation camp with 120+ units
  collected in collaboration with Government Hospital`}</code></pre>
      <p><strong>NCC:</strong> NCC participation, especially with a C Certificate, is respected in government and defence-adjacent organisations and adds a visible character signal for all employers.</p>
      <p><strong>Volunteer work beyond NSS/NCC:</strong> Tutoring, community teaching, animal shelter work, NGO assistance — these are all includable with appropriate specificity.</p>
      <p>The rule: specifics make it credible. "NSS Volunteer" alone says almost nothing. "NSS Volunteer who organised events and contributed 250+ hours in specific communities" says something about initiative, commitment, and community awareness.</p>

      <hr />

      <h3>6. Leadership Roles in College</h3>
      <p>College clubs, student council, departmental associations, cultural committee leadership, sports team captaincy — these are experience. They demonstrate the ability to lead, coordinate, communicate, and take responsibility for outcomes.</p>
      <p>Write them the same way you would write work experience:</p>
      <p><strong>Weak:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>{`Member of Technical Club`}</code></pre>
      <p><strong>Strong:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>{`Technical Club Coordinator | IEEE Student Chapter, XYZ College
2023 – 2024
• Managed a team of 14 members across events, workshops,
  and social media coordination for the club
• Organised 5 workshops on topics including Web Development,
  Machine Learning, and Cybersecurity with 180+ total attendees
• Coordinated intercollegiate technical fest with
  12 participating colleges and 300+ student registrations`}</code></pre>
      <p>Leadership roles written this way demonstrate exactly what recruiters look for in fresh hires: the ability to take ownership, communicate with a team, and execute against a goal.</p>

      <hr />

      <h2 id="the-section-order-for-a-no-experience-resume">The Section Order for a No-Experience Resume</h2>

      <p>When you have no formal work experience, the section order of your resume changes slightly from the standard template to front-load your strongest signals.</p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>{`1. HEADER (Contact Information)
2. OBJECTIVE
3. EDUCATION (CGPA, coursework — covered in Blog 9)
4. TECHNICAL SKILLS (keyword-dense — covered in Blog 8)
5. PROJECTS (your substitute for work experience — the heaviest section)
6. VIRTUAL INTERNSHIPS / ONLINE PROGRAMMES (if any)
7. CERTIFICATIONS
8. EXTRACURRICULAR ACTIVITIES (clubs, NSS, hackathons, leadership)
9. DECLARATION (if applying to campus/government drives)`}</code></pre>
      <p>The logic: the recruiter needs to see your eligibility (Education) and your skill proof (Skills + Projects) as early as possible. The rest supports what's already established.</p>

      <hr />

      <h2 id="the-objective-framing-no-experience-as-an-asset">The Objective: Framing No Experience as an Asset</h2>

      <p>The objective section is where many freshers with no experience make a critical error: they write apologetically. They hedge. They focus on "wanting to learn" and "seeking an opportunity to grow."</p>
      <p>This framing positions you as a cost — someone the company must invest in with uncertain return.</p>
      <p>The correct framing positions you as a candidate with genuine skills, clear direction, and the self-initiative that proves trainability. The absence of work experience becomes less important when the rest of the objective makes a specific and credible case.</p>

      <p><strong>Weak (apologetic framing):</strong></p>
      <blockquote>
        <p>"Fresher seeking a challenging opportunity to learn and grow in a reputed organisation. I am a quick learner with strong communication skills and am eager to gain industry experience."</p>
      </blockquote>

      <p><strong>Strong (capability framing):</strong></p>
      <blockquote>
        <p>"B.Tech Computer Science graduate from XYZ College with hands-on experience in Python, machine learning (Scikit-learn, TensorFlow), and data analysis. Completed Google Data Analytics Certificate (2025) and a crop disease detection project with 84% model accuracy. Seeking a Data Analyst role to contribute to data-driven decision-making."</p>
      </blockquote>

      <p>The second version does not mention the absence of experience. It presents what exists — skills, a certification, a project with a specific outcome — and makes a clear ask. The reader's attention goes to what's there, not what isn't.</p>

      <hr />

      <h2 id="how-to-describe-academic-projects-without-underselling-them">How to Describe Academic Projects Without Underselling Them</h2>

      <p>The biggest writing mistake freshers with no experience make is treating academic projects as lesser than "real" work.</p>
      <p>A project that was assigned by a professor is still a project you built. The code you wrote, the design decisions you made, the technology stack you chose, the problem you solved — none of that becomes less real because you didn't get paid for it.</p>
      <p>Write your academic projects with the same professional tone and structural discipline as you would write work experience bullets.</p>

      <p><strong>The tell-tale signs of underselling:</strong></p>
      <ul>
        <li>"This was a college project for our 6th semester course"</li>
        <li>"I worked on this as part of my coursework"</li>
        <li>"It was just a mini project"</li>
      </ul>
      <p>You don't need to disclose the academic context in the description. The recruiter can infer that your final year project was from college. What they want to know is what you built, how, and what happened. Give them that.</p>

      <p><strong>The tell-tale signs of writing it right:</strong></p>
      <ul>
        <li>Technology named specifically in the title line</li>
        <li>First bullet describes the product with scale or context</li>
        <li>Second bullet describes technical implementation with method terms</li>
        <li>Third bullet has a number, a comparison, or a verifiable outcome</li>
        <li>GitHub link if available</li>
      </ul>
      <p>The academic context is in the section heading ("Projects" or "Academic Projects") — you don't need to announce it again in each entry.</p>

      <hr />

      <h2 id="a-complete-no-experience-resume-structure-filled-in">A Complete No-Experience Resume Structure: Filled In</h2>

      <p>Here is what a complete, one-page no-experience resume looks like when every section is used well. This is for a CSE fresher with no internship.</p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>{`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARJUN KRISHNA
+91-90001-23456 | arjun.krishna@gmail.com | Vijayawada, Andhra Pradesh
linkedin.com/in/arjunkrishna | github.com/arjunkrishna
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OBJECTIVE
B.Tech Computer Science graduate from ABC College with demonstrated
skills in Python, machine learning, and data analysis. Completed
Google Data Analytics Certificate (2025) and built a crop disease
detection system with 84% model accuracy. Seeking a Data Analyst
or Software Developer role to contribute to data-driven
product development.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EDUCATION
B.Tech in Computer Science Engineering
ABC College of Engineering, Vijayawada | 2022 – 2026 | CGPA: 7.9 / 10
Relevant Coursework: Data Structures, DBMS, Machine Learning,
                     Python Programming, Computer Networks
Class XII — AP State Board | DEF School, Vijayawada | 2022 | 84%
Class X  — AP State Board | DEF School, Vijayawada | 2020 | 89%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECHNICAL SKILLS
Languages:      Python, Java, C, SQL
ML & Data:      Scikit-learn, TensorFlow, Pandas, NumPy,
                Matplotlib, Seaborn
Web:            HTML, CSS, Flask
Databases:      MySQL, SQLite
Tools:          Git, Jupyter Notebook, Google Colab, VS Code
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECTS
Crop Disease Detection System | Python, TensorFlow, CNN, Flask, OpenCV
• Built an image classification system to identify 8 categories
  of crop diseases from leaf photographs for early farm-level detection
• Trained a CNN model on 15,000+ annotated images using TensorFlow
  and Keras; implemented transfer learning with MobileNetV2 for
  faster convergence
• Achieved 84% validation accuracy; deployed as a Flask API
  with a simple web interface for image upload and prediction
• github.com/arjunkrishna/crop-disease-detector

Student Attendance Management System | Python, Flask, MySQL, HTML, CSS
• Built a web-based attendance tracking system for a simulated
  department of 200 students with faculty and admin dashboards
• Implemented session-based authentication, automated attendance
  calculation, and email alert triggers for students below 75%
• Reduced simulated manual marking effort by an estimated 65%;
  used Git for version control throughout development
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CERTIFICATIONS
Google Data Analytics Professional Certificate
Google / Coursera | April 2025
Programming, Data Structures and Algorithms using Python
NPTEL — IIT Madras | Score: 74% | November 2024
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXTRACURRICULAR ACTIVITIES
Technical Club Coordinator | IEEE Student Chapter, ABC College
2024 – 2025
• Managed 14-member team; organised 5 technical workshops
  with 180+ total attendees on ML, web dev, and cybersecurity
• Coordinated intercollegiate hackathon with 12 colleges,
  300+ registrations

NSS Volunteer | ABC College Chapter | 2022 – 2024
• Contributed 240+ hours across rural literacy, health camps,
  and plantation drives in Vijayawada district
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DECLARATION
I hereby declare that all information above is true and correct
to the best of my knowledge.
Place: Vijayawada     Date: [Date]     Signature: ________
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`}</code></pre>

      <p>This resume has no internship. No work experience. No paid employment of any kind.</p>
      <p>It has a strong objective with specific skills and a metric. It has a rich Education section with relevant coursework. It has two well-described technical projects with outcomes. It has two recognised certifications. It has leadership and community involvement written with specifics.</p>
      <p>This profile competes — not because of experience, but because of how the evidence is assembled and written.</p>

      <hr />

      <h2 id="the-three-things-that-separate-a-strong-no-experience-resume-from-a-weak-one">The Three Things That Separate a Strong No-Experience Resume From a Weak One</h2>

      <p>After everything in this blog, it comes down to three things:</p>
      <p><strong>1. Specificity.</strong> Every weak no-experience resume is vague. "I am a passionate learner who works well in teams." Every strong no-experience resume is specific. "Built a crop disease detection model with 84% validation accuracy using TensorFlow and MobileNetV2." Specificity is what makes the absence of employment irrelevant — it is replaced by evidence.</p>
      <p><strong>2. Honest outcomes.</strong> A no-experience resume doesn't need to claim big results. It needs to claim honest, verifiable ones — even small ones. "Reduced simulated manual effort by 65% in testing" is honest and specific. "Improved performance by 200%" with no context is not credible. The recruiter can tell the difference.</p>
      <p><strong>3. Initiative signals.</strong> The gap between "did what was assigned" and "pursued this independently" is visible on a resume. A Google certification the candidate pursued on their own time, a personal project built over a weekend, an NSS programme completed over two years — these are evidence of initiative. They tell the recruiter something about work ethic that no amount of generic self-description does.</p>
      <p>Build these three things into every section of your resume and the absence of a formal internship becomes a secondary concern.</p>

      <hr />

      <h2 id="the-checklist-no-experience-resume-before-submission">The Checklist: No-Experience Resume Before Submission</h2>

      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>{`OBJECTIVE
□ Mentions specific skills (not just "eager to learn")
□ Names target role using JD language
□ Includes one proof point (project, certification, metric)
□ Reads as capability-forward, not apologetically

EDUCATION
□ CGPA visible and meeting target company minimum
□ Relevant coursework included (4–6 courses)
□ Academic achievements included if any

SKILLS
□ Hard technical skills only (no "team player" etc.)
□ Skills match target JD terminology

PROJECTS
□ 2–3 entries minimum
□ Each has: what it is + how built + outcome + GitHub (if ready)
□ Each title line has specific technology stack
□ At least one number or verifiable metric per project

VIRTUAL INTERNSHIPS / ONLINE PROGRAMMES
□ Included if completed (with what was built / learned)
□ Accurately described as virtual or online — not misrepresented

CERTIFICATIONS
□ From recognised issuers (Google, AWS, NPTEL, HackerRank etc.)
□ Month and year included
□ 2–4 entries maximum

EXTRACURRICULARS
□ Written with specifics: team size, event size, hours, outcomes
□ Leadership roles described with action verbs and results
□ No generic hobbies (reading, music, travelling) unless
  you have something specific to say about them

FORMAT
□ Single column, plain text, one page
□ No photo, no DOB, no personal details
□ Notepad test passes cleanly
□ File named: Firstname_Lastname_Resume.pdf`}</code></pre>

      <hr />

      <p>
        <strong>Read next:</strong>{' '}
        <a href="/blog/blog-12-resume-action-verbs-india-freshers-2026">Blog 12: Resume Action Verbs for Indian Freshers — 100 Power Words That Make Recruiters Stop and Read →</a>
      </p>

    </BlogPostLayout>
  )
}
