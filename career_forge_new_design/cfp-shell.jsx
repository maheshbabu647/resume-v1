
// CareerForgePro — App Shell
// Same theme as homepage: brand #5046E4, coral #FF5C35, Bricolage + Jakarta

const S = {
  brand: '#5046E4', brandDark: '#3730D0', brandLight: '#EEEDFF', brandSoft: '#F4F2FF',
  coral: '#FF5C35', coralLight: '#FFF1ED',
  dark: '#0F0E2A', body: '#44445A', muted: '#8888A5', muted2: '#B5B5C8',
  border: '#E8E6F4', borderSoft: '#F0EEF9',
  bg: '#FFFFFF', bgSoft: '#F7F6FF', bgWarm: '#FFFAF8',
  green: '#16A34A', greenLight: '#F0FDF4',
  amber: '#F59E0B', amberLight: '#FEF3C7',
  red: '#DC2626', redLight: '#FEE2E2',
  blue: '#2563EB', blueLight: '#DBEAFE',
};

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: 'home', tier: 'free' },
  { id: 'resumes', label: 'Resumes', icon: 'doc', tier: 'free', count: 5 },
  { id: 'cover-letters', label: 'Cover Letters', icon: 'mail', tier: 'free', count: 3 },
  { id: 'ats-score', label: 'ATS Score', icon: 'gauge', tier: 'free', href: 'CareerForgePro%20Tailor.html' },
  { id: 'templates', label: 'Templates', icon: 'grid', tier: 'free' },
  { id: 'insights', label: 'Insights', icon: 'book', tier: 'free', href: 'CareerForgePro%20Insights.html' },
  { id: '__divider', label: 'Coming soon', icon: null },
  { id: 'jobs', label: 'Job Board', icon: 'briefcase', tier: 'soon', count: 8 },
  { id: 'applications', label: 'Applications', icon: 'list', tier: 'soon' },
  { id: 'skill-gap', label: 'Skill Gap Prep', icon: 'target', tier: 'soon' },
  { id: 'interviews', label: 'Mock Interviews', icon: 'mic', tier: 'soon' },
];

function Icon({ name, size = 18, color = 'currentColor' }) {
  const s = size, sw = 1.7;
  const paths = {
    home: <><path d="M3 10L12 3l9 7v10a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V10z"/></>,
    doc: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></>,
    gauge: <><circle cx="12" cy="13" r="8"/><path d="M12 13l4-3"/><path d="M12 5V3"/></>,
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></>,
    list: <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill={color}/></>,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0"/><line x1="12" y1="18" x2="12" y2="22"/></>,
    search: <><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    bell: <><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></>,
    lock: <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></>,
    chevDown: <><polyline points="6 9 12 15 18 9"/></>,
    chevRight: <><polyline points="9 6 15 12 9 18"/></>,
    sparkle: <><path d="M12 3l1.5 5L19 9.5 13.5 11 12 16l-1.5-5L5 9.5 10.5 8z"/></>,
    book: <><path d="M4 3h7a4 4 0 014 4v14a3 3 0 00-3-3H4z"/><path d="M20 3h-7a4 4 0 00-4 4v14a3 3 0 013-3h8z"/></>,
    download: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    check: <><polyline points="5 12 10 17 20 7"/></>,
    arrow: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    sidebar: <><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {paths[name]}
    </svg>
  );
}

