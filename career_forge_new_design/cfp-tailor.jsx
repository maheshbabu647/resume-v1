// CareerForgePro — Tailor Flow
// Screen 1: ATS Report with Quick / Smart action buttons
// Screen 2: Smart Tailor review — per-skill cards with 3 options
// Both screens hand off to the editor.

const T = {
  brand: '#5046E4', brandDark: '#3730D0', brandLight: '#EEEDFF', brandSoft: '#F4F2FF',
  coral: '#FF5C35', coralLight: '#FFF1ED', coralDark: '#E04A26',
  dark: '#0F0E2A', body: '#44445A', muted: '#8888A5', muted2: '#B5B5C8',
  border: '#E8E6F4', borderSoft: '#F0EEF9',
  bg: '#FFFFFF', bgSoft: '#F7F6FF', canvas: '#F5F4FB',
  green: '#16A34A', greenLight: '#F0FDF4', greenDark: '#15803D',
  amber: '#F59E0B', amberLight: '#FEF3C7',
  red: '#DC2626', redLight: '#FEE2E2',
};

function TIcon({ name, size = 18, color = 'currentColor', sw = 1.7 }) {
  const paths = {
    arrow: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    arrowL: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    check: <><polyline points="5 12 10 17 20 7"/></>,
    x: <><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    sparkle: <><path d="M12 3l1.5 5L19 9.5 13.5 11 12 16l-1.5-5L5 9.5 10.5 8z"/></>,
    bolt: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    target: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
    seedling: <><path d="M12 22V12"/><path d="M12 12C12 8 16 6 20 6c0 4-2 8-8 8"/><path d="M12 12C12 9 8 7 4 7c0 3 2 7 8 7"/></>,
    skip: <><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></>,
    flag: <><path d="M4 21V3"/><path d="M4 4h13l-3 5 3 5H4"/></>,
    gauge: <><path d="M12 14L18 8"/><circle cx="12" cy="14" r="9"/><path d="M3 14a9 9 0 0118 0"/></>,
    chevron: <><polyline points="9 18 15 12 9 6"/></>,
    chevronD: <><polyline points="6 9 12 15 18 9"/></>,
    info: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    bulb: <><path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26A7 7 0 0012 2z"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    refresh: <><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></>,
    filter: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    wand: <><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8L19 13"/><path d="M15 9h0"/><path d="M17.8 6.2L19 5"/><path d="M3 21l9-9"/><path d="M12.2 6.2L11 5"/></>,
    upload: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    fileCheck: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 14 11 16 15 12"/></>,
    link: <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>{paths[name]}</svg>;
}

function TLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 30, height: 30, background: T.brand, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 11L5 6L7.5 8.5L10 4L12.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 16, color: T.dark, letterSpacing: '-0.3px' }}>CareerForgePro</span>
    </div>
  );
}

// ── MOCK DATA ────────────────────────────────────────────────────
const MOCK_JOB = {
  title: 'Senior Frontend Engineer',
  company: 'Razorpay',
  location: 'Bengaluru',
};

const MOCK_GAPS = {
  strengths: [
    { label: 'React', detail: 'Strong match' },
    { label: 'TypeScript', detail: 'Mentioned 4×' },
    { label: 'REST APIs', detail: 'Matches JD' },
    { label: 'Git', detail: 'Match' },
  ],
  formatting: { score: 95, hint: 'Clean, ATS-friendly structure' },
  matched: 18,
  total: 31,
};

// id, name, type, weeks (basic readiness), suggested ("have"|"learning"|"skip"), category
const MOCK_MISSING = [
  { id: 1,  name: 'Next.js',         type: 'required',  weeks: 2,   suggested: 'have',    why: "You already have React" },
  { id: 2,  name: 'Redux Toolkit',   type: 'required',  weeks: 1,   suggested: 'have',    why: "You list Redux" },
  { id: 3,  name: 'Tailwind CSS',    type: 'required',  weeks: 1,   suggested: 'have',    why: "Mentioned in your projects" },
  { id: 4,  name: 'Jest',            type: 'required',  weeks: 1,   suggested: 'learning', why: "JS testing — quick to pick up" },
  { id: 5,  name: 'Cypress',         type: 'required',  weeks: 1,   suggested: 'learning', why: "Similar to other E2E tools" },
  { id: 6,  name: 'GraphQL',         type: 'required',  weeks: 3,   suggested: 'learning', why: "You know REST well" },
  { id: 7,  name: 'Webpack',         type: 'preferred', weeks: 2,   suggested: 'have',    why: "Standard React stack" },
  { id: 8,  name: 'Storybook',       type: 'preferred', weeks: 1,   suggested: 'learning' },
  { id: 9,  name: 'Figma',           type: 'preferred', weeks: 1,   suggested: 'have',    why: "Most FE engs use it" },
  { id: 10, name: 'CI/CD',           type: 'preferred', weeks: 2,   suggested: 'learning' },
  { id: 11, name: 'Docker',          type: 'preferred', weeks: 3,   suggested: 'learning' },
  { id: 12, name: 'AWS S3 / CloudFront', type: 'preferred', weeks: 2, suggested: 'skip' },
  { id: 13, name: 'Kotlin',          type: 'preferred', weeks: 8,   suggested: 'skip',     why: "Far from your stack" },
];

// ── ROOT ─────────────────────────────────────────────────────────
function TailorFlow({ screen: forcedScreen, onScreenChange, userState = 'free' }) {
  const [screen, setScreen] = React.useState(forcedScreen || 'input');
  const [analyzing, setAnalyzing] = React.useState(false);
  React.useEffect(() => { if (forcedScreen) setScreen(forcedScreen); }, [forcedScreen]);

  function go(next) {
    setScreen(next);
    onScreenChange && onScreenChange(next);
  }

  function startAnalysis() {
    setAnalyzing(true);
    setTimeout(() => { setAnalyzing(false); go('report'); }, 2200);
  }

  return (
    <div style={{ minHeight: '100vh', background: screen === 'input' ? T.bg : T.canvas, fontFamily: "'Plus Jakarta Sans',sans-serif", display: 'flex', flexDirection: 'column' }}>
      <TailorHeader screen={screen} onBack={() => go(screen === 'smart' ? 'report' : 'input')} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {screen === 'input' && !analyzing && (
          <InputScreen userState={userState} onAnalyze={startAnalysis} />
        )}
        {analyzing && <AnalyzingScreen />}
        {screen === 'report' && !analyzing && (
          <ReportScreen
            onQuick={() => go('opening')}
            onSmart={() => go('smart')}
          />
        )}
        {screen === 'smart' && (
          <SmartReviewScreen
            onApply={() => go('opening')}
            onBack={() => go('report')}
          />
        )}
        {screen === 'opening' && <OpeningEditor />}
      </div>
    </div>
  );
}

// ── HEADER ───────────────────────────────────────────────────────
function TailorHeader({ screen, onBack }) {
  const breadcrumb = {
    input: 'Set up',
    report: 'Report',
    smart: 'Smart Tailor — Review skills',
    opening: 'Applying',
  }[screen] || 'Set up';
  return (
    <header style={{ height: 64, background: T.bg, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 18, flexShrink: 0 }}>
      <TLogo />
      <div style={{ width: 1, height: 22, background: T.border, margin: '0 6px' }} />
      <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.muted, fontWeight: 600 }}>
        <span>ATS Score</span>
        <TIcon name="chevron" size={12} color={T.muted2} />
        <span style={{ color: T.dark }}>{breadcrumb}</span>
      </nav>
      <div style={{ flex: 1 }} />
      {(screen === 'smart' || screen === 'report') && (
        <button onClick={onBack} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'transparent', border: `1px solid ${T.border}`,
          color: T.body, padding: '7px 14px', borderRadius: 8,
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          <TIcon name="arrowL" size={13} color={T.body} />
          {screen === 'smart' ? 'Back to report' : 'Change inputs'}
        </button>
      )}
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 0: INPUT — pick resume + provide JD
// ─────────────────────────────────────────────────────────────────
const SAVED_RESUMES = [
  { id: 1, role: 'Frontend Engineer · Master', co: 'Default', score: 89, when: '2h ago' },
  { id: 2, role: 'SDE-1', co: 'Razorpay', score: 91, when: 'Yesterday' },
  { id: 3, role: 'Product Designer', co: 'Swiggy', score: 78, when: '3d ago' },
  { id: 4, role: 'Frontend Intern', co: 'Zomato', score: 88, when: '1w ago' },
];

