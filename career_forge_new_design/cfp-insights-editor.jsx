// CareerForgePro — Insights Editor (admin CMS)
// Ghost/Medium-style writing surface. Centered canvas + slide-over settings.

const IE = {
  brand: '#5046E4', brandDark: '#3730D0', brandLight: '#EEEDFF', brandSoft: '#F4F2FF',
  coral: '#FF5C35', coralLight: '#FFF1ED',
  dark: '#0F0E2A', body: '#44445A', muted: '#8888A5', muted2: '#B5B5C8',
  border: '#E8E6F4', borderSoft: '#F0EEF9',
  bg: '#FFFFFF', bgSoft: '#F7F6FF', canvas: '#FBFAFE',
  green: '#16A34A', greenLight: '#F0FDF4', amber: '#F59E0B',
};

const IE_CATEGORIES = [
  { id: 'resume', label: 'Resume Tips', col: '#5046E4' },
  { id: 'ats', label: 'ATS Hacks', col: '#FF5C35' },
  { id: 'interview', label: 'Interview Prep', col: '#7C3AED' },
  { id: 'job-search', label: 'Job Search', col: '#0891B2' },
  { id: 'career-stories', label: 'Career Stories', col: '#16A34A' },
  { id: 'salary', label: 'Salary Negotiation', col: '#F59E0B' },
];

