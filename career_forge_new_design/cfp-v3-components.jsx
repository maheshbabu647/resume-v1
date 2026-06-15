
// CFP v3 — Airtable-inspired: centered hero, feature tabs, bento grid

const V3 = {
  brand: '#5046E4', brandDark: '#3730D0', brandLight: '#EEEDFF',
  coral: '#FF5C35', coralLight: '#FFF1ED',
  dark: '#0F0E2A', body: '#44445A', muted: '#8888A5',
  border: '#E8E6F4', borderSoft: '#F0EEF9',
  bg: '#FFFFFF', bgSoft: '#F7F6FF', bgWarm: '#FFFAF8',
  green: '#16A34A', greenLight: '#F0FDF4',
};

function useV3InView(threshold = 0.1) {
  const ref = React.useRef(null);
  const [vis, setVis] = React.useState(false);
  React.useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, vis];
}

function V3Reveal({ children, delay = 0, style = {} }) {
  const [ref, vis] = useV3InView();
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : 'translateY(24px)',
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      ...style,
    }}>{children}</div>
  );
}

// ── NAVBAR ────────────────────────────────────────────────────────
function NavbarV3() {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
      background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? `1px solid ${V3.border}` : 'none',
      transition: 'all 0.3s', padding: '0 clamp(20px,5vw,80px)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', height: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 'auto' }}>
          <div style={{ width: 30, height: 30, background: V3.brand, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 11L5 6L7.5 8.5L10 4L12.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 16, color: V3.dark }}>CareerForgePro</span>
        </div>
        <div style={{ display: 'flex', gap: 36, marginRight: 36 }}>
          {[['Features','#features'],['Pricing','#pricing'],['Insights','CareerForgePro%20Insights.html']].map(([l,h]) => (
            <a key={l} href={h} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, fontWeight: 500, color: V3.body, textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = V3.brand}
            onMouseLeave={e => e.target.style.color = V3.body}>{l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a href="CareerForgePro%20Auth.html?view=login" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, color: V3.body, textDecoration: 'none', padding: '8px 16px' }}>Sign in</a>
          <a href="CareerForgePro%20Auth.html?view=signup" style={{ background: V3.brand, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 22px', fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: 14, cursor: 'pointer', textDecoration: 'none', display: 'inline-block', transition: 'background 0.2s, transform 0.2s' }}
          onMouseEnter={e => { e.target.style.background = V3.brandDark; e.target.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.target.style.background = V3.brand; e.target.style.transform = 'none'; }}>Get Started Free</a>
        </div>
      </div>
    </nav>
  );
}

// ── HERO ──────────────────────────────────────────────────────────
function HeroV3New({ tweaks }) {
  const [ats, setAts] = React.useState(0);
  const [ready, setReady] = React.useState(false);
  const [activeKw, setActiveKw] = React.useState([]);
  const keywords = ['React.js', 'Node.js', 'REST APIs', 'Agile', 'SQL', 'Git'];

  React.useEffect(() => {
    const t1 = setTimeout(() => setReady(true), 100);
    const t2 = setTimeout(() => {
      let s = 0;
      const iv = setInterval(() => {
        s = Math.min(s + 2, 94);
        setAts(s);
        if (s >= 94) clearInterval(iv);
      }, 22);
    }, 700);
    const t3 = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        setActiveKw(prev => [...prev, i]);
        i++;
        if (i >= keywords.length) clearInterval(iv);
      }, 180);
    }, 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const fadeUp = (d = 0) => ({ opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(20px)', transition: `opacity 0.7s ease ${d}ms, transform 0.7s ease ${d}ms` });

  return (
    <section style={{ background: V3.bg, paddingTop: 130, paddingBottom: 0, overflow: 'hidden' }}>
      {/* Center-aligned text block */}
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', padding: '0 24px' }}>
        <div style={{
          opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(20px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: V3.brandLight, border: `1px solid ${V3.brand}30`, borderRadius: 100, padding: '6px 16px', marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, background: V3.brand, borderRadius: '50%', display: 'inline-block' }} />
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 600, color: V3.brand }}>AI Resume Builder for Indian Freshers</span>
          </div>

          {/* Headline — Notion formula: [what] + [who] + [result] */}
          <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 40, lineHeight: 1.18, letterSpacing: '-1.5px', color: V3.dark, margin: '0 0 20px', maxWidth: 600 }}>
            Most resumes never reach a human.{' '}
            <span style={{ color: V3.brand }}>Yours will.</span>
          </h1>

          {/* Sub — outcome-led */}
          <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 17.5, lineHeight: 1.7, color: V3.body, margin: '0 0 32px', maxWidth: 500 }}>
            Paste a job description. AI rewrites your resume — keywords matched, ATS score 90+, in under 3 minutes.
          </p>

          {/* ONE primary CTA — Shopify principle */}
          <div style={{ marginBottom: 12 }}>
            <button style={{ background: V3.coral, color: '#fff', border: 'none', borderRadius: 12, padding: '17px 40px', fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 17, cursor: 'pointer', boxShadow: `0 8px 32px ${V3.coral}40`, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = `0 12px 40px ${V3.coral}50`; }}
            onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = `0 8px 32px ${V3.coral}40`; }}>Build My ATS Resume — Free</button>
          </div>

          {/* Risk reversal directly under CTA — Shopify principle */}
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, color: V3.muted, marginBottom: 10 }}>
            No credit card required · Free forever
          </div>

          {/* Trust signals under CTA — Shopify principle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, justifyContent: 'center', marginBottom: 52, flexWrap: 'wrap' }}>
            {[['2,400+', 'resumes built this month'], ['94%', 'avg ATS score'], ['< 3 min', 'per resume']].map(([n, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 14, color: V3.dark }}>{n}</span>
                <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, color: V3.muted }}>{l}</span>
              </div>
            ))}
          </div>

          {/* Secondary — subtle text link only */}
          <a href="#" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13.5, color: V3.muted, textDecoration: 'none', borderBottom: `1px solid ${V3.border}`, paddingBottom: 1, marginTop: -36 }}
          onMouseEnter={e => e.target.style.color = V3.brand}
          onMouseLeave={e => e.target.style.color = V3.muted}>or browse ATS-ready templates →</a>
        </div>
      </div>

      {/* Wide product UI mockup */}
      <div style={{ ...fadeUp(360), maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,4vw,48px)', paddingBottom: 0 }}>
        <div style={{ background: V3.bg, borderRadius: '20px 20px 0 0', border: `1.5px solid ${V3.border}`, borderBottom: 'none', boxShadow: '0 -4px 0 0 rgba(80,70,228,0.06), 0 24px 80px rgba(80,70,228,0.08)', overflow: 'hidden' }}>
          {/* Browser chrome */}
          <div style={{ background: V3.bgSoft, borderBottom: `1px solid ${V3.border}`, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#FF5F57','#FEBC2E','#28C840'].map((c, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ flex: 1, background: '#fff', borderRadius: 6, padding: '5px 14px', fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, color: V3.muted, border: `1px solid ${V3.border}` }}>
              careerforgepro.in/builder
            </div>
          </div>

          {/* App content */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 460 }}>
            {/* Left: JD Input */}
            <div style={{ padding: '32px 28px', borderRight: `1px solid ${V3.border}` }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: V3.muted, marginBottom: 14 }}>Job Description</div>
              <div style={{ background: V3.bgSoft, border: `1px solid ${V3.border}`, borderRadius: 10, padding: 18, marginBottom: 16, minHeight: 200, position: 'relative' }}>
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, lineHeight: 1.8, color: V3.dark }}>
                  <strong style={{ color: V3.brand }}>Flipkart · SDE-1 Frontend</strong><br/><br/>
                  We're looking for a Frontend Engineer with strong fundamentals in <span style={{ background: `${V3.brand}15`, color: V3.brand, padding: '1px 4px', borderRadius: 3, fontWeight: 600 }}>React.js</span> and experience building scalable applications using <span style={{ background: `${V3.brand}15`, color: V3.brand, padding: '1px 4px', borderRadius: 3, fontWeight: 600 }}>REST APIs</span> and <span style={{ background: `${V3.brand}15`, color: V3.brand, padding: '1px 4px', borderRadius: 3, fontWeight: 600 }}>Node.js</span>. Familiarity with <span style={{ background: `${V3.brand}15`, color: V3.brand, padding: '1px 4px', borderRadius: 3, fontWeight: 600 }}>Agile</span> and good communication skills required.
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {keywords.map((kw, i) => (
                  <span key={kw} style={{
                    padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: "'Plus Jakarta Sans',sans-serif",
                    background: activeKw.includes(i) ? `${V3.green}18` : V3.bgSoft,
                    color: activeKw.includes(i) ? V3.green : V3.muted,
                    border: `1px solid ${activeKw.includes(i) ? V3.green + '40' : V3.border}`,
                    transition: 'all 0.3s ease',
                  }}>
                    {activeKw.includes(i) ? '✓ ' : ''}{kw}
                  </span>
                ))}
              </div>
              <button style={{ background: V3.brand, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: 14, cursor: 'pointer', width: '100%' }}>
                ✦ Optimise My Resume
              </button>
            </div>

            {/* Right: Resume output */}
            <div style={{ padding: '32px 28px', background: '#FEFEFE', position: 'relative' }}>
              {/* ATS Badge */}
              <div style={{ position: 'absolute', top: 20, right: 20, background: V3.green, color: '#fff', borderRadius: 8, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 700, boxShadow: '0 4px 16px rgba(22,163,74,0.25)' }}>
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                ATS Score: {ats}
              </div>

              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: V3.muted, marginBottom: 14 }}>Your Resume</div>

              {/* Resume content */}
              <div style={{ border: `1px solid ${V3.border}`, borderRadius: 10, padding: '20px 18px', background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${V3.borderSoft}` }}>
                  <div style={{ width: 4, height: 42, background: V3.brand, borderRadius: 2 }} />
                  <div>
                    <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 17, color: V3.dark, letterSpacing: '-0.3px' }}>Arjun Mehta</div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, color: V3.muted, marginTop: 2 }}>Frontend Engineer · Mumbai · arjun@email.com</div>
                  </div>
                </div>

                {[
                  { label: 'EXPERIENCE', lines: [
                    { text: 'Built React.js dashboards reducing load time by 40%', highlight: true },
                    { text: 'Designed REST APIs with Node.js for 50K+ daily users', highlight: true },
                    { text: 'Worked in cross-functional Agile sprints', highlight: true },
                  ]},
                  { label: 'SKILLS', chips: ['React.js ✓', 'Node.js ✓', 'REST APIs ✓', 'Agile ✓', 'SQL ✓', 'Git'] },
                ].map((sec, si) => (
                  <div key={si} style={{ marginBottom: 12 }}>
                    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 9.5, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: V3.brand, marginBottom: 8 }}>{sec.label}</div>
                    {sec.lines && sec.lines.map((l, li) => (
                      <div key={li} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        {l.highlight && <div style={{ width: 5, height: 5, background: V3.green, borderRadius: 1, flexShrink: 0 }} />}
                        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, color: l.highlight ? V3.dark : V3.body, fontWeight: l.highlight ? 500 : 400 }}>{l.text}</span>
                        {l.highlight && <span style={{ fontSize: 10, color: V3.green, fontWeight: 700, marginLeft: 'auto', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>matched</span>}
                      </div>
                    ))}
                    {sec.chips && (
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {sec.chips.map(c => (
                          <span key={c} style={{ background: c.includes('✓') ? `${V3.green}15` : V3.bgSoft, color: c.includes('✓') ? V3.green : V3.muted, padding: '2px 8px', borderRadius: 4, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 10.5, fontWeight: 600 }}>{c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div style={{ paddingTop: 10, borderTop: `1px solid ${V3.borderSoft}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, color: V3.muted }}>Optimised for: Flipkart SDE-1</span>
                  <button style={{ background: V3.brand, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>↓ Download PDF</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── LOGO STRIP ────────────────────────────────────────────────────
function LogoStripV3() {
  const companies = ['Infosys','Wipro','TCS','Flipkart','Swiggy','Zomato','BYJU\'S','PhonePe','Razorpay','Zepto','Meesho','Freshworks'];
  return (
    <section style={{ background: V3.bgSoft, padding: '32px clamp(20px,5vw,80px)', borderTop: `1px solid ${V3.border}`, borderBottom: `1px solid ${V3.border}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, color: V3.muted, textAlign: 'center', marginBottom: 20, fontWeight: 500 }}>Freshers used CareerForgePro to get hired at</p>
        <div style={{ display: 'flex', gap: 0, overflow: 'hidden', position: 'relative' }}>
          <div style={{ display: 'flex', gap: 48, animation: 'marquee 20s linear infinite', whiteSpace: 'nowrap' }}>
            {[...companies, ...companies].map((c, i) => (
              <span key={i} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, fontWeight: 700, color: 'rgba(15,14,42,0.25)', letterSpacing: '-0.2px' }}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FEATURE TABS ──────────────────────────────────────────────────
function FeatureTabsV3() {
  const [active, setActive] = React.useState(0);
  const tabs = [
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
      sub: 'See how well your resume matches a job in seconds. Find what\'s missing. Fix it. Re-score. Apply with confidence.',
      points: ['Identify the keywords you\'re missing', 'See a section-by-section breakdown', 'Get fixes you can apply in 2 minutes', 'Re-check your score after every edit'],
      visual: <ScoreVisual />,
    },
  ];

  return (
    <section id="features" style={{ background: V3.bg, padding: '100px clamp(20px,5vw,80px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <V3Reveal>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 600, color: V3.brand, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>What you'll do</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(36px,4vw,54px)', color: V3.dark, margin: 0, letterSpacing: '-1.5px' }}>Land more interviews. Faster.</h2>
          </div>
        </V3Reveal>

        {/* Tab buttons */}
        <div style={{ display: 'flex', gap: 0, borderBottom: `1.5px solid ${V3.border}`, marginBottom: 56 }}>
          {tabs.map((t, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0 32px 18px', position: 'relative',
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, fontWeight: 600,
              color: active === i ? V3.dark : V3.muted, transition: 'color 0.2s',
            }}>
              <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 11, color: active === i ? V3.brand : V3.muted, marginRight: 6 }}>{t.num}</span>
              {t.label}
              {active === i && <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 2.5, background: V3.brand, borderRadius: 2 }} />}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
          <V3Reveal>
            <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(28px,3vw,40px)', color: V3.dark, letterSpacing: '-1px', margin: '0 0 18px' }}>{tabs[active].headline}</h3>
            <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 16, lineHeight: 1.75, color: V3.body, margin: '0 0 28px' }}>{tabs[active].sub}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {tabs[active].points.map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 22, height: 22, background: V3.brandLight, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke={V3.brand} strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </div>
                  <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14.5, color: V3.dark, fontWeight: 500 }}>{p}</span>
                </div>
              ))}
            </div>
          </V3Reveal>
          <V3Reveal delay={120}>
            <div style={{ borderRadius: 16, overflow: 'hidden', border: `1.5px solid ${V3.border}`, boxShadow: '0 12px 48px rgba(80,70,228,0.08)' }}>
              {tabs[active].visual}
            </div>
          </V3Reveal>
        </div>
      </div>
    </section>
  );
}

function ResumeBuilderVisual() {
  return (
    <div style={{ background: V3.bgSoft, padding: 24 }}>
      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 700, color: V3.muted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10 }}>AI Resume Output</div>
      <div style={{ background: '#fff', borderRadius: 10, padding: 18, border: `1px solid ${V3.border}` }}>
        <div style={{ height: 8, width: '60%', background: V3.dark, borderRadius: 4, opacity: 0.7, marginBottom: 5 }} />
        <div style={{ height: 5, width: '40%', background: V3.border, borderRadius: 3, marginBottom: 16 }} />
        {[
          { w: '90%', highlight: true }, { w: '78%', highlight: true }, { w: '65%', highlight: false },
          { w: '85%', highlight: true }, { w: '70%', highlight: false },
        ].map((l, i) => (
          <div key={i} style={{ height: 6, width: l.w, background: l.highlight ? `${V3.brand}30` : V3.borderSoft, borderRadius: 3, marginBottom: 7, border: l.highlight ? `1px solid ${V3.brand}30` : 'none' }} />
        ))}
        <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
          {['React ✓','Node ✓','APIs ✓'].map(c => <span key={c} style={{ background: `${V3.green}15`, color: V3.green, padding: '3px 8px', borderRadius: 4, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 10.5, fontWeight: 600 }}>{c}</span>)}
        </div>
      </div>
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{ background: V3.green, color: '#fff', padding: '5px 12px', borderRadius: 6, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, fontWeight: 700 }}>ATS Score: 94 ✓</span>
      </div>
    </div>
  );
}

function CoverLetterVisual() {
  return (
    <div style={{ background: V3.bgWarm, padding: 24 }}>
      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 700, color: V3.muted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10 }}>Cover Letter Preview</div>
      <div style={{ background: '#fff', borderRadius: 10, padding: 20, border: `1px solid ${V3.border}`, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, lineHeight: 1.8, color: V3.dark }}>
        <div style={{ fontWeight: 600, marginBottom: 10 }}>Dear Hiring Manager,</div>
        <div style={{ color: V3.body }}>When I saw the <span style={{ background: V3.brandLight, color: V3.brand, padding: '1px 4px', borderRadius: 3, fontWeight: 600 }}>SDE-1 role at Flipkart</span>, I didn't just see a job posting — I saw two years of side-projects, late-night debugging sessions, and a genuine obsession with building fast, scalable UIs finally having a real home.</div>
        <div style={{ height: 5, width: '80%', background: V3.borderSoft, borderRadius: 3, margin: '10px 0' }} />
        <div style={{ height: 5, width: '65%', background: V3.borderSoft, borderRadius: 3 }} />
      </div>
      <div style={{ marginTop: 10, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, color: V3.green, fontWeight: 600 }}>✓ Personalised for this role · No generic phrases detected</div>
    </div>
  );
}

function ScoreVisual() {
  return (
    <div style={{ background: V3.bgSoft, padding: 24 }}>
      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 700, color: V3.muted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 14 }}>JD Match Analysis</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div style={{ position: 'relative', width: 72, height: 72 }}>
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="28" fill="none" stroke={V3.borderSoft} strokeWidth="8"/>
            <circle cx="36" cy="36" r="28" fill="none" stroke={V3.green} strokeWidth="8" strokeDasharray="176" strokeDashoffset="25" strokeLinecap="round" transform="rotate(-90 36 36)"/>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 18, color: V3.dark }}>94</div>
        </div>
        <div>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15, color: V3.dark }}>Excellent Match</div>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, color: V3.muted }}>14 of 15 keywords found</div>
        </div>
      </div>
      {[
        { label: 'Keywords', score: 14, total: 15, color: V3.green },
        { label: 'Format', score: 10, total: 10, color: V3.green },
        { label: 'Missing', score: 1, total: 1, color: '#F59E0B', tag: 'TypeScript' },
      ].map(r => (
        <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, width: 60, color: V3.body }}>{r.label}</div>
          <div style={{ flex: 1, height: 6, background: V3.borderSoft, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(r.score/r.total)*100}%`, background: r.color, borderRadius: 3, transition: 'width 1s ease' }} />
          </div>
          {r.tag && <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 10.5, color: '#F59E0B', fontWeight: 600 }}>{r.tag}</span>}
        </div>
      ))}
    </div>
  );
}