function InputScreen({ userState, onAnalyze }) {
  const isAuth = userState !== 'anonymous';
  const [resumeMode, setResumeMode] = React.useState(isAuth ? 'saved' : 'upload');
  const [pickedResume, setPickedResume] = React.useState(isAuth ? SAVED_RESUMES[0].id : null);
  const [uploadedResumeName, setUploadedResumeName] = React.useState('');

  const [jdMode, setJdMode] = React.useState('paste');
  const [jdText, setJdText] = React.useState('');
  const [jdUrl, setJdUrl] = React.useState('');
  const [jdFileName, setJdFileName] = React.useState('');

  const hasResume = (resumeMode === 'saved' && pickedResume) || (resumeMode === 'upload' && uploadedResumeName);
  const hasJd = (jdMode === 'paste' && jdText.trim().length > 50)
             || (jdMode === 'url' && /^https?:\/\/.+/.test(jdUrl.trim()))
             || (jdMode === 'upload' && jdFileName);

  const canAnalyze = hasResume && hasJd;

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: 'clamp(48px, 6vw, 80px) clamp(24px, 4vw, 48px) 80px', width: '100%' }}>
      {/* Hero */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase', color: T.brand, marginBottom: 14 }}>
          Tailor to a job
        </div>
        <h1 style={{
          fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700,
          fontSize: 'clamp(32px, 3.6vw, 42px)', letterSpacing: '-1.4px',
          color: T.dark, margin: '0 0 12px', lineHeight: 1.05, textWrap: 'balance',
        }}>
          Two inputs. <span style={{ color: T.brand }}>One tailored resume.</span>
        </h1>
        <p style={{ fontSize: 16, color: T.body, lineHeight: 1.55, margin: 0, maxWidth: 560 }}>
          Pick the resume you want to tailor, then drop in the job description.
          We'll score the match and rewrite what needs rewriting.
        </p>
      </div>

      {/* STEP 1 — Resume */}
      <StepBlock number="01" title="Choose your resume" sub={isAuth ? 'Pick a saved resume, or upload a fresh PDF.' : 'Upload your current resume as a PDF or DOCX.'}>
        {isAuth && (
          <Segmented
            value={resumeMode}
            onChange={setResumeMode}
            options={[
              { id: 'saved',  label: 'My resumes', icon: 'fileCheck' },
              { id: 'upload', label: 'Upload new', icon: 'upload' },
            ]}
          />
        )}

        {resumeMode === 'saved' && isAuth && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginTop: 18 }}>
            {SAVED_RESUMES.map(r => (
              <SavedResumeCard key={r.id} resume={r} picked={pickedResume === r.id} onClick={() => setPickedResume(r.id)} />
            ))}
          </div>
        )}

        {(resumeMode === 'upload' || !isAuth) && (
          <UploadBox
            label={uploadedResumeName || 'Drop your resume here'}
            sub={uploadedResumeName ? 'Ready to analyze' : 'PDF or DOCX · up to 5 MB'}
            accept=".pdf,.doc,.docx"
            done={!!uploadedResumeName}
            onFile={(name) => setUploadedResumeName(name)}
          />
        )}
      </StepBlock>

      {/* STEP 2 — JD */}
      <StepBlock number="02" title="Add the job description" sub="The more complete the JD, the smarter the tailoring.">
        <Segmented
          value={jdMode}
          onChange={setJdMode}
          options={[
            { id: 'paste',  label: 'Paste text', icon: 'edit' },
            { id: 'upload', label: 'Upload file', icon: 'upload' },
            { id: 'url',    label: 'From URL', icon: 'link' },
          ]}
        />

        {jdMode === 'paste' && (
          <div style={{
            marginTop: 18,
            background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 14,
            overflow: 'hidden', transition: 'border-color 0.2s, box-shadow 0.2s',
          }}>
            <textarea
              value={jdText} onChange={e => setJdText(e.target.value)}
              placeholder={"Paste the full job description here.\n\nWe'll extract the required skills, preferred skills, and key phrases that the ATS scanner looks for."}
              style={{
                width: '100%', minHeight: 180,
                background: 'transparent', border: 'none', outline: 'none', resize: 'vertical',
                padding: '22px 24px', fontSize: 14.5, lineHeight: 1.6, color: T.dark,
                fontFamily: 'inherit',
              }}
            />
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 20px', borderTop: `1px solid ${T.border}`, background: T.bgSoft,
              fontSize: 12, color: T.muted, fontWeight: 500,
            }}>
              <span>{jdText.length > 0 ? `${jdText.length} characters` : 'At least 50 characters helps us match accurately.'}</span>
              <span style={{ color: jdText.length > 50 ? T.green : T.muted }}>
                {jdText.length > 50 ? '✓ Looks good' : ''}
              </span>
            </div>
          </div>
        )}

        {jdMode === 'upload' && (
          <UploadBox
            label={jdFileName || 'Drop a JD PDF or DOCX here'}
            sub={jdFileName ? 'Ready to analyze' : 'Some companies post JDs as PDFs — upload it directly.'}
            accept=".pdf,.doc,.docx,.txt"
            done={!!jdFileName}
            onFile={(name) => setJdFileName(name)}
          />
        )}

        {jdMode === 'url' && (
          <UrlInput value={jdUrl} onChange={setJdUrl} />
        )}
      </StepBlock>

      {/* Footer CTA */}
      <div style={{
        position: 'sticky', bottom: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 24px', marginTop: 28,
        background: T.bg, border: `1px solid ${T.border}`, borderRadius: 14,
        boxShadow: canAnalyze ? `0 -12px 30px ${T.dark}05, 0 0 0 5px ${T.coral}10` : `0 -8px 20px ${T.dark}04`,
        transition: 'box-shadow 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ReadinessIndicator hasResume={hasResume} hasJd={hasJd} />
        </div>
        <button onClick={canAnalyze ? onAnalyze : undefined} disabled={!canAnalyze}
          onMouseEnter={e => { if (canAnalyze) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 14px 32px ${T.coral}55`; } }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = canAnalyze ? `0 8px 22px ${T.coral}40` : 'none'; }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: canAnalyze ? T.coral : T.muted2, color: '#fff', border: 'none',
            padding: '13px 26px', fontSize: 14.5, fontWeight: 700,
            borderRadius: 11, cursor: canAnalyze ? 'pointer' : 'not-allowed',
            boxShadow: canAnalyze ? `0 8px 22px ${T.coral}40` : 'none',
            transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
            fontFamily: 'inherit',
          }}>
          <TIcon name="sparkle" size={14} color="#fff" />
          Analyze match
          <TIcon name="arrow" size={14} color="#fff" sw={2.2} />
        </button>
      </div>
    </div>
  );
}

// ── Sub-components for InputScreen ──
function StepBlock({ number, title, sub, children }) {
  return (
    <div style={{ marginBottom: 36, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 18 }}>
        <span style={{
          fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 17,
          color: T.brand, letterSpacing: '-0.5px',
          minWidth: 26,
        }}>{number}</span>
        <div style={{ flex: 1 }}>
          <h2 style={{
            fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 20,
            letterSpacing: '-0.5px', color: T.dark, margin: '0 0 4px',
          }}>{title}</h2>
          {sub && <p style={{ fontSize: 13.5, color: T.muted, margin: 0, fontWeight: 500 }}>{sub}</p>}
        </div>
      </div>
      <div style={{ paddingLeft: 40 }}>{children}</div>
    </div>
  );
}

function Segmented({ value, onChange, options }) {
  return (
    <div style={{
      display: 'inline-flex', background: T.bgSoft, padding: 4, borderRadius: 10,
      border: `1px solid ${T.border}`, gap: 2,
    }}>
      {options.map(o => {
        const active = value === o.id;
        return (
          <button key={o.id} onClick={() => onChange(o.id)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: active ? T.bg : 'transparent',
            color: active ? T.dark : T.muted,
            border: 'none', borderRadius: 7,
            padding: '8px 14px', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
            whiteSpace: 'nowrap',
            boxShadow: active ? `0 1px 3px ${T.dark}10` : 'none',
            transition: 'all 0.2s',
          }}>
            {o.icon && <TIcon name={o.icon} size={13} color={active ? T.dark : T.muted} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function SavedResumeCard({ resume, picked, onClick }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: T.bg,
      border: `1.5px solid ${picked ? T.brand : (hov ? T.dark + '20' : T.border)}`,
      borderRadius: 12, padding: 14, textAlign: 'left',
      cursor: 'pointer', fontFamily: 'inherit',
      transition: 'all 0.2s',
      boxShadow: picked ? `0 0 0 4px ${T.brand}15` : 'none',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 30, height: 38, background: T.bgSoft, borderRadius: 4,
          border: `1px solid ${T.border}`,
          padding: 4,
        }}>
          <div style={{ height: 2, background: T.muted2, marginBottom: 2, borderRadius: 1 }} />
          <div style={{ height: 1, width: '70%', background: T.borderSoft, marginBottom: 1.5, borderRadius: 1 }} />
          <div style={{ height: 1, width: '50%', background: T.borderSoft, marginBottom: 1.5, borderRadius: 1 }} />
          <div style={{ height: 1, width: '80%', background: T.borderSoft, marginBottom: 1.5, borderRadius: 1 }} />
          <div style={{ height: 1, width: '40%', background: T.borderSoft, borderRadius: 1 }} />
        </div>
        <div style={{
          marginLeft: 'auto', fontSize: 11, fontWeight: 700,
          color: resume.score >= 85 ? T.green : T.amber,
          background: resume.score >= 85 ? T.greenLight : T.amberLight,
          padding: '2px 7px', borderRadius: 100,
        }}>ATS {resume.score}</div>
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: T.dark, marginBottom: 2, letterSpacing: '-0.1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {resume.role}
      </div>
      <div style={{ fontSize: 11.5, color: T.muted, fontWeight: 500 }}>
        {resume.co} <span style={{ color: T.muted2 }}>·</span> {resume.when}
      </div>
      {picked && (
        <div style={{
          position: 'absolute', top: -8, right: -8,
          width: 22, height: 22, borderRadius: '50%',
          background: T.brand, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 12px ${T.brand}40`,
        }}>
          <TIcon name="check" size={12} color="#fff" sw={3} />
        </div>
      )}
    </button>
  );
}