function EIcon({ name, size = 18, color = 'currentColor', sw = 1.7 }) {
  const p = {
    arrowL: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    arrow: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    check: <><polyline points="5 12 10 17 20 7"/></>,
    x: <><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></>,
    bold: <><path d="M6 4h8a4 4 0 010 8H6z"/><path d="M6 12h9a4 4 0 010 8H6z"/></>,
    italic: <><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></>,
    h2: <><path d="M4 6v12M4 12h8M12 6v12"/><path d="M17 18c0-2 4-2.5 4-5 0-1.5-1.5-2-2.5-1.2"/></>,
    quote: <><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/></>,
    list: <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></>,
    listOl: <><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4M4 10h2M6 18H4l2-2.5a1 1 0 00-2-1.2"/></>,
    link: <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></>,
    divider: <><line x1="3" y1="12" x2="21" y2="12"/></>,
    sparkle: <><path d="M12 3l1.5 5L19 9.5 13.5 11 12 16l-1.5-5L5 9.5 10.5 8z"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 008 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H2a2 2 0 010-4h.09A1.65 1.65 0 004.6 8a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V2a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H22a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    chevD: <><polyline points="6 9 12 15 18 9"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></>,
    star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    doc: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    cta: <><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 12h8"/><path d="M13 9l3 3-3 3"/></>,
    steps: <><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4M4 10h2M6 18H4l2-2.5a1 1 0 00-2-1.2"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>{p[name]}</svg>;
}

// ── ROOT ──────────────────────────────────────────────────────────
function InsightsEditor() {
  const [title, setTitle] = React.useState('');
  const [subtitle, setSubtitle] = React.useState('');
  const [category, setCategory] = React.useState('ats');
  const [featured, setFeatured] = React.useState(false);
  const [author, setAuthor] = React.useState('Anu Patel');
  const [coverStyle, setCoverStyle] = React.useState('category');
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [saved, setSaved] = React.useState('saved'); // 'saving' | 'saved'
  const [words, setWords] = React.useState(0);
  const [publishOpen, setPublishOpen] = React.useState(false);
  const bodyRef = React.useRef(null);

  const cat = IE_CATEGORIES.find(c => c.id === category);
  const readTime = Math.max(1, Math.round(words / 220));

  // Autosave simulation
  const saveTimer = React.useRef(null);
  function touch() {
    setSaved('saving');
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaved('saved'), 700);
    if (bodyRef.current) {
      const text = bodyRef.current.textContent || '';
      setWords(text.trim() ? text.trim().split(/\s+/).length : 0);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: IE.canvas, fontFamily: "'Plus Jakarta Sans',sans-serif", display: 'flex', flexDirection: 'column' }}>
      <EditorTopBar
        saved={saved} words={words} readTime={readTime}
        onSettings={() => setSettingsOpen(s => !s)}
        settingsOpen={settingsOpen}
        publishOpen={publishOpen} setPublishOpen={setPublishOpen}
      />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Writing canvas */}
        <main style={{ flex: 1, overflowY: 'auto', transition: 'margin-right 0.3s cubic-bezier(.2,.8,.2,1)', marginRight: settingsOpen ? 380 : 0 }}>
          <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px, 5vw, 72px) clamp(24px, 5vw, 40px) 160px' }}>

            {/* Cover preview */}
            <CoverPreview coverStyle={coverStyle} cat={cat} title={title} author={author} setCoverStyle={setCoverStyle} />

            {/* Category pill */}
            <button onClick={() => setSettingsOpen(true)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: cat.col + '15', color: cat.col,
              border: 'none', borderRadius: 7, padding: '5px 11px',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase',
              cursor: 'pointer', marginBottom: 22, fontFamily: 'inherit',
            }}>
              {cat.label}
              <EIcon name="chevD" size={11} color={cat.col} sw={2.2} />
            </button>

            {/* Title */}
            <TextareaAuto
              value={title}
              onChange={(v) => { setTitle(v); touch(); }}
              placeholder="Article title"
              style={{
                fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800,
                fontSize: 'clamp(34px, 4.4vw, 48px)', letterSpacing: '-1.8px',
                lineHeight: 1.1, color: IE.dark,
              }}
            />

            {/* Subtitle */}
            <TextareaAuto
              value={subtitle}
              onChange={(v) => { setSubtitle(v); touch(); }}
              placeholder="Add a subtitle that hooks the reader…"
              style={{
                fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic',
                fontSize: 'clamp(18px, 2.2vw, 22px)', lineHeight: 1.45,
                color: IE.body, marginTop: 14,
              }}
            />

            {/* Author + meta row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0 32px', paddingBottom: 28, borderBottom: `1px solid ${IE.border}` }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${IE.brand}, ${IE.coral})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: '#fff' }}>{author[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: IE.dark }}>{author}</div>
                <div style={{ fontSize: 12, color: IE.muted, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>Draft</span>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: IE.muted2 }} />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <EIcon name="clock" size={11} color={IE.muted} /> {readTime} min read
                  </span>
                </div>
              </div>
            </div>

            {/* Formatting toolbar */}
            <FormatToolbar bodyRef={bodyRef} onChange={touch} />

            {/* Body */}
            <BodyEditor bodyRef={bodyRef} onChange={touch} />
          </div>
        </main>

        {/* Settings slide-over */}
        <SettingsPanel
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          category={category} setCategory={setCategory}
          featured={featured} setFeatured={setFeatured}
          author={author} setAuthor={setAuthor}
          coverStyle={coverStyle} setCoverStyle={setCoverStyle}
          title={title} subtitle={subtitle}
          readTime={readTime} words={words}
        />
      </div>
    </div>
  );
}

