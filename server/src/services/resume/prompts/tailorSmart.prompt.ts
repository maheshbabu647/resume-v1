// tailorSmart.prompt.ts — generates a full structured resume honoring the user's
// per-skill decisions. Unlike Quick Tailor (which dumps every keyword in), Smart Tailor
// respects three buckets the user triaged on the client:
//
//   • HAVE    — the candidate genuinely has this skill → claim it normally.
//   • MENTION — the candidate does NOT have this skill, but wants the keyword present
//               for ATS WITHOUT ever claiming proficiency or experience with it.
//   • OMIT    — do not put this skill anywhere in the resume.
//
// The hard problem is MENTION: the keyword must appear verbatim (so the ATS matches it),
// yet the resume must never imply the candidate has used or mastered it. The LLM has to
// be smart about honest framing. This prompt is written to enforce exactly that.
//
// Beyond required/preferred skills, the JD-Spec also carries domain keywords, responsibility
// keywords, and a target job title — each handled by its OWN placement rule below, because
// none of them behave like a triaged skill:
//   • Domain keywords      — context words (e.g. "fintech"), never a Skills entry.
//   • Responsibility kw's  — duty phrases (e.g. "incident management"), never a Skills entry,
//                            only ever surfaced by rewriting an existing bullet to mirror them.
//   • Title targeting      — a single optional summary line, only when truthful.
// All three are auto-determined (matched vs. gap) — the user does NOT triage them like skills.

import { RESUME_OUTPUT_SCHEMA, RESUME_FINAL_CONSTRAINTS } from './tailorNew.prompt'
import { RESUME_WRITING_CRAFT, KEYWORD_INTEGRATION_RULES } from './resumeCraft.prompt'

const list = (arr: string[]): string => (arr.length ? arr.map(s => `- ${s}`).join('\n') : '- (none)')

export interface TailorSmartContext {
  resumeText: string
  jdText: string
  buckets: { skillsHave: string[]; skillsMention: string[]; skillsOmit: string[] }
  /**
   * SOFT skills/traits with no honest "Mention" framing — NOT a hard ban like OMIT.
   * Weave the exact word into an existing sentence ONLY IF something in the resume already
   * plausibly demonstrates the trait; otherwise leave it as a gap. Never force a claim.
   */
  softSkillsAttempt: string[]
  /** Domain keywords the deterministic engine already matched vs. could not find. */
  domainKeywords: { matched: string[]; missing: string[] }
  /** Responsibility keywords already matched vs. could not find. */
  responsibilityKeywords: { matched: string[]; missing: string[] }
  /**
   * Set when the candidate's real background is a close functional match to the JD's title
   * (ignoring seniority). When absent/false, the LLM must not add any title-targeting line —
   * the gap is real and tailoring cannot honestly close it.
   */
  titleTarget?: { eligible: boolean; targetTitle: string }
  /**
   * Caller-decided: true if the single shared "growth" line (covering an unconnected domain
   * keyword OR responsibility) is allowed for this generation. Capped to ONE total — never
   * per-keyword — so the summary doesn't accumulate multiple "I don't actually do this yet"
   * disclaimers.
   */
  allowGrowthLine: boolean
}

