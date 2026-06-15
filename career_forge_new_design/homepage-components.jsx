
// CareerForgePro Homepage Components
// Shared globally via window.*

const C = {
  brand: '#5B4FFF',
  brandDark: '#3D31E0',
  brandLight: '#EEF0FF',
  cta: '#FF6B35',
  ctaHover: '#E85A26',
  dark: '#0D0C1D',
  body: '#44445A',
  muted: '#9898A8',
  border: '#E8E7F0',
  borderDark: '#D0CFF0',
  bg: '#F9F8F6',
  surface: '#FFFFFF',
  surfaceTinted: '#F4F3FF',
};

// Scroll reveal hook
function useReveal() {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function RevealBox({ children, delay = 0, style = {} }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      ...style
    }}>{children}</div>
  );
}

// ── NAVBAR ──────────────────────────────────────────────────────
function Navbar({ tweaks }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = ['Features', 'How it works', 'Pricing', 'Roadmap'];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(249,248,246,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(14px)' : 'none',
      borderBottom: scrolled ? `1px solid ${C.border}` : 'none',
      transition: 'all 0.3s ease',
      padding: '0 clamp(20px, 5vw, 80px)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', height: 68, gap: 40 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: `linear-gradient(135deg, ${C.brand}, ${C.cta})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 14 L6 7 L9 10 L12 5 L15 9" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="15" cy="9" r="1.5" fill="white"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 17, color: C.dark, letterSpacing: '-0.3px' }}>
            CareerForgePro
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 32, flex: 1 }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, fontWeight: 500,
              color: C.body, textDecoration: 'none', letterSpacing: '-0.1px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = C.brand}
            onMouseLeave={e => e.target.style.color = C.body}
            >{l}</a>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="CareerForgePro%20Auth.html?view=login" style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
            color: C.body, textDecoration: 'none',
          }}>Sign in</a>
          <a href="CareerForgePro%20Auth.html?view=signup" style={{
            background: C.brand, color: '#fff', border: 'none', cursor: 'pointer',
            borderRadius: 10, padding: '9px 20px', textDecoration: 'none', display: 'inline-block',
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14,
            letterSpacing: '-0.1px',
            transition: 'background 0.2s, transform 0.15s',
          }}
          onMouseEnter={e => { e.target.style.background = C.brandDark; e.target.style.transform = 'scale(1.03)'; }}
          onMouseLeave={e => { e.target.style.background = C.brand; e.target.style.transform = 'scale(1)'; }}
          >Get Started Free</a>
        </div>
      </div>
    </nav>
  );
}

// ── HERO ────────────────────────────────────────────────────────
function Hero({ tweaks }) {
  const headline = tweaks?.headline || "Land the job.\nBeat the bots.";
  const [inputVal, setInputVal] = React.useState('');
  const [focused, setFocused] = React.useState(false);

  return (
    <section style={{ background: C.bg, paddingTop: 140, paddingBottom: 100, overflow: 'hidden', position: 'relative' }}>
      {/* Background gradient blobs */}
      <div style={{ position: 'absolute', top: -120, right: -100, width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${C.brandLight} 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #FFF0EA 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px,5vw,80px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        {/* Left: Text */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: C.brandLight, border: `1px solid ${C.borderDark}`,
            borderRadius: 100, padding: '6px 14px', marginBottom: 28,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.brand, display: 'inline-block' }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: C.brand }}>
              AI Resume Builder · Cover Letter · JD Match Score
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 'clamp(48px, 5.5vw, 76px)',
            fontWeight: 800, lineHeight: 1.08,
            color: C.dark, margin: '0 0 24px',
            letterSpacing: '-2.5px',
            whiteSpace: 'pre-line',
          }}>
            {headline.split('\n')[0]}{'\n'}
            <span style={{ background: `linear-gradient(135deg, ${C.brand}, ${C.cta})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {headline.split('\n')[1]}
            </span>
          </h1>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 18, lineHeight: 1.65,
            color: C.body, margin: '0 0 40px', maxWidth: 460,
          }}>
            Paste a job description and get an ATS-optimised resume in minutes — not hours. Built for India's freshers who want to apply smarter, not harder.
          </p>

          {/* Input + CTA */}
          <div style={{ marginBottom: 16 }}>
            <div style={{
              display: 'flex', gap: 0, border: `2px solid ${focused ? C.brand : C.border}`,
              borderRadius: 14, background: C.surface, overflow: 'hidden',
              transition: 'border-color 0.2s',
              boxShadow: focused ? `0 0 0 4px ${C.brandLight}` : 'none',
            }}>
              <input
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Paste a job description or job title…"
                style={{
                  flex: 1, border: 'none', outline: 'none', padding: '14px 18px',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: C.dark,
                  background: 'transparent',
                }}
              />
              <button style={{
                background: C.cta, color: '#fff', border: 'none', cursor: 'pointer',
                padding: '14px 26px', margin: 5, borderRadius: 10,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15,
                letterSpacing: '-0.2px', whiteSpace: 'nowrap',
                transition: 'background 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { e.target.style.background = C.ctaHover; e.target.style.transform = 'scale(1.03)'; }}
              onMouseLeave={e => { e.target.style.background = C.cta; e.target.style.transform = 'scale(1)'; }}
              >Build ATS Resume Free →</button>
            </div>
          </div>
          <a href="#templates" style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.muted,
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5,
          }}
          onMouseEnter={e => e.target.style.color = C.brand}
          onMouseLeave={e => e.target.style.color = C.muted}
          >Or browse ATS-ready templates →</a>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 36 }}>
            <div style={{ display: 'flex' }}>
              {['#5B4FFF','#FF6B35','#22C55E','#F59E0B'].map((col, i) => (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: '50%', background: col,
                  border: `2px solid ${C.bg}`, marginLeft: i === 0 ? 0 : -10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, color: 'white', fontWeight: 700,
                }}>
                  {['A','R','M','S'][i]}
                </div>
              ))}
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.muted }}>
              <strong style={{ color: C.dark }}>2,400+ freshers</strong> built their resumes this month
            </span>
          </div>
        </div>

        {/* Right: Resume mockup */}
        <ResumeMockup />
      </div>
    </section>
  );
}

