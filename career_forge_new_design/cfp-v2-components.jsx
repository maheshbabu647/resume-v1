
// CareerForgePro v2 — Editorial Sharp Direction

const INK = '#09090F';
const CREAM = '#F2EFE8';
const ACCENT = '#FF3800';
const MID = '#6B6B7E';
const FAINT = 'rgba(9,9,15,0.08)';
const FAINT_D = 'rgba(242,239,232,0.1)';
const FAINT_D2 = 'rgba(242,239,232,0.06)';
const SURFACE = '#13131C';

function useInView(threshold = 0.12) {
  const ref = React.useRef(null);
  const [vis, setVis] = React.useState(false);
  React.useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, vis];
}

function Reveal({ children, delay = 0, y = 20, style = {} }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : `translateY(${y}px)`,
      transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      ...style,
    }}>{children}</div>
  );
}

function Label({ children, light = false }) {
  return (
    <span style={{
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 500, fontSize: 11, letterSpacing: '1.8px',
      textTransform: 'uppercase',
      color: light ? 'rgba(242,239,232,0.4)' : MID,
    }}>{children}</span>
  );
}

function Rule({ light = false, style = {} }) {
  return <div style={{ height: 1, background: light ? FAINT_D : FAINT, ...style }} />;
}

// ── NAVBAR ───────────────────────────────────────────────────────
function NavbarV2() {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
      background: scrolled ? 'rgba(9,9,15,0.94)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? `1px solid ${FAINT_D}` : 'none',
      transition: 'all 0.3s',
      padding: '0 clamp(20px,5vw,72px)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', height: 60, gap: 0 }}>
        {/* Logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 'auto' }}>
          <div style={{ width: 26, height: 26, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 10 L4.5 5 L6.5 7.5 L9 3 L11 6" stroke="white" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15.5, color: CREAM, letterSpacing: '-0.3px' }}>
            CareerForgePro
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          {['Features', 'Pricing', 'Roadmap'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 13.5, color: 'rgba(242,239,232,0.55)',
              textDecoration: 'none', transition: 'color 0.2s', letterSpacing: '0.1px',
            }}
            onMouseEnter={e => e.target.style.color = CREAM}
            onMouseLeave={e => e.target.style.color = 'rgba(242,239,232,0.55)'}
            >{l}</a>
          ))}
          <button style={{
            background: 'transparent', border: `1px solid rgba(242,239,232,0.25)`,
            color: CREAM, padding: '8px 18px', cursor: 'pointer',
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500,
            transition: 'all 0.2s', letterSpacing: '0.1px',
          }}
          onMouseEnter={e => { e.target.style.background = CREAM; e.target.style.color = INK; e.target.style.borderColor = CREAM; }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = CREAM; e.target.style.borderColor = 'rgba(242,239,232,0.25)'; }}
          >Sign in</button>
          <button style={{
            background: ACCENT, border: 'none', color: '#fff',
            padding: '9px 20px', cursor: 'pointer',
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600,
            transition: 'opacity 0.2s', letterSpacing: '0.2px',
          }}
          onMouseEnter={e => e.target.style.opacity = '0.86'}
          onMouseLeave={e => e.target.style.opacity = '1'}
          >Start Free</button>
        </div>
      </div>
    </nav>
  );
}

// ── HERO ─────────────────────────────────────────────────────────
function HeroV2({ tweaks }) {
  const [focused, setFocused] = React.useState(false);
  const [val, setVal] = React.useState('');

  return (
    <section style={{ background: INK, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(100px,10vh,130px) clamp(20px,5vw,72px) 80px', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(${FAINT_D2} 1px, transparent 1px), linear-gradient(90deg, ${FAINT_D2} 1px, transparent 1px)`,
        backgroundSize: '64px 64px',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 80, alignItems: 'center' }}>
          {/* Left */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
              <div style={{ width: 7, height: 7, background: ACCENT }} />
              <Label light>AI career platform · Built for India's freshers</Label>
            </div>

            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: 'clamp(60px, 7.5vw, 104px)',
              lineHeight: 0.92, letterSpacing: '-3.5px',
              color: CREAM, margin: '0 0 32px',
            }}>
              LAND<br />
              THE JOB.<br />
              <span style={{ color: ACCENT }}>BEAT<br />THE BOTS.</span>
            </h1>

            <p style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, lineHeight: 1.65,
              color: 'rgba(242,239,232,0.55)', margin: '0 0 48px', maxWidth: 440,
            }}>
              Paste a job description. Get an ATS-optimised resume in minutes — not hours. Cover letters, match scores, and a lot more.
            </p>

            {/* Input */}
            <div style={{
              border: `1px solid ${focused ? ACCENT : 'rgba(242,239,232,0.15)'}`,
              display: 'flex', background: SURFACE,
              transition: 'border-color 0.2s',
              marginBottom: 14,
            }}>
              <input
                value={val}
                onChange={e => setVal(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Paste a job description or job title…"
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  padding: '15px 20px', color: CREAM,
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: 14.5,
                }}
              />
              <button style={{
                background: ACCENT, border: 'none', color: '#fff', cursor: 'pointer',
                padding: '0 28px', margin: 4,
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14,
                letterSpacing: '0.2px', transition: 'opacity 0.2s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => e.target.style.opacity = '0.86'}
              onMouseLeave={e => e.target.style.opacity = '1'}
              >Build ATS Resume →</button>
            </div>

            <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
              <a href="#" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13.5, color: 'rgba(242,239,232,0.4)', textDecoration: 'none', borderBottom: '1px solid rgba(242,239,232,0.2)', paddingBottom: 1, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = CREAM}
              onMouseLeave={e => e.target.style.color = 'rgba(242,239,232,0.4)'}
              >Browse ATS templates</a>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: 'rgba(242,239,232,0.3)' }}>2,400+ freshers this month</span>
            </div>
          </div>

          {/* Right: Document preview */}
          <DocumentPreview />
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ maxWidth: 1280, margin: '80px auto 0', width: '100%', position: 'relative' }}>
        <Rule light />
        <div style={{ display: 'flex', gap: 0, marginTop: 0 }}>
          {[
            { n: '2,400+', l: 'Resumes built this month' },
            { n: '94%', l: 'Average ATS match score' },
            { n: '< 3 min', l: 'Time to your first resume' },
            { n: '₹0', l: 'Cost to start' },
          ].map(({ n, l }, i) => (
            <div key={l} style={{
              flex: 1, padding: '28px 0 0', borderRight: i < 3 ? `1px solid ${FAINT_D}` : 'none',
              paddingRight: 40, paddingLeft: i > 0 ? 40 : 0,
            }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 34, color: CREAM, letterSpacing: '-1.5px', lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: 'rgba(242,239,232,0.4)', marginTop: 6 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DocumentPreview() {
  const lines = [
    { type: 'name' }, { type: 'title' }, { type: 'contact' }, { type: 'gap' },
    { type: 'section', label: 'EXPERIENCE' },
    { type: 'job' }, { type: 'line', w: 92 }, { type: 'line', w: 78 }, { type: 'line', w: 85 },
    { type: 'gap' },
    { type: 'section', label: 'EDUCATION' },
    { type: 'job' }, { type: 'line', w: 70 },
    { type: 'gap' },
    { type: 'section', label: 'SKILLS' },
    { type: 'skills' },
  ];

  return (
    <div style={{ position: 'relative' }}>
      {/* ATS badge */}
      <div style={{
        position: 'absolute', top: -14, right: -14, zIndex: 2,
        background: '#00C853', color: '#fff', padding: '7px 14px',
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 12,
        letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        ATS SCORE 94
      </div>

      <div style={{
        background: '#FDFCF9', padding: '36px 32px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
        animation: 'floatDoc 5s ease-in-out infinite',
      }}>
        {/* Doc header bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ width: 3, height: 40, background: ACCENT }} />
          <div style={{ flex: 1, paddingLeft: 14 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: '#09090F', letterSpacing: '-0.5px' }}>Arjun Mehta</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11.5, color: '#6B6B7E', marginTop: 2 }}>Software Engineer · Mumbai, India</div>
          </div>
          <div style={{ fontSize: 10, fontFamily: "'Space Grotesk', sans-serif", color: '#aaa', textAlign: 'right', lineHeight: 1.5 }}>
            arjun@email.com<br/>+91 98xxx xxxxx
          </div>
        </div>

        <div style={{ height: 1, background: '#E0DDD6', marginBottom: 18 }} />

        {['EXPERIENCE', 'EDUCATION', 'SKILLS'].map((sec, si) => (
          <div key={sec} style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 9, letterSpacing: '2px', color: ACCENT, marginBottom: 8 }}>{sec}</div>
            {si === 0 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <div style={{ height: 7, width: '45%', background: '#1a1a2e', borderRadius: 2, opacity: 0.7 }} />
                  <div style={{ height: 7, width: '20%', background: '#E0DDD6', borderRadius: 2 }} />
                </div>
                {[88, 74, 81].map((w, i) => <div key={i} style={{ height: 5, width: `${w}%`, background: '#E0DDD6', borderRadius: 2, marginBottom: 4 }} />)}
              </>
            )}
            {si === 1 && (
              <>
                <div style={{ height: 7, width: '55%', background: '#1a1a2e', borderRadius: 2, opacity: 0.7, marginBottom: 5 }} />
                <div style={{ height: 5, width: '40%', background: '#E0DDD6', borderRadius: 2 }} />
              </>
            )}
            {si === 2 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['React', 'Node.js', 'Python', 'SQL', 'AWS', 'Git'].map(s => (
                  <span key={s} style={{ background: '#F0EEFF', color: '#4338CA', padding: '2px 8px', fontFamily: "'Space Grotesk', sans-serif", fontSize: 9.5, fontWeight: 600 }}>{s}</span>
                ))}
              </div>
            )}
            {si < 2 && <div style={{ height: 1, background: '#F0EDE8', marginTop: 14 }} />}
          </div>
        ))}

        <div style={{ marginTop: 10, fontFamily: "'Space Grotesk', sans-serif", fontSize: 9.5, color: '#aaa', display: 'flex', justifyContent: 'space-between' }}>
          <span>Generated for: Flipkart SDE-1</span>
          <span style={{ color: ACCENT, fontWeight: 600 }}>Download PDF</span>
        </div>
      </div>
    </div>
  );
}

// ── FEATURES ─────────────────────────────────────────────────────
function FeaturesV2() {
  const [active, setActive] = React.useState(0);
  const items = [
    {
      num: '01',
      title: 'AI Resume Builder',
      headline: 'Your resume,\nwritten for the job.',
      body: 'Paste a job description — we read it, find the keywords, and rewrite your resume to match what the ATS (and the hiring manager) actually wants to see. No guesswork. No template-filling.',
      detail: ['ATS keyword optimisation', 'Role-specific rewriting', 'Clean, recruiter-friendly format', 'PDF export, always'],
    },
    {
      num: '02',
      title: 'Cover Letter Generator',
      headline: 'A cover letter that\ndoesn\'t sound like everyone else\'s.',
      body: 'Most freshers write the same cover letter for every job. Ours writes one that actually responds to this specific job, this specific company — in under 60 seconds.',
      detail: ['Job-specific, not generic', 'Matches your resume\'s tone', 'Avoids the tired "I am writing to apply…"', 'Editable before export'],
    },
    {
      num: '03',
      title: 'JD Match Score',
      headline: 'Know your score\nbefore you apply.',
      body: 'See exactly how well your resume fits the job. We score it, show you what\'s missing, and tell you how to fix it — before a bot silently rejects your application.',
      detail: ['Keyword gap analysis', 'Section-by-section breakdown', 'Fix suggestions included', 'Recalculate after edits'],
    },
  ];

  return (
    <section id="features" style={{ background: CREAM, padding: '120px clamp(20px,5vw,72px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 72 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(40px,4.5vw,62px)', color: INK, letterSpacing: '-2px', margin: 0 }}>
              Three tools.<br />One goal.
            </h2>
            <Label>What you get</Label>
          </div>
        </Reveal>

        {/* Tab row */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${FAINT}`, marginBottom: 0 }}>
          {items.map((item, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 20px',
              marginRight: 48, position: 'relative',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 500,
              color: active === i ? INK : MID, transition: 'color 0.2s',
            }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 11, color: active === i ? ACCENT : MID, marginRight: 6 }}>{item.num}</span>
              {item.title}
              {active === i && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: INK }} />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, paddingTop: 64, minHeight: 280 }}>
          <div>
            <h3 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: 'clamp(34px,3.5vw,50px)', color: INK,
              letterSpacing: '-1.5px', margin: '0 0 24px', lineHeight: 1.05,
              whiteSpace: 'pre-line',
            }}>{items[active].headline}</h3>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, lineHeight: 1.75, color: MID, margin: 0 }}>
              {items[active].body}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {items[active].detail.map((d, i) => (
              <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 0', borderBottom: `1px solid ${FAINT}` }}>
                <div style={{ width: 6, height: 6, background: ACCENT, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: INK }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── HOW IT WORKS ─────────────────────────────────────────────────
function HowItWorksV2() {
  const steps = [
    { num: '01', title: 'Paste the JD', body: 'Copy the job description from Naukri, LinkedIn, Internshala — wherever. Paste it in. That\'s your starting point.' },
    { num: '02', title: 'AI reads it', body: 'Our model extracts keywords, required skills, tone, and structure. Then rewrites your resume around them — clean, ATS-correct, human-readable.' },
    { num: '03', title: 'Download & apply', body: 'Check your ATS match score. Edit anything you want. Export a clean PDF in seconds and send it out the same day.' },
  ];

  return (
    <section id="how-it-works" style={{ background: INK, padding: '120px clamp(20px,5vw,72px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 72 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(40px,4.5vw,62px)', color: CREAM, letterSpacing: '-2px', margin: 0 }}>
              How it works.
            </h2>
            <Label light>The process</Label>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 100}>
              <div style={{ borderLeft: `1px solid ${FAINT_D}`, padding: '0 48px 0 40px', minHeight: 220 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 52, color: ACCENT, letterSpacing: '-2px', lineHeight: 1, marginBottom: 24 }}>{s.num}</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 24, color: CREAM, letterSpacing: '-0.5px', margin: '0 0 14px' }}>{s.title}</h3>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, lineHeight: 1.75, color: 'rgba(242,239,232,0.5)', margin: 0 }}>{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PRICING ──────────────────────────────────────────────────────
function PricingV2() {
  const [annual, setAnnual] = React.useState(false);
  const plans = [
    {
      name: 'Free', price: '₹0', sub: 'forever',
      desc: 'For freshers just getting started',
      features: ['3 AI resume builds / month', '1 cover letter / month', '5 JD match scores / month', 'PDF export', 'ATS templates'],
      cta: 'Start free',
    },
    {
      name: 'Pro', price: annual ? '₹149' : '₹179', sub: '/ month',
      desc: 'For active job seekers',
      highlight: true,
      features: ['20 AI resume builds / month', '10 cover letters / month', 'Unlimited JD scores', 'All premium templates', 'Priority support'],
      cta: 'Get Pro',
    },
    {
      name: 'Max', price: annual ? '₹299' : '₹349', sub: '/ month',
      desc: 'For power users & early access',
      features: ['Unlimited everything', 'LinkedIn optimiser', 'Interview prep (early access)', 'Skill gap planner (early access)', 'Dedicated support'],
      cta: 'Get Max',
    },
  ];

  return (
    <section id="pricing" style={{ background: CREAM, padding: '120px clamp(20px,5vw,72px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 72, flexWrap: 'wrap', gap: 24 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(40px,4.5vw,62px)', color: INK, letterSpacing: '-2px', margin: 0 }}>
              Start free.<br/>Upgrade when it works.
            </h2>
            {/* Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: annual ? MID : INK }}>Monthly</span>
              <div onClick={() => setAnnual(!annual)} style={{ width: 44, height: 24, background: annual ? INK : '#D0CFC8', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                <div style={{ position: 'absolute', top: 3, left: annual ? 23 : 3, width: 18, height: 18, background: CREAM, transition: 'left 0.2s' }} />
              </div>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: annual ? INK : MID }}>Annual <span style={{ color: ACCENT, fontWeight: 600 }}>−17%</span></span>
            </div>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, border: `1px solid ${FAINT}` }}>
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 80}>
              <div style={{
                padding: '44px 40px',
                background: plan.highlight ? INK : 'transparent',
                borderRight: i < 2 ? `1px solid ${plan.highlight ? 'transparent' : FAINT}` : 'none',
                position: 'relative',
              }}>
                {plan.highlight && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: ACCENT }} />}
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: plan.highlight ? 'rgba(242,239,232,0.4)' : MID, marginBottom: 16 }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 46, color: plan.highlight ? CREAM : INK, letterSpacing: '-2px' }}>{plan.price}</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: plan.highlight ? 'rgba(242,239,232,0.4)' : MID }}>{plan.sub}</span>
                </div>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13.5, color: plan.highlight ? 'rgba(242,239,232,0.5)' : MID, marginBottom: 32 }}>{plan.desc}</p>

                <div style={{ height: 1, background: plan.highlight ? FAINT_D : FAINT, marginBottom: 28 }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <svg width="14" height="11" viewBox="0 0 14 11" fill="none" style={{ marginTop: 2, flexShrink: 0 }}>
                        <path d="M1.5 5.5L5 9L12.5 1.5" stroke={plan.highlight ? ACCENT : INK} strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: plan.highlight ? 'rgba(242,239,232,0.75)' : INK, lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>

                <button style={{
                  width: '100%', padding: '14px',
                  background: plan.highlight ? ACCENT : 'transparent',
                  border: `1px solid ${plan.highlight ? ACCENT : FAINT}`,
                  color: plan.highlight ? '#fff' : INK,
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14,
                  cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.2px',
                }}
                onMouseEnter={e => { if (!plan.highlight) { e.target.style.background = INK; e.target.style.color = CREAM; e.target.style.borderColor = INK; } else e.target.style.opacity = '0.86'; }}
                onMouseLeave={e => { if (!plan.highlight) { e.target.style.background = 'transparent'; e.target.style.color = INK; e.target.style.borderColor = FAINT; } else e.target.style.opacity = '1'; }}
                >{plan.cta}</button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── ROADMAP / FUTURE VISION ──────────────────────────────────────
function RoadmapV2() {
  const items = [
    { n: '04', title: 'Job Suggestions', body: 'Resume-matched roles delivered to you — no more scrolling through 200 listings.' },
    { n: '05', title: 'One-Click Apply', body: 'A role catches your eye? Resume auto-tailors. Application is ready in one click.' },
    { n: '06', title: 'Application Tracker', body: 'Every application. Every status. One clean dashboard. No more "did I apply?" anxiety.' },
    { n: '07', title: 'Skill Gap Planner', body: 'Targeting a role you\'re 80% ready for? Get a personalized plan: topics, quizzes, sandbox.' },
    { n: '08', title: 'AI Mock Interviews', body: 'A live AI asks you interview questions in audio mode. Answer out loud. Get honest feedback.' },
  ];

  return (
    <section id="roadmap" style={{ background: INK, padding: '120px clamp(20px,5vw,72px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 72, flexWrap: 'wrap', gap: 16 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(40px,4.5vw,62px)', color: CREAM, letterSpacing: '-2px', margin: 0 }}>
              The full career<br/>co-pilot is coming.
            </h2>
            <div>
              <Label light>What's next</Label>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: 'rgba(242,239,232,0.35)', marginTop: 6 }}>Building in public →</div>
            </div>
          </div>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {items.map((item, i) => (
            <Reveal key={item.n} delay={i * 60}>
              <RoadmapRow item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoadmapRow({ item }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid', gridTemplateColumns: '80px 1fr 1fr auto',
        alignItems: 'center', gap: 40,
        padding: '28px 0', borderTop: `1px solid ${FAINT_D}`,
        transition: 'background 0.2s',
        background: hov ? FAINT_D2 : 'transparent',
        cursor: 'default',
      }}
    >
      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: hov ? ACCENT : 'rgba(242,239,232,0.2)', transition: 'color 0.2s', letterSpacing: '-0.5px' }}>{item.n}</span>
      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 19, color: CREAM, letterSpacing: '-0.3px' }}>{item.title}</span>
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: 'rgba(242,239,232,0.45)', lineHeight: 1.6 }}>{item.body}</span>
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', color: ACCENT, border: `1px solid rgba(255,56,0,0.3)`, padding: '5px 10px', whiteSpace: 'nowrap' }}>COMING SOON</span>
    </div>
  );
}

// ── TESTIMONIALS ─────────────────────────────────────────────────
function TestimonialsV2() {
  const qs = [
    { text: 'I was applying to 15+ jobs with the same resume for 2 months. Used CareerForgePro once, scored 91 on ATS, and got a call from Infosys in a week.', name: 'Priya S.', role: 'B.Tech CSE, Pune' },
    { text: 'The cover letter generator is scary good. It picked up on things from my profile I wouldn\'t even think to mention. Felt like it actually read the JD.', name: 'Karan M.', role: 'MBA Fresher, Delhi' },
    { text: 'I had zero idea why my resume wasn\'t working. The JD score told me exactly what was missing. Simple, clear, and honestly a bit magical.', name: 'Shreya R.', role: 'ECE Graduate, Chennai' },
  ];
  return (
    <section style={{ background: CREAM, padding: '120px clamp(20px,5vw,72px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 72 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(40px,4.5vw,62px)', color: INK, letterSpacing: '-2px', margin: 0 }}>
              Real freshers.<br/>Real callbacks.
            </h2>
            <Label>Stories</Label>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, borderTop: `1px solid ${FAINT}`, borderLeft: `1px solid ${FAINT}` }}>
          {qs.map((q, i) => (
            <Reveal key={q.name} delay={i * 80}>
              <div style={{ padding: '48px 40px', borderRight: `1px solid ${FAINT}`, borderBottom: `1px solid ${FAINT}` }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 64, color: FAINT, lineHeight: 0.8, marginBottom: 24 }}>"</div>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15.5, lineHeight: 1.75, color: INK, margin: '0 0 32px' }}>{q.text}</p>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: INK }}>{q.name}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12.5, color: MID, marginTop: 3 }}>{q.role}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ──────────────────────────────────────────────────────────
function FAQV2() {
  const [open, setOpen] = React.useState(null);
  const items = [
    { q: 'Is it really free to start?', a: 'Yes. The Free plan gives you 3 AI resume builds, 1 cover letter, and 5 JD scores every month. No credit card. No trial period. Free means free.' },
    { q: 'Will the resume actually pass ATS?', a: 'Our model is trained to optimise for ATS keyword matching, correct section structure, and clean formatting. Most users score 85–96. Your content quality matters too — we work with what you give us.' },
    { q: 'Is my resume data safe?', a: 'We don\'t sell, share, or train on your personal data. Your resume belongs to you, full stop.' },
    { q: 'Does it work for non-tech roles?', a: '100%. Finance, marketing, operations, design, HR — if there\'s a job description, we can optimise for it.' },
    { q: 'What\'s the difference between Pro and Max?', a: 'Pro is for active job seekers who need high volume. Max is for power users who want unlimited everything plus early access to upcoming features: mock interviews, skill planners, one-click apply.' },
  ];

  return (
    <section id="faq" style={{ background: INK, padding: '120px clamp(20px,5vw,72px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 72 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(40px,4.5vw,62px)', color: CREAM, letterSpacing: '-2px', margin: 0 }}>
              Questions.
            </h2>
            <Label light>FAQ</Label>
          </div>
        </Reveal>
        {items.map((item, i) => (
          <div key={i} onClick={() => setOpen(open === i ? null : i)}
            style={{ borderTop: `1px solid ${FAINT_D}`, cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '26px 0' }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 18, color: CREAM, letterSpacing: '-0.3px', paddingRight: 40 }}>{item.q}</span>
              <span style={{ color: open === i ? ACCENT : 'rgba(242,239,232,0.3)', fontSize: 24, fontWeight: 300, transition: 'all 0.25s', transform: open === i ? 'rotate(45deg)' : 'none', display: 'inline-block', lineHeight: 1, flexShrink: 0 }}>+</span>
            </div>
            {open === i && (
              <div style={{ paddingBottom: 28 }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, lineHeight: 1.8, color: 'rgba(242,239,232,0.55)', margin: 0, maxWidth: 680 }}>{item.a}</p>
              </div>
            )}
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${FAINT_D}` }} />
      </div>
    </section>
  );
}

// ── CTA BANNER ───────────────────────────────────────────────────
function CTABannerV2() {
  return (
    <section style={{ background: ACCENT, padding: '100px clamp(20px,5vw,72px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 40 }}>
        <Reveal>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(40px,5vw,72px)', color: '#fff', letterSpacing: '-2.5px', margin: 0, lineHeight: 0.95 }}>
            Your next interview<br/>is one resume away.
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, color: 'rgba(255,255,255,0.75)', margin: 0 }}>Start free. No credit card. 3 minutes.</p>
            <button style={{
              background: '#fff', color: ACCENT, border: 'none', cursor: 'pointer',
              padding: '16px 40px', fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: 15, letterSpacing: '0.2px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.target.style.opacity = '0.9'}
            onMouseLeave={e => e.target.style.opacity = '1'}
            >Build My ATS Resume — Free →</button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── FOOTER ───────────────────────────────────────────────────────
function FooterV2() {
  return (
    <footer style={{ background: INK, padding: '72px clamp(20px,5vw,72px) 40px', borderTop: `1px solid ${FAINT_D}` }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 60 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 22, height: 22, background: ACCENT }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M5 17L8 10L11 13L14.5 7L18 11" stroke="white" strokeWidth="2" strokeLinecap="square"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: CREAM }}>CareerForgePro</span>
            </div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13.5, color: 'rgba(242,239,232,0.35)', lineHeight: 1.7, maxWidth: 240, margin: 0 }}>AI-powered career tools for India's next generation of talent.</p>
          </div>
          {[
            { h: 'Product', ls: ['Resume Builder', 'Cover Letter', 'JD Score', 'Templates'] },
            { h: 'Company', ls: ['About', 'Blog', 'Careers', 'Contact'] },
            { h: 'Legal', ls: ['Privacy Policy', 'Terms of Service', 'Refund Policy'] },
          ].map(({ h, ls }) => (
            <div key={h}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 600, color: 'rgba(242,239,232,0.3)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 18 }}>{h}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {ls.map(l => (
                  <a key={l} href="#" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13.5, color: 'rgba(242,239,232,0.45)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = CREAM}
                  onMouseLeave={e => e.target.style.color = 'rgba(242,239,232,0.45)'}
                  >{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${FAINT_D}`, paddingTop: 28, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12.5, color: 'rgba(242,239,232,0.25)' }}>© 2025 CareerForgePro. Made in India.</span>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12.5, color: 'rgba(242,239,232,0.25)' }}>Built for freshers who mean business.</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  INK, CREAM, ACCENT, MID, FAINT, FAINT_D, FAINT_D2, SURFACE,
  useInView, Reveal, Label, Rule,
  NavbarV2, HeroV2, DocumentPreview,
  FeaturesV2, HowItWorksV2, PricingV2,
  RoadmapV2, RoadmapRow, TestimonialsV2,
  FAQV2, CTABannerV2, FooterV2,
});