function UploadBox({ label, sub, accept, done, onFile }) {
  const [hover, setHover] = React.useState(false);
  function handlePick() {
    // Fake picker for demo
    const sampleName = accept.includes('pdf') && (accept.includes('doc')) ? 'arjun-resume.pdf' : 'job-description.pdf';
    onFile(sampleName);
  }
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={handlePick}
      style={{
        marginTop: 18,
        background: done ? T.greenLight : (hover ? T.brandSoft : T.bg),
        border: `1.5px dashed ${done ? T.green : (hover ? T.brand : T.border)}`,
        borderRadius: 14,
        padding: '32px 24px',
        textAlign: 'center', cursor: 'pointer',
        transition: 'all 0.2s',
      }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: done ? T.green : T.brandLight,
        color: done ? '#fff' : T.brand,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 14,
      }}>
        <TIcon name={done ? 'check' : 'upload'} size={20} color={done ? '#fff' : T.brand} sw={done ? 2.5 : 1.8} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: T.dark, marginBottom: 4, letterSpacing: '-0.2px' }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: done ? T.greenDark : T.muted, fontWeight: 500 }}>{sub}</div>
      {done && (
        <button onClick={(e) => { e.stopPropagation(); onFile(''); }} style={{
          marginTop: 12, background: 'transparent', border: 'none',
          color: T.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer',
          textDecoration: 'underline', textUnderlineOffset: 3,
        }}>
          Use a different file
        </button>
      )}
    </div>
  );
}

function UrlInput({ value, onChange }) {
  const [focus, setFocus] = React.useState(false);
  const valid = /^https?:\/\/.+/.test(value.trim());
  return (
    <div style={{
      marginTop: 18,
      display: 'flex', alignItems: 'center',
      background: T.bg, border: `1.5px solid ${focus ? T.brand : T.border}`, borderRadius: 12,
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxShadow: focus ? `0 0 0 5px ${T.brand}15` : 'none',
      overflow: 'hidden',
    }}>
      <div style={{ paddingLeft: 18, color: focus ? T.brand : T.muted, display: 'flex' }}>
        <TIcon name="link" size={16} color="currentColor" />
      </div>
      <input
        value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        placeholder="https://www.linkedin.com/jobs/view/…"
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          padding: '17px 16px 17px 12px',
          fontSize: 14.5, color: T.dark, fontWeight: 500, fontFamily: 'inherit',
        }}
      />
      {value && (
        <div style={{ paddingRight: 16, fontSize: 12, color: valid ? T.green : T.amber, fontWeight: 600 }}>
          {valid ? '✓' : '…'}
        </div>
      )}
    </div>
  );
}

function ReadinessIndicator({ hasResume, hasJd }) {
  const items = [
    { label: 'Resume', ok: hasResume },
    { label: 'JD', ok: hasJd },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{
            width: 18, height: 18, borderRadius: '50%',
            background: it.ok ? T.green : T.borderSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.25s',
          }}>
            {it.ok && <TIcon name="check" size={10} color="#fff" sw={3} />}
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: it.ok ? T.dark : T.muted }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── ANALYZING TRANSITION ────────────────────────────────────────
function AnalyzingScreen() {
  const phases = [
    'Reading your resume…',
    'Parsing the job description…',
    'Matching keywords against ATS rules…',
    'Generating your report…',
  ];
  const [phaseIdx, setPhaseIdx] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setPhaseIdx(p => Math.min(p + 1, phases.length - 1)), 500);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: `linear-gradient(135deg, ${T.brand}, ${T.coral})`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
          boxShadow: `0 18px 50px ${T.brand}35`,
          animation: 'pulse-glow 1.6s ease-in-out infinite',
        }}>
          <TIcon name="sparkle" size={26} color="#fff" />
        </div>
        <div style={{
          fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 26,
          letterSpacing: '-0.6px', color: T.dark, marginBottom: 8,
        }}>Analyzing your match</div>
        <div style={{ fontSize: 14, color: T.body, marginBottom: 24, lineHeight: 1.5 }}>
          We're scoring your resume against the JD using the same logic top ATS systems use.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {phases.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 10,
              background: i <= phaseIdx ? T.brandSoft : 'transparent',
              opacity: i <= phaseIdx ? 1 : 0.4,
              transition: 'all 0.4s',
            }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                background: i < phaseIdx ? T.green : (i === phaseIdx ? T.brand : T.borderSoft),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {i < phaseIdx && <TIcon name="check" size={10} color="#fff" sw={3} />}
                {i === phaseIdx && <div style={{ width: 6, height: 6, background: '#fff', borderRadius: '50%' }} />}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: i <= phaseIdx ? T.dark : T.muted, textAlign: 'left' }}>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 1: ATS REPORT
