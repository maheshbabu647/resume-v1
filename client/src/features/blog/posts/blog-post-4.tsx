import { BlogPostLayout } from '../BlogPostLayout'
import blogCover from '@/assets/blog-post-1-cover.png'

const TOC = [
  { id: 'why-ignored', text: '1. Why a Good Candidate Gets Ignored' },
  { id: 'mistake-1', text: '2. Mistake 1 — Using a Two-Column or Canva Template' },
  { id: 'mistake-2', text: '3. Mistake 2 — Including Photo, Date of Birth, and Personal Details' },
  { id: 'mistake-3', text: '4. Mistake 3 — Writing a Generic Objective Statement' },
  { id: 'mistake-4', text: '5. Mistake 4 — Listing Skills as Vague Soft-Skill Buzzwords' },
  { id: 'mistake-5', text: '6. Mistake 5 — Project Descriptions That Describe Work, Not Outcomes' },
  { id: 'mistake-6', text: '7. Mistake 6 — Contact Information in Headers or Footers' },
  { id: 'mistake-7', text: '8. Mistake 7 — Saving from Canva or Design Tools as an Image-Based PDF' },
  { id: 'mistake-8', text: '9. Mistake 8 — A Resume That Is More Than One Page' },
  { id: 'mistake-9', text: '10. Mistake 9 — Submitting the Same Resume to Every Job' },
  { id: 'mistake-10', text: '11. Mistake 10 — Spelling Errors and Inconsistent Formatting' },
  { id: 'summary', text: '12. The Before/After Summary' },
  { id: 'final-note', text: '13. A Final Note on Fixing vs. Rebuilding' }
]