// ── BENTO GRID ────────────────────────────────────────────────────
function BentoGrid() {
  const cards = [
    { bg: V3.brandLight, color: V3.brand, prompt: 'Generate a tailored resume for this job', result: 'ATS-ready in 2 min 47 sec', icon: '⚡', wide: true },
    { bg: V3.coralLight, color: V3.coral, prompt: 'Increase your ATS score from 23 → 91', result: 'Now passes most ATS scanners', icon: '🎯' },
    { bg: V3.greenLight, color: V3.green, prompt: 'Write a personalised cover letter', result: 'No generic phrases. 60 seconds.', icon: '✉️' },
    { bg: '#FFF8E8', color: '#D97706', prompt: 'Find the keywords you\'re missing', result: '14/18 matched. Add 4 more.', icon: '🔍' },
  ];
  return (
    <section style={{ background: V3.bgSoft, padding: '100px clamp(20px,5vw,80px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <V3Reveal>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 600, color: V3.brand, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Real outcomes</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(34px,4vw,52px)', color: V3.dark, margin: 0, letterSpacing: '-1.5px' }}>What you get back,<br/>every time you apply.</h2>
          </div>
        </V3Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'auto auto', gap: 16 }}>
          {cards.map((card, i) => (
            <V3Reveal key={i} delay={i * 60} style={{ gridColumn: card.wide ? 'span 2' : 'span 1' }}>
              <BentoCard card={card} />
            </V3Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BentoCard({ card }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: card.bg, borderRadius: 16, padding: '28px 24px',
      border: `1.5px solid ${card.color}25`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      transform: hov ? 'translateY(-3px)' : 'none',
      boxShadow: hov ? `0 12px 40px ${card.color}15` : 'none',
      cursor: 'default',
    }}>
      <div style={{ fontSize: 28, marginBottom: 14 }}>{card.icon}</div>
      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, fontWeight: 600, color: V3.dark, marginBottom: 10, lineHeight: 1.4 }}>"{card.prompt}"</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 6, height: 6, background: card.color, borderRadius: '50%' }} />
        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, color: card.color, fontWeight: 600 }}>{card.result}</span>
      </div>
    </div>
  );
}