// ─────────────────────────────────────────────────────────────────
function ReportScreen({ onQuick, onSmart }) {
  const score = 67;
  const projected = 91;
  const reqMissing = MOCK_MISSING.filter(m => m.type === 'required');
  const prefMissing = MOCK_MISSING.filter(m => m.type === 'preferred');

  return (
    <div style={{ width: '100%', maxWidth: 1080, margin: '0 auto', padding: 'clamp(40px, 5vw, 64px) clamp(24px, 4vw, 48px) 96px' }}>

      {/* ===== HERO — Score moment ===== */}
      <ScoreHero score={score} projected={projected} reqMissing={reqMissing.length} prefMissing={prefMissing.length} />

      {/* ===== BREAKDOWN STRIP ===== */}
      <div style={{ marginTop: 56 }}>
        <SectionEyebrow>How your score breaks down</SectionEyebrow>
        <BreakdownStrip />
      </div>

      {/* ===== STRENGTHS + GAPS, two-column ===== */}
      <div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 32 }}>
        <StrengthsColumn />
        <GapsColumn required={reqMissing} preferred={prefMissing} />
      </div>

      {/* ===== DECISION MOMENT ===== */}
      <div style={{ marginTop: 80 }}>
        <DecisionMoment score={score} projected={projected} onQuick={onQuick} onSmart={onSmart} />
      </div>
    </div>
  );
}

function SectionEyebrow({ children }) {
  return (
    <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase', color: T.muted, marginBottom: 18 }}>
      {children}
    </div>
  );
}

// ── SCORE HERO ────────────────────────────────────────────────────
function ScoreHero({ score, projected, reqMissing, prefMissing }) {
  const r = 84;
  const c = 2 * Math.PI * r;
  const dash = c * (score / 100);
  const projectedDash = c * (projected / 100);

  const tone = score >= 85 ? T.green : score >= 70 ? T.amber : T.coral;
  const toneLabel = score >= 85 ? 'Strong match' : score >= 70 ? 'Close — fixable' : 'Needs work';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 48, alignItems: 'center' }}>

      {/* LEFT — Big arc */}
      <div style={{ position: 'relative', width: 260, height: 260 }}>
        <svg width="260" height="260" viewBox="0 0 200 200">
          {/* Track */}
          <circle cx="100" cy="100" r={r} fill="none" stroke={T.borderSoft} strokeWidth="10" />
          {/* Projected — ghost ring */}
          <circle cx="100" cy="100" r={r} fill="none" stroke={`${T.green}20`} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={`${projectedDash} ${c}`} transform="rotate(-90 100 100)" />
          {/* Actual */}
          <circle cx="100" cy="100" r={r} fill="none" stroke={tone} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`} transform="rotate(-90 100 100)"
            style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(.2,.8,.2,1)' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase', color: T.muted, marginBottom: 6 }}>
            ATS Score
          </div>
          <div style={{
            fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800,
            fontSize: 80, color: T.dark, lineHeight: 0.85, letterSpacing: '-3.5px',
          }}>{score}</div>
          <div style={{ fontSize: 13, color: T.muted, fontWeight: 600, marginTop: 8 }}>out of 100</div>
        </div>
      </div>

      {/* RIGHT — narrative */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${tone}14`, color: tone, padding: '6px 12px', borderRadius: 999, marginBottom: 18, fontSize: 12, fontWeight: 700, letterSpacing: '0.4px' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: tone }} />
          {toneLabel}
        </div>
        <h1 style={{
          fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700,
          fontSize: 'clamp(28px, 3.2vw, 38px)', letterSpacing: '-1.2px',
          color: T.dark, margin: '0 0 12px', lineHeight: 1.1, textWrap: 'balance',
        }}>
          You're <span style={{ color: T.brand }}>{projected - score} points</span> away from a top score.
        </h1>
        <p style={{ fontSize: 15.5, color: T.body, lineHeight: 1.6, margin: '0 0 24px', maxWidth: 540 }}>
          Matched <strong style={{ color: T.dark }}>{MOCK_GAPS.matched} of {MOCK_GAPS.total}</strong> key terms. The {reqMissing} required and {prefMissing} preferred skills missing below are mostly fixable — pick how aggressive you want to be.
        </p>

        {/* Tile row — meta facts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, paddingTop: 18, borderTop: `1px solid ${T.border}` }}>
          <MetaTile label="Role" value={MOCK_JOB.title} sub={MOCK_JOB.company} />
          <div style={{ width: 1, height: 36, background: T.border }} />
          <MetaTile label="Required gaps" value={`${reqMissing}`} sub="block the screen" valueColor={T.coral} />
          <div style={{ width: 1, height: 36, background: T.border }} />
          <MetaTile label="Projected score" value={projected} sub="if you fix the gaps" valueColor={T.green} />
        </div>
      </div>
    </div>
  );
}

function MetaTile({ label, value, sub, valueColor }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '1.4px', textTransform: 'uppercase', color: T.muted, marginBottom: 5 }}>{label}</div>
      <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 18, color: valueColor || T.dark, letterSpacing: '-0.4px', lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11.5, color: T.muted, fontWeight: 500 }}>{sub}</div>
    </div>
  );
}

// ── BREAKDOWN STRIP ────────────────────────────────────────────────
function BreakdownStrip() {
  const items = [
    { label: 'Keyword match',  score: 58, weight: 40, color: T.coral, hint: '18 of 31 matched' },
    { label: 'Skills coverage', score: 62, weight: 25, color: T.amber, hint: '5 required missing' },
    { label: 'Formatting',     score: 95, weight: 20, color: T.green, hint: 'Clean, ATS-friendly' },
    { label: 'Experience fit', score: 78, weight: 15, color: T.brand, hint: 'Years relevant' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
      {items.map((it, i) => (
        <div key={i} style={{
          background: T.bg, border: `1px solid ${T.border}`,
          borderRadius: 14, padding: '20px 20px 22px',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: T.dark, letterSpacing: '-0.1px' }}>{it.label}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: T.muted2 }}>{it.weight}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 10 }}>
            <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 26, color: it.color, letterSpacing: '-1px', lineHeight: 1 }}>{it.score}</span>
            <span style={{ fontSize: 11, color: T.muted, fontWeight: 600 }}>/ 100</span>
          </div>
          <div style={{ height: 4, background: T.borderSoft, borderRadius: 2, overflow: 'hidden', marginBottom: 10 }}>
            <div style={{ height: '100%', width: `${it.score}%`, background: it.color, borderRadius: 2, transition: 'width 0.7s cubic-bezier(.2,.8,.2,1)' }} />
          </div>
          <div style={{ fontSize: 11.5, color: T.muted, fontWeight: 500 }}>{it.hint}</div>
        </div>
      ))}
    </div>
  );
}

// ── STRENGTHS COLUMN ──────────────────────────────────────────────
function StrengthsColumn() {
  const strengths = [
    { label: 'React',         sub: 'Mentioned 6 times — strong signal' },
    { label: 'TypeScript',    sub: 'Match · in your top skills' },
    { label: 'REST APIs',     sub: 'Match · across 3 projects' },
    { label: 'Git workflow',  sub: 'Match · solid baseline' },
    { label: 'Clean format',  sub: 'Resume passes ATS parse' },
  ];
  return (
    <div>
      <SectionEyebrow>What's already working</SectionEyebrow>
      <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'hidden' }}>
        {strengths.map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 18px',
            borderTop: i === 0 ? 'none' : `1px solid ${T.borderSoft}`,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: T.green, color: '#fff', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 10px ${T.green}30`,
            }}>
              <TIcon name="check" size={11} color="#fff" sw={3} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: T.dark, marginBottom: 2, letterSpacing: '-0.1px' }}>{s.label}</div>
              <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── GAPS COLUMN ──────────────────────────────────────────────────
function GapsColumn({ required, preferred }) {
  return (
    <div>
      <SectionEyebrow>What's missing from the JD</SectionEyebrow>

      <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 14, padding: 24 }}>
        {/* Required */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: T.coral }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: T.dark, letterSpacing: '-0.1px' }}>
              Required ({required.length})
            </span>
            <span style={{ fontSize: 11.5, color: T.muted, fontWeight: 500 }}>· these block the screen if missing</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {required.map(s => <ImprovedChip key={s.id} skill={s} kind="required" />)}
          </div>
        </div>

        {/* divider */}
        <div style={{ height: 1, background: T.borderSoft, margin: '0 -4px 22px' }} />

        {/* Preferred */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: T.brand }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: T.dark, letterSpacing: '-0.1px' }}>
              Preferred ({preferred.length})
            </span>
            <span style={{ fontSize: 11.5, color: T.muted, fontWeight: 500 }}>· lift you above other applicants</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {preferred.map(s => <ImprovedChip key={s.id} skill={s} kind="preferred" />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function ImprovedChip({ skill, kind }) {
  const isReq = kind === 'required';
  const bg = isReq ? T.coralLight : T.brandLight;
  const fg = isReq ? T.coralDark : T.brand;
  const border = isReq ? '#FDD3C6' : '#DDD9F8';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 12px',
      background: bg, color: fg,
      borderRadius: 8,
      fontSize: 13, fontWeight: 600,
      border: `1px solid ${border}`,
    }}>
      <span>{skill.name}</span>
      {skill.weeks <= 2 && (
        <span style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.7 }}>
          · {skill.weeks}wk
        </span>
      )}
    </div>
  );
}

