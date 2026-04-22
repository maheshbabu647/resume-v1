import { BlogPostLayout } from '../BlogPostLayout'
import blogCover from '@/assets/blog-post-1-cover.png'

const TOC = [
  { id: 'why-it-matters', text: '1. Why the Skills Section Matters More for Freshers' },
  { id: 'three-tier-framework', text: '2. The Three-Tier Skills Framework' },
  { id: 'how-many', text: '3. How Many Skills Should a Fresher Include?' },
  { id: 'how-to-format', text: '4. How to Format the Skills Section for ATS' },
  { id: 'skills-by-stream', text: '5. Skills by Stream: Reference Lists' },
  { id: 'three-rules', text: '6. The Three Rules for Using This Section' },
  { id: 'what-to-remove', text: '7. What to Remove From Your Skills Section Right Now' },
  { id: 'checklist', text: '8. The Complete Skills Section Checklist' },
  { id: 'what-next', text: '9. Read Next in This Series' },
  { id: 'build-skills', text: '10. Build Your Skills Section With the Right Tools' }
]

export default function BlogPost8() {
  return (
    <BlogPostLayout
      slug="resume-skills-section-for-indian-freshers-2026"
      heroImagePath={blogCover}
      tocEntries={TOC}
    >
      <blockquote>
        <p><em>Neither of those phrases has ever passed an ATS filter.</em></p>
        <p><em>Neither of those phrases has ever made a recruiter lean forward.</em></p>
        <p><em>This blog explains what actually belongs in your skills section — and what is just taking up space.</em></p>
      </blockquote>

      <hr />

      <h2 id="why-it-matters">1. Why the Skills Section Matters More for Freshers</h2>
      <p>For freshers, your Skills section is the primary keyword location. If the JD asks for Python and it's in your Skills section, that's a match. If it's missing, you're missing out on match points.</p>

      <hr />

      <h2 id="three-tier-framework">2. The Three-Tier Skills Framework</h2>
      <p><strong>Tier 1 — Hard Technical Skills:</strong> Specific, verifiable things like Java, SQL, AutoCAD, Tally. These are your primary keywords.</p>
      <p><strong>Tier 2 — Methodology and Process:</strong> Agile, SDLC, REST API development. They add useful keyword weight.</p>
      <p><strong>Tier 3 — Soft Skills:</strong> Communication, teamwork. Include sparingly. Demonstrate these through project bullets instead of just listing them.</p>

      <hr />

      <h2 id="how-many">3. How Many Skills Should a Fresher Include?</h2>
      <p>Aim for <strong>10 to 18 skills</strong>. Below 10 looks thin; above 20 looks padded and invites more interview questions than you might be ready for.</p>

      <hr />

      <h2 id="how-to-format">4. How to Format the Skills Section for ATS</h2>
      <p><strong>Categorised list (Recommended):</strong> Group skills by category (Languages, Databases, Tools).</p>
      <p><strong>Simple comma-separated:</strong> Also works well for ATS parsing.</p>
      <p><strong>Skill bars or ratings (Avoid):</strong> ATS parsers cannot read graphic elements like filled bars or percentage ratings.</p>

      <hr />

      <h2 id="skills-by-stream">5. Skills by Stream: Reference Lists</h2>
      <h4>CSE / IT — Software Development</h4>
      <p>Java, Python, C++, JavaScript, SQL, Spring Boot, React.js, Node.js, MySQL, Git, AWS, REST API, Agile.</p>

      <h4>Mechanical Engineering</h4>
      <p>AutoCAD, SolidWorks, CATIA, ANSYS, CNC Programming, GD&T, MATLAB, MS Project.</p>

      <h4>MBA — Marketing</h4>
      <p>Google Analytics, Meta Ads Manager, SEO Fundamentals, Salesforce, Power BI, Market Research, Consumer Behaviour.</p>

      <hr />

      <h2 id="three-rules">6. The Three Rules for Using This Section</h2>
      <ol>
        <li>Only list what you can speak to in an interview.</li>
        <li>Match the JD's exact terminology (e.g., use "React.js" if the JD does).</li>
        <li>Let the proof live in your projects (a skill is a claim; a project is evidence).</li>
      </ol>

      <hr />

      <h2 id="what-to-remove">7. What to Remove From Your Skills Section Right Now</h2>
      <p>Remove "MS Office" (it's assumed), "Internet Browsing," "Hardworking," and anything you couldn't answer a basic question about.</p>

      <hr />

      <h2 id="checklist">8. The Complete Skills Section Checklist</h2>
      <ul>
        <li>All hard technical skills from target JD listed</li>
        <li>Soft skills limited or demonstrated through bullets</li>
        <li>No skill bars or percentage displays</li>
        <li>Terminology matches the JD's exact wording</li>
      </ul>

      <hr />

      <h2 id="what-next">9. Read Next in This Series</h2>
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
        → <strong><a href="#">Blog 9: How to Write the Education Section on an Indian Fresher Resume</a></strong> <em>(Coming next)</em>
      </p>

      <hr />

      <h2 id="build-skills">10. Build Your Skills Section With the Right Tools</h2>
      <p>CareerForge.pro's resume builder provides a structured Skills section that is pre-formatted for ATS compatibility.</p>
    </BlogPostLayout>
  )
}
