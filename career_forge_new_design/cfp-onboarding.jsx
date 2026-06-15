// CareerForgePro — Onboarding flow
// Conversational, one question at a time. Skippable optional fields.
// AI Assist sidekick + smart suggestions for skills.

const O = {
  brand: '#5046E4', brandDark: '#3730D0', brandLight: '#EEEDFF', brandSoft: '#F4F2FF',
  coral: '#FF5C35', coralLight: '#FFF1ED',
  dark: '#0F0E2A', body: '#44445A', muted: '#8888A5', muted2: '#B5B5C8',
  border: '#E8E6F4', borderSoft: '#F0EEF9',
  bg: '#FFFFFF', bgSoft: '#F7F6FF',
  green: '#16A34A', greenLight: '#F0FDF4',
};

function OIcon({ name, size = 18, color = 'currentColor', sw = 1.7 }) {
  const paths = {
    arrow: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    arrowL: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    check: <><polyline points="5 12 10 17 20 7"/></>,
    x: <><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    sparkle: <><path d="M12 3l1.5 5L19 9.5 13.5 11 12 16l-1.5-5L5 9.5 10.5 8z"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></>,
    phone: <><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z"/></>,
    pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>,
    link: <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></>,
    cap: <><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></>,
    code: <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
    edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    refresh: <><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></>,
    bot: <><rect x="3" y="8" width="18" height="12" rx="2"/><circle cx="9" cy="14" r="1.2" fill="currentColor"/><circle cx="15" cy="14" r="1.2" fill="currentColor"/><line x1="12" y1="3" x2="12" y2="8"/><circle cx="12" cy="3" r="1.2" fill="currentColor"/></>,
    send: <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    help: <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    chevron: <><polyline points="6 9 12 15 18 9"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>{paths[name]}</svg>;
}

function OLogo() {
  return (
    <a href="CareerForgePro%20App.html" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
      <div style={{ width: 30, height: 30, background: O.brand, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 11L5 6L7.5 8.5L10 4L12.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 16, color: O.dark, letterSpacing: '-0.3px' }}>CareerForgePro</span>
    </a>
  );
}

// ── STEPS DEFINITION ─────────────────────────────────────────────
const STEPS = [
  { id: 'name',      label: 'Name',      required: true,  multi: false },
  { id: 'contact',   label: 'Contact',   required: true,  multi: false },
  { id: 'location',  label: 'Location',  required: false, multi: false, skippable: true },
  { id: 'links',     label: 'Links',     required: false, multi: false, skippable: true },
  { id: 'education', label: 'Education', required: true,  multi: true },
  { id: 'skills',    label: 'Skills',    required: false, multi: false, skippable: true },
  { id: 'review',    label: 'Review',    required: true,  multi: false },
];

// ── ROOT ────────────────────────────────────────────────────────
function Onboarding({ template = 'modern' }) {
  const [stepIdx, setStepIdx] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [data, setData] = React.useState({
    name: '', email: '', phone: '',
    location: '',
    linkedin: '', github: '', portfolio: '',
    education: [],
    skills: [],
    objective: '',
    headline: '',
  });
  const [askAi, setAskAi] = React.useState({ open: false, field: null });

  // Visible steps = all minus skipped
  const visibleSteps = STEPS.filter(s => !skipped.has(s.id));
  const currentStep = STEPS[stepIdx];
  const visibleIdx = visibleSteps.findIndex(s => s.id === currentStep.id);

  function go(delta) {
    let next = stepIdx + delta;
    while (next >= 0 && next < STEPS.length && skipped.has(STEPS[next].id)) next += delta;
    if (next < 0) next = 0;
    if (next >= STEPS.length) next = STEPS.length - 1;
    setStepIdx(next);
  }

  function skip() {
    setSkipped(s => new Set([...s, currentStep.id]));
    go(1);
  }

  const update = (patch) => setData(d => ({ ...d, ...patch }));

  // Validation per step → controls Continue enable
  const canContinue = (() => {
    if (currentStep.id === 'name') return !!data.name.trim();
    if (currentStep.id === 'contact') return /\S+@\S+\.\S+/.test(data.email);
    if (currentStep.id === 'location') return true;
    if (currentStep.id === 'links') return true;
    if (currentStep.id === 'education') return data.education.length > 0;
    if (currentStep.id === 'skills') return true;
    if (currentStep.id === 'review') return true;
    return true;
  })();

  return (
    <div style={{ minHeight: '100vh', background: O.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient bg accent */}
      <div style={{ position: 'absolute', top: -300, left: '50%', transform: 'translateX(-50%)', width: 1200, height: 600, background: `radial-gradient(ellipse at center, ${O.brand}08 0%, transparent 60%)`, pointerEvents: 'none' }} />

      <OnboardingHeader visibleSteps={visibleSteps} visibleIdx={visibleIdx} onExit={() => { window.location.href = 'CareerForgePro App.html'; }} />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px 140px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 640, position: 'relative' }}>
          {/* Cinematic step numeral — sits behind content */}
          <div aria-hidden style={{
            position: 'absolute',
            top: -50, left: -20,
            fontFamily: "'Bricolage Grotesque',sans-serif",
            fontWeight: 800, fontSize: 'clamp(160px, 18vw, 240px)',
            lineHeight: 0.8, letterSpacing: '-8px',
            color: O.brand, opacity: 0.04,
            pointerEvents: 'none', userSelect: 'none', zIndex: 0,
          }}>
            {String(visibleIdx + 1).padStart(2, '0')}
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <StepView
              step={currentStep}
              data={data}
              update={update}
              onAskAi={(field) => setAskAi({ open: true, field })}
              onAddEducationDone={() => {/* trigger continue */}}
              visibleIdx={visibleIdx}
              totalVisible={visibleSteps.length}
              onContinue={() => stepIdx < STEPS.length - 1 ? go(1) : null}
            />
          </div>
        </div>
      </main>

      <OnboardingFooter
        canBack={stepIdx > 0}
        canContinue={canContinue}
        canSkip={!!currentStep.skippable && currentStep.id !== 'review'}
        isLast={currentStep.id === 'review'}
        onBack={() => go(-1)}
        onSkip={skip}
        onContinue={() => stepIdx < STEPS.length - 1 ? go(1) : (window.location.href = 'CareerForgePro Editor.html')}
      />

      {askAi.open && (
        <AskAiPanel
          field={askAi.field}
          data={data}
          onClose={() => setAskAi({ open: false, field: null })}
        />
      )}
    </div>
  );
}