// ── DECISION MOMENT ───────────────────────────────────────────────
function DecisionMoment({ score, projected, onQuick, onSmart }) {
  return (
    <div>
      <SectionEyebrow>Close the gap</SectionEyebrow>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 20 }}>
        <h2 style={{
          fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700,
          fontSize: 'clamp(24px, 2.6vw, 32px)', letterSpacing: '-1px',
          color: T.dark, margin: 0, lineHeight: 1.1, maxWidth: 720, textWrap: 'balance',
        }}>
          How should we tailor your resume?
        </h2>
      </div>
      <p style={{ fontSize: 14.5, color: T.body, margin: '0 0 32px', maxWidth: 620, lineHeight: 1.55 }}>
        Both options open the editor with all changes prefilled — every edit is highlighted and you can accept or reject any of them. The right pick depends on how much time you have and how honestly you want to frame your gaps.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <DecisionCard
          variant="quick"
          icon="bolt"
          eyebrow="The fast way"
          title="Quick Tailor"
          time="~5 seconds"
          desc="We add every missing keyword to your skills section automatically. Good when you just need 'good enough', fast."
          projectedJump={`${score} → ${projected}`}
          ctaLabel="Quick Tailor"
          onClick={onQuick}
        />
        <DecisionCard
          variant="smart"
          icon="target"
          eyebrow="The honest way"
          title="Smart Tailor"
          time="~2 minutes"
          desc="Review each missing skill. 'Have it' goes in skills, 'Learning' weaves into your summary — so nothing on your resume is dishonest."
          projectedJump={`${score} → ${projected - 3}`}
          ctaLabel="Smart Tailor"
          recommended
          onClick={onSmart}
        />
      </div>
    </div>
  );
}

function DecisionCard({ variant, icon, eyebrow, title, time, desc, projectedJump, ctaLabel, recommended, onClick }) {
  const [hov, setHov] = React.useState(false);
  const isSmart = variant === 'smart';
  const accent = isSmart ? T.brand : T.coral;
  const accentLight = isSmart ? T.brandLight : T.coralLight;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', cursor: 'pointer',
        background: T.bg,
        border: `1.5px solid ${hov ? accent : T.border}`,
        borderRadius: 18, padding: '28px 28px 24px',
        transition: 'all 0.25s cubic-bezier(.2,.8,.2,1)',
        transform: hov ? 'translateY(-3px)' : 'none',
        boxShadow: hov ? `0 24px 50px ${accent}22, 0 0 0 5px ${accent}0F` : 'none',
        display: 'flex', flexDirection: 'column',
        textAlign: 'left', fontFamily: 'inherit',
        minHeight: 280,
      }}>
      {recommended && (
        <div style={{
          position: 'absolute', top: -11, right: 20,
          background: T.dark, color: '#fff',
          padding: '5px 11px', borderRadius: 999,
          fontSize: 10.5, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase',
          boxShadow: `0 6px 16px ${T.dark}30`,
        }}>
          Recommended
        </div>
      )}

      {/* Top row — icon + eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: accentLight,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.25s',
          transform: hov ? 'scale(1.08)' : 'none',
        }}>
          <TIcon name={icon} size={22} color={accent} sw={1.9} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: T.muted, fontSize: 12, fontWeight: 600 }}>
          <TIcon name="clock" size={12} color={T.muted} />
          {time}
        </div>
      </div>

      {/* Eyebrow */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase', color: accent, marginBottom: 8 }}>
        {eyebrow}
      </div>

      {/* Title */}
      <div style={{
        fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 26,
        color: T.dark, letterSpacing: '-0.8px', marginBottom: 10,
      }}>{title}</div>

      {/* Description */}
      <p style={{ fontSize: 14, color: T.body, lineHeight: 1.55, margin: '0 0 22px' }}>{desc}</p>

      {/* Projected jump */}
      <div style={{
        marginTop: 'auto', paddingTop: 18, borderTop: `1px solid ${T.borderSoft}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '1.4px', textTransform: 'uppercase', color: T.muted, marginBottom: 4 }}>Projected score</div>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 22, color: accent, letterSpacing: '-0.6px', lineHeight: 1 }}>
            {projectedJump}
          </div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          background: accent, color: '#fff',
          padding: '11px 18px', borderRadius: 10,
          fontSize: 13.5, fontWeight: 700,
          boxShadow: hov ? `0 10px 24px ${accent}55` : `0 4px 14px ${accent}35`,
          transition: 'box-shadow 0.25s',
          whiteSpace: 'nowrap',
        }}>
          {ctaLabel}
          <TIcon name="arrow" size={13} color="#fff" sw={2.4} />
        </div>
      </div>
    </button>
  );
}

function ScoreCard() {
  const score = 67;
  const r = 70;
  const c = 2 * Math.PI * r;
  const dash = c * (score / 100);

  return (
    <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${T.coral}, ${T.amber}, ${T.green})` }} />
      <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: T.muted, marginBottom: 16, marginTop: 4 }}>ATS Score</div>
      <div style={{ position: 'relative', width: 180, height: 180 }}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r={r} fill="none" stroke={T.borderSoft} strokeWidth="14" />
          <circle cx="90" cy="90" r={r} fill="none" stroke={T.amber} strokeWidth="14" strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`} transform="rotate(-90 90 90)"
            style={{ transition: 'stroke-dasharray 0.8s ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 56, color: T.dark, lineHeight: 1, letterSpacing: '-2px' }}>{score}</div>
          <div style={{ fontSize: 12, color: T.muted, fontWeight: 600, marginTop: 2 }}>out of 100</div>
        </div>
      </div>
      <div style={{ marginTop: 18, padding: '8px 14px', background: T.amberLight, borderRadius: 999, fontSize: 12.5, fontWeight: 700, color: '#92400E' }}>
        Borderline — may pass screen
      </div>
      <div style={{ marginTop: 14, fontSize: 12, color: T.muted, lineHeight: 1.55 }}>
        Aim for <strong style={{ color: T.green }}>85+</strong> to comfortably clear most ATS filters at top companies.
      </div>
    </div>
  );
}

function BreakdownCard() {
  const items = [
    { label: 'Keyword match', score: 58, weight: '40%', color: T.coral, hint: '18 of 31 matched' },
    { label: 'Skills coverage', score: 62, weight: '25%', color: T.amber, hint: '5 required missing' },
    { label: 'Formatting & structure', score: 95, weight: '20%', color: T.green, hint: 'Clean and parseable' },
    { label: 'Experience relevance', score: 78, weight: '15%', color: T.brand, hint: 'Most years relevant' },
  ];
  return (
    <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: T.muted, marginBottom: 4 }}>Where the score comes from</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.dark }}>Score breakdown</div>
        </div>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'transparent', border: 'none', color: T.brand, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
          <TIcon name="eye" size={13} color={T.brand} /> See full method
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {items.map((it, i) => (
          <div key={i}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: T.dark }}>{it.label}</span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: T.muted, marginLeft: 8 }}>weight {it.weight}</span>
              </div>
              <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 16, color: it.color }}>{it.score}<span style={{ fontSize: 11, color: T.muted, fontWeight: 600 }}>/100</span></span>
            </div>
            <div style={{ height: 6, background: T.borderSoft, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${it.score}%`, background: it.color, borderRadius: 3, transition: 'width 0.6s' }} />
            </div>
            <div style={{ fontSize: 11.5, color: T.muted, marginTop: 5, fontWeight: 500 }}>{it.hint}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MissingKeywordsCard() {
  const required = MOCK_MISSING.filter(m => m.type === 'required');
  const preferred = MOCK_MISSING.filter(m => m.type === 'preferred');
  return (
    <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18, gap: 16 }}>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: T.muted, marginBottom: 4 }}>The gap</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: T.dark, letterSpacing: '-0.3px' }}>{MOCK_MISSING.length} skills the JD asks for that aren't on your resume</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.coral }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: T.dark, letterSpacing: '-0.1px' }}>Required ({required.length})</span>
            <span style={{ fontSize: 11.5, color: T.muted, fontWeight: 500 }}>· these block the screen if missing</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {required.map(s => <KeywordChip key={s.id} skill={s} kind="required" />)}
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.brand }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: T.dark, letterSpacing: '-0.1px' }}>Preferred ({preferred.length})</span>
            <span style={{ fontSize: 11.5, color: T.muted, fontWeight: 500 }}>· nice-to-have, lift you above other applicants</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {preferred.map(s => <KeywordChip key={s.id} skill={s} kind="preferred" />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function KeywordChip({ skill, kind }) {
  const isReq = kind === 'required';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 11px',
      background: isReq ? T.coralLight : T.brandLight,
      color: isReq ? T.coralDark : T.brand,
      borderRadius: 7,
      fontSize: 12.5, fontWeight: 600,
      border: `1px solid ${isReq ? '#FECACA' : T.brandLight}`,
    }}>
      {skill.name}
    </div>
  );
}

