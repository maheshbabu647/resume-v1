import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ArrowRight, Star, Shield, Download, CheckCircle2,
  BarChart3, Cpu, LogOut, User as UserIcon, Menu, X,
  Target, FileSignature, Sparkles, Check, ChevronRight,
  FileText, CreditCard
} from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { useAuthStore } from '@/core/auth/useAuthStore'
import styles from './HomePage.module.css'

// ── Feature data ────────────────────────────────────────────────────────────
const features = [
  {
    icon: <BarChart3 size={22} />,
    title: 'JD Fit Score',
    desc: 'Paste any job description. Our AI returns a 0–100 fit score with a skill-gap breakdown, missing keywords, and ranked improvement suggestions — in seconds.',
    tag: 'AI-Powered',
    accent: '#6366f1',
    link: '/jd-tailor',
    cta: 'Check my fit score',
  },
  {
    icon: <Target size={22} />,
    title: 'AI Resume Tailoring',
    desc: 'One click rewrites your entire resume — bullets, skills, summary — to perfectly match any job description. Land more interviews without rewriting manually.',
    tag: 'Instant',
    accent: '#8b5cf6',
    link: '/jd-tailor',
    cta: 'Tailor my resume',
  },
  {
    icon: <FileSignature size={22} />,
    title: 'Cover Letter Generator',
    desc: 'AI crafts a tailored, professional cover letter from your resume + the JD. Choose your tone — Professional, Enthusiastic, Concise, or Creative. Done in 30 seconds.',
    tag: 'Tailored to JD',
    accent: '#a855f7',
    link: '/cover-letter',
    cta: 'Generate a letter',
  },
  {
    icon: <Cpu size={22} />,
    title: 'AI Bullet Enhancement',
    desc: 'Too vague? The AI rewrites individual resume bullets to be specific, measurable, and keyword-rich. Accept or reject changes field by field.',
    tag: 'In-Editor',
    accent: '#06b6d4',
    link: '/register',
    cta: 'Start building',
  },
  {
    icon: <Download size={22} />,
    title: 'Pixel-Perfect PDF Export',
    desc: 'What-you-see-is-what-you-get PDF downloads. Your formatted resume — exactly as the live preview shows — delivered instantly.',
    tag: 'WYSIWYG',
    accent: '#10b981',
    link: '/templates',
    cta: 'Browse templates',
  },
  {
    icon: <Shield size={22} />,
    title: 'ATS-Friendly Templates',
    desc: 'Every template is designed to pass ATS parsers. Clean layouts, standard headings, no tables or text boxes that confuse automated screening systems.',
    tag: 'ATS-Safe',
    accent: '#f59e0b',
    link: '/templates',
    cta: 'See templates',
  },
]


// ── Why CF cards ─────────────────────────────────────────────────────────────
const whyCards = [
  {
    title: 'Not keyword-stuffing — semantic matching',
    desc: 'Most tools count keywords. CareerForge\'s AI understands what each word means and rewrites your resume to genuinely align with the role.',
  },
  {
    title: 'Resume + JD + Cover Letter — one flow',
    desc: 'Build once. Paste any JD. Score it, tailor it, generate a cover letter — all connected, no copy-pasting between tools.',
  },
  {
    title: 'Tailoring that actually makes sense',
    desc: 'The AI never fabricates experience. Every rewrite is grounded in what you\'ve actually done — just articulated better for the specific role.',
  },
  {
    title: 'Free. No credit card. No catch.',
    desc: '3 JD scores, 2 tailorings, and 3 cover letters every month — free. Upgrade only if you apply to more than a handful of roles.',
  },
]

