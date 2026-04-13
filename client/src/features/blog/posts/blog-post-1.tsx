import { BlogPostLayout } from '../BlogPostLayout'
import blogCover from '@/assets/blog-post-1-cover.png'

// TOC entries — must match the id="" on h2 elements below
const TOC = [
  { id: 'what-is-ats', text: '1. What Exactly is ATS?' },
  { id: 'which-companies', text: '2. Which Indian Companies Use ATS?' },
  { id: 'the-truth', text: '3. The “75% Rejection” Myth' },
  { id: 'five-reasons', text: '4. The 5 Reasons Resumes Fail ATS' },
  { id: 'what-it-looks-like', text: '5. What an ATS-Passing Resume Looks Like' },
  { id: 'score-benchmark', text: '6. The Score You Need to Aim For' },
  { id: 'real-problem', text: '7. The Real Problem Is Competition' },
  { id: 'five-min-check', text: '8. A 5-Minute ATS Check' },
  { id: 'human-review', text: '9. After ATS: The Human Review' },
  { id: 'two-documents', text: '10. The Two Documents You’re Writing' },
  { id: 'bottom-line', text: '11. The Bottom Line' },
  { id: 'keep-learning', text: '12. Keep Learning' },
]

export default function BlogPost1() {
  return (
    <BlogPostLayout
      slug="why-indian-fresher-resumes-are-invisible-to-ats-2026"
      heroImagePath={blogCover}
      tocEntries={TOC}
    >

      <blockquote>
        <p><em>"I applied to 80 companies. I heard back from 2."</em></p>
        <p>If this sounds like you — it's not your fault. And it's probably not your skills either.</p>
      </blockquote>

      <hr />

      <h2 id="what-is-ats">1. So, What Exactly is ATS?</h2>
      <p>
        Picture this. It's 11 PM. You've just finished writing your resume — the one you spent four days
        on. You picked a beautiful two-column template from Canva. You added your photo in the top
        corner. You even used a colour-coded skills section with progress bars.
      </p>
      <p>
        You upload it to TCS's career portal and hit <strong>Apply.</strong> You feel good.
      </p>
      <p>
        What happens next? Nothing. Silence. No email. No call. Not even an automated rejection. You
        wait a week. Still nothing. You start wondering — <em>am I not good enough?</em>
      </p>
      <p>Here's the truth nobody told you:</p>
      <p><strong>Your resume never reached a human being.</strong></p>
      <p>
        It was filtered out in seconds — by software. Not a recruiter. Not a hiring manager. Software.
        That software has a name: an <strong>Applicant Tracking System</strong>, or ATS. And until you
        understand what it is and how it works, you will keep hitting the same invisible wall.
      </p>

      <p>
        An <strong>Applicant Tracking System (ATS)</strong> is software that companies use to manage the
        avalanche of job applications they receive. Think about the scale: when TCS opens a fresher
        recruitment drive, they receive tens of thousands of applications — sometimes 10,000+ for a
        single batch. Here's what the system does:
      </p>
      <ol>
        <li>
          <strong>Parse.</strong> The ATS converts your uploaded resume into raw text. It strips away
          your formatting, fonts, and two-column design. It sees only the words underneath.
        </li>
        <li>
          <strong>Extract.</strong> It identifies your sections — name, contact, education, skills,
          experience, projects. If your resume has non-standard sections or unusual formatting, the
          parser gets confused and misreads or skips sections entirely.
        </li>
        <li>
          <strong>Match.</strong> The system compares your content against the job description, looking
          for specific keywords — skills, technologies, certifications, job titles.
        </li>
        <li>
          <strong>Score and Rank.</strong> Every resume gets a score based on how well it matches the
          JD. Recruiters see the top 20, not 10,000. If your score is low, you don't appear on the
          shortlist. The recruiter never sees you.
        </li>
      </ol>

      <hr />

      <h2 id="which-companies">2. Which Indian Companies Use ATS?</h2>
      <p>Almost every company of any significant size in India uses some form of ATS:</p>

      <div style={{ overflowX: 'auto', marginBottom: 'var(--space-6)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ background: 'var(--surface-container-high)', textAlign: 'left' }}>
              <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--on-surface)', borderBottom: '2px solid var(--outline-variant)' }}>Company</th>
              <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--on-surface)', borderBottom: '2px solid var(--outline-variant)' }}>ATS Platform Used</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['TCS', 'iON (proprietary) + third-party ATS for corporate roles'],
              ['Infosys', 'Taleo / iSmartRecruit'],
              ['Wipro', 'Workday'],
              ['HCL Technologies', 'iCIMS / Workday'],
              ['Accenture', 'Taleo'],
              ['Cognizant', 'Taleo'],
              ['Capgemini', 'SAP SuccessFactors'],
              ['Amazon India', 'Greenhouse'],
              ['Startups + mid-size', 'Naukri RMS, Freshteam, Zoho Recruit'],
            ].map(([company, ats], i) => (
              <tr key={company} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface-container-low)' }}>
                <td style={{ padding: '9px 14px', color: 'var(--on-surface)', fontWeight: 600, borderBottom: '1px solid var(--outline-variant)' }}>{company}</td>
                <td style={{ padding: '9px 14px', color: 'var(--on-surface-variant)', borderBottom: '1px solid var(--outline-variant)' }}>{ats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        When you apply through <strong>Naukri.com</strong>, the portal itself runs your resume through
        its own ATS called <strong>RChilli</strong> before a recruiter even opens the dashboard. Your
        profile gets ranked against other candidates before any human interaction.
      </p>
      <blockquote>
        <p>
          <strong>Bottom line:</strong> If you're applying to any company with a career portal or via
          Naukri, your resume goes through ATS. Every time.
        </p>
      </blockquote>

      <hr />

      <h2 id="the-truth">3. The "75% Rejection" Myth — And the Truth That's Actually Worse</h2>
      <p>
        You may have seen this statistic online: <em>"75% of resumes are rejected by ATS before a human
        sees them."</em>
      </p>
      <p>
        Full transparency — this statistic has been traced back to a now-defunct company called Preptel,
        which made it up in 2012 to sell resume services. There's no verified research behind it.
      </p>
      <p><strong>But here is the reality, which is arguably worse:</strong></p>
      <p>
        When a recruiter opens their ATS dashboard, they see a ranked list. They typically review the{' '}
        <strong>top 10 to 20 candidates</strong> — out of 250+ applicants, or 10,000+ for a big drive.
      </p>
      <blockquote>
        <p>
          The ATS doesn't delete your resume. It just buries it at position #847 on a list where the
          recruiter stops reading at position #20. Being ranked 847th is functionally identical to being
          rejected.
        </p>
      </blockquote>
      <p>
        So yes — if your resume scores poorly, a human will never read it. Not because a bot
        auto-rejected it, but because it was never surfaced. The outcome is the same. Your understanding
        of it just needs to be more accurate — because that changes how you fix the problem.
      </p>

      <hr />

      <h2 id="five-reasons">4. The 5 Specific Reasons Indian Fresher Resumes Fail ATS</h2>
      <p>This is the most important section. Read it slowly.</p>

      <h3>❌ Reason 1: You're Using a Two-Column or Graphic-Heavy Template</h3>
      <p>
        This is the single biggest mistake Indian freshers make. You see a template on Canva that looks
        professional — two columns, a sidebar with your photo and skills, colour bars, icons.
        It looks polished.
      </p>
      <p>
        ATS doesn't see polish. ATS sees chaos. When a parser encounters two columns, it reads across
        the page left to right. Your sidebar skills end up mixed in with your education bullets. Your
        project descriptions get merged with your contact info. Your score tanks even though your content
        is strong.
      </p>
      <p>
        <strong>The fix:</strong> Use a single-column resume. Always. Every professional resume meant to
        be submitted digitally should use a clean, top-to-bottom single-column layout.
      </p>

      <h3>❌ Reason 2: You're Missing Exact Keywords From the Job Description</h3>
      <p>
        ATS systems — especially those used by TCS, Infosys, and other large IT companies — search for
        keywords that match the specific job description.
      </p>
      <ul>
        <li>If the JD says <strong>"Object-Oriented Programming"</strong> and your resume says <strong>"OOP concepts"</strong> — that's not always recognized as a match.</li>
        <li>If the JD says <strong>"Agile methodology"</strong> and your resume says <strong>"worked in a team"</strong> — no match.</li>
        <li>If the JD mentions <strong>"SQL"</strong> and you have listed <strong>"database management"</strong> — some systems won't connect the two.</li>
      </ul>
      <p>
        <strong>The fix:</strong> Before applying, paste the JD into a document, highlight every skill
        and tool mentioned, and verify each one appears on your resume — using the same words.
      </p>

      <h3>❌ Reason 3: Your Resume Is a Scanned PDF or Image-Based File</h3>
      <p>
        Some freshers design their resume in Canva and export it as an image-based PDF. The ATS parser
        literally cannot read the words — it sees an image. It extracts nothing.
      </p>
      <p>
        <strong>The fix:</strong> Always create your resume in Microsoft Word or Google Docs. Export as
        a text-based PDF. Verify by opening it and trying to highlight and copy the text — if you can
        copy the words, ATS can read it.
      </p>

      <h3>❌ Reason 4: You Included a Photo, Date of Birth, or Personal Details</h3>
      <p>
        In India, we grew up being told a resume should include your photo, DOB, religion, marital
        status, and father's name. <strong>This is the wrong document for private sector, IT, and MNC
        applications.</strong>
      </p>
      <ul>
        <li><strong>ATS parsing:</strong> Modern AI parsers may misidentify <code>DOB: 15/05/2003</code> as a professional "Start Date" — and incorrectly calculate 21 years of experience, flagging the profile as "Inconsistent."</li>
        <li><strong>Implicit bias:</strong> Global companies and MNCs explicitly do not want this information.</li>
      </ul>
      <p>
        <strong>The fix:</strong> Remove photo, DOB, marital status, religion, and father's name. Keep
        only: Full Name, Phone (+91 format), Professional Email, City + State, LinkedIn URL, GitHub URL
        (for tech roles).
      </p>

      <h3>❌ Reason 5: Non-Standard Section Headings</h3>
      <p>ATS systems are trained to recognize specific section headings. They look for:</p>
      <ul>
        <li><strong>Education</strong> (not "Academic Background" or "My Degrees")</li>
        <li><strong>Skills</strong> (not "Core Competencies" or "What I Know")</li>
        <li><strong>Experience</strong> or <strong>Work Experience</strong> (not "Where I've Worked")</li>
        <li><strong>Projects</strong> (not "Things I've Built")</li>
        <li><strong>Certifications</strong> (not "Achievements and Courses")</li>
      </ul>
      <p>
        <strong>The fix:</strong> Use clean, standard, recognized headings. No creativity needed in
        headings — the creativity goes in the content.
      </p>

      <hr />

      <h2 id="what-it-looks-like">5. What an ATS-Passing Resume Actually Looks Like</h2>
      <p>Here is the exact structure a fresher resume should follow to pass ATS while impressing human reviewers:</p>

      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', border: '1px solid var(--outline-variant)' }}>{`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR FULL NAME
+91-XXXXXXXXXX  |  youremail@gmail.com  |  City, State
linkedin.com/in/yourname  |  github.com/yourname
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OBJECTIVE
[2-3 lines: your degree + top 2-3 skills + role you want + 
what you bring. Mirror the JD language here.]

EDUCATION
[Degree] in [Branch] — [College Name], [City]    [Year]
CGPA: X.X / 10.0  |  [Percentage if strong]

TECHNICAL SKILLS
Languages:   [Java, Python, C++, SQL]
Frameworks:  [Spring Boot, React, Node.js]
Tools:       [Git, VS Code, IntelliJ]
Databases:   [MySQL, MongoDB]

PROJECTS
[Project Name] | [Tech Stack]
• What you built
• How you built it (tools, methodology)
• Result ("Used by 200+ students", "Reduced time by 30%")

CERTIFICATIONS
[Certification Name] — [Issuing Body]    [Month Year]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`}</pre>

      <p>
        <strong>Single column. Standard headings. Clean text. No photos. No tables. No icons.</strong>
        This layout is parseable by every ATS system used in India — from Naukri RChilli to Taleo to
        Workday to TCS iON.
      </p>
      <p>
        Notice the CGPA format: <code>9.2 / 10.0</code>. Workday's system is optimized for the US 4.0
        GPA scale. Without the <code>/ 10.0</code>, the system may leave the field blank —
        <strong> excluding you from "High Merit" recruiter filters.</strong>
      </p>

      <hr />

      <h2 id="score-benchmark">6. The Score You Need to Aim For</h2>
      <p>
        Most ATS systems score resumes on a 0–100 scale based on keyword match, section completeness,
        and formatting quality. Here is the benchmark that matters for Indian applications:
      </p>

      <div style={{ overflowX: 'auto', marginBottom: 'var(--space-6)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ background: 'var(--surface-container-high)', textAlign: 'left' }}>
              <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--on-surface)', borderBottom: '2px solid var(--outline-variant)' }}>Score Range</th>
              <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--on-surface)', borderBottom: '2px solid var(--outline-variant)' }}>What It Means</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['85 – 100', 'Strong match. Likely to appear in top recruiter shortlist.', 'var(--secondary)'],
              ['70 – 84', 'Moderate match. May appear in shortlist depending on competition.', 'var(--on-surface-variant)'],
              ['60 – 69', 'Weak match. Unlikely to be shortlisted in high-volume drives.', '#f59e0b'],
              ['Below 60', 'Parsing failures or major keyword gaps. Almost invisible.', 'var(--error)'],
            ].map(([range, meaning, color]) => (
              <tr key={range}>
                <td style={{ padding: '9px 14px', fontWeight: 700, color: color as string, borderBottom: '1px solid var(--outline-variant)' }}>{range}</td>
                <td style={{ padding: '9px 14px', color: 'var(--on-surface-variant)', borderBottom: '1px solid var(--outline-variant)' }}>{meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        For <strong>TCS, Infosys, Wipro, and other mass recruiters</strong> who receive thousands of
        applications, aim for <strong>85+.</strong> The volume is too high to leave anything to chance.
      </p>

      <hr />

      <h2 id="real-problem">7. The Real Problem Is Competition, Not the ATS Itself</h2>
      <p>Here's the mindset shift that changes everything.</p>
      <p>
        The ATS is not your enemy. It's math. India produces approximately{' '}
        <strong>1.5 million engineering graduates every year.</strong> The IT sector hires roughly
        150,000–170,000 freshers annually. That's roughly a <strong>1 in 10 shot</strong> even before
        the first filter.
      </p>
      <p>
        When 10,000 people apply for a single TCS batch and the recruiter can meaningfully review 50,
        the ATS is simply doing math. It is ranking by relevance. Your job is to be{' '}
        <em>more relevant</em>, not to game the system.
      </p>
      <p>The difference between the resume at position #7 and the one at position #847 is:</p>
      <ul>
        <li>The right keywords, in the right sections</li>
        <li>A clean format the parser can read correctly</li>
        <li>Content that matches what the JD actually asked for</li>
      </ul>
      <p>
        That's it. It's not about who went to a better college. It's not about CGPA above a threshold.
        It's about whether your resume <em>speaks the same language</em> as the job description.
      </p>

      <hr />

      <h2 id="five-min-check">8. A 5-Minute ATS Check You Can Do Right Now</h2>
      <p>Before you apply to anything, run through this checklist:</p>

      <h3>Format Check</h3>
      <ul>
        <li>☐ Single-column layout</li>
        <li>☐ No tables, text boxes, or images</li>
        <li>☐ Standard font (Calibri, Arial, Georgia — 10–12pt)</li>
        <li>☐ Saved as text-based PDF or DOCX</li>
        <li>☐ No photo, no DOB, no personal details</li>
      </ul>

      <h3>Content Check</h3>
      <ul>
        <li>☐ Objective/Summary includes keywords from target JD</li>
        <li>☐ Skills section uses exact technology names from JD</li>
        <li>☐ Project descriptions include tech stack and outcomes</li>
        <li>☐ Section headings match standard names (Education, Skills, Projects, Certifications)</li>
        <li>☐ CGPA is visible and formatted as <code>X.X / 10.0</code></li>
      </ul>

      <h3>Keyword Check</h3>
      <ul>
        <li>☐ I have read the full JD and highlighted key skills</li>
        <li>☐ Every highlighted skill appears somewhere on my resume</li>
        <li>☐ I've used the same terminology as the JD, not my own abbreviations</li>
        <li>☐ I have not stuffed keywords unnaturally — they appear in context</li>
      </ul>

      <p>Also do the <strong>"Plain Text Test"</strong>: open your resume PDF, select all text
      (<code>Ctrl+A</code>), copy (<code>Ctrl+C</code>), and paste into Notepad. If the pasted text
      looks scrambled or your CGPA is no longer associated with your degree, the ATS is failing to
      parse your profile.</p>

      <hr />

      <h2 id="human-review">9. What Happens After ATS? The Human Review</h2>
      <p>
        Let's say your resume scores well and reaches a recruiter. Recruiters spend an average of{' '}
        <strong>6–10 seconds</strong> on a first pass. In that window, they check:
      </p>
      <ol>
        <li><strong>CGPA / Percentage</strong> — Is this person eligible? (Most big companies require 60% / 6.0 CGPA minimum)</li>
        <li><strong>Degree and Branch</strong> — Is this the right qualification?</li>
        <li><strong>Top skills</strong> — Do the first 3–5 skills match what they need?</li>
        <li><strong>One project</strong> — Is there something that shows they can actually build things?</li>
      </ol>
      <p>
        That's the entire first pass. This means your most important information must be{' '}
        <strong>visible immediately</strong> — above the fold, in the first third of the page. Not
        buried in bullet point number 14.
      </p>
      <blockquote>
        <p>
          Your resume is not a story with a slow build. It is a billboard. The most important
          information goes at the top. Every subsequent section supports that headline.
        </p>
      </blockquote>
      <hr />

      <h2 id="two-documents">10. The Two Documents You're Actually Writing</h2>
      <p>
        When you write a resume in India today, you're actually writing for{' '}
        <strong>two audiences simultaneously:</strong>
      </p>
      <p><strong>Audience 1: The ATS</strong></p>
      <ul>
        <li>Wants standard structure</li>
        <li>Wants exact keyword matches</li>
        <li>Wants text it can parse cleanly</li>
        <li>Has no aesthetic preferences</li>
        <li>Does not care about creativity</li>
      </ul>
      <p><strong>Audience 2: The Human Recruiter</strong></p>
      <ul>
        <li>Wants instant readability</li>
        <li>Wants proof you can do the job (projects, skills, certifications)</li>
        <li>Wants a candidate who looks prepared and serious</li>
        <li>Has about 6–10 seconds for a first impression</li>
        <li>Does care about clarity, brevity, and professionalism</li>
      </ul>
      <p>
        A resume that passes ATS but reads poorly to a human gets you nowhere. A resume that looks
        beautiful but fails ATS gets you nowhere. The goal is a resume that is{' '}
        <strong>clean enough to parse, compelling enough to shortlist.</strong> Both at once. That's the
        skill.
      </p>

      <h2 id="bottom-line">11. The Bottom Line — And What to Do Next</h2>
      <p>
        If you've been applying for jobs and hearing nothing back, here's the honest diagnosis:{' '}
        <strong>
          Most of the time, the problem is not your qualifications. The problem is that a machine ranked
          you out of visibility before any human judged your qualifications.
        </strong>
      </p>
      <p>
        And the machine isn't even biased against you. It's just matching text. You just haven't spoken
        its language yet.
      </p>
      <p>The fixes are not complicated:</p>
      <ul>
        <li>Use a clean, single-column format</li>
        <li>Match the keywords in every JD before applying</li>
        <li>Use standard section headings</li>
        <li>Remove personal details that don't belong</li>
        <li>Check your ATS score before submitting</li>
      </ul>
      <p>
        None of these things require a better degree. None require more years of experience. They require
        understanding how the system works — and adapting to it.
      </p>
      <p>
        You've just done the first and most important step: understanding the system.{' '}
        <strong>Now go fix your resume.</strong>
      </p>

      <hr />

      <h2 id="keep-learning">12. Keep Learning — What to Read Next</h2>
      <p><strong>If this article opened your eyes, these will complete the picture:</strong></p>
      <ul>
        <li>
          <strong>The Complete ATS-Friendly Resume Format for Indian Freshers</strong> — A full template
          with every section explained, built specifically for TCS, Infosys, and Wipro applications.
        </li>
        <li>
          <strong>ATS Keywords for Freshers: How to Find Them and Where to Put Them</strong> — The
          step-by-step process of extracting keywords from any job description and placing them correctly
          on your resume.
        </li>
        <li>
          <strong>How to Check Your ATS Score Before Applying</strong> — Walk through the CareerForge ATS
          Score tool and learn how to interpret your results.
        </li>
        <li>
          <strong>10 Resume Formatting Mistakes Indian Freshers Make</strong> — The specific errors that
          cause ATS failure, with before/after examples for each one.
        </li>
      </ul>

      <hr />

      <h2 id="fix-now">Fix Your Resume Right Now</h2>
      <p>
        You now know exactly what ATS looks for. You know why resumes fail. You know what the right
        structure looks like. The next step is actually building that resume — one that passes the ATS
        and impresses the recruiter who opens it.
      </p>
      <p><strong>CareerForge.pro is built for exactly this:</strong></p>
      <ul>
        <li>Build your resume from scratch using ATS-optimized templates designed for Indian job applications</li>
        <li>Check your ATS score against any job description — and see exactly which keywords you're missing</li>
        <li>Tailor your resume to a specific JD with one click</li>
        <li>Generate a cover letter customized to the role and company</li>
        <li>Write better bullet points with AI that understands what Indian recruiters want to see</li>
      </ul>
      <p>The free tier gives you enough to build and test your resume before you decide to upgrade.</p>

      <hr />

      {/* References */}
      <section aria-label="References and Data Sources">
        <h3>References &amp; Data Sources</h3>
        <ul>
          <li>
            <em>TCS NQT Applicant Volume:</em>{' '}
            <a href="https://economictimes.indiatimes.com/jobs/fresher-hiring" target="_blank" rel="noopener noreferrer">
              Economic Times Report on IT Hiring (2025–26)
            </a>
          </li>
          <li>
            <em>ATS Rejection vs. Ranking Data:</em>{' '}
            <a href="https://enhancv.com/blog/ats-myths/" target="_blank" rel="noopener noreferrer">
              Enhancv 2026 ATS Myths Update
            </a>
          </li>
          <li>
            <em>Workday AI Ranking:</em>{' '}
            <a href="https://www.workday.com/en-us/company/newsroom/press-releases.html" target="_blank" rel="noopener noreferrer">
              Workday Official Press Release
            </a>
          </li>
          <li>
            <em>Neuralent Technical Overview:</em>{' '}
            <a href="https://www.tcs.com/what-we-do/services/artificial-intelligence" target="_blank" rel="noopener noreferrer">
              TCS Research on AI Talent Transformation
            </a>
          </li>
        </ul>
      </section>

    </BlogPostLayout>
  )
}