function DecisionPanel({ onQuick, onSmart }) {
  return (
    <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <TIcon name="wand" size={16} color={T.coral} sw={1.8} />
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: T.coral }}>Close the gap</div>
      </div>
      <div style={{ fontSize: 19, fontWeight: 700, color: T.dark, letterSpacing: '-0.3px', marginBottom: 6 }}>How should we tailor your resume?</div>
      <p style={{ fontSize: 13.5, color: T.body, lineHeight: 1.55, margin: '0 0 22px', maxWidth: 580 }}>
        Both options open the editor with changes pre-filled — you can still tweak anything. Pick the one that fits how much time you have.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <ActionCard
          variant="quick"
          icon="bolt"
          title="Quick Tailor"
          time="~5 seconds"
          desc="We add every missing keyword into your skills section automatically. Fastest path to a 'good enough' tailored resume."
          bullets={['Auto-injects all missing skills', 'No review needed', 'You can edit anything afterwards']}
          caveat="May add skills you don't fully have"
          ctaLabel="Quick Tailor"
          onClick={onQuick}
        />
        <ActionCard
          variant="smart"
          icon="target"
          title="Smart Tailor"
          time="~2 minutes"
          desc="Review each missing skill and tell us how to handle it. We weave 'learning' skills naturally into your summary, not your skills list."
          bullets={['You decide skill-by-skill', 'Honest framing: have / learning / skip', 'See live ATS impact as you go']}
          caveat="Slightly slower, much more authentic"
          ctaLabel="Smart Tailor"
          recommended
          onClick={onSmart}
        />
      </div>
    </div>
  );
}

function ActionCard({ variant, icon, title, time, desc, bullets, caveat, ctaLabel, recommended, onClick }) {
  const [hov, setHov] = React.useState(false);
  const isSmart = variant === 'smart';
  const accent = isSmart ? T.brand : T.coral;
  const accentBg = isSmart ? T.brandLight : T.coralLight;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', cursor: 'pointer',
        background: hov ? (isSmart ? T.brandSoft : '#FFF6F2') : T.bgSoft,
        border: `1.5px solid ${hov ? accent : T.border}`,
        borderRadius: 14, padding: 22,
        transition: 'all 0.18s',
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? `0 10px 28px ${accent}1F` : 'none',
        display: 'flex', flexDirection: 'column',
      }}>
      {recommended && (
        <div style={{
          position: 'absolute', top: -10, right: 16,
          background: T.dark, color: '#fff',
          padding: '4px 10px', borderRadius: 999,
          fontSize: 10.5, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase',
        }}>
          Recommended
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TIcon name={icon} size={18} color={accent} sw={1.9} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: T.muted, fontSize: 12, fontWeight: 600 }}>
          <TIcon name="clock" size={12} color={T.muted} />
          {time}
        </div>
      </div>

      <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 22, color: T.dark, letterSpacing: '-0.5px', marginBottom: 6 }}>{title}</div>
      <p style={{ fontSize: 13.5, color: T.body, lineHeight: 1.55, margin: '0 0 14px' }}>{desc}</p>

      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {bullets.map((b, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, color: T.body }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
              <TIcon name="check" size={9} color={accent} sw={2.6} />
            </div>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div style={{ fontSize: 11.5, color: T.muted, lineHeight: 1.5, marginBottom: 18, fontStyle: 'italic' }}>
        {caveat}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={(e) => { e.stopPropagation(); onClick(); }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: isSmart ? T.brand : T.coral, color: '#fff',
            border: 'none', borderRadius: 9,
            padding: '11px 18px', fontSize: 13.5, fontWeight: 700,
            cursor: 'pointer',
            boxShadow: hov ? `0 8px 22px ${accent}55` : `0 4px 12px ${accent}35`,
            transition: 'box-shadow 0.18s, transform 0.18s',
            fontFamily: 'inherit', whiteSpace: 'nowrap',
          }}>
          <TIcon name={icon} size={13} color="#fff" sw={2.2} />
          {ctaLabel}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: accent, whiteSpace: 'nowrap' }}>
          Projected score
          <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 17, color: accent, marginLeft: 4 }}>
            67 → {isSmart ? 88 : 91}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCREEN 2: SMART TAILOR REVIEW
