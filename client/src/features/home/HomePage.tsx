import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ArrowRight, Star, CheckCircle2,
  BarChart3, LogOut, User as UserIcon, Menu, X,
  Target, FileSignature, 
  FileText, CreditCard, Copy, EyeOff, Filter,
  UploadCloud, Activity, FileCheck, Layers, GitMerge,
  Shield, CheckCircle, BookOpen
} from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { Footer } from '@/shared/components/Footer/Footer'
import { useAuthStore } from '@/core/auth/useAuthStore'
import styles from './HomePage.module.css'

// ── Rotating success stories ──────────────────────────────────────────────────
const successStories = [
  { initials: 'AK', color: 'var(--primary-container)', name: 'Ananya K.', college: 'IIT Bombay', from: 58, to: 91, result: 'Google callback in 2 weeks' },
  { initials: 'PR', color: 'var(--secondary)', name: 'Priya R.', college: 'NIT Trichy', from: 54, to: 88, result: 'Placed at Zepto as Data Analyst' },
  { initials: 'SM', color: '#10b981', name: 'Siddharth M.', college: 'BITS Pilani', from: 62, to: 93, result: 'Shortlisted at 3 startups' },
  { initials: 'VR', color: '#3b82f6', name: 'Vishal R.', college: 'VIT Vellore', from: 49, to: 85, result: 'First job at Razorpay' },
  { initials: 'NK', color: 'var(--primary-container)', name: 'Nidhi K.', college: 'DTU Delhi', from: 67, to: 94, result: 'Offers from 2 companies' },
]

// ── Problem cards ────────────────────────────────────────────────────────────
const problems = [
  {
    icon: <Copy size={24} />,
    accent: '#6366f1',
    stat: '73%',
    statLabel: 'of applications',
    title: 'Same resume, every job',
    desc: 'One generic resume lowers your chances on every application. Tailoring to the JD is what separates callbacks from silence.',
    tag: 'Most common mistake',
  },
  {
    icon: <EyeOff size={24} />,
    accent: 'var(--secondary)',
    stat: '6 sec',
    statLabel: 'recruiter scan time',
    title: 'Missing job-specific signals',
    desc: "If your resume doesn't reflect what the job actually requires, it gets ignored — even if you're qualified.",
    tag: 'Hidden killer',
  },
  {
    icon: <Filter size={24} />,
    accent: '#f59e0b',
    stat: '75%',
    statLabel: 'filtered before human review',
    title: 'Filtered before a human sees it',
    desc: "Most companies use ATS filters. If your resume doesn't match the job, it never reaches a recruiter.",
    tag: '2026 reality',
  },
]

// ── How it works steps ───────────────────────────────────────────────────────
const steps = [
  {
    num: '1',
    icon: <UploadCloud size={24} />,
    accent: 'var(--primary-container)',
    title: 'Drop your resume & job description',
    desc: 'Paste or upload — no formatting needed. Start with what you already have.',
  },
  {
    num: '2',
    icon: <Activity size={24} />,
    accent: '#3b82f6',
    title: 'See exactly what\'s missing',
    desc: 'Get a real match score. We highlight keyword gaps, weak areas, and what the recruiter is looking for.',
  },
  {
    num: '3',
    icon: <FileCheck size={24} />,
    accent: 'var(--secondary)',
    title: 'Apply with a tailored bundle',
    desc: 'Download your AI-tailored resume and a matching cover letter — ready to send in minutes.',
  },
]

