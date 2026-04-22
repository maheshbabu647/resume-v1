import { BlogPostLayout } from '../BlogPostLayout'
import blogCover from '@/assets/blog-post-1-cover.png'

const TOC = [
  { id: 'recruiters-read', text: '1. The Section Recruiters Actually Stop to Read' },
  { id: 'work-experience', text: '2. Why Projects Are Your Work Experience' },
  { id: 'what-counts', text: '3. What Counts as a Project' },
  { id: 'how-many', text: '4. How Many Projects to Include' },
  { id: 'structure', text: '5. The Structure: How to Write Each Project Entry' },
  { id: 'transformations', text: '6. Four Before and After Transformations' },
  { id: 'numbers', text: '7. Getting Numbers From Academic Projects' },
  { id: 'hackathons', text: '8. Hackathon Projects: How to Include Them' },
  { id: 'interview-connection', text: '9. The Interview Connection' },
  { id: 'checklist', text: '10. Projects Section Checklist' },
  { id: 'what-next', text: '11. Read Next in This Series' },
  { id: 'build-project', text: '12. Build Project Descriptions That Work' }
]

export default function BlogPost7() {
  return (
    <BlogPostLayout
      slug="how-to-write-the-projects-section-on-your-resume-2026"
      heroImagePath={blogCover}
      tocEntries={TOC}
    >
      <blockquote>
        <p><em>Every Indian fresher has the same problem: no work experience.</em></p>
        <p><em>But most of them have built things.</em></p>
        <p><em>The gap between "I built things" and "I have no experience" is entirely a writing problem — and this blog fixes it.</em></p>
      </blockquote>

      <hr />

      <h2 id="recruiters-read">1. The Section Recruiters Actually Stop to Read</h2>
      <p>When a recruiter opens your resume during a campus drive, they do a fast scan looking for two things: your CGPA (eligibility filter) and your projects (capability filter).</p>
      <p>Your CGPA tells them if you clear the minimum bar. Your projects tell them whether you can actually do the work.</p>
      <p>Most project sections on Indian fresher resumes are too vague. They name a project, list a few tools, and stop. This blog teaches you to write project descriptions that make the recruiter engage, give the ATS something concrete to match, and demonstrate you understand your own work.</p>

      <hr />

      <h2 id="work-experience">2. Why Projects Are Your Work Experience</h2>
      <p>A final year project, a hackathon submission, or a personal project — all of these are work you did, using skills a company wants. The writing framework for projects is identical to work experience bullets:</p>
      <ul>
        <li>What did you build or what problem did it solve?</li>
        <li>How did you build it — specific tools, technologies, methods?</li>
        <li>What was the result, outcome, or impact?</li>
      </ul>

      <hr />

      <h2 id="what-counts">3. What Counts as a Project</h2>
      <p>Definitely include: Final year project, mini-projects from coursework, personal projects, hackathon submissions, and virtual internship projects (AICTE, Internshala, etc.).</p>
      <p>Do not include: Assignments without tangible builds, projects you never started, or projects you cannot explain in an interview.</p>

      <hr />

      <h2 id="how-many">4. How Many Projects to Include</h2>
      <p>The right number is <strong>2 to 4</strong>. Quality beats quantity every time. Put your strongest, most relevant project first — where "strongest" means most technically impressive or most aligned to the job description.</p>

      <hr />

      <h2 id="structure">5. The Structure: How to Write Each Project Entry</h2>
      <pre style={{ background: 'var(--surface-container-high)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', fontSize: '13px', lineHeight: 1.7, overflowX: 'auto', fontFamily: 'var(--font-mono)' }}>{`Project Name | Technology 1, Technology 2, Technology 3
• What it is / what problem it solves (1 line)
• How you built it (specific tools, architecture, approach)
• Result / outcome / scale (with a number wherever possible)
• GitHub / demo link (if available and ready)`}</pre>

      <hr />

      <h2 id="transformations">6. Four Before and After Transformations</h2>
      <p>Specificity is the key to both ATS matching and human credibility. Compare these transformations:</p>
      
      <h4>CSE Web Development</h4>
      <p><strong>Before:</strong> Student Portal | HTML, CSS, JavaScript, PHP, MySQL</p>
      <p><strong>After:</strong> Student Academic Portal | PHP, MySQL, HTML, CSS, JavaScript, XAMPP</p>
      <ul>
        <li>Built a multi-user academic portal for a simulated college of 500 students.</li>
        <li>Implemented role-based access for students and admin using PHP sessions; MySQL database with relational schema across 6 normalised tables.</li>
        <li>Reduced manual record lookup time by approximately 60% in pilot simulation.</li>
      </ul>

      <hr />

      <h2 id="numbers">7. Getting Numbers From Academic Projects</h2>
      <p>You don't need real revenue to have metrics. Focus on:</p>
      <ul>
        <li><strong>Scale:</strong> "Tested with a dataset of 10,000 records"</li>
        <li><strong>Performance:</strong> "API response time under 80ms in load testing"</li>
        <li><strong>Accuracy:</strong> "87% classification accuracy on test sets"</li>
        <li><strong>Recognition:</strong> "Received highest project grade in the batch"</li>
      </ul>

      <hr />

      <h2 id="hackathons">8. Hackathon Projects: How to Include Them</h2>
      <p>Hackathon projects signal initiative and ability to build under pressure. Frame them around what you completed and any validation you received (finalist status, number of teams, panel feedback).</p>

      <hr />

      <h2 id="interview-connection">9. The Interview Connection</h2>
      <p>In fresher interviews, 60–80% of questions come from your projects. Only include what you can discuss deeply. Be prepared to explain every technology choice and challenge.</p>

      <hr />

      <h2 id="checklist">10. Projects Section Checklist</h2>
      <ul>
        <li>Project name is clear and professional</li>
        <li>Technology list is specific (tool names, not categories)</li>
        <li>At least one number, metric, or verifiable outcome</li>
        <li>Technologies match keywords from the target JD</li>
      </ul>

      <hr />

      <h2 id="what-next">11. Read Next in This Series</h2>
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
        → <strong><a href="/blog/ats-keywords-for-indian-freshers-2026">Blog 5: ATS Keywords</a></strong>
      </p>
      <p>
        → <strong><a href="/blog/how-to-write-a-resume-objective-for-freshers-in-india-2026">Blog 6: Resume Objective</a></strong>
      </p>
      <p>
        → <strong><a href="#">Blog 8: Resume Skills Section for Indian Freshers — What to Include, How to Format It</a></strong> <em>(Coming next)</em>
      </p>

      <hr />

      <h2 id="build-project">12. Build Project Descriptions That Work</h2>
      <p>CareerForge.pro's AI Bullet Point Writer helps you write project bullets that follow the what-how-outcome structure and include relevant keywords.</p>
    </BlogPostLayout>
  )
}