// ── PRICING ───────────────────────────────────────────────────────
function PricingV3() {
  const [annual, setAnnual] = React.useState(false);
  const plans = [
    { name: 'Free', price: '₹0', sub: 'forever', desc: 'For freshers just getting started', highlight: false, features: ['3 AI resume builds / month','1 cover letter / month','5 JD match scores / month','PDF export','ATS templates'], cta: 'Start free' },
    { name: 'Pro', price: annual ? '₹149' : '₹179', sub: '/ month', desc: 'For active job seekers', highlight: true, badge: 'Most popular', features: ['20 AI resume builds / month','10 cover letters / month','Unlimited JD scores','All premium templates','Priority support'], cta: 'Get Pro' },
    { name: 'Max', price: annual ? '₹299' : '₹349', sub: '/ month', desc: 'For power users & early access', highlight: false, features: ['Unlimited everything','LinkedIn optimiser','Interview prep (early access)','Skill gap planner (early access)','Dedicated support'], cta: 'Get Max' },
  ];
  return (
    <section id="pricing" style={{ background: V3.bg, padding: '100px clamp(20px,5vw,80px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <V3Reveal>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 600, color: V3.brand, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Pricing</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(36px,4vw,54px)', color: V3.dark, margin: '0 0 28px', letterSpacing: '-1.5px' }}>Start free. Upgrade when it works.</h2>
            <div style={{ display: 'inline-flex', background: V3.bgSoft, borderRadius: 100, padding: 4, border: `1px solid ${V3.border}` }}>
              {['Monthly','Annual (−17%)'].map((t, i) => (
                <button key={t} onClick={() => setAnnual(i === 1)} style={{ padding: '8px 20px', borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13.5, fontWeight: 500, background: (i === 1) === annual ? '#fff' : 'transparent', color: (i === 1) === annual ? V3.dark : V3.muted, boxShadow: (i === 1) === annual ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>{t}</button>
              ))}
            </div>
          </div>
        </V3Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, alignItems: 'start' }}>
          {plans.map((p, i) => (
            <V3Reveal key={p.name} delay={i * 80}>
              <div style={{ background: p.highlight ? V3.dark : V3.bg, borderRadius: 20, padding: '36px 32px', border: `1.5px solid ${p.highlight ? V3.brand : V3.border}`, boxShadow: p.highlight ? `0 24px 64px rgba(80,70,228,0.2)` : 'none', position: 'relative', transform: p.highlight ? 'scale(1.03)' : 'none' }}>
                {p.badge && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: V3.brand, color: '#fff', borderRadius: 100, padding: '5px 16px', fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>{p.badge}</div>}
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: '1px', textTransform: 'uppercase', color: p.highlight ? 'rgba(255,255,255,0.5)' : V3.muted, marginBottom: 10 }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 44, color: p.highlight ? '#fff' : V3.dark, letterSpacing: '-2px' }}>{p.price}</span>
                  <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, color: p.highlight ? 'rgba(255,255,255,0.45)' : V3.muted }}>{p.sub}</span>
                </div>
                <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13.5, color: p.highlight ? 'rgba(255,255,255,0.5)' : V3.muted, margin: '0 0 24px' }}>{p.desc}</p>
                <div style={{ height: 1, background: p.highlight ? 'rgba(255,255,255,0.1)' : V3.border, marginBottom: 20 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 28 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ width: 18, height: 18, borderRadius: 5, background: p.highlight ? 'rgba(255,255,255,0.1)' : V3.brandLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="8" height="7" viewBox="0 0 8 7" fill="none"><path d="M1 3.5L3 5.5L7 1" stroke={p.highlight ? '#fff' : V3.brand} strokeWidth="1.6" strokeLinecap="round"/></svg>
                      </div>
                      <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13.5, color: p.highlight ? 'rgba(255,255,255,0.75)' : V3.dark, lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button style={{ width: '100%', padding: '14px', borderRadius: 12, border: p.highlight ? 'none' : `1.5px solid ${V3.brand}`, background: p.highlight ? V3.brand : 'transparent', color: p.highlight ? '#fff' : V3.brand, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: 14.5, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { if (!p.highlight) { e.target.style.background = V3.brandLight; } else e.target.style.background = V3.brandDark; }}
                onMouseLeave={e => { if (!p.highlight) { e.target.style.background = 'transparent'; } else e.target.style.background = V3.brand; }}>{p.cta}</button>
              </div>
            </V3Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── TESTIMONIALS ──────────────────────────────────────────────────
function TestimonialsV3() {
  const qs = [
    { text: 'I was applying to 15 jobs with the same resume for 2 months. Used this once, scored 91 on ATS, got a call from Infosys in a week.', name: 'Priya S.', role: 'B.Tech CSE · Pune', col: V3.brand },
    { text: 'The cover letter generator is scary good. It picked up things from my profile I wouldn\'t even think to mention.', name: 'Karan M.', role: 'MBA Fresher · Delhi', col: V3.coral },
    { text: 'The JD score told me exactly what was missing. Simple, clear, and honestly a bit magical.', name: 'Shreya R.', role: 'ECE Graduate · Chennai', col: V3.green },
  ];
  return (
    <section style={{ background: V3.bgSoft, padding: '100px clamp(20px,5vw,80px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <V3Reveal><div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(36px,4vw,54px)', color: V3.dark, margin: 0, letterSpacing: '-1.5px' }}>Real freshers. Real callbacks.</h2>
        </div></V3Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {qs.map((q, i) => (
            <V3Reveal key={q.name} delay={i * 80}>
              <div style={{ background: '#fff', borderRadius: 18, padding: '32px 28px', border: `1.5px solid ${V3.border}`, boxShadow: '0 4px 20px rgba(80,70,228,0.04)' }}>
                <div style={{ color: q.col, fontSize: 40, lineHeight: 0.8, marginBottom: 16, fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800 }}>"</div>
                <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, lineHeight: 1.75, color: V3.body, margin: '0 0 24px' }}>{q.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: q.col, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 15 }}>{q.name[0]}</div>
                  <div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 14, color: V3.dark }}>{q.name}</div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12.5, color: V3.muted }}>{q.role}</div>
                  </div>
                </div>
              </div>
            </V3Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── ROADMAP ───────────────────────────────────────────────────────
function RoadmapV3() {
  const items = [
    { icon: '🔍', title: 'Job Suggestions', body: 'Resume-matched roles, delivered to you. No more scrolling through hundreds of listings.' },
    { icon: '⚡', title: 'One-Click Apply', body: 'A role catches your eye? Resume auto-tailors. Application fires in one click.' },
    { icon: '📊', title: 'Application Tracker', body: 'Every application. Every status. One clean view. No more spreadsheet anxiety.' },
    { icon: '🗺️', title: 'Skill Gap Planner', body: '80% ready for a role? Get a personalised prep plan with topics, quizzes, and sandboxes.' },
    { icon: '🎙️', title: 'AI Mock Interviews', body: 'A conversational AI asks real questions out loud. You answer. You get honest feedback.' },
  ];
  return (
    <section id="roadmap" style={{ background: V3.bg, padding: '100px clamp(20px,5vw,80px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <V3Reveal><div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 600, color: V3.coral, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>What's coming</div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(36px,4vw,54px)', color: V3.dark, margin: '0 0 16px', letterSpacing: '-1.5px' }}>The full career co-pilot<br/>is on its way.</h2>
          <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 17, color: V3.muted, margin: 0 }}>We're building in public. This is just the beginning.</p>
        </div></V3Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 16 }}>
          {items.map((item, i) => (
            <V3Reveal key={item.title} delay={i * 60}>
              <div style={{ background: V3.bgSoft, borderRadius: 16, padding: '28px 24px', border: `1.5px solid ${V3.border}` }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
                <div style={{ display: 'inline-block', background: V3.coralLight, color: V3.coral, borderRadius: 100, padding: '3px 10px', fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 600, marginBottom: 10 }}>Soon</div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 18, color: V3.dark, margin: '0 0 8px', letterSpacing: '-0.3px' }}>{item.title}</h3>
                <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13.5, lineHeight: 1.65, color: V3.body, margin: 0 }}>{item.body}</p>
              </div>
            </V3Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ────────────────────────────────────────────────────────────
function FAQV3() {
  const [open, setOpen] = React.useState(null);
  const items = [
    { q: 'Is it really free to start?', a: 'Yes. The Free plan gives you 3 AI resume builds, 1 cover letter, and 5 JD scores per month. No credit card needed. Ever.' },
    { q: 'Will the resume pass ATS?', a: 'Our model is trained to optimise for keyword matching, correct section structure, and clean formatting. Most users score 85–96. Your content quality matters too — we make it the best version of what you give us.' },
    { q: 'Is my data safe?', a: 'We don\'t sell, share, or train on your personal data. Your resume belongs to you.' },
    { q: 'Does it work for non-tech jobs?', a: 'Absolutely — finance, marketing, operations, design, HR. If there\'s a JD, we can optimise for it.' },
    { q: 'What\'s the difference between Pro and Max?', a: 'Pro is for active job seekers who need high volume. Max is for power users who want unlimited everything plus early access to mock interviews, skill planners, and one-click apply.' },
  ];
  return (
    <section style={{ background: V3.bgSoft, padding: '100px clamp(20px,5vw,80px)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <V3Reveal><div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(36px,4vw,52px)', color: V3.dark, margin: 0, letterSpacing: '-1.5px' }}>Questions?</h2>
        </div></V3Reveal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item, i) => (
            <V3Reveal key={i} delay={i * 50}>
              <div style={{ background: '#fff', borderRadius: 14, border: `1.5px solid ${open === i ? V3.brand + '40' : V3.border}`, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s' }} onClick={() => setOpen(open === i ? null : i)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: 16, color: V3.dark }}>{item.q}</span>
                  <span style={{ color: V3.brand, fontSize: 22, transition: 'transform 0.25s', transform: open === i ? 'rotate(45deg)' : 'none', display: 'inline-block', lineHeight: 1, flexShrink: 0 }}>+</span>
                </div>
                {open === i && <div style={{ padding: '0 24px 20px' }}><p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, lineHeight: 1.75, color: V3.body, margin: 0 }}>{item.a}</p></div>}
              </div>
            </V3Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── INLINE CTA ───────────────────────────────────────────────────
function InlineCTA() {
  return (
    <section style={{ background: V3.bg, padding: '40px clamp(20px,5vw,80px) 80px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(24px,2.6vw,34px)', color: V3.dark, margin: '0 0 20px', letterSpacing: '-1px' }}>Try it on a real job description.</h3>
        <button style={{ background: V3.coral, color: '#fff', border: 'none', borderRadius: 12, padding: '15px 34px', fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: `0 8px 32px ${V3.coral}40`, transition: 'all 0.2s' }}
        onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = `0 12px 40px ${V3.coral}50`; }}
        onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = `0 8px 32px ${V3.coral}40`; }}>Build My ATS Resume — Free</button>
        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, color: V3.muted, marginTop: 12 }}>No credit card · 2,400+ resumes built this month</div>
      </div>
    </section>
  );
}

