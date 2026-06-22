import { useMemo, useState } from 'react'
import {
  Sparkles, Check, ArrowRight, ArrowLeft, Loader2, ShieldCheck, Info, Target, Sprout,
} from 'lucide-react'
import { projectAtsScore, buildSmartTailorAux } from '../lib/atsMatchEngine'
import { getScoreColor } from '../lib/scoreColor'
import type { AtsMatchResult, SmartTailorSkill, SmartTailorDecision, SmartTailorBuckets } from '../types/scoring.types'
import styles from './SmartTailorStudio.module.css'

// What the user decides about the two auto-determined (non-triaged) extras — whether to
// actually include the single growth-line and/or the title-targeting clause, even when
// the engine says they're eligible. The engine only ever offers these; the user consents.
export interface SmartTailorExtras {
  allowGrowthLine: boolean
  includeTitleTarget: boolean
}

interface Props {
  baseline: AtsMatchResult
  generating?: boolean
  ctaLabel?: string
  onGenerate: (buckets: SmartTailorBuckets, decisions: SmartTailorSkill[], extras: SmartTailorExtras) => void
  onBack: () => void
}

// HARD skills get Have / Mention / Leave out. SOFT skills/traits get Have / Attempt / Leave
// out instead — "Mention" has no honest meaning for a trait (you can't claim "exposure to
// leadership" the way you can claim "exposure to Kubernetes"), but an outright ban is too
// blunt too: if something in the resume already plausibly demonstrates the trait, it should
// still be allowed to surface honestly. "Attempt" is that middle ground.
const HARD_DECISIONS: { value: SmartTailorDecision; label: string; hint: string }[] = [
  { value: 'have', label: 'Have it', hint: 'Claimed normally as a real skill' },
  { value: 'mention', label: 'Mention', hint: "Keyword kept for ATS — never claims you've mastered it" },
  { value: 'omit', label: 'Leave out', hint: 'Excluded from the resume — lowers your score' },
]
const SOFT_DECISIONS: { value: SmartTailorDecision; label: string; hint: string }[] = [
  { value: 'have', label: 'Have it', hint: 'Claimed normally — demonstrated in a real sentence, never listed as a skill' },
  { value: 'attempt', label: 'Attempt', hint: 'Only added if something in your resume already plausibly shows it — never forced' },
  { value: 'omit', label: 'Leave out', hint: "Never mentioned, even if something might plausibly support it" },
]

// Caps on how many "Mention" (don't-have, keyword-only) skills can go in the resume at once.
// Every Mention is something the candidate may have to explain in an interview — capping it
// keeps the resume honest-feeling and keeps the candidate from over-committing to gaps they
// haven't actually prepared to discuss. Required gets the tightest cap since those carry the
// most weight; the combined cap bounds total interview-exposure risk regardless of the split.
const REQUIRED_MENTION_CAP = 3
const PREFERRED_MENTION_CAP = 5
const COMBINED_MENTION_CAP = 8

// Derive decisions from the real ATS baseline so the screen's "in your resume" flags and
// the live projection use the exact same source of truth as the editor score.
//
// Two honesty/cap rules are enforced HERE, at default-build time, not just in the UI's
// click-handlers — otherwise the very first payload sent to the LLM can already violate
// both the caps and the soft-skill rule before the user touches anything:
//   1. A missing SOFT skill/trait defaults to "Attempt" — eligible for honest weaving if
//      something in the resume already plausibly demonstrates it, but never an outright ban
//      and never a forced claim. (Mention is never offered for soft skills at all.)
//   2. Missing HARD skills default to Mention, but only up to the caps — excess candidates
//      (lowest weight first) default to Omit instead, so the initial state the user sees is
//      already what gets sent, never a silently-truncated version of it.
const buildDecisions = (baseline: AtsMatchResult): SmartTailorSkill[] => {
  const make = (bucket: 'required' | 'preferred') => (m: AtsMatchResult['requiredSkills'][number]): SmartTailorSkill => ({
    term: m.term,
    weight: m.weight,
    type: m.type,
    bucket,
    matched: m.matched,
    decision: m.matched ? 'have' : (m.type === 'soft' ? 'attempt' : 'mention'),
  })
  const all = [
    ...baseline.requiredSkills.map(make('required')),
    ...baseline.preferredSkills.map(make('preferred')),
  ]

  const capBucketDefaults = (bucket: 'required' | 'preferred', cap: number) => {
    const mentioned = all.filter(d => d.bucket === bucket && d.decision === 'mention')
    if (mentioned.length <= cap) return
    const keep = new Set([...mentioned].sort((a, b) => b.weight - a.weight).slice(0, cap).map(d => d.term))
    all.forEach(d => { if (d.bucket === bucket && d.decision === 'mention' && !keep.has(d.term)) d.decision = 'omit' })
  }
  capBucketDefaults('required', REQUIRED_MENTION_CAP)
  capBucketDefaults('preferred', PREFERRED_MENTION_CAP)

  const combinedMentioned = all.filter(d => d.decision === 'mention')
  if (combinedMentioned.length > COMBINED_MENTION_CAP) {
    const keep = new Set([...combinedMentioned].sort((a, b) => b.weight - a.weight).slice(0, COMBINED_MENTION_CAP).map(d => d.term))
    all.forEach(d => { if (d.decision === 'mention' && !keep.has(d.term)) d.decision = 'omit' })
  }

  return all
}

