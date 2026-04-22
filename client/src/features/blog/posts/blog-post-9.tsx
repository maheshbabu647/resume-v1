import { BlogPostLayout } from '../BlogPostLayout'
import blogCover from '@/assets/blog-post-1-cover.png'

const TOC = [
  { id: 'why-education-matters', text: '1. Why the Education Section Matters More at This Stage' },
  { id: 'what-it-must-include', text: '2. What the Education Section Must Include' },
  { id: 'cgpa-question', text: '3. The CGPA Question: When to Include It, When Not To, How to Format It' },
  { id: '10th-12th', text: '4. Should You Include 10th and 12th Marks?' },
  { id: 'full-structure', text: '5. The Full Structure: What Each Entry Should Look Like' },
  { id: 'relevant-coursework', text: '6. Relevant Coursework: An Underused Keyword Opportunity' },
  { id: 'academic-achievements', text: '7. Academic Achievements: What Belongs and How to Write It' },
  { id: 'formatted-examples', text: '8. Complete Formatted Examples Across Streams' },
  { id: 'reverse-chronological', text: '9. The Reverse Chronological Rule' },
  { id: 'what-to-leave-out', text: '10. What to Leave Out' },
  { id: 'ats-education', text: '11. ATS and the Education Section: What It\'s Looking For' },
  { id: 'checklist', text: '12. The Education Section Checklist' },
  { id: 'what-next', text: '13. Read Next in This Series' },
  { id: 'build-education', text: '14. Build Your Education Section Correctly From the Start' }
]

