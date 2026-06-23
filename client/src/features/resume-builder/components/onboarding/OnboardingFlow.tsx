import { useState, useRef, useMemo, useEffect } from 'react'
import {
  ArrowRight, ArrowLeft, Check, X, Plus, Sparkles, User, Mail, Phone,
  MapPin, Link2, GraduationCap, Code2, Pencil, RefreshCw, Send, HelpCircle,
} from 'lucide-react'
import styles from './OnboardingFlow.module.css'

// ── Types ────────────────────────────────────────────────────────────────────
interface EducationEntry {
  id: number
  degree: string
  field: string
  school: string
  startYear: string
  endYear: string
  gradeType: 'cgpa' | 'percentage' | 'marks'
  gradeValue: string
  gradeScale: string
}

export function formatGrade(e: Pick<EducationEntry, 'gradeType' | 'gradeValue' | 'gradeScale'>): string {
  if (!e.gradeValue.trim()) return ''
  if (e.gradeType === 'percentage') return `${e.gradeValue}%`
  if (e.gradeType === 'marks') return `${e.gradeValue}/${e.gradeScale || '500'}`
  return `${e.gradeValue}/${e.gradeScale || '10'}`
}

const GRADE_TYPE_LABELS: Record<EducationEntry['gradeType'], string> = {
  cgpa: 'CGPA',
  percentage: 'Percentage',
  marks: 'Marks',
}

export interface OnboardingData {
  name: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  portfolio: string
  education: EducationEntry[]
  skills: string[]
  objective: string
  headline: string
}

interface StepDef {
  id: string
  label: string
  required: boolean
  skippable?: boolean
}

const STEPS: StepDef[] = [
  { id: 'name', label: 'Name', required: true },
  { id: 'contact', label: 'Contact', required: true },
  { id: 'location', label: 'Location', required: false, skippable: true },
  { id: 'links', label: 'Links', required: false, skippable: true },
  { id: 'education', label: 'Education', required: true },
  { id: 'skills', label: 'Skills', required: false, skippable: true },
  { id: 'review', label: 'Review', required: true },
]

const emptyData: OnboardingData = {
  name: '', email: '', phone: '',
  location: '',
  linkedin: '', github: '', portfolio: '',
  education: [],
  skills: [],
  objective: '',
  headline: '',
}

// ── Root ─────────────────────────────────────────────────────────────────────
interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void
  onExit: () => void
}

export default function OnboardingFlow({ onComplete, onExit }: OnboardingFlowProps) {
  const [stepIdx, setStepIdx] = useState(0)
  const [skipped, setSkipped] = useState<Set<string>>(new Set())
  const [data, setData] = useState<OnboardingData>(emptyData)
  const [askAi, setAskAi] = useState<{ open: boolean; field: string | null }>({ open: false, field: null })

  const visibleSteps = STEPS.filter(s => !skipped.has(s.id))
  const currentStep = STEPS[stepIdx]
  const visibleIdx = visibleSteps.findIndex(s => s.id === currentStep.id)

  function go(delta: number) {
    let next = stepIdx + delta
    while (next >= 0 && next < STEPS.length && skipped.has(STEPS[next].id)) next += delta
    if (next < 0) next = 0
    if (next >= STEPS.length) next = STEPS.length - 1
    setStepIdx(next)
  }

  function skip() {
    setSkipped(s => new Set([...s, currentStep.id]))
    go(1)
  }

  const update = (patch: Partial<OnboardingData>) => setData(d => ({ ...d, ...patch }))

  const canContinue = (() => {
    if (currentStep.id === 'name') return !!data.name.trim()
    if (currentStep.id === 'contact') return /\S+@\S+\.\S+/.test(data.email)
    if (currentStep.id === 'education') return data.education.length > 0
    return true
  })()

  const isLast = currentStep.id === 'review'

  return (
    <div className={styles.page}>
      <div className={styles.ambientGlow} aria-hidden />

      <OnboardingHeader visibleSteps={visibleSteps} visibleIdx={visibleIdx} onExit={onExit} />

      <main className={styles.main}>
        <div className={styles.stepWrap}>
          <div className={styles.stepNumeral} aria-hidden>
            {String(visibleIdx + 1).padStart(2, '0')}
          </div>
          <div className={styles.stepContent} key={currentStep.id}>
            <StepView step={currentStep} data={data} update={update} onAskAi={field => setAskAi({ open: true, field })} />
          </div>
        </div>
      </main>

      <OnboardingFooter
        canBack={stepIdx > 0}
        canContinue={canContinue}
        canSkip={!!currentStep.skippable}
        isLast={isLast}
        onBack={() => go(-1)}
        onSkip={skip}
        onContinue={() => (isLast ? onComplete(data) : go(1))}
      />

      {askAi.open && (
        <AskAiPanel field={askAi.field} data={data} onClose={() => setAskAi({ open: false, field: null })} />
      )}
    </div>
  )
}

// ── Header ───────────────────────────────────────────────────────────────────
function OnboardingHeader({ visibleSteps, visibleIdx, onExit }: { visibleSteps: StepDef[]; visibleIdx: number; onExit: () => void }) {
  return (
    <header className={styles.header}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, background: 'var(--brand)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="30" height="30" viewBox="0 0 64 64" fill="none">
            <path d="M42,21 A13,13 0 1 0 42,43" stroke="white" strokeWidth="6" strokeLinecap="round" />
            <line x1="42" y1="21" x2="48" y2="21" stroke="white" strokeWidth="6" strokeLinecap="round" />
            <line x1="42" y1="32" x2="47" y2="32" stroke="white" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, color: 'var(--dark)', letterSpacing: '-0.3px' }}>CareerForge</span>
      </div>

      <div className={styles.headerProgress}>
        {visibleSteps.map((s, i) => (
          <div
            key={s.id}
            className={`${styles.progressDot} ${i === visibleIdx ? styles.progressDotActive : i < visibleIdx ? styles.progressDotDone : ''}`}
          />
        ))}
        <span className={styles.progressCount}>{visibleIdx + 1} / {visibleSteps.length}</span>
      </div>

      <button className={styles.exitBtn} onClick={onExit}>Save & exit</button>
    </header>
  )
}

