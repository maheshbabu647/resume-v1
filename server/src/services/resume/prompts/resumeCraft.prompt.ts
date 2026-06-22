// resumeCraft.prompt.ts — the SINGLE SOURCE OF TRUTH for *how a resume should actually
// be written*. The tailoring prompts (quick / smart / inline) were each telling the LLM
// "rewrite bullets and add keywords" with no craft guidance — which is exactly what makes
// it dump keywords and produce weak prose. This module teaches the model the actual rules
// professional resume writers follow, so every tailoring path emits the same high quality.
//
// Import the blocks you need and drop them into a prompt. They are written to be composed,
// not edited per-prompt.

/**
 * How to write the prose of a resume: bullets, summary, and verbs.
 * This is the "teach the LLM to write" block.
 */
export const RESUME_WRITING_CRAFT = `## How To Write Resume Content (follow this precisely)

You are not summarizing the candidate — you are rewriting their resume the way a top-tier
professional resume writer would. Quality of writing matters as much as keyword coverage.

### Bullet points (experience, projects, internships, volunteering)
Every bullet MUST follow this anatomy:
  [Strong action verb] + [what you did, specifically] + [tools/skills used, where natural] + [measurable or concrete outcome].

Rules for bullets:
- START every bullet with a strong, past-tense action verb. GOOD: Led, Built, Designed, Architected, Automated, Reduced, Scaled, Migrated, Launched, Owned, Streamlined, Resolved, Optimized, Implemented, Delivered.
- BANNED openings — never start a bullet with these: "Responsible for", "Worked on", "Helped with", "Tasked with", "Assisted in", "Involved in", "Duties included". Rewrite them into an action + outcome.
- ONE accomplishment per bullet. No run-on sentences stitching three things together with commas and "and".
- Keep each bullet to ONE or TWO lines (~12–28 words). Tighten anything longer; split anything that covers two ideas.
- QUANTIFY impact whenever the source material supports it: %, time saved, $ , volume, scale, users, team size, latency. If the original resume gives no number and you cannot truthfully infer one, describe the SCOPE or OUTCOME qualitatively instead — NEVER invent a statistic.
- Lead with IMPACT, not mechanics. "Cut deployment time 40% by automating the CI pipeline with GitHub Actions" beats "Used GitHub Actions to set up CI."
- Order bullets within a role strongest-and-most-JD-relevant FIRST.
- 3–5 bullets for recent/relevant roles; 1–2 for older or less relevant ones.

### Professional summary
- 2–3 sentences, no bullet points, written in third-person implied voice (NO "I", "my", "me").
- Sentence 1: target title + years of experience + 1–2 strongest, JD-relevant strengths.
- Sentence 2–3: a signature achievement or domain depth, and what the candidate is aiming for — aligned to THIS role.
- Ban clichés and empty adjectives: "results-driven", "team player", "hard-working", "passionate", "go-getter", "synergy", "dynamic professional". Replace with concrete evidence.

### Skills section — list HARD skills only, never soft skills
- The Skills section is ONLY for concrete, verifiable HARD skills: technologies, languages, frameworks, libraries, tools, platforms, methods (e.g. python, react, kubernetes, sql, salesforce, agile, ci/cd, figma).
- Group these into a FEW logical categories (e.g. "Languages", "Frameworks & Libraries", "Cloud & DevOps", "Databases", "Tools"). Default category name is "Technical Skills" only when no grouping is sensible.
- Each entry in a skillList is an ATOMIC skill (1–4 words). NEVER a sentence, a duty, or a phrase ending in "skills/knowledge/concepts/fundamentals".
- Order the most JD-relevant skills first within each category.
- NEVER list a soft skill or personal trait here. "communication", "leadership", "teamwork", "problem-solving", "adaptability", "collaboration", "time management", "attention to detail" must NOT appear as Skills entries. Listing them is weak and meaningless — see the rule below.

### Soft skills & traits — DEMONSTRATE them in a sentence that contains the word
Soft skills (communication, leadership, teamwork, collaboration, problem-solving, adaptability, mentoring, ownership, attention to detail) must NEVER be a bare Skills entry. But they must NOT simply vanish either — a resume scanner still looks for these terms. The rule is: prove the trait in a REAL, evidence-backed sentence, and let the trait's exact word appear ONCE inside that sentence. This reads like a human wrote it AND lets the keyword be found.
- LEADERSHIP — if the candidate led a team / ran a project / organized an event (e.g. a hackathon): "Led a 4-person team at HackMIT, demonstrating leadership under a 24-hour deadline." The accomplishment is real; the word rides along once.
- COMMUNICATION — if the candidate presented, documented, or worked cross-functionally: "Presented model results to technical and non-technical stakeholders, strengthening cross-team communication."
- TEAMWORK / COLLABORATION — show the cross-team work and name it: "Collaborated with product and engineering teams to ship features, working effectively in a fast-paced team environment."
- PROBLEM-SOLVING / ATTENTION TO DETAIL — fold into a real bullet: "Debugged a data pipeline handling 142GB of records, applying careful attention to detail to ensure data integrity."
- The professional summary is a good home for ONE or TWO of these (e.g. "…a strong communicator who collaborates across teams"), but ONLY when the candidate's real story backs it.
- Place each soft-skill word ONCE, in the single most fitting spot. Do NOT sprinkle "communication" into five bullets, and do NOT invent an achievement just to host the word — if NOTHING in the candidate's material supports the trait, leave it out entirely.
- DISTINGUISH "knows it" from "lived it". A hard skill they HAVE = they know it → list it in Skills and/or use it in a bullet. A soft trait, or an experience like a hackathon, is something they LIVED → describe what they actually DID ("Built an ML prototype in 24 hours at a hackathon"), then let the trait word ride along once — never reduce the experience to a lone skill word.

### Voice & tone (applies everywhere)
- Concrete and specific over vague and generic. Cut filler words.
- Consistent tense: past tense for past roles, present tense only for the current role.
- Professional, confident, plain English. No buzzword soup.`