// ── CTA FINAL ──────────────────────────────────────────────────────
function CTAFinalV3() {
  return (
    <section style={{ background: V3.bg, padding: '80px clamp(20px,5vw,80px)' }}>
      <V3Reveal>
        <div style={{ maxWidth: 1100, margin: '0 auto', background: `linear-gradient(135deg, ${V3.dark} 0%, #1A1850 100%)`, borderRadius: 28, padding: 'clamp(56px,6vw,88px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: `radial-gradient(circle, ${V3.brand}30 0%, transparent 70%)` }} />
          <div style={{ position: 'absolute', bottom: -50, left: -50, width: 240, height: 240, borderRadius: '50%', background: `radial-gradient(circle, ${V3.coral}25 0%, transparent 70%)` }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(38px,4.5vw,64px)', color: '#fff', margin: '0 0 20px', letterSpacing: '-2px', lineHeight: 1.05 }}>Your next interview is<br/>one resume away.</h2>
            <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 18, color: 'rgba(255,255,255,0.6)', margin: '0 0 40px' }}>Start free. No credit card. 3 minutes.</p>
            <button style={{ background: V3.coral, color: '#fff', border: 'none', borderRadius: 14, padding: '18px 44px', fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 17, cursor: 'pointer', boxShadow: `0 8px 32px ${V3.coral}50`, transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { e.target.style.transform = 'scale(1.04)'; e.target.style.boxShadow = `0 14px 44px ${V3.coral}60`; }}
            onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = `0 8px 32px ${V3.coral}50`; }}>Build My ATS Resume — Free →</button>
          </div>
        </div>
      </V3Reveal>
    </section>
  );
}