// ── Footer ───────────────────────────────────────────────────────────────────
function OnboardingFooter({ canBack, canContinue, canSkip, isLast, onBack, onSkip, onContinue }: {
  canBack: boolean; canContinue: boolean; canSkip: boolean; isLast: boolean
  onBack: () => void; onSkip: () => void; onContinue: () => void
}) {
  return (
    <footer className={styles.footer}>
      <button className={styles.backBtn} onClick={onBack} disabled={!canBack}>
        <ArrowLeft size={14} strokeWidth={2.2} /> Back
      </button>

      <div className={styles.footerRight}>
        {canSkip && !isLast && (
          <button className={styles.skipBtn} onClick={onSkip}>Skip for now</button>
        )}
        <button className={styles.continueBtn} onClick={onContinue} disabled={!canContinue}>
          {isLast ? 'Open in editor' : 'Continue'}
          <ArrowRight size={15} strokeWidth={2.4} />
        </button>
      </div>
    </footer>
  )
}

// ── Step router ──────────────────────────────────────────────────────────────
function StepView({ step, data, update, onAskAi }: {
  step: StepDef; data: OnboardingData; update: (patch: Partial<OnboardingData>) => void; onAskAi: (field: string) => void
}) {
  switch (step.id) {
    case 'name': return <NameStep data={data} update={update} />
    case 'contact': return <ContactStep data={data} update={update} />
    case 'location': return <LocationStep data={data} update={update} />
    case 'links': return <LinksStep data={data} update={update} onAskAi={onAskAi} />
    case 'education': return <EducationStep data={data} update={update} onAskAi={onAskAi} />
    case 'skills': return <SkillsStep data={data} update={update} onAskAi={onAskAi} />
    case 'review': return <ReviewStep data={data} update={update} />
    default: return null
  }
}

// ── Shared primitives ────────────────────────────────────────────────────────
function StepHeader({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div className={styles.stepHeader}>
      {eyebrow && <div className={styles.stepEyebrow}>{eyebrow}</div>}
      <h1 className={styles.stepTitle}>{title}</h1>
      {sub && <p className={styles.stepSub}>{sub}</p>}
    </div>
  )
}

function BigInput({ value, onChange, placeholder, type = 'text', autoFocus, leftIcon, ariaLabel, onEnter }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string
  autoFocus?: boolean; leftIcon?: React.ReactNode; ariaLabel?: string; onEnter?: () => void
}) {
  const [focus, setFocus] = useState(false)
  return (
    <div className={`${styles.bigInputWrap} ${focus ? styles.bigInputWrapFocus : ''}`}>
      {leftIcon && <div className={`${styles.bigInputIcon} ${focus ? styles.bigInputIconFocus : ''}`}>{leftIcon}</div>}
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        autoFocus={autoFocus} aria-label={ariaLabel}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        onKeyDown={e => { if (e.key === 'Enter' && onEnter) onEnter() }}
        className={`${styles.bigInput} ${leftIcon ? styles.bigInputWithIcon : ''}`}
      />
    </div>
  )
}