function ResumeMockup() {
  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
      {/* Shadow card behind */}
      <div style={{
        position: 'absolute', top: 20, left: 30, right: -20,
        background: C.brandLight, borderRadius: 20, bottom: -20,
        border: `1px solid ${C.borderDark}`,
      }} />
      {/* Main card */}
      <div style={{
        background: C.surface, borderRadius: 20, padding: '28px 28px 24px',
        boxShadow: '0 20px 60px rgba(91,79,255,0.12)',
        border: `1px solid ${C.border}`,
        width: '100%', maxWidth: 400, position: 'relative', zIndex: 1,
        animation: 'floatCard 4s ease-in-out infinite',
      }}>
        {/* ATS score badge */}
        <div style={{
          position: 'absolute', top: -16, right: 24,
          background: '#22C55E', color: '#fff', borderRadius: 100, padding: '6px 14px',
          fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
          boxShadow: '0 4px 16px rgba(34,197,94,0.3)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span>✓</span> ATS Score: 94
        </div>

        {/* Resume header */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${C.brand}, ${C.cta})` }} />
            <div>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 16, color: C.dark }}>Arjun Mehta</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.muted }}>Software Engineer · Mumbai</div>
            </div>
          </div>
          {/* Skill chips */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['React', 'Node.js', 'Python', 'SQL'].map(s => (
              <span key={s} style={{
                background: C.brandLight, color: C.brand, borderRadius: 6,
                padding: '3px 10px', fontFamily: "'DM Sans', sans-serif",
                fontSize: 11.5, fontWeight: 500,
              }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Lines */}
        {[
          { w: '90%', label: 'Experience', bold: true },
          { w: '75%' }, { w: '60%' }, { w: '82%' },
          { w: '0%', gap: true },
          { w: '90%', label: 'Education', bold: true },
          { w: '70%' }, { w: '55%' },
        ].map((line, i) => (
          line.gap ? <div key={i} style={{ height: 8 }} /> :
          <div key={i} style={{ marginBottom: line.bold ? 6 : 5 }}>
            {line.bold && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, color: C.brand, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{line.label}</div>}
            <div style={{ height: line.bold ? 8 : 6, width: line.w, background: line.bold ? C.dark : C.border, borderRadius: 4, opacity: line.bold ? 0.7 : 1 }} />
          </div>
        ))}

        {/* Footer */}
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.muted }}>Generated for: Flipkart SDE Role</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: C.brand }}>Download PDF ↓</span>
        </div>
      </div>
    </div>
  );
}

// ── TRUST BAR ───────────────────────────────────────────────────
function TrustBar() {
  const stats = [
    { num: '2,400+', label: 'Resumes built' },
    { num: '94%', label: 'Avg ATS score' },
    { num: '3 min', label: 'To your resume' },
    { num: '₹0', label: 'To get started' },
  ];
  return (
    <section style={{ background: C.dark, padding: '32px clamp(20px,5vw,80px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        {stats.map(({ num, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 30, color: '#fff', letterSpacing: '-1px' }}>{num}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── FEATURES ────────────────────────────────────────────────────
function Features() {
  const cards = [
    {
      icon: '📄',
      color: C.brand,
      bg: C.brandLight,
      title: 'AI Resume Builder',
      desc: 'Paste a job description — our AI rewrites your resume to match keywords, tone, and structure that ATS bots love. No templates, just your story told right.',
      tag: 'Core feature',
    },
    {
      icon: '✉️',
      color: '#E67E22',
      bg: '#FFF5EB',
      title: 'AI Cover Letter Generator',
      desc: 'Stop staring at a blank page. Get a personalised cover letter that speaks to the hiring manager — not a robot — in under 60 seconds.',
      tag: 'Core feature',
    },
    {
      icon: '🎯',
      color: '#16A34A',
      bg: '#F0FDF4',
      title: 'JD Match Score',
      desc: 'See exactly how well your resume matches the job description before you apply. Know your score, fix the gaps, then hit submit with confidence.',
      tag: 'Core feature',
    },
  ];

  return (
    <section id="features" style={{ background: C.bg, padding: '100px clamp(20px,5vw,80px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <RevealBox>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: C.brand, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>What you get</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(36px,4vw,52px)', color: C.dark, margin: '0 0 16px', letterSpacing: '-1.5px' }}>
              Three tools. One goal.
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: C.body, maxWidth: 480, margin: '0 auto' }}>
              Everything a fresher needs to go from "applying and praying" to actually getting interviews.
            </p>
          </div>
        </RevealBox>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {cards.map((card, i) => (
            <RevealBox key={card.title} delay={i * 100}>
              <FeatureCard card={card} />
            </RevealBox>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ card }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.surface, borderRadius: 20, padding: '32px 28px',
        border: `1.5px solid ${hovered ? card.color + '50' : C.border}`,
        boxShadow: hovered ? `0 12px 40px ${card.color}18` : '0 2px 12px rgba(0,0,0,0.04)',
        transition: 'all 0.3s ease', cursor: 'default',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      <div style={{ width: 52, height: 52, borderRadius: 14, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 20 }}>
        {card.icon}
      </div>
      <div style={{ display: 'inline-block', background: card.bg, color: card.color, borderRadius: 100, padding: '3px 10px', fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, fontWeight: 600, marginBottom: 12 }}>{card.tag}</div>
      <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 22, color: C.dark, margin: '0 0 12px', letterSpacing: '-0.5px' }}>{card.title}</h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.7, color: C.body, margin: 0 }}>{card.desc}</p>
    </div>
  );
}

// ── HOW IT WORKS ────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num: '01', title: 'Paste the job description', desc: 'Copy the JD from Naukri, LinkedIn, or anywhere. Paste it in. We read it so you don\'t have to rewrite your resume from scratch again.' },
    { num: '02', title: 'Let AI do the heavy lifting', desc: 'Our model maps your profile to the job\'s keywords, formats it ATS-correctly, and writes it in a tone that hiring managers actually read.' },
    { num: '03', title: 'Download & apply with confidence', desc: 'Check your match score, tweak anything you like, and export a clean PDF — ready to send in under 5 minutes.' },
  ];
  return (
    <section id="how-it-works" style={{ background: C.surfaceTinted, padding: '100px clamp(20px,5vw,80px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <RevealBox>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: C.brand, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>The process</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(36px,4vw,52px)', color: C.dark, margin: 0, letterSpacing: '-1.5px' }}>
              From JD to resume in 3 steps
            </h2>
          </div>
        </RevealBox>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, position: 'relative' }}>
          {steps.map((step, i) => (
            <RevealBox key={step.num} delay={i * 120}>
              <div style={{ position: 'relative' }}>
                {i < steps.length - 1 && (
                  <div style={{ position: 'absolute', top: 28, left: 'calc(100% - 20px)', width: 'calc(100% - 60px)', height: 2, background: `linear-gradient(to right, ${C.brandLight}, ${C.brandLight})`, display: 'none' }} />
                )}
                <div style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 13,
                  color: C.brand, letterSpacing: '1px', marginBottom: 20,
                  width: 56, height: 56, background: C.brandLight, borderRadius: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${C.borderDark}`,
                }}>{step.num}</div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 21, color: C.dark, margin: '0 0 12px', letterSpacing: '-0.5px' }}>{step.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.7, color: C.body, margin: 0 }}>{step.desc}</p>
              </div>
            </RevealBox>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PRICING ─────────────────────────────────────────────────────
