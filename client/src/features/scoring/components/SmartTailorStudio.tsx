import { useMemo, useState } from 'react'
import {
  Sparkles, Check, ArrowRight, ArrowLeft, Loader2, ShieldCheck, Info,
} from 'lucide-react'
import { projectAtsScore } from '../lib/atsMatchEngine'
import { getScoreColor } from '../lib/scoreColor'
import type { AtsMatchResult, SmartTailorSkill, SmartTailorDecision, SmartTailorBuckets } from '../types/scoring.types'
import styles from './SmartTailorStudio.module.css'

interface Props {
  baseline: AtsMatchResult
  generating?: boolean
  ctaLabel?: string
  onGenerate: (buckets: SmartTailorBuckets, decisions: SmartTailorSkill[]) => void
  onBack: () => void
}

const DECISIONS: { value: SmartTailorDecision; label: string; hint: string }[] = [
  { value: 'have', label: 'Have it', hint: 'Claimed normally as a real skill' },
  { value: 'mention', label: 'Mention', hint: "Keyword kept for ATS — never claims you've mastered it" },
  { value: 'omit', label: 'Leave out', hint: 'Excluded from the resume — lowers your score' },
]

// Derive decisions from the real ATS baseline so the screen's "in your resume" flags and
// the live projection use the exact same source of truth as the editor score.
const buildDecisions = (baseline: AtsMatchResult): SmartTailorSkill[] => {
  const make = (bucket: 'required' | 'preferred') => (m: AtsMatchResult['requiredSkills'][number]): SmartTailorSkill => ({
    term: m.term,
    weight: m.weight,
    type: m.type,
    bucket,
    matched: m.matched,
    // Matched → keep as a real skill. Missing → default to the honest "Mention" path
    // (keyword stays for ATS without overclaiming) — the recommended middle ground.
    decision: m.matched ? 'have' : 'mention',
  })
  return [
    ...baseline.requiredSkills.map(make('required')),
    ...baseline.preferredSkills.map(make('preferred')),
  ]
}

export default function SmartTailorStudio({
  baseline, generating, ctaLabel = 'Continue', onGenerate, onBack,
}: Props) {
  const [decisions, setDecisions] = useState<SmartTailorSkill[]>(() => buildDecisions(baseline))

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

  const handleGenerate = () => {
    onGenerate(
      {
        skillsHave: decisions.filter(d => d.decision === 'have').map(d => d.term),
        skillsMention: decisions.filter(d => d.decision === 'mention').map(d => d.term),
        skillsOmit: decisions.filter(d => d.decision === 'omit').map(d => d.term),
      },
      decisions,
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
        {DECISIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={d.decision === opt.value}
            title={opt.hint}
            className={`${styles.segBtn} ${d.decision === opt.value ? styles[`seg_${opt.value}`] : ''}`}
            onClick={() => setDecision(d.term, opt.value)}
          >
            {opt.label}
          </button>
        ))}
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
            woven in honestly, without ever claiming you've mastered it.
          </p>
        </div>

        {required.length > 0 && (
          <section className={styles.group}>
            <div className={styles.groupHead}>
              <span className={styles.groupDot} style={{ background: 'var(--coral)' }} />
              <h3 className={styles.groupTitle}>Required skills</h3>
              <span className={styles.groupCount}>{required.length}</span>
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
            </div>
            <div className={styles.rows}>{preferred.map(renderRow)}</div>
          </section>
        )}

        {decisions.length === 0 && (
          <div className={styles.empty}>No required or preferred skills were extracted from this job description.</div>
        )}
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