/**
 * How to use JD keywords WITHOUT producing the keyword-dump the user complained about.
 * This is the "stop dumping words here and there" block.
 */
export const KEYWORD_INTEGRATION_RULES = `## How To Use Job-Description Keywords (this is the part that usually goes wrong)

The goal is ATS coverage that still reads like a human-written resume. A keyword dump fails
both a recruiter AND a modern ATS. Follow these rules exactly:

- WEAVE keywords into real accomplishments. A keyword should be the natural subject or object
  of a sentence describing real work — NOT tacked onto the end of a bullet.
  GOOD:  "Built the customer dashboard in React, cutting support tickets 25%."
  BAD:   "Built the customer dashboard. Skills: React, Redux, TypeScript, Node, AWS, Docker."
- NEVER write a bullet that is a comma-separated list of technologies. Bullets describe what
  was DONE; the Skills section is where the keyword list lives.
- A technology may appear in an experience/project bullet ONLY if the candidate plausibly used
  it for that specific work. If it's just a skill they have, it belongs in the Skills section.
- COVERAGE OVER REPETITION. Make sure each important JD skill the candidate genuinely has
  appears at least ONCE in a fitting place (a bullet OR the Skills section). Do NOT repeat the
  same keyword across many bullets to pad density — once or twice, meaningfully, is enough.
- Match the JD's exact phrasing for a skill when the candidate has it (e.g. JD says "CI/CD",
  use "CI/CD" not "continuous integration") so the ATS matches — but only where it reads naturally.
- Do NOT force unrelated keywords into a role where they don't belong just to hit a count.

### Mirror the JD's RESPONSIBILITIES, not just its skills
ATS scoring rewards resumes that echo the DUTIES of the role, not only the tech keywords. For each
core responsibility in the JD, if the candidate's real experience supports it, reframe a bullet to
mirror the JD's own phrasing:
  - JD: "deploy models to production"        → bullet: "...deployed the model to production using Docker on GCP."
  - JD: "build feature engineering pipelines" → bullet: "...built a feature engineering pipeline over a 142GB dataset."
  - JD: "serve predictions via REST APIs"     → bullet: "...exposed model predictions through REST APIs."
  - JD: "collaborate cross-functionally"      → bullet: "...collaborated with product and engineering teams to..."
  - JD: "present findings to stakeholders"    → bullet: "...presented results to technical and non-technical stakeholders."
Use the JD's verbs and nouns where the candidate genuinely did that work. Never claim a duty they
did not perform — but do not leave an obvious match unstated either.`

/**
 * The final self-check that prevents the two specific failures the user reported:
 * (a) missing important skills the candidate actually has, and (b) sloppy writing.
 */
export const RESUME_COVERAGE_SELF_CHECK = `## Mandatory Self-Check Before You Respond
Re-read your output as if you were the hiring recruiter, and fix any failures BEFORE returning JSON:
1. COVERAGE: List (mentally) the JD's required skills. For every HARD skill the candidate
   genuinely has, confirm it appears at least once (in a bullet or the Skills section). Do NOT
   drop a real, relevant hard skill — missing important keywords is a failure.
2. NO DUMPING: Is any bullet just a list of technologies? Rewrite it into a real accomplishment.
   Are skills crammed into experience that belong in the Skills section? Move them.
2b. SOFT SKILLS: Scan the Skills section for any soft skill or trait (communication, leadership,
   teamwork, problem-solving, adaptability, attention to detail, etc.) and REMOVE every one from
   Skills. Then, for each soft skill the JD asks for, confirm its exact word appears ONCE inside a
   real, evidence-backed sentence in a bullet or the summary (not as a bare label) — or is left out
   if nothing in the candidate's material honestly supports it.
2c. RESPONSIBILITIES: Re-read the JD's main duties. For each one the candidate genuinely did,
   confirm a bullet mirrors the JD's phrasing (e.g. "deployed to production", "feature engineering",
   "REST APIs", "cross-functional"). Add the missing mirror where real experience supports it.
3. WRITING QUALITY: Does every bullet start with a strong action verb (no "Responsible for")?
   Is each one focused, tight, and impact-first? Fix any weak, vague, or run-on bullet.
4. HONESTY: Is every claim still supported by the candidate's real experience? Remove anything invented.
5. ATOMIC SKILLS: Is every skillList entry a clean atomic skill, never a sentence or duty?`