// ─────────────────────────────────────────────────────────────────
function SmartReviewScreen({ onApply, onBack }) {
  // Choice state per skill id: 'have' | 'learning' | 'skip' | undefined
  const [choices, setChoices] = React.useState(() => {
    const o = {};
    MOCK_MISSING.forEach(s => { o[s.id] = s.suggested; });
    return o;
  });
  const [filter, setFilter] = React.useState('all');

  function pick(id, value) {
    setChoices(c => ({ ...c, [id]: value }));
  }
  function pickAllSuggested() {
    const o = {};
    MOCK_MISSING.forEach(s => { o[s.id] = s.suggested; });
    setChoices(o);
  }
  function clearAll() {
    const o = {};
    MOCK_MISSING.forEach(s => { o[s.id] = undefined; });
    setChoices(o);
  }

  const totals = {
    have: Object.values(choices).filter(v => v === 'have').length,
    learning: Object.values(choices).filter(v => v === 'learning').length,
    skip: Object.values(choices).filter(v => v === 'skip').length,
    decided: Object.values(choices).filter(Boolean).length,
  };
  const total = MOCK_MISSING.length;
  const projected = 67 + (totals.have * 3) + (totals.learning * 1);
  const projectedClamped = Math.min(projected, 96);
  const decisionPct = (totals.decided / total) * 100;

  const filtered = MOCK_MISSING.filter(s => {
    if (filter === 'all') return true;
    if (filter === 'required') return s.type === 'required';
    if (filter === 'preferred') return s.type === 'preferred';
    return choices[s.id] === filter;
  });
  filtered.sort((a, b) => {
    if (a.type === b.type) return a.id - b.id;
    return a.type === 'required' ? -1 : 1;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 0, flex: 1, minHeight: 0 }}>
      {/* ===== Main column ===== */}
      <div style={{ overflowY: 'auto', padding: 'clamp(40px, 5vw, 64px) clamp(24px, 4vw, 56px) 100px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>

          {/* Hero */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase', color: T.brand, marginBottom: 14 }}>
              The honest way
            </div>
            <h1 style={{
              fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700,
              fontSize: 'clamp(26px, 3vw, 36px)', letterSpacing: '-1.2px',
              color: T.dark, margin: '0 0 14px', lineHeight: 1.1, textWrap: 'balance',
            }}>
              Decide how to handle each skill.
            </h1>
            <p style={{ fontSize: 15, color: T.body, lineHeight: 1.6, margin: 0, maxWidth: 580 }}>
              <strong style={{ color: T.dark, fontWeight: 700 }}>I have it</strong> goes into your Skills list. <strong style={{ color: T.dark, fontWeight: 700 }}>Learning</strong> weaves into your summary as an aspiration. <strong style={{ color: T.dark, fontWeight: 700 }}>Skip</strong> changes nothing. We've pre-picked sensible defaults — override any.
            </p>
          </div>

          {/* Progress bar — goal-gradient effect */}
          <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, padding: '14px 18px', marginBottom: 26, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 18, color: T.dark, letterSpacing: '-0.4px' }}>{totals.decided}</span>
                <span style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>of {total} skills reviewed</span>
              </div>
              <div style={{ height: 4, background: T.borderSoft, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${decisionPct}%`, background: `linear-gradient(90deg, ${T.brand}, ${T.coral})`, borderRadius: 2, transition: 'width 0.5s cubic-bezier(.2,.8,.2,1)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={pickAllSuggested} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '8px 12px', borderRadius: 8,
                background: T.brandLight, color: T.brand,
                border: 'none', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = T.brand; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = T.brandLight; e.currentTarget.style.color = T.brand; }}>
                <TIcon name="sparkle" size={12} color="currentColor" /> Use AI picks
              </button>
              <button onClick={clearAll} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '8px 12px', borderRadius: 8,
                background: 'transparent', color: T.muted,
                border: `1px solid ${T.border}`, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = T.dark; e.currentTarget.style.borderColor = T.dark; }}
                onMouseLeave={e => { e.currentTarget.style.color = T.muted; e.currentTarget.style.borderColor = T.border; }}>
                <TIcon name="refresh" size={11} color="currentColor" /> Reset
              </button>
            </div>
          </div>

          {/* Filter tabs — slim underline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20, borderBottom: `1px solid ${T.border}`, paddingBottom: 0, overflowX: 'auto' }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'required', label: 'Required', dot: T.coral },
              { id: 'preferred', label: 'Preferred', dot: T.brand },
              { id: 'have', label: 'I have', dot: T.green },
              { id: 'learning', label: 'Learning', dot: T.amber },
              { id: 'skip', label: 'Skipped', dot: T.muted2 },
            ].map(f => {
              const count = f.id === 'all' ? total
                : f.id === 'required' ? MOCK_MISSING.filter(s => s.type === 'required').length
                : f.id === 'preferred' ? MOCK_MISSING.filter(s => s.type === 'preferred').length
                : totals[f.id] || 0;
              const active = filter === f.id;
              return (
                <button key={f.id} onClick={() => setFilter(f.id)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: 'transparent', border: 'none',
                  padding: '11px 14px', position: 'relative',
                  color: active ? T.dark : T.muted,
                  fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                  borderBottom: `2px solid ${active ? T.dark : 'transparent'}`,
                  marginBottom: -1,
                  transition: 'color 0.15s, border-color 0.15s',
                }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = T.dark; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = T.muted; }}>
                  {f.dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: f.dot }} />}
                  {f.label}
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    background: active ? T.dark : T.bgSoft,
                    color: active ? '#fff' : T.muted,
                    padding: '1px 7px', borderRadius: 999,
                  }}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.length === 0 && (
              <div style={{ padding: 60, textAlign: 'center', background: T.bgSoft, border: `1px dashed ${T.border}`, borderRadius: 12, color: T.muted, fontSize: 14 }}>
                Nothing matches this filter yet.
              </div>
            )}
            {filtered.map(skill => (
              <SkillReviewCard key={skill.id} skill={skill} choice={choices[skill.id]} onPick={(v) => pick(skill.id, v)} />
            ))}
          </div>

          {/* Honesty nudge — elevated to a real callout */}
          <div style={{ marginTop: 28, padding: '18px 20px', background: `linear-gradient(135deg, ${T.brandSoft} 0%, ${T.bg} 100%)`, border: `1px solid ${T.brandLight}`, borderRadius: 14, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: T.brand, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <TIcon name="bulb" size={16} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.dark, marginBottom: 4, letterSpacing: '-0.1px' }}>A note on honesty</div>
              <div style={{ fontSize: 13, color: T.body, lineHeight: 1.55 }}>
                Recruiters often verify skills in interviews. Marking a skill you don't actually have as <strong>“I have it”</strong> can backfire — <strong>“I'm learning it”</strong> is safer, still helps your ATS, and shows initiative.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Sticky impact sidebar ===== */}
      <ImpactSidebar totals={totals} projected={projectedClamped} total={total} onApply={onApply} />
    </div>
  );
}

function bulkBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '6px 10px', borderRadius: 7,
    background: T.bg, border: `1px solid ${T.border}`,
    fontSize: 11.5, fontWeight: 600, color: T.body,
    cursor: 'pointer', fontFamily: 'inherit',
  };
}

function SkillReviewCard({ skill, choice, onPick }) {
  const isReq = skill.type === 'required';
  return (
    <div style={{
      background: T.bg,
      border: `1.5px solid ${choice ? colorForChoice(choice, 0.4) : T.border}`,
      borderRadius: 14, padding: '18px 20px',
      display: 'flex', flexDirection: 'column', gap: 14,
      transition: 'border-color 0.18s, box-shadow 0.18s, transform 0.18s',
      boxShadow: choice ? `0 0 0 4px ${colorForChoice(choice, 0.10)}` : 'none',
    }}>
      {/* Top row: type tag + skill name + meta on right */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', rowGap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: '1 1 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 9px', borderRadius: 6,
            background: isReq ? T.coralLight : T.brandLight,
            color: isReq ? T.coralDark : T.brand,
            fontSize: 10, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase',
            flexShrink: 0,
          }}>
            {isReq ? 'Required' : 'Preferred'}
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: T.dark, letterSpacing: '-0.3px', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skill.name}</div>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.muted, whiteSpace: 'nowrap', flexShrink: 0 }}>
          <TIcon name="clock" size={12} color={T.muted} />
          ~{skill.weeks} {skill.weeks === 1 ? 'week' : 'weeks'} to interview-ready
        </div>
      </div>

      {/* AI suggestion row — own line */}
      {skill.why && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 12.5, color: T.body, lineHeight: 1.5,
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: T.brandLight, color: T.brand,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <TIcon name="sparkle" size={11} color={T.brand} />
          </div>
          <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <span style={{ color: T.muted }}>AI suggests </span>
            <strong style={{ color: T.dark, fontWeight: 700 }}>“{labelFor(skill.suggested)}”</strong>
            <span style={{ color: T.muted }}> — {skill.why}</span>
          </span>
        </div>
      )}

      {/* Choice buttons — own row, full width */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
        <ChoiceButton choice="have" current={choice} onClick={() => onPick('have')}>
          <TIcon name="check" size={13} color={choice === 'have' ? '#fff' : T.green} sw={2.4} />
          I have it
        </ChoiceButton>
        <ChoiceButton choice="learning" current={choice} onClick={() => onPick('learning')}>
          <TIcon name="seedling" size={13} color={choice === 'learning' ? '#fff' : T.amber} sw={1.8} />
          Learning
        </ChoiceButton>
        <ChoiceButton choice="skip" current={choice} onClick={() => onPick('skip')}>
          <TIcon name="x" size={12} color={choice === 'skip' ? '#fff' : T.muted} sw={2.4} />
          Skip
        </ChoiceButton>
      </div>
    </div>
  );
}

function ChoiceButton({ choice, current, onClick, children }) {
  const active = current === choice;
  const colors = {
    have: { bg: T.green, text: T.green, light: T.greenLight, border: '#BBF7D0' },
    learning: { bg: T.amber, text: '#92400E', light: T.amberLight, border: '#FDE68A' },
    skip: { bg: T.muted, text: T.muted, light: T.bgSoft, border: T.border },
  }[choice];
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: '11px 14px', borderRadius: 10,
      background: active ? colors.bg : colors.light,
      color: active ? '#fff' : colors.text,
      border: `1.5px solid ${active ? colors.bg : colors.border}`,
      fontSize: 13, fontWeight: 700, cursor: 'pointer',
      transition: 'all 0.18s', fontFamily: 'inherit', whiteSpace: 'nowrap',
      boxShadow: active ? `0 4px 14px ${colorForChoice(choice, 0.30)}` : 'none',
    }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = colors.bg; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = colors.border; } }}>
      {children}
    </button>
  );
}

function labelFor(v) {
  return ({ have: 'I have it', learning: "I'm learning it", skip: 'Skip' })[v] || v;
}
function colorForChoice(v, alpha = 1) {
  const map = {
    have: `rgba(22, 163, 74, ${alpha})`,
    learning: `rgba(245, 158, 11, ${alpha})`,
    skip: `rgba(136, 136, 165, ${alpha})`,
  };
  return map[v] || T.border;
}

function ImpactSidebar({ totals, projected, total, onApply }) {
  const deltaHave = totals.have;
  const deltaLearn = totals.learning;
  const score = 67;
  const delta = projected - score;
  const changes = deltaHave + deltaLearn;

  return (
    <aside style={{
      background: T.bg, borderLeft: `1px solid ${T.border}`,
      padding: 'clamp(28px, 3vw, 36px) clamp(24px, 2.5vw, 32px)',
      position: 'sticky', top: 0,
      height: '100vh', display: 'flex', flexDirection: 'column', gap: 28,
      overflowY: 'auto',
    }}>
      {/* ===== PROJECTED SCORE ===== */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase', color: T.muted, marginBottom: 14 }}>
          Projected impact
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <div style={{
            fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800,
            fontSize: 64, color: T.dark, letterSpacing: '-2.5px', lineHeight: 0.9,
          }}>{projected}</div>
          <div style={{ paddingBottom: 6 }}>
            <div style={{ fontSize: 12, color: T.muted, fontWeight: 600, marginBottom: 4 }}>/ 100</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              padding: '3px 9px', borderRadius: 999,
              background: delta > 0 ? T.greenLight : T.bgSoft,
              color: delta > 0 ? T.greenDark : T.muted,
              fontSize: 11.5, fontWeight: 700,
            }}>
              {delta >= 0 ? '+' : ''}{delta} pts
            </div>
          </div>
        </div>

        {/* Mini score bar showing journey */}
        <div style={{ marginTop: 18 }}>
          <div style={{ position: 'relative', height: 6, background: T.borderSoft, borderRadius: 3 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${score}%`, background: T.muted2, borderRadius: 3 }} />
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${projected}%`, background: `linear-gradient(90deg, ${T.brand}, ${T.coral})`, borderRadius: 3, transition: 'width 0.5s cubic-bezier(.2,.8,.2,1)' }} />
            <div style={{ position: 'absolute', left: '85%', top: -3, width: 2, height: 12, background: T.green, borderRadius: 1 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: T.muted, fontWeight: 600, marginTop: 8 }}>
            <span>Was <strong style={{ color: T.body, fontWeight: 700 }}>{score}</strong></span>
            <span style={{ color: T.green }}>Target 85+</span>
          </div>
        </div>
      </div>

      {/* ===== WHAT WILL CHANGE ===== */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase', color: T.muted, marginBottom: 14 }}>
          What will change
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <ImpactRow color={T.green}  icon="check"     count={deltaHave}  label="added to Skills"     sub="As direct skill chips" />
          <ImpactRow color={T.amber}  icon="seedling"  count={deltaLearn} label="woven into Summary"  sub="As learning aspirations" />
          <ImpactRow color={T.muted2} icon="x"         count={totals.skip} label="skipped"            sub="No changes for these" />
        </div>
      </div>

      {/* ===== LIVE SUMMARY PREVIEW ===== */}
      <div style={{ background: T.bgSoft, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
          <TIcon name="eye" size={12} color={T.brand} />
          <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '1.4px', textTransform: 'uppercase', color: T.brand }}>Summary preview</span>
        </div>
        <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: T.dark, lineHeight: 1.6 }}>
          Frontend engineer with 4 years building React applications…
          {deltaLearn > 0 && <span style={{ background: T.amberLight, color: '#92400E', padding: '1px 4px', borderRadius: 3, marginLeft: 4, fontWeight: 600 }}>
            Currently exploring {previewLearningSkills(deltaLearn)}.
          </span>}
        </div>
      </div>

      {/* ===== CTA ===== */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button onClick={onApply}
          disabled={changes === 0}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: changes > 0 ? T.coral : T.muted2, color: '#fff',
            border: 'none', borderRadius: 12,
            padding: '15px 20px', fontSize: 14.5, fontWeight: 700, letterSpacing: '-0.1px',
            cursor: changes > 0 ? 'pointer' : 'not-allowed',
            boxShadow: changes > 0 ? `0 10px 28px ${T.coral}45` : 'none',
            transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => { if (changes > 0) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 16px 36px ${T.coral}60`; } }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = changes > 0 ? `0 10px 28px ${T.coral}45` : 'none'; }}
        >
          {changes > 0 ? <>Apply {changes} changes<TIcon name="arrow" size={14} color="#fff" sw={2.2} /></> : 'Pick at least one skill'}
        </button>
        <div style={{ fontSize: 11.5, color: T.muted, textAlign: 'center', lineHeight: 1.55 }}>
          Every edit will be highlighted in the editor — accept, reject, or rewrite each one.
        </div>
      </div>
    </aside>
  );
}