// ── APP SHELL ─────────────────────────────────────────────────────
function AppShell({ userState, currentRoute, setRoute }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [showSignupModal, setShowSignupModal] = React.useState(false);
  const [showCmdK, setShowCmdK] = React.useState(false);

  React.useEffect(() => {
    const fn = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowCmdK(s => !s); }
      if (e.key === 'Escape') { setShowCmdK(false); setShowSignupModal(false); }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', background: S.bgSoft, color: S.dark }}>
      <Sidebar
        collapsed={collapsed}
        toggleCollapsed={() => setCollapsed(c => !c)}
        userState={userState}
        currentRoute={currentRoute}
        setRoute={setRoute}
        onLockedClick={() => setShowSignupModal(true)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar
          userState={userState}
          onSignup={() => setShowSignupModal(true)}
          onCmdK={() => setShowCmdK(true)}
        />
        {userState === 'anonymous' && <AnonBanner onSignup={() => setShowSignupModal(true)} />}
        <main style={{ flex: 1, overflow: 'auto', padding: 0 }}>
          <RouteContent currentRoute={currentRoute} userState={userState} setRoute={setRoute} onSignup={() => setShowSignupModal(true)} />
        </main>
      </div>

      {showCmdK && <CmdK onClose={() => setShowCmdK(false)} setRoute={setRoute} />}
      {showSignupModal && <SignupModal onClose={() => setShowSignupModal(false)} />}
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────────────
function Sidebar({ collapsed, toggleCollapsed, userState, currentRoute, setRoute, onLockedClick }) {
  const W = collapsed ? 68 : 248;
  return (
    <aside style={{
      width: W, flexShrink: 0,
      background: S.bg,
      borderRight: `1px solid ${S.border}`,
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.22s ease',
    }}>
      {/* Logo — links back to homepage */}
      <a href="CareerForgePro%20Homepage.html" style={{ textDecoration: 'none', height: 60, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${S.borderSoft}`, transition: 'background 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.background = S.bgSoft}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        title="Back to homepage">
        <div style={{ width: 30, height: 30, background: S.brand, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 11L5 6L7.5 8.5L10 4L12.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        {!collapsed && <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15, color: S.dark, whiteSpace: 'nowrap', overflow: 'hidden' }}>CareerForgePro</span>}
      </a>

      {/* New button */}
      <div style={{ padding: 12 }}>
        <button style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 8, background: S.brand, color: '#fff', border: 'none', borderRadius: 9,
          padding: collapsed ? '10px' : '10px 12px',
          fontWeight: 600, fontSize: 13.5, cursor: 'pointer',
          boxShadow: `0 4px 12px ${S.brand}30`,
          transition: 'transform 0.15s, background 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = S.brandDark; }}
        onMouseLeave={e => { e.currentTarget.style.background = S.brand; }}>
          <Icon name="plus" size={16} color="#fff" />
          {!collapsed && <span>New resume</span>}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '4px 10px', overflowY: 'auto' }}>
        {NAV_ITEMS.map((item, i) => {
          if (item.id === '__divider') {
            return collapsed ? <div key={i} style={{ height: 1, background: S.borderSoft, margin: '12px 8px' }} /> : (
              <div key={i} style={{ padding: '14px 10px 6px', fontSize: 10.5, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: S.muted2 }}>{item.label}</div>
            );
          }
          const isFreeFeature = item.tier === 'free';
          const isLocked = item.tier === 'soon' || (userState === 'anonymous' && !isFreeFeature);
          const isActive = currentRoute === item.id && !isLocked;
          return (
            <NavLink
              key={item.id} item={item} isActive={isActive} isLocked={isLocked} collapsed={collapsed}
              onClick={() => isLocked ? onLockedClick() : (item.href ? (window.location.href = item.href) : setRoute(item.id))}
            />
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: 12, borderTop: `1px solid ${S.borderSoft}` }}>
        {userState === 'free' && !collapsed && (
          <div style={{ background: `linear-gradient(135deg, ${S.brand}, ${S.brandDark})`, borderRadius: 10, padding: 14, marginBottom: 8, color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Icon name="sparkle" size={14} color="#fff" />
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.3px' }}>Upgrade to Pro</span>
            </div>
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.8)', marginBottom: 10, lineHeight: 1.4 }}>Unlimited resumes & priority support.</div>
            <button style={{ background: '#fff', color: S.brand, border: 'none', borderRadius: 7, padding: '6px 10px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', width: '100%' }}>Upgrade — ₹179/mo</button>
          </div>
        )}
        <button onClick={toggleCollapsed} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, background: 'transparent', color: S.muted, border: 'none', borderRadius: 7,
          padding: 8, fontSize: 12, cursor: 'pointer', transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = S.brandSoft}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <Icon name="sidebar" size={15} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

function NavLink({ item, isActive, isLocked, collapsed, onClick }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      title={collapsed ? item.label : ''}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        background: isActive ? S.brandSoft : (hov ? S.bgSoft : 'transparent'),
        color: isActive ? S.brand : (isLocked ? S.muted2 : S.body),
        border: 'none', borderRadius: 8,
        padding: collapsed ? '9px' : '8px 10px',
        marginBottom: 2,
        fontSize: 13.5, fontWeight: isActive ? 600 : 500,
        cursor: 'pointer', textAlign: 'left',
        transition: 'background 0.15s, color 0.15s',
        justifyContent: collapsed ? 'center' : 'flex-start',
        position: 'relative',
      }}>
      <Icon name={item.icon} size={17} color={isActive ? S.brand : (isLocked ? S.muted2 : S.body)} />
      {!collapsed && (
        <>
          <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>{item.label}</span>
          {item.count != null && !isLocked && (
            <span style={{ fontSize: 11, fontWeight: 600, background: isActive ? '#fff' : S.borderSoft, color: isActive ? S.brand : S.muted, padding: '1px 7px', borderRadius: 100 }}>{item.count}</span>
          )}
          {isLocked && <Icon name="lock" size={13} color={S.muted2} />}
        </>
      )}
    </button>
  );
}

// ── TOP BAR ───────────────────────────────────────────────────────
function TopBar({ userState, onSignup, onCmdK }) {
  return (
    <header style={{
      height: 60, padding: '0 24px',
      background: S.bg, borderBottom: `1px solid ${S.border}`,
      display: 'flex', alignItems: 'center', gap: 16,
      flexShrink: 0,
    }}>
      {/* Search */}
      <button onClick={onCmdK} style={{
        flex: 1, maxWidth: 480,
        display: 'flex', alignItems: 'center', gap: 10,
        background: S.bgSoft, border: `1px solid ${S.border}`, borderRadius: 9,
        padding: '8px 14px', cursor: 'pointer',
        fontSize: 13.5, color: S.muted, textAlign: 'left',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = S.brand + '40'}
      onMouseLeave={e => e.currentTarget.style.borderColor = S.border}>
        <Icon name="search" size={15} color={S.muted} />
        <span style={{ flex: 1 }}>Search resumes, applications, jobs…</span>
        <kbd style={{ fontSize: 11, fontWeight: 600, background: S.bg, border: `1px solid ${S.border}`, borderRadius: 4, padding: '2px 6px', color: S.muted, fontFamily: 'inherit' }}>⌘K</kbd>
      </button>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        {userState === 'anonymous' ? (
          <>
            <a href="CareerForgePro%20Auth.html?view=login" style={{ background: 'none', border: 'none', color: S.body, fontSize: 13.5, fontWeight: 500, cursor: 'pointer', padding: '8px 12px', textDecoration: 'none' }}>Log in</a>
            <a href="CareerForgePro%20Auth.html?view=signup" style={{ background: S.coral, color: '#fff', border: 'none', borderRadius: 9, padding: '9px 18px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-block', boxShadow: `0 4px 14px ${S.coral}40` }}>Sign up — Save your work</a>
          </>
        ) : (
          <>
            <button style={{ background: 'transparent', border: `1px solid ${S.border}`, borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex', position: 'relative' }}>
              <Icon name="bell" size={16} color={S.body} />
              <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, background: S.coral, borderRadius: '50%', border: '1.5px solid #fff' }} />
            </button>
            {userState === 'pro' && (
              <span style={{ background: `${S.brand}15`, color: S.brand, borderRadius: 6, padding: '4px 10px', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.5px' }}>PRO</span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px 4px 4px', borderRadius: 100, border: `1px solid ${S.border}`, cursor: 'pointer' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${S.brand}, ${S.coral})`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>A</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: S.dark }}>Arjun</span>
              <Icon name="chevDown" size={14} color={S.muted} />
            </div>
          </>
        )}
      </div>
    </header>
  );
}

// ── ANON BANNER ───────────────────────────────────────────────────
function AnonBanner({ onSignup }) {
  return (
    <div style={{ background: `linear-gradient(90deg, ${S.coral}10 0%, ${S.brand}10 100%)`, borderBottom: `1px solid ${S.border}`, padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: S.dark, fontSize: 13.5, fontWeight: 500 }}>
        <Icon name="sparkle" size={14} color={S.coral} />
        <span>You're trying CareerForgePro. <strong style={{ fontWeight: 700 }}>Sign up to save your work</strong> — it takes 30 seconds.</span>
      </div>
      <button onClick={onSignup} style={{ marginLeft: 'auto', background: S.dark, color: '#fff', border: 'none', borderRadius: 7, padding: '6px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Save my work →</button>
    </div>
  );
}

// ── ROUTING ───────────────────────────────────────────────────────
function RouteContent({ currentRoute, userState, setRoute, onSignup }) {
  if (currentRoute === 'dashboard') return <Dashboard userState={userState} setRoute={setRoute} onSignup={onSignup} />;
  if (currentRoute === 'resumes') return <ResumesPage userState={userState} onSignup={onSignup} />;
  if (currentRoute === 'cover-letters') return <CoverLettersPage userState={userState} />;
  if (currentRoute === 'ats-score') return <ATSScorePage />;
  if (currentRoute === 'templates') return <TemplatesPage />;
  return <Dashboard userState={userState} setRoute={setRoute} onSignup={onSignup} />;
}

// ── DASHBOARD ─────────────────────────────────────────────────────
function Dashboard({ userState, setRoute, onSignup }) {
  if (userState === 'anonymous') return <AnonDashboard setRoute={setRoute} onSignup={onSignup} />;
  return <UserDashboard userState={userState} setRoute={setRoute} />;
}

function AnonDashboard({ setRoute, onSignup }) {
  const [jdText, setJdText] = React.useState('');
  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '56px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brandLight, border: `1px solid ${S.brand}30`, borderRadius: 100, padding: '5px 14px', marginBottom: 18 }}>
          <Icon name="sparkle" size={12} color={S.brand} />
          <span style={{ fontSize: 12, fontWeight: 600, color: S.brand }}>Try it free — no signup needed</span>
        </div>
        <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(32px,3.6vw,46px)', letterSpacing: '-1.5px', lineHeight: 1.15, color: S.dark, margin: '0 0 14px' }}>
          Welcome. Let's build your<br/>first ATS-ready resume.
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: S.body, margin: 0, maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
          Paste a job description below. We'll generate a tailored resume in under 3 minutes — no account required.
        </p>
      </div>

      {/* Big paste box */}
      <div style={{ background: S.bg, border: `2px dashed ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 28, transition: 'border-color 0.2s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Icon name="briefcase" size={16} color={S.brand} />
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: S.muted }}>Step 1 — Paste a Job Description</span>
        </div>
        <textarea
          value={jdText} onChange={e => setJdText(e.target.value)}
          placeholder={"Paste the full JD here. Example:\n\nSDE-1 Frontend Engineer at Flipkart. Looking for someone with React.js, REST APIs, Node.js…"}
          style={{
            width: '100%', minHeight: 160,
            background: S.bgSoft, border: `1px solid ${S.border}`, borderRadius: 10,
            padding: 16, fontSize: 14, lineHeight: 1.65, color: S.dark, resize: 'vertical',
            outline: 'none', transition: 'border-color 0.15s',
          }}
          onFocus={e => e.target.style.borderColor = S.brand}
          onBlur={e => e.target.style.borderColor = S.border}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
          <button style={{ background: S.coral, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 22px', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: `0 6px 20px ${S.coral}35` }}>
            <Icon name="sparkle" size={14} color="#fff" />
            Generate My Resume
          </button>
          <span style={{ fontSize: 13, color: S.muted }}>or</span>
          <button style={{ background: S.bg, color: S.dark, border: `1px solid ${S.border}`, borderRadius: 10, padding: '11px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Upload existing resume</button>
        </div>
      </div>

      {/* Try cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { route: 'resumes', icon: 'doc', title: 'Resume Builder', sub: 'Tailor your resume to a JD', col: S.brand, bg: S.brandLight },
          { route: 'cover-letters', icon: 'mail', title: 'Cover Letter', sub: 'Personalised in 60 seconds', col: S.coral, bg: S.coralLight },
          { route: 'ats-score', icon: 'gauge', title: 'ATS Score', sub: 'Check before you apply', col: S.green, bg: S.greenLight, href: 'CareerForgePro%20Tailor.html' },
        ].map(c => (
          <button key={c.route} onClick={() => c.href ? (window.location.href = c.href) : setRoute(c.route)} style={{
            background: S.bg, border: `1px solid ${S.border}`, borderRadius: 14,
            padding: 18, textAlign: 'left', cursor: 'pointer',
            transition: 'transform 0.15s, border-color 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = c.col + '40'; e.currentTarget.style.boxShadow = `0 8px 24px ${c.col}15`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = S.border; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ width: 36, height: 36, background: c.bg, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Icon name={c.icon} size={17} color={c.col} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: S.dark, marginBottom: 3 }}>{c.title}</div>
            <div style={{ fontSize: 12.5, color: S.muted }}>{c.sub}</div>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 36, padding: '20px 24px', background: S.bg, border: `1px solid ${S.border}`, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Icon name="lock" size={18} color={S.muted} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: S.dark, marginBottom: 2 }}>Your work isn't saved yet</div>
          <div style={{ fontSize: 12.5, color: S.muted }}>Sign up free to keep your resumes, track applications, and unlock job suggestions.</div>
        </div>
        <button onClick={onSignup} style={{ background: S.dark, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Sign up free →</button>
      </div>
    </div>
  );
}

function UserDashboard({ userState, setRoute }) {
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();
  const dateStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  // "Pick up where you left off" — one of each
  const recents = [
    { kind: 'resume', title: 'Frontend Engineer', co: 'Flipkart', score: 94, when: '2h ago', href: 'CareerForgePro%20Editor.html' },
    { kind: 'cover', title: 'Cover letter — SDE-1', co: 'Razorpay', when: 'Yesterday', href: 'CareerForgePro%20Editor.html' },
    { kind: 'ats', title: 'ATS check', co: 'Swiggy · Product Designer', score: 78, when: '3d ago', href: 'CareerForgePro%20Tailor.html' },
  ];

  // Activity feed — latest 4
  const activity = [
    { kind: 'score', icon: 'gauge', text: <>You scored <strong>91/100</strong> on <strong>Razorpay SDE</strong></>, when: '2h ago', col: S.green },
    { kind: 'cover', icon: 'mail', text: <>Cover letter for <strong>Swiggy</strong> ready to review</>, when: 'Yesterday', col: S.coral },
    { kind: 'apply', icon: 'briefcase', text: <>You applied to <strong>4 roles</strong> this week</>, when: '2d ago', col: S.brand },
    { kind: 'resume', icon: 'doc', text: <>Created resume <strong>Frontend Intern · Zomato</strong></>, when: '1w ago', col: S.amber },
  ];

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: 'clamp(40px, 5vw, 64px) clamp(24px, 4vw, 48px) 80px' }}>
      {/* ===== Greeting — calm, 1 line ===== */}
      <div style={{ marginBottom: 44 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase', color: S.muted, marginBottom: 12 }}>
          {dateStr}
        </div>
        <h1 style={{
          fontFamily: "'Bricolage Grotesque',sans-serif",
          fontWeight: 700, fontSize: 'clamp(32px, 3.6vw, 42px)',
          letterSpacing: '-1.4px', color: S.dark, margin: 0,
          lineHeight: 1.05,
        }}>
          {greeting}, <span style={{ color: S.brand }}>Arjun.</span>
        </h1>
      </div>

      {/* ===== Pick up where you left off ===== */}
      <SectionLabel title="Pick up where you left off" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 48 }}>
        {recents.map((r, i) => <RecentCard key={i} item={r} />)}
      </div>

      {/* ===== Three core actions ===== */}
      <SectionLabel title="What would you like to do?" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 48 }}>
        <ActionCard
          accent={S.brand} icon="sparkle"
          title="Tailor a resume"
          desc="Paste a JD — we'll match your resume to it."
          cta="Paste JD"
          href="CareerForgePro%20Tailor.html"
        />
        <ActionCard
          accent={S.coral} icon="mail"
          title="Write a cover letter"
          desc="Personalised in 60 seconds for any role."
          cta="Generate letter"
          onClick={() => setRoute('cover-letters')}
        />
        <ActionCard
          accent={S.green} icon="gauge"
          title="Check ATS score"
          desc="Test any resume against any JD."
          cta="Run a check"
          href="CareerForgePro%20Tailor.html"
        />
      </div>

      {/* ===== Two-column: Activity + Pipeline peek ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 28 }}>
        <div>
          <SectionLabel title="Recent activity" trailingHref={() => setRoute('resumes')} trailingLabel="See all" />
          <div style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: 14, overflow: 'hidden' }}>
            {activity.map((a, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px',
                borderTop: i === 0 ? 'none' : `1px solid ${S.borderSoft}`,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: `${a.col}14`, color: a.col,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon name={a.icon} size={14} color={a.col} />
                </div>
                <div style={{ flex: 1, fontSize: 13.5, color: S.body, lineHeight: 1.45 }}>{a.text}</div>
                <div style={{ fontSize: 12, color: S.muted, fontWeight: 500, whiteSpace: 'nowrap' }}>{a.when}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel title="Momentum" />
          <div style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: 14, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 22 }}>
            <PeekRow accent={S.brand} icon="briefcase" eyebrow="Pipeline" title="12 applications" sub="8 applied · 3 interviewing · 1 offer" />
            <div style={{ height: 1, background: S.borderSoft }} />
            <PeekRow accent={S.green} icon="gauge" eyebrow="ATS trend" title="89 avg score" sub="↑ 14 points from last month" />
            <div style={{ height: 1, background: S.borderSoft }} />
            <PeekRow accent={S.coral} icon="mail" eyebrow="Cover letters" title="3 drafts" sub="+1 created today" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Slim section label with optional trailing link
function SectionLabel({ title, trailingHref, trailingLabel }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
      <h2 style={{
        fontFamily: "'Bricolage Grotesque',sans-serif",
        fontWeight: 700, fontSize: 16, letterSpacing: '-0.2px',
        color: S.dark, margin: 0,
      }}>{title}</h2>
      {trailingHref && (
        <button onClick={trailingHref} style={{
          background: 'none', border: 'none', color: S.muted,
          fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4, padding: 0,
          transition: 'color 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = S.dark; }}
          onMouseLeave={e => { e.currentTarget.style.color = S.muted; }}>
          {trailingLabel} <Icon name="chevRight" size={12} color="currentColor" />
        </button>
      )}
    </div>
  );
}

// Recent item card — small but warm
function RecentCard({ item }) {
  const [hov, setHov] = React.useState(false);
  const config = {
    resume: { tag: 'Resume', accent: S.brand, accentBg: S.brandLight },
    cover:  { tag: 'Cover letter', accent: S.coral, accentBg: S.coralLight },
    ats:    { tag: 'ATS check', accent: S.green, accentBg: S.greenLight },
  }[item.kind];
  return (
    <a href={item.href} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: S.bg, border: `1px solid ${hov ? S.dark + '25' : S.border}`,
      borderRadius: 14, padding: '20px 20px 18px',
      cursor: 'pointer', textDecoration: 'none', display: 'flex', flexDirection: 'column',
      transition: 'transform 0.22s, border-color 0.22s, box-shadow 0.22s',
      transform: hov ? 'translateY(-2px)' : 'none',
      boxShadow: hov ? `0 16px 36px ${S.dark}10` : 'none',
      minHeight: 132,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: config.accentBg, color: config.accent,
          padding: '3px 9px', borderRadius: 6,
          fontSize: 10.5, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase',
        }}>{config.tag}</span>
        {item.score != null && (
          <span style={{
            marginLeft: 'auto',
            fontFamily: "'Bricolage Grotesque',sans-serif",
            fontWeight: 700, fontSize: 13, color: item.score >= 85 ? S.green : S.amber,
            background: item.score >= 85 ? S.greenLight : S.amberLight,
            padding: '2px 8px', borderRadius: 100, letterSpacing: '-0.2px',
          }}>ATS {item.score}</span>
        )}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: S.dark, marginBottom: 4, letterSpacing: '-0.2px', lineHeight: 1.3 }}>
        {item.title}
      </div>
      <div style={{ fontSize: 12.5, color: S.muted, marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>{item.co}</span>
        <span style={{ color: S.muted2 }}>·</span>
        <span>{item.when}</span>
      </div>
    </a>
  );
}

// Core-action card — all three flows get equal dignity
function ActionCard({ accent, icon, title, desc, cta, href, onClick }) {
  const [hov, setHov] = React.useState(false);
  const inner = (
    <>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: `${accent}14`, color: accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
        transition: 'background 0.2s, transform 0.2s',
        transform: hov ? 'scale(1.06)' : 'none',
      }}>
        <Icon name={icon} size={18} color={accent} />
      </div>
      <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: '-0.3px', color: S.dark, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, color: S.body, lineHeight: 1.5, marginBottom: 16 }}>{desc}</div>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        color: accent, fontSize: 13, fontWeight: 700,
        marginTop: 'auto',
      }}>
        {cta} <Icon name="arrow" size={13} color={accent} />
      </div>
    </>
  );
  const sharedStyle = {
    background: S.bg, border: `1.5px solid ${hov ? accent : S.border}`,
    borderRadius: 16, padding: '22px 22px 20px',
    cursor: 'pointer', textDecoration: 'none', textAlign: 'left',
    display: 'flex', flexDirection: 'column', minHeight: 184,
    transition: 'transform 0.22s, border-color 0.22s, box-shadow 0.22s',
    transform: hov ? 'translateY(-3px)' : 'none',
    boxShadow: hov ? `0 18px 40px ${accent}1A` : 'none',
    color: S.dark,
  };
  if (href) {
    return (
      <a href={href} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={sharedStyle}>
        {inner}
      </a>
    );
  }
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ ...sharedStyle, fontFamily: 'inherit' }}>
      {inner}
    </button>
  );
}

// Peek row (used inside Momentum card)
function PeekRow({ accent, icon, eyebrow, title, sub }) {
  return (
    <div style={{ display: 'flex', gap: 14 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 9,
        background: `${accent}14`, color: accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon name={icon} size={15} color={accent} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: S.muted, marginBottom: 3 }}>{eyebrow}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: S.dark, letterSpacing: '-0.2px', marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 12, color: S.muted, fontWeight: 500 }}>{sub}</div>
      </div>
    </div>
  );
}

// Legacy clean resume card kept for ResumesPage
function CleanResumeCard({ item }) {
  const [hov, setHov] = React.useState(false);
  return (
    <a href="CareerForgePro%20Editor.html" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: S.bg, border: `1px solid ${hov ? S.dark + '20' : S.border}`,
      borderRadius: 14, overflow: 'hidden',
      cursor: 'pointer', textDecoration: 'none', display: 'flex', flexDirection: 'column',
      transition: 'transform 0.22s, border-color 0.22s, box-shadow 0.22s',
      transform: hov ? 'translateY(-3px)' : 'none',
      boxShadow: hov ? `0 18px 40px ${S.dark}10` : 'none',
    }}>
      <div style={{ background: S.bgSoft, height: 170, padding: 18, position: 'relative', borderBottom: `1px solid ${S.borderSoft}` }}>
        <div style={{ height: 6, width: '55%', background: S.dark, opacity: 0.65, borderRadius: 2, marginBottom: 5 }} />
        <div style={{ height: 3, width: '35%', background: S.muted2, borderRadius: 2, marginBottom: 14 }} />
        <div style={{ height: 1, background: S.borderSoft, marginBottom: 10 }} />
        <div style={{ height: 4, width: '25%', background: S.brand, borderRadius: 2, marginBottom: 8 }} />
        {[78, 88, 70, 62, 82].map((w, i) => <div key={i} style={{ height: 3, width: `${w}%`, background: S.borderSoft, borderRadius: 2, marginBottom: 4 }} />)}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: '#fff', color: item.col, padding: '3px 9px',
          borderRadius: 100, fontSize: 11, fontWeight: 700,
          border: `1px solid ${item.col}30`,
        }}>{item.score}</div>
      </div>
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: S.dark, marginBottom: 3, letterSpacing: '-0.1px' }}>{item.role}</div>
        <div style={{ fontSize: 12.5, color: S.muted }}>{item.co} <span style={{ color: S.muted2 }}>·</span> {item.when}</div>
      </div>
    </a>
  );
}

// ── RESUMES LIST ──────────────────────────────────────────────────
function ResumesPage({ userState, onSignup }) {
  const items = userState === 'anonymous' ? [
    { role: 'Frontend Engineer', co: 'Flipkart', score: 91, when: 'Just now', col: S.green, draft: true },
  ] : [
    { role: 'Frontend Engineer', co: 'Flipkart', score: 94, when: '2h ago', col: S.green },
    { role: 'SDE-1', co: 'Razorpay', score: 91, when: 'Yesterday', col: S.green },
    { role: 'Product Designer', co: 'Swiggy', score: 78, when: '3d ago', col: S.amber },
    { role: 'Frontend Intern', co: 'Zomato', score: 88, when: '1w ago', col: S.green },
    { role: 'Full-stack Developer', co: 'PhonePe', score: 92, when: '2w ago', col: S.green },
  ];
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 28px' }}>
      <PageHeader title="Resumes" sub={`${items.length} resume${items.length !== 1 ? 's' : ''} · sorted by recent`} actionLabel="New resume" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {/* New card */}
        <a href="CareerForgePro%20Onboarding.html" style={{ background: S.bg, border: `2px dashed ${S.border}`, borderRadius: 14, padding: 24, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 220, gap: 10, transition: 'border-color 0.15s, background 0.15s', textDecoration: 'none' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = S.brand; e.currentTarget.style.background = S.brandSoft; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = S.border; e.currentTarget.style.background = S.bg; }}>
          <div style={{ width: 40, height: 40, background: S.brandLight, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" size={18} color={S.brand} />
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: S.dark }}>New resume</div>
          <div style={{ fontSize: 12, color: S.muted, textAlign: 'center' }}>Paste a JD to start</div>
        </a>

        {items.map((r, i) => <ResumeCard key={i} item={r} userState={userState} onSignup={onSignup} />)}
      </div>

      {userState === 'anonymous' && (
        <div style={{ marginTop: 24, padding: 18, background: `${S.coral}10`, border: `1px solid ${S.coral}30`, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="lock" size={16} color={S.coral} />
          <span style={{ fontSize: 13.5, color: S.dark, flex: 1 }}>You can create unlimited drafts. Sign up to save and download as PDF.</span>
          <button onClick={onSignup} style={{ background: S.coral, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Sign up free</button>
        </div>
      )}
    </div>
  );
}

function ResumeCard({ item, userState, onSignup }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: S.bg, border: `1px solid ${hov ? S.brand + '40' : S.border}`, borderRadius: 14,
      padding: 18, cursor: 'pointer', transition: 'all 0.15s',
      transform: hov ? 'translateY(-2px)' : 'none',
      boxShadow: hov ? `0 8px 24px ${S.brand}10` : 'none',
      position: 'relative',
    }}>
      {/* Mock preview */}
      <div style={{ background: S.bgSoft, borderRadius: 8, height: 110, padding: 12, marginBottom: 12, position: 'relative', border: `1px solid ${S.borderSoft}` }}>
        <div style={{ height: 5, width: '60%', background: S.dark, opacity: 0.5, borderRadius: 2, marginBottom: 4 }} />
        <div style={{ height: 3, width: '40%', background: S.muted2, borderRadius: 2, marginBottom: 8 }} />
        {[80, 65, 75, 55, 70].map((w, i) => <div key={i} style={{ height: 3, width: `${w}%`, background: S.borderSoft, borderRadius: 2, marginBottom: 3 }} />)}
        <div style={{ position: 'absolute', top: 8, right: 8, background: item.col, color: '#fff', borderRadius: 4, padding: '2px 6px', fontSize: 9, fontWeight: 700 }}>ATS {item.score}</div>
        {item.draft && <div style={{ position: 'absolute', bottom: 8, left: 8, background: S.amber, color: '#fff', borderRadius: 4, padding: '2px 6px', fontSize: 9, fontWeight: 700, letterSpacing: '0.5px' }}>DRAFT — UNSAVED</div>}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: S.dark, marginBottom: 3 }}>{item.role}</div>
      <div style={{ fontSize: 12.5, color: S.muted, marginBottom: 10 }}>{item.co} · {item.when}</div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={e => { e.stopPropagation(); if (userState === 'anonymous') return onSignup(); window.location.href = 'CareerForgePro Editor.html'; }} style={{ flex: 1, background: S.brandSoft, color: S.brand, border: 'none', borderRadius: 7, padding: '6px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Edit</button>
        <button onClick={e => { e.stopPropagation(); userState === 'anonymous' && onSignup(); }} style={{ background: S.bg, color: S.body, border: `1px solid ${S.border}`, borderRadius: 7, padding: 6, cursor: 'pointer', display: 'flex' }}>
          <Icon name="download" size={13} color={S.body} />
        </button>
      </div>
    </div>
  );
}

// ── COVER LETTERS ─────────────────────────────────────────────────
function CoverLettersPage({ userState }) {
  const items = userState === 'anonymous' ? [] : [
    { role: 'Frontend Engineer', co: 'Flipkart', when: '1h ago', preview: 'When I saw the SDE-1 role at Flipkart, I didn\'t just see a job posting — I saw two years of side-projects…' },
    { role: 'SDE-1', co: 'Razorpay', when: 'Yesterday', preview: 'Razorpay\'s mission to simplify Indian payments resonated with me from the first time I integrated…' },
    { role: 'Product Designer', co: 'Swiggy', when: '5d ago', preview: 'Designing for India\'s most loved food app means designing for everyone — and that\'s exactly what…' },
  ];
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 28px' }}>
      <PageHeader title="Cover Letters" sub={`${items.length} letters created`} actionLabel="New cover letter" />
      {items.length === 0 ? (
        <EmptyState icon="mail" title="No cover letters yet" sub="Generate one in 60 seconds — we'll match it to a JD and your existing resume." cta="Generate cover letter" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((it, i) => (
            <div key={i} style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: 12, padding: 18, display: 'flex', gap: 14, cursor: 'pointer', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = S.brand + '40'}
              onMouseLeave={e => e.currentTarget.style.borderColor = S.border}>
              <div style={{ width: 36, height: 36, background: S.coralLight, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="mail" size={16} color={S.coral} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: S.dark }}>{it.role}</span>
                  <span style={{ fontSize: 12, color: S.muted }}>·</span>
                  <span style={{ fontSize: 13, color: S.body }}>{it.co}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: S.muted }}>{it.when}</span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: S.body, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{it.preview}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ATS SCORE ─────────────────────────────────────────────────────
function ATSScorePage() {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 28px' }}>
      <PageHeader title="ATS Score Checker" sub="Test any resume against any job description" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: S.muted, marginBottom: 10 }}>Resume</div>
          <div style={{ background: S.bgSoft, border: `1px dashed ${S.border}`, borderRadius: 10, padding: 32, textAlign: 'center' }}>
            <Icon name="doc" size={20} color={S.muted} />
            <div style={{ fontSize: 13, color: S.body, fontWeight: 600, marginTop: 8 }}>Drop a PDF or pick from your resumes</div>
            <button style={{ marginTop: 12, background: S.brand, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Choose resume</button>
          </div>
        </div>
        <div style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: S.muted, marginBottom: 10 }}>Job Description</div>
          <textarea placeholder="Paste the JD here…" style={{ width: '100%', minHeight: 130, background: S.bgSoft, border: `1px solid ${S.border}`, borderRadius: 10, padding: 14, fontSize: 13.5, lineHeight: 1.6, color: S.dark, outline: 'none', resize: 'vertical' }} />
        </div>
      </div>
      <a href="CareerForgePro%20Tailor.html" style={{ marginTop: 16, background: S.coral, color: '#fff', border: 'none', borderRadius: 10, padding: '13px 28px', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: `0 6px 20px ${S.coral}35`, textDecoration: 'none' }}>
        <Icon name="gauge" size={15} color="#fff" />
        Calculate ATS Score
      </a>
    </div>
  );
}

// ── TEMPLATES ─────────────────────────────────────────────────────
function TemplatesPage() {
  const templates = [
    { name: 'Minimal', tag: 'Most popular', col: S.brand },
    { name: 'Modern', tag: 'New', col: S.coral },
    { name: 'Classic', tag: null, col: S.dark },
    { name: 'Two-column', tag: null, col: S.green },
    { name: 'Compact', tag: 'For freshers', col: S.amber },
    { name: 'Executive', tag: 'Pro', col: S.brand },
  ];
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 28px' }}>
      <PageHeader title="Templates" sub="ATS-friendly designs for every role" />
      <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
        {['All','Tech','Design','Marketing','Operations','Finance'].map((c, i) => (
          <button key={c} style={{ background: i === 0 ? S.dark : S.bg, color: i === 0 ? '#fff' : S.body, border: `1px solid ${i === 0 ? S.dark : S.border}`, borderRadius: 100, padding: '6px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>{c}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {templates.map((t, i) => (
          <div key={i} style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${t.col}15`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ background: S.bgSoft, height: 240, padding: 14, position: 'relative', borderBottom: `1px solid ${S.border}` }}>
              <div style={{ height: 8, width: '50%', background: t.col, borderRadius: 2, marginBottom: 5 }} />
              <div style={{ height: 4, width: '35%', background: S.muted2, borderRadius: 2, marginBottom: 12 }} />
              {[80, 60, 90, 70, 55, 78, 65, 50, 72].map((w, j) => <div key={j} style={{ height: 3, width: `${w}%`, background: S.borderSoft, borderRadius: 2, marginBottom: 4 }} />)}
              {t.tag && <div style={{ position: 'absolute', top: 10, right: 10, background: t.col, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100, letterSpacing: '0.4px' }}>{t.tag}</div>}
            </div>
            <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: S.dark }}>{t.name}</span>
              <button style={{ background: S.brand, color: '#fff', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>Use</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PAGE HEADER (shared) ──────────────────────────────────────────
function PageHeader({ title, sub, actionLabel }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
      <div>
        <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: '-0.8px', color: S.dark, margin: '0 0 4px' }}>{title}</h1>
        {sub && <p style={{ fontSize: 13.5, color: S.muted, margin: 0 }}>{sub}</p>}
      </div>
      {actionLabel && (
        <button style={{ background: S.brand, color: '#fff', border: 'none', borderRadius: 9, padding: '10px 16px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: `0 4px 12px ${S.brand}25` }}>
          <Icon name="plus" size={14} color="#fff" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function EmptyState({ icon, title, sub, cta }) {
  return (
    <div style={{ background: S.bg, border: `1px dashed ${S.border}`, borderRadius: 14, padding: '60px 24px', textAlign: 'center' }}>
      <div style={{ width: 48, height: 48, background: S.brandLight, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        <Icon name={icon} size={20} color={S.brand} />
      </div>
      <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 19, color: S.dark, margin: '0 0 6px' }}>{title}</h3>
      <p style={{ fontSize: 14, color: S.muted, margin: '0 0 20px', maxWidth: 380, marginLeft: 'auto', marginRight: 'auto' }}>{sub}</p>
      <button style={{ background: S.coral, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 22px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', boxShadow: `0 6px 16px ${S.coral}35` }}>{cta}</button>
    </div>
  );
}

// ── CMD K ─────────────────────────────────────────────────────────
function CmdK({ onClose, setRoute }) {
  const items = [
    { id: 'dashboard', label: 'Go to Home', icon: 'home', route: 'dashboard' },
    { id: 'resumes', label: 'View resumes', icon: 'doc', route: 'resumes' },
    { id: 'new-resume', label: 'New resume', icon: 'plus' },
    { id: 'cover', label: 'Cover Letters', icon: 'mail', route: 'cover-letters' },
    { id: 'ats', label: 'Check ATS Score', icon: 'gauge', route: 'ats-score' },
    { id: 'templates', label: 'Browse Templates', icon: 'grid', route: 'templates' },
  ];
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,14,42,0.45)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 120, zIndex: 100 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 560, background: S.bg, borderRadius: 14, boxShadow: '0 32px 80px rgba(15,14,42,0.3)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: `1px solid ${S.border}` }}>
          <Icon name="search" size={16} color={S.muted} />
          <input autoFocus placeholder="Search anything…" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 15, color: S.dark }} />
          <kbd style={{ fontSize: 11, fontWeight: 600, background: S.bgSoft, border: `1px solid ${S.border}`, borderRadius: 4, padding: '2px 6px', color: S.muted, fontFamily: 'inherit' }}>Esc</kbd>
        </div>
        <div style={{ padding: 8, maxHeight: 320, overflowY: 'auto' }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: S.muted, padding: '8px 12px 4px' }}>Quick actions</div>
          {items.map(it => (
            <button key={it.id} onClick={() => { it.route && setRoute(it.route); onClose(); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', borderRadius: 7, padding: '9px 12px', fontSize: 13.5, color: S.dark, cursor: 'pointer', textAlign: 'left' }}
              onMouseEnter={e => e.currentTarget.style.background = S.bgSoft}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Icon name={it.icon} size={15} color={S.body} />
              <span>{it.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SIGNUP MODAL ──────────────────────────────────────────────────
function SignupModal({ onClose }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,14,42,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 440, background: S.bg, borderRadius: 18, padding: 32, boxShadow: '0 32px 80px rgba(15,14,42,0.3)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: S.muted, fontSize: 18, cursor: 'pointer', width: 28, height: 28, borderRadius: 6 }}>×</button>
        <div style={{ width: 44, height: 44, background: S.brand, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Icon name="sparkle" size={20} color="#fff" />
        </div>
        <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: '-0.8px', color: S.dark, margin: '0 0 6px' }}>Save your work</h2>
        <p style={{ fontSize: 14, color: S.body, lineHeight: 1.6, margin: '0 0 20px' }}>Sign up free in 30 seconds. No credit card. Keep your resume + unlock cover letters and ATS scoring.</p>
        <button style={{ width: '100%', background: S.bg, color: S.dark, border: `1px solid ${S.border}`, borderRadius: 10, padding: '11px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
        <input type="email" placeholder="your@email.com" style={{ width: '100%', background: S.bgSoft, border: `1px solid ${S.border}`, borderRadius: 10, padding: '12px 14px', fontSize: 14, color: S.dark, outline: 'none', marginBottom: 10 }} />
        <button style={{ width: '100%', background: S.coral, color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: `0 6px 20px ${S.coral}40` }}>Create free account</button>
        <div style={{ fontSize: 12, color: S.muted, textAlign: 'center', marginTop: 14 }}>By signing up, you agree to our Terms & Privacy.</div>
      </div>
    </div>
  );
}

Object.assign(window, {
  S, NAV_ITEMS, Icon,
  AppShell, Sidebar, NavLink, TopBar, AnonBanner,
  RouteContent, Dashboard, AnonDashboard, UserDashboard,
  ResumesPage, ResumeCard, CoverLettersPage, ATSScorePage, TemplatesPage,
  PageHeader, EmptyState, CmdK, SignupModal,
});