// ── HEADER (logo + progress + exit) ─────────────────────────────
function OnboardingHeader({ visibleSteps, visibleIdx, onExit }) {
  return (
    <header style={{ padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', position: 'sticky', top: 0, zIndex: 10 }}>
      <OLogo />

      {/* Progress dots */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        {visibleSteps.map((s, i) => (
          <div key={s.id} style={{
            width: i === visibleIdx ? 32 : (i < visibleIdx ? 10 : 10),
            height: 3, borderRadius: 2,
            background: i < visibleIdx ? O.brand : (i === visibleIdx ? O.dark : O.border),
            transition: 'all 0.5s cubic-bezier(.4,0,.2,1)',
          }} />
        ))}
        <span style={{ marginLeft: 14, fontSize: 12, color: O.muted, fontWeight: 600, letterSpacing: '0.3px' }}>
          {visibleIdx + 1} / {visibleSteps.length}
        </span>
      </div>

      <button onClick={onExit} style={{ background: 'none', border: 'none', color: O.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '8px 14px', borderRadius: 6 }}
        onMouseEnter={e => { e.currentTarget.style.color = O.dark; }}
        onMouseLeave={e => { e.currentTarget.style.color = O.muted; }}>
        Save & exit
      </button>
    </header>
  );
}

// ── FOOTER (back / skip / continue) ─────────────────────────────
function OnboardingFooter({ canBack, canContinue, canSkip, isLast, onBack, onSkip, onContinue }) {
  return (
    <footer style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '24px 40px', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, pointerEvents: 'none' }}>
      <button onClick={onBack} disabled={!canBack} style={{
        pointerEvents: 'auto',
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 18px',
        background: 'transparent', color: canBack ? O.dark : O.muted2, border: 'none',
        fontSize: 14, fontWeight: 600, cursor: canBack ? 'pointer' : 'not-allowed', borderRadius: 8,
        opacity: canBack ? 1 : 0.4, transition: 'opacity 0.2s, transform 0.2s',
      }}
        onMouseEnter={e => { if (canBack) e.currentTarget.style.transform = 'translateX(-3px)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; }}>
        <OIcon name="arrowL" size={14} sw={2.2} color={canBack ? O.dark : O.muted2} /> Back
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, pointerEvents: 'auto' }}>
        {canSkip && (
          <button onClick={onSkip} style={{
            background: 'none', border: 'none', color: O.muted, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', padding: '12px 14px', borderRadius: 8,
          }}
            onMouseEnter={e => { e.currentTarget.style.color = O.dark; }}
            onMouseLeave={e => { e.currentTarget.style.color = O.muted; }}>
            Skip for now
          </button>
        )}
        <ContinueButton onClick={onContinue} disabled={!canContinue} isLast={isLast} />
      </div>
    </footer>
  );
}

function ContinueButton({ onClick, disabled, isLast }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        background: disabled ? O.muted2 : O.coral, color: '#fff', border: 'none',
        padding: '15px 28px', fontSize: 14.5, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
        borderRadius: 12, letterSpacing: '-0.1px',
        boxShadow: disabled ? 'none' : (hov ? `0 14px 36px ${O.coral}55` : `0 8px 24px ${O.coral}38`),
        transform: !disabled && hov ? 'translateY(-2px)' : 'none',
        transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
      }}>
      {isLast ? 'Open in editor' : 'Continue'}
      <OIcon name="arrow" size={15} sw={2.4} color="#fff" />
    </button>
  );
}

// ── STEP VIEW ROUTER ────────────────────────────────────────────
function StepView({ step, data, update, onAskAi, visibleIdx, totalVisible, onContinue }) {
  return (
    <div key={step.id} style={{ animation: 'step-in 0.55s cubic-bezier(.16,1,.3,1)' }}>
      {step.id === 'name' && <NameStep data={data} update={update} onAskAi={onAskAi} />}
      {step.id === 'contact' && <ContactStep data={data} update={update} onAskAi={onAskAi} />}
      {step.id === 'location' && <LocationStep data={data} update={update} onAskAi={onAskAi} />}
      {step.id === 'links' && <LinksStep data={data} update={update} onAskAi={onAskAi} />}
      {step.id === 'education' && <EducationStep data={data} update={update} onAskAi={onAskAi} />}
      {step.id === 'skills' && <SkillsStep data={data} update={update} onAskAi={onAskAi} />}
      {step.id === 'review' && <ReviewStep data={data} update={update} onAskAi={onAskAi} />}
    </div>
  );
}

