import { BlogPostLayout } from '../BlogPostLayout'
import blogCover from '@/assets/blog-post-1-cover.png'

const TOC = [
  { id: 'why-the-first-word-of-every-bullet-matters', text: 'Why the First Word of Every Bullet Matters' },
  { id: 'the-four-rules-for-using-action-verbs-well', text: 'The Four Rules for Using Action Verbs Well' },
  { id: 'the-100-verbs-organised-by-function', text: 'The 100 Verbs — Organised by Function' },
  { id: 'the-verbs-to-remove-from-your-resume-right-now', text: 'The Verbs to Remove From Your Resume Right Now' },
  { id: 'before-and-after-five-full-bullet-transformations', text: 'Before and After: Five Full Bullet Transformations' },
  { id: 'the-verb-variety-rule', text: 'The Verb Variety Rule' },
  { id: 'one-final-point-verbs-don-t-substitute-for-outcomes', text: "One Final Point: Verbs Don't Substitute for Outcomes" },
  { id: 'your-action-verb-quick-reference-card', text: 'Your Action Verb Quick-Reference Card' },
  { id: 'write-stronger-bullets-with-careerforge', text: 'Write Stronger Bullets With CareerForge' },
]

export default function BlogPost12() {
  return (
    <BlogPostLayout
      slug="blog-12-resume-action-verbs-india-freshers-2026"
      heroImagePath={blogCover}
      tocEntries={TOC}
    >
      <blockquote>
        <p><em>The difference between a resume bullet that gets read and one that gets skipped is often a single word. "Worked on a web application" tells a recruiter nothing. "Built a full-stack web application" tells them something. "Developed and deployed a full-stack web application serving 500+ test users" tells them everything. The first word of every bullet is where that difference starts.</em></p>
      </blockquote>

      <hr />

      <h2 id="why-the-first-word-of-every-bullet-matters">Why the First Word of Every Bullet Matters</h2>

      <p>When a recruiter scans your resume in a few seconds, their eye moves in a pattern — they read the first word or two of each bullet, then decide whether the line is worth their full attention.</p>
      <p>If that first word is weak — "worked," "helped," "assisted," "did," "was responsible for" — the bullet reads like background noise. There is no action. There is no agency. There is no signal of what you specifically contributed.</p>
      <p>If that first word is a precise action verb — "Built," "Designed," "Developed," "Deployed," "Analysed," "Led" — the bullet opens with a claim of ownership. It says: I did this. I made this happen. This was mine.</p>
      <p>That difference in tone is not cosmetic. It changes how the recruiter perceives your capability, your confidence, and your relevance to the role. And it costs nothing to fix.</p>
      <p>This blog gives you 100 carefully chosen action verbs organised by the type of work they describe, explains how to use them correctly, and shows you before-and-after transformations that demonstrate exactly what changes.</p>

      <hr />

      <h2 id="the-four-rules-for-using-action-verbs-well">The Four Rules for Using Action Verbs Well</h2>

      <p>Before the word list, understand how to use these words in a way that actually works.</p>

      <hr />

      <p><strong>Rule 1 — Every bullet starts with a verb. No exceptions.</strong></p>
      <p>Not "I developed..." (the "I" is understood and unnecessary)</p>
      <p>Not "Was responsible for developing..." (passive, verbose)</p>
      <p>Not "My role involved developing..." (wordy, no ownership)</p>
      <p>Just: "Developed..."</p>
      <p>Every single bullet on your resume — in Projects, Extracurriculars, Internships, even Education achievements — starts with a verb.</p>

      <hr />

      <p><strong>Rule 2 — Use the right tense.</strong></p>
      <p>For completed projects, past internships, and finished work: past tense.</p>
      <p>"Developed," "Built," "Designed," "Led," "Deployed"</p>
      <p>For ongoing roles (current college position, ongoing project): present tense.</p>
      <p>"Developing," "Managing," "Leading"</p>
      <p>For the Projects section specifically: past tense is standard, because the project was built, even if it was recent.</p>

      <hr />

      <p><strong>Rule 3 — Don't repeat the same verb more than twice on the entire resume.</strong></p>
      <p>If four of your bullets start with "Developed" — the resume reads as lazy. Recruiters notice. It also suggests you don't have enough range to describe your work with precision.</p>
      <p>This list gives you alternatives. When you've used "Developed" once, use "Built," then "Implemented," then "Engineered." They're not identical — choose the one that most accurately describes what you did.</p>

      <hr />

      <p><strong>Rule 4 — The verb must be accurate.</strong></p>
      <p>"Led a team" when you were the team member, not the leader — is an exaggeration that falls apart in an interview.</p>
      <p>"Orchestrated" a small college event — is probably overselling it.</p>
      <p>Use verbs that accurately reflect your level of involvement. "Contributed to," "Assisted in," and "Supported" are legitimate verbs when they're true. They are not weak — they are honest. What makes them weak is when they're the only verbs on the resume, applied to everything.</p>
      <p>Match the verb to the reality of what you did. Then describe that reality in full.</p>

      <hr />

      <h2 id="the-100-verbs-organised-by-function">The 100 Verbs — Organised by Function</h2>

      <hr />

      <h3>Category 1 — Building and Creating (Technical Work)</h3>
      <p>Use these for your Projects section and any technical work you describe. These are the verbs that signal you made something — not just that you were present while it was made.</p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>{`Built          Developed       Designed        Engineered
Implemented    Programmed      Coded           Constructed
Created        Produced        Assembled       Crafted
Prototyped     Architected     Deployed        Launched
Configured     Established     Integrated      Migrated`}</code></pre>
      <p><strong>Before:</strong> "Worked on a web application for college project"</p>
      <p><strong>After:</strong> "Built a full-stack web application using React.js and Node.js with real-time notifications and JWT-based user authentication"</p>
      <p><strong>Before:</strong> "Made an ML model"</p>
      <p><strong>After:</strong> "Developed a sentiment analysis model using Python and Scikit-learn achieving 83% classification accuracy on a 50,000-record test dataset"</p>

      <hr />

      <h3>Category 2 — Improving and Optimising</h3>
      <p>Use these when you made something faster, smaller, more accurate, more efficient, or more reliable. These verbs signal engineering judgement — the ability to look at something and make it better.</p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>{`Optimised      Improved        Enhanced        Refined
Streamlined    Upgraded        Accelerated     Boosted
Reduced        Minimised       Eliminated      Resolved
Fixed          Debugged        Patched         Tuned
Restructured   Refactored      Overhauled      Modernised`}</code></pre>
      <p><strong>Before:</strong> "Fixed bugs in the code"</p>
      <p><strong>After:</strong> "Debugged a critical memory leak in the Node.js backend that was causing application crashes under concurrent load, reducing error rate from 12% to under 1%"</p>
      <p><strong>Before:</strong> "Made the website faster"</p>
      <p><strong>After:</strong> "Optimised page load time from 4.3 seconds to 1.1 seconds through lazy loading, image compression, and CSS minification"</p>

      <hr />

      <h3>Category 3 — Analysing and Researching</h3>
      <p>Use these in project bullets involving data, research, testing, or investigation. These verbs are especially useful for data science, business analysis, research projects, and MBA case studies.</p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>{`Analysed       Evaluated       Assessed        Investigated
Examined       Researched      Studied         Measured
Diagnosed      Identified      Discovered      Mapped
Compared       Benchmarked     Tested          Validated
Modelled       Forecasted      Simulated       Interpreted`}</code></pre>
      <p><strong>Before:</strong> "Looked at sales data and found some patterns"</p>
      <p><strong>After:</strong> "Analysed 3 years of retail sales data (50,000+ records) using Python and Pandas; identified a seasonal demand spike of 40% in Q4 driven by two product categories"</p>
      <p><strong>Before:</strong> "Did market research for MBA project"</p>
      <p><strong>After:</strong> "Researched consumer purchase behaviour across 200 respondents using structured surveys; identified price sensitivity as the primary driver for Tier 2 city consumers through chi-square analysis in SPSS"</p>

      <hr />

      <h3>Category 4 — Leading and Managing</h3>
      <p>Use these for extracurricular leadership roles, hackathon team experiences, project coordination, and any situation where you directed other people or managed a process.</p>
      <p>A caution: only use leadership verbs if you were genuinely in a leadership position. "Led" when you were a team member, not a lead, will surface in interviews.</p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>{`Led            Managed         Coordinated     Directed
Supervised     Organised       Oversaw         Guided
Spearheaded    Headed          Chaired         Facilitated
Mentored       Coached         Delegated       Motivated
Initiated      Founded         Established     Mobilised`}</code></pre>
      <p><strong>Before:</strong> "Was part of the student club and organised events"</p>
      <p><strong>After:</strong> "Led a 14-member technical club as IEEE Chapter Coordinator; organised 5 workshops attended by 180+ students across web development, machine learning, and cybersecurity themes"</p>
      <p><strong>Before:</strong> "Helped organise the college fest"</p>
      <p><strong>After:</strong> "Coordinated the technical events division of an intercollegiate fest with 12 participating colleges and 300+ registered participants; managed a 6-member sub-committee across 8 weeks of planning"</p>

      <hr />

      <h3>Category 5 — Communicating and Presenting</h3>
      <p>Use these for presentations, reports, documentation, content, and any communication-heavy deliverable. These are especially useful for MBA freshers, marketing candidates, and non-technical roles.</p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>{`Presented      Communicated    Documented      Reported
Authored       Drafted         Published       Wrote
Articulated    Delivered       Pitched         Proposed
Advised        Consulted       Briefed         Informed
Demonstrated   Illustrated     Clarified       Explained`}</code></pre>
      <p><strong>Before:</strong> "Made a report for the marketing project"</p>
      <p><strong>After:</strong> "Authored a 24-page consumer behaviour research report with statistical analysis and visual dashboards; presented findings to a 3-member industry mentor panel who adopted two recommendations into the company's Q3 strategy"</p>
      <p><strong>Before:</strong> "Helped with college newsletter"</p>
      <p><strong>After:</strong> "Drafted and published 8 issues of the college technical newsletter across an academic year, growing readership from 60 to 220 subscribers through targeted content and WhatsApp distribution"</p>

      <hr />

      <h3>Category 6 — Designing and Modelling</h3>
      <p>Use these for design projects in mechanical, civil, electrical engineering, UI/UX work, and architectural or structural work. These verbs convey technical precision and intentional decision-making.</p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>{`Designed       Modelled        Simulated       Sketched
Drafted        Rendered        Prototyped      Fabricated
Illustrated    Specified       Planned         Calculated
Computed       Schematised     Mapped          Diagrammed`}</code></pre>
      <p><strong>Before:</strong> "Made AutoCAD drawings for the heat exchanger"</p>
      <p><strong>After:</strong> "Designed a shell-and-tube heat exchanger in AutoCAD to specified thermal parameters (45 kW heat transfer rate); validated design performance using ANSYS CFD simulation achieving 82% thermal efficiency"</p>

      <hr />

      <h3>Category 7 — Testing and Verifying</h3>
      <p>Use these for quality assurance, testing, validation, and verification work. Particularly useful for software testing roles, research validation, and any project where you confirmed that something worked.</p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>{`Tested         Verified        Validated       Assessed
Audited        Reviewed        Inspected       Monitored
Tracked        Measured        Evaluated       Checked
Profiled       Diagnosed       Benchmarked     Surveyed`}</code></pre>
      <p><strong>Before:</strong> "Did testing for the application"</p>
      <p><strong>After:</strong> "Tested API endpoints using Postman across 40+ test cases covering edge cases, invalid inputs, and concurrent requests; documented all failures and retested post-fix with zero remaining critical issues"</p>

      <hr />

      <h3>Category 8 — Integrating and Connecting</h3>
      <p>Use these for work involving APIs, third-party services, databases, microservices, hardware integration, or any situation where you connected different systems together.</p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>{`Integrated     Connected       Linked          Merged
Synchronised   Unified         Combined        Interfaced
Bridged        Embedded        Wired           Configured
Coupled        Federated       Orchestrated`}</code></pre>
      <p><strong>Before:</strong> "Added payment gateway to the project"</p>
      <p><strong>After:</strong> "Integrated Razorpay payment gateway into the checkout flow using webhook verification and idempotency keys; handled edge cases for failed transactions and duplicate payment prevention"</p>

      <hr />

      <h2 id="the-verbs-to-remove-from-your-resume-right-now">The Verbs to Remove From Your Resume Right Now</h2>

      <p>Just as important as knowing what to use is knowing what to stop using.</p>
      <p><strong>"Worked on"</strong> — The most common weak phrase on Indian fresher resumes. "Worked on a library management system" says only that you were nearby while something existed. Replace with: Built, Developed, Designed, Implemented.</p>
      <p><strong>"Was responsible for"</strong> — Passive and verbose. Three words that add nothing. Replace with a single action verb: "Managed," "Led," "Developed," "Maintained."</p>
      <p><strong>"Helped with"</strong> — If you genuinely assisted someone else's primary work: "Assisted in," "Supported," or "Contributed to" is more professional. If you did the primary work yourself: replace with the verb that describes what you actually did.</p>
      <p><strong>"Did"</strong> — "Did analysis," "Did testing," "Did research." These are placeholders. Replace with: "Conducted," "Performed," "Executed," "Ran."</p>
      <p><strong>"Participated in"</strong> — For hackathons and events, this says only that you attended. Replace with what you actually built or contributed: "Built," "Designed," "Presented," "Developed."</p>
      <p><strong>"Was involved in"</strong> — Similar to "participated in." Vague, passive, imprecise. Replace with the specific verb that describes your involvement.</p>
      <p><strong>"Utilized"</strong> — An inflated substitute for "Used." Just say "Used" — or better, choose a verb that describes what you did with the tool: "Deployed Python scripts to...," "Implemented MySQL for...," "Leveraged AWS EC2 to..."</p>

      <hr />

      <h2 id="before-and-after-five-full-bullet-transformations">Before and After: Five Full Bullet Transformations</h2>

      <hr />

      <p><strong>Transformation 1 — Software project bullet</strong></p>
      <blockquote><p>Before: Worked on building an e-commerce website with my team using React and Node</p></blockquote>
      <blockquote><p>After: Developed a full-stack e-commerce platform using React.js, Node.js, and MongoDB with product cataloguing, cart management, and Razorpay payment integration; deployed on AWS EC2 serving 500+ test users</p></blockquote>

      <hr />

      <p><strong>Transformation 2 — Data/ML project bullet</strong></p>
      <blockquote><p>Before: Was responsible for the machine learning part of the project</p></blockquote>
      <blockquote><p>After: Built and trained a Random Forest classifier using Scikit-learn on a 20,000-record imbalanced dataset; applied SMOTE for class balancing and achieved 88% F1-score on the held-out test set</p></blockquote>

      <hr />

      <p><strong>Transformation 3 — Leadership/extracurricular bullet</strong></p>
      <blockquote><p>Before: Participated in Smart India Hackathon and we made a project</p></blockquote>
      <blockquote><p>After: Developed an IoT-based water quality monitoring prototype with a team of 6 during SIH 2025; engineered the sensor data pipeline using MQTT and Raspberry Pi, reaching state-level finals out of 200+ teams</p></blockquote>

      <hr />

      <p><strong>Transformation 4 — MBA / non-technical project bullet</strong></p>
      <blockquote><p>Before: Did market research on FMCG sector for our MBA project</p></blockquote>
      <blockquote><p>After: Conducted primary market research across 200 respondents in Andhra Pradesh and Telangana using Google Forms; analysed purchase behaviour patterns using chi-square tests in SPSS and identified 3 actionable pricing insights presented to an industry mentor panel</p></blockquote>

      <hr />

      <p><strong>Transformation 5 — NSS/club bullet</strong></p>
      <blockquote><p>Before: Was part of NSS for two years and attended camps</p></blockquote>
      <blockquote><p>After: Contributed 250+ hours as NSS volunteer across rural literacy initiatives, health awareness camps, and tree plantation drives in 3 villages in Ranga Reddy district over two academic years; co-organised a blood donation camp collecting 120+ units</p></blockquote>

      <hr />

      <h2 id="the-verb-variety-rule">The Verb Variety Rule</h2>

      <p>Recruiters read many resumes. A resume where every bullet starts with the same three verbs — "Led," "Developed," "Managed" — reads as formulaic and uncreative.</p>
      <p>Vary your verbs across the resume. Use the 100-word list to find the most precise verb for each specific action, then check that you haven't used that same verb more than twice.</p>
      <p>A simple way to check: paste your resume into a word processor, use Find &amp; Replace to count how many times each verb appears. If any single verb appears four or more times, replace the excess instances with more specific alternatives from the list.</p>
      <p>Precision is the goal. "Built" and "Developed" are not synonyms — "built" suggests a more complete, hands-on construction, while "developed" is broader and can include architectural planning and incremental iteration. "Optimised" is not the same as "Improved" — "optimised" implies a technical or systematic approach to improvement, while "improved" is more general. Choose the verb that most accurately describes what you did.</p>

      <hr />

      <h2 id="one-final-point-verbs-don-t-substitute-for-outcomes">One Final Point: Verbs Don't Substitute for Outcomes</h2>

      <p>Action verbs make your bullets start well. They do not, on their own, make your bullets end well.</p>
      <p>"Developed a web application" starts strong. But it still tells the recruiter nothing about scale, impact, or what the application actually does.</p>
      <p>"Developed a web application for student attendance management handling 200+ students with automated email alerts, deployed on a college server" — now the recruiter has a complete picture.</p>
      <p>The verb opens the bullet. The outcome closes it. Every bullet needs both.</p>
      <p>Start with the verb on this list that most accurately describes your action. Then describe what you did with enough specificity that a recruiter who has never seen your project can understand it in ten seconds.</p>

      <hr />

      <h2 id="your-action-verb-quick-reference-card">Your Action Verb Quick-Reference Card</h2>

      <p>Print this or save it. Check it every time you write a bullet.</p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>{`BUILDING THINGS
Built | Developed | Designed | Implemented | Deployed
Engineered | Constructed | Programmed | Launched | Created

IMPROVING THINGS
Optimised | Improved | Refactored | Reduced | Resolved
Debugged | Streamlined | Enhanced | Upgraded | Accelerated

ANALYSING THINGS
Analysed | Evaluated | Assessed | Researched | Identified
Modelled | Tested | Validated | Benchmarked | Forecasted

LEADING PEOPLE
Led | Coordinated | Managed | Organised | Facilitated
Spearheaded | Directed | Mentored | Initiated | Founded

COMMUNICATING
Presented | Documented | Authored | Drafted | Delivered
Proposed | Demonstrated | Briefed | Clarified | Reported

DESIGNING
Designed | Modelled | Simulated | Drafted | Calculated
Prototyped | Illustrated | Rendered | Specified | Mapped

TESTING
Tested | Verified | Validated | Audited | Monitored
Profiled | Inspected | Benchmarked | Diagnosed | Reviewed

INTEGRATING
Integrated | Connected | Configured | Synchronised | Merged
Interfaced | Embedded | Bridged | Orchestrated | Federated

VERBS TO DELETE
❌ Worked on | Was responsible for | Helped with
❌ Did | Participated in | Was involved in | Utilized`}</code></pre>

      <hr />

      <h2 id="write-stronger-bullets-with-careerforge">Write Stronger Bullets With CareerForge</h2>

      <p>CareerForge.pro's <strong>AI Bullet Point Writer</strong> uses action verbs and the what-how-outcome structure to help you write project and experience bullets that read professionally — without spending an hour staring at a blank page.</p>
      <p>Paste in what you did. The tool shapes it into clean, keyword-rich, verb-led bullet points ready to paste into your resume.</p>
      <p><strong><a href="/templates">Try the AI Bullet Writer on CareerForge.pro →</a></strong></p>

      <hr />

      <p>
        <strong>Read next:</strong>{' '}
        <a href="/blog/resume-format-cse-it-freshers-india-2026">Blog 13: Resume Format for CSE/IT Freshers in India — 2026 ATS-Ready Template →</a>
      </p>

    </BlogPostLayout>
  )
}