// ── TOP BAR ───────────────────────────────────────────────────────
function EditorTopBar({ saved, words, readTime, onSettings, settingsOpen, publishOpen, setPublishOpen }) {
  return (
    <header style={{ height: 60, background: IE.bg, borderBottom: `1px solid ${IE.border}`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16, flexShrink: 0, position: 'relative', zIndex: 60 }}>
      <a href="CareerForgePro%20Insights.html" title="Back to Insights" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', padding: '6px 10px 6px 6px', borderRadius: 9, transition: 'background 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.background = IE.bgSoft}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
        <EIcon name="arrowL" size={15} color={IE.muted} />
        <div style={{ width: 28, height: 28, background: IE.brand, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 11L5 6L7.5 8.5L10 4L12.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </a>
      <div style={{ width: 1, height: 24, background: IE.border }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: IE.muted }}>Insights</span>
        <EIcon name="arrow" size={12} color={IE.muted2} />
        <span style={{ fontSize: 13.5, fontWeight: 600, color: IE.dark }}>New article</span>
      </div>

      {/* Save status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: IE.muted, fontWeight: 500 }}>
        {saved === 'saving' ? (
          <>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: IE.amber, animation: 'pulse-dot 1s ease-in-out infinite' }} />
            Saving…
          </>
        ) : (
          <>
            <EIcon name="check" size={13} color={IE.green} sw={2.4} />
            Saved
          </>
        )}
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, color: IE.muted, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace" }}>{words} words · {readTime} min</span>
        <div style={{ width: 1, height: 24, background: IE.border, margin: '0 4px' }} />
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', color: IE.body, border: 'none', borderRadius: 9, padding: '8px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = IE.bgSoft}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <EIcon name="eye" size={14} /> Preview
        </button>
        <button onClick={onSettings} title="Post settings" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 36, height: 36, background: settingsOpen ? IE.brandLight : 'transparent',
          color: settingsOpen ? IE.brand : IE.body, border: 'none', borderRadius: 9, cursor: 'pointer', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { if (!settingsOpen) e.currentTarget.style.background = IE.bgSoft; }}
          onMouseLeave={e => { if (!settingsOpen) e.currentTarget.style.background = 'transparent'; }}>
          <EIcon name="settings" size={16} color="currentColor" />
        </button>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setPublishOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: IE.coral, color: '#fff', border: 'none', borderRadius: 9, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 14px ${IE.coral}40`, transition: 'transform 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${IE.coral}55`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 14px ${IE.coral}40`; }}>
            Publish <EIcon name="chevD" size={13} color="#fff" sw={2.2} />
          </button>
          {publishOpen && <PublishMenu onClose={() => setPublishOpen(false)} />}
        </div>
      </div>
    </header>
  );
}

function PublishMenu({ onClose }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 70 }} />
      <div style={{
        position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 320, zIndex: 71,
        background: IE.bg, border: `1px solid ${IE.border}`, borderRadius: 14,
        boxShadow: '0 20px 50px rgba(15,14,42,0.18)', overflow: 'hidden',
        animation: 'menu-in 0.18s cubic-bezier(.2,.8,.2,1)',
      }}>
        <div style={{ padding: '18px 18px 14px' }}>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 16, fontWeight: 700, color: IE.dark, marginBottom: 4 }}>Ready to publish?</div>
          <div style={{ fontSize: 12.5, color: IE.muted, lineHeight: 1.5 }}>This article will go live on Insights immediately and notify 2,400 subscribers.</div>
        </div>
        <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: IE.coral, color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', boxShadow: `0 6px 16px ${IE.coral}38` }}>
            <EIcon name="sparkle" size={14} color="#fff" /> Publish now
          </button>
          <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: IE.bg, color: IE.dark, border: `1px solid ${IE.border}`, borderRadius: 10, padding: '12px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
            <EIcon name="clock" size={14} color={IE.body} /> Schedule for later
          </button>
          <button style={{ background: 'transparent', color: IE.muted, border: 'none', borderRadius: 10, padding: '8px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
            Save as draft
          </button>
        </div>
      </div>
    </>
  );
}

// ── COVER PREVIEW ─────────────────────────────────────────────────
function CoverPreview({ coverStyle, cat, title, author, setCoverStyle }) {
  const [hov, setHov] = React.useState(false);
  if (coverStyle === 'none') {
    return (
      <button onClick={() => setCoverStyle('category')} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: 'transparent', border: `1.5px dashed ${IE.border}`, borderRadius: 14,
        padding: '20px', marginBottom: 32, color: IE.muted, fontSize: 13, fontWeight: 600,
        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = IE.brand; e.currentTarget.style.color = IE.brand; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = IE.border; e.currentTarget.style.color = IE.muted; }}>
        <EIcon name="image" size={15} color="currentColor" /> Add a cover
      </button>
    );
  }

  // Featured = dark hero; category = gradient art
  const isFeatured = coverStyle === 'featured';
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ position: 'relative', marginBottom: 32 }}>
      <div style={{
        height: 240, borderRadius: 16, overflow: 'hidden', position: 'relative',
        background: isFeatured
          ? `linear-gradient(135deg, ${IE.brand} 0%, ${IE.brandDark} 60%, #1F1A6B 100%)`
          : `linear-gradient(135deg, ${cat.col}28, ${cat.col}06)`,
        border: `1px solid ${isFeatured ? 'transparent' : cat.col + '25'}`,
        display: 'flex', flexDirection: 'column', justifyContent: isFeatured ? 'center' : 'flex-end',
        padding: 28,
      }}>
        {isFeatured && <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)', backgroundSize: '26px 26px' }} />}
        {isFeatured && <div style={{ position: 'absolute', top: -50, right: -30, width: 240, height: 240, borderRadius: '50%', background: `radial-gradient(circle, ${IE.coral}35 0%, transparent 70%)` }} />}
        {isFeatured ? (
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: 100, padding: '4px 11px', color: '#fff', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 14 }}>
              <EIcon name="star" size={11} color={IE.coral} /> Featured
            </div>
            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 26, color: '#fff', letterSpacing: '-0.8px', lineHeight: 1.15, maxWidth: 480 }}>
              {title || 'Your headline appears here, large and bold'}
            </div>
          </div>
        ) : (
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 80, color: cat.col, opacity: 0.18, letterSpacing: '-4px', lineHeight: 0.85, alignSelf: 'flex-end' }}>
            {cat.label.split(' ')[0]}
          </div>
        )}
      </div>
      {/* Hover controls */}
      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6, opacity: hov ? 1 : 0, transition: 'opacity 0.18s' }}>
        {[
          { id: 'category', label: 'Art' },
          { id: 'featured', label: 'Hero' },
          { id: 'none', label: 'None' },
        ].map(o => (
          <button key={o.id} onClick={() => setCoverStyle(o.id)} style={{
            background: coverStyle === o.id ? IE.dark : 'rgba(255,255,255,0.92)',
            color: coverStyle === o.id ? '#fff' : IE.dark,
            border: 'none', borderRadius: 7, padding: '5px 11px',
            fontSize: 11.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 2px 8px rgba(15,14,42,0.15)',
          }}>{o.label}</button>
        ))}
      </div>
    </div>
  );
}