function Pricing() {
  const [annual, setAnnual] = React.useState(false);
  const plans = [
    {
      name: 'Free',
      price: '₹0',
      sub: 'forever',
      color: C.body,
      highlight: false,
      features: ['3 AI resume builds/month', '1 cover letter/month', '5 JD match scores/month', 'PDF export', 'ATS templates'],
    },
    {
      name: 'Pro',
      price: annual ? '₹149' : '₹179',
      sub: 'per month',
      color: C.brand,
      highlight: true,
      badge: 'Most Popular',
      features: ['20 AI resume builds/month', '10 cover letters/month', 'Unlimited JD scores', 'Priority PDF export', 'All premium templates', 'Email support'],
    },
    {
      name: 'Max',
      price: annual ? '₹299' : '₹349',
      sub: 'per month',
      color: '#0D0C1D',
      highlight: false,
      features: ['Unlimited everything', 'Bulk resume builder', 'LinkedIn optimiser', 'Interview prep (coming soon)', 'Dedicated support', 'Early access to features'],
    },
  ];

  return (
    <section id="pricing" style={{ background: C.bg, padding: '100px clamp(20px,5vw,80px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <RevealBox>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: C.brand, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Pricing</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(36px,4vw,52px)', color: C.dark, margin: '0 0 24px', letterSpacing: '-1.5px' }}>
              Start free. Upgrade when ready.
            </h2>
            {/* Toggle */}
            <div style={{ display: 'inline-flex', background: C.border, borderRadius: 100, padding: 4, gap: 2 }}>
              {['Monthly', 'Annual (save 17%)'].map((t, i) => (
                <button key={t} onClick={() => setAnnual(i === 1)} style={{
                  padding: '8px 20px', borderRadius: 100, border: 'none', cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 500,
                  background: (i === 1) === annual ? C.surface : 'transparent',
                  color: (i === 1) === annual ? C.dark : C.muted,
                  boxShadow: (i === 1) === annual ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.25s',
                }}>{t}</button>
              ))}
            </div>
          </div>
        </RevealBox>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'start' }}>
          {plans.map((plan, i) => (
            <RevealBox key={plan.name} delay={i * 80}>
              <PricingCard plan={plan} />
            </RevealBox>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ plan }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: plan.highlight ? C.dark : C.surface,
        borderRadius: 24, padding: '36px 32px',
        border: `1.5px solid ${plan.highlight ? C.brand : hovered ? C.borderDark : C.border}`,
        boxShadow: plan.highlight ? '0 24px 64px rgba(91,79,255,0.25)' : hovered ? '0 8px 32px rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.3s',
        transform: plan.highlight ? 'scale(1.04)' : hovered ? 'translateY(-3px)' : 'none',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {plan.badge && (
        <div style={{
          position: 'absolute', top: 18, right: 18,
          background: `linear-gradient(135deg, ${C.brand}, ${C.cta})`, color: '#fff',
          borderRadius: 100, padding: '4px 12px',
          fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
        }}>{plan.badge}</div>
      )}
      <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 17, color: plan.highlight ? 'rgba(255,255,255,0.7)' : C.muted, marginBottom: 8 }}>{plan.name}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
        <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 42, color: plan.highlight ? '#fff' : C.dark, letterSpacing: '-2px' }}>{plan.price}</span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: plan.highlight ? 'rgba(255,255,255,0.5)' : C.muted }}>{plan.sub}</span>
      </div>
      <div style={{ height: 1, background: plan.highlight ? 'rgba(255,255,255,0.1)' : C.border, margin: '20px 0' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        {plan.features.map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: plan.highlight ? 'rgba(91,79,255,0.3)' : C.brandLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke={plan.highlight ? '#fff' : C.brand} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: plan.highlight ? 'rgba(255,255,255,0.8)' : C.body }}>{f}</span>
          </div>
        ))}
      </div>
      <button style={{
        width: '100%', padding: '14px', border: plan.highlight ? 'none' : `1.5px solid ${C.brand}`,
        borderRadius: 12, cursor: 'pointer',
        background: plan.highlight ? `linear-gradient(135deg, ${C.brand}, ${C.cta})` : 'transparent',
        color: plan.highlight ? '#fff' : C.brand,
        fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15,
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => { if (!plan.highlight) { e.target.style.background = C.brandLight; } }}
      onMouseLeave={e => { if (!plan.highlight) { e.target.style.background = 'transparent'; } }}
      >{plan.name === 'Free' ? 'Start for Free' : `Get ${plan.name}`}</button>
    </div>
  );
}