// ── Why CF cards ─────────────────────────────────────────────────────────────
const whyCards = [
  {
    icon: <Layers size={18} />,
    accent: '#60a5fa',
    title: 'Semantic matching — not keyword stuffing',
    desc: 'Understands what roles actually require, not just counting words. Rewrites your resume to genuinely align with the role.',
  },
  {
    icon: <GitMerge size={18} />,
    accent: '#a78bfa',
    title: 'One flow from start to apply',
    desc: 'Paste JD → score → tailor → generate → apply. All connected, no copy-pasting between tools.',
  },
  {
    icon: <CheckCircle2 size={18} />,
    accent: 'var(--secondary)',
    title: 'Grounded in your real experience',
    desc: 'No fake content. Every rewrite is grounded in what you\'ve actually done — just articulated better.',
  },
  {
    icon: <Shield size={18} />,
    accent: '#facc15',
    title: 'Free to start. No credit card.',
    desc: '3 JD scores, 2 tailorings, 3 cover letters per month — free. Upgrade only if you need more.',
  },
]

// ── Testimonials ──────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Arjun Sharma',
    role: 'SDE @ Google',
    avatar: 'AS',
    before: 61,
    after: 89,
    quote: 'The JD Fit Score showed I was missing "distributed systems". AI tailoring added it perfectly. Got a Google callback in 2 weeks.',
  },
  {
    name: 'Priya Nair',
    role: 'Data Analyst @ Zepto',
    avatar: 'PN',
    before: 54,
    after: 91,
    quote: 'I was applying to 8 companies. CareerForge tailored my resume for each in minutes. Landed my first job.',
  },
  {
    name: 'Rohan Mehta',
    role: 'Backend Eng @ Razorpay',
    avatar: 'RM',
    before: 67,
    after: 88,
    quote: 'The cover letter actually matched the role — not generic at all. That made the difference.',
  },
]