// ── Testimonials ──────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Arjun Sharma',
    role: 'SDE @ Google',
    avatar: 'A',
    color: '#6366f1',
    quote: 'The JD Fit Score told me I was missing "distributed systems" — the AI tailoring added it perfectly. Got a callback from Google within 2 weeks.',
  },
  {
    name: 'Priya Nair',
    role: 'Data Analyst @ Zepto',
    avatar: 'P',
    color: '#10b981',
    quote: 'I was applying to 8 companies with 8 different JDs. CareerForge tailored my resume to each in minutes. Landed my first job at Zepto.',
  },
  {
    name: 'Rohan Mehta',
    role: 'Backend Eng @ Razorpay',
    avatar: 'R',
    color: '#8b5cf6',
    quote: 'The cover letter generator is underrated. It actually read my resume and the JD and wrote something specific — not a generic template.',
  },
]


// ── Main component ─────────────────────────────────────────────────────────
export default function HomePage() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <div className={styles.page}>
      <Helmet>
        <title>CareerForge | #1 AI Resume Builder — Beat ATS, Land Interviews</title>
        <meta name="description" content="CareerForge is the most powerful AI-powered resume and cover letter builder. Create ATS-optimized resumes in minutes, check your ATS score for free, and generate tailored cover letters. Trusted by Indian freshers and students." />
        <meta name="keywords" content="AI resume builder, ATS resume checker, cover letter generator, free resume maker, ATS-friendly resume, resume optimizer, CareerForge, resume templates, job application tools" />
        <meta name="author" content="CareerForge" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://careerforge.pro/" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CareerForge" />
        <meta property="og:url" content="https://careerforge.pro/" />
        <meta property="og:title" content="CareerForge — AI Resume Builder That Gets You Hired" />
        <meta property="og:description" content="Build a job-winning resume in minutes with CareerForge's AI tools. Free ATS score checker, smart resume editor, and one-click cover letter generator." />
        <meta property="og:image" content="https://careerforge.pro/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@careerforge" />
        <meta name="twitter:title" content="CareerForge — AI Resume Builder That Gets You Hired" />
        <meta name="twitter:description" content="Build a job-winning resume in minutes. Free ATS checker, AI editor, cover letter generator." />
        <meta name="twitter:image" content="https://careerforge.pro/og-image.jpg" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "CareerForge",
            "url": "https://careerforge.pro",
            "description": "CareerForge is an AI-powered resume builder and career toolkit built for Indian freshers and students. Features include a free ATS resume score checker, an intelligent resume editor with 20+ professional templates, a one-click AI cover letter generator, and a real-time resume enhancement engine. Designed to help job seekers beat Applicant Tracking Systems and land more interviews.",
            "applicationCategory": "BusinessApplication",
            "applicationSubCategory": "ResumeBuilder",
            "operatingSystem": "Any (Web Browser)",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR",
              "description": "Free tier with full access to resume builder, ATS checker, and cover letter generator"
            },
            "featureList": [
              "AI-powered resume builder",
              "Free ATS score checker",
              "AI cover letter generator",
              "20+ professional resume templates",
              "Real-time resume enhancement with AI",
              "PDF resume download",
              "ATS keyword optimization"
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is CareerForge?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "CareerForge is a free AI-powered resume builder and career toolkit built for Indian freshers. It includes a smart resume editor with 20+ professional templates, a real-time ATS score checker, and a one-click AI cover letter generator."
                }
              },
              {
                "@type": "Question",
                "name": "Is CareerForge free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. CareerForge offers a free tier that includes access to the full resume builder, ATS checker, and cover letter generator. No credit card is required to get started."
                }
              }
            ]
          })}
        </script>
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
            <div className={styles.mobileNavActions}>
              {isAuthenticated ? (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-1)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-secondary)', fontWeight: 'bold' }}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--on-surface)' }}>{user?.name}</span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--on-surface-variant)' }}>{user?.email}</span>
                    </div>
                  </div>
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
        {/* Left: Copy */}
        <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              Built for Indian freshers & students
            </div>

            <h1 className={styles.heroTitle}>
              Land your first job<br />with an<br />
              <span className={styles.heroAccent}>AI-powered resume</span>
            </h1>

            <p className={styles.heroSub}>
              CareerForge builds, tailors, and scores your resume in minutes — then matches you to real fresher jobs at top Indian companies. <strong>No experience required.</strong>
            </p>

            <div className={styles.heroCtas}>
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="lg">Go to Dashboard <ArrowRight size={16} /></Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button size="lg">Build my resume free <ArrowRight size={16} /></Button>
                </Link>
              )}
              <Link to="/templates">
                <Button variant="ghost" size="lg">See a sample resume</Button>
              </Link>
            </div>

          {/* Trust signals */}
          <div className={styles.trustRow}>
              <div className={styles.trustAvatars}>
                <div className={styles.trustAvatar} style={{ background: '#131b2e' }}>AK</div>
                <div className={styles.trustAvatar} style={{ background: '#2a4080' }}>PR</div>
                <div className={styles.trustAvatar} style={{ background: '#006c49' }}>SM</div>
                <div className={styles.trustAvatar} style={{ background: '#5a3e8a' }}>VR</div>
              </div>
              <div className={styles.trustText}>Joined by <strong>12,400+</strong> students from IIT, NIT & top colleges</div>
            </div>
        </div>

        {/* Right: Resume mock card (from reference design) */}
        <div className={styles.heroVisualWrap}>
          <div className={styles.heroCard}>
            {/* Browser chrome */}
            <div className={styles.cardTopbar}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div className={`${styles.dot} ${styles.dotRed}`} />
                <div className={`${styles.dot} ${styles.dotYellow}`} />
                <div className={`${styles.dot} ${styles.dotGreen}`} />
              </div>
              <span className={styles.cardTitle}>CareerForge — Resume Editor</span>
              <div className={styles.mockSaveBadge}>● Saved</div>
            </div>
            {/* Resume mini-preview */}
            <div className={styles.cardBody}>
              <div className={styles.resumePreview}>
                <div className={styles.rpName}>Alex Rivera</div>
                <div className={styles.rpRole}>Senior Software Engineer · 6+ Years Experience</div>
                <div className={styles.rpDivider} />
                <div className={styles.rpSectionLabel}>Experience</div>
                <div className={styles.rpExpTitle}>SDE Intern — Razorpay</div>
                <div className={styles.rpExpDate}>Jun 2024 – Aug 2024 · Remote</div>
                <div className={styles.rpBullet}>↗ Built payment retry flow reducing failed txns by 18%</div>
                <div className={styles.rpBullet}>↗ Wrote unit tests covering 90% of new endpoints</div>
                <div className={styles.rpDivider} />
                <div className={styles.rpSectionLabel}>Skills</div>
                <div className={styles.rpSkills}>
                  {['React', 'Node.js', 'MongoDB', 'Redis', 'TypeScript'].map(s => (
                    <span key={s} className={styles.rpSkillChip}>{s}</span>
                  ))}
                </div>
                <div className={styles.rpAts}><CheckCircle2 size={11} /> ATS Score 91/100</div>
              </div>
            </div>
          </div>

          {/* Floating AI suggestion card */}
          <div className={styles.aiFloat}>
            <div className={styles.aiFloatLabel}>🧠 AI Suggestion</div>
            <div className={styles.aiFloatText}>Add "distributed systems" — 4 matched JDs require it</div>
            <div className={styles.aiFloatAction}>Apply suggestion →</div>
          </div>

          {/* Floating JD score card */}
          <div className={styles.scoreFloat}>
            <div className={styles.scoreFloatTop}>
              <span className={styles.scoreFloatLabel}>JD Fit Score</span>
              <span className={styles.scoreFloatNum}>87</span>
            </div>
            <div className={styles.scoreFloatBar}>
              <div className={styles.scoreFloatFill} style={{ width: '87%' }} />
            </div>
            <div className={styles.scoreFloatSub}>↑ +23 after tailoring</div>
          </div>
        </div>
      </section>



      {/* ── Features ── */}
      <section className={styles.featuresSection} id="features">
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>AI Features</div>
          <h2 className={styles.sectionTitle}>Everything you need to get hired,<br />not just a pretty PDF</h2>
          <div className={styles.featureGrid}>
            {features.map((f) => (
              <div key={f.title} className={styles.featureCard} style={{ '--feature-accent': f.accent } as React.CSSProperties}>
                <div className={styles.featureIcon} style={{ background: `${f.accent}18`, color: f.accent }}>
                  {f.icon}
                </div>
                <div className={styles.featureTag}>{f.tag}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
                <Link to={f.link} className={styles.featureCta}>
                  {f.cta} <ChevronRight size={13} />
                </Link>
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
            <h2 className={styles.whyTitle}>Not a template generator.<br />A career intelligence engine.</h2>
            <p className={styles.whySub}>
              Most resume builders stop at the PDF. CareerForge keeps going — scoring your fit, rewriting your resume to match, and crafting your cover letter. One platform, three AI tools, zero manual grunt work.
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
                <div className={styles.whyCardCheck}><Check size={13} /></div>
                <div>
                  <div className={styles.whyCardTitle}>{c.title}</div>
                  <div className={styles.whyCardDesc}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── Testimonials ── */}
      <section className={styles.testimonialsSection} id="testimonials">
        <div className={styles.sectionInner} style={{ textAlign: 'center' }}>
          <div className={styles.sectionLabel}>Social Proof</div>
          <h2 className={styles.sectionTitle}>Real people. Real results.</h2>
          <div className={styles.testimonialGrid}>
            {testimonials.map((t) => (
              <div key={t.name} className={styles.testimonialCard}>
                <div className={styles.stars}>{[1,2,3,4,5].map(i => <Star key={i} size={13} fill="var(--secondary)" color="var(--secondary)" />)}</div>
                <p className={styles.testimonialQuote}>"{t.quote}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar} style={{ background: t.color }}>{t.avatar}</div>
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


      {/* ── Final CTA ── */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaContent}>
          <div className={styles.ctaIcon}><Sparkles size={28} /></div>
          <h2 className={styles.ctaTitle}>Your next job is one tailored<br />application away.</h2>
          <p className={styles.ctaSub}>
            Join 12,000+ job seekers using CareerForge to score, tailor, and send better applications — in a fraction of the time.
          </p>
          <div className={styles.ctaActions}>
            <Link to="/register">
              <Button size="lg">Build your free resume <ArrowRight size={16} /></Button>
            </Link>
            <Link to="/jd-tailor">
              <Button variant="ghost" size="lg" style={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.2)' }}>
                Try JD Fit Score free
              </Button>
            </Link>
          </div>
          <p className={styles.ctaNote}>No credit card · Cancel anytime · Free plan forever</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.brand}>
              <div className={styles.brandLogo}>CF</div>
              <span className={styles.brandName}>CareerForge</span>
            </div>
            <p className={styles.footerTagline}>AI resume builder, JD scorer, tailoring engine & cover letter generator — free to start.</p>
            <p className={styles.footerTagline} style={{ marginTop: 4 }}>careerforge.pro</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerCol}>
              <span className={styles.footerColTitle}>Product</span>
              <Link to="/templates" className={styles.footerLink}>Templates</Link>
              <Link to="/jd-tailor" className={styles.footerLink}>JD Fit Score</Link>
              <Link to="/cover-letter" className={styles.footerLink}>Cover Letter</Link>
              <Link to="/pricing" className={styles.footerLink}>Pricing</Link>
            </div>
            <div className={styles.footerCol}>
              <span className={styles.footerColTitle}>Account</span>
              <Link to="/login" className={styles.footerLink}>Log in</Link>
              <Link to="/register" className={styles.footerLink}>Get started free</Link>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 CareerForge. All rights reserved. · careerforge.pro</span>
        </div>
      </footer>
    </div>
  )
}
