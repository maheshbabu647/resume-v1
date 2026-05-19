import { BlogPostLayout } from '../BlogPostLayout'
import blogCover from '@/assets/blog-post-1-cover.png'

const TOC = [
  { id: 'why-certifications-exist-on-a-fresher-resume', text: 'Why Certifications Exist on a Fresher Resume' },
  { id: 'the-one-thing-that-determines-whether-a-certification-matters', text: 'The One Thing That Determines Whether a Certification Matters' },
  { id: 'tier-1-high-weight-certifications-for-indian-freshers', text: 'Tier 1 — High-Weight Certifications for Indian Freshers' },
  { id: 'tier-2-useful-supplementary-certifications', text: 'Tier 2 — Useful Supplementary Certifications' },
  { id: 'tier-3-useful-for-learning-minimal-resume-weight', text: 'Tier 3 — Useful for Learning, Minimal Resume Weight' },
  { id: 'how-to-format-the-certifications-section', text: 'How to Format the Certifications Section' },
  { id: 'where-to-place-the-certifications-section-on-your-resume', text: 'Where to Place the Certifications Section on Your Resume' },
  { id: 'how-many-certifications-to-list', text: 'How Many Certifications to List' },
  { id: 'the-honest-caveat-what-certifications-cannot-do', text: 'The Honest Caveat: What Certifications Cannot Do' },
  { id: 'quick-reference-which-certification-to-pursue-first', text: 'Quick Reference: Which Certification to Pursue First' },
  { id: 'the-certifications-section-checklist', text: 'The Certifications Section Checklist' },
  { id: 'make-your-certifications-count-on-your-resume', text: 'Make Your Certifications Count on Your Resume' },
]