// ── FUTURE VISION ───────────────────────────────────────────────
function FutureVision() {
  const items = [
    { icon: '🔍', title: 'Job Suggestions', desc: 'Resume-matched jobs delivered to you — no more scrolling through 200 listings.' },
    { icon: '⚡', title: 'One-Click Apply', desc: 'A role catches your eye? Your resume auto-tailors and the application is ready instantly.' },
    { icon: '📊', title: 'Application Tracker', desc: 'Know the status of every application in one clean dashboard. No more "did I apply?" confusion.' },
    { icon: '🗺️', title: 'Skill Gap Planner', desc: 'Targeting a role you\'re 80% ready for? Get a personalised prep plan with topics, quizzes & sandbox.' },
    { icon: '🎙️', title: 'AI Mock Interviews', desc: 'A conversational AI asks you real interview questions in audio mode. Answer out loud. Get feedback.' },
  ];
  return (
    <section id="roadmap" style={{ background: C.dark, padding: '100px clamp(20px,5vw,80px)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <RevealBox>
          <div style={{ marginBottom: 60 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: C.cta, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>What's coming</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(36px,4vw,52px)', color: '#fff', margin: 0, letterSpacing: '-1.5px', maxWidth: 560 }}>
                The full career co-pilot is on its way
              </h2>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Building in public — join the waitlist →</span>
            </div>
          </div>
        </RevealBox>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {items.map((item, i) => (
            <RevealBox key={item.title} delay={i * 80}>
              <div style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: 18, padding: '28px 24px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{item.icon}</div>
                <div style={{ display: 'inline-block', background: 'rgba(255,107,53,0.15)', color: C.cta, borderRadius: 100, padding: '3px 10px', fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, marginBottom: 10 }}>Coming soon</div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 18, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.3px' }}>{item.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, lineHeight: 1.65, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{item.desc}</p>
              </div>
            </RevealBox>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── TESTIMONIALS ────────────────────────────────────────────────
function Testimonials() {
  const quotes = [
    { name: 'Priya S.', role: 'B.Tech CSE, Pune', text: 'I was applying to 15+ jobs with the same resume for 2 months. Used CareerForgePro once, scored 91 on ATS, and got a call from Infosys in a week.', avatar: '#5B4FFF' },
    { name: 'Karan M.', role: 'MBA Fresher, Delhi', text: 'The cover letter generator is scary good. It picked up on things from my profile I wouldn\'t even think to mention. Felt like it actually read the JD.', avatar: '#FF6B35' },
    { name: 'Shreya R.', role: 'ECE Graduate, Chennai', text: 'I had zero idea why my resume wasn\'t working. The JD score told me exactly what was missing. Simple, clear, and honestly a bit magical.', avatar: '#22C55E' },
  ];
  return (
    <section style={{ background: C.bg, padding: '100px clamp(20px,5vw,80px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <RevealBox>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: C.brand, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Stories</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(36px,4vw,52px)', color: C.dark, margin: 0, letterSpacing: '-1.5px' }}>
              Real freshers. Real callbacks.
            </h2>
          </div>
        </RevealBox>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {quotes.map((q, i) => (
            <RevealBox key={q.name} delay={i * 100}>
              <div style={{ background: C.surface, borderRadius: 20, padding: '32px 28px', border: `1.5px solid ${C.border}` }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 32, color: C.brandLight, marginBottom: 12, lineHeight: 1 }}>"</div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15.5, lineHeight: 1.75, color: C.body, margin: '0 0 24px' }}>{q.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: q.avatar, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 15 }}>{q.name[0]}</div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, color: C.dark }}>{q.name}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: C.muted }}>{q.role}</div>
                  </div>
                </div>
              </div>
            </RevealBox>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ─────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = React.useState(null);
  const items = [
    { q: 'Is it really free to start?', a: 'Yes — the Free plan gives you 3 AI resume builds, 1 cover letter, and 5 JD scores every month. No credit card needed. Ever.' },
    { q: 'Will the resume actually pass ATS systems?', a: 'Our model is trained to optimise for ATS keyword matching, clean formatting, and correct section structure. Most users score between 85–96. That said, your content quality matters too — garbage in, garbage out.' },
    { q: 'Is my data safe?', a: 'Absolutely. We don\'t sell, share, or train on your personal resume data. Your content belongs to you, full stop.' },
    { q: 'Can I use this for non-tech jobs?', a: '100%. Our AI works across domains — engineering, finance, marketing, operations, design. If there\'s a JD, we can optimise for it.' },
    { q: 'What\'s the difference between Pro and Max?', a: 'Pro gives you high-volume usage for serious job seekers. Max is for power users who want unlimited everything plus early access to upcoming features like mock interviews and skill planners.' },
  ];
  return (
    <section id="faq" style={{ background: C.surfaceTinted, padding: '100px clamp(20px,5vw,80px)' }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <RevealBox>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: C.brand, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>FAQ</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(34px,4vw,48px)', color: C.dark, margin: 0, letterSpacing: '-1.5px' }}>
              Questions? We've got answers.
            </h2>
          </div>
        </RevealBox>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item, i) => (
            <RevealBox key={i} delay={i * 60}>
              <div
                style={{ background: C.surface, borderRadius: 16, border: `1.5px solid ${open === i ? C.borderDark : C.border}`, overflow: 'hidden', transition: 'border-color 0.2s', cursor: 'pointer' }}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
                  <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 600, fontSize: 17, color: C.dark, letterSpacing: '-0.3px' }}>{item.q}</span>
                  <span style={{ color: C.brand, fontSize: 20, fontWeight: 300, transition: 'transform 0.25s', transform: open === i ? 'rotate(45deg)' : 'none', display: 'inline-block', lineHeight: 1 }}>+</span>
                </div>
                {open === i && (
                  <div style={{ padding: '0 24px 20px' }}>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.75, color: C.body, margin: 0 }}>{item.a}</p>
                  </div>
                )}
              </div>
            </RevealBox>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA BANNER ──────────────────────────────────────────────────
function CTABanner() {
  return (
    <section style={{ background: C.bg, padding: '80px clamp(20px,5vw,80px)' }}>
      <RevealBox>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          background: `linear-gradient(135deg, ${C.dark} 0%, #1a1840 100%)`,
          borderRadius: 28, padding: 'clamp(48px, 6vw, 80px)', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, ${C.brand}30 0%, transparent 70%)` }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${C.cta}25 0%, transparent 70%)` }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(36px,4.5vw,60px)', color: '#fff', margin: '0 0 20px', letterSpacing: '-2px' }}>
              Your next interview is one<br/>resume away.
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: 'rgba(255,255,255,0.6)', margin: '0 0 40px' }}>Start free. No credit card. Takes 3 minutes.</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="CareerForgePro%20Auth.html?view=signup" style={{
                background: `linear-gradient(135deg, ${C.brand}, ${C.cta})`, color: '#fff', border: 'none',
                borderRadius: 12, padding: '16px 36px', cursor: 'pointer', display: 'inline-block',
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 16, textDecoration: 'none',
                boxShadow: '0 8px 28px rgba(91,79,255,0.4)', transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.target.style.transform = 'scale(1.04)'; e.target.style.boxShadow = '0 12px 36px rgba(91,79,255,0.5)'; }}
              onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 8px 28px rgba(91,79,255,0.4)'; }}
              >Build My ATS Resume — Free</a>
            </div>
          </div>
        </div>
      </RevealBox>
    </section>
  );
}

// ── FOOTER ──────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: C.dark, padding: '60px clamp(20px,5vw,80px) 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${C.brand}, ${C.cta})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><path d="M3 14 L6 7 L9 10 L12 5 L15 9" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/><circle cx="15" cy="9" r="1.5" fill="white"/></svg>
              </div>
              <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 15, color: '#fff' }}>CareerForgePro</span>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 260, margin: 0 }}>
              AI-powered career tools for India's next generation of talent.
            </p>
          </div>
          {[
            { title: 'Product', links: ['Resume Builder', 'Cover Letter', 'JD Score', 'Templates'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Refund Policy'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 16 }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(l => (
                  <a key={l} href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#fff'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
                  >{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>© 2025 CareerForgePro. Made with ♥ in India.</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Built for the 🇮🇳 fresher community</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  C, useReveal, RevealBox,
  Navbar, Hero, ResumeMockup, TrustBar,
  Features, FeatureCard, HowItWorks,
  Pricing, PricingCard, FutureVision,
  Testimonials, FAQ, CTABanner, Footer,
});
