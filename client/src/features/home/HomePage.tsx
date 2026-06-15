import { useState, useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, Check } from 'lucide-react'
import { Navbar } from '@/shared/components/Navbar/Navbar'
import { Footer } from '@/shared/components/Footer/Footer'
import styles from './HomePage.module.css'

// ── Scroll reveal ───────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.1 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.revealVisible : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// ── Hero ─────────────────────────────────────────────────────────────────────
const KEYWORDS = ['React.js', 'Node.js', 'REST APIs', 'Agile', 'SQL', 'Git']

function Hero() {
  const [ats, setAts] = useState(0)
  const [activeKw, setActiveKw] = useState<number[]>([])

  useEffect(() => {
    const t1 = setTimeout(() => {
      let s = 0
      const iv = setInterval(() => {
        s = Math.min(s + 2, 94)
        setAts(s)
        if (s >= 94) clearInterval(iv)
      }, 22)
    }, 600)

    const t2 = setTimeout(() => {
      let i = 0
      const iv = setInterval(() => {
        setActiveKw((prev) => [...prev, i])
        i++
        if (i >= KEYWORDS.length) clearInterval(iv)
      }, 180)
    }, 1100)

    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} />
          <span className={styles.heroBadgeText}>AI Resume Builder for Indian Freshers</span>
        </div>

        <h1 className={styles.heroTitle}>
          Most resumes never reach a human. <span className={styles.heroTitleAccent}>Yours will.</span>
        </h1>

        <p className={styles.heroSub}>
          Paste a job description. AI rewrites your resume — keywords matched, ATS score 90+, in under 3 minutes.
        </p>

        <div className={styles.heroCtaWrap}>
          <Link to="/jd-tailor" className={styles.heroCta}>
            Build My ATS Resume — Free
          </Link>
        </div>

        <div className={styles.riskNote}>No credit card required · Free forever</div>

        <div className={styles.trustRow}>
          <div className={styles.trustItem}>
            <span className={styles.trustNum}>2,400+</span>
            <span className={styles.trustLabel}>resumes built this month</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustNum}>94%</span>
            <span className={styles.trustLabel}>avg ATS score</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustNum}>&lt; 3 min</span>
            <span className={styles.trustLabel}>per resume</span>
          </div>
        </div>

        <Link to="/templates" className={styles.secondaryLink}>or browse ATS-ready templates →</Link>
      </div>

      {/* Product mockup */}
      <div className={styles.mockupWrap}>
        <div className={styles.mockup}>
          <div className={styles.browserBar}>
            <div className={styles.browserDots}>
              <span className={`${styles.browserDot} ${styles.browserDotRed}`} />
              <span className={`${styles.browserDot} ${styles.browserDotYellow}`} />
              <span className={`${styles.browserDot} ${styles.browserDotGreen}`} />
            </div>
            <div className={styles.browserUrl}>careerforge.pro/jd-tailor</div>
          </div>

          <div className={styles.mockupGrid}>
            {/* Left: JD input */}
            <div className={styles.mockupLeft}>
              <div className={styles.mockupLabel}>Job Description</div>
              <div className={styles.jdBox}>
                <div className={styles.jdText}>
                  <strong className={styles.jdCompany}>Flipkart · SDE-1 Frontend</strong>
                  <br /><br />
                  We're looking for a Frontend Engineer with strong fundamentals in <span className={styles.jdKeyword}>React.js</span> and experience building scalable applications using <span className={styles.jdKeyword}>REST APIs</span> and <span className={styles.jdKeyword}>Node.js</span>. Familiarity with <span className={styles.jdKeyword}>Agile</span> and good communication skills required.
                </div>
              </div>
              <div className={styles.kwChips}>
                {KEYWORDS.map((kw, i) => (
                  <span key={kw} className={`${styles.kwChip} ${activeKw.includes(i) ? styles.kwChipActive : ''}`}>
                    {activeKw.includes(i) ? '✓ ' : ''}{kw}
                  </span>
                ))}
              </div>
              <button className={styles.mockupBtn} type="button">✦ Optimise My Resume</button>
            </div>

            {/* Right: resume output */}
            <div className={styles.mockupRight}>
              <div className={styles.atsBadge}>
                <Check size={12} strokeWidth={3} />
                ATS Score: {ats}
              </div>
              <div className={styles.mockupLabel}>Your Resume</div>
              <div className={styles.resumeCard}>
                <div className={styles.resumeHead}>
                  <div className={styles.resumeAccentBar} />
                  <div>
                    <div className={styles.resumeName}>Arjun Mehta</div>
                    <div className={styles.resumeRole}>Frontend Engineer · Mumbai · arjun@email.com</div>
                  </div>
                </div>

                <div className={styles.resumeSection}>
                  <div className={styles.resumeSectionLabel}>Experience</div>
                  {[
                    'Built React.js dashboards reducing load time by 40%',
                    'Designed REST APIs with Node.js for 50K+ daily users',
                    'Worked in cross-functional Agile sprints',
                  ].map((line) => (
                    <div key={line} className={styles.resumeLine}>
                      <span className={styles.resumeLineDot} />
                      <span className={styles.resumeLineText}>{line}</span>
                      <span className={styles.resumeLineMatched}>matched</span>
                    </div>
                  ))}
                </div>

                <div className={styles.resumeSection}>
                  <div className={styles.resumeSectionLabel}>Skills</div>
                  <div className={styles.resumeChips}>
                    {['React.js ✓', 'Node.js ✓', 'REST APIs ✓', 'Agile ✓', 'SQL ✓', 'Git'].map((c) => (
                      <span key={c} className={`${styles.resumeChip} ${c.includes('✓') ? styles.resumeChipMatched : ''}`}>{c}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.resumeFoot}>
                  <span className={styles.resumeFootLabel}>Optimised for: Flipkart SDE-1</span>
                  <button className={styles.resumeFootBtn} type="button">↓ Download PDF</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Logo strip ──────────────────────────────────────────────────────────────
const COMPANIES = ['Infosys', 'Wipro', 'TCS', 'Flipkart', 'Swiggy', 'Zomato', "BYJU'S", 'PhonePe', 'Razorpay', 'Zepto', 'Meesho', 'Freshworks']

function LogoStrip() {
  return (
    <section className={styles.logoStrip}>
      <div className={styles.logoStripInner}>
        <p className={styles.logoStripLabel}>Freshers used CareerForge to get hired at</p>
        <div className={styles.marqueeWrap}>
          <div className={styles.marquee}>
            {[...COMPANIES, ...COMPANIES].map((c, i) => (
              <span key={i} className={styles.marqueeItem}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Feature tab visuals ───────────────────────────────────────────────────────
function ResumeBuilderVisual() {
  const lines = [
    { w: '90%', highlight: true }, { w: '78%', highlight: true }, { w: '65%', highlight: false },
    { w: '85%', highlight: true }, { w: '70%', highlight: false },
  ]
  return (
    <div className={`${styles.visualPad} ${styles.visualBgSoft}`}>
      <div className={styles.visualLabel}>AI Resume Output</div>
      <div className={styles.visualCard}>
        <div className={styles.visualBarBlock} />
        <div className={styles.visualBarBlockThin} />
        {lines.map((l, i) => (
          <div key={i} className={`${styles.visualLine} ${l.highlight ? styles.visualLineHighlight : styles.visualLinePlain}`} style={{ width: l.w }} />
        ))}
        <div className={styles.visualChips}>
          {['React ✓', 'Node ✓', 'APIs ✓'].map((c) => <span key={c} className={styles.visualChip}>{c}</span>)}
        </div>
      </div>
      <div className={styles.visualScoreRow}>
        <span className={styles.visualScorePill}>ATS Score: 94 ✓</span>
      </div>
    </div>
  )
}

function CoverLetterVisual() {
  return (
    <div className={`${styles.visualPad} ${styles.visualBgWarm}`}>
      <div className={styles.visualLabel}>Cover Letter Preview</div>
      <div className={styles.coverLetterCard}>
        <div className={styles.coverLetterGreeting}>Dear Hiring Manager,</div>
        <div className={styles.coverLetterBody}>
          When I saw the <span className={styles.coverLetterHighlight}>SDE-1 role at Flipkart</span>, I didn't just see a job posting — I saw two years of side-projects, late-night debugging sessions, and a genuine obsession with building fast, scalable UIs finally having a real home.
        </div>
        <div className={styles.coverLetterLine} style={{ width: '80%' }} />
        <div className={styles.coverLetterLine} style={{ width: '65%' }} />
      </div>
      <div className={styles.coverLetterFoot}>✓ Personalised for this role · No generic phrases detected</div>
    </div>
  )
}

function ScoreVisual() {
  const rows = [
    { label: 'Keywords', score: 14, total: 15, color: 'var(--green)' },
    { label: 'Format', score: 10, total: 10, color: 'var(--green)' },
    { label: 'Missing', score: 1, total: 1, color: 'var(--amber)', tag: 'TypeScript' },
  ]
  return (
    <div className={`${styles.visualPad} ${styles.visualBgSoft}`}>
      <div className={styles.visualLabel}>JD Match Analysis</div>
      <div className={styles.scoreVisualTop}>
        <div className={styles.scoreRing}>
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="28" fill="none" stroke="var(--border-soft)" strokeWidth="8" />
            <circle cx="36" cy="36" r="28" fill="none" stroke="var(--green)" strokeWidth="8" strokeDasharray="176" strokeDashoffset="25" strokeLinecap="round" transform="rotate(-90 36 36)" />
          </svg>
          <div className={styles.scoreRingNum}>94</div>
        </div>
        <div>
          <div className={styles.scoreVisualTitle}>Excellent Match</div>
          <div className={styles.scoreVisualSub}>14 of 15 keywords found</div>
        </div>
      </div>
      {rows.map((r) => (
        <div key={r.label} className={styles.scoreBarRow}>
          <div className={styles.scoreBarLabel}>{r.label}</div>
          <div className={styles.scoreBarTrack}>
            <div className={styles.scoreBarFill} style={{ width: `${(r.score / r.total) * 100}%`, background: r.color }} />
          </div>
          {r.tag && <span className={styles.scoreBarTag}>{r.tag}</span>}
        </div>
      ))}
    </div>
  )
}

// ── Feature tabs ───────────────────────────────────────────────────────────
const FEATURE_TABS = [
  {
    num: '01', label: 'Resume Builder',
    headline: 'Generate a resume that beats the bots.',
    sub: 'Paste a job description. Get a resume tailored to it — keywords matched, structure ATS-ready, exported as a recruiter-friendly PDF.',
    points: ['Increase ATS score to 90+ on every job', 'Save 2 hours per application', 'Match keywords recruiters scan for', 'Export a clean PDF in one click'],
    visual: <ResumeBuilderVisual />,
  },
  {
    num: '02', label: 'Cover Letter',
    headline: 'Write a cover letter in 60 seconds.',
    sub: 'Specific to the job. Specific to the company. Sounds like you wrote it — because it pulls from your real experience, not a template.',
    points: ['Generate a unique letter for every role', 'Skip the "I am writing to apply" trap', 'Match the tone of your resume', 'Edit and export instantly'],
    visual: <CoverLetterVisual />,
  },
  {
    num: '03', label: 'JD Match Score',
    headline: 'Know your score before they ghost you.',
    sub: "See how well your resume matches a job in seconds. Find what's missing. Fix it. Re-score. Apply with confidence.",
    points: ["Identify the keywords you're missing", 'See a section-by-section breakdown', 'Get fixes you can apply in 2 minutes', 'Re-check your score after every edit'],
    visual: <ScoreVisual />,
  },
]

function FeatureTabs() {
  const [active, setActive] = useState(0)
  const tab = FEATURE_TABS[active]

  return (
    <section id="features" className={styles.section}>
      <div className={styles.sectionInner}>
        <Reveal className={styles.sectionHead}>
          <div className={styles.kicker}>What you'll do</div>
          <h2 className={styles.sectionTitle}>Land more interviews. Faster.</h2>
        </Reveal>

        <div className={styles.tabBar}>
          {FEATURE_TABS.map((t, i) => (
            <button
              key={t.num}
              type="button"
              className={`${styles.tabBtn} ${active === i ? styles.tabBtnActive : ''}`}
              onClick={() => setActive(i)}
            >
              <span className={`${styles.tabNum} ${active === i ? styles.tabNumActive : ''}`}>{t.num}</span>
              {t.label}
              {active === i && <span className={styles.tabUnderline} />}
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          <Reveal key={`text-${active}`}>
            <h3 className={styles.tabHeadline}>{tab.headline}</h3>
            <p className={styles.tabSub}>{tab.sub}</p>
            <div className={styles.tabPoints}>
              {tab.points.map((p) => (
                <div key={p} className={styles.tabPoint}>
                  <span className={styles.tabPointIcon}>
                    <Check size={12} strokeWidth={2.5} color="var(--brand)" />
                  </span>
                  <span className={styles.tabPointText}>{p}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal key={`visual-${active}`} delay={120}>
            <div className={styles.tabVisual}>{tab.visual}</div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ── Bento grid ────────────────────────────────────────────────────────────
const BENTO_CARDS = [
  { bg: 'var(--brand-light)', color: 'var(--brand)', prompt: 'Generate a tailored resume for this job', result: 'ATS-ready in 2 min 47 sec', icon: '⚡', wide: true },
  { bg: 'var(--coral-light)', color: 'var(--coral)', prompt: 'Increase your ATS score from 23 → 91', result: 'Now passes most ATS scanners', icon: '🎯', wide: false },
  { bg: 'var(--green-light)', color: 'var(--green)', prompt: 'Write a personalised cover letter', result: 'No generic phrases. 60 seconds.', icon: '✉️', wide: false },
  { bg: '#FFF8E8', color: '#D97706', prompt: "Find the keywords you're missing", result: '14/18 matched. Add 4 more.', icon: '🔍', wide: false },
]

function BentoGrid() {
  return (
    <section className={`${styles.section} ${styles.sectionSoft}`}>
      <div className={styles.sectionInner}>
        <Reveal className={styles.sectionHead}>
          <div className={styles.kicker}>Real outcomes</div>
          <h2 className={styles.sectionTitle}>What you get back,<br />every time you apply.</h2>
        </Reveal>
        <div className={styles.bentoGrid}>
          {BENTO_CARDS.map((card, i) => (
            <Reveal key={card.prompt} delay={i * 60} className={card.wide ? styles.bentoWide : ''}>
              <div className={styles.bentoCard} style={{ background: card.bg, borderColor: `color-mix(in srgb, ${card.color} 25%, transparent)` }}>
                <div className={styles.bentoIcon}>{card.icon}</div>
                <div className={styles.bentoPrompt}>"{card.prompt}"</div>
                <div className={styles.bentoResultRow}>
                  <span className={styles.bentoResultDot} style={{ background: card.color }} />
                  <span className={styles.bentoResultText} style={{ color: card.color }}>{card.result}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { text: 'I was applying to 15 jobs with the same resume for 2 months. Used this once, scored 91 on ATS, got a call from Infosys in a week.', name: 'Priya S.', role: 'B.Tech CSE · Pune', col: 'var(--brand)' },
  { text: "The cover letter generator is scary good. It picked up things from my profile I wouldn't even think to mention.", name: 'Karan M.', role: 'MBA Fresher · Delhi', col: 'var(--coral)' },
  { text: 'The JD score told me exactly what was missing. Simple, clear, and honestly a bit magical.', name: 'Shreya R.', role: 'ECE Graduate · Chennai', col: 'var(--green)' },
]

function Testimonials() {
  return (
    <section className={`${styles.section} ${styles.sectionSoft}`}>
      <div className={styles.sectionInner}>
        <Reveal className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Real freshers. Real callbacks.</h2>
        </Reveal>
        <div className={styles.quoteGrid}>
          {TESTIMONIALS.map((q, i) => (
            <Reveal key={q.name} delay={i * 80}>
              <div className={styles.quoteCard}>
                <div className={styles.quoteMark} style={{ color: q.col }}>"</div>
                <p className={styles.quoteText}>{q.text}</p>
                <div className={styles.quoteAuthor}>
                  <div className={styles.quoteAvatar} style={{ background: q.col }}>{q.name[0]}</div>
                  <div>
                    <div className={styles.quoteName}>{q.name}</div>
                    <div className={styles.quoteRole}>{q.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Roadmap ──────────────────────────────────────────────────────────────
const ROADMAP_ITEMS = [
  { icon: '🔍', title: 'Job Suggestions', body: 'Resume-matched roles, delivered to you. No more scrolling through hundreds of listings.' },
  { icon: '⚡', title: 'One-Click Apply', body: 'A role catches your eye? Resume auto-tailors. Application fires in one click.' },
  { icon: '📊', title: 'Application Tracker', body: 'Every application. Every status. One clean view. No more spreadsheet anxiety.' },
  { icon: '🗺️', title: 'Skill Gap Planner', body: '80% ready for a role? Get a personalised prep plan with topics, quizzes, and sandboxes.' },
  { icon: '🎙️', title: 'AI Mock Interviews', body: 'A conversational AI asks real questions out loud. You answer. You get honest feedback.' },
]

function Roadmap() {
  return (
    <section id="roadmap" className={styles.section}>
      <div className={styles.sectionInner}>
        <Reveal className={styles.sectionHead}>
          <div className={`${styles.kicker} ${styles.kickerCoral}`}>What's coming</div>
          <h2 className={styles.sectionTitle}>The full career co-pilot<br />is on its way.</h2>
          <p className={styles.sectionSub}>We're building in public. This is just the beginning.</p>
        </Reveal>
        <div className={styles.roadmapGrid}>
          {ROADMAP_ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={i * 60}>
              <div className={styles.roadmapCard}>
                <div className={styles.roadmapIcon}>{item.icon}</div>
                <div className={styles.roadmapSoon}>Soon</div>
                <h3 className={styles.roadmapTitle}>{item.title}</h3>
                <p className={styles.roadmapBody}>{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FAQ ──────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  { q: 'Is it really free to use?', a: 'Yes — CareerForge is completely free. AI resume building, cover letters, and JD match scoring are all available at no cost. No credit card. Ever.' },
  { q: 'Will the resume pass ATS?', a: 'Our model is trained to optimise for keyword matching, correct section structure, and clean formatting. Most users score 85–96. Your content quality matters too — we make it the best version of what you give us.' },
  { q: 'Is my data safe?', a: "We don't sell, share, or train on your personal data. Your resume belongs to you." },
  { q: 'Does it work for non-tech jobs?', a: "Absolutely — finance, marketing, operations, design, HR. If there's a JD, we can optimise for it." },
]

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className={`${styles.section} ${styles.sectionSoft}`}>
      <div className={styles.faqInner}>
        <Reveal className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Questions?</h2>
        </Reveal>
        <div className={styles.faqList}>
          {FAQ_ITEMS.map((item, i) => (
            <Reveal key={item.q} delay={i * 50}>
              <div className={`${styles.faqItem} ${open === i ? styles.faqItemOpen : ''}`}>
                <button type="button" className={styles.faqQ} onClick={() => setOpen(open === i ? null : i)}>
                  <span className={styles.faqQText}>{item.q}</span>
                  <span className={`${styles.faqPlus} ${open === i ? styles.faqPlusOpen : ''}`}>+</span>
                </button>
                {open === i && (
                  <div className={styles.faqA}>
                    <p className={styles.faqAText}>{item.a}</p>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Final CTA ────────────────────────────────────────────────────────────
function CTAFinal() {
  return (
    <section className={styles.ctaSection}>
      <Reveal>
        <div className={styles.ctaBox}>
          <div className={styles.ctaGlowTop} />
          <div className={styles.ctaGlowBottom} />
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Your next interview is<br />one resume away.</h2>
            <p className={styles.ctaSub}>Start free. No credit card. 3 minutes.</p>
            <Link to="/jd-tailor" className={styles.ctaBtn}>
              Build My ATS Resume — Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className={styles.page}>
      <Helmet>
        <title>CareerForge | AI Resume Tailoring — Match Any Job Description</title>
        <meta name="description" content="CareerForge tailors your resume to any job description in minutes. Get a real-time ATS match score, fix skill gaps, and generate a cover letter — all in one flow, completely free." />
        <meta name="keywords" content="AI resume builder, ATS resume checker, cover letter generator, free resume maker, ATS-friendly resume, resume optimizer, CareerForge, resume templates, job application tools" />
        <meta name="author" content="CareerForge" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://careerforge.pro/" />
      </Helmet>

      <Navbar />
      <Hero />
      <LogoStrip />
      <FeatureTabs />
      <BentoGrid />
      <Roadmap />
      <Testimonials />
      <FAQ />
      <CTAFinal />
      <Footer />
    </div>
  )
}