export default function BlogPost10() {
  return (
    <BlogPostLayout
      slug="how-to-write-certifications-resume-india-freshers-2026"
      heroImagePath={blogCover}
      tocEntries={TOC}
    >
      <blockquote>
        <p><em>Every fresher has been told: "Get certified. It helps your resume." That advice is only half true. Getting certified helps. Getting the wrong certification — or listing it badly — does almost nothing. This blog tells you which certifications carry real weight in the Indian job market in 2026, and how to present them so they actually work.</em></p>
      </blockquote>

      <hr />

      <h2 id="why-certifications-exist-on-a-fresher-resume">Why Certifications Exist on a Fresher Resume</h2>

      <p>Your degree proves you completed a course of study. Your CGPA signals how well you did academically. Your projects show what you built.</p>
      <p>Certifications do something different: they show that you went beyond what was required. That you identified a skill gap between your degree and the job market, and that you did something about it on your own time.</p>
      <p>For a recruiter reading fifty resumes, two candidates with identical degrees and similar CGPAs look the same until one of them has "AWS Cloud Practitioner — Amazon Web Services (2025)" in their Certifications section and the other has a blank space where that line would go.</p>
      <p>That's the function of certifications: they are initiative made visible. They signal that you are a candidate who doesn't wait to be taught — which is exactly what companies want from freshers who are going to spend the first few months learning on the job.</p>
      <p>But not all certifications are equal. And not all of them are worth your time. The rest of this blog explains the difference.</p>

      <hr />

      <h2 id="the-one-thing-that-determines-whether-a-certification-matters">The One Thing That Determines Whether a Certification Matters</h2>

      <p>Before you enrol in anything, understand the single most important factor in whether a certification adds value to your resume:</p>
      <p><strong>Who signed the certificate matters more than which platform hosted the course.</strong></p>
      <p>A certificate that says "Google" or "Amazon Web Services" or "Microsoft" or "IIT Madras via NPTEL" carries institutional weight. A recruiter opening your resume recognises those names immediately. The certificate is an endorsement from an organisation they trust.</p>
      <p>A certificate that says "XYZ E-Learning Portal" or "TechMaster Academy" — even if the course content was excellent — carries the weight of an organisation the recruiter has never heard of, which is approximately zero.</p>
      <p>This isn't a criticism of smaller platforms. Many of them teach genuinely useful things. But for the purposes of your resume, what registers with an ATS and a human reviewer is the issuing organisation, not the course content.</p>
      <p>For most Indian students in 2026, the certification platforms worth prioritising are Coursera for university-backed credentials, Google Career Certificates for free and employer-recognised options, and NPTEL if you want IIT-delivered content at zero cost.</p>
      <p>The practical rule: before enrolling in any paid certification, ask — "If I list this on my resume, will a recruiter recognise who issued it?" If the answer is yes, it belongs on your resume. If the answer is uncertain, think carefully before spending money on it.</p>

      <hr />

      <h2 id="tier-1-high-weight-certifications-for-indian-freshers">Tier 1 — High-Weight Certifications for Indian Freshers</h2>

      <p>These are certifications that are widely recognised by Indian and global employers, issued by organisations with verifiable credibility, and that appear frequently in JDs as either required or preferred qualifications.</p>

      <hr />

      <h3>Google Career Certificates (Coursera)</h3>
      <p><strong>Available programmes:</strong> IT Support, Data Analytics, UX Design, Project Management, Cybersecurity, Digital Marketing and E-commerce, Business Intelligence</p>
      <p><strong>Cost:</strong> Paid (around ₹3,000–4,000/month on Coursera) — Financial Aid is available on Coursera and covers the full cost if approved. Apply honestly.</p>
      <p><strong>Why they matter:</strong> Google Career Certificates have been officially recognised in India's National Skills Qualifications Framework (NSQF) by the National Council for Vocational Education and Training (NCVET) — which gives them genuine government-level recognition that most private online certificates simply don't have.</p>
      <p><strong>Which to pursue based on your goal:</strong></p>
      <ul>
        <li>Targeting data analyst roles → Google Data Analytics Certificate</li>
        <li>Targeting IT support or networking roles → Google IT Support Certificate</li>
        <li>Targeting cybersecurity → Google Cybersecurity Certificate</li>
        <li>Targeting digital marketing → Google Digital Marketing &amp; E-commerce Certificate</li>
        <li>Targeting UI/UX product roles → Google UX Design Certificate</li>
      </ul>
      <p><strong>Time to complete:</strong> 3–6 months at 5–7 hours per week (can be compressed)</p>
      <p><strong>How to list it:</strong></p>
      <div style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.8, fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }}>
        <p style={{ margin: '0 0 2px 0', fontWeight: 600 }}>Google Data Analytics Professional Certificate</p>
        <p style={{ margin: '0', color: 'var(--on-surface-variant)' }}>Google / Coursera | March 2025</p>
      </div>

      <hr />

      <h3>AWS Cloud Practitioner (Amazon Web Services)</h3>
      <p><strong>Cost:</strong> Exam fee is approximately USD 100 (around ₹8,300). Preparation through AWS Skill Builder — free courses available.</p>
      <p><strong>Why it matters:</strong> Cloud computing is now a foundational expectation across IT roles, not just infrastructure ones. The AWS Cloud Practitioner is the entry-level certification in the AWS path and is widely recognised in Indian IT companies. JDs for software developer, DevOps, data engineering, and many other roles list cloud familiarity as a requirement or preference. This certification demonstrates that familiarity with a verifiable credential from the world's largest cloud provider.</p>
      <p><strong>Who should pursue it:</strong> CSE, IT, ECE students targeting software development, cloud, DevOps, or data engineering roles.</p>
      <p><strong>How to list it:</strong></p>
      <div style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.8, fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }}>
        <p style={{ margin: '0 0 2px 0', fontWeight: 600 }}>AWS Certified Cloud Practitioner</p>
        <p style={{ margin: '0', color: 'var(--on-surface-variant)' }}>Amazon Web Services | November 2025</p>
      </div>

      <hr />

      <h3>Microsoft Certifications (Azure, Excel, Power BI)</h3>
      <p><strong>Azure Fundamentals (AZ-900):</strong> The Microsoft equivalent of AWS Cloud Practitioner. Demonstrates foundational knowledge of cloud computing on Microsoft Azure. Relevant for companies that operate on Microsoft infrastructure — common in banking, manufacturing, and enterprise IT.</p>
      <p><strong>Microsoft Excel Expert (MO-201):</strong> Highly relevant for finance, accounting, business analytics, and MBA roles. Advanced Excel — VLOOKUP, INDEX-MATCH, Power Query, PivotTables, VBA basics — is a genuine skill that separates candidates in non-technical roles. This is the certification that validates it.</p>
      <p><strong>Microsoft Power BI Data Analyst:</strong> For students targeting data analyst, business analyst, or BI roles. Power BI is one of the most widely used BI tools in Indian companies across sectors.</p>
      <p><strong>How to list them:</strong></p>
      <div style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.8, fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }}>
        <p style={{ margin: '0 0 2px 0', fontWeight: 600 }}>Microsoft Azure Fundamentals (AZ-900)</p>
        <p style={{ margin: '0 0 10px 0', color: 'var(--on-surface-variant)' }}>Microsoft | January 2026</p>
        <p style={{ margin: '0 0 2px 0', fontWeight: 600 }}>Microsoft Certified: Power BI Data Analyst Associate</p>
        <p style={{ margin: '0', color: 'var(--on-surface-variant)' }}>Microsoft | September 2025</p>
      </div>

      <hr />

      <h3>NPTEL Certifications (IITs and IISc via SWAYAM)</h3>
      <p><strong>Cost:</strong> Free to learn. A small fee (around ₹1,000–1,500) for the proctored exam that gives you the verified certificate. The certificate comes from the specific IIT or IISc that runs the course.</p>
      <p><strong>Why they matter:</strong> NPTEL courses carry UGC-recognised credit hours — they are not informal certificates. They are part of India's formal education system. A certificate from IIT Madras or IIT Bombay via NPTEL carries genuine credibility with Indian recruiters — the institutional name is one they recognise and respect. For students at tier-2 or tier-3 colleges with a budget constraint, NPTEL is among the strongest free credentials available.</p>
      <p><strong>Courses with strong resume value:</strong></p>
      <ul>
        <li>Data Science and Machine Learning (various IITs)</li>
        <li>Programming in Java (IIT Bombay)</li>
        <li>Database Management Systems (IIT Madras)</li>
        <li>Programming, Data Structures and Algorithms using Python (IIT Madras)</li>
        <li>Introduction to Internet of Things (IIT Kharagpur)</li>
        <li>Financial Statement Analysis (IIT Kharagpur — for commerce/MBA)</li>
        <li>Introduction to Machine Learning (IIT Madras)</li>
      </ul>
      <p><strong>Score matters:</strong> NPTEL certificates show a score. A score of 60% or above is generally considered passing. 75%+ is a strong result worth highlighting.</p>
      <p><strong>How to list it:</strong></p>
      <div style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.8, fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }}>
        <p style={{ margin: '0 0 2px 0', fontWeight: 600 }}>Programming, Data Structures and Algorithms using Python</p>
        <p style={{ margin: '0', color: 'var(--on-surface-variant)' }}>NPTEL — IIT Madras | Score: 76% | April 2025</p>
      </div>

      <hr />

      <h3>Meta (Facebook) Professional Certificates</h3>
      <p><strong>Available programmes:</strong> Front-End Developer, Back-End Developer, React Native, Database Engineer, Marketing Analytics</p>
      <p><strong>Platform:</strong> Coursera. Similar pricing and financial aid options to Google certificates.</p>
      <p><strong>Why they matter:</strong> Meta certificates are issued by a globally recognised technology company and are associated with widely-used technologies — React, Python, MySQL, APIs. For web and app development roles specifically, the Meta Front-End or Back-End Developer certificate is strong resume material.</p>
      <p><strong>How to list it:</strong></p>
      <div style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.8, fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }}>
        <p style={{ margin: '0 0 2px 0', fontWeight: 600 }}>Meta Front-End Developer Professional Certificate</p>
        <p style={{ margin: '0', color: 'var(--on-surface-variant)' }}>Meta / Coursera | August 2025</p>
      </div>

      <hr />

      <h3>HackerRank Certifications</h3>
      <p><strong>Cost:</strong> Free</p>
      <p><strong>Available tests:</strong> Python, Java, SQL, JavaScript, React, REST API, Problem Solving, Data Structures</p>
      <p><strong>Why they matter:</strong> HackerRank certifications are skill-test based — you pass an online test, you get the certificate. Unlike course completion certificates, they verify demonstrated performance at a skill, not just course attendance. Many Indian IT companies — including those in their application portals — accept or specifically list HackerRank certifications. The certificates come with a verifiable link.</p>
      <p><strong>Practical note:</strong> HackerRank certifications are not as weighty as AWS or Google certificates in terms of institutional recognition. But they are free, they are fast (1–2 hours per test), and they specifically verify technical skills in a way that is credible because you couldn't fake the test. They are good supplementary certifications — not replacements for the Tier 1 options above.</p>
      <p><strong>How to list it:</strong></p>
      <div style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.8, fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }}>
        <p style={{ margin: '0 0 2px 0', fontWeight: 600 }}>HackerRank Python (Basic) Certificate</p>
        <p style={{ margin: '0', color: 'var(--on-surface-variant)' }}>HackerRank | Verified | May 2025</p>
      </div>

      <hr />

      <h2 id="tier-2-useful-supplementary-certifications">Tier 2 — Useful Supplementary Certifications</h2>

      <p>These are certifications that add specific value in particular streams or for specific target roles, but carry less universal weight than Tier 1.</p>

      <hr />

      <p><strong>Cisco CCNA (Networking)</strong></p>
      <p>For students targeting networking, network support, or infrastructure roles. The gold standard in networking certifications. Requires significant preparation but is highly recognised in IT infrastructure and telecom companies.</p>

      <p><strong>Certified Financial Modeling and Valuation Analyst (FMVA) — CFI</strong></p>
      <p>For MBA Finance students. Highly relevant for financial analysis, investment banking support, and corporate finance roles. Not free, but respected in finance circles.</p>

      <p><strong>HubSpot Certifications</strong></p>
      <p>Free. For marketing, sales, and business development roles. HubSpot offers certifications in inbound marketing, content marketing, email marketing, social media, and CRM. Widely recognised in startups, digital agencies, and product companies.</p>

      <p><strong>Google Skillshop Certifications</strong></p>
      <p>Free. Google Ads Search, Google Analytics, YouTube Ads, Google My Business. Relevant for digital marketing, performance marketing, and growth roles. Fast to complete (a few hours each).</p>

      <p><strong>Tally Certified Professional</strong></p>
      <p>For B.Com and accounting students. Tally is one of the most widely used accounting software platforms in Indian SMEs. A Tally certification demonstrates practical software proficiency that many accounting roles specifically look for.</p>

      <p><strong>Infosys Springboard / TCS iON Certifications</strong></p>
      <p>Free. These are company-specific platforms that offer courses and certifications. The certifications carry reasonable weight specifically when applying to those companies, and some of the technical courses are genuinely useful.</p>

      <hr />

      <h2 id="tier-3-useful-for-learning-minimal-resume-weight">Tier 3 — Useful for Learning, Minimal Resume Weight</h2>

      <p>These platforms and courses are worth taking for skill development, but the certificates they issue carry limited weight with Indian recruiters as standalone resume credentials.</p>
      <p><strong>Udemy</strong> — Course content quality varies widely. Certifications are completion certificates rather than assessed credentials. Good for learning; low resume value unless paired with a project that demonstrates the skill.</p>
      <p><strong>LinkedIn Learning</strong> — Similar situation to Udemy. The courses are solid; the certificates are completion-based. Worth including if highly relevant to the target JD, but don't lead with them.</p>
      <p><strong>Great Learning Academy</strong> — Free courses with certificates. Useful starting points for various technical topics. Limited recruiter recognition as standalone items.</p>
      <p><strong>YouTube tutorials</strong> — Do not list these. Watching a tutorial is not a certification.</p>
      <p>The honest rule about Tier 3: do the courses if they help you build the skill. Build a project that demonstrates the skill. Then list the project. The project carries more weight than the completion certificate from a platform without strong brand recognition.</p>

      <hr />

      <h2 id="how-to-format-the-certifications-section">How to Format the Certifications Section</h2>

      <p>The format is simpler than most other sections, but the details still matter.</p>
      <p><strong>Standard format for each entry:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', whiteSpace: 'pre-wrap', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}><code>{`Certification Name — Issuing Organisation | Month Year`}</code></pre>
      <p>Or if you want to include a verification link or score:</p>
      <div style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.8, fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }}>
        <p style={{ margin: '0 0 2px 0', fontWeight: 600 }}>Certification Name</p>
        <p style={{ margin: '2px 0', color: 'var(--on-surface-variant)' }}>Issuing Organisation | Month Year | Score: X% (for NPTEL)</p>
        <p style={{ margin: '2px 0 0 0', color: 'var(--on-surface-variant)' }}>Credential ID: XXXXXXXX (if verifiable online)</p>
      </div>
      <p><strong>Full section example:</strong></p>
      <div style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.8, fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }}>
        <p style={{ margin: '0 0 12px 0', fontWeight: 700, letterSpacing: '0.06em' }}>CERTIFICATIONS</p>
        <p style={{ margin: '0 0 2px 0', fontWeight: 600 }}>AWS Certified Cloud Practitioner</p>
        <p style={{ margin: '0 0 10px 0', color: 'var(--on-surface-variant)' }}>Amazon Web Services | November 2025</p>
        <p style={{ margin: '0 0 2px 0', fontWeight: 600 }}>Google Data Analytics Professional Certificate</p>
        <p style={{ margin: '0 0 10px 0', color: 'var(--on-surface-variant)' }}>Google / Coursera | July 2025</p>
        <p style={{ margin: '0 0 2px 0', fontWeight: 600 }}>Programming, Data Structures and Algorithms using Python</p>
        <p style={{ margin: '0 0 10px 0', color: 'var(--on-surface-variant)' }}>NPTEL — IIT Madras | Score: 78% | April 2025</p>
        <p style={{ margin: '0 0 2px 0', fontWeight: 600 }}>HackerRank Python (Basic) Certificate</p>
        <p style={{ margin: '0', color: 'var(--on-surface-variant)' }}>HackerRank | Verified | January 2025</p>
      </div>

      <hr />

      <h3>The Formatting Rules</h3>
      <p><strong>Use the official certification name exactly.</strong> The full, official name is what the ATS searches for. "AWS Cloud Practitioner" will match a JD that says "AWS Cloud Practitioner Essentials." A shortened or informal name may not.</p>
      <p><strong>Include the issuing organisation separately from the platform.</strong> "Google / Coursera" is better than just "Coursera" because the issuing organisation (Google) is what carries the weight. The platform (Coursera) is the delivery mechanism.</p>
      <p><strong>Include the month and year.</strong> Some ATS systems filter for recency. A certification from 2022 may be flagged as stale by systems that prefer recent credentials. Always include the date so the recruiter and ATS can assess recency.</p>
      <p><strong>Include score for NPTEL.</strong> NPTEL certificates come with a score, and recruiters who are familiar with NPTEL know that the score matters. A 76% score is credible evidence of passing an IIT-administered exam.</p>
      <p><strong>Include credential IDs or verification links when available.</strong> AWS, Google, and HackerRank all provide verifiable credential links. Including the Credential ID (or a shortened verification URL) signals that your certificate is real and publicly verifiable. This is a minor but meaningful trust signal.</p>
      <p><strong>Do not list certifications in progress as completed.</strong> If you are currently working toward a certification, you can include it with honest framing: "AWS Cloud Practitioner (Expected: June 2026)." Do not list it without that qualifier as if it's already done.</p>

      <hr />

      <h2 id="where-to-place-the-certifications-section-on-your-resume">Where to Place the Certifications Section on Your Resume</h2>

      <p>The placement depends on how relevant your certifications are to the role you are applying for.</p>
      <p><strong>If your certifications are highly relevant to the target JD</strong> — for example, you have an AWS certificate and you're applying for a cloud or DevOps role — place the Certifications section immediately after Education and before or alongside Skills. You want the recruiter to see it early.</p>
      <p><strong>If your certifications are supplementary to stronger sections</strong> (strong projects and skills) — place Certifications after Skills and Projects. It adds weight to what's already there but doesn't need to lead.</p>
      <p><strong>For most fresher resumes:</strong> The standard order works well — Education → Skills → Projects → Certifications → Extracurriculars. This puts your academic qualification and hard skills first (the ATS and recruiter's primary checks), followed by work evidence (projects), followed by additional credentials (certifications).</p>

      <hr />

      <h2 id="how-many-certifications-to-list">How Many Certifications to List</h2>

      <p><strong>2 to 4 is the right range for most freshers.</strong></p>
      <p>Below 2 — a single certification looks like a minimum effort. Above 4 — the section starts to look padded, especially if the later entries are from unrecognised platforms. A recruiter who sees 8 certifications from platforms they don't recognise may be less impressed than one who sees 3 certifications from Google, AWS, and NPTEL.</p>
      <p>Quality over quantity. Three strong, recognisable certifications from credible issuers are worth more than ten course completion badges from online platforms.</p>

      <hr />

      <h2 id="the-honest-caveat-what-certifications-cannot-do">The Honest Caveat: What Certifications Cannot Do</h2>

      <p>One thing worth saying clearly: no certificate fixes a resume with nothing else on it. The students who get hired fastest are the ones who pair a recognised certificate with something they actually built — a project, a GitHub repo, an internship, a freelance job.</p>
      <p>A certification shows that you completed a course. It does not, by itself, prove that you can apply the knowledge on the job. Recruiters and interviewers know this. The Google Data Analytics certificate means you went through Google's curriculum — which is genuinely useful foundational training. It does not mean you're a practising data analyst.</p>
      <p>What closes that gap: a project. A data analysis project where you applied the skills from the certification. A GitHub repository showing your code. A portfolio piece that makes the abstract credential concrete.</p>
      <p>The certification opens the door. The project substantiates what's behind it.</p>
      <p>Build both. In that order.</p>

      <hr />

      <h2 id="quick-reference-which-certification-to-pursue-first">Quick Reference: Which Certification to Pursue First</h2>

      <p>Use this as a starting point based on your stream and target role. These are suggestions, not prescriptions — always check the JDs you're targeting to see what they specifically ask for.</p>

      <div style={{ overflowX: 'auto', marginBottom: 'var(--space-6)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ background: 'var(--surface-container-high)', textAlign: 'left' }}>
              <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--on-surface)', borderBottom: '2px solid var(--outline-variant)' }}>Stream / Target</th>
              <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--on-surface)', borderBottom: '2px solid var(--outline-variant)' }}>First Certification to Pursue</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['CSE → Software Developer', 'HackerRank Java or Python (free, fast), then AWS Cloud Practitioner'],
              ['CSE → Data Analyst', 'Google Data Analytics (Coursera)'],
              ['CSE → Full Stack / Web', 'Meta Front-End or Back-End Developer (Coursera)'],
              ['CSE → DevOps / Cloud', 'AWS Cloud Practitioner or Azure Fundamentals'],
              ['ECE → IT Pivot', 'Google IT Support (Coursera)'],
              ['ECE → Embedded / Core', 'NPTEL — Embedded Systems or IoT (IIT Kharagpur)'],
              ['Mechanical → Core', 'NPTEL — CAD/CAM or Thermodynamics (IIT Bombay)'],
              ['Civil', 'NPTEL — Structural Analysis or AutoCAD (IIT specific)'],
              ['MBA → Marketing', 'Google Digital Marketing & E-commerce (Coursera) or HubSpot Inbound Marketing (free)'],
              ['MBA → Finance', 'Microsoft Excel Expert or CFI FMVA (paid)'],
              ['MBA → HR', 'NPTEL — HR Analytics or Infosys Springboard HR courses'],
              ['B.Com / Accounts', 'Tally Certified Professional or Microsoft Excel Expert'],
              ['BCA / BSc CS', 'Google IT Support or HackerRank Python (free starting point)'],
            ].map(([stream, cert], i) => (
              <tr key={stream} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface-container-low)' }}>
                <td style={{ padding: '9px 14px', color: 'var(--on-surface)', fontWeight: 600, borderBottom: '1px solid var(--outline-variant)' }}>{stream}</td>
                <td style={{ padding: '9px 14px', color: 'var(--on-surface-variant)', borderBottom: '1px solid var(--outline-variant)' }}>{cert}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr />

      <h2 id="the-certifications-section-checklist">The Certifications Section Checklist</h2>

      <div style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.8, fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }}>
        <p style={{ margin: '0 0 6px 0', fontWeight: 700, letterSpacing: '0.06em' }}>CONTENT</p>
        <p style={{ margin: '3px 0' }}>□ 2–4 certifications listed — quality over quantity</p>
        <p style={{ margin: '3px 0' }}>□ Every certification is from a recognisable issuing organisation (not just the platform name)</p>
        <p style={{ margin: '3px 0' }}>□ No certifications listed that were not completed (in-progress labelled honestly as "Expected: Month Year")</p>
        <p style={{ margin: '3px 0' }}>□ No YouTube tutorials or informal learning listed as certifications</p>

        <p style={{ margin: '16px 0 6px 0', fontWeight: 700, letterSpacing: '0.06em' }}>FORMAT</p>
        <p style={{ margin: '3px 0' }}>□ Official certification name used exactly</p>
        <p style={{ margin: '3px 0' }}>□ Issuing organisation included (separate from platform where relevant — e.g. "Google / Coursera" not just "Coursera")</p>
        <p style={{ margin: '3px 0' }}>□ Month and year of completion included for every entry</p>
        <p style={{ margin: '3px 0' }}>□ NPTEL score included</p>
        <p style={{ margin: '3px 0' }}>□ Credential ID or verification link included where available</p>
        <p style={{ margin: '3px 0' }}>□ Section heading is "CERTIFICATIONS" (standard ATS heading)</p>
        <p style={{ margin: '3px 0' }}>□ Plain text — no icons, no logos, no graphic elements</p>

        <p style={{ margin: '16px 0 6px 0', fontWeight: 700, letterSpacing: '0.06em' }}>ATS</p>
        <p style={{ margin: '3px 0' }}>□ Certification names match terms that appear in target JDs where applicable</p>
        <p style={{ margin: '3px 0' }}>□ Full certification name (not shorthand) used for better keyword matching</p>
        <p style={{ margin: '3px 0' }}>□ Section is in the main document body, not a sidebar</p>

        <p style={{ margin: '16px 0 6px 0', fontWeight: 700, letterSpacing: '0.06em' }}>PLACEMENT</p>
        <p style={{ margin: '3px 0' }}>□ Placed after Education and Skills for standard profile</p>
        <p style={{ margin: '3px 0 0 0' }}>□ Moved higher if certifications are the strongest signal of relevance for the target role</p>
      </div>

      <hr />

      <h2 id="make-your-certifications-count-on-your-resume">Make Your Certifications Count on Your Resume</h2>

      <p>CareerForge.pro's resume builder gives you a dedicated Certifications section that formats each entry correctly — official name, issuing organisation, date, and credential ID — in plain text that ATS systems can read cleanly.</p>
      <p>After adding your certifications, run your resume through the CareerForge JD Score tool to verify that your certification names are registering as keyword matches against the role you're applying for.</p>

      <p><strong><a href="/templates">Build Your Resume on CareerForge.pro →</a></strong></p>

      <hr />

      <p>
        <strong>Read next:</strong>{' '}
        <a href="/blog/how-to-write-a-resume-with-no-experience-india-freshers-2026">Blog 11: How to Write a Resume With No Experience or Internship as an Indian Fresher →</a>
      </p>

    </BlogPostLayout>
  )
}