// ── FOOTER ─────────────────────────────────────────────────────────
function FooterV3() {
  return (
    <footer style={{ background: V3.dark, padding: '64px clamp(20px,5vw,80px) 36px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 26, height: 26, background: V3.brand, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 11L5 6L7.5 8.5L10 4L12.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15, color: '#fff' }}>CareerForgePro</span>
            </div>
            <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13.5, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, maxWidth: 240, margin: 0 }}>AI-powered career tools for India's next generation of talent.</p>
          </div>
          {[['Product',['Resume Builder','Cover Letter','JD Score','Templates']],['Company',['About','Blog','Careers','Contact']],['Legal',['Privacy Policy','Terms','Refund Policy']]].map(([h, ls]) => (
            <div key={h}>
              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>{h}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {ls.map(l => <a key={l} href="#" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13.5, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}>{l}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12.5, color: 'rgba(255,255,255,0.25)' }}>© 2025 CareerForgePro. Made in India.</span>
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12.5, color: 'rgba(255,255,255,0.25)' }}>Built for freshers who mean business.</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  V3, useV3InView, V3Reveal,
  NavbarV3, HeroV3New, LogoStripV3,
  FeatureTabsV3, ResumeBuilderVisual, CoverLetterVisual, ScoreVisual,
  BentoGrid, BentoCard,
  PricingV3, TestimonialsV3, RoadmapV3, FAQV3, InlineCTA, CTAFinalV3, FooterV3,
});