export default function BlogPost4() {
  return (
    <BlogPostLayout
      slug="10-resume-formatting-mistakes-indian-freshers-2026"
      heroImagePath={blogCover}
      tocEntries={TOC}
    >
      <blockquote>
        <p><em>You've read the theory. You know what ATS is.</em></p>
        <p><em>Now let's look at the actual mistakes — the specific, fixable errors that are sitting in most Indian fresher resumes right now.</em></p>
      </blockquote>

      <hr />

      <h2 id="why-ignored">1. Why a Good Candidate Gets Ignored</h2>
      <p>You studied for four years. You built projects. You got a decent CGPA. You spent three evenings writing what you think is a solid resume.</p>
      <p>Then you apply to thirty companies and hear back from two.</p>
      <p>The instinct is to blame the job market, or your college, or your luck. But more often than not, the real explanation is quieter and more fixable: your resume has one or more of the mistakes listed in this article.</p>
      <p>These aren't rare edge cases. They're patterns that appear on the majority of Indian fresher resumes — because most freshers were taught to write resumes by looking at other freshers' resumes, which were also never optimised.</p>
      <p>The mistakes below break down into two categories: ones that cause <strong>ATS to rank your resume low</strong> (the machine problem), and ones that cause <strong>recruiters to move past your resume quickly</strong> even when it does reach them (the human problem).</p>
      <p>Both matter. A resume needs to pass both tests. Let's go through them.</p>

      <hr />

      <h2 id="mistake-1">2. Mistake 1 — Using a Two-Column or Canva Template</h2>
      <p><strong>What it looks like:</strong> A resume with a dark sidebar on the left showing your photo, skills listed with dots or rating bars, and contact information. The main content fills the right column. It looks clean and professional to the human eye.</p>
      <p><strong>Why it's a problem:</strong> ATS parsers read documents top to bottom, left to right — in a single linear stream. When they encounter a two-column layout, the left column and right column get mixed together in the extracted text. Your skills from the sidebar end up merged with your education section. Your name appears halfway down instead of at the top. The parser builds a scrambled profile from this chaos, and your score reflects it.</p>
      <p>Additionally, graphic elements like skill-rating bars (the "Python ●●●●○" style), icons next to section names, and shaded backgrounds become invisible to ATS. The parser skips anything it can't read as plain text.</p>
      <p><strong>The fix:</strong> Switch to a single-column layout. Your entire resume reads top to bottom with no sidebars, no columns, no text boxes. This is less visually exciting but infinitely more compatible with the systems that decide whether a human ever sees your resume. Refer to the full template in Blog 2 for the correct structure.</p>
      <p><strong>Quick test:</strong> Paste your resume into Notepad. If it reads coherently from top to bottom — you're fine. If it looks scrambled — the layout is the problem.</p>

      <hr />

      <h2 id="mistake-2">3. Mistake 2 — Including Photo, Date of Birth, and Personal Details</h2>
      <p><strong>What it looks like:</strong> A passport-size photo in the top corner. Below the name: Date of Birth: 15/08/2002. Marital Status: Single. Father's Name: [Name]. Religion: Hindu. Full home address with pin code.</p>
      <p><strong>Why it's a problem:</strong> This is the biodata format — a document tradition used in India for matrimonial applications, government forms, and older-style corporate applications. For private sector job applications, IT companies, and MNCs, it signals that the candidate hasn't updated their understanding of what a professional resume looks like in 2026.</p>
      <p>From the ATS side: a photo is an image file embedded in the document. The parser cannot read it. It takes up layout space that can confuse section detection around it. The DOB, religion, and father's name are not useful to a parser looking for skills and qualifications — they add noise without adding keyword value.</p>
      <p>From the human side: including personal details that have no bearing on your professional capability can, intentionally or otherwise, introduce factors into the screening process that shouldn't matter. Modern private-sector hiring in India increasingly moves away from this for exactly that reason.</p>
      <p><strong>The fix:</strong> Remove photo, date of birth, marital status, religion, caste, father's name, and full home address from your resume. Your header should contain only:</p>
      <ul>
        <li>Full name</li>
        <li>Phone number (in +91 format)</li>
        <li>Professional email address</li>
        <li>City and State (not full address)</li>
        <li>LinkedIn URL</li>
        <li>GitHub URL (for technical roles)</li>
      </ul>
      <p><strong>Exception:</strong> Government job applications and PSU applications often do require some of this information — but that's a different document category. For private sector and MNC applications, it does not belong.</p>

      <hr />

      <h2 id="mistake-3">4. Mistake 3 — Writing a Generic Objective Statement</h2>
      <p><strong>What it looks like:</strong></p>
      <blockquote><p>"Seeking a challenging and rewarding position in a reputed organisation where I can utilise my skills, contribute to organisational growth, and develop professionally."</p></blockquote>
      <p><strong>Why it's a problem:</strong> This exact sentence, or some very close variation of it, appears on a large percentage of Indian fresher resumes. It is so common that recruiters have learned to skip it entirely — it contains no useful information, no keywords, no role specificity, and no indication that the candidate has actually read the job description.</p>
      <p>From the ATS side, a generic objective is a wasted keyword opportunity. The objective is the first thing the parser encounters after contact information. It has the potential to front-load your resume with relevant keywords from the target JD. A generic objective wastes that position.</p>
      <p><strong>The fix:</strong> Write a specific, tailored objective. Include your degree, your top 2–3 relevant skills, and the specific role you're targeting — using the same language the JD uses.</p>
      
      <p><strong>Weak:</strong><br />"Seeking a position in software engineering to learn and grow."</p>
      
      <p><strong>Strong:</strong><br />"B.Tech Computer Science graduate from XYZ College with demonstrated skills in Java, Spring Boot, and MySQL. Seeking a Software Developer role to build backend systems and contribute to scalable product development."</p>
      
      <p>The strong version contains actual keywords (Java, Spring Boot, MySQL, Software Developer, backend systems). The ATS finds them. The recruiter, in the few seconds they have, sees a candidate who knows what they want and what they offer.</p>
      <p>Update this section for every application. A different target role or company means a different objective. It takes five minutes and meaningfully improves your keyword match against each specific JD.</p>

      <hr />

      <h2 id="mistake-4">5. Mistake 4 — Listing Skills as Vague Soft-Skill Buzzwords</h2>
      <p><strong>What it looks like:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', fontFamily: 'var(--font-mono)' }}>{`SKILLS
• Good communication skills
• Team player
• Hard working
• Problem solver
• Quick learner
• Leadership
• Adaptable`}</pre>

      <p><strong>Why it's a problem:</strong> Soft skills listed as standalone statements are nearly useless on a resume for two reasons.</p>
      <p>First, the ATS is not searching for "good communication skills." It is searching for "Java," "Python," "SQL," "React," "AutoCAD," "Power BI" — concrete, verifiable technical terms. Soft-skill buzzwords rarely appear in job description keyword lists in a form that creates an ATS match.</p>
      <p>Second, recruiters have read "team player" and "quick learner" on thousands of resumes. These phrases carry no evidential weight because anyone can write them. They fill space without demonstrating anything.</p>
      <p><strong>The fix:</strong> Your skills section should be dominated by <strong>hard, specific, technical skills</strong> — languages, tools, platforms, frameworks, software. Group them by category for readability and ATS clarity.</p>

      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', fontFamily: 'var(--font-mono)' }}>{`TECHNICAL SKILLS

Programming Languages:  Java, Python, C, C++, SQL
Web Technologies:       HTML, CSS, JavaScript, React.js, Node.js
Databases:              MySQL, MongoDB
Tools:                  Git, VS Code, IntelliJ IDEA, Postman`}</pre>

      <p>If you want to demonstrate soft skills, do it through your <strong>bullet points</strong> — not as a standalone list.</p>
      <p>Instead of writing "Leadership" in your skills section, write this in your extracurricular section:<br/><em>"Led a team of 12 as Technical Club Head, organising 4 workshops with 150+ attendees."</em><br/>That's leadership — shown, not stated.</p>

      <hr />

      <h2 id="mistake-5">6. Mistake 5 — Project Descriptions That Describe Work, Not Outcomes</h2>
      <p><strong>What it looks like:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', fontFamily: 'var(--font-mono)' }}>{`PROJECTS

Library Management System
• Worked on a library management project
• Used Java and MySQL
• Was part of a team of 4`}</pre>

      <p><strong>Why it's a problem:</strong> The projects section is the most important section on a fresher resume. For freshers with no formal work experience, it is literally the evidence of your ability. Vague descriptions like "worked on" and "was part of" give recruiters and ATS nothing to evaluate.</p>
      <p>Specifically: "worked on a library management project" contains no keywords, no outcomes, no proof of skill depth. It tells the reader nothing they couldn't guess from the project name alone.</p>
      
      <p><strong>The fix:</strong> Every project description follows this structure:</p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', fontFamily: 'var(--font-mono)' }}>{`Project Name | Technology 1, Technology 2, Technology 3
• What it is (one line — the product or system)
• How you built it (specific tools, architecture, methods)
• What happened (result, outcome, scale — with numbers where possible)
• GitHub link (if available)`}</pre>

      <p><strong>Revised version:</strong></p>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', fontFamily: 'var(--font-mono)' }}>{`Library Management System | Java, Spring Boot, MySQL, Thymeleaf
• Built a web-based library management system for tracking 
  book inventory, member registrations, and borrow/return cycles
• Implemented RESTful APIs using Spring Boot with role-based 
  access for admin and member users; MySQL for data persistence
• Reduced manual book tracking time by an estimated 60% 
  during pilot testing with a simulated 200-member dataset
• github.com/yourname/library-management`}</pre>

      <p>Same project. Radically different impression. Every bullet contains keywords. The outcome is quantified. The recruiter sees a candidate who can build and explain what they built.</p>

      <hr />

      <h2 id="mistake-6">7. Mistake 6 — Contact Information in Headers or Footers</h2>
      <p><strong>What it looks like:</strong> Using Microsoft Word's header section (Edit → Header) to place your name and contact details at the very top of the document, so it appears on every page.</p>
      <p><strong>Why it's a problem:</strong> Many ATS parsers are known to skip text placed inside document headers and footers because they treat them as page decorations rather than resume content. If your name and email are in a Word header and the ATS skips headers, your resume may be indexed without any contact information attached to it. The recruiter can find your skills and experience — but has no way to contact you.</p>
      <p>This is one of those mistakes that is completely invisible to the person making it. The resume looks perfect when you open it. The ATS processes it silently and stores an incomplete profile.</p>
      <p><strong>The fix:</strong> Your name and contact information must be in the <strong>main body</strong> of the document — not inside a Word header, footer, text box, or sidebar. Simply type it at the top of your document as regular text. That's all. The distinction matters enormously to how parsers handle the information.</p>

      <hr />

      <h2 id="mistake-7">8. Mistake 7 — Saving from Canva or Design Tools as an Image-Based PDF</h2>
      <p><strong>What it looks like:</strong> You designed your resume in Canva, Figma, or a graphic design tool. You clicked "Download as PDF." It looks exactly how you designed it. You upload it to the portal.</p>
      <p><strong>Why it's a problem:</strong> PDFs created by graphic design tools often export text as vector graphics or embedded image layers — not as extractable text. The difference is invisible to the human eye but decisive for ATS parsing. When the parser tries to extract text from an image-based PDF, it finds an image. It can't read it. Your profile is indexed as essentially empty.</p>
      <p>You can verify this yourself: open your PDF, try to click on a word and drag to highlight text. If you can highlight individual words — it's a text-based PDF and ATS can read it. If clicking selects the entire page as a single image — it's image-based and ATS cannot read it.</p>
      <p><strong>The fix:</strong> Build your resume in Microsoft Word or Google Docs. Export to PDF from there. These tools export text-based PDFs. Alternatively, use a dedicated resume builder (like CareerForge.pro) that generates ATS-compatible files as its core function.</p>
      <p>If you are attached to Canva for visual design, be aware that this problem exists, test your export with the highlight method above, and consider switching tools for job applications specifically.</p>

      <hr />

      <h2 id="mistake-8">9. Mistake 8 — A Resume That Is More Than One Page</h2>
      <p><strong>What it looks like:</strong> A two or three-page resume submitted for a fresher or entry-level role. Sometimes padded with extensive personal details, a lengthy objective paragraph, hobbies, references, and broad project descriptions that could be edited to half the length.</p>
      <p><strong>Why it's a problem:</strong> Recruiters at large Indian IT companies process high volumes of applications during campus hiring seasons. Their first pass on any resume is brief — studies on recruiter behaviour suggest initial screening takes seconds before they decide to read further or move on. A two-page fresher resume signals poor judgement about what's relevant — and the second page is often never reached.</p>
      <p>More practically: a one-page resume forces you to prioritise. Every line you include must earn its place. This discipline makes the resume sharper and the reader's job easier. A two-page fresher resume is usually a one-page resume with filler.</p>
      <p><strong>The fix:</strong> Edit to one page. The common areas to cut:</p>
      <ul>
        <li>Generic hobbies ("reading, music, travelling" — remove entirely)</li>
        <li>Redundant personal details (DOB, religion, full address — remove)</li>
        <li>Overly long declarations (shorten or remove for private sector)</li>
        <li>Weak bullet points from projects (keep 2–3 strong bullets per project, not 6 weak ones)</li>
        <li>Class 10 details if degree CGPA is strong and space is tight</li>
      </ul>
      <p>If you genuinely cannot fit strong content on one page — two pages is acceptable for an MBA graduate with multiple internships, or an engineering student with substantial project portfolios. But this is the exception for freshers, not the default.</p>

      <hr />

      <h2 id="mistake-9">10. Mistake 9 — Submitting the Same Resume to Every Job</h2>
      <p><strong>What it looks like:</strong> You created one resume in January. You have been submitting that exact file to every company, every role, every JD since then.</p>
      <p><strong>Why it's a problem:</strong> ATS systems score your resume against a specific job description. A resume optimised for a Java backend developer role will score differently against a Python data analyst JD — because the keyword sets are different. The same resume, unchanged, cannot be well-aligned to every role.</p>
      <p>Beyond ATS: the human reader also notices when a resume reads generic. An objective that doesn't mention the target role, a skills section that doesn't mirror the JD's priorities, projects described in language unrelated to the position — these signals tell the recruiter that this was a bulk application, not a considered one.</p>
      <p><strong>The fix:</strong> Maintain a <strong>base resume</strong> — your complete, well-structured document with all your skills, projects, and education. For each application, make a tailored copy:</p>
      <ol>
        <li>Update the Objective to name the specific role and include 2–3 keywords from that JD</li>
        <li>Review your Skills section — move the most relevant skills higher if you've grouped them</li>
        <li>Check project descriptions — ensure the technologies mentioned appear in the JD</li>
        <li>Save this version as a separate file: <code>YourName_TCS_SoftwareDeveloper.pdf</code></li>
      </ol>
      <p>This process takes 8–10 minutes per application. It is the single highest-return investment you can make in your job search workflow.</p>

      <hr />

      <h2 id="mistake-10">11. Mistake 10 — Spelling Errors and Inconsistent Formatting</h2>
      <p><strong>What it looks like:</strong> "Managment" instead of "Management." "Developpment" instead of "Development." Section headings in different font sizes across the document. Some dates written as "Jan 2024," others as "01/2024," others as "January, 2024." Some bullet points ending with full stops, others not.</p>
      <p><strong>Why it's a problem:</strong> A spelling error on a professional document is a genuine credibility signal. It tells the recruiter that you didn't proofread — which tells them something about your attention to detail, which is a quality every employer cares about regardless of role.</p>
      <p>Inconsistent formatting is a subtler version of the same problem. When fonts, sizes, date formats, and punctuation are inconsistent throughout the document, the resume reads as unpolished — even if the content is strong.</p>
      <p>From the ATS side: inconsistent date formats can cause parsing errors. ATS systems use dates to calculate tenure and recency. "Jan 2024" and "01/2024" may be interpreted differently by some parsers. Using a single consistent format throughout avoids ambiguity.</p>
      
      <p><strong>The fix:</strong> Before submitting any resume:</p>
      <ol>
        <li>Run a spell check (Word and Google Docs both have this — use it)</li>
        <li>Read the resume out loud, slowly — your ear catches errors your eye misses</li>
        <li>Have one other person read it — a fresh pair of eyes catches different errors</li>
        <li>Do a consistency audit:
          <ul>
            <li>Are all dates in the same format? (Pick one: "Jan 2025" or "January 2025")</li>
            <li>Are all bullets the same style? (All starting with action verbs, all without or all with full stops)</li>
            <li>Are all section headings the same font size and weight?</li>
            <li>Is the font the same throughout — no accidental font switches?</li>
          </ul>
        </li>
      </ol>
      <p>These are the small things that separate a polished resume from an almost-polished one. At high application volumes, recruiters notice.</p>

      <hr />

      <h2 id="summary">12. The Before/After Summary</h2>
      <p>Here's a quick reference of every mistake and its fix:</p>

      <div style={{ overflowX: 'auto', marginBottom: 'var(--space-6)' }}>
        <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', border: '1px solid var(--outline-variant)' }}>
          <thead>
            <tr style={{ background: 'var(--surface-container-high)', borderBottom: '2px solid var(--outline-variant)', textAlign: 'left' }}>
              <th style={{ padding: 'var(--space-3)' }}>#</th>
              <th style={{ padding: 'var(--space-3)' }}>The Mistake</th>
              <th style={{ padding: 'var(--space-3)' }}>The Fix</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--outline-variant)' }}><td style={{ padding: 'var(--space-3)' }}>1</td><td style={{ padding: 'var(--space-3)' }}>Two-column / Canva template</td><td style={{ padding: 'var(--space-3)' }}>Single-column, plain text layout</td></tr>
            <tr style={{ borderBottom: '1px solid var(--outline-variant)' }}><td style={{ padding: 'var(--space-3)' }}>2</td><td style={{ padding: 'var(--space-3)' }}>Photo, DOB, personal details</td><td style={{ padding: 'var(--space-3)' }}>Name, phone, email, city, LinkedIn only</td></tr>
            <tr style={{ borderBottom: '1px solid var(--outline-variant)' }}><td style={{ padding: 'var(--space-3)' }}>3</td><td style={{ padding: 'var(--space-3)' }}>Generic objective statement</td><td style={{ padding: 'var(--space-3)' }}>Specific: degree + skills + target role</td></tr>
            <tr style={{ borderBottom: '1px solid var(--outline-variant)' }}><td style={{ padding: 'var(--space-3)' }}>4</td><td style={{ padding: 'var(--space-3)' }}>Soft-skill buzzwords in Skills section</td><td style={{ padding: 'var(--space-3)' }}>Hard technical skills, grouped by category</td></tr>
            <tr style={{ borderBottom: '1px solid var(--outline-variant)' }}><td style={{ padding: 'var(--space-3)' }}>5</td><td style={{ padding: 'var(--space-3)' }}>Vague project descriptions</td><td style={{ padding: 'var(--space-3)' }}>Tech Stack + What + How + Outcome + GitHub</td></tr>
            <tr style={{ borderBottom: '1px solid var(--outline-variant)' }}><td style={{ padding: 'var(--space-3)' }}>6</td><td style={{ padding: 'var(--space-3)' }}>Contact info in Word header/footer</td><td style={{ padding: 'var(--space-3)' }}>All info in main document body only</td></tr>
            <tr style={{ borderBottom: '1px solid var(--outline-variant)' }}><td style={{ padding: 'var(--space-3)' }}>7</td><td style={{ padding: 'var(--space-3)' }}>Image-based PDF from Canva</td><td style={{ padding: 'var(--space-3)' }}>Text-based PDF from Word or resume builder</td></tr>
            <tr style={{ borderBottom: '1px solid var(--outline-variant)' }}><td style={{ padding: 'var(--space-3)' }}>8</td><td style={{ padding: 'var(--space-3)' }}>Multi-page fresher resume</td><td style={{ padding: 'var(--space-3)' }}>One page — every line earns its place</td></tr>
            <tr style={{ borderBottom: '1px solid var(--outline-variant)' }}><td style={{ padding: 'var(--space-3)' }}>9</td><td style={{ padding: 'var(--space-3)' }}>Same resume for every job</td><td style={{ padding: 'var(--space-3)' }}>Tailored copy per application (8–10 min)</td></tr>
            <tr><td style={{ padding: 'var(--space-3)' }}>10</td><td style={{ padding: 'var(--space-3)' }}>Spelling errors, inconsistent formatting</td><td style={{ padding: 'var(--space-3)' }}>Spell check + out-loud read + peer review</td></tr>
          </tbody>
        </table>
      </div>

      <hr />

      <h2 id="final-note">13. A Final Note on Fixing vs. Rebuilding</h2>
      <p>If you've read through this list and counted more than five mistakes in your current resume, the honest advice is to rebuild rather than patch.</p>
      <p>Patching a structurally broken resume — one with a two-column Canva layout, image-based PDF export, and scrambled Notepad output — takes more effort than starting fresh. Each patch creates new inconsistencies. The result is a document that's half-fixed and half-broken, which is often harder to diagnose than one that's simply wrong from the start.</p>
      <p>The complete template in <a href="/blog/ats-friendly-resume-format-indian-freshers-2026">Blog 2 of this series</a> gives you a clean, correct starting point. It takes less time to fill in that structure with your actual information than it takes to diagnose and fix a broken existing resume.</p>
      <p>Do it once, do it right, and then spend your energy on the parts that compound over time — tailoring for each JD, building stronger projects, adding certifications.</p>

      <hr />

      <h2>Read Next in This Series</h2>

      <p>
        → <strong><a href="/blog/why-indian-fresher-resumes-are-invisible-to-ats-2026">Blog 1: What is ATS — And Why Your Resume Gets Rejected Before Any Human Reads It</a></strong>
      </p>

      <p>
        → <strong><a href="/blog/ats-friendly-resume-format-indian-freshers-2026">Blog 2: The Complete ATS-Friendly Resume Format for Indian Freshers</a></strong>
      </p>

      <p>
        → <strong><a href="/blog/how-to-check-your-ats-score-before-applying-india-2026">Blog 3: How to Check Your ATS Score Before Applying for Any Job in India</a></strong>
      </p>

      <p>
        → <strong><a href="/blog/ats-keywords-for-indian-freshers-2026">Blog 5: ATS Keywords for Indian Freshers — How to Find Them and Where to Place Them</a></strong>
      </p>

    </BlogPostLayout>
  )
}
