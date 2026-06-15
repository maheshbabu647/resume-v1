
// CareerForgePro — Resume Editor
// Same theme: brand #5046E4, coral #FF5C35, Bricolage + Jakarta

const E = {
  brand: '#5046E4', brandDark: '#3730D0', brandLight: '#EEEDFF', brandSoft: '#F4F2FF',
  coral: '#FF5C35', coralLight: '#FFF1ED',
  dark: '#0F0E2A', body: '#44445A', muted: '#8888A5', muted2: '#B5B5C8',
  border: '#E8E6F4', borderSoft: '#F0EEF9',
  bg: '#FFFFFF', bgSoft: '#F7F6FF', canvas: '#F5F4FB',
  green: '#16A34A', greenLight: '#DCFCE7',
  amber: '#F59E0B', amberLight: '#FEF3C7',
  red: '#DC2626', redLight: '#FEE2E2',
  purple: '#7C3AED',
};

function EI({ name, size = 18, color = 'currentColor', sw = 1.7 }) {
  const p = {
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    check: <><polyline points="5 12 10 17 20 7"/></>,
    x: <><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></>,
    chevD: <><polyline points="6 9 12 15 18 9"/></>,
    chevR: <><polyline points="9 6 15 12 9 18"/></>,
    chevL: <><polyline points="15 6 9 12 15 18"/></>,
    arrow: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    arrowL: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    sparkle: <><path d="M12 3l1.5 5L19 9.5 13.5 11 12 16l-1.5-5L5 9.5 10.5 8z"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></>,
    work: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></>,
    edu: <><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5a8 8 0 0012 0v-5"/></>,
    skill: <><path d="M14 7l6 6-6 6"/><path d="M10 17l-6-6 6-6"/></>,
    award: <><circle cx="12" cy="9" r="6"/><path d="M8.21 13.89L7 21l5-3 5 3-1.21-7.12"/></>,
    proj: <><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></>,
    grip: <><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></>,
    download: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    save: <><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>,
    undo: <><polyline points="3 7 3 13 9 13"/><path d="M3.51 15a9 9 0 002.13 3.36L7 17.5"/><path d="M21 12a9 9 0 00-15-6.7L3 8"/></>,
    redo: <><polyline points="21 7 21 13 15 13"/><path d="M20.49 15a9 9 0 01-2.12 3.36L17 17.5"/><path d="M3 12a9 9 0 0115-6.7L21 8"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    bot: <><rect x="3" y="9" width="18" height="11" rx="2"/><path d="M12 9V5"/><circle cx="12" cy="3" r="1.5"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></>,
    palette: <><path d="M12 2a10 10 0 100 20 5 5 0 005-5v-2h-3a5 5 0 01-5-5V7a5 5 0 015-5"/><circle cx="6.5" cy="11.5" r="1"/><circle cx="9.5" cy="7.5" r="1"/><circle cx="14.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 008 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H2a2 2 0 010-4h.09A1.65 1.65 0 004.6 8a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V2a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H22a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    pen: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></>,
    copy: <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>,
    history: <><path d="M3 12a9 9 0 109-9 9 9 0 00-7.5 4"/><polyline points="3 4 3 9 8 9"/><polyline points="12 7 12 12 16 14"/></>,
    bullet: <><circle cx="6" cy="12" r="2"/><line x1="11" y1="12" x2="21" y2="12"/></>,
    info: <><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5"/></>,
    warn: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="0.5"/></>,
    zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    grid3: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    type: <><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></>,
    layout: <><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></>,
    target2: <><circle cx="12" cy="12" r="9"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/></>,
    minus: <><line x1="5" y1="12" x2="19" y2="12"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>{p[name]}</svg>;
}

// ── DEMO RESUME DATA ──────────────────────────────────────────────
const RESUME = {
  name: 'Arjun Kumar',
  title: 'Senior Software Engineer',
  email: 'arjun.kumar@email.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, India',
  links: ['linkedin.com/in/arjunk', 'github.com/arjunk'],
  summary: 'Senior software engineer with 5+ years building scalable web platforms for fintech and consumer products. Led migration of payments stack from monolith to microservices, reducing P99 latency by 64%. Strong opinions on developer experience and shipping fast.',
  experience: [
    {
      role: 'Senior Software Engineer',
      company: 'Razorpay',
      location: 'Bengaluru',
      period: 'Aug 2023 — Present',
      bullets: [
        'Led the migration of the payments orchestration service from a Rails monolith to Go microservices, reducing P99 latency from 480ms to 173ms across 14M daily transactions.',
        'Designed and shipped a new merchant onboarding flow that cut time-to-first-transaction from 3 days to 47 minutes; lifted activation 22%.',
        'Mentored 4 junior engineers through the L2→L3 promotion cycle; introduced fortnightly architecture review rituals adopted across the platform org.',
      ],
    },
    {
      role: 'Software Engineer',
      company: 'Swiggy',
      location: 'Bengaluru',
      period: 'Jul 2021 — Jul 2023',
      bullets: [
        'Owned the discovery search backend serving 2M+ queries/day; cut tail latency 38% by introducing a tiered Redis cache with stale-while-revalidate.',
        'Shipped Swiggy Stories, a vertical-video product surface, from prototype to GA in 11 weeks; reached 4.1M weekly active viewers within 90 days.',
      ],
    },
  ],
  education: [
    { school: 'BITS Pilani', degree: 'B.E. Computer Science', period: '2017 — 2021', gpa: 'GPA 8.7' },
  ],
  skills: ['Go', 'TypeScript', 'React', 'PostgreSQL', 'Redis', 'gRPC', 'Kafka', 'AWS', 'Kubernetes', 'System Design'],
  projects: [
    { name: 'kvtree — embeddable kv store', period: '2024', desc: 'Open-source persistent KV store in Go with LSM-tree storage; 1.2k GitHub stars, used in production at 3 startups.' },
  ],
};

// ── EDITOR SHELL ──────────────────────────────────────────────────
function EditorShell({ tweaks, setTweak }) {
  const [activeSection, setActiveSection] = React.useState('experience');
  const [aiOpen, setAiOpen] = React.useState(tweaks.showAiPanel);
  const [tailorOpen, setTailorOpen] = React.useState(tweaks.showTailorDialog);
  React.useEffect(() => setAiOpen(tweaks.showAiPanel), [tweaks.showAiPanel]);
  React.useEffect(() => setTailorOpen(tweaks.showTailorDialog), [tweaks.showTailorDialog]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: E.canvas }}>
      <TopBar setTailorOpen={setTailorOpen} />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <SectionsRail active={activeSection} setActive={setActiveSection} setAiOpen={setAiOpen} />
        <PreviewCanvas template={tweaks.template} />
        <RightPanel panel={tweaks.rightPanel} setPanel={v => setTweak('rightPanel', v)} template={tweaks.template} setTemplate={v => setTweak('template', v)} activeSection={activeSection} />
      </div>
      {aiOpen && <AIAssistPopover onClose={() => { setAiOpen(false); setTweak('showAiPanel', false); }} />}
      {tailorOpen && <TailorDialog onClose={() => { setTailorOpen(false); setTweak('showTailorDialog', false); }} />}
    </div>
  );
}