function AskAiLink({ field, label = 'Not sure what to put? Ask AI', onAskAi }: { field: string; label?: string; onAskAi: (field: string) => void }) {
  return (
    <button className={styles.askAiLink} onClick={() => onAskAi(field)}>
      <Sparkles size={13} /> {label}
    </button>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className={styles.fieldLabel}>{children}</label>
}

// ── Step 1: Name ─────────────────────────────────────────────────────────────
function NameStep({ data, update }: { data: OnboardingData; update: (p: Partial<OnboardingData>) => void }) {
  return (
    <>
      <StepHeader
        eyebrow="The basics"
        title="What should we call you?"
        sub="Your name, as you'd like recruiters to see it at the top of your resume."
      />
      <BigInput value={data.name} onChange={v => update({ name: v })}
        placeholder="Arjun Kapoor" autoFocus leftIcon={<User size={17} strokeWidth={1.8} />} ariaLabel="Full name" />
    </>
  )
}

// ── Step 2: Contact ──────────────────────────────────────────────────────────
function ContactStep({ data, update }: { data: OnboardingData; update: (p: Partial<OnboardingData>) => void }) {
  return (
    <>
      <StepHeader
        eyebrow={data.name ? `Nice to meet you, ${data.name.split(' ')[0]}` : 'How to reach you'}
        title="How can recruiters reach you?"
        sub="Email is required. Phone is optional — most callbacks come via phone, but you can leave it for now."
      />
      <div className={styles.fieldGrid}>
        <div>
          <FieldLabel>Email <span className={styles.fieldRequired}>·</span></FieldLabel>
          <BigInput value={data.email} onChange={v => update({ email: v })} type="email"
            placeholder="you@email.com" autoFocus leftIcon={<Mail size={17} strokeWidth={1.8} />} ariaLabel="Email" />
        </div>
        <div>
          <FieldLabel>Phone <span className={styles.fieldOptional}>· optional</span></FieldLabel>
          <BigInput value={data.phone} onChange={v => update({ phone: v })} type="tel"
            placeholder="+91 98765 43210" leftIcon={<Phone size={17} strokeWidth={1.8} />} ariaLabel="Phone" />
        </div>
      </div>
    </>
  )
}

// ── Step 3: Location ─────────────────────────────────────────────────────────
const LOCATION_SUGGESTIONS = ['Bengaluru, India', 'Mumbai, India', 'Hyderabad, India', 'Pune, India', 'Delhi NCR, India', 'Remote']

function LocationStep({ data, update }: { data: OnboardingData; update: (p: Partial<OnboardingData>) => void }) {
  return (
    <>
      <StepHeader
        eyebrow="Where you are"
        title="Where are you based?"
        sub="Many recruiters filter by location. Just a city is fine — or pick 'Remote' if you're open to anywhere."
      />
      <BigInput value={data.location} onChange={v => update({ location: v })}
        placeholder="Bengaluru, India" autoFocus leftIcon={<MapPin size={17} strokeWidth={1.8} />} ariaLabel="Location" />
      <div className={styles.suggestWrap}>
        <div className={styles.suggestLabel}>Popular</div>
        <div className={styles.suggestRow}>
          {LOCATION_SUGGESTIONS.map(s => (
            <button
              key={s}
              className={`${styles.suggestChip} ${data.location === s ? styles.suggestChipActive : ''}`}
              onClick={() => update({ location: s })}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

// ── Step 4: Links ────────────────────────────────────────────────────────────
function LinksStep({ data, update, onAskAi }: { data: OnboardingData; update: (p: Partial<OnboardingData>) => void; onAskAi: (field: string) => void }) {
  return (
    <>
      <StepHeader
        eyebrow="Show yourself off"
        title="Got any profiles to link?"
        sub="LinkedIn for everyone. GitHub if you code, a portfolio if you've got one. All optional — skip and add later."
      />
      <div className={styles.fieldGrid} style={{ gap: 14 }}>
        <div>
          <FieldLabel>LinkedIn</FieldLabel>
          <BigInput value={data.linkedin} onChange={v => update({ linkedin: v })}
            placeholder="linkedin.com/in/yourname" leftIcon={<Link2 size={17} strokeWidth={1.8} />} ariaLabel="LinkedIn URL" />
        </div>
        <div>
          <FieldLabel>GitHub <span className={styles.fieldOptional}>· optional</span></FieldLabel>
          <BigInput value={data.github} onChange={v => update({ github: v })}
            placeholder="github.com/yourname" leftIcon={<Code2 size={17} strokeWidth={1.8} />} ariaLabel="GitHub URL" />
        </div>
        <div>
          <FieldLabel>Portfolio site <span className={styles.fieldOptional}>· optional</span></FieldLabel>
          <BigInput value={data.portfolio} onChange={v => update({ portfolio: v })}
            placeholder="yourname.com" leftIcon={<Link2 size={17} strokeWidth={1.8} />} ariaLabel="Portfolio URL" />
        </div>
      </div>
      <AskAiLink field="links" label="What links should I include for my role?" onAskAi={onAskAi} />
    </>
  )
}

// ── Step 5: Education (multi-entry) ─────────────────────────────────────────
type EducationDraft = Omit<EducationEntry, 'id'>

const emptyDraft: EducationDraft = { degree: '', field: '', school: '', startYear: '', endYear: '', gradeType: 'cgpa', gradeValue: '', gradeScale: '10' }

function EducationStep({ data, update, onAskAi }: { data: OnboardingData; update: (p: Partial<OnboardingData>) => void; onAskAi: (field: string) => void }) {
  const [mode, setMode] = useState<'list' | 'edit'>(data.education.length === 0 ? 'edit' : 'list')
  const [draft, setDraft] = useState<EducationDraft>(emptyDraft)
  const [editingId, setEditingId] = useState<number | null>(null)

  function startAdd() {
    setDraft(emptyDraft)
    setEditingId(null)
    setMode('edit')
  }

  function startEdit(entry: EducationEntry) {
    setDraft({
      degree: entry.degree, field: entry.field, school: entry.school,
      startYear: entry.startYear, endYear: entry.endYear,
      gradeType: entry.gradeType, gradeValue: entry.gradeValue, gradeScale: entry.gradeScale,
    })
    setEditingId(entry.id)
    setMode('edit')
  }

  function saveEntry() {
    if (!draft.degree.trim() || !draft.school.trim()) return
    if (editingId !== null) {
      update({ education: data.education.map(e => e.id === editingId ? { ...draft, id: editingId } : e) })
    } else {
      update({ education: [...data.education, { ...draft, id: Date.now() }] })
    }
    setDraft(emptyDraft)
    setEditingId(null)
    setMode('list')
  }

  function cancelEdit() {
    setDraft(emptyDraft)
    setEditingId(null)
    setMode('list')
  }

  function removeEntry(id: number) {
    update({ education: data.education.filter(e => e.id !== id) })
  }

  const canSaveDraft = !!(draft.degree.trim() && draft.school.trim())

  return (
    <>
      <StepHeader
        eyebrow="Your background"
        title={editingId !== null
          ? 'Edit this education'
          : data.education.length === 0 ? 'Tell us about your education' : 'Add more education?'}
        sub={editingId !== null
          ? 'Update the details below and save your changes.'
          : data.education.length === 0
            ? 'Start with your most recent degree. You can add older ones after.'
            : 'You can add another degree or move on. Most people add 1–2 entries.'}
      />

      {mode === 'list' && data.education.length > 0 && (
        <div className={styles.eduList}>
          {data.education.map(e => (
            <div key={e.id} className={styles.eduCard}>
              <div className={styles.eduCardLeft}>
                <div className={styles.eduIcon}><GraduationCap size={18} /></div>
                <div className={styles.eduInfo}>
                  <div className={styles.eduDegree}>
                    {e.degree}{e.field && <span className={styles.eduField}> in {e.field}</span>}
                  </div>
                  <div className={styles.eduMeta}>
                    {e.school}{(e.startYear || e.endYear) && ` · ${e.startYear || ''}${e.startYear && e.endYear ? '–' : ''}${e.endYear || ''}`}{formatGrade(e) && ` · ${GRADE_TYPE_LABELS[e.gradeType]} ${formatGrade(e)}`}
                  </div>
                </div>
              </div>
              <div className={styles.eduCardActions}>
                <button className={styles.eduEditBtn} aria-label="Edit" onClick={() => startEdit(e)}>
                  <Pencil size={14} strokeWidth={2} />
                </button>
                <button className={styles.eduRemoveBtn} aria-label="Remove" onClick={() => removeEntry(e.id)}>
                  <X size={15} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}

          <button className={styles.addEduBtn} onClick={startAdd}>
            <Plus size={16} strokeWidth={2.2} /> Add another education
          </button>
        </div>
      )}

      {mode === 'edit' && (
        <div>
          <div className={styles.fieldGrid}>
            <div>
              <FieldLabel>Degree <span className={styles.fieldRequired}>·</span></FieldLabel>
              <BigInput value={draft.degree} onChange={v => setDraft(d => ({ ...d, degree: v }))}
                placeholder="B.Tech" autoFocus ariaLabel="Degree" />
            </div>
            <div>
              <FieldLabel>Field of study</FieldLabel>
              <BigInput value={draft.field} onChange={v => setDraft(d => ({ ...d, field: v }))}
                placeholder="Computer Science" ariaLabel="Field" />
            </div>
            <div>
              <FieldLabel>School / University <span className={styles.fieldRequired}>·</span></FieldLabel>
              <BigInput value={draft.school} onChange={v => setDraft(d => ({ ...d, school: v }))}
                placeholder="IIT Bombay" ariaLabel="School" />
            </div>
            <div className={styles.fieldGridThree}>
              <div>
                <FieldLabel>Start year</FieldLabel>
                <BigInput value={draft.startYear} onChange={v => setDraft(d => ({ ...d, startYear: v }))}
                  placeholder="2019" ariaLabel="Start year" />
              </div>
              <div>
                <FieldLabel>End year</FieldLabel>
                <BigInput value={draft.endYear} onChange={v => setDraft(d => ({ ...d, endYear: v }))}
                  placeholder="2023" ariaLabel="End year" />
              </div>
              <div />
            </div>

            <div>
              <FieldLabel>Grade <span className={styles.fieldOptional}>· optional</span></FieldLabel>
              <div className={styles.gradeRow}>
                <div className={styles.gradeTypeGroup}>
                  <button
                    type="button"
                    className={`${styles.gradeTypeBtn} ${draft.gradeType === 'cgpa' ? styles.gradeTypeBtnActive : ''}`}
                    onClick={() => setDraft(d => ({ ...d, gradeType: 'cgpa', gradeScale: d.gradeScale === '100' || d.gradeScale === '500' ? '10' : d.gradeScale }))}
                  >
                    CGPA
                  </button>
                  <button
                    type="button"
                    className={`${styles.gradeTypeBtn} ${draft.gradeType === 'percentage' ? styles.gradeTypeBtnActive : ''}`}
                    onClick={() => setDraft(d => ({ ...d, gradeType: 'percentage', gradeScale: '100' }))}
                  >
                    Percentage
                  </button>
                  <button
                    type="button"
                    className={`${styles.gradeTypeBtn} ${draft.gradeType === 'marks' ? styles.gradeTypeBtnActive : ''}`}
                    onClick={() => setDraft(d => ({ ...d, gradeType: 'marks', gradeScale: d.gradeScale === '10' || d.gradeScale === '100' ? '500' : d.gradeScale }))}
                  >
                    Marks
                  </button>
                </div>
                <div className={styles.gradeValueWrap}>
                  <div className={styles.gradeInput}>
                    <BigInput value={draft.gradeValue} onChange={v => setDraft(d => ({ ...d, gradeValue: v }))}
                      placeholder={draft.gradeType === 'percentage' ? '85' : draft.gradeType === 'marks' ? '450' : '8.4'} ariaLabel="Grade value" />
                  </div>
                  {draft.gradeType !== 'percentage' && (
                    <>
                      <span className={styles.gradeSeparator}>/</span>
                      <div className={styles.gradeInput}>
                        <BigInput value={draft.gradeScale} onChange={v => setDraft(d => ({ ...d, gradeScale: v }))}
                          placeholder={draft.gradeType === 'marks' ? '500' : '10'} ariaLabel="Grade scale" />
                      </div>
                    </>
                  )}
                  {draft.gradeType === 'percentage' && <span className={styles.gradeSeparator}>%</span>}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.eduFormActions}>
            <AskAiLink field="education" label="Should I include high school? What if my CGPA is low?" onAskAi={onAskAi} />
            <div style={{ flex: 1 }} />
            {data.education.length > 0 && (
              <button className={styles.eduCancelBtn} onClick={cancelEdit}>Cancel</button>
            )}
            <button className={styles.eduSaveBtn} onClick={saveEntry} disabled={!canSaveDraft}>
              <Check size={14} strokeWidth={2.4} /> {editingId !== null ? 'Save changes' : 'Save education'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// ── Step 6: Skills ───────────────────────────────────────────────────────────
const SKILL_DB = [
  // Web & frontend
  'React', 'React Native', 'Redux', 'Redux Toolkit', 'Zustand', 'MobX', 'Next.js', 'Remix', 'Gatsby',
  'Vue', 'Vue Router', 'Vuex', 'Pinia', 'Nuxt.js', 'Angular', 'AngularJS', 'RxJS', 'NgRx',
  'Svelte', 'SvelteKit', 'Solid.js', 'Ember.js', 'jQuery', 'Alpine.js', 'Web Components', 'Lit',
  'HTML', 'HTML5', 'CSS', 'CSS3', 'Sass', 'LESS', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'Chakra UI',
  'Ant Design', 'Styled Components', 'Emotion', 'CSS Modules', 'Responsive Design', 'Web Accessibility (WCAG)',
  'Progressive Web Apps', 'WebSockets', 'WebRTC', 'GraphQL', 'Apollo Client', 'REST APIs',
  'Webpack', 'Vite', 'Babel', 'ESLint', 'Prettier', 'npm', 'Yarn', 'pnpm', 'Storybook',

  // Programming languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'Kotlin', 'Swift', 'Objective-C', 'Dart', 'Go', 'Rust',
  'C', 'C++', 'C#', 'PHP', 'Ruby', 'Scala', 'Elixir', 'Erlang', 'Haskell', 'Clojure', 'R', 'MATLAB',
  'Perl', 'Lua', 'Shell Scripting', 'Bash', 'PowerShell', 'Assembly', 'Solidity', 'Groovy', 'F#', 'Julia',

  // Backend & frameworks
  'Node.js', 'Express.js', 'NestJS', 'Fastify', 'Koa.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
  'Spring Framework', 'Hibernate', '.NET', '.NET Core', 'ASP.NET', 'Ruby on Rails', 'Laravel', 'Symfony',
  'CodeIgniter', 'Phoenix Framework', 'gRPC', 'Microservices', 'Serverless Architecture', 'Event-Driven Architecture',
  'Domain-Driven Design', 'Message Queues', 'RabbitMQ', 'Apache Kafka', 'Apache Pulsar',

  // Databases & data stores
  'SQL', 'PostgreSQL', 'MySQL', 'MariaDB', 'SQLite', 'Microsoft SQL Server', 'Oracle Database',
  'MongoDB', 'Redis', 'Cassandra', 'DynamoDB', 'Couchbase', 'Firebase Firestore', 'Firebase Realtime DB',
  'Elasticsearch', 'Neo4j', 'Supabase', 'Database Design', 'Database Optimization', 'Data Modeling',
  'ETL', 'Data Warehousing', 'Snowflake', 'BigQuery', 'Redshift', 'Apache Airflow', 'dbt',

  // Cloud & DevOps
  'AWS', 'Amazon EC2', 'Amazon S3', 'AWS Lambda', 'Amazon RDS', 'AWS CloudFormation', 'AWS IAM',
  'Google Cloud Platform (GCP)', 'Microsoft Azure', 'Docker', 'Kubernetes', 'Helm', 'Terraform',
  'Ansible', 'Pulumi', 'Chef', 'Puppet', 'CI/CD', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'CircleCI',
  'Travis CI', 'ArgoCD', 'Prometheus', 'Grafana', 'Datadog', 'New Relic', 'Splunk', 'ELK Stack',
  'Nginx', 'Apache HTTP Server', 'Load Balancing', 'Site Reliability Engineering (SRE)', 'Infrastructure as Code',
  'Linux Administration', 'Windows Server Administration', 'Networking', 'DNS Management', 'Cloudflare',

  // Version control & tools
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN', 'Jira', 'Confluence', 'Trello', 'Asana', 'Notion',
  'Linear', 'ClickUp', 'Monday.com', 'Slack', 'Microsoft Teams',

  // Mobile
  'iOS Development', 'Android Development', 'Flutter', 'Xamarin', 'Ionic', 'SwiftUI', 'UIKit',
  'Jetpack Compose', 'Android Jetpack', 'App Store Optimization', 'Mobile App Testing',

  // QA & testing
  'Unit Testing', 'Integration Testing', 'End-to-End Testing', 'Test-Driven Development (TDD)',
  'Behavior-Driven Development (BDD)', 'Jest', 'Mocha', 'Cypress', 'Playwright', 'Selenium',
  'JUnit', 'PyTest', 'TestNG', 'Postman', 'API Testing', 'Performance Testing', 'Load Testing (JMeter)',
  'Manual Testing', 'Test Automation', 'Quality Assurance', 'Regression Testing',

  // Data, AI & ML
  'Data Analysis', 'Data Visualization', 'Data Cleaning', 'Statistical Analysis', 'Predictive Modeling',
  'Pandas', 'NumPy', 'SciPy', 'Matplotlib', 'Seaborn', 'Plotly', 'scikit-learn', 'TensorFlow', 'PyTorch',
  'Keras', 'Machine Learning', 'Deep Learning', 'Natural Language Processing (NLP)', 'Computer Vision',
  'Large Language Models (LLMs)', 'Prompt Engineering', 'Generative AI', 'MLOps', 'Hugging Face Transformers',
  'Reinforcement Learning', 'Time Series Analysis', 'A/B Testing', 'Recommendation Systems',
  'Tableau', 'Power BI', 'Looker', 'Excel', 'Advanced Excel', 'Google Sheets', 'SAS', 'SPSS', 'Apache Spark', 'Hadoop',

  // Cybersecurity
  'Cybersecurity', 'Network Security', 'Penetration Testing', 'Ethical Hacking', 'Vulnerability Assessment',
  'SIEM', 'Incident Response', 'Cryptography', 'Identity and Access Management (IAM)', 'OWASP',
  'Security Auditing', 'Risk Assessment', 'Compliance (SOC 2, ISO 27001)', 'Firewall Management', 'Zero Trust Architecture',

  // Product & business analysis
  'Product Management', 'Product Strategy', 'Product Roadmapping', 'Product Discovery', 'User Research',
  'Market Research', 'Competitive Analysis', 'Requirements Gathering', 'Business Analysis', 'Wireframing',
  'Prototyping', 'OKRs', 'KPI Tracking', 'Stakeholder Management', 'Go-to-Market Strategy',
  'Pricing Strategy', 'Customer Journey Mapping', 'Feature Prioritization', 'Backlog Management',

  // Project management & methodologies
  'Project Management', 'Agile Methodology', 'Scrum', 'Kanban', 'Lean Methodology', 'Six Sigma',
  'Waterfall Methodology', 'Risk Management', 'Resource Planning', 'Budget Management', 'PMP Certification',
  'Change Management', 'Process Improvement', 'Vendor Management', 'Cross-functional Team Leadership',

  // Design (UX/UI/Graphic)
  'UI Design', 'UX Design', 'User Interface Design', 'User Experience Design', 'Interaction Design',
  'Figma', 'Sketch', 'Adobe XD', 'Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign',
  'Adobe After Effects', 'Adobe Premiere Pro', 'Canva', 'Framer', 'InVision', 'Zeplin',
  'Design Systems', 'Usability Testing', 'User Personas', 'Information Architecture', 'Motion Design',
  'Graphic Design', 'Typography', 'Branding', 'Illustration', '3D Modeling', 'Blender', 'Figma Prototyping',

  // Marketing
  'Digital Marketing', 'Content Marketing', 'Social Media Marketing', 'Email Marketing', 'SEO',
  'SEM (Search Engine Marketing)', 'Google Ads', 'Meta Ads', 'LinkedIn Ads', 'PPC Advertising',
  'Marketing Automation', 'HubSpot', 'Mailchimp', 'Google Analytics', 'Google Tag Manager',
  'Conversion Rate Optimization (CRO)', 'Content Strategy', 'Copywriting', 'Brand Strategy',
  'Influencer Marketing', 'Affiliate Marketing', 'Marketing Analytics', 'Growth Marketing', 'CRM (Salesforce/HubSpot)',
  'Public Relations', 'Event Marketing', 'Video Editing', 'Community Management',

  // Sales & customer success
  'Sales', 'B2B Sales', 'B2C Sales', 'Account Management', 'Lead Generation', 'Cold Calling',
  'Salesforce', 'HubSpot CRM', 'Negotiation', 'Customer Relationship Management', 'Customer Success',
  'Customer Support', 'Customer Retention', 'Upselling', 'Sales Forecasting', 'Pipeline Management', 'Zendesk',

  // Finance & accounting
  'Financial Analysis', 'Financial Modeling', 'Financial Reporting', 'Budgeting', 'Forecasting',
  'Accounting', 'Bookkeeping', 'Tax Preparation', 'Auditing', 'QuickBooks', 'SAP', 'Oracle Financials',
  'Investment Analysis', 'Valuation', 'Cost Accounting', 'Accounts Payable',
  'Accounts Receivable', 'Payroll Management', 'Financial Planning & Analysis (FP&A)', 'Excel Modeling',
  'Bloomberg Terminal', 'Equity Research', 'Mergers & Acquisitions (M&A)',

  // HR & recruiting
  'Human Resources', 'Talent Acquisition', 'Recruiting', 'Employee Onboarding', 'Performance Management',
  'Compensation & Benefits', 'HRIS (Workday, BambooHR)', 'Employee Relations', 'Training & Development',
  'Diversity, Equity & Inclusion (DEI)', 'Organizational Development', 'Conflict Resolution', 'Labor Law Compliance',

  // Legal
  'Legal Research', 'Contract Drafting', 'Contract Negotiation', 'Compliance', 'Intellectual Property Law',
  'Corporate Law', 'Litigation Support', 'Legal Writing', 'Regulatory Affairs', 'Due Diligence',

  // Operations & supply chain
  'Operations Management', 'Supply Chain Management', 'Logistics', 'Inventory Management',
  'Procurement', 'Vendor Negotiation', 'Quality Control', 'Lean Manufacturing', 'Process Optimization',
  'Warehouse Management', 'ERP Systems (SAP, Oracle)', 'Demand Planning', 'Production Planning',

  // Healthcare
  'Patient Care', 'Clinical Documentation', 'Electronic Health Records (EHR)', 'Medical Terminology',
  'HIPAA Compliance', 'Nursing', 'Pharmacology', 'Healthcare Administration', 'Medical Billing & Coding',
  'Telehealth', 'Public Health', 'Clinical Research',

  // Education
  'Curriculum Development', 'Lesson Planning', 'Classroom Management', 'Instructional Design',
  'E-Learning Development', 'Learning Management Systems (LMS)', 'Educational Technology', 'Tutoring',
  'Academic Advising', 'Special Education',

  // Engineering (non-software)
  'AutoCAD', 'SolidWorks', 'Mechanical Design', 'Electrical Engineering', 'Circuit Design',
  'PCB Design', 'Embedded Systems', 'Robotics', 'CAD/CAM', 'CNC Machining', 'Civil Engineering',
  'Structural Analysis', 'MATLAB Simulink', 'PLC Programming', 'Quality Assurance (Manufacturing)',
  '3D Printing', 'IoT (Internet of Things)',

  // Soft skills & general
  'Communication', 'Written Communication', 'Public Speaking', 'Presentation Skills', 'Team Leadership',
  'People Management', 'Problem Solving', 'Critical Thinking', 'Decision Making', 'Time Management',
  'Adaptability', 'Creativity', 'Collaboration', 'Mentoring', 'Strategic Planning', 'Attention to Detail',
  'Multitasking', 'Emotional Intelligence', 'Conflict Management', 'Active Listening',

  // Languages
  'English', 'Spanish', 'French', 'German', 'Mandarin Chinese', 'Japanese', 'Korean', 'Hindi',
  'Arabic', 'Portuguese', 'Italian', 'Russian', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Marathi',
]

const SKILL_COOCCUR: Record<string, string[]> = {
  'react': ['TypeScript', 'Next.js', 'Tailwind CSS', 'Redux'],
  'python': ['Django', 'Pandas', 'NumPy', 'Flask'],
  'figma': ['Sketch', 'Adobe XD', 'Photoshop'],
  'aws': ['Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
  'product management': ['Roadmapping', 'Agile', 'Stakeholder Management', 'A/B Testing'],
}

function SkillsStep({ data, update, onAskAi }: { data: OnboardingData; update: (p: Partial<OnboardingData>) => void; onAskAi: (field: string) => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const matches = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return SKILL_DB.filter(s => s.toLowerCase().includes(q) && !data.skills.includes(s)).slice(0, 6)
  }, [query, data.skills])

  const aiSuggestions = useMemo(() => {
    if (data.skills.length === 0) return ['React', 'TypeScript', 'Node.js', 'Python', 'Figma', 'SQL']
    const has = new Set(data.skills.map(s => s.toLowerCase()))
    const out = new Set<string>()
    data.skills.forEach(s => {
      const related = SKILL_COOCCUR[s.toLowerCase()] || []
      related.forEach(r => { if (!has.has(r.toLowerCase())) out.add(r) })
    })
    return [...out].slice(0, 6)
  }, [data.skills])

  function addSkill(s: string) {
    const v = s.trim()
    if (!v || data.skills.includes(v)) return
    update({ skills: [...data.skills, v] })
    setQuery('')
    inputRef.current?.focus()
  }
  function removeSkill(s: string) {
    update({ skills: data.skills.filter(x => x !== s) })
  }

  return (
    <>
      <StepHeader
        eyebrow="What you bring"
        title="What are you good at?"
        sub="Add 5–15 skills. Start typing and we'll suggest — or pick from below."
      />

      {data.skills.length > 0 && (
        <div className={styles.skillChips}>
          {data.skills.map(s => (
            <div key={s} className={styles.skillChip}>
              {s}
              <button className={styles.skillChipRemove} aria-label={`Remove ${s}`} onClick={() => removeSkill(s)}>
                <X size={10} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.skillInputBox}>
        <input ref={inputRef} type="hidden" />
        <BigInput
          value={query}
          onChange={setQuery}
          placeholder={data.skills.length === 0 ? 'Type a skill, e.g. React' : 'Add another skill…'}
          autoFocus
          leftIcon={<Sparkles size={17} strokeWidth={1.8} />}
          ariaLabel="Skill"
          onEnter={() => {
            if (matches.length > 0) addSkill(matches[0])
            else if (query.trim()) addSkill(query)
          }}
        />
        {query.trim() && (
          <div className={styles.skillDropdown}>
            {matches.length > 0 ? matches.map(m => (
              <button key={m} className={styles.skillDropdownItem} onClick={() => addSkill(m)}>
                <Plus size={13} strokeWidth={2.2} color="var(--brand)" /> {m}
              </button>
            )) : (
              <button className={`${styles.skillDropdownItem} ${styles.skillDropdownCustom}`} onClick={() => addSkill(query)}>
                <Plus size={13} strokeWidth={2.2} color="var(--brand)" />
                Add "<strong style={{ color: 'var(--dark)' }}>{query}</strong>" as a custom skill
              </button>
            )}
          </div>
        )}
      </div>

      {aiSuggestions.length > 0 && (
        <div className={styles.aiSuggestBox}>
          <div className={styles.aiSuggestHead}>
            <div className={styles.aiSuggestIcon}><Sparkles size={12} /></div>
            <div className={styles.aiSuggestTitle}>
              {data.skills.length === 0 ? 'Popular skills to start with' : 'People with your skills also added'}
            </div>
          </div>
          <div className={styles.aiSuggestChips}>
            {aiSuggestions.map(s => (
              <button key={s} className={styles.aiSuggestChip} onClick={() => addSkill(s)}>
                <Plus size={11} strokeWidth={2.4} /> {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <AskAiLink field="skills" label="How many skills should I add? Which ones matter most?" onAskAi={onAskAi} />
    </>
  )
}

// ── Step 7: Review (AI-drafted) ───────────────────────────────────────────────
function ReviewStep({ data, update }: { data: OnboardingData; update: (p: Partial<OnboardingData>) => void }) {
  const [objective, setObjective] = useState(data.objective || generateObjective(data))
  const [headline, setHeadline] = useState(data.headline || generateHeadline(data))
  const [regenerating, setRegenerating] = useState({ objective: false, headline: false })

  useEffect(() => { update({ objective, headline }) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function regen(field: 'objective' | 'headline', generator: (d: OnboardingData, alt?: boolean) => string) {
    setRegenerating(r => ({ ...r, [field]: true }))
    setTimeout(() => {
      const v = generator(data, true)
      if (field === 'objective') { setObjective(v); update({ objective: v }) }
      if (field === 'headline') { setHeadline(v); update({ headline: v }) }
      setRegenerating(r => ({ ...r, [field]: false }))
    }, 900)
  }

  return (
    <>
      <StepHeader
        eyebrow="Almost there"
        title="We wrote these for you"
        sub="Based on what you've shared, we drafted a headline and career objective. Accept, edit, or regenerate — you can fine-tune in the editor too."
      />

      <AiDraftCard
        label="Professional headline"
        value={headline}
        onChange={v => { setHeadline(v); update({ headline: v }) }}
        onRegenerate={() => regen('headline', generateHeadline)}
        regenerating={regenerating.headline}
      />

      <AiDraftCard
        label="Career objective"
        value={objective}
        onChange={v => { setObjective(v); update({ objective: v }) }}
        onRegenerate={() => regen('objective', generateObjective)}
        regenerating={regenerating.objective}
        rows={4}
      />

      <div className={styles.successBox}>
        <div className={styles.successIcon}><Check size={15} strokeWidth={2.5} /></div>
        <div>
          <div className={styles.successTitle}>Your draft is ready</div>
          <div className={styles.successDesc}>
            We'll set up your resume with the {data.education.length > 0 ? `${data.education[0].degree} ` : ''}background and {data.skills.length} skill{data.skills.length === 1 ? '' : 's'} you added.
            You'll be able to add work experience, projects, and more inside the editor.
          </div>
        </div>
      </div>
    </>
  )
}

function AiDraftCard({ label, value, onChange, onRegenerate, regenerating, rows = 2 }: {
  label: string; value: string; onChange: (v: string) => void; onRegenerate: () => void; regenerating: boolean; rows?: number
}) {
  const [editing, setEditing] = useState(false)
  return (
    <div className={styles.draftCard}>
      <div className={styles.draftHead}>
        <div className={styles.draftHeadLeft}>
          <div className={styles.draftIcon}><Sparkles size={12} /></div>
          <span className={styles.draftLabel}>{label}</span>
          <span className={styles.draftBadge}>AI draft</span>
        </div>
        <div className={styles.draftActions}>
          <button className={`${styles.draftActionBtn} ${editing ? styles.draftActionBtnActive : ''}`} title={editing ? 'Done' : 'Edit'} onClick={() => setEditing(e => !e)}>
            {editing ? <Check size={13} strokeWidth={2.4} /> : <Pencil size={13} strokeWidth={1.8} />}
          </button>
          <button className={styles.draftActionBtn} title="Regenerate" disabled={regenerating} onClick={onRegenerate}>
            <RefreshCw size={13} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {regenerating ? (
        <div style={{ padding: '8px 0' }}>
          <div className={styles.draftShimmer} />
          <div className={`${styles.draftShimmer} ${styles.draftShimmerShort}`} />
        </div>
      ) : editing ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} className={styles.draftTextarea} style={{ minHeight: rows * 24 }} />
      ) : (
        <div className={styles.draftText}>{value}</div>
      )}
    </div>
  )
}

// Fake AI generators — templated from the collected onboarding data.
function generateObjective(data: OnboardingData, alt = false): string {
  const degree = data.education?.[0]?.degree || ''
  const field = data.education?.[0]?.field || ''
  const school = data.education?.[0]?.school || ''
  const topSkills = data.skills?.slice(0, 3).join(', ') || 'building great software'
  if (alt) {
    return `Driven ${degree || 'graduate'}${field ? ` in ${field}` : ''} with hands-on experience in ${topSkills}. Eager to contribute to high-impact engineering teams and ship products that scale. Comfortable owning features end-to-end and collaborating across design and product.`
  }
  return `Recent ${degree || 'graduate'}${field ? ` in ${field}` : ''}${school ? ` from ${school}` : ''} seeking to apply skills in ${topSkills} to solve meaningful problems. Passionate about clean code, fast iteration, and learning from strong teams. Ready to contribute from day one.`
}

function generateHeadline(data: OnboardingData, alt = false): string {
  const field = data.education?.[0]?.field || ''
  const top = data.skills?.[0] || ''
  if (alt) {
    return `${top ? top + ' ' : ''}Developer · ${field || 'Engineering'} graduate building user-first products`
  }
  return `${field ? field + ' ' : ''}Graduate · ${top ? top + ' Developer' : 'Software Engineer'}`
}

// ── Ask AI panel (slide-in, canned guidance) ──────────────────────────────────
const FIELD_LABELS: Record<string, string> = {
  name: 'your name', email: 'your email', phone: 'your phone',
  location: 'your location', links: 'profile links',
  education: 'your education', skills: 'your skills',
  objective: 'your career objective', headline: 'your headline',
}

const QUICK_PROMPTS: Record<string, string[]> = {
  education: [
    'Should I include high school?',
    'What if my CGPA is low?',
    "I'm still studying — what do I put for end year?",
  ],
  skills: [
    'How many skills should I add?',
    'Hard skills vs soft skills?',
    'What skills look good for an SDE-1 role?',
  ],
  links: [
    'Do I really need LinkedIn?',
    "I don't have a portfolio — what then?",
    'Is GitHub important if I do PM work?',
  ],
}

const CANNED_ANSWERS: Record<string, string> = {
  'Should I include high school?':
    "Generally no — once you have a college degree, drop high school unless it's a prestigious one directly relevant to the role you're targeting.",
  'What if my CGPA is low?':
    "Leave it off if it's below your target company's typical bar. Lead with projects, internships, and skills instead — those carry more weight for most roles.",
  "I'm still studying — what do I put for end year?":
    "Put your expected graduation year (e.g. 2026) and add 'Expected' next to it — recruiters see this all the time and it reads as current student.",
  'How many skills should I add?':
    "Aim for 8–12 focused skills. A wall of 30 buzzwords looks unfocused — pick the ones you'd be comfortable being interviewed on.",
  'Hard skills vs soft skills?':
    "Lead with hard, technical skills (languages, frameworks, tools) — those are what ATS systems and recruiters scan for first. A couple of soft skills are fine, but don't let them crowd out the technical ones.",
  'What skills look good for an SDE-1 role?':
    "Core language(s) you're strongest in, one framework, Git, basic SQL, and data structures/algorithms. Specific and shallow beats broad and vague.",
  'Do I really need LinkedIn?':
    "Yes — it's the first thing most recruiters click. Even a sparse profile that matches your resume builds trust.",
  "I don't have a portfolio — what then?":
    "Skip it for now. A GitHub with a couple of clean, documented repos works just as well, especially early in your career.",
  'Is GitHub important if I do PM work?':
    "Not essential — swap it for a portfolio site or case studies if you have them. LinkedIn matters more for PM roles.",
}

const DEFAULT_ANSWER = "That's a good question — there's no single right answer, so go with what feels honest and accurate. You can always refine this later inside the editor."

function AskAiPanel({ field, data, onClose }: { field: string | null; data: OnboardingData; onClose: () => void }) {
  const fieldLabel = (field && FIELD_LABELS[field]) || 'this field'
  const prompts = (field && QUICK_PROMPTS[field]) || [
    `What should I put for ${fieldLabel}?`,
    'Give me an example',
    'Why does this matter?',
  ]

  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: `Hi! I see you're on "${fieldLabel}". Pick a question below or type your own.` },
  ])
  const [input, setInput] = useState('')
  const [inputFocus, setInputFocus] = useState(false)
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, thinking])

  function send(text?: string) {
    const q = (text ?? input).trim()
    if (!q) return
    setMessages(m => [...m, { role: 'user', text: q }])
    setInput('')
    setThinking(true)
    setTimeout(() => {
      setMessages(m => [...m, { role: 'ai', text: CANNED_ANSWERS[q] || DEFAULT_ANSWER }])
      setThinking(false)
    }, 700)
  }

  void data

  return (
    <>
      <div className={styles.askBackdrop} onClick={onClose} />
      <aside className={styles.askPanel}>
        <div className={styles.askHeader}>
          <div className={styles.askHeaderLeft}>
            <div className={styles.askIcon}><Sparkles size={15} /></div>
            <div>
              <div className={styles.askTitle}>Ask AI</div>
              <div className={styles.askSubtitle}>Helping with: <span className={styles.askFieldName}>{fieldLabel}</span></div>
            </div>
          </div>
          <button className={styles.askCloseBtn} aria-label="Close" onClick={onClose}>
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div ref={scrollRef} className={styles.askMessages}>
          {messages.map((m, i) => (
            <div key={i} className={`${styles.askMsg} ${m.role === 'user' ? styles.askMsgUser : ''}`}>
              {m.text}
            </div>
          ))}
          {thinking && (
            <div className={styles.askThinking}>
              <div className={styles.askDot} />
              <div className={styles.askDot} />
              <div className={styles.askDot} />
            </div>
          )}
        </div>

        {messages.filter(m => m.role === 'user').length === 0 && (
          <div className={styles.askQuick}>
            <div className={styles.askQuickLabel}>Quick questions</div>
            {prompts.map((p, i) => (
              <button key={i} className={styles.askQuickBtn} onClick={() => send(p)}>
                <HelpCircle size={13} color="var(--brand)" /> {p}
              </button>
            ))}
          </div>
        )}

        <div className={styles.askInputBar}>
          <div className={`${styles.askInputRow} ${inputFocus ? styles.askInputRowFocus : ''}`}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onFocus={() => setInputFocus(true)} onBlur={() => setInputFocus(false)}
              onKeyDown={e => { if (e.key === 'Enter') send() }}
              placeholder="Ask anything…" className={styles.askInput}
            />
            <button className={styles.askSendBtn} disabled={!input.trim() || thinking} onClick={() => send()}>
              <Send size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