// ── SHARED PRIMITIVES ────────────────────────────────────────────
function StepHeader({ eyebrow, title, sub, icon }) {
  return (
    <div style={{ marginBottom: 40 }}>
      {eyebrow && <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase', color: O.brand, marginBottom: 18 }}>{eyebrow}</div>}
      <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 'clamp(28px, 3vw, 38px)', letterSpacing: '-1.2px', color: O.dark, margin: '0 0 14px', lineHeight: 1.1, textWrap: 'balance' }}>{title}</h1>
      {sub && <p style={{ fontSize: 15, color: O.body, lineHeight: 1.55, margin: 0, maxWidth: 500, textWrap: 'pretty' }}>{sub}</p>}
    </div>
  );
}

function BigInput({ value, onChange, placeholder, type = 'text', autoFocus, leftIcon, ariaLabel, onEnter }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      background: O.bg, border: `1.5px solid ${focus ? O.brand : O.border}`, borderRadius: 14,
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxShadow: focus ? `0 0 0 5px ${O.brand}18` : 'none',
    }}>
      {leftIcon && <div style={{ paddingLeft: 18, display: 'flex' }}><OIcon name={leftIcon} size={17} color={focus ? O.brand : O.muted} sw={1.8} /></div>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        autoFocus={autoFocus} aria-label={ariaLabel}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        onKeyDown={(e) => { if (e.key === 'Enter' && onEnter) onEnter(); }}
        style={{ flex: 1, background: 'transparent', border: 'none', padding: leftIcon ? '17px 18px 17px 12px' : '17px 18px', fontSize: 16, color: O.dark, width: '100%', fontWeight: 500 }} />
    </div>
  );
}

function AskAiLink({ field, label = 'Not sure what to put? Ask AI', onAskAi }) {
  return (
    <button onClick={() => onAskAi(field)} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'none', border: 'none', color: O.brand, fontSize: 12.5, fontWeight: 600,
      cursor: 'pointer', padding: '8px 0', marginTop: 4,
    }}
      onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; e.currentTarget.style.textUnderlineOffset = '3px'; }}
      onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}>
      <OIcon name="sparkle" size={13} color={O.brand} />
      {label}
    </button>
  );
}

function FieldLabel({ children }) {
  return <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: O.dark, marginBottom: 7, letterSpacing: '-0.1px' }}>{children}</label>;
}

// ── STEP 1: NAME ─────────────────────────────────────────────────
function NameStep({ data, update, onAskAi }) {
  return (
    <>
      <StepHeader
        eyebrow="The basics"
        title="What should we call you?"
        sub="Your name, as you'd like recruiters to see it at the top of your resume."
      />
      <BigInput value={data.name} onChange={v => update({ name: v })}
        placeholder="Arjun Kapoor" autoFocus leftIcon="user" ariaLabel="Full name" />
    </>
  );
}

// ── STEP 2: CONTACT ──────────────────────────────────────────────
function ContactStep({ data, update, onAskAi }) {
  return (
    <>
      <StepHeader
        eyebrow={data.name ? `Nice to meet you, ${data.name.split(' ')[0]}` : 'How to reach you'}
        title="How can recruiters reach you?"
        sub="Email is required. Phone is optional — most callbacks come via phone, but you can leave it for now."
      />
      <div style={{ display: 'grid', gap: 18 }}>
        <div>
          <FieldLabel>Email <span style={{ color: O.coral, fontWeight: 700 }}>·</span></FieldLabel>
          <BigInput value={data.email} onChange={v => update({ email: v })} type="email"
            placeholder="you@email.com" autoFocus leftIcon="mail" ariaLabel="Email" />
        </div>
        <div>
          <FieldLabel>Phone <span style={{ fontWeight: 500, color: O.muted }}>· optional</span></FieldLabel>
          <BigInput value={data.phone} onChange={v => update({ phone: v })} type="tel"
            placeholder="+91 98765 43210" leftIcon="phone" ariaLabel="Phone" />
        </div>
      </div>
    </>
  );
}

// ── STEP 3: LOCATION ─────────────────────────────────────────────
function LocationStep({ data, update, onAskAi }) {
  const suggestions = ['Bengaluru, India', 'Mumbai, India', 'Hyderabad, India', 'Pune, India', 'Delhi NCR, India', 'Remote'];
  return (
    <>
      <StepHeader
        eyebrow="Where you are"
        title="Where are you based?"
        sub="Many recruiters filter by location. Just a city is fine — or pick 'Remote' if you're open to anywhere."
      />
      <BigInput value={data.location} onChange={v => update({ location: v })}
        placeholder="Bengaluru, India" autoFocus leftIcon="pin" ariaLabel="Location" />
      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: O.muted, marginBottom: 12, letterSpacing: '1.2px', textTransform: 'uppercase' }}>Popular</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => update({ location: s })}
              style={{
                padding: '9px 16px', fontSize: 13.5, fontWeight: 600,
                background: data.location === s ? O.brandLight : O.bg,
                color: data.location === s ? O.brand : O.body,
                border: `1.5px solid ${data.location === s ? O.brand : O.border}`,
                borderRadius: 999, cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (data.location !== s) { e.currentTarget.style.borderColor = O.muted2; } }}
              onMouseLeave={e => { if (data.location !== s) { e.currentTarget.style.borderColor = O.border; } }}>
              {s}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ── STEP 4: LINKS ────────────────────────────────────────────────