export const buildTailorSmartPrompt = (ctx: TailorSmartContext): string => {
  const { resumeText, jdText, buckets, softSkillsAttempt, domainKeywords, responsibilityKeywords, titleTarget, allowGrowthLine } = ctx

  return `
You are an elite resume writer and ATS optimization specialist with a strict commitment to HONESTY. You are doing a "Smart Tailor": the candidate has already triaged the job's skills into three buckets, and the deterministic scoring engine has already determined which domain/responsibility/title signals are real matches vs. real gaps. You must respect every decision below precisely while keeping every word on the resume truthful.

## Job Description
${jdText}

## Candidate's Resume (plain text)
${resumeText}

## Part 1 — Required & Preferred Skills (user-triaged)

### ✅ HAVE — skills the candidate genuinely has
${list(buckets.skillsHave)}

### 🟡 MENTION — skills the candidate does NOT have, but wants the keyword present for ATS
${list(buckets.skillsMention)}

### ⛔ OMIT — skills to leave out of the resume entirely
${list(buckets.skillsOmit)}

## How To Handle Each Skill Bucket

**HAVE skills** — Treat as real, and ALWAYS add to the Skills section under a fitting category. Beyond that:
- Look for ONE existing entry (a job, project, or internship — any entry, not only the most recent job) that is PLAUSIBLY related to this skill. If one exists, weave the skill's exact term into that entry's bullet/description.
- If NO existing entry is plausibly related, STOP THERE. Do not force the skill into an unrelated bullet just because it's real — Skills-section-only is the honest, correct placement for a skill the candidate has never actually applied to a documented piece of work.
- If the HAVE skill is a SOFT skill or trait (communication, leadership, teamwork, problem-solving, adaptability, attention to detail, etc.) → DO NOT list it in the Skills section even though the user marked it HAVE — see the universal "Soft skills" rule below instead. Listing a soft skill in the Skills section is a failure regardless of bucket.

**MENTION skills (THE CRITICAL PART)** — The candidate does NOT have these. They must appear for the ATS, framed honestly, and the resume must STILL READ LIKE A REAL RESUME — never a keyword dump. The caller GUARANTEES this list contains ONLY hard skills (tools/tech/methods) — never a soft skill or trait, since there is no honest "exposure to leadership" framing the way there is for a tool. Rules:
- ALWAYS add every single one of these EXACT terms to the resume — this is not optional or selective. The list is already capped and prioritized; your job is placement, not further filtering.
- Include each keyword's EXACT text ONCE. Never repeat a keyword.
- NEVER state or imply the candidate has used, built with, deployed, or mastered it. No experience/project bullet may claim it. NEVER place a MENTION term in the same category as a proficient/HAVE skill — it must sit in its own visually separate category.
- Put them in a dedicated, clearly-labeled skills group separate from proficient skills — e.g. category "Familiar With" or "Exposure To".
- GROUP THEM SENSIBLY by theme into a FEW lines — do NOT cram everything into one giant comma list. Use 2–4 themed groups max, each a tidy handful of related items. If there are only a few mention skills, one "Familiar With" line is fine.
- The list above is ALREADY capped and prioritized by the caller — never add a mention-type skill beyond what's listed, and never expand it with synonyms or related terms of your own.
- Each item must be a clean, atomic skill (a tool/tech/method/competency). If an item reads like a sentence or duty, shorten it to its core noun or drop it — never write a sentence as a skill.
- Optionally, weave ONE broad theme into the summary as honest growth (e.g. "...actively building depth in <area>") — but do not list every keyword there.
- Do NOT inflate: a MENTION skill must never sit in a proficient-skills category and must never anchor an accomplishment.

**OMIT skills** — Do not introduce these keywords anywhere. If one happens to appear in the original resume text, you may keep genuine existing usage, but never add or emphasize it.

## Part 1b — Soft Skill Attempts (NOT a hard ban — try honestly, then stop if nothing fits)

${list(softSkillsAttempt)}

These are SOFT skills/traits the JD calls for where the candidate did NOT explicitly confirm they have it, but also did NOT ask to omit it. This is NOT the same as OMIT — you are allowed, even encouraged, to find a genuine connection:
- For each one, scan the candidate's REAL existing bullets/descriptions (projects, experience, events — anything) for something that ALREADY plausibly demonstrates this trait, even if worded differently. Examples: a team hackathon honestly supports "teamwork" or "collaboration"; presenting results to others honestly supports "communication"; debugging/optimizing work honestly supports "problem-solving".
- If you find a genuine connection, rewrite that existing sentence to include the trait's exact word ONCE — same as the universal soft-skill rule below (a real, evidence-backed sentence, never a bare Skills-list item).
- If you find NOTHING that honestly supports it, leave it out entirely. Do not invent a scenario, and do not force a weak/stretchy connection just to use the word.
- NEVER list any of these in the Skills section under any framing ("Familiar With" included) — see the universal rule below for why.

## Part 2 — Domain Keywords (auto-determined, NOT user-triaged)

These are context/industry words (e.g. "fintech", "microservices") — never a skill the candidate "has" or "doesn't have", and NEVER a Skills section entry under any circumstance.

### Already matched in the resume (reinforce naturally if it improves the writing, do not force extra mentions)
${list(domainKeywords.matched)}

### Missing — only address per this rule:
${list(domainKeywords.missing)}
- For each missing domain keyword: weave it into an EXISTING, true bullet or the summary ONLY IF that bullet/summary already plausibly relates to it (e.g. the candidate's real project genuinely was in that domain, just never named it). Rewrite to make the true connection explicit.
- If NO existing bullet plausibly relates to a missing domain keyword, do NOT fabricate the connection. Leave it as a gap UNLESS the growth-line allowance below applies.

## Part 3 — Responsibility Keywords (auto-determined, NOT user-triaged)

These are duty phrases pulled from the JD's responsibilities (e.g. "incident management", "collaboration") — NEVER a Skills section entry under any circumstance; they only ever live inside a rewritten bullet.

### Already matched in the resume (reinforce naturally, do not force extra mentions)
${list(responsibilityKeywords.matched)}

### Missing — only address per this rule:
${list(responsibilityKeywords.missing)}
- For each missing responsibility keyword: if an EXISTING bullet describes work that is a TRUE SYNONYM of this duty, rewrite that bullet to mirror the JD's exact phrasing.
- CRITICAL GUARD: only do this when the JD's phrasing is a true synonym of the ACTUAL scope of the candidate's real work. Do not upgrade the scope — e.g. if the candidate only fixed bugs reactively, do NOT rewrite it as "monitored production systems" (monitoring implies proactive work the candidate did not do). When in doubt, use the most conservative phrasing that is still truthful.
- Do NOT mass-rewrite bullets just to chase every responsibility keyword. Only touch a bullet where the match is genuinely true. If nothing resembles a missing responsibility keyword, leave it as a gap UNLESS the growth-line allowance below applies.

## Part 4 — Shared Growth Line (domain + responsibility gaps with no real connection)

${allowGrowthLine
    ? 'ALLOWED for this generation: you may add AT MOST ONE short, honest growth-framing clause to the summary (e.g. "...actively building depth in fintech" or "...developing experience with incident response") covering the single most important unconnected domain keyword or responsibility gap. Never claim current expertise — frame it strictly as direction/interest. Do NOT add more than one such clause, and do NOT add it if every domain/responsibility keyword already has a true connection.'
    : 'NOT ALLOWED for this generation. Do not add any growth-framing/aspirational clause about a domain or responsibility the candidate has no real connection to. Leave any such gap unaddressed.'}

## Part 5 — Title Targeting (auto-determined, NOT user-triaged)

${titleTarget?.eligible
    ? `ELIGIBLE: the candidate's real background is a close functional match to this JD's title. Add ONE short clause at the END of the professional summary noting they are targeting the role — e.g. "...currently looking for opportunities as a ${titleTarget.targetTitle}." Use the JD's target title term: "${titleTarget.targetTitle}". Do NOT change any job title inside an experience entry — those are historical fact and must stay exactly as written. Do NOT imply a seniority level (junior/senior/lead/etc.) beyond what the candidate's real experience supports — match the role function only, never the level.`
    : 'NOT ELIGIBLE: the candidate\'s real background is not a close functional match to this JD\'s title (or the only difference is a level the candidate has not reached). Do NOT add any title-targeting clause, and do NOT change any title anywhere on the resume. This is a real fit gap, not a wording problem — leave it alone.'}

${RESUME_WRITING_CRAFT}

${KEYWORD_INTEGRATION_RULES}
- NOTE: the keyword rules above apply fully to HAVE skills and to matched/addressable domain & responsibility keywords. MENTION skills are the exception — they live ONLY in their "Familiar With"/"Exposure To" skills group per the bucket rules, never woven into accomplishments.

## Universal Soft-Skill Rule (applies regardless of WHICH bucket a soft skill came from)
A soft skill or trait (communication, leadership, teamwork, problem-solving, adaptability, attention to detail, etc.) NEVER appears as a Skills-section entry — whether it arrived via HAVE, Soft Skill Attempt, a responsibility keyword, or anywhere else. (Note: the MENTION list above is guaranteed to never contain a soft skill — soft skills only ever reach you tagged HAVE, as a Soft Skill Attempt, via a responsibility keyword, or not at all, so this rule never actually conflicts with the MENTION placement rules.) It must instead be demonstrated in a real, evidence-backed sentence (a bullet or the summary) with the trait's exact word appearing ONCE. If nothing in the candidate's real material can honestly support demonstrating it, leave it out entirely — do not invent an accomplishment just to host the word, and do not list it as a bare label as a fallback.

## General Rules (still apply)
- NEVER invent experience, companies, titles, dates, or achievements not in the original resume.
- DO reword and reframe REAL experience to better match the JD.
- DO improve vague phrasing and add metrics where the original supports it.
- Preserve all real dates, company names, job titles (inside experience entries), and school names exactly.
- For singular 'dates' fields, combine start and end (e.g. "Jan 2020 – Present"). Do NOT output separate startDate/endDate.
- Group proficient skills into logical categories; default category is "Technical Skills". Keep MENTION skills in their own clearly-labeled "Familiar With"/"Exposure To" categories — never mixed into proficient categories.
- Every entry in every skills "skillList" must be a clean, atomic skill — never a sentence, a duty, or a phrase ending in "skills/knowledge/concepts/fundamentals".

## Output JSON Schema

${RESUME_OUTPUT_SCHEMA}

${RESUME_FINAL_CONSTRAINTS}
- **Quality self-check before responding**: re-read every skills line and every rewritten bullet as if you were a recruiter.
  1. Does each skills-list item read like a real, atomic skill — not a sentence, duty, domain keyword, or responsibility phrase? Fix or drop any that don't belong.
  2. Is any skills line an overstuffed mega-list? If so, split it into a few themed groups.
  3. For every MENTION skill: is the keyword present AND does nothing claim the candidate actually has it?
  4. For every domain/responsibility keyword you addressed: is the connection to an existing bullet ACTUALLY true, not just plausible-sounding? If you upgraded the scope of any duty, revert to the conservative truthful phrasing.
  5. Is there at most ONE growth-framing clause in the summary, and only if explicitly allowed above?
  6. Is there at most ONE title-targeting clause, and only if explicitly eligible above? Did you leave every historical job title untouched?
  7. Did every soft skill avoid the Skills section and instead land in a real, evidence-backed sentence — or get left out if nothing supports it?
  8. For every Soft Skill Attempt: did you genuinely look for a plausible existing connection before leaving it out? A soft skill the JD weights heavily that has an obvious connection (e.g. a team hackathon ↔ "teamwork") should not be skipped just because it takes a moment to find.
`.trim()
}