export default function BlogPost9() {
  return (
    <BlogPostLayout
      slug="how-to-write-the-education-section-on-an-indian-fresher-resume-2026"
      heroImagePath={blogCover}
      tocEntries={TOC}
    >
      <blockquote>
        <p><em>For every other section on your resume, you're building evidence.</em></p>
        <p><em>For the Education section, the evidence already exists — you just need to present it correctly.</em></p>
        <p><em>Most freshers underpresent it. A few overcomplicate it. This blog gets it right.</em></p>
      </blockquote>

      <hr />

      <h2 id="why-education-matters">1. Why the Education Section Matters More at This Stage</h2>
      <p>For a fresher, education <strong>is</strong> the primary qualification. It's what confirms you are eligible to apply, what gives the recruiter confidence that you have the foundational knowledge the role requires, and what the ATS uses to verify your degree, branch, and academic standing.</p>
      <p>Most large Indian IT companies screen applicants against academic eligibility criteria before a human ever reads the resume. Your CGPA and percentage across your 10th, 12th, and degree determine whether you pass that filter. The Education section is where those numbers live.</p>

      <hr />

      <h2 id="what-it-must-include">2. What the Education Section Must Include</h2>
      <ul>
        <li><strong>Degree name</strong> — Written in full. Not "B.Tech" alone — "B.Tech in Computer Science Engineering."</li>
        <li><strong>Institution name</strong> — The full, official name of your college or university.</li>
        <li><strong>Graduating year</strong> — Ensure you don't leave this blank.</li>
        <li><strong>CGPA or Percentage</strong></li>
        <li><strong>Board name (for 10th and 12th)</strong> — CBSE, ICSE, State Board, etc.</li>
      </ul>

      <hr />

      <h2 id="cgpa-question">3. The CGPA Question: When to Include It, When Not To, How to Format It</h2>
      <p><strong>When to include:</strong> Always include if it's 6.0 and above. Most IT firms check for 60%+ eligibility.</p>
      <p><strong>When to omit:</strong> If below 6.0, apply to companies without strict filters (startups/product companies) and omit it.</p>
      <p>Use the format your institution uses (e.g., <code>CGPA: 8.2 / 10</code> or <code>Percentage: 78.4%</code>). Do not fudge or round up.</p>

      <hr />

      <h2 id="10th-12th">4. Should You Include 10th and 12th Marks?</h2>
      <p>Yes. Many major IT companies in India (TCS, Infosys, Wipro, Cognizant) require 60% in 10th and 12th. If you apply for their roles, list them.</p>
      <p>You can leave them out if you apply strictly to startups, or if your scores don't verify eligibility for the target role and you need the space.</p>

      <hr />

      <h2 id="full-structure">5. The Full Structure: What Each Entry Should Look Like</h2>
      
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', fontFamily: 'var(--font-mono)' }}>{`B.Tech in Computer Science Engineering
XYZ College of Engineering, Hyderabad | 2021 – 2025 | CGPA: 8.2 / 10
Relevant Coursework: Data Structures, DBMS, Computer Networks, 
                     Operating Systems, Object-Oriented Programming
Academic Achievement: Department rank 3 (2024); Dean's List 2023`}</pre>

      <hr />

      <h2 id="relevant-coursework">6. Relevant Coursework: An Underused Keyword Opportunity</h2>
      <p>This is a major opportunity for ATS matching. List 4-6 specific courses relevant to the JD. Provide exact formal names like "Data Structures and Algorithms" rather than general terms.</p>

      <hr />

      <h2 id="academic-achievements">7. Academic Achievements: What Belongs and How to Write It</h2>
      <p>List hard verifiable stats: University rank, Dean's List, academic awards or scholarships. Leave out vague or soft achievements ("Scored above average", etc.).</p>

      <hr />

      <h2 id="formatted-examples">8. Complete Formatted Examples Across Streams</h2>
      
      <h3>CSE / IT — B.Tech</h3>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', fontFamily: 'var(--font-mono)' }}>{`EDUCATION

B.Tech in Computer Science Engineering
XYZ College of Engineering, Hyderabad | 2021 – 2025 | CGPA: 8.2 / 10
Relevant Coursework: Data Structures & Algorithms, DBMS, 
                     Operating Systems, Computer Networks, OOP
Academic Achievement: Department Rank 4 / 180 students (2023-24)

Class XII — CBSE | ABC Senior Secondary School, Hyderabad | 2021 | 88%
Class X  — CBSE | ABC Senior Secondary School, Hyderabad | 2019 | 91%`}</pre>

      <hr />

      <h2 id="reverse-chronological">9. The Reverse Chronological Rule</h2>
      <p>List most recent to oldest: MBA/Post-gradient &gt; B.Tech/B.Com &gt; 12th &gt; 10th. Do not put 10th first.</p>

      <hr />

      <h2 id="what-to-leave-out">10. What to Leave Out</h2>
      <p>Remove full home address, marks before class 10th, CGPAs you want to hide when there's an enforced cutoff limit, long lists of irrelevant courses, and vague participation awards.</p>

      <hr />

      <h2 id="ats-education">11. ATS and the Education Section: What It's Looking For</h2>
      <p>ATS systems verify Degree level, branch name, college, year, and look for Coursework match items and quantitative academic performance.</p>
      
      <hr />

      <h2 id="checklist">12. The Education Section Checklist</h2>
      <ul>
        <li>Reverse chronological format.</li>
        <li>Full degree names and college names.</li>
        <li>Graduation years, CGPAs (plain text formatting).</li>
        <li>Relevant courses adding to ATS score.</li>
      </ul>

      <hr />

      <h2 id="what-next">13. Read Next in This Series</h2>
      <p>
        → <strong><a href="/blog/why-indian-fresher-resumes-are-invisible-to-ats-2026">Blog 1: What is ATS</a></strong>
      </p>
      <p>
        → <strong><a href="/blog/ats-friendly-resume-format-indian-freshers-2026">Blog 2: Resume Format</a></strong>
      </p>
      <p>
        → <strong><a href="/blog/how-to-check-your-ats-score-before-applying-india-2026">Blog 3: ATS Score</a></strong>
      </p>
      <p>
        → <strong><a href="/blog/10-resume-formatting-mistakes-indian-freshers-2026">Blog 4: Formatting Mistakes</a></strong>
      </p>
      <p>
        → <strong><a href="/blog/ats-keywords-for-indian-freshers-2026">Blog 5: Keywords</a></strong>
      </p>
      <p>
        → <strong><a href="/blog/how-to-write-a-resume-objective-for-freshers-in-india-2026">Blog 6: Objective</a></strong>
      </p>
      <p>
        → <strong><a href="/blog/how-to-write-the-projects-section-on-your-resume-2026">Blog 7: Projects Section</a></strong>
      </p>
      <p>
        → <strong><a href="/blog/resume-skills-section-for-indian-freshers-2026">Blog 8: Skills Section</a></strong>
      </p>
      <p>
        → <strong><a href="#">Blog 10: How to Write the Certifications Section</a></strong> <em>(Coming next)</em>
      </p>

      <hr />

      <h2 id="build-education">14. Build Your Education Section Correctly From the Start</h2>
      <p>CareerForge.pro's resume builder structures the Education section in the correct reverse-chronological format, ready for ATS passing.</p>
    </BlogPostLayout>
  )
}