// ── AUTO-GROWING TEXTAREA (title / subtitle) ──────────────────────
function TextareaAuto({ value, onChange, placeholder, style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }
  }, [value]);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={1}
      style={{
        width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none',
        padding: 0, margin: 0, overflow: 'hidden', display: 'block',
        fontFamily: 'inherit', ...style,
      }}
    />
  );
}

// ── FORMAT TOOLBAR ────────────────────────────────────────────────
function FormatToolbar({ bodyRef, onChange }) {
  const [insertOpen, setInsertOpen] = React.useState(false);

  function cmd(command, value = null) {
    bodyRef.current?.focus();
    document.execCommand(command, false, value);
    onChange && onChange();
  }
  function block(tag) {
    bodyRef.current?.focus();
    document.execCommand('formatBlock', false, tag);
    onChange && onChange();
  }
  function insertHTML(html) {
    bodyRef.current?.focus();
    document.execCommand('insertHTML', false, html);
    setInsertOpen(false);
    onChange && onChange();
  }
  function insertImage() {
    const url = prompt('Image URL (or leave blank for a placeholder):');
    const src = url && url.trim() ? url.trim() : '';
    const fig = src
      ? `<figure data-img="1"><img src="${src}" alt=""/><figcaption>Add a caption…</figcaption></figure><p><br/></p>`
      : `<figure data-img="1" data-empty="1"><div class="ie-imgph">Click “Insert → Image” with a URL to add a photo</div><figcaption>Add a caption…</figcaption></figure><p><br/></p>`;
    insertHTML(fig);
  }

  const tools = [
    { icon: 'h2', tip: 'Heading', fn: () => block('H2') },
    { icon: 'bold', tip: 'Bold (⌘B)', fn: () => cmd('bold') },
    { icon: 'italic', tip: 'Italic (⌘I)', fn: () => cmd('italic') },
    { divider: true },
    { icon: 'quote', tip: 'Quote', fn: () => block('BLOCKQUOTE') },
    { icon: 'list', tip: 'Bullet list', fn: () => cmd('insertUnorderedList') },
    { icon: 'listOl', tip: 'Numbered list', fn: () => cmd('insertOrderedList') },
    { icon: 'link', tip: 'Link', fn: () => { const u = prompt('Link URL:'); if (u) cmd('createLink', u); } },
  ];

  return (
    <div style={{
      position: 'sticky', top: 12, zIndex: 30,
      display: 'flex', alignItems: 'center', gap: 2,
      background: IE.bg, border: `1px solid ${IE.border}`, borderRadius: 12,
      padding: 5, marginBottom: 24,
      boxShadow: '0 4px 16px rgba(15,14,42,0.06)',
      width: 'fit-content',
    }}>
      {tools.map((t, i) => t.divider
        ? <div key={i} style={{ width: 1, height: 22, background: IE.border, margin: '0 4px' }} />
        : <ToolBtn key={i} icon={t.icon} tip={t.tip} onClick={t.fn} />
      )}
      <div style={{ width: 1, height: 22, background: IE.border, margin: '0 4px' }} />
      {/* Insert block */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => setInsertOpen(o => !o)} title="Insert block" style={{
          display: 'flex', alignItems: 'center', gap: 5, height: 32, padding: '0 10px',
          background: insertOpen ? IE.brandLight : 'transparent', color: insertOpen ? IE.brand : IE.body,
          border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit',
        }}>
          <EIcon name="plus" size={14} color="currentColor" sw={2.2} /> Insert
        </button>
        {insertOpen && (
          <>
            <div onClick={() => setInsertOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, width: 230, zIndex: 41,
              background: IE.bg, border: `1px solid ${IE.border}`, borderRadius: 12,
              boxShadow: '0 18px 40px rgba(15,14,42,0.15)', padding: 6,
              animation: 'menu-in 0.16s cubic-bezier(.2,.8,.2,1)',
            }}>
              {[
                { icon: 'quote', label: 'Pull quote', fn: () => insertHTML('<blockquote data-pull="1">“Your standout line here.”</blockquote><p><br/></p>') },
                { icon: 'steps', label: 'Numbered steps', fn: () => insertHTML('<div data-steps="1"><div class="ie-step"><span class="ie-step-n">01</span><div class="ie-step-b"><h4>First step title</h4><p>Describe what to do, plainly and concretely.</p></div></div><div class="ie-step"><span class="ie-step-n">02</span><div class="ie-step-b"><h4>Second step title</h4><p>One clear action per step works best.</p></div></div></div><p><br/></p>') },
                { icon: 'image', label: 'Image', fn: insertImage },
                { icon: 'divider', label: 'Divider', fn: () => insertHTML('<hr/><p><br/></p>') },
                { icon: 'cta', label: 'Inline CTA', fn: () => insertHTML('<div data-cta="1">Try CareerForgePro free — see your ATS score in 60 seconds.</div><p><br/></p>') },
              ].map(b => (
                <button key={b.label} onClick={b.fn} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  background: 'transparent', border: 'none', borderRadius: 8, padding: '9px 10px',
                  cursor: 'pointer', fontSize: 13, fontWeight: 500, color: IE.dark, textAlign: 'left', fontFamily: 'inherit',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = IE.bgSoft}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: IE.brandLight, color: IE.brand, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <EIcon name={b.icon} size={13} color={IE.brand} />
                  </div>
                  {b.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ToolBtn({ icon, tip, onClick }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button onClick={onClick} title={tip} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 32, height: 32, background: hov ? IE.bgSoft : 'transparent',
        border: 'none', borderRadius: 8, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: IE.body,
        transition: 'background 0.12s',
      }}>
      <EIcon name={icon} size={16} color="currentColor" />
    </button>
  );
}

// ── BODY EDITOR (contentEditable) ─────────────────────────────────
function BodyEditor({ bodyRef, onChange }) {
  const [empty, setEmpty] = React.useState(true);
  React.useEffect(() => {
    // Seed with one empty paragraph
    if (bodyRef.current && !bodyRef.current.innerHTML.trim()) {
      bodyRef.current.innerHTML = '<p><br/></p>';
    }
  }, []);
  function handleInput() {
    const el = bodyRef.current;
    setEmpty(!el || el.textContent.trim() === '');
    onChange && onChange();
  }
  return (
    <div style={{ position: 'relative' }}>
      {empty && (
        <div style={{
          position: 'absolute', top: 0, left: 0, pointerEvents: 'none',
          fontFamily: "'Newsreader', Georgia, serif", fontSize: 19, lineHeight: 1.75, color: IE.muted2,
        }}>
          Start writing your story. Press <strong style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600 }}>Insert</strong> for quotes, dividers and CTAs.
        </div>
      )}
      <div
        ref={bodyRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="ie-body"
        style={{
          minHeight: 400, outline: 'none',
          fontFamily: "'Newsreader', Georgia, serif", fontSize: 19, lineHeight: 1.75, color: IE.dark,
        }}
      />
    </div>
  );
}

// ── SETTINGS PANEL ────────────────────────────────────────────────
function SettingsPanel({ open, onClose, category, setCategory, featured, setFeatured, author, setAuthor, coverStyle, setCoverStyle, title, subtitle, readTime, words }) {
  const slug = (title || 'untitled-article').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
  const authors = ['Anu Patel', 'Priya Sharma', 'Mehul Pandey', 'Tanvi Reddy'];

  return (
    <aside style={{
      position: 'fixed', top: 60, right: 0, bottom: 0, width: 380, zIndex: 55,
      background: IE.bg, borderLeft: `1px solid ${IE.border}`,
      boxShadow: open ? '-12px 0 40px rgba(15,14,42,0.10)' : 'none',
      transform: open ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s cubic-bezier(.2,.8,.2,1)',
      display: 'flex', flexDirection: 'column', overflowY: 'auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px 16px', borderBottom: `1px solid ${IE.borderSoft}` }}>
        <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 17, fontWeight: 700, color: IE.dark, letterSpacing: '-0.3px' }}>Post settings</div>
        <button onClick={onClose} style={{ width: 30, height: 30, background: IE.bgSoft, border: 'none', borderRadius: 8, cursor: 'pointer', color: IE.muted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EIcon name="x" size={14} sw={2} />
        </button>
      </div>

      <div style={{ padding: '20px 22px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Featured toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: featured ? IE.coralLight : IE.bgSoft, border: `1px solid ${featured ? IE.coral + '40' : IE.border}`, borderRadius: 12, transition: 'all 0.2s' }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: featured ? IE.coral : IE.bg, color: featured ? '#fff' : IE.muted, border: featured ? 'none' : `1px solid ${IE.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <EIcon name="star" size={15} color={featured ? '#fff' : IE.muted} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: IE.dark }}>Feature this article</div>
            <div style={{ fontSize: 11.5, color: IE.muted }}>Pin to the top of Insights</div>
          </div>
          <Toggle on={featured} onClick={() => setFeatured(f => !f)} />
        </div>

        {/* Category */}
        <Group label="Category">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {IE_CATEGORIES.map(c => {
              const active = category === c.id;
              return (
                <button key={c.id} onClick={() => setCategory(c.id)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: active ? c.col : IE.bg, color: active ? '#fff' : IE.body,
                  border: `1.5px solid ${active ? c.col : IE.border}`, borderRadius: 100,
                  padding: '6px 13px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}>
                  {!active && <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.col }} />}
                  {c.label}
                </button>
              );
            })}
          </div>
        </Group>

        {/* Author */}
        <Group label="Author">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {authors.map(a => {
              const active = author === a;
              return (
                <button key={a} onClick={() => setAuthor(a)} style={{
                  display: 'flex', alignItems: 'center', gap: 11,
                  background: active ? IE.brandSoft : 'transparent',
                  border: `1px solid ${active ? IE.brand + '40' : 'transparent'}`,
                  borderRadius: 10, padding: '8px 10px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = IE.bgSoft; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${IE.brand}, ${IE.coral})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#fff' }}>{a[0]}</div>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: active ? 700 : 500, color: IE.dark }}>{a}</span>
                  {active && <EIcon name="check" size={14} color={IE.brand} sw={2.4} />}
                </button>
              );
            })}
          </div>
        </Group>

        {/* Cover */}
        <Group label="Cover style">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { id: 'category', label: 'Art' },
              { id: 'featured', label: 'Hero' },
              { id: 'none', label: 'None' },
            ].map(o => {
              const active = coverStyle === o.id;
              return (
                <button key={o.id} onClick={() => setCoverStyle(o.id)} style={{
                  background: IE.bg, border: `1.5px solid ${active ? IE.brand : IE.border}`, borderRadius: 10,
                  padding: 8, cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: active ? `0 0 0 3px ${IE.brand}18` : 'none', transition: 'all 0.15s',
                }}>
                  <div style={{
                    height: 36, borderRadius: 6, marginBottom: 6,
                    background: o.id === 'none' ? IE.bgSoft
                      : o.id === 'featured' ? `linear-gradient(135deg, ${IE.brand}, ${IE.brandDark})`
                      : `linear-gradient(135deg, ${IE.coral}30, ${IE.coral}08)`,
                    border: o.id === 'none' ? `1px dashed ${IE.border}` : 'none',
                  }} />
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: active ? IE.brand : IE.body, textAlign: 'center' }}>{o.label}</div>
                </button>
              );
            })}
          </div>
        </Group>

        {/* URL slug */}
        <Group label="URL slug">
          <div style={{ display: 'flex', alignItems: 'center', background: IE.bgSoft, border: `1px solid ${IE.border}`, borderRadius: 10, padding: '10px 12px', fontSize: 12.5, fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ color: IE.muted2 }}>/insights/</span>
            <span style={{ color: IE.dark, fontWeight: 600 }}>{slug}</span>
          </div>
        </Group>

        {/* Excerpt */}
        <Group label="Excerpt" sub="Shown on cards and in search">
          <textarea defaultValue={subtitle} placeholder="A 1–2 sentence summary…" rows={3}
            style={{ width: '100%', background: IE.bg, border: `1.5px solid ${IE.border}`, borderRadius: 10, padding: '10px 12px', fontSize: 13, lineHeight: 1.5, color: IE.dark, resize: 'vertical', fontFamily: 'inherit', outline: 'none' }} />
        </Group>

        {/* Meta */}
        <div style={{ display: 'flex', gap: 10 }}>
          <StatBox label="Words" value={words} />
          <StatBox label="Read time" value={`${readTime} min`} />
        </div>
      </div>
    </aside>
  );
}

function Group({ label, sub, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.4px', textTransform: 'uppercase', color: IE.muted, marginBottom: sub ? 3 : 10 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: IE.muted2, marginBottom: 10 }}>{sub}</div>}
      {children}
    </div>
  );
}

function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 42, height: 24, borderRadius: 100, border: 'none', cursor: 'pointer',
      background: on ? IE.coral : IE.muted2, position: 'relative', transition: 'background 0.2s', flexShrink: 0, padding: 0,
    }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s cubic-bezier(.2,.8,.2,1)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </button>
  );
}

function StatBox({ label, value }) {
  return (
    <div style={{ flex: 1, background: IE.bgSoft, border: `1px solid ${IE.border}`, borderRadius: 10, padding: '12px 14px' }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: IE.muted, marginBottom: 5 }}>{label}</div>
      <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 20, fontWeight: 800, color: IE.dark, letterSpacing: '-0.5px' }}>{value}</div>
    </div>
  );
}

Object.assign(window, {
  IE, IE_CATEGORIES, EIcon,
  InsightsEditor, EditorTopBar, PublishMenu, CoverPreview, TextareaAuto,
  FormatToolbar, ToolBtn, BodyEditor, SettingsPanel, Group, Toggle, StatBox,
});
