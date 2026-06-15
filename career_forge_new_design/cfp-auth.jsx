
// CareerForgePro — Auth screens
// Same theme as homepage + app shell

const A = {
  brand: '#5046E4', brandDark: '#3730D0', brandLight: '#EEEDFF', brandSoft: '#F4F2FF',
  coral: '#FF5C35', coralLight: '#FFF1ED',
  dark: '#0F0E2A', body: '#44445A', muted: '#8888A5', muted2: '#B5B5C8',
  border: '#E8E6F4', borderSoft: '#F0EEF9',
  bg: '#FFFFFF', bgSoft: '#F7F6FF',
  green: '#16A34A', greenLight: '#F0FDF4',
};

function AIcon({ name, size = 18, color = 'currentColor', sw = 1.7 }) {
  const paths = {
    arrow: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    arrowL: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    eyeOff: <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>,
    check: <><polyline points="5 12 10 17 20 7"/></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></>,
    sparkle: <><path d="M12 3l1.5 5L19 9.5 13.5 11 12 16l-1.5-5L5 9.5 10.5 8z"/></>,
    lock: <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>{paths[name]}</svg>;
}

function Logo({ size = 30 }) {
  return (
    <a href="CareerForgePro%20Homepage.html" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
      <div style={{ width: size, height: size, background: A.brand, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 14 14" fill="none"><path d="M2 11L5 6L7.5 8.5L10 4L12.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 16, color: A.dark, letterSpacing: '-0.3px' }}>CareerForgePro</span>
    </a>
  );
}

// ── AUTH SHELL ────────────────────────────────────────────────────
function AuthShell({ view, setView }) {
  return (
    <div style={{ height: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: A.bg, overflow: 'hidden' }}>
      {/* Left — form (scrolls internally only if content exceeds viewport) */}
      <div style={{
        padding: 'clamp(28px, 3.5vw, 48px) clamp(40px, 5vw, 80px)',
        display: 'flex', flexDirection: 'column',
        height: '100vh', overflowY: 'auto',
      }}>
        <div style={{ marginBottom: 'clamp(24px, 3vw, 40px)' }}>
          <Logo />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', maxWidth: 440, width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ width: '100%' }}>
            {view === 'signup' && <SignupView setView={setView} />}
            {view === 'login' && <LoginView setView={setView} />}
            {view === 'verify' && <VerifyView setView={setView} />}
            {view === 'forgot' && <ForgotView setView={setView} />}
            {view === 'reset' && <ResetView setView={setView} />}
          </div>
        </div>
        <div style={{ marginTop: 'clamp(24px, 3vw, 40px)', display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: A.muted }}>
          <span>© 2026 CareerForgePro</span>
          <div style={{ display: 'flex', gap: 22 }}>
            <a href="#" style={{ color: A.muted, textDecoration: 'none' }}>Terms</a>
            <a href="#" style={{ color: A.muted, textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ color: A.muted, textDecoration: 'none' }}>Help</a>
          </div>
        </div>
      </div>

      {/* Right — brand panel */}
      <BrandPanel view={view} />
    </div>
  );
}

// ── BRAND PANEL — cinematic, restrained, premium ──────────────────
function BrandPanel({ view }) {
  const testimonials = [
    { quote: 'Got 3 interview calls in the first week after my ATS score jumped from 41 to 89.',  name: 'Priya Sharma', role: 'Frontend Engineer', company: 'Razorpay', initials: 'PS' },
    { quote: 'I come back every time I apply somewhere new. Tailoring takes three minutes.',       name: 'Arjun Kapoor', role: 'Product Manager',   company: 'Swiggy',   initials: 'AK' },
    { quote: 'Finally, AI edits I can trust — I see exactly what changed before I commit to it.',  name: 'Mehul Patel',  role: 'Senior SDE',        company: 'Flipkart', initials: 'MP' },
  ];
  const pick = { signup: 0, login: 1, verify: 2, forgot: 0, reset: 0 }[view] ?? 0;
  const t = testimonials[pick];

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: `linear-gradient(165deg, #15103E 0%, ${A.brandDark} 55%, ${A.brand} 100%)`,
      padding: 'clamp(48px, 5vw, 80px) clamp(48px, 5vw, 80px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      height: '100vh',
    }}>
      {/* Ambient atmosphere — large, slow, restrained */}
      <div style={{ position: 'absolute', top: '-20%', right: '-15%', width: '70%', aspectRatio: '1/1', borderRadius: '50%', background: `radial-gradient(circle, ${A.coral}26 0%, transparent 65%)`, animation: 'pulse-glow 11s ease-in-out infinite', pointerEvents: 'none', filter: 'blur(8px)' }} />
      <div style={{ position: 'absolute', bottom: '-30%', left: '-20%', width: '85%', aspectRatio: '1/1', borderRadius: '50%', background: `radial-gradient(circle, ${A.brand}55 0%, transparent 60%)`, animation: 'pulse-glow 14s ease-in-out infinite', pointerEvents: 'none', filter: 'blur(12px)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`, backgroundSize: '36px 36px', pointerEvents: 'none', WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)', maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)' }} />

      {/* ===== TOP — Eyebrow + Headline ===== */}
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 20 }}>
          CareerForgePro
        </div>
        <h2 style={{
          fontFamily: "'Bricolage Grotesque',sans-serif",
          fontWeight: 700,
          fontSize: 'clamp(34px, 3.4vw, 48px)',
          lineHeight: 1.05,
          letterSpacing: '-1.4px',
          color: '#fff',
          margin: 0,
          maxWidth: 520,
          textWrap: 'balance',
        }}>
          The resume that<br />gets you <span style={{ fontStyle: 'italic', fontWeight: 500, color: A.coral }}>noticed.</span>
        </h2>
        <p style={{
          fontSize: 15,
          lineHeight: 1.55,
          color: 'rgba(255,255,255,0.72)',
          margin: '20px 0 0',
          maxWidth: 440,
          fontWeight: 400,
        }}>
          Built with the people who got hired — refined every week as the ATS landscape shifts.
        </p>
      </div>

      {/* ===== MIDDLE — One cinematic testimonial ===== */}
      <div style={{ position: 'relative', maxWidth: 520 }}>
        <div style={{
          fontFamily: "'Bricolage Grotesque',sans-serif",
          fontSize: 60, lineHeight: 0.6,
          color: A.coral, opacity: 0.85,
          marginBottom: 14, fontWeight: 700,
        }}>“</div>
        <div style={{
          fontFamily: "'Bricolage Grotesque',sans-serif",
          fontWeight: 500,
          fontSize: 'clamp(20px, 1.9vw, 24px)',
          lineHeight: 1.35,
          letterSpacing: '-0.3px',
          color: '#fff',
          marginBottom: 24,
          textWrap: 'pretty',
        }}>
          {t.quote}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: `linear-gradient(135deg, ${A.coral}, #FF8A5C)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 14, color: '#fff',
            boxShadow: `0 8px 24px ${A.coral}40`,
            flexShrink: 0,
          }}>{t.initials}</div>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: '#fff', letterSpacing: '-0.1px' }}>{t.name}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
              {t.role}<span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 6px' }}>·</span>{t.company}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {testimonials.map((_, i) => (
              <div key={i} style={{
                width: i === pick ? 22 : 5, height: 5, borderRadius: 3,
                background: i === pick ? '#fff' : 'rgba(255,255,255,0.22)',
                transition: 'all 0.35s cubic-bezier(.2,.8,.2,1)',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* ===== BOTTOM — Hired-at companies (single proof block) ===== */}
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 18 }}>
          Members now work at
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 28, rowGap: 14 }}>
          {['Razorpay', 'Swiggy', 'CRED', 'Flipkart', 'PhonePe', 'Zomato', 'Meesho'].map((co, i) => (
            <span key={i} style={{
              fontFamily: "'Bricolage Grotesque',sans-serif",
              fontWeight: 700, fontSize: 17, letterSpacing: '-0.4px',
              color: 'rgba(255,255,255,0.7)',
              transition: 'color 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            >{co}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── FORM PRIMITIVES ───────────────────────────────────────────────
function Heading({ pretitle, title, sub }) {
  return (
    <div style={{ marginBottom: 'clamp(20px, 2.5vw, 32px)' }}>
      {pretitle && <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: A.brand, marginBottom: 14 }}>{pretitle}</div>}
      <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 'clamp(28px, 2.8vw, 36px)', letterSpacing: '-1.2px', color: A.dark, margin: '0 0 10px', lineHeight: 1.1, textWrap: 'balance' }}>{title}</h1>
      {sub && <p style={{ fontSize: 14.5, color: A.body, lineHeight: 1.55, margin: 0, textWrap: 'pretty' }}>{sub}</p>}
    </div>
  );
}

function Field({ label, hint, children, error }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
        {label && <label style={{ fontSize: 12.5, fontWeight: 600, color: A.dark, letterSpacing: '-0.1px' }}>{label}</label>}
        {hint}
      </div>
      {children}
      {error && <div style={{ fontSize: 12, color: A.coral, marginTop: 6, fontWeight: 500 }}>{error}</div>}
    </div>
  );
}

function TextInput({ value, onChange, type = 'text', placeholder, autoFocus, leftIcon }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{
      position: 'relative', display: 'flex', alignItems: 'center',
      background: A.bg, border: `1.5px solid ${focus ? A.brand : A.border}`, borderRadius: 12,
      transition: 'border-color 0.18s, box-shadow 0.18s',
      boxShadow: focus ? `0 0 0 4px ${A.brand}1A` : 'none',
    }}>
      {leftIcon && <div style={{ paddingLeft: 16, color: A.muted, display: 'flex' }}><AIcon name={leftIcon} size={16} color={focus ? A.brand : A.muted} /></div>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ flex: 1, background: 'transparent', border: 'none', padding: leftIcon ? '14px 16px 14px 11px' : '14px 16px', fontSize: 14.5, color: A.dark, width: '100%', fontWeight: 500 }} />
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder = 'Enter password' }) {
  const [show, setShow] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{
      position: 'relative', display: 'flex', alignItems: 'center',
      background: A.bg, border: `1.5px solid ${focus ? A.brand : A.border}`, borderRadius: 12,
      transition: 'border-color 0.18s, box-shadow 0.18s',
      boxShadow: focus ? `0 0 0 4px ${A.brand}1A` : 'none',
    }}>
      <div style={{ paddingLeft: 16, display: 'flex' }}><AIcon name="lock" size={16} color={focus ? A.brand : A.muted} /></div>
      <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ flex: 1, background: 'transparent', border: 'none', padding: '14px 14px 14px 11px', fontSize: 14.5, color: A.dark, fontWeight: 500 }} />
      <button onClick={() => setShow(s => !s)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0 16px', color: A.muted, display: 'flex' }}>
        <AIcon name={show ? 'eyeOff' : 'eye'} size={16} color={A.muted} />
      </button>
    </div>
  );
}

function PrimaryButton({ children, onClick, loading }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} disabled={loading}
      style={{
        width: '100%', background: A.coral, color: '#fff', border: 'none', borderRadius: 12,
        padding: '14px 22px', fontSize: 14.5, fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.1px',
        boxShadow: hov ? `0 14px 32px ${A.coral}55` : `0 8px 22px ${A.coral}38`,
        transition: 'transform 0.18s, box-shadow 0.18s',
        transform: hov ? 'translateY(-1px)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        opacity: loading ? 0.7 : 1,
      }}>
      {children}
    </button>
  );
}

function OAuthButtons({ context = 'sign up' }) {
  const providers = [
    { id: 'google', label: 'Google', icon: <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> },
    { id: 'linkedin', label: 'LinkedIn', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.43v6.31zM5.34 7.43a2.06 2.06 0 11.01-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.27V1.72C24 .77 23.2 0 22.22 0z"/></svg> },
  ];
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
      {providers.map(p => (
        <button key={p.id} style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          background: A.bg, color: A.dark, border: `1.5px solid ${A.border}`, borderRadius: 10,
          padding: '12px 16px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
          transition: 'border-color 0.18s, background 0.18s, transform 0.18s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = A.dark; e.currentTarget.style.background = A.bgSoft; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = A.border; e.currentTarget.style.background = A.bg; e.currentTarget.style.transform = 'none'; }}>
          {p.icon} {p.label}
        </button>
      ))}
    </div>
  );
}

function Divider({ label = 'or' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '0 0 18px' }}>
      <div style={{ flex: 1, height: 1, background: A.border }} />
      <span style={{ fontSize: 11.5, color: A.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.2px' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: A.border }} />
    </div>
  );
}

// ── PASSWORD STRENGTH ─────────────────────────────────────────────
function PasswordStrength({ pw }) {
  const checks = [
    { test: /.{8,}/, label: '8+ characters' },
    { test: /[A-Z]/, label: 'Uppercase letter' },
    { test: /[0-9]/, label: 'Number' },
    { test: /[^A-Za-z0-9]/, label: 'Symbol' },
  ];
  const passed = checks.filter(c => c.test.test(pw)).length;
  const colors = [A.muted2, A.coral, '#F59E0B', '#10B981', A.green];
  const labels = ['Too weak', 'Weak', 'Fair', 'Strong', 'Excellent'];
  if (!pw) return null;
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ flex: 1, height: 4, background: i < passed ? colors[passed] : A.borderSoft, borderRadius: 2, transition: 'background 0.2s' }} />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: colors[passed] }}>{labels[passed]}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        {checks.map((c, i) => {
          const ok = c.test.test(pw);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: ok ? A.green : A.muted }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: ok ? A.green : A.borderSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {ok && <AIcon name="check" size={8} color="#fff" sw={3} />}
              </div>
              {c.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── SIGNUP ────────────────────────────────────────────────────────
function SignupView({ setView }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  return (
    <>
      <Heading title="Create your account" sub="Free forever — no credit card. Your first ATS-ready resume in 3 minutes." />
      <OAuthButtons context="sign up" />
      <Divider label="or sign up with email" />

      <Field label="Full name"><TextInput value={name} onChange={setName} placeholder="Arjun Kapoor" /></Field>
      <Field label="Email"><TextInput value={email} onChange={setEmail} type="email" placeholder="you@email.com" leftIcon="mail" /></Field>
      <Field label="Password">
        <PasswordInput value={pw} onChange={setPw} placeholder="Create a password" />
        <PasswordStrength pw={pw} />
      </Field>

      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12.5, color: A.body, lineHeight: 1.55, margin: '4px 0 18px', cursor: 'pointer' }}>
        <input type="checkbox" defaultChecked style={{ marginTop: 2, accentColor: A.brand, width: 14, height: 14, cursor: 'pointer' }} />
        <span>I agree to the <a href="#" style={{ color: A.brand, fontWeight: 600, textDecoration: 'none' }}>Terms</a> and <a href="#" style={{ color: A.brand, fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</a>.</span>
      </label>

      <PrimaryButton onClick={() => setView('verify')}>
        Create account <AIcon name="arrow" size={14} color="#fff" sw={2.2} />
      </PrimaryButton>

      <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13.5, color: A.body }}>
        Already have an account? <button onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: A.brand, fontWeight: 700, cursor: 'pointer', fontSize: 13.5 }}>Log in</button>
      </div>
    </>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────
function LoginView({ setView }) {
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  return (
    <>
      <Heading title="Welcome back" sub="Pick up where you left off — your resumes are ready." />
      <OAuthButtons context="log in" />
      <Divider label="or log in with email" />

      <Field label="Email"><TextInput value={email} onChange={setEmail} type="email" placeholder="you@email.com" leftIcon="mail" autoFocus /></Field>
      <Field label="Password" hint={<button onClick={() => setView('forgot')} style={{ background: 'none', border: 'none', color: A.brand, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Forgot?</button>}>
        <PasswordInput value={pw} onChange={setPw} placeholder="Your password" />
      </Field>

      <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: A.body, margin: '4px 0 20px', cursor: 'pointer' }}>
        <input type="checkbox" style={{ accentColor: A.brand, width: 14, height: 14, cursor: 'pointer' }} />
        Keep me logged in for 30 days
      </label>

      <PrimaryButton onClick={() => { window.location.href = 'CareerForgePro App.html'; }}>
        Log in <AIcon name="arrow" size={14} color="#fff" sw={2.2} />
      </PrimaryButton>

      <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13.5, color: A.body }}>
        New to CareerForgePro? <button onClick={() => setView('signup')} style={{ background: 'none', border: 'none', color: A.brand, fontWeight: 700, cursor: 'pointer', fontSize: 13.5 }}>Create an account</button>
      </div>
    </>
  );
}

// ── VERIFY (CODE) ─────────────────────────────────────────────────
function VerifyView({ setView }) {
  const [digits, setDigits] = React.useState(['','','','','','']);
  const refs = React.useRef([]);
  const [resendIn, setResendIn] = React.useState(42);
  React.useEffect(() => {
    const t = setInterval(() => setResendIn(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  function setDigit(i, v) {
    if (!/^\d?$/.test(v)) return;
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) refs.current[i+1]?.focus();
  }
  function onKeyDown(i, e) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i-1]?.focus();
  }
  function onPaste(e) {
    e.preventDefault();
    const t = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6);
    if (!t) return;
    const next = ['','','','','',''];
    [...t].forEach((c, i) => next[i] = c);
    setDigits(next);
    refs.current[Math.min(t.length, 5)]?.focus();
  }
  const filled = digits.filter(Boolean).length;

  return (
    <>
      <button onClick={() => setView('signup')} style={{ background: 'none', border: 'none', color: A.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16, padding: 0 }}>
        <AIcon name="arrowL" size={14} color={A.muted} /> Back
      </button>
      <div style={{ width: 56, height: 56, background: A.brandLight, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
        <AIcon name="mail" size={24} color={A.brand} />
      </div>
      <Heading title="Check your email" sub={<>We sent a 6-digit code to <strong style={{ color: A.dark }}>arjun@email.com</strong>. Enter it below to verify your account.</>} />

      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }} onPaste={onPaste}>
        {digits.map((d, i) => (
          <input key={i} ref={el => refs.current[i] = el}
            value={d} onChange={e => setDigit(i, e.target.value)} onKeyDown={e => onKeyDown(i, e)}
            inputMode="numeric" maxLength={1} autoFocus={i === 0}
            style={{
              flex: 1, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 700,
              fontFamily: "'Bricolage Grotesque',sans-serif", color: A.dark,
              background: A.bg, border: `1.5px solid ${d ? A.brand : A.border}`, borderRadius: 10,
              transition: 'border-color 0.15s, box-shadow 0.15s',
              boxShadow: d ? `0 0 0 4px ${A.brand}15` : 'none',
            }} />
        ))}
      </div>

      <PrimaryButton loading={filled < 6} onClick={() => { window.location.href = 'CareerForgePro Onboarding.html'; }}>
        Verify and continue <AIcon name="arrow" size={14} color="#fff" sw={2.2} />
      </PrimaryButton>

      <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: A.muted }}>
        Didn't get a code? {resendIn > 0
          ? <span>Resend in {resendIn}s</span>
          : <button style={{ background: 'none', border: 'none', color: A.brand, fontWeight: 700, cursor: 'pointer', fontSize: 13 }} onClick={() => setResendIn(42)}>Resend code</button>}
      </div>
      <div style={{ marginTop: 24, padding: 14, background: A.bgSoft, borderRadius: 10, fontSize: 12.5, color: A.body, lineHeight: 1.6, display: 'flex', gap: 10 }}>
        <AIcon name="sparkle" size={14} color={A.brand} />
        <span>Wrong email? <button onClick={() => setView('signup')} style={{ background: 'none', border: 'none', color: A.brand, fontWeight: 600, cursor: 'pointer', fontSize: 12.5, padding: 0 }}>Edit email address</button></span>
      </div>
    </>
  );
}

// ── FORGOT ────────────────────────────────────────────────────────
function ForgotView({ setView }) {
  const [email, setEmail] = React.useState('');
  return (
    <>
      <button onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: A.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16, padding: 0 }}>
        <AIcon name="arrowL" size={14} color={A.muted} /> Back to log in
      </button>
      <Heading title="Forgot password?" sub="No worries. Enter the email tied to your account and we'll send you a reset link." />

      <Field label="Email"><TextInput value={email} onChange={setEmail} type="email" placeholder="you@email.com" leftIcon="mail" autoFocus /></Field>

      <PrimaryButton onClick={() => setView('reset')}>
        Send reset link <AIcon name="arrow" size={14} color="#fff" sw={2.2} />
      </PrimaryButton>

      <div style={{ textAlign: 'center', marginTop: 22, fontSize: 13.5, color: A.body }}>
        Remembered it? <button onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: A.brand, fontWeight: 700, cursor: 'pointer', fontSize: 13.5 }}>Log in</button>
      </div>
    </>
  );
}

// ── RESET ─────────────────────────────────────────────────────────
function ResetView({ setView }) {
  return (
    <>
      <div style={{ width: 56, height: 56, background: A.greenLight, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
        <AIcon name="check" size={24} color={A.green} sw={2.5} />
      </div>
      <Heading title="Check your inbox" sub={<>We sent a password reset link to <strong style={{ color: A.dark }}>arjun@email.com</strong>. The link expires in 30 minutes.</>} />

      <div style={{ background: A.bgSoft, border: `1px solid ${A.border}`, borderRadius: 12, padding: 16, marginBottom: 18 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: A.dark, marginBottom: 8 }}>Didn't receive it?</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: A.body, lineHeight: 1.7 }}>
          <li>Check your spam or promotions folder</li>
          <li>Make sure you typed the right email</li>
          <li>Wait 60 seconds — sometimes mail is delayed</li>
        </ul>
      </div>

      <button style={{ width: '100%', background: A.bg, color: A.dark, border: `1.5px solid ${A.border}`, borderRadius: 10, padding: '12px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Resend reset link</button>

      <div style={{ textAlign: 'center', marginTop: 22, fontSize: 13.5, color: A.body }}>
        <button onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: A.brand, fontWeight: 700, cursor: 'pointer', fontSize: 13.5 }}>← Back to log in</button>
      </div>
    </>
  );
}

Object.assign(window, {
  A, AIcon, Logo,
  AuthShell, BrandPanel,
  Heading, Field, TextInput, PasswordInput, PrimaryButton, OAuthButtons, Divider,
  PasswordStrength,
  SignupView, LoginView, VerifyView, ForgotView, ResetView,
});
