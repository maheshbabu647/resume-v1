
// CFP Hero v3 — Layered resume composition, editorial feel

function HeroV3({ tweaks }) {
  const [atsScore, setAtsScore] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);
  const [inputFocused, setInputFocused] = React.useState(false);
  const [inputVal, setInputVal] = React.useState('');

  React.useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), 100);
    const t2 = setTimeout(() => {
      let s = 0;
      const iv = setInterval(() => {
        s += 3;
        if (s >= 94) { s = 94; clearInterval(iv); }
        setAtsScore(s);
      }, 18);
      return () => clearInterval(iv);
    }, 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const accent = tweaks?.accentColor || '#FF3800';
  const fadeIn = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'none' : 'translateY(22px)',
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <section style={{
      background: '#F6F3EE',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 'clamp(100px,10vh,130px) clamp(20px,5vw,72px) 64px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle dot texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: 0.5,
      }} />

      {/* Giant background number — depth layer */}
      <div style={{
        position: 'absolute', top: '50%', right: -40,
        transform: 'translateY(-56%)',
        fontFamily: "'Syne', sans-serif", fontWeight: 800,
        fontSize: 'clamp(300px, 35vw, 500px)',
        color: 'rgba(0,0,0,0.028)',
        lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
        letterSpacing: '-20px',
      }}>94</div>

      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px, 6vw, 96px)', alignItems: 'center' }}>

          {/* ── LEFT ─────────────────────────────────────── */}
          <div>
            {/* Label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, ...fadeIn(0) }}>
              <div style={{ width: 28, height: 1.5, background: accent }} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: accent }}>AI Career Platform</span>
            </div>

            {/* Headline — weight contrast */}
            <div style={{ marginBottom: 28, ...fadeIn(80) }}>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 400,
                fontSize: 'clamp(38px, 5vw, 66px)',
                color: 'rgba(9,9,15,0.4)', letterSpacing: '-2px', lineHeight: 1.02,
              }}>Apply for 10 jobs.</div>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: 'clamp(38px, 5vw, 66px)',
                color: '#09090F', letterSpacing: '-2.5px', lineHeight: 0.98,
              }}>Not one<br />resume.</div>
            </div>

            {/* Sub */}
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 16.5, lineHeight: 1.72,
              color: '#6B6B7E', margin: '0 0 44px', maxWidth: 420,
              ...fadeIn(160),
            }}>
              Paste a job description. Get a resume that passes ATS, matches keywords, and actually reaches a human — in under 3 minutes.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', marginBottom: 48, ...fadeIn(240) }}>
              <a href="CareerForgePro%20Auth.html?view=signup" style={{
                background: accent, color: '#fff', border: 'none', cursor: 'pointer',
                padding: '15px 32px', fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600, fontSize: 15, letterSpacing: '0.1px', textDecoration: 'none',
                display: 'inline-block',
                transition: 'opacity 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { e.target.style.opacity = '0.88'; e.target.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.target.style.opacity = '1'; e.target.style.transform = 'none'; }}
              >Build My ATS Resume — Free</a>

              <a href="CareerForgePro%20App.html" style={{
                background: 'transparent', color: '#09090F', cursor: 'pointer',
                padding: '14px 0', fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 500, fontSize: 15, border: 'none', textDecoration: 'none',
                borderBottom: '1.5px solid rgba(9,9,15,0.25)',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.target.style.borderColor = '#09090F'}
              onMouseLeave={e => e.target.style.borderColor = 'rgba(9,9,15,0.25)'}
              >See ATS templates →</a>
            </div>

            {/* Micro stats */}
            <div style={{ display: 'flex', gap: 0, ...fadeIn(320) }}>
              {[
                { n: '2,400+', l: 'Resumes built' },
                { n: '94%', l: 'Avg ATS score' },
                { n: '< 3 min', l: 'Per resume' },
              ].map(({ n, l }, i) => (
                <div key={l} style={{
                  paddingRight: 28, marginRight: 28,
                  borderRight: i < 2 ? '1px solid rgba(9,9,15,0.12)' : 'none',
                }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: '#09090F', letterSpacing: '-0.8px', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: '#9898A8', marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: LAYERED COMPOSITION ───────────────── */}
          <ResumeCompositionV3 atsScore={atsScore} mounted={mounted} accent={accent} />
        </div>
      </div>
    </section>
  );
}

function ATSArc({ score, accent }) {
  // SVG half-circle arc gauge
  const cx = 70, cy = 70, r = 54;
  const circumference = Math.PI * r;
  const filled = (score / 100) * circumference;
  const color = score >= 80 ? '#22C55E' : score >= 60 ? '#F59E0B' : '#EF4444';

  // arc path: start from left (180°) go to right (0°)
  const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

  return (
    <svg width="140" height="80" viewBox="0 0 140 80" style={{ overflow: 'visible' }}>
      <path d={arcPath} fill="none" stroke="#EEEBE5" strokeWidth="9" strokeLinecap="round" />
      <path d={arcPath} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
        strokeDasharray={`${circumference}`}
        strokeDashoffset={`${circumference - filled}`}
        style={{ transition: 'stroke-dashoffset 0.04s linear' }}
      />
    </svg>
  );
}

function ResumeCompositionV3({ atsScore, mounted, accent }) {
  const keywords = ['React.js', 'REST APIs', 'Node.js', 'Agile', 'SQL'];
  const highlightedIndexes = [0, 2, 4]; // which lines get highlighted

  const floatIn = (delay = 0, y = 16) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'none' : `translateY(${y}px)`,
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <div style={{ position: 'relative', height: 580, ...floatIn(200, 0) }}>

      {/* ── Shadow doc (far back, rotated left) */}
      <div style={{
        position: 'absolute', top: 60, left: 10,
        width: 320, height: 430,
        background: '#EAE6DC',
        transform: 'rotate(-4.5deg)',
        zIndex: 0,
        ...floatIn(300),
      }} />

      {/* ── "Before" doc (middle, rotated slightly) */}
      <div style={{
        position: 'absolute', top: 30, left: 50,
        width: 330, height: 440,
        background: '#F9F7F3',
        border: '1px solid #E0DDD6',
        transform: 'rotate(-1.8deg)',
        zIndex: 1,
        padding: '24px 22px',
        ...floatIn(400),
      }}>
        <div style={{ opacity: 0.35 }}>
          <div style={{ height: 10, width: '70%', background: '#CCC', borderRadius: 2, marginBottom: 8 }} />
          <div style={{ height: 6, width: '45%', background: '#DDD', borderRadius: 2, marginBottom: 20 }} />
          {[80, 65, 75, 60, 70, 55, 65].map((w, i) => (
            <div key={i} style={{ height: 5, width: `${w}%`, background: '#DDD', borderRadius: 2, marginBottom: 6 }} />
          ))}
        </div>
        {/* "Before" label */}
        <div style={{
          position: 'absolute', top: 12, right: 14,
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, fontWeight: 600,
          letterSpacing: '1px', textTransform: 'uppercase', color: '#BBB',
        }}>Before</div>
      </div>

      {/* ── Main "After" resume (front, sharp) */}
      <div style={{
        position: 'absolute', top: 0, left: 80,
        width: 340, height: 455,
        background: '#FFFFFF',
        boxShadow: '0 28px 72px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.06)',
        transform: 'rotate(1.2deg)',
        zIndex: 2,
        padding: '28px 24px',
        animation: mounted ? 'heroFloat 5s ease-in-out infinite' : 'none',
        ...floatIn(500),
      }}>
        {/* Resume header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 3, height: 44, background: accent, flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: '#09090F', letterSpacing: '-0.3px' }}>Arjun Mehta</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10.5, color: '#9898A8', marginTop: 2 }}>Frontend Engineer · Mumbai</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: '#BBB', marginTop: 1 }}>arjun@email.com · github.com/arjun</div>
          </div>
        </div>

        <div style={{ height: 1, background: '#EEEBE5', marginBottom: 14 }} />

        {/* Section: Experience */}
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 8.5, fontWeight: 700, letterSpacing: '1.8px', color: accent, textTransform: 'uppercase', marginBottom: 8 }}>Experience</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ height: 7, width: '48%', background: '#1a1a2e', borderRadius: 2, opacity: 0.7 }} />
          <div style={{ height: 7, width: '22%', background: '#E8E5E0', borderRadius: 2 }} />
        </div>
        {/* Lines with keyword highlights */}
        {[
          { w: 90, highlight: true, word: 'Built React.js dashboards' },
          { w: 76, highlight: false },
          { w: 84, highlight: true, word: 'Designed REST APIs with Node.js' },
          { w: 68, highlight: false },
        ].map((line, i) => (
          <div key={i} style={{ marginBottom: 5, position: 'relative' }}>
            {line.highlight ? (
              <div style={{ height: 6, width: `${line.w}%`, background: `${accent}25`, borderRadius: 2, border: `1px solid ${accent}40` }}>
                <div style={{ position: 'absolute', left: 6, top: -1, fontFamily: "'Space Grotesk', sans-serif", fontSize: 7.5, color: accent, fontWeight: 600, whiteSpace: 'nowrap' }}>{line.word}</div>
              </div>
            ) : (
              <div style={{ height: 5, width: `${line.w}%`, background: '#E8E5E0', borderRadius: 2 }} />
            )}
          </div>
        ))}

        <div style={{ height: 1, background: '#EEEBE5', margin: '12px 0' }} />

        {/* Education */}
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 8.5, fontWeight: 700, letterSpacing: '1.8px', color: accent, textTransform: 'uppercase', marginBottom: 8 }}>Education</div>
        <div style={{ height: 7, width: '55%', background: '#1a1a2e', borderRadius: 2, opacity: 0.6, marginBottom: 5 }} />
        <div style={{ height: 5, width: '40%', background: '#E8E5E0', borderRadius: 2 }} />

        <div style={{ height: 1, background: '#EEEBE5', margin: '12px 0' }} />

        {/* Skills */}
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 8.5, fontWeight: 700, letterSpacing: '1.8px', color: accent, textTransform: 'uppercase', marginBottom: 8 }}>Skills</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {['React.js', 'Node.js', 'SQL', 'REST APIs', 'Agile', 'Git'].map(s => (
            <span key={s} style={{
              background: `${accent}15`, color: accent,
              padding: '2px 7px', fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 8.5, fontWeight: 600,
            }}>{s}</span>
          ))}
        </div>

        {/* After label */}
        <div style={{
          position: 'absolute', top: 12, right: 14,
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, fontWeight: 600,
          letterSpacing: '1px', textTransform: 'uppercase', color: '#22C55E',
        }}>AI Optimised</div>

        {/* Bottom */}
        <div style={{ position: 'absolute', bottom: 14, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 8.5, color: '#BBB' }}>For: Razorpay Frontend Dev</span>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 8.5, color: accent, fontWeight: 600 }}>↓ Download PDF</span>
        </div>
      </div>

      {/* ── ATS Score widget (floating top-right) */}
      <div style={{
        position: 'absolute', top: -24, right: 0, zIndex: 4,
        background: '#FFFFFF',
        boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
        padding: '20px 24px 14px',
        textAlign: 'center',
        minWidth: 148,
        ...floatIn(800),
      }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 600, color: '#9898A8', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 6 }}>ATS Score</div>
        <ATSArc score={atsScore} accent={accent} />
        <div style={{
          marginTop: -18,
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: 38, color: '#09090F', letterSpacing: '-1.5px', lineHeight: 1,
        }}>{atsScore}</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10.5, color: atsScore >= 80 ? '#22C55E' : '#F59E0B', fontWeight: 600, marginTop: 4 }}>
          {atsScore >= 80 ? '✓ Excellent match' : atsScore >= 50 ? 'Good' : 'Optimising…'}
        </div>
      </div>

      {/* ── Floating keyword chips */}
      {[
        { kw: 'React.js', top: 180, right: -14, delay: 900 },
        { kw: 'REST APIs', top: 240, right: -28, delay: 1000 },
        { kw: 'Agile', top: 300, right: -8, delay: 1100 },
      ].map(({ kw, top, right, delay }) => (
        <div key={kw} style={{
          position: 'absolute', top, right, zIndex: 5,
          background: '#fff', border: `1px solid ${accent}30`,
          padding: '5px 10px',
          display: 'flex', alignItems: 'center', gap: 5,
          boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
          ...floatIn(delay),
        }}>
          <div style={{ width: 5, height: 5, background: '#22C55E', flexShrink: 0 }} />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 600, color: '#09090F', whiteSpace: 'nowrap' }}>{kw} matched</span>
        </div>
      ))}

      {/* ── Time taken badge (bottom) */}
      <div style={{
        position: 'absolute', bottom: 20, left: 10, zIndex: 5,
        background: '#09090F', color: '#F6F3EE',
        padding: '9px 16px',
        display: 'flex', alignItems: 'center', gap: 8,
        ...floatIn(1200),
      }}>
        <div style={{ width: 6, height: 6, background: accent, flexShrink: 0 }} />
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 500 }}>Generated in 2 min 47 sec</span>
      </div>

    </div>
  );
}

Object.assign(window, { HeroV3, ATSArc, ResumeCompositionV3 });