function LinksStep({ data, update, onAskAi }) {
  return (
    <>
      <StepHeader
        eyebrow="Show yourself off"
        title="Got any profiles to link?"
        sub="LinkedIn for everyone. GitHub if you code, a portfolio if you've got one. All optional — skip and add later."
      />
      <div style={{ display: 'grid', gap: 14 }}>
        <div>
          <FieldLabel>LinkedIn</FieldLabel>
          <BigInput value={data.linkedin} onChange={v => update({ linkedin: v })}
            placeholder="linkedin.com/in/yourname" leftIcon="link" ariaLabel="LinkedIn URL" />
        </div>
        <div>
          <FieldLabel>GitHub <span style={{ fontWeight: 500, color: O.muted }}>· optional</span></FieldLabel>
          <BigInput value={data.github} onChange={v => update({ github: v })}
            placeholder="github.com/yourname" leftIcon="code" ariaLabel="GitHub URL" />
        </div>
        <div>
          <FieldLabel>Portfolio site <span style={{ fontWeight: 500, color: O.muted }}>· optional</span></FieldLabel>
          <BigInput value={data.portfolio} onChange={v => update({ portfolio: v })}
            placeholder="yourname.com" leftIcon="link" ariaLabel="Portfolio URL" />
        </div>
      </div>
      <AskAiLink field="links" label="What links should I include for my role?" onAskAi={onAskAi} />
    </>
  );
}

// ── STEP 5: EDUCATION (multi-entry) ──────────────────────────────
function EducationStep({ data, update, onAskAi }) {
  const [mode, setMode] = React.useState(data.education.length === 0 ? 'edit' : 'list');
  const [draft, setDraft] = React.useState({ degree: '', field: '', school: '', startYear: '', endYear: '', cgpa: '' });

  function saveEntry() {
    if (!draft.degree.trim() || !draft.school.trim()) return;
    update({ education: [...data.education, { ...draft, id: Date.now() }] });
    setDraft({ degree: '', field: '', school: '', startYear: '', endYear: '', cgpa: '' });
    setMode('list');
  }

  function removeEntry(id) {
    update({ education: data.education.filter(e => e.id !== id) });
  }

  const canSaveDraft = draft.degree.trim() && draft.school.trim();

  return (
    <>
      <StepHeader
        eyebrow="Your background"
        title={data.education.length === 0 ? 'Tell us about your education' : 'Add more education?'}
        sub={data.education.length === 0
          ? 'Start with your most recent degree. You can add older ones after.'
          : 'You can add another degree or move on. Most people add 1–2 entries.'}
      />

      {mode === 'list' && data.education.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          {data.education.map(e => (
            <div key={e.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              padding: '18px 20px', background: O.bgSoft, border: `1px solid ${O.border}`, borderRadius: 14, marginBottom: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                <div style={{ width: 40, height: 40, background: O.brandLight, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <OIcon name="cap" size={18} color={O.brand} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 700, color: O.dark, fontSize: 15, marginBottom: 2 }}>
                    {e.degree}{e.field && <span style={{ fontWeight: 500, color: O.body }}> in {e.field}</span>}
                  </div>
                  <div style={{ fontSize: 13, color: O.muted, fontWeight: 500 }}>
                    {e.school}{(e.startYear || e.endYear) && ` · ${e.startYear || ''}${e.startYear && e.endYear ? '–' : ''}${e.endYear || ''}`}{e.cgpa && ` · CGPA ${e.cgpa}`}
                  </div>
                </div>
              </div>
              <button onClick={() => removeEntry(e.id)} aria-label="Remove" style={{
                background: 'none', border: 'none', color: O.muted, cursor: 'pointer', padding: 8, borderRadius: 6, display: 'flex',
              }}
                onMouseEnter={ev => { ev.currentTarget.style.color = O.coral; ev.currentTarget.style.background = O.coralLight; }}
                onMouseLeave={ev => { ev.currentTarget.style.color = O.muted; ev.currentTarget.style.background = 'transparent'; }}>
                <OIcon name="x" size={15} sw={2} />
              </button>
            </div>
          ))}

          <button onClick={() => setMode('edit')} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '16px 18px', background: 'transparent', border: `1.5px dashed ${O.border}`, borderRadius: 14,
            color: O.brand, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = O.brand; e.currentTarget.style.background = O.brandSoft; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = O.border; e.currentTarget.style.background = 'transparent'; }}>
            <OIcon name="plus" size={16} color={O.brand} sw={2.2} />
            Add another education
          </button>
        </div>
      )}

      {mode === 'edit' && (
        <div>
          <div style={{ display: 'grid', gap: 18 }}>
            <div>
              <FieldLabel>Degree <span style={{ color: O.coral }}>·</span></FieldLabel>
              <BigInput value={draft.degree} onChange={v => setDraft(d => ({ ...d, degree: v }))}
                placeholder="B.Tech" autoFocus ariaLabel="Degree" />
            </div>
            <div>
              <FieldLabel>Field of study</FieldLabel>
              <BigInput value={draft.field} onChange={v => setDraft(d => ({ ...d, field: v }))}
                placeholder="Computer Science" ariaLabel="Field" />
            </div>
            <div>
              <FieldLabel>School / University <span style={{ color: O.coral }}>·</span></FieldLabel>
              <BigInput value={draft.school} onChange={v => setDraft(d => ({ ...d, school: v }))}
                placeholder="IIT Bombay" ariaLabel="School" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              <div>
                <FieldLabel>Start year</FieldLabel>
                <BigInput value={draft.startYear} onChange={v => setDraft(d => ({ ...d, startYear: v }))}
                  placeholder="2019" ariaLabel="Start year" />
              </div>
              <div>
                <FieldLabel>End year</FieldLabel>
                <BigInput value={draft.endYear} onChange={v => setDraft(d => ({ ...d, endYear: v }))}
                  placeholder="2023" ariaLabel="End year" />
              </div>
              <div>
                <FieldLabel>CGPA <span style={{ fontWeight: 500, color: O.muted }}>· optional</span></FieldLabel>
                <BigInput value={draft.cgpa} onChange={v => setDraft(d => ({ ...d, cgpa: v }))}
                  placeholder="8.4" ariaLabel="CGPA" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 24 }}>
            <AskAiLink field="education" label="Should I include high school? What if my CGPA is low?" onAskAi={onAskAi} />
            <div style={{ flex: 1 }} />
            {data.education.length > 0 && (
              <button onClick={() => setMode('list')} style={{
                background: 'transparent', border: 'none', color: O.muted, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', padding: '10px 14px',
              }}>
                Cancel
              </button>
            )}
            <button onClick={saveEntry} disabled={!canSaveDraft} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: canSaveDraft ? O.dark : O.muted2, color: '#fff', border: 'none',
              padding: '12px 22px', fontSize: 13.5, fontWeight: 700, borderRadius: 10,
              cursor: canSaveDraft ? 'pointer' : 'not-allowed',
              boxShadow: canSaveDraft ? `0 6px 18px ${O.dark}20` : 'none',
              transition: 'all 0.2s',
            }}>
              <OIcon name="check" size={14} color="#fff" sw={2.4} />
              Save education
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── STEP 6: SKILLS ───────────────────────────────────────────────
const SKILL_DB = [
  'React', 'React Native', 'Redux', 'Next.js', 'Vue', 'Angular', 'Svelte',
  'JavaScript', 'TypeScript', 'Node.js', 'Express', 'Python', 'Django', 'Flask',
  'Java', 'Spring Boot', 'Kotlin', 'Go', 'Rust', 'C++', 'C#', '.NET',
  'HTML', 'CSS', 'Tailwind CSS', 'Sass', 'Styled Components',
  'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
  'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD',
  'Git', 'GitHub Actions', 'Jenkins',
  'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'After Effects',
  'Product Management', 'Roadmapping', 'Stakeholder Management', 'Agile', 'Scrum',
  'SEO', 'Google Analytics', 'A/B Testing', 'Content Strategy',
  'Data Analysis', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'Machine Learning',
  'Tableau', 'Power BI', 'Looker',
  'Communication', 'Team Leadership', 'Problem Solving',
];