export default function SmartTailorStudio({
  baseline, generating, ctaLabel = 'Continue', onGenerate, onBack,
}: Props) {
  const [decisions, setDecisions] = useState<SmartTailorSkill[]>(() => buildDecisions(baseline))

  // Domain keywords, responsibility keywords, and title-targeting are auto-determined by the
  // engine (matched vs. gap, eligible vs. not) — the user doesn't triage them per-term like a
  // skill, but DOES get to consent to whether the two optional additions happen at all.
  const aux = useMemo(() => buildSmartTailorAux(baseline), [baseline])
  const hasGrowthCandidate = aux.allowGrowthLine
  const titleEligible = aux.titleTarget?.eligible ?? false
  const [includeGrowthLine, setIncludeGrowthLine] = useState(true)
  const [includeTitleTarget, setIncludeTitleTarget] = useState(true)

  const setDecision = (term: string, decision: SmartTailorDecision) =>
    setDecisions(prev => prev.map(d => (d.term === term ? { ...d, decision } : d)))

  const includedTerms = useMemo(
    () => new Set(decisions.filter(d => d.decision !== 'omit').map(d => d.term)),
    [decisions],
  )
  const projected = useMemo(() => projectAtsScore(baseline, includedTerms), [baseline, includedTerms])

  const omittedCount = decisions.length - includedTerms.size
  const mentionCount = decisions.filter(d => d.decision === 'mention').length
  const color = getScoreColor(projected.score)
  const baselineScore = baseline.score
  const delta = projected.score - baselineScore

  const required = decisions.filter(d => d.bucket === 'required')
  const preferred = decisions.filter(d => d.bucket === 'preferred')

  const mentionCountRequired = required.filter(d => d.decision === 'mention').length
  const mentionCountPreferred = preferred.filter(d => d.decision === 'mention').length
  const mentionCountTotal = mentionCountRequired + mentionCountPreferred

  // Whether `d` is allowed to become a Mention right now. Already-mentioned items are always
  // allowed (so switching them to something else and back doesn't get blocked by their own count).
  // Soft skills/traits never qualify — there's no honest "exposure to leadership" framing the
  // way there is for a tool, so the only honest choices for them are Have or Leave out.
  const canMention = (d: SmartTailorSkill): boolean => {
    if (d.type === 'soft') return false
    if (d.decision === 'mention') return true
    if (mentionCountTotal >= COMBINED_MENTION_CAP) return false
    if (d.bucket === 'required' && mentionCountRequired >= REQUIRED_MENTION_CAP) return false
    if (d.bucket === 'preferred' && mentionCountPreferred >= PREFERRED_MENTION_CAP) return false
    return true
  }

  const handleGenerate = () => {
    onGenerate(
      {
        skillsHave: decisions.filter(d => d.decision === 'have').map(d => d.term),
        skillsMention: decisions.filter(d => d.decision === 'mention').map(d => d.term),
        skillsOmit: decisions.filter(d => d.decision === 'omit').map(d => d.term),
        softSkillsAttempt: decisions.filter(d => d.decision === 'attempt').map(d => d.term),
      },
      decisions,
      {
        allowGrowthLine: hasGrowthCandidate && includeGrowthLine,
        includeTitleTarget: titleEligible && includeTitleTarget,
      },
    )
  }

  const renderRow = (d: SmartTailorSkill) => (
    <div key={`${d.bucket}-${d.term}`} className={styles.skillRow}>
      <div className={styles.skillInfo}>
        <span className={styles.skillTerm}>{d.term}</span>
        <span className={styles.skillMeta}>
          {d.weight >= 3 && <span className={styles.mustTag}>Must-have</span>}
          {d.matched
            ? <span className={styles.inResume}><Check size={11} /> In your resume</span>
            : <span className={styles.notInResume}>Not in your resume</span>}
        </span>
      </div>

      <div className={styles.segmented} role="radiogroup" aria-label={`How to handle ${d.term}`}>
        {(d.type === 'soft' ? SOFT_DECISIONS : HARD_DECISIONS).map(opt => {
          const blocked = opt.value === 'mention' && !canMention(d)
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={d.decision === opt.value}
              title={blocked ? `Mention cap reached for ${d.bucket} skills — switch another skill off Mention first` : opt.hint}
              disabled={blocked}
              className={`${styles.segBtn} ${d.decision === opt.value ? styles[`seg_${opt.value}`] : ''}`}
              onClick={() => setDecision(d.term, opt.value)}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className={styles.studio}>
      {/* Skill triage */}
      <div className={styles.main}>
        <div className={styles.head}>
          <span className={styles.eyebrow}><Sparkles size={13} /> Smart Tailor</span>
          <h2 className={styles.title}>Decide how to handle each skill</h2>
          <p className={styles.sub}>
            <strong>Have it</strong> and <strong>Mention</strong> both keep the keyword so the ATS still
            matches it — only <strong>Leave out</strong> lowers your score. Anything you mark “Mention” is
            woven in honestly, without ever claiming you've mastered it. Soft skills/traits (communication,
            teamwork, etc.) get <strong>Attempt</strong> instead of Mention — they're only added if something
            already in your resume honestly supports them.
          </p>
        </div>

        {required.length > 0 && (
          <section className={styles.group}>
            <div className={styles.groupHead}>
              <span className={styles.groupDot} style={{ background: 'var(--coral)' }} />
              <h3 className={styles.groupTitle}>Required skills</h3>
              <span className={styles.groupCount}>{required.length}</span>
              <span className={styles.capHint} style={{ color: mentionCountRequired >= REQUIRED_MENTION_CAP ? 'var(--coral)' : undefined }}>
                {mentionCountRequired}/{REQUIRED_MENTION_CAP} mentioned
              </span>
            </div>
            <div className={styles.rows}>{required.map(renderRow)}</div>
          </section>
        )}

        {preferred.length > 0 && (
          <section className={styles.group}>
            <div className={styles.groupHead}>
              <span className={styles.groupDot} style={{ background: 'var(--brand)' }} />
              <h3 className={styles.groupTitle}>Preferred skills</h3>
              <span className={styles.groupCount}>{preferred.length}</span>
              <span className={styles.capHint} style={{ color: mentionCountPreferred >= PREFERRED_MENTION_CAP ? 'var(--coral)' : undefined }}>
                {mentionCountPreferred}/{PREFERRED_MENTION_CAP} mentioned
              </span>
            </div>
            <div className={styles.rows}>{preferred.map(renderRow)}</div>
          </section>
        )}

        {decisions.length > 0 && (
          <p className={styles.combinedCapHint} style={{ color: mentionCountTotal >= COMBINED_MENTION_CAP ? 'var(--coral)' : undefined }}>
            {mentionCountTotal}/{COMBINED_MENTION_CAP} total mentions used — each one is something you should be ready to discuss in an interview.
          </p>
        )}

        {decisions.length === 0 && (
          <div className={styles.empty}>No required or preferred skills were extracted from this job description.</div>
        )}

        <section className={styles.group}>
          <div className={styles.groupHead}>
            <span className={styles.groupDot} style={{ background: 'var(--amber, #d97706)' }} />
            <h3 className={styles.groupTitle}>Domain, responsibilities & title</h3>
          </div>
          <p className={styles.sub} style={{ maxWidth: 'none' }}>
            These aren't triaged per-term like skills — the engine already knows which ones are
            true to your resume and which are real gaps. You only decide whether to include the
            two optional, honest additions below.
          </p>

          <div className={styles.extrasCard}>
            <div className={styles.extrasIcon}><Target size={15} /></div>
            <div className={styles.extrasBody}>
              <span className={styles.extrasTitle}>Title targeting</span>
              {titleEligible ? (
                <span className={styles.extrasDesc}>
                  Your background closely matches this role. We can add one line at the end of your
                  summary: "...currently looking for opportunities as a <strong>{aux.titleTarget!.targetTitle}</strong>."
                  Your real job titles are never changed.
                </span>
              ) : (
                <span className={styles.extrasDescMuted}>
                  Not eligible — your background isn't a close functional match to "{baseline.jobTitle}"
                  (or the gap is seniority, not function). We won't suggest a title-targeting line, since
                  that would overstate the fit.
                </span>
              )}
            </div>
            {titleEligible && (
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={includeTitleTarget}
                  onChange={(e) => setIncludeTitleTarget(e.target.checked)}
                />
                <span className={styles.toggleTrack}><span className={styles.toggleKnob} /></span>
              </label>
            )}
          </div>

          <div className={styles.extrasCard}>
            <div className={styles.extrasIcon}><Sprout size={15} /></div>
            <div className={styles.extrasBody}>
              <span className={styles.extrasTitle}>Growth line</span>
              {hasGrowthCandidate ? (
                <span className={styles.extrasDesc}>
                  Some domain/responsibility keywords in this JD have no real connection to your
                  resume yet. We can add ONE honest line to your summary (e.g. "...actively building
                  depth in {`<area>`}") — framed as direction, never as current expertise.
                </span>
              ) : (
                <span className={styles.extrasDescMuted}>
                  Not applicable — every domain keyword and responsibility this JD calls for already
                  has a real connection to your resume.
                </span>
              )}
            </div>
            {hasGrowthCandidate && (
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={includeGrowthLine}
                  onChange={(e) => setIncludeGrowthLine(e.target.checked)}
                />
                <span className={styles.toggleTrack}><span className={styles.toggleKnob} /></span>
              </label>
            )}
          </div>
        </section>
      </div>

      {/* Live score rail */}
      <aside className={styles.rail}>
        <div className={styles.railCard}>
          <div className={styles.ringWrap}>
            <div className={styles.ring} style={{ borderColor: color, color }}>{projected.score}</div>
            <div className={styles.ringMeta}>
              <span className={styles.ringLabel} style={{ color }}>{projected.label}</span>
              <span className={styles.ringCaption}>Projected ATS score</span>
            </div>
          </div>

          {delta !== null && (
            <div className={styles.deltaRow}>
              <span className={styles.deltaNow}>Now {baselineScore}</span>
              <ArrowRight size={13} />
              <span className={styles.deltaNext} style={{ color }}>{projected.score}</span>
              {delta !== 0 && (
                <span className={`${styles.deltaPill} ${delta > 0 ? styles.deltaUp : styles.deltaDown}`}>
                  {delta > 0 ? `+${delta}` : delta}
                </span>
              )}
            </div>
          )}

          <div className={styles.statRow}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{includedTerms.size}</span>
              <span className={styles.statLabel}>Kept in resume</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum} style={{ color: mentionCount ? '#d97706' : undefined }}>{mentionCount}</span>
              <span className={styles.statLabel}>Mentioned</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum} style={{ color: omittedCount ? 'var(--coral)' : undefined }}>{omittedCount}</span>
              <span className={styles.statLabel}>Left out</span>
            </div>
          </div>

          <div className={styles.honestNote}>
            <ShieldCheck size={14} />
            <span>Nothing on your resume will claim a skill you don't have.</span>
          </div>

          <button className={styles.generateBtn} onClick={handleGenerate} disabled={generating || decisions.length === 0}>
            {generating
              ? <><Loader2 size={16} className="spin" /> Generating…</>
              : <><Sparkles size={16} /> {ctaLabel} <ArrowRight size={16} /></>}
          </button>
          <button className={styles.backBtn} onClick={onBack} disabled={generating}>
            <ArrowLeft size={14} /> Back
          </button>

          <p className={styles.railHint}><Info size={12} /> Changes apply straight to your resume — Undo reverts them.</p>
        </div>
      </aside>
    </div>
  )
}