// ── Main component ─────────────────────────────────────────────────────────
export default function HomePage() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [storyIndex, setStoryIndex] = useState(0)
  const [storyVisible, setStoryVisible] = useState(true)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  // Auto-rotate success stories
  const rotate = useCallback(() => {
    setStoryVisible(false)
    setTimeout(() => {
      setStoryIndex(i => (i + 1) % successStories.length)
      setStoryVisible(true)
    }, 400)
  }, [])

  useEffect(() => {
    const t = setInterval(rotate, 3500)
    return () => clearInterval(t)
  }, [rotate])

  const story = successStories[storyIndex]

  return (
    <div className={styles.page}>
      <Helmet>
        <title>CareerForge | AI Resume Tailoring — Match Any Job Description</title>
        <meta name="description" content="CareerForge tailors your resume to any job description in minutes. Get a real-time ATS match score, fix skill gaps, and generate a cover letter — all in one flow. Trusted by 12,400+ Indian freshers and students." />
        <meta name="keywords" content="AI resume builder, ATS resume checker, cover letter generator, free resume maker, ATS-friendly resume, resume optimizer, CareerForge, resume templates, job application tools" />
        <meta name="author" content="CareerForge" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://careerforge.pro/" />
      </Helmet>

      {/* ── Navbar ── */}
      <header className={styles.navbar}>
        <div className={styles.navContent}>
          <Link to="/" className={styles.brandLink} onClick={closeMenu}>
            <div className={styles.brand}>
              <div className={styles.brandLogo}>CF</div>
              <span className={styles.brandName}>CareerForge</span>
            </div>
          </Link>

          <button className={styles.menuToggle} onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ''}`}>
            <Link to="/templates" className={styles.navLink} onClick={closeMenu}><FileText size={15} /> Templates</Link>
            <Link to="/jd-tailor" className={styles.navLink} onClick={closeMenu}><Target size={15} /> JD Tailor</Link>
            <Link to="/cover-letter" className={styles.navLink} onClick={closeMenu}><FileSignature size={15} /> Cover Letter</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className={styles.navLink} onClick={closeMenu}><BarChart3 size={15} /> Dashboard</Link>
            )}
            <Link to="/pricing" className={styles.navLink} onClick={closeMenu}><CreditCard size={15} /> Pricing</Link>
            <Link to="/blog" className={styles.navLink} onClick={closeMenu}><BookOpen size={15} /> Insights</Link>
            <div className={styles.mobileNavActions}>
              {isAuthenticated ? (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <Button variant="ghost" fullWidth onClick={() => { logout(); closeMenu(); }} style={{ justifyContent: 'flex-start', color: 'var(--error)' }}>
                    <LogOut size={16} /> Sign out
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu}><Button variant="ghost" fullWidth>Log in</Button></Link>
                  <Link to="/register" onClick={closeMenu}><Button variant="primary" fullWidth>Get started free</Button></Link>
                </>
              )}
            </div>
          </nav>

          <div className={styles.navActions}>
            {isAuthenticated ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-secondary)', fontWeight: 'bold', fontSize: 13 }}>
                    {user?.name?.charAt(0).toUpperCase() || <UserIcon size={16} />}
                  </div>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--on-surface)' }}>{user?.name?.split(' ')[0]}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => logout()}>
                  <LogOut size={16} /> Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
                <Link to="/register"><Button variant="primary" size="sm">Get started free <ArrowRight size={13} /></Button></Link>
              </>
            )}
          </div>
        </div>
        {isMenuOpen && <div className={styles.backdrop} onClick={closeMenu} />}
      </header>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Built for Indian freshers & students
          </div>

          <h1 className={styles.heroTitle}>
            You don't need a better resume. <span className={styles.heroAccent}>You need the right one for the job.</span>
          </h1>

          <p className={styles.heroSub}>
            You might be qualified — but your resume isn't showing it.{' '}
            We fix that in minutes with AI scoring, tailoring, and a matching cover letter.
          </p>

          <div className={styles.heroCtas}>
            <Link to="/jd-tailor">
              <Button size="lg">Tailor my resume for a job <ArrowRight size={16} /></Button>
            </Link>
            <Link to="/scoring">
              <Button variant="ghost" size="lg">Check my ATS score</Button>
            </Link>
          </div>

          {/* Animated success story ticker */}
          <div className={styles.storyTicker}>
            <div className={`${styles.storyCard} ${storyVisible ? styles.storyVisible : styles.storyHidden}`}>
              <div className={styles.storyAvatar} style={{ background: story.color }}>
                {story.initials}
              </div>
              <div className={styles.storyBody}>
                <div className={styles.storyName}>
                  {story.name}
                  <span className={styles.storyCollege}>{story.college}</span>
                </div>
                <div className={styles.storyResult}>
                  <span className={styles.storyScore}>
                    {story.from} → <strong>{story.to}</strong>
                  </span>
                  <span className={styles.storyDot} />
                  <span className={styles.storyResultText}>{story.result}</span>
                </div>
              </div>
              <div className={styles.storyBadge}>
                <CheckCircle2 size={12} /> Verified
              </div>
            </div>
            <div className={styles.storyMeta}>
              <div className={styles.avatarStack}>
                <div className={styles.avatarMini} style={{ background: 'var(--primary-container)', zIndex: 4 }}>AK</div>
                <div className={styles.avatarMini} style={{ background: '#3b82f6', zIndex: 3 }}>PR</div>
                <div className={styles.avatarMini} style={{ background: 'var(--secondary)', zIndex: 2 }}>SM</div>
                <div className={styles.avatarMini} style={{ background: '#eab308', zIndex: 1 }}>VR</div>
              </div>
              <span>12,400+ students from top colleges</span>
              <div className={styles.storyDots}>
                {successStories.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.storyDotBtn} ${i === storyIndex ? styles.storyDotActive : ''}`}
                    onClick={() => { setStoryVisible(false); setTimeout(() => { setStoryIndex(i); setStoryVisible(true) }, 300) }}
                    aria-label={`Story ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Resume mock */}
        <div className={styles.heroVisualWrap}>
          <div className={styles.heroCard}>
            <div className={styles.cardTopbar}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div className={`${styles.dot} ${styles.dotRed}`} />
                <div className={`${styles.dot} ${styles.dotYellow}`} />
                <div className={`${styles.dot} ${styles.dotGreen}`} />
              </div>
              <span className={styles.cardTitle}>CareerForge — Resume Editor</span>
              <div className={styles.mockSaveBadge}>● Saved</div>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.resumePreview}>
                <div className={styles.rpName}>Priya Nair</div>
                <div className={styles.rpRole}>Data Analyst · Fresher · IIT Madras</div>
                <div className={styles.rpDivider} />
                <div className={styles.rpSectionLabel}>Experience</div>
                <div className={styles.rpExpTitle}>Data Intern — Zepto</div>
                <div className={styles.rpExpDate}>Jun 2024 – Aug 2024 · Remote</div>
                <div className={styles.rpBullet}>Reduced dashboard load time by 40% via query optimization</div>
                <div className={styles.rpBullet}>Built real-time inventory alerts used by 50+ ops staff</div>
                <div className={styles.rpDivider} />
                <div className={styles.rpSectionLabel}>Skills</div>
                <div className={styles.rpSkills}>
                  {['Python', 'SQL', 'Pandas', 'Tableau', 'BigQuery'].map(s => (
                    <span key={s} className={styles.rpSkillChip}>{s}</span>
                  ))}
                </div>
                <div className={styles.rpAts}><CheckCircle2 size={11} /> ATS Score 91/100</div>
              </div>
            </div>
          </div>
          <div className={styles.aiFloat}>
            <div className={styles.aiFloatLabel}>💡 Suggestion</div>
            <div className={styles.aiFloatText}>Add "distributed systems" to match JD</div>
            <div className={styles.aiFloatAction}>Apply →</div>
          </div>
          <div className={styles.scoreFloat}>
            <div className={styles.scoreFloatTop}>
              <span className={styles.scoreFloatLabel}>JD Fit Score</span>
              <span className={styles.scoreFloatNum}>91</span>
            </div>
            <div className={styles.scoreFloatBar}>
              <div className={styles.scoreFloatFill} style={{ width: '91%' }} />
            </div>
            <div className={styles.scoreFloatSub}>↑ +27 after tailoring</div>
          </div>
        </div>
      </section>

      {/* ── Problem Section — Clean professional design ── */}
      <section className={styles.problemSection}>
        <div className={styles.sectionInner}>
          <div className={styles.problemIntro}>
            <p className={styles.sectionLabelLight}>The real problem</p>
            <h2 className={styles.problemHeadline}>
              Why most resumes<br />
              <span className={styles.problemHlEmphasis}>never get shortlisted</span>
            </h2>
            <p className={styles.problemLead}>It's not your skills — it's how your resume is filtered before a human ever sees it. These three silent killers are eliminating 75% of applications.</p>
          </div>
          <div className={styles.problemGrid}>
            {problems.map((p) => (
              <div key={p.title} className={styles.problemCard}>
                <div className={styles.problemCardTop}>
                  <div className={styles.problemStat} style={{ color: p.accent }}>{p.stat}</div>
                  <span className={styles.problemStatLabel}>{p.statLabel}</span>
                </div>
                <div className={styles.problemIconWrap} style={{ color: p.accent, background: `color-mix(in srgb, ${p.accent} 10%, transparent)` }}>
                  {p.icon}
                </div>
                <h3 className={styles.problemTitle}>{p.title}</h3>
                <p className={styles.problemDesc}>{p.desc}</p>
                <span className={styles.problemTag} style={{ color: p.accent, background: `color-mix(in srgb, ${p.accent} 10%, transparent)` }}>{p.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works — clean timeline ── */}
      <section className={styles.howSection}>
        <div className={styles.sectionInner}>
          <div className={styles.howIntro}>
            <h2 className={styles.howHeadline}>Three steps to a tailored application</h2>
          </div>
          <div className={styles.stepsRow}>
            {steps.map((s, i) => (
              <div key={s.num} className={styles.stepBlock}>
                <div className={styles.stepIconCircle} style={{ color: s.accent, borderColor: `color-mix(in srgb, ${s.accent} 25%, transparent)`, background: `color-mix(in srgb, ${s.accent} 4%, white)` }}>
                  {s.icon}
                </div>
                {i < steps.length - 1 && <div className={styles.stepConnector} />}
                <div className={styles.stepContentWrap}>
                  <div className={styles.stepLabel}>Step {s.num}</div>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p className={styles.stepDesc}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials — Lively masonry layout ── */}
      <section className={styles.testimonialsSection} id="testimonials">
        <div className={styles.sectionInner}>
          <div className={styles.testimonialIntro}>
            <h2 className={styles.testimonialHeadline}>Real people. Real results.</h2>
            <p className={styles.testimonialLead}>Students from India's top colleges landing interviews at companies they actually wanted.</p>
          </div>
          <div className={styles.testimonialGrid}>
            {testimonials.map((t, index) => (
              <div key={t.name} className={`${styles.testimonialCard} ${styles[`testimonialOffset${index + 1}`]}`}>
                <div className={styles.scoreChangeRow}>
                  <span className={styles.scoreBefore}>{t.before}</span>
                  <span className={styles.scoreArrow}>→</span>
                  <span className={styles.scoreAfter}>{t.after}</span>
                  <span className={styles.scoreLabel}>ATS Score</span>
                </div>
                <div className={styles.stars}>{[1, 2, 3, 4, 5].map(i => <Star key={i} size={13} fill="var(--secondary)" color="var(--secondary)" />)}</div>
                <p className={styles.testimonialQuote}>"{t.quote}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar} style={{ background: index === 0 ? 'var(--primary-container)' : index === 1 ? 'var(--secondary)' : '#3b82f6' }}>{t.avatar}</div>
                  <div>
                    <div className={styles.authorName}>{t.name}</div>
                    <div className={styles.authorRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why CareerForge — dark section ── */}
      <section className={styles.whySection}>
        <div className={styles.whyInner}>
          <div className={styles.whyLeft}>
             <div className={styles.sectionLabelLight}>Why CareerForge</div>
            <h2 className={styles.whyTitle}>Not a resume builder.<br />A career intelligence engine.</h2>
            <p className={styles.whySub}>
              Most tools stop at templates. CareerForge helps you actually get shortlisted — scoring your fit, rewriting your resume to match, and crafting your cover letter.
            </p>
            <Link to="/register">
              <button className={styles.whyBtn}>
                Start for free — no card needed <ArrowRight size={15} />
              </button>
            </Link>
          </div>
          <div className={styles.whyRight}>
            {whyCards.map((c) => (
              <div key={c.title} className={styles.whyCard}>
                <div className={styles.whyCardIcon} style={{ color: c.accent, background: `color-mix(in srgb, ${c.accent} 15%, transparent)` }}>
                  {c.icon}
                </div>
                <div>
                  <div className={styles.whyCardTitle}>{c.title}</div>
                  <div className={styles.whyCardDesc}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaContent}>
          <div className={styles.ctaIcon}><CheckCircle size={32} /></div>
          <h2 className={styles.ctaTitle}>Your next job is one tailored<br />application away.</h2>
          <p className={styles.ctaSub}>
            Join 12,000+ job seekers using CareerForge to score, tailor, and send better applications.
          </p>
          <div className={styles.ctaActions}>
            <Link to="/jd-tailor">
              <Button size="lg">Tailor my resume now <ArrowRight size={16} /></Button>
            </Link>
            <Link to="/scoring">
              <Button variant="ghost" size="lg" style={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.2)' }}>
                Check my ATS score free
              </Button>
            </Link>
          </div>
          <div className={styles.ctaTrustPills}>
            <span className={styles.ctaTrustPill}>✓ Free to start</span>
            <span className={styles.ctaTrustPill}>✓ No credit card</span>
            <span className={styles.ctaTrustPill}>✓ 12,400+ students trust us</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