// ── TOP BAR ───────────────────────────────────────────────────────
function TopBar({ setTailorOpen }) {
  return (
    <header style={{ height: 60, background: E.bg, borderBottom: `1px solid ${E.border}`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16, flexShrink: 0 }}>
      <a href="CareerForgePro%20App.html" title="Back to dashboard" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', padding: '6px 10px 6px 6px', borderRadius: 9, transition: 'background 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.background = E.bgSoft}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
        <EI name="arrowL" size={15} color={E.muted} />
        <div style={{ width: 28, height: 28, background: E.brand, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 11L5 6L7.5 8.5L10 4L12.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </a>
      <div style={{ width: 1, height: 24, background: E.border }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: E.dark, letterSpacing: '-0.2px' }}>Senior Engineer · Razorpay</div>
        <button title="Rename" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 5, color: E.muted, display: 'flex', borderRadius: 6 }}
          onMouseEnter={e => { e.currentTarget.style.background = E.bgSoft; e.currentTarget.style.color = E.brand; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = E.muted; }}>
          <EI name="pen" size={13} />
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 11px', background: E.greenLight, borderRadius: 100, fontSize: 11.5, fontWeight: 600, color: E.green }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: E.green, animation: 'pulse-dot 2s ease-in-out infinite' }} />
        Saved
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
        {/* History cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: E.bgSoft, borderRadius: 9, padding: 3 }}>
          <IconButton icon="undo" tip="Undo (⌘Z)" />
          <IconButton icon="redo" tip="Redo (⇧⌘Z)" />
          <IconButton icon="history" tip="Version history" />
        </div>
        <div style={{ width: 1, height: 24, background: E.border, margin: '0 8px' }} />
        {/* Secondary actions */}
        <a href="CareerForgePro%20Tailor.html" style={{
          display: 'flex', alignItems: 'center', gap: 7, background: E.brandLight, color: E.brand,
          border: 'none', borderRadius: 9, padding: '8px 14px',
          fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', textDecoration: 'none',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = E.brand; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = E.brandLight; e.currentTarget.style.color = E.brand; }}>
          <EI name="target" size={14} color="currentColor" /> Tailor to JD
        </a>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', color: E.body, border: 'none', borderRadius: 9, padding: '8px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = E.bgSoft}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <EI name="eye" size={14} /> Preview
        </button>
        {/* Primary */}
        <button style={{ display: 'flex', alignItems: 'center', gap: 7, background: E.coral, color: '#fff', border: 'none', borderRadius: 9, padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 14px ${E.coral}40`, transition: 'transform 0.15s, box-shadow 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${E.coral}55`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 14px ${E.coral}40`; }}>
          <EI name="download" size={14} color="#fff" sw={2} /> Download
        </button>
        <div style={{ width: 1, height: 24, background: E.border, margin: '0 8px' }} />
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg,${E.brand},${E.coral})`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>A</div>
      </div>
    </header>
  );
}

function IconButton({ icon, tip, onClick, active }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button onClick={onClick} title={tip} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 32, height: 32, background: active ? E.brandLight : (hov ? E.bgSoft : 'transparent'),
        border: 'none', borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: active ? E.brand : E.body, transition: 'all 0.12s',
      }}>
      <EI name={icon} size={15} color="currentColor" />
    </button>
  );
}