function ImpactRow({ color, icon, count, label, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0' }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `${color}1A`, color,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        transition: 'background 0.2s',
      }}>
        <TIcon name={icon} size={15} color={color} sw={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: T.dark, letterSpacing: '-0.1px' }}>
          <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 17, marginRight: 5, color }}>{count}</span>
          {label}
        </div>
        <div style={{ fontSize: 11.5, color: T.muted, marginTop: 2, fontWeight: 500 }}>{sub}</div>
      </div>
    </div>
  );
}

function previewLearningSkills(count) {
  const examples = ['Next.js', 'GraphQL', 'Cypress', 'Jest', 'Storybook'];
  return examples.slice(0, Math.min(count, 2)).join(' and ');
}

// ── Closing screen (between tailor and editor) ──────────────────
function OpeningEditor() {
  React.useEffect(() => {
    const t = setTimeout(() => { window.location.href = 'CareerForgePro Editor.html'; }, 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: T.brandLight, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, animation: 'pulse-glow 1.4s ease-in-out infinite' }}>
          <TIcon name="sparkle" size={24} color={T.brand} />
        </div>
        <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 24, color: T.dark, letterSpacing: '-0.5px', marginBottom: 6 }}>Applying your changes…</div>
        <div style={{ fontSize: 14, color: T.muted }}>Opening the editor — every edit will be highlighted for review.</div>
      </div>
    </div>
  );
}

Object.assign(window, {
  T, TIcon, TLogo, MOCK_JOB, MOCK_GAPS, MOCK_MISSING, SAVED_RESUMES,
  TailorFlow, TailorHeader,
  InputScreen, StepBlock, Segmented, SavedResumeCard, UploadBox, UrlInput, ReadinessIndicator, AnalyzingScreen,
  ReportScreen, ScoreCard, BreakdownCard, MissingKeywordsCard, KeywordChip, DecisionPanel, ActionCard,
  SmartReviewScreen, SkillReviewCard, ChoiceButton, ImpactSidebar, ImpactRow,
  OpeningEditor,
});