function SkillsStep({ data, update, onAskAi }) {
  const [query, setQuery] = React.useState('');
  const [focus, setFocus] = React.useState(false);
  const inputRef = React.useRef(null);

  const matches = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SKILL_DB
      .filter(s => s.toLowerCase().includes(q) && !data.skills.includes(s))
      .slice(0, 6);
  }, [query, data.skills]);

  // AI-suggested based on existing skills (fake: pick from same category)
  const aiSuggestions = React.useMemo(() => {
    if (data.skills.length === 0) return ['React', 'TypeScript', 'Node.js', 'Python', 'Figma', 'SQL'];
    const has = new Set(data.skills.map(s => s.toLowerCase()));
    // Simple co-occurrence: if "React" → suggest TS, Next.js, Tailwind
    const cooccur = {
      'react': ['TypeScript', 'Next.js', 'Tailwind CSS', 'Redux'],
      'python': ['Django', 'Pandas', 'NumPy', 'Flask'],
      'figma': ['Sketch', 'Adobe XD', 'Photoshop'],
      'aws': ['Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
      'product management': ['Roadmapping', 'Agile', 'Stakeholder Management', 'A/B Testing'],
    };
    const out = new Set();
    data.skills.forEach(s => {
      const related = cooccur[s.toLowerCase()] || [];
      related.forEach(r => { if (!has.has(r.toLowerCase())) out.add(r); });
    });
    return [...out].slice(0, 6);
  }, [data.skills]);

  function addSkill(s) {
    const v = s.trim();
    if (!v || data.skills.includes(v)) return;
    update({ skills: [...data.skills, v] });
    setQuery('');
    inputRef.current?.focus();
  }
  function removeSkill(s) {
    update({ skills: data.skills.filter(x => x !== s) });
  }

  return (
    <>
      <StepHeader
        eyebrow="What you bring"
        title="What are you good at?"
        sub="Add 5–15 skills. Start typing and we'll suggest — or pick from below."
      />

      {/* Selected chips */}
      {data.skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {data.skills.map(s => (
            <div key={s} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '7px 8px 7px 14px', background: O.brand, color: '#fff',
              fontSize: 13, fontWeight: 600, borderRadius: 999,
              animation: 'chip-in 0.2s cubic-bezier(.2,.8,.2,1)',
            }}>
              {s}
              <button onClick={() => removeSkill(s)} aria-label={`Remove ${s}`} style={{
                background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
                width: 18, height: 18, borderRadius: '50%', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <OIcon name="x" size={10} color="#fff" sw={2.5} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input + dropdown */}
      <div style={{ position: 'relative' }}>
        <BigInput
          value={query}
          onChange={setQuery}
          placeholder={data.skills.length === 0 ? 'Type a skill, e.g. React' : 'Add another skill…'}
          autoFocus
          leftIcon="sparkle"
          ariaLabel="Skill"
          onEnter={() => {
            if (matches.length > 0) addSkill(matches[0]);
            else if (query.trim()) addSkill(query);
          }}
        />
        {/* Inline match dropdown */}
        {query.trim() && (
          <div style={{
            marginTop: 8, background: O.bg, border: `1px solid ${O.border}`, borderRadius: 12,
            boxShadow: '0 12px 36px rgba(15,14,42,0.08)', overflow: 'hidden',
          }}>
            {matches.length > 0 ? matches.map(m => (
              <button key={m} onClick={() => addSkill(m)} style={{
                width: '100%', textAlign: 'left', padding: '12px 16px', background: 'transparent',
                border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: O.dark,
                display: 'flex', alignItems: 'center', gap: 10,
              }}
                onMouseEnter={e => e.currentTarget.style.background = O.bgSoft}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <OIcon name="plus" size={13} color={O.brand} sw={2.2} />
                {m}
              </button>
            )) : (
              <button onClick={() => addSkill(query)} style={{
                width: '100%', textAlign: 'left', padding: '12px 16px', background: 'transparent',
                border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: O.body,
                display: 'flex', alignItems: 'center', gap: 10,
              }}
                onMouseEnter={e => e.currentTarget.style.background = O.bgSoft}>
                <OIcon name="plus" size={13} color={O.brand} sw={2.2} />
                Add "<strong style={{ color: O.dark }}>{query}</strong>" as a custom skill
              </button>
            )}
          </div>
        )}
      </div>

      {/* AI-suggested */}
      {aiSuggestions.length > 0 && (
        <div style={{ marginTop: 24, padding: 18, background: `linear-gradient(135deg, ${O.brandSoft}, ${O.bg})`, border: `1px solid ${O.brandLight}`, borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 22, height: 22, background: O.brand, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <OIcon name="sparkle" size={12} color="#fff" />
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: O.dark }}>
              {data.skills.length === 0 ? 'Popular skills to start with' : 'People with your skills also added'}
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {aiSuggestions.map(s => (
              <button key={s} onClick={() => addSkill(s)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '7px 12px', background: O.bg, color: O.dark,
                fontSize: 13, fontWeight: 600, borderRadius: 999,
                border: `1.5px solid ${O.border}`, cursor: 'pointer', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = O.brand; e.currentTarget.style.background = O.brandLight; e.currentTarget.style.color = O.brand; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = O.border; e.currentTarget.style.background = O.bg; e.currentTarget.style.color = O.dark; }}>
                <OIcon name="plus" size={11} sw={2.4} color="currentColor" />
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <AskAiLink field="skills" label="How many skills should I add? Which ones matter most?" onAskAi={onAskAi} />
    </>
  );
}

// ── STEP 7: REVIEW (AI-drafted) ──────────────────────────────────
function ReviewStep({ data, update, onAskAi }) {
  const [objective, setObjective] = React.useState(
    data.objective || generateObjective(data)
  );
  const [headline, setHeadline] = React.useState(
    data.headline || generateHeadline(data)
  );
  const [editing, setEditing] = React.useState({ objective: false, headline: false });
  const [regenerating, setRegenerating] = React.useState({ objective: false, headline: false });

  function regen(field, generator) {
    setRegenerating(r => ({ ...r, [field]: true }));
    setTimeout(() => {
      const v = generator(data, true);
      if (field === 'objective') { setObjective(v); update({ objective: v }); }
      if (field === 'headline') { setHeadline(v); update({ headline: v }); }
      setRegenerating(r => ({ ...r, [field]: false }));
    }, 900);
  }

  React.useEffect(() => { update({ objective, headline }); /* eslint-disable-next-line */ }, []);

  return (
    <>
      <StepHeader
        eyebrow="Almost there"
        title="We wrote these for you"
        sub="Based on what you've shared, we drafted a headline and career objective. Accept, edit, or regenerate — you can fine-tune in the editor too."
      />

      <AiDraftCard
        label="Professional headline"
        value={headline}
        onChange={v => { setHeadline(v); update({ headline: v }); }}
        onRegenerate={() => regen('headline', generateHeadline)}
        regenerating={regenerating.headline}
      />

      <AiDraftCard
        label="Career objective"
        value={objective}
        onChange={v => { setObjective(v); update({ objective: v }); }}
        onRegenerate={() => regen('objective', generateObjective)}
        regenerating={regenerating.objective}
        rows={4}
      />

      <div style={{ marginTop: 24, padding: 18, background: O.greenLight, border: `1px solid #BBF7D0`, borderRadius: 14, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 28, height: 28, background: O.green, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <OIcon name="check" size={15} color="#fff" sw={2.5} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#14532D', marginBottom: 4 }}>Your draft is ready</div>
          <div style={{ fontSize: 13, color: '#15803D', lineHeight: 1.55 }}>
            We'll set up your resume with the {data.education.length > 0 ? `${data.education[0].degree} ` : ''}background and {data.skills.length} skills you added.
            You'll be able to add work experience, projects, and more inside the editor.
          </div>
        </div>
      </div>
    </>
  );
}

function AiDraftCard({ label, value, onChange, onRegenerate, regenerating, rows = 2 }) {
  const [editing, setEditing] = React.useState(false);
  return (
    <div style={{
      background: O.bg, border: `1.5px solid ${O.border}`, borderRadius: 14,
      padding: 18, marginBottom: 14, position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 22, height: 22, background: O.brandLight, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <OIcon name="sparkle" size={12} color={O.brand} />
          </div>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: O.dark, letterSpacing: '-0.1px' }}>{label}</span>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: O.brand, background: O.brandLight, padding: '2px 7px', borderRadius: 999, letterSpacing: '0.4px', textTransform: 'uppercase' }}>AI draft</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => setEditing(e => !e)} title={editing ? 'Done' : 'Edit'} style={cardActionBtn(editing)}>
            <OIcon name={editing ? 'check' : 'edit'} size={13} color={editing ? O.green : O.muted} sw={editing ? 2.4 : 1.8} />
          </button>
          <button onClick={onRegenerate} disabled={regenerating} title="Regenerate" style={cardActionBtn(false)}>
            <OIcon name="refresh" size={13} color={O.muted} sw={1.8} />
          </button>
        </div>
      </div>

      {regenerating ? (
        <div style={{ padding: '8px 0' }}>
          <div style={{ height: 12, background: `linear-gradient(90deg, ${O.borderSoft} 0%, ${O.border} 50%, ${O.borderSoft} 100%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.2s infinite', borderRadius: 4, marginBottom: 8 }} />
          <div style={{ height: 12, width: '80%', background: `linear-gradient(90deg, ${O.borderSoft} 0%, ${O.border} 50%, ${O.borderSoft} 100%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.2s infinite', borderRadius: 4 }} />
        </div>
      ) : editing ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
          style={{
            width: '100%', resize: 'vertical', minHeight: rows * 24,
            background: O.bgSoft, border: `1.5px solid ${O.brand}`, borderRadius: 10,
            padding: '12px 14px', fontSize: 14, lineHeight: 1.55, color: O.dark,
            fontFamily: 'inherit', boxShadow: `0 0 0 4px ${O.brand}18`,
          }} />
      ) : (
        <div style={{ fontSize: 14.5, lineHeight: 1.6, color: O.dark, fontFamily: "'Source Serif 4', serif", letterSpacing: '-0.1px' }}>
          {value}
        </div>
      )}
    </div>
  );
}

function cardActionBtn(active) {
  return {
    width: 28, height: 28, background: active ? O.greenLight : 'transparent',
    border: `1px solid ${active ? '#BBF7D0' : O.border}`, borderRadius: 7,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s',
  };
}

// Fake generators (would be real AI calls in prod)
function generateObjective(data, alt = false) {
  const name = data.name?.split(' ')[0] || 'professional';
  const degree = data.education?.[0]?.degree || '';
  const field = data.education?.[0]?.field || '';
  const school = data.education?.[0]?.school || '';
  const topSkills = data.skills?.slice(0, 3).join(', ') || 'building great software';
  if (alt) {
    return `Driven ${degree || 'graduate'}${field ? ` in ${field}` : ''} with hands-on experience in ${topSkills}. Eager to contribute to high-impact engineering teams and ship products that scale. Comfortable owning features end-to-end and collaborating across design and product.`;
  }
  return `Recent ${degree || 'graduate'}${field ? ` in ${field}` : ''}${school ? ` from ${school}` : ''} seeking to apply skills in ${topSkills} to solve meaningful problems. Passionate about clean code, fast iteration, and learning from strong teams. Ready to contribute from day one.`;
}

function generateHeadline(data, alt = false) {
  const field = data.education?.[0]?.field || '';
  const top = data.skills?.[0] || '';
  if (alt) {
    return `${top ? top + ' ' : ''}Developer · ${field || 'Engineering'} graduate building user-first products`;
  }
  return `${field ? field + ' ' : ''}Graduate · ${top ? top + ' Developer' : 'Software Engineer'}`;
}

// ── ASK AI PANEL (slide-in right) ────────────────────────────────
function AskAiPanel({ field, data, onClose }) {
  const fieldLabels = {
    name: 'your name', email: 'your email', phone: 'your phone',
    location: 'your location', links: 'profile links',
    education: 'your education', skills: 'your skills',
    objective: 'your career objective', headline: 'your headline',
  };
  const fieldLabel = fieldLabels[field] || 'this field';

  const quickPrompts = {
    education: [
      'Should I include high school?',
      'What if my CGPA is low?',
      "I'm still studying — what do I put for end year?",
    ],
    skills: [
      'How many skills should I add?',
      'Hard skills vs soft skills?',
      "What skills look good for an SDE-1 role?",
    ],
    links: [
      'Do I really need LinkedIn?',
      "I don't have a portfolio — what then?",
      'Is GitHub important if I do PM work?',
    ],
    objective: [
      'What makes a strong career objective?',
      'Should it be different per company?',
    ],
  };
  const prompts = quickPrompts[field] || [
    `What should I put in ${fieldLabel}?`,
    `Give me an example`,
    `Why does this matter?`,
  ];

  const [messages, setMessages] = React.useState([
    { role: 'ai', text: `Hi! I see you're on "${fieldLabel}". Pick a question below or type your own — I have context on everything you've entered so far.` }
  ]);
  const [input, setInput] = React.useState('');
  const [thinking, setThinking] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, thinking]);

  async function send(text) {
    const q = (text || input).trim();
    if (!q) return;
    setMessages(m => [...m, { role: 'user', text: q }]);
    setInput('');
    setThinking(true);

    // Build context summary for the AI
    const ctx = [
      data.name && `Name: ${data.name}`,
      data.email && `Email: ${data.email}`,
      data.location && `Location: ${data.location}`,
      data.education?.length > 0 && `Education: ${data.education.map(e => `${e.degree}${e.field ? ' in ' + e.field : ''} from ${e.school}`).join('; ')}`,
      data.skills?.length > 0 && `Skills: ${data.skills.join(', ')}`,
    ].filter(Boolean).join('\n');

    const prompt = `You are a friendly career coach helping someone build a resume. They are currently filling in "${fieldLabel}".\n\nContext about them so far:\n${ctx || '(nothing yet)'}\n\nTheir question: ${q}\n\nGive a SHORT, helpful answer (2-3 sentences max, no bullet points). Be warm and concrete.`;

    try {
      const reply = await window.claude.complete(prompt);
      setMessages(m => [...m, { role: 'ai', text: reply }]);
    } catch (err) {
      setMessages(m => [...m, { role: 'ai', text: "Hmm, I couldn't reach the AI just now. Try again in a sec, or move on — you can come back to this." }]);
    }
    setThinking(false);
  }

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(15,14,42,0.3)', backdropFilter: 'blur(2px)',
        zIndex: 50, animation: 'fade-in 0.2s',
      }} />
      {/* Panel */}
      <aside style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, width: 'min(420px, 100vw)',
        background: O.bg, borderLeft: `1px solid ${O.border}`,
        boxShadow: '-20px 0 60px rgba(15,14,42,0.18)',
        zIndex: 51, display: 'flex', flexDirection: 'column',
        animation: 'slide-in 0.3s cubic-bezier(.2,.8,.2,1)',
      }}>
        {/* Header */}
        <div style={{ padding: '18px 20px', borderBottom: `1px solid ${O.borderSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${O.brand}, ${O.coral})`, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <OIcon name="sparkle" size={15} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: O.dark }}>Ask AI</div>
              <div style={{ fontSize: 11.5, color: O.muted, fontWeight: 500 }}>Helping with: <span style={{ color: O.brand, fontWeight: 600 }}>{fieldLabel}</span></div>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            background: 'transparent', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 7, display: 'flex', color: O.muted,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = O.bgSoft; e.currentTarget.style.color = O.dark; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = O.muted; }}>
            <OIcon name="x" size={16} sw={2} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              padding: '10px 14px',
              background: m.role === 'user' ? O.brand : O.bgSoft,
              color: m.role === 'user' ? '#fff' : O.dark,
              borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              fontSize: 13.5, lineHeight: 1.55, whiteSpace: 'pre-wrap',
              animation: 'msg-in 0.25s cubic-bezier(.2,.8,.2,1)',
            }}>
              {m.text}
            </div>
          ))}
          {thinking && (
            <div style={{
              alignSelf: 'flex-start', padding: '12px 14px', background: O.bgSoft,
              borderRadius: '14px 14px 14px 4px', display: 'flex', gap: 4, alignItems: 'center',
            }}>
              <div style={dotStyle(0)} />
              <div style={dotStyle(0.2)} />
              <div style={dotStyle(0.4)} />
            </div>
          )}
        </div>

        {/* Quick prompts (shown when no user message yet) */}
        {messages.filter(m => m.role === 'user').length === 0 && (
          <div style={{ padding: '0 20px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: O.muted, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 4 }}>Quick questions</div>
            {prompts.map((p, i) => (
              <button key={i} onClick={() => send(p)} style={{
                textAlign: 'left', padding: '10px 12px', background: O.bg,
                border: `1px solid ${O.border}`, borderRadius: 9,
                fontSize: 13, fontWeight: 500, color: O.dark, cursor: 'pointer',
                transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = O.brand; e.currentTarget.style.background = O.brandSoft; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = O.border; e.currentTarget.style.background = O.bg; }}>
                <OIcon name="help" size={13} color={O.brand} />
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding: '14px 20px 18px', borderTop: `1px solid ${O.borderSoft}` }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: O.bgSoft, border: `1.5px solid ${O.border}`, borderRadius: 12,
            padding: 6, transition: 'border-color 0.15s',
          }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') send(); }}
              placeholder="Ask anything…"
              style={{
                flex: 1, background: 'transparent', border: 'none', padding: '10px 12px',
                fontSize: 13.5, color: O.dark, width: '100%',
              }} />
            <button onClick={() => send()} disabled={!input.trim() || thinking}
              style={{
                width: 34, height: 34, background: input.trim() && !thinking ? O.brand : O.muted2,
                border: 'none', borderRadius: 9, cursor: input.trim() && !thinking ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
              }}>
              <OIcon name="send" size={14} color="#fff" sw={2} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function dotStyle(delay) {
  return {
    width: 6, height: 6, borderRadius: '50%', background: O.muted,
    animation: `pulse-dot 1.2s ${delay}s infinite ease-in-out`,
  };
}

Object.assign(window, {
  O, OIcon, OLogo, STEPS,
  Onboarding,
  OnboardingHeader, OnboardingFooter, ContinueButton,
  StepView, StepHeader, BigInput, AskAiLink, FieldLabel,
  NameStep, ContactStep, LocationStep, LinksStep, EducationStep, SkillsStep, ReviewStep,
  AskAiPanel, AiDraftCard,
});