// ── LEFT RAIL — SECTIONS ──────────────────────────────────────────
function SectionsRail({ active, setActive, setAiOpen }) {
  const sections = [
    { id: 'header', label: 'Header', icon: 'user', complete: true },
    { id: 'summary', label: 'Summary', icon: 'pen', complete: true },
    { id: 'experience', label: 'Experience', icon: 'work', complete: true, count: 2 },
    { id: 'education', label: 'Education', icon: 'edu', complete: true, count: 1 },
    { id: 'skills', label: 'Skills', icon: 'skill', complete: true, count: 10 },
    { id: 'projects', label: 'Projects', icon: 'proj', complete: false, count: 1, warn: true },
    { id: 'awards', label: 'Awards', icon: 'award', complete: false, optional: true },
  ];

  return (
    <aside style={{ width: 248, background: E.bg, borderRight: `1px solid ${E.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '14px 18px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: E.muted }}>Sections</div>
        <button title="Add section" style={{ width: 22, height: 22, background: E.bgSoft, border: 'none', borderRadius: 5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: E.brand }}>
          <EI name="plus" size={13} color="currentColor" sw={2} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
        {sections.map(s => {
          const isActive = s.id === active;
          return (
            <button key={s.id} onClick={() => setActive(s.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                background: isActive ? E.brandLight : 'transparent', border: 'none',
                borderRadius: 8, padding: '9px 10px', cursor: 'pointer',
                color: isActive ? E.brand : E.body, fontWeight: isActive ? 600 : 500,
                transition: 'background 0.12s', marginBottom: 1,
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = E.bgSoft; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
              <EI name="grip" size={14} color={E.muted2} sw={2} />
              <EI name={s.icon} size={15} color={isActive ? E.brand : E.muted} />
              <span style={{ fontSize: 13.5, flex: 1, textAlign: 'left' }}>{s.label}</span>
              {s.count != null && <span style={{ fontSize: 11, color: E.muted, fontWeight: 600 }}>{s.count}</span>}
              {s.warn && <div title="Needs attention" style={{ width: 6, height: 6, borderRadius: '50%', background: E.amber }} />}
              {s.complete && !s.warn && <EI name="check" size={12} color={E.green} sw={2.5} />}
              {s.optional && <span style={{ fontSize: 10, color: E.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Opt</span>}
            </button>
          );
        })}

        <div style={{ marginTop: 16, padding: '12px 12px 8px', background: E.bgSoft, borderRadius: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.4px', textTransform: 'uppercase', color: E.muted, marginBottom: 8, paddingLeft: 4 }}>Suggested sections</div>
          {[
            { label: 'Certifications', icon: 'award' },
            { label: 'Publications', icon: 'pen' },
            { label: 'Languages', icon: 'type' },
          ].map(s => (
            <button key={s.label} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, background: 'transparent', border: 'none', padding: '8px 6px', cursor: 'pointer', color: E.body, fontSize: 12.5, fontWeight: 500, borderRadius: 7, textAlign: 'left', transition: 'background 0.12s' }}
              onMouseEnter={e => e.currentTarget.style.background = E.bg}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <EI name={s.icon} size={14} color={E.muted} />
              <span style={{ flex: 1 }}>{s.label}</span>
              <EI name="plus" size={12} color={E.muted2} sw={2.5} />
            </button>
          ))}
        </div>
      </div>

      {/* AI Assist trigger */}
      <div style={{ padding: 12, borderTop: `1px solid ${E.borderSoft}` }}>
        <button onClick={() => setAiOpen(true)} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          background: `linear-gradient(135deg, ${E.brand}, ${E.purple})`,
          color: '#fff', border: 'none', borderRadius: 10, padding: '11px 14px',
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          boxShadow: `0 6px 18px ${E.brand}30`,
        }}>
          <EI name="sparkle" size={14} color="#fff" />
          AI Assist
          <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, padding: '2px 6px', background: 'rgba(255,255,255,0.25)', borderRadius: 4 }}>⌘ /</span>
        </button>
      </div>
    </aside>
  );
}

// ── PREVIEW CANVAS (CENTER) ───────────────────────────────────────
function PreviewCanvas({ template }) {
  const [zoom, setZoom] = React.useState(100);
  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
      {/* Canvas controls */}
      <div style={{ height: 48, background: E.canvas, borderBottom: `1px solid ${E.border}`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0 }}>
        <div style={{ fontSize: 12, color: E.muted, fontWeight: 500 }}>A4 · 210 × 297mm · 1 page</div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, background: E.bg, border: `1px solid ${E.border}`, borderRadius: 9, padding: 3 }}>
          <button onClick={() => setZoom(z => Math.max(50, z - 10))} style={{ width: 28, height: 28, background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 6, color: E.body, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><EI name="minus" size={14} sw={2} /></button>
          <span style={{ fontSize: 12, fontWeight: 600, color: E.dark, minWidth: 40, textAlign: 'center' }}>{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(150, z + 10))} style={{ width: 28, height: 28, background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 6, color: E.body, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><EI name="plus" size={14} sw={2} /></button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: E.green, fontWeight: 600, padding: '6px 11px', background: E.greenLight, borderRadius: 100 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: E.green }} />
          Page fits
        </div>
      </div>

      {/* Scroll area */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '32px 24px 80px', background: E.canvas }}>
        <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.15s' }}>
          <ResumePage template={template} />
        </div>
      </div>
    </main>
  );
}

// ── RESUME PAGE (LIVE PREVIEW) ────────────────────────────────────
function ResumePage({ template }) {
  // A4 at 96dpi ≈ 794×1123 px
  return (
    <div style={{
      width: 794, minHeight: 1123, background: '#fff',
      boxShadow: '0 1px 3px rgba(15,14,42,0.04), 0 12px 32px rgba(15,14,42,0.08), 0 40px 80px rgba(15,14,42,0.10)',
      borderRadius: 6, position: 'relative',
    }}>
      {/* Page break marker */}
      <div style={{ position: 'absolute', left: -38, top: 1100, fontSize: 9, color: E.muted, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>1</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1100, borderTop: `1px dashed ${E.border}`, opacity: 0.7 }} />

      {template === 'modern' && <TemplateModern />}
      {template === 'classic' && <TemplateClassic />}
      {template === 'minimal' && <TemplateMinimal />}
    </div>
  );
}

function TemplateModern() {
  const r = RESUME;
  return (
    <div style={{ padding: '44px 56px', fontFamily: "'Inter',sans-serif", color: '#1a1a2e', fontSize: 10.5, lineHeight: 1.5 }}>
      {/* Header */}
      <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: `2px solid ${E.brand}` }}>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', color: '#0a0a1a', marginBottom: 4 }}>{r.name}</div>
        <div style={{ fontSize: 13, color: E.brand, fontWeight: 600, marginBottom: 10 }}>{r.title}</div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 10, color: '#52526b' }}>
          <span>{r.email}</span><span>·</span><span>{r.phone}</span><span>·</span><span>{r.location}</span><span>·</span>
          {r.links.map((l,i) => <React.Fragment key={l}><span style={{ color: E.brand }}>{l}</span>{i < r.links.length-1 && <span>·</span>}</React.Fragment>)}
        </div>
      </div>

      <Section title="Summary"><p style={{ margin: 0 }}>{r.summary}</p></Section>

      <Section title="Experience">
        {r.experience.map((x, i) => (
          <div key={i} style={{ marginBottom: i < r.experience.length-1 ? 14 : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
              <div style={{ fontWeight: 700, fontSize: 11.5, color: '#0a0a1a' }}>{x.role}</div>
              <div style={{ fontSize: 9.5, color: '#7a7a95', fontWeight: 500 }}>{x.period}</div>
            </div>
            <div style={{ fontSize: 10.5, color: E.brand, fontWeight: 600, marginBottom: 6 }}>{x.company} · <span style={{ color: '#52526b', fontWeight: 500 }}>{x.location}</span></div>
            <ul style={{ margin: 0, paddingLeft: 16, color: '#2a2a3e' }}>
              {x.bullets.map((b, j) => <li key={j} style={{ marginBottom: 3 }}>{b}</li>)}
            </ul>
          </div>
        ))}
      </Section>

      <Section title="Education">
        {r.education.map((e,i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 11 }}>{e.school}</div>
              <div style={{ fontSize: 10, color: '#52526b' }}>{e.degree} · {e.gpa}</div>
            </div>
            <div style={{ fontSize: 9.5, color: '#7a7a95' }}>{e.period}</div>
          </div>
        ))}
      </Section>

      <Section title="Skills">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px' }}>
          {r.skills.map(s => <span key={s} style={{ fontSize: 10, padding: '2px 8px', background: E.brandLight, color: E.brand, borderRadius: 3, fontWeight: 600 }}>{s}</span>)}
        </div>
      </Section>

      <Section title="Projects">
        {r.projects.map((p,i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
              <div style={{ fontWeight: 700, fontSize: 11 }}>{p.name}</div>
              <div style={{ fontSize: 9.5, color: '#7a7a95' }}>{p.period}</div>
            </div>
            <div style={{ fontSize: 10.5, color: '#2a2a3e' }}>{p.desc}</div>
          </div>
        ))}
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: E.brand, marginBottom: 7 }}>{title}</div>
      {children}
    </div>
  );
}

function TemplateClassic() {
  const r = RESUME;
  return (
    <div style={{ padding: '50px 60px', fontFamily: "'Source Serif 4',serif", color: '#1a1a2e', fontSize: 10.5, lineHeight: 1.55 }}>
      <div style={{ textAlign: 'center', marginBottom: 22, paddingBottom: 14, borderBottom: '1px solid #1a1a2e' }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 3 }}>{r.name}</div>
        <div style={{ fontSize: 11, color: '#52526b', marginBottom: 8, fontStyle: 'italic' }}>{r.title}</div>
        <div style={{ fontSize: 9.5, color: '#52526b' }}>{r.email} · {r.phone} · {r.location} · {r.links.join(' · ')}</div>
      </div>
      <ClassicSection title="Summary"><p style={{ margin: 0 }}>{r.summary}</p></ClassicSection>
      <ClassicSection title="Professional Experience">
        {r.experience.map((x,i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontWeight: 700, fontSize: 11.5 }}>{x.company}, {x.location}</div>
              <div style={{ fontSize: 10, fontStyle: 'italic' }}>{x.period}</div>
            </div>
            <div style={{ fontStyle: 'italic', fontSize: 10.5, marginBottom: 5, color: '#2a2a3e' }}>{x.role}</div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>{x.bullets.map((b,j) => <li key={j} style={{ marginBottom: 2 }}>{b}</li>)}</ul>
          </div>
        ))}
      </ClassicSection>
      <ClassicSection title="Education">
        {r.education.map((e,i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div><strong>{e.school}</strong> — <em>{e.degree}, {e.gpa}</em></div>
            <div style={{ fontStyle: 'italic', fontSize: 10 }}>{e.period}</div>
          </div>
        ))}
      </ClassicSection>
      <ClassicSection title="Skills"><p style={{ margin: 0 }}>{r.skills.join(' · ')}</p></ClassicSection>
    </div>
  );
}
function ClassicSection({ title, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '1px solid #aaa', paddingBottom: 2, marginBottom: 7 }}>{title}</div>
      {children}
    </div>
  );
}

function TemplateMinimal() {
  const r = RESUME;
  return (
    <div style={{ padding: '52px 64px', fontFamily: "'Inter',sans-serif", color: '#1a1a2e', fontSize: 10.5, lineHeight: 1.6, fontWeight: 300 }}>
      <div style={{ marginBottom: 26 }}>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', marginBottom: 2 }}>{r.name}</div>
        <div style={{ fontSize: 11, color: '#52526b', marginBottom: 8 }}>{r.title}</div>
        <div style={{ fontSize: 9.5, color: '#7a7a95' }}>{r.email} &nbsp; {r.phone} &nbsp; {r.location}</div>
      </div>
      <MinSection title="About"><p style={{ margin: 0 }}>{r.summary}</p></MinSection>
      <MinSection title="Experience">
        {r.experience.map((x,i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 9.5, color: '#7a7a95', fontWeight: 500 }}>{x.period}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 11 }}>{x.role}</div>
              <div style={{ fontSize: 10, color: '#52526b', marginBottom: 5 }}>{x.company} · {x.location}</div>
              <ul style={{ margin: 0, paddingLeft: 14, fontWeight: 400 }}>{x.bullets.map((b,j) => <li key={j} style={{ marginBottom: 3 }}>{b}</li>)}</ul>
            </div>
          </div>
        ))}
      </MinSection>
      <MinSection title="Education">
        {r.education.map((e,i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16 }}>
            <div style={{ fontSize: 9.5, color: '#7a7a95' }}>{e.period}</div>
            <div><strong style={{ fontWeight: 600 }}>{e.school}</strong> — {e.degree}, {e.gpa}</div>
          </div>
        ))}
      </MinSection>
      <MinSection title="Skills">
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16 }}>
          <div />
          <div style={{ fontWeight: 400 }}>{r.skills.join(' · ')}</div>
        </div>
      </MinSection>
    </div>
  );
}
function MinSection({ title, children }) {
  return (
    <div style={{ marginBottom: 18, display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16 }}>
      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7a7a95' }}>{title}</div>
      <div>{children}</div>
    </div>
  );
}

// ── RIGHT PANEL ──────────────────────────────────────────────────
function RightPanel({ panel, setPanel, template, setTemplate, activeSection }) {
  const tabs = [
    { id: 'edit', label: 'Edit', icon: 'pen' },
    { id: 'style', label: 'Style', icon: 'palette' },
    { id: 'score', label: 'Score', icon: 'target' },
  ];
  return (
    <aside style={{ width: 360, background: E.bg, borderLeft: `1px solid ${E.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ display: 'flex', borderBottom: `1px solid ${E.border}`, padding: '12px 14px 0', gap: 4 }}>
        {tabs.map(t => {
          const active = panel === t.id;
          return (
            <button key={t.id} onClick={() => setPanel(t.id)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '11px 8px', borderBottom: `2px solid ${active ? E.brand : 'transparent'}`,
              color: active ? E.dark : E.muted, fontSize: 13, fontWeight: active ? 700 : 500,
              transition: 'all 0.12s', marginBottom: -1,
            }}>
              <EI name={t.icon} size={14} color="currentColor" />
              {t.label}
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {panel === 'edit' && <EditPanel section={activeSection} />}
        {panel === 'style' && <StylePanel template={template} setTemplate={setTemplate} />}
        {panel === 'score' && <ScorePanel />}
      </div>
    </aside>
  );
}

// ── EDIT PANEL ───────────────────────────────────────────────────
function EditPanel({ section }) {
  if (section === 'experience') return <ExperienceEditor />;
  return <PlaceholderEditor section={section} />;
}

function ExperienceEditor() {
  const [expandedIdx, setExpandedIdx] = React.useState(0);
  return (
    <div style={{ padding: '20px 20px 36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 17, fontWeight: 700, color: E.dark, letterSpacing: '-0.4px' }}>Experience</div>
          <div style={{ fontSize: 12.5, color: E.muted, marginTop: 3 }}>Most recent first. Quantify outcomes.</div>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: E.brandLight, color: E.brand, border: 'none', borderRadius: 8, padding: '7px 12px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
          <EI name="plus" size={12} sw={2.5} /> Add
        </button>
      </div>

      {RESUME.experience.map((x, i) => {
        const open = i === expandedIdx;
        return (
          <div key={i} style={{ background: open ? E.bg : E.bgSoft, border: `1px solid ${open ? E.brand + '40' : E.border}`, borderRadius: 11, marginBottom: 10, overflow: 'hidden', boxShadow: open ? `0 4px 14px ${E.brand}10` : 'none' }}>
            <div onClick={() => setExpandedIdx(open ? -1 : i)} style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <EI name="grip" size={14} color={E.muted2} sw={2} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: E.dark, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.role}</div>
                <div style={{ fontSize: 11.5, color: E.muted, marginTop: 1 }}>{x.company} · {x.period}</div>
              </div>
              <EI name={open ? 'chevD' : 'chevR'} size={14} color={E.muted} sw={2} />
            </div>

            {open && (
              <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${E.borderSoft}`, paddingTop: 14 }}>
                <FieldRow label="Role"><FieldInput value={x.role} /></FieldRow>
                <FieldRow label="Company"><FieldInput value={x.company} /></FieldRow>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <FieldRow label="Location"><FieldInput value={x.location} small /></FieldRow>
                  <FieldRow label="Period"><FieldInput value={x.period} small /></FieldRow>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, marginBottom: 6 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: E.dark, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Bullets</div>
                  <button title="Add bullet" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: E.brand, fontSize: 11.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <EI name="plus" size={11} sw={2.5} /> Add
                  </button>
                </div>
                {x.bullets.map((b, j) => <BulletEditor key={j} text={b} />)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function BulletEditor({ text }) {
  const [hov, setHov] = React.useState(false);
  // Simple metric checks
  const hasNumber = /\d/.test(text);
  const longLine = text.length > 220;
  const verbs = ['led','designed','shipped','owned','built','cut','reduced','grew','launched','drove','mentored','introduced'];
  const startsVerb = verbs.some(v => text.toLowerCase().startsWith(v));

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: E.bgSoft, border: `1px solid ${E.borderSoft}`, borderRadius: 8, padding: '10px 12px', marginBottom: 6, position: 'relative' }}>
      <textarea defaultValue={text} rows={3}
        style={{ width: '100%', background: 'transparent', border: 'none', resize: 'none', fontSize: 12.5, lineHeight: 1.5, color: E.dark, fontFamily: 'inherit' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, paddingTop: 8, borderTop: `1px dashed ${E.border}` }}>
        <BulletChip ok={startsVerb} label="Action verb" />
        <BulletChip ok={hasNumber} label="Quantified" />
        <BulletChip ok={!longLine} label="Concise" />
        <button title="AI rewrite this bullet" style={{ marginLeft: 'auto', background: hov ? E.brand : E.bg, color: hov ? '#fff' : E.brand, border: `1px solid ${E.brand}40`, borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.12s' }}>
          <EI name="sparkle" size={10} color="currentColor" /> Rewrite
        </button>
      </div>
    </div>
  );
}

function BulletChip({ ok, label }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 600, color: ok ? E.green : E.amber }}>
      {ok ? <EI name="check" size={10} sw={2.5} /> : <EI name="warn" size={10} sw={2} />}
      {label}
    </div>
  );
}

function FieldRow({ label, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: E.muted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      {children}
    </div>
  );
}

function FieldInput({ value, small }) {
  const [v, setV] = React.useState(value);
  const [focus, setFocus] = React.useState(false);
  return (
    <input value={v} onChange={e => setV(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{
        width: '100%', background: E.bg, border: `1.5px solid ${focus ? E.brand : E.border}`, borderRadius: 8,
        padding: small ? '7px 10px' : '9px 12px', fontSize: 12.5, color: E.dark, fontFamily: 'inherit',
        boxShadow: focus ? `0 0 0 3px ${E.brand}18` : 'none', transition: 'all 0.12s',
      }} />
  );
}

function PlaceholderEditor({ section }) {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: E.dark, marginBottom: 4, textTransform: 'capitalize' }}>{section}</div>
      <div style={{ fontSize: 12.5, color: E.muted }}>Click into the resume to edit, or pick a different section in the left rail.</div>
    </div>
  );
}

// ── STYLE PANEL ──────────────────────────────────────────────────
function StylePanel({ template, setTemplate }) {
  const [advanced, setAdvanced] = React.useState(false);
  const palettes = [
    ['#5046E4','#0F0E2A','#FFFFFF'], ['#0F4C5C','#0F0E2A','#FFFFFF'],
    ['#7C3AED','#1F1A3E','#FFFFFF'], ['#0F0E2A','#52526b','#FFFFFF'],
    ['#15803D','#0F0E2A','#FFFFFF'], ['#B91C1C','#0F0E2A','#FFFFFF'],
  ];
  const [palette, setPalette] = React.useState(0);
  const [size, setSize] = React.useState('M');
  const [spacing, setSpacing] = React.useState('Cozy');
  const [font, setFont] = React.useState('Inter');

  return (
    <div style={{ padding: '20px 20px 36px' }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 17, fontWeight: 700, color: E.dark, letterSpacing: '-0.4px' }}>Style</div>
        <div style={{ fontSize: 12.5, color: E.muted, marginTop: 3 }}>Visual changes apply instantly to the preview.</div>
      </div>

      <SubLabel>Template</SubLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 18 }}>
        {[
          { id: 'modern', name: 'Modern', sub: 'Recommended' },
          { id: 'classic', name: 'Classic', sub: 'Serif' },
          { id: 'minimal', name: 'Minimal', sub: 'Editorial' },
        ].map(t => {
          const active = template === t.id;
          return (
            <button key={t.id} onClick={() => setTemplate(t.id)} style={{
              background: E.bg, border: `1.5px solid ${active ? E.brand : E.border}`, borderRadius: 10,
              padding: 8, cursor: 'pointer', boxShadow: active ? `0 0 0 3px ${E.brand}18` : 'none',
              transition: 'all 0.12s', textAlign: 'left',
            }}>
              <div style={{ height: 64, background: E.bgSoft, borderRadius: 6, marginBottom: 7, padding: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ height: 4, width: t.id === 'classic' ? '60%' : '50%', background: t.id === 'modern' ? E.brand : E.dark, borderRadius: 1, alignSelf: t.id === 'classic' ? 'center' : 'flex-start' }} />
                <div style={{ height: 2, width: '35%', background: E.muted2, borderRadius: 1, alignSelf: t.id === 'classic' ? 'center' : 'flex-start', marginBottom: 4 }} />
                {[80,65,72].map((w,i) => <div key={i} style={{ height: 2, width: `${w}%`, background: E.borderSoft, borderRadius: 1 }} />)}
              </div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: active ? E.brand : E.dark }}>{t.name}</div>
              <div style={{ fontSize: 10, color: E.muted }}>{t.sub}</div>
            </button>
          );
        })}
      </div>

      <SubLabel>Color palette</SubLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 6, marginBottom: 18 }}>
        {palettes.map((cols, i) => {
          const active = i === palette;
          return (
            <button key={i} onClick={() => setPalette(i)} style={{
              background: E.bg, border: `1.5px solid ${active ? E.brand : E.border}`, borderRadius: 8,
              padding: 5, cursor: 'pointer', display: 'flex', gap: 2, height: 38,
              boxShadow: active ? `0 0 0 3px ${E.brand}18` : 'none',
            }}>
              <div style={{ flex: 2, background: cols[0], borderRadius: 3 }} />
              <div style={{ flex: 1, background: cols[1], borderRadius: 3 }} />
              <div style={{ flex: 1, background: cols[2], border: `1px solid ${E.border}`, borderRadius: 3 }} />
            </button>
          );
        })}
      </div>

      <SubLabel>Font</SubLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 18 }}>
        {['Inter','Source Serif','Newsreader','Lato','Merriweather','JetBrains'].map(f => {
          const active = font === f;
          return (
            <button key={f} onClick={() => setFont(f)} style={{
              background: active ? E.brandLight : E.bg, color: active ? E.brand : E.dark,
              border: `1.5px solid ${active ? E.brand : E.border}`, borderRadius: 8,
              padding: '8px 6px', fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
              fontFamily: f === 'Source Serif' ? "'Source Serif 4',serif" : f === 'Newsreader' || f === 'Merriweather' ? "'Newsreader',serif" : f === 'JetBrains' ? "'JetBrains Mono',monospace" : "'Inter',sans-serif",
            }}>{f}</button>
          );
        })}
      </div>

      <SubLabel>Size</SubLabel>
      <SegmentedControl options={['S','M','L']} value={size} onChange={setSize} />

      <SubLabel>Spacing</SubLabel>
      <SegmentedControl options={['Tight','Cozy','Open']} value={spacing} onChange={setSpacing} />

      {/* Advanced */}
      <button onClick={() => setAdvanced(a => !a)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'transparent', border: 'none', padding: '14px 0 10px', cursor: 'pointer', color: E.body,
        fontSize: 12.5, fontWeight: 600, marginTop: 8, borderTop: `1px solid ${E.borderSoft}`,
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <EI name="settings" size={13} color={E.muted} /> Advanced
        </span>
        <EI name={advanced ? 'chevD' : 'chevR'} size={13} color={E.muted} sw={2} />
      </button>
      {advanced && (
        <div style={{ paddingTop: 6 }}>
          <Slider label="Headline weight" value={700} min={400} max={900} step={100} />
          <Slider label="Line height" value={1.5} min={1.2} max={1.8} step={0.05} unit="" />
          <Slider label="Paragraph spacing" value={6} min={0} max={20} unit="px" />
          <Slider label="Section gap" value={16} min={8} max={32} unit="px" />
          <Slider label="Page margin" value={56} min={32} max={88} unit="px" />
          <Slider label="Letter spacing" value={0} min={-1} max={2} step={0.1} unit="px" />
          <Slider label="Bullet indent" value={16} min={8} max={28} unit="px" />
        </div>
      )}
    </div>
  );
}

function SubLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, color: E.muted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '1.6px' }}>{children}</div>;
}

function SegmentedControl({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', background: E.bgSoft, border: `1px solid ${E.border}`, borderRadius: 9, padding: 3, marginBottom: 16 }}>
      {options.map(o => {
        const active = value === o;
        return (
          <button key={o} onClick={() => onChange(o)} style={{
            flex: 1, background: active ? E.bg : 'transparent', color: active ? E.dark : E.muted,
            border: 'none', borderRadius: 6, padding: '7px 8px', fontSize: 12, fontWeight: active ? 700 : 500,
            cursor: 'pointer', boxShadow: active ? '0 1px 3px rgba(15,14,42,0.08)' : 'none', transition: 'all 0.12s',
          }}>{o}</button>
        );
      })}
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, unit = '' }) {
  const [v, setV] = React.useState(value);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <span style={{ fontSize: 11.5, color: E.body, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 11, color: E.muted, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{v}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={v} onChange={e => setV(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: E.brand, height: 4 }} />
    </div>
  );
}

// ── SCORE PANEL ──────────────────────────────────────────────────
function ScorePanel() {
  const [tab, setTab] = React.useState('strength');
  return (
    <div>
      <div style={{ display: 'flex', padding: '14px 18px 0', gap: 6 }}>
        <ScoreTab active={tab === 'strength'} onClick={() => setTab('strength')} label="Strength" />
        <ScoreTab active={tab === 'fit'} onClick={() => setTab('fit')} label="JD Fit" />
      </div>
      {tab === 'strength' ? <StrengthScore /> : <JDFitScore />}
    </div>
  );
}
function ScoreTab({ active, onClick, label }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, background: active ? E.brandLight : E.bgSoft, color: active ? E.brand : E.body,
      border: `1px solid ${active ? E.brand + '40' : 'transparent'}`, borderRadius: 8, padding: '8px 10px',
      fontSize: 12.5, fontWeight: active ? 700 : 600, cursor: 'pointer',
    }}>{label}</button>
  );
}

function StrengthScore() {
  const score = 88;
  const breakdowns = [
    { label: 'ATS readability', val: 95, status: 'ok' },
    { label: 'Quantified bullets', val: 78, status: 'warn', note: '3 of 5 bullets need numbers' },
    { label: 'Action verbs', val: 92, status: 'ok' },
    { label: 'Keyword density', val: 84, status: 'ok' },
    { label: 'Length & spacing', val: 90, status: 'ok' },
  ];
  return (
    <div style={{ padding: 18 }}>
      {/* Big circular score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 18, background: `linear-gradient(135deg, ${E.brandSoft}, ${E.coralLight}40)`, border: `1px solid ${E.border}`, borderRadius: 14, marginBottom: 16 }}>
        <CircleScore value={score} />
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: E.muted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 2 }}>Resume strength</div>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 28, fontWeight: 800, color: E.dark, letterSpacing: '-0.8px', lineHeight: 1 }}>{score}<span style={{ fontSize: 16, color: E.muted, fontWeight: 600 }}>/100</span></div>
          <div style={{ fontSize: 12, color: E.green, fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <EI name="zap" size={12} color={E.green} /> Top 12% of resumes
          </div>
        </div>
      </div>

      <SubLabel>Breakdown</SubLabel>
      {breakdowns.map(b => (
        <div key={b.label} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 12.5, color: E.dark, fontWeight: 500 }}>{b.label}</span>
            <span style={{ fontSize: 11.5, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, color: b.status === 'ok' ? E.green : E.amber }}>{b.val}</span>
          </div>
          <div style={{ height: 5, background: E.borderSoft, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${b.val}%`, background: b.status === 'ok' ? E.green : E.amber, borderRadius: 3 }} />
          </div>
          {b.note && <div style={{ fontSize: 11, color: E.amber, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><EI name="warn" size={11} /> {b.note}</div>}
        </div>
      ))}

      <div style={{ marginTop: 18, padding: 14, background: E.amberLight, border: `1px solid ${E.amber}30`, borderRadius: 11 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <EI name="zap" size={14} color={E.amber} />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: E.dark }}>2 quick wins available</span>
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 11.5, color: E.body, lineHeight: 1.55 }}>
          <li>Add metrics to your Swiggy bullet #2</li>
          <li>Replace "Worked on" with a stronger action verb</li>
        </ul>
        <button style={{ marginTop: 10, width: '100%', background: E.dark, color: '#fff', border: 'none', borderRadius: 7, padding: '8px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <EI name="sparkle" size={12} color="#fff" /> Apply with AI
        </button>
      </div>
    </div>
  );
}

function CircleScore({ value }) {
  const r = 32, c = 2 * Math.PI * r, off = c * (1 - value / 100);
  return (
    <div style={{ position: 'relative', width: 76, height: 76 }}>
      <svg width="76" height="76" viewBox="0 0 76 76">
        <circle cx="38" cy="38" r={r} stroke={E.borderSoft} strokeWidth="6" fill="none" />
        <circle cx="38" cy="38" r={r} stroke={E.brand} strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 38 38)" />
      </svg>
    </div>
  );
}

function JDFitScore() {
  const [hasJD, setHasJD] = React.useState(true);
  if (!hasJD) return (
    <div style={{ padding: 18 }}>
      <div style={{ background: E.bgSoft, border: `1px dashed ${E.border}`, borderRadius: 12, padding: 24, textAlign: 'center' }}>
        <div style={{ width: 44, height: 44, background: E.bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: `0 4px 12px ${E.brand}15` }}>
          <EI name="target" size={20} color={E.brand} />
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: E.dark, marginBottom: 4 }}>Score against a job description</div>
        <div style={{ fontSize: 12, color: E.muted, lineHeight: 1.5, marginBottom: 14 }}>Paste a JD to see your match score and missing keywords.</div>
        <button onClick={() => setHasJD(true)} style={{ background: E.brand, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>Paste JD</button>
      </div>
    </div>
  );
  const matched = ['Go','Microservices','Payments','Latency optimization','PostgreSQL','Mentoring','System Design'];
  const missing = ['Python','GraphQL','Terraform'];
  return (
    <div style={{ padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '10px 12px', background: E.bgSoft, border: `1px solid ${E.border}`, borderRadius: 10 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: E.muted, letterSpacing: '0.5px' }}>Tailoring against</div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: E.dark }}>SDE-3 · Flipkart</div>
        </div>
        <button style={{ background: 'transparent', border: 'none', color: E.brand, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Change</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 18, background: `linear-gradient(135deg, ${E.brandSoft}, ${E.brandLight})`, border: `1px solid ${E.border}`, borderRadius: 14, marginBottom: 16 }}>
        <CircleScore value={76} />
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: E.muted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 2 }}>JD match</div>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 28, fontWeight: 800, color: E.dark, letterSpacing: '-0.8px', lineHeight: 1 }}>76<span style={{ fontSize: 16, color: E.muted, fontWeight: 600 }}>%</span></div>
          <div style={{ fontSize: 12, color: E.body, marginTop: 4 }}>Strong match · 3 keywords missing</div>
        </div>
      </div>

      <SubLabel>Matched ({matched.length})</SubLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
        {matched.map(s => <span key={s} style={{ fontSize: 11, padding: '3px 9px', background: E.greenLight, color: E.green, borderRadius: 5, fontWeight: 600 }}>✓ {s}</span>)}
      </div>
      <SubLabel>Missing ({missing.length})</SubLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
        {missing.map(s => <span key={s} style={{ fontSize: 11, padding: '3px 9px', background: E.redLight, color: E.red, borderRadius: 5, fontWeight: 600 }}>+ {s}</span>)}
      </div>

      <button style={{ width: '100%', background: E.brand, color: '#fff', border: 'none', borderRadius: 9, padding: '11px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: `0 6px 14px ${E.brand}30` }}>
        <EI name="sparkle" size={14} color="#fff" /> Auto-tailor with AI
      </button>
      <div style={{ fontSize: 10.5, color: E.muted, textAlign: 'center', marginTop: 8 }}>You'll review every change before it's applied</div>
    </div>
  );
}

// ── AI ASSIST POPOVER ────────────────────────────────────────────
function AIAssistPopover({ onClose }) {
  const [prompt, setPrompt] = React.useState('');
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,14,42,0.4)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 120, zIndex: 100, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: 560, background: E.bg, borderRadius: 14, boxShadow: '0 32px 80px rgba(0,0,0,0.25)', overflow: 'hidden', animation: 'slide-in-right 0.2s ease-out' }}>
        <div style={{ padding: '14px 16px 12px', borderBottom: `1px solid ${E.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: `linear-gradient(135deg, ${E.brand}, ${E.purple})`, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EI name="sparkle" size={14} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: E.dark }}>AI Assist</div>
            <div style={{ fontSize: 11.5, color: E.muted }}>Editing: Razorpay · Bullet #1</div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, background: E.bgSoft, border: 'none', borderRadius: 7, cursor: 'pointer', color: E.muted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><EI name="x" size={14} sw={2} /></button>
        </div>

        <div style={{ padding: 16 }}>
          <input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Make it stronger, add a metric, or describe the change…" autoFocus
            style={{ width: '100%', background: E.bgSoft, border: `1.5px solid ${E.border}`, borderRadius: 10, padding: '11px 14px', fontSize: 13, color: E.dark, marginBottom: 10 }} />

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {['Make it punchier', 'Add a metric', 'Match the JD', 'Shorten by 30%', 'Replace verb'].map(s => (
              <button key={s} style={{ background: E.bgSoft, border: `1px solid ${E.border}`, borderRadius: 100, padding: '5px 11px', fontSize: 11.5, fontWeight: 500, color: E.body, cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.background = E.brandLight; e.currentTarget.style.color = E.brand; e.currentTarget.style.borderColor = E.brand + '40'; }}
                onMouseLeave={e => { e.currentTarget.style.background = E.bgSoft; e.currentTarget.style.color = E.body; e.currentTarget.style.borderColor = E.border; }}>{s}</button>
            ))}
          </div>

          <SubLabel>3 alternatives</SubLabel>
          {[
            'Led migration of payments orchestration from Rails monolith to Go microservices, reducing P99 latency 64% (480ms → 173ms) across 14M daily transactions.',
            'Architected and shipped a Go microservices replacement for the Rails payments monolith — P99 latency dropped from 480ms to 173ms while handling 14M daily payments.',
            'Drove the Rails-to-Go migration of payments infra; cut tail latency by two-thirds and stabilized 14M/day transaction throughput.',
          ].map((alt, i) => (
            <div key={i} style={{ background: E.bgSoft, border: `1px solid ${E.border}`, borderRadius: 9, padding: 12, marginBottom: 8, transition: 'all 0.12s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = E.brand + '60'; e.currentTarget.style.background = E.bg; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = E.border; e.currentTarget.style.background = E.bgSoft; }}>
              <div style={{ fontSize: 12.5, color: E.dark, lineHeight: 1.5, marginBottom: 8 }}>{alt}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button style={{ background: E.dark, color: '#fff', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <EI name="check" size={11} sw={2.5} color="#fff" /> Apply
                </button>
                <button style={{ background: E.bg, color: E.body, border: `1px solid ${E.border}`, borderRadius: 6, padding: '5px 10px', fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>Edit</button>
                <span style={{ marginLeft: 'auto', fontSize: 10, color: E.muted, fontFamily: "'JetBrains Mono',monospace" }}>v{i+1}</span>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button style={{ flex: 1, background: E.bg, border: `1px solid ${E.border}`, borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 600, color: E.body, cursor: 'pointer' }}>Regenerate</button>
            <button style={{ flex: 1, background: E.brand, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>More options</button>
          </div>

          <div style={{ marginTop: 12, padding: '8px 12px', background: E.bgSoft, borderRadius: 7, fontSize: 11, color: E.muted, display: 'flex', alignItems: 'center', gap: 6 }}>
            <EI name="info" size={12} color={E.muted} />
            Generating from: Razorpay · Senior SE · Aug 2023–Present
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TAILOR DIALOG (JD review) ────────────────────────────────────
function TailorDialog({ onClose }) {
  const diffs = [
    { section: 'Summary', before: 'Senior software engineer with 5+ years building scalable web platforms…', after: 'Senior backend engineer with 5+ years building distributed payments and search systems at scale…', accepted: true },
    { section: 'Experience · Razorpay #1', before: 'Led the migration of the payments orchestration service from a Rails monolith to Go microservices…', after: 'Architected the Rails-to-Go migration of payments orchestration handling 14M+ daily transactions; cut P99 latency 64%.', accepted: true },
    { section: 'Skills', before: 'Go, TypeScript, React, PostgreSQL…', after: '+ Distributed Systems, Event-Driven Architecture, gRPC streaming', accepted: false },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,14,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)', padding: 32 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: 880, maxHeight: '90vh', background: E.bg, borderRadius: 16, boxShadow: '0 32px 80px rgba(0,0,0,0.3)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${E.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${E.brand}, ${E.purple})`, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EI name="target" size={18} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: E.dark, letterSpacing: '-0.3px' }}>Tailor to job description</div>
            <div style={{ fontSize: 12.5, color: E.muted }}>Review every change. Apply only what makes sense.</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, background: E.bgSoft, border: 'none', borderRadius: 8, cursor: 'pointer', color: E.muted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><EI name="x" size={15} sw={2} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', flex: 1, minHeight: 0 }}>
          {/* JD pane */}
          <div style={{ borderRight: `1px solid ${E.border}`, padding: 18, overflowY: 'auto', background: E.bgSoft }}>
            <SubLabel>Job description</SubLabel>
            <div style={{ background: E.bg, border: `1px solid ${E.border}`, borderRadius: 10, padding: 14, fontSize: 12, color: E.body, lineHeight: 1.55, fontFamily: "'JetBrains Mono',monospace" }}>
              <div style={{ fontWeight: 700, color: E.dark, marginBottom: 4, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13 }}>SDE-3, Backend</div>
              <div style={{ color: E.muted, marginBottom: 10, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11.5 }}>Flipkart · Bengaluru</div>
              <div>We're hiring a senior backend engineer to lead the next generation of our payments and order systems. You'll work on distributed services handling 100M+ events/day, mentor junior engineers, and own latency-critical paths end-to-end…</div>
            </div>

            <div style={{ marginTop: 16, padding: 12, background: E.brandLight, border: `1px solid ${E.brand}30`, borderRadius: 9 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: E.brand, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                <EI name="sparkle" size={12} color={E.brand} /> AI summary
              </div>
              <div style={{ fontSize: 11.5, color: E.dark, lineHeight: 1.55 }}>Strong match. Emphasis on distributed systems, payments, and mentorship — your Razorpay role aligns. Add 3 missing keywords for a better fit.</div>
            </div>
          </div>

          {/* Diff pane */}
          <div style={{ overflowY: 'auto', padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <SubLabel>Suggested changes ({diffs.length})</SubLabel>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={{ background: E.bg, color: E.body, border: `1px solid ${E.border}`, borderRadius: 7, padding: '5px 10px', fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>Reject all</button>
                <button style={{ background: E.brand, color: '#fff', border: 'none', borderRadius: 7, padding: '5px 10px', fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>Accept all</button>
              </div>
            </div>

            {diffs.map((d, i) => (
              <DiffCard key={i} diff={d} />
            ))}
          </div>
        </div>

        <div style={{ padding: '14px 22px', borderTop: `1px solid ${E.border}`, display: 'flex', alignItems: 'center', gap: 12, background: E.bgSoft }}>
          <div style={{ fontSize: 12, color: E.muted }}>2 of 3 changes accepted · JD match will rise from 76% → 89%</div>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: E.bg, border: `1px solid ${E.border}`, borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, color: E.body, cursor: 'pointer' }}>Cancel</button>
          <button onClick={onClose} style={{ background: E.coral, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 12px ${E.coral}40` }}>Apply 2 changes</button>
        </div>
      </div>
    </div>
  );
}

function DiffCard({ diff }) {
  const [accepted, setAccepted] = React.useState(diff.accepted);
  return (
    <div style={{ background: E.bg, border: `1px solid ${accepted ? E.green + '40' : E.border}`, borderRadius: 11, marginBottom: 10, overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${E.borderSoft}`, background: accepted ? E.greenLight + '60' : E.bgSoft }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: E.dark }}>{diff.section}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setAccepted(false)} style={{
            background: !accepted ? E.bg : 'transparent', color: !accepted ? E.red : E.muted,
            border: `1px solid ${!accepted ? E.red + '40' : 'transparent'}`,
            borderRadius: 6, padding: '4px 9px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
          }}>Reject</button>
          <button onClick={() => setAccepted(true)} style={{
            background: accepted ? E.green : 'transparent', color: accepted ? '#fff' : E.muted,
            border: `1px solid ${accepted ? E.green : E.border}`,
            borderRadius: 6, padding: '4px 9px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
          }}>Accept</button>
        </div>
      </div>
      <div style={{ padding: 12, fontSize: 12, lineHeight: 1.55 }}>
        <div style={{ background: E.redLight + '60', borderLeft: `3px solid ${E.red}`, padding: '7px 10px', borderRadius: '0 6px 6px 0', marginBottom: 6, color: '#7a1f1f' }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2, opacity: 0.8 }}>− Before</div>
          {diff.before}
        </div>
        <div style={{ background: E.greenLight + '60', borderLeft: `3px solid ${E.green}`, padding: '7px 10px', borderRadius: '0 6px 6px 0', color: '#0d4a23' }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2, opacity: 0.8 }}>+ After</div>
          {diff.after}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  E, EI, RESUME, EditorShell, TopBar, IconButton, SectionsRail, PreviewCanvas, ResumePage,
  TemplateModern, TemplateClassic, TemplateMinimal, Section, ClassicSection, MinSection,
  RightPanel, EditPanel, ExperienceEditor, BulletEditor, BulletChip, FieldRow, FieldInput, PlaceholderEditor,
  StylePanel, SubLabel, SegmentedControl, Slider, ScorePanel, ScoreTab, StrengthScore, CircleScore, JDFitScore,
  AIAssistPopover, TailorDialog, DiffCard,
});
