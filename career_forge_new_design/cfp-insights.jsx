
// CareerForgePro — Insights (blog) index + article

const I = {
  brand: '#5046E4', brandDark: '#3730D0', brandLight: '#EEEDFF', brandSoft: '#F4F2FF',
  coral: '#FF5C35', coralLight: '#FFF1ED',
  dark: '#0F0E2A', body: '#44445A', muted: '#8888A5', muted2: '#B5B5C8',
  border: '#E8E6F4', borderSoft: '#F0EEF9',
  bg: '#FFFFFF', bgSoft: '#F7F6FF', bgWarm: '#FFFAF8',
  green: '#16A34A', amber: '#F59E0B',
};

const CATEGORIES = [
  { id: 'all', label: 'All', col: I.dark },
  { id: 'resume', label: 'Resume Tips', col: I.brand },
  { id: 'ats', label: 'ATS Hacks', col: I.coral },
  { id: 'interview', label: 'Interview Prep', col: '#7C3AED' },
  { id: 'job-search', label: 'Job Search', col: '#0891B2' },
  { id: 'career-stories', label: 'Career Stories', col: I.green },
  { id: 'salary', label: 'Salary Negotiation', col: I.amber },
];

const ARTICLES = [
  { slug: 'ats-resume-2026', cat: 'ats', title: 'Why your resume gets rejected in 7 seconds (and how to fix it)', sub: 'A practical breakdown of how Applicant Tracking Systems actually parse your resume — with the 4 fixes that take you from rejected to shortlisted.', author: 'Anu Patel', avatar: 'A', role: 'Founder, CareerForgePro', date: 'Mar 12', read: 7, tag: 'Featured', type: 'editorial' },
  { slug: 'priya-razorpay', cat: 'career-stories', title: 'From 60 rejections to Razorpay in 9 weeks', sub: 'Priya was getting auto-rejected at every Indian fintech. Then she changed three things in her resume.', author: 'Priya S.', avatar: 'P', role: 'Frontend Engineer · Razorpay', date: 'Mar 10', read: 5, type: 'guest' },
  { slug: 'fresher-resume-2026', cat: 'resume', title: 'The fresher resume that actually gets read', sub: 'You don\'t have years of experience. That\'s fine. Here\'s how to structure 4 internships, 2 college projects and a hackathon win to look like 3 years of impact.', author: 'Anu Patel', avatar: 'A', role: 'Founder, CareerForgePro', date: 'Mar 8', read: 9, type: 'editorial' },
  { slug: 'system-design-interview', cat: 'interview', title: 'A 14-day system design plan for SDE-2 interviews', sub: 'Day-by-day breakdown of what to study, what to skip, and the 6 questions that get asked at every Indian unicorn.', author: 'Mehul Pandey', avatar: 'M', role: 'SDE-3 · Flipkart', date: 'Mar 6', read: 12, type: 'guest' },
  { slug: 'salary-india-2026', cat: 'salary', title: 'Negotiating salary in India: scripts that worked', sub: 'Five real scripts from people who got their offer raised by 18-40%. Plus the silent tactic that works better than any line.', author: 'Anu Patel', avatar: 'A', role: 'Founder, CareerForgePro', date: 'Mar 4', read: 6, type: 'editorial' },
  { slug: 'cold-emails-recruiters', cat: 'job-search', title: 'Cold emails to recruiters: 4 templates that get replies', sub: 'Most cold emails are ignored because they\'re about you. Here\'s how to write one that gets opened, replied to, and forwarded.', author: 'Tanvi Reddy', avatar: 'T', role: 'Tech Recruiter · ex-Swiggy', date: 'Mar 1', read: 5, type: 'guest' },
  { slug: 'keywords-not-keywords', cat: 'ats', title: 'Keyword stuffing is dead. Here\'s what works in 2026', sub: 'ATS systems got smarter. Pasting "React, React, React" into a skills section now hurts you. Here\'s the new rule.', author: 'Anu Patel', avatar: 'A', role: 'Founder, CareerForgePro', date: 'Feb 27', read: 4, type: 'editorial' },
  { slug: 'switching-from-non-tech', cat: 'career-stories', title: 'I switched from finance to PM in 11 months. Here\'s exactly how.', sub: 'No bootcamp, no MBA. Just a 90-day plan, 23 cold emails, and one well-tailored resume.', author: 'Arjun Kumar', avatar: 'A', role: 'PM · Swiggy', date: 'Feb 24', read: 8, type: 'guest' },
  { slug: 'cover-letter-myths', cat: 'resume', title: '5 cover letter myths recruiters wish you\'d stop believing', sub: 'No, recruiters don\'t want to hear that you\'re "passionate" or "results-driven". Here\'s what they actually read for.', author: 'Tanvi Reddy', avatar: 'T', role: 'Tech Recruiter · ex-Swiggy', date: 'Feb 21', read: 5, type: 'guest' },
];

function II({ name, size = 18, color = 'currentColor', sw = 1.7 }) {
  const p = {
    arrow: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    arrowL: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></>,
    sparkle: <><path d="M12 3l1.5 5L19 9.5 13.5 11 12 16l-1.5-5L5 9.5 10.5 8z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></>,
    twitter: <><path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517C16 18.443 19.5 14 19.5 9.5V8.4c0-.21.0-.42-.02-.63A6 6 0 0022 4.01z"/></>,
    linkedin: <><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></>,
    bookmark: <><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></>,
    share: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>,
    quote: <><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/></>,
    heart: <><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>{p[name]}</svg>;
}

function Logo() {
  return (
    <a href="CareerForgePro%20Homepage.html" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
      <div style={{ width: 30, height: 30, background: I.brand, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 11L5 6L7.5 8.5L10 4L12.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 16, color: I.dark, letterSpacing: '-0.3px' }}>CareerForgePro</span>
    </a>
  );
}

function Nav({ view, setView }) {
  return (
    <header style={{ borderBottom: `1px solid ${I.border}`, background: I.bg, position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'saturate(180%) blur(10px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 32 }}>
        <Logo />
        <nav style={{ display: 'flex', gap: 28, marginLeft: 8 }}>
          {[
            { l: 'Product', a: 'CareerForgePro%20Homepage.html#features' }, { l: 'Templates', a: 'CareerForgePro%20Homepage.html#features' },
            { l: 'Insights', a: 'CareerForgePro%20Insights.html', active: true }, { l: 'Pricing', a: 'CareerForgePro%20Homepage.html#pricing' },
          ].map(x => (
            <a key={x.l} href={x.a} onClick={e => { if (x.l === 'Insights') { e.preventDefault(); setView('index'); } }} style={{ fontSize: 13.5, fontWeight: x.active ? 700 : 500, color: x.active ? I.dark : I.body, textDecoration: 'none', position: 'relative' }}>
              {x.l}
              {x.active && <div style={{ position: 'absolute', bottom: -19, left: 0, right: 0, height: 2, background: I.brand, borderRadius: 1 }} />}
            </a>
          ))}
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="CareerForgePro%20Insights%20Editor.html" title="Admin: write an article" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: `1px solid ${I.border}`, fontSize: 13, fontWeight: 600, color: I.body, cursor: 'pointer', padding: '8px 13px', borderRadius: 9, textDecoration: 'none', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = I.brand; e.currentTarget.style.color = I.brand; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = I.border; e.currentTarget.style.color = I.body; }}>
            <II name="sparkle" size={13} color="currentColor" /> Write
          </a>
          <a href="CareerForgePro%20Auth.html" style={{ background: 'transparent', border: 'none', fontSize: 13.5, fontWeight: 500, color: I.body, cursor: 'pointer', padding: '8px 12px', textDecoration: 'none' }}>Log in</a>
          <a href="CareerForgePro%20App.html" style={{ background: I.coral, color: '#fff', border: 'none', borderRadius: 9, padding: '9px 18px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 14px ${I.coral}40`, textDecoration: 'none', display: 'inline-block' }}>Start free</a>
        </div>
      </div>
    </header>
  );
}

// ── SHELL ─────────────────────────────────────────────────────────
function InsightsShell({ view, setView, category, setCategory }) {
  return (
    <div>
      <Nav view={view} setView={setView} />
      {view === 'index' ? <IndexPage setView={setView} category={category} setCategory={setCategory} /> : <ArticlePage setView={setView} />}
      <Footer />
    </div>
  );
}

// ── INDEX ─────────────────────────────────────────────────────────
function IndexPage({ setView, category, setCategory }) {
  const [search, setSearch] = React.useState('');
  const featured = ARTICLES.find(a => a.tag === 'Featured');
  const filtered = ARTICLES.filter(a => {
    if (a === featured) return false;
    const matchCat = category === 'All' || CATEGORIES.find(c => c.id === a.cat)?.label === category;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.sub.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      {/* Hero */}
      <div style={{ background: I.bgSoft, borderBottom: `1px solid ${I.border}`, padding: '56px 32px 48px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: I.bg, border: `1px solid ${I.border}`, borderRadius: 100, padding: '5px 12px', marginBottom: 18, fontSize: 12, fontWeight: 600, color: I.body }}>
            <II name="sparkle" size={12} color={I.coral} /> Updated weekly · Free for everyone
          </div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(38px,5vw,58px)', letterSpacing: '-2px', lineHeight: 1.05, color: I.dark, margin: '0 0 16px', maxWidth: 760 }}>
            Land the job.<br/>Skip the trial-and-error.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: I.body, margin: 0, maxWidth: 580 }}>
            Resume tactics, ATS hacks, interview playbooks and real career stories — written by hiring managers, recruiters and people who've been where you are.
          </p>

          {/* Search + filters */}
          <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: I.bg, border: `1px solid ${I.border}`, borderRadius: 12, padding: '4px 4px 4px 16px', maxWidth: 520, boxShadow: `0 4px 16px ${I.brand}08` }}>
              <II name="search" size={16} color={I.muted} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles…" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '12px 0', fontSize: 14, color: I.dark }} />
              <button style={{ background: I.dark, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Search</button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => {
                const active = category === c.label;
                return (
                  <button key={c.id} onClick={() => setCategory(c.label)} style={{
                    background: active ? c.col : I.bg, color: active ? '#fff' : I.body,
                    border: `1px solid ${active ? c.col : I.border}`, borderRadius: 100,
                    padding: '7px 16px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}>
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Featured */}
      {featured && category === 'All' && !search && (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 32px 0' }}>
          <FeaturedCard a={featured} setView={setView} />
        </div>
      )}

      {/* Grid */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 32px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 24, color: I.dark, margin: 0, letterSpacing: '-0.6px' }}>
            {category === 'All' ? 'Latest articles' : category}
          </h2>
          <span style={{ fontSize: 13, color: I.muted }}>{filtered.length} article{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 }}>
          {filtered.map(a => <ArticleCard key={a.slug} a={a} setView={setView} />)}
        </div>
      </div>

      {/* Newsletter */}
      <Newsletter />

      {/* Guest authors */}
      <GuestStrip />
    </div>
  );
}

function FeaturedCard({ a, setView }) {
  const [hov, setHov] = React.useState(false);
  const cat = CATEGORIES.find(c => c.id === a.cat);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={() => setView('article')}
      style={{
        display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 0,
        background: I.bg, borderRadius: 18, overflow: 'hidden',
        border: `1px solid ${I.border}`, cursor: 'pointer',
        transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
        borderColor: hov ? I.brand + '50' : I.border,
        boxShadow: hov ? `0 18px 48px ${I.brand}12` : `0 4px 16px ${I.brand}06`,
        transform: hov ? 'translateY(-2px)' : 'none',
      }}>
      {/* Visual side */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg, ${I.brand} 0%, ${I.brandDark} 60%, #1F1A6B 100%)`,
        padding: 40, minHeight: 380, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div style={{ position: 'absolute', top: -60, right: -40, width: 280, height: 280, borderRadius: '50%', background: `radial-gradient(circle, ${I.coral}40 0%, transparent 70%)` }} />
        <div style={{ position: 'relative', display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: 100, padding: '5px 12px', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          <II name="sparkle" size={12} color={I.coral} /> Featured this week
        </div>
        {/* Big quote-style art */}
        <div style={{ position: 'relative', textAlign: 'center', padding: '20px 0' }}>
          <II name="quote" size={64} color="rgba(255,255,255,0.15)" sw={1.5} />
          <div style={{ fontFamily: "'Newsreader',serif', sans-serif", fontWeight: 600, fontSize: 30, lineHeight: 1.25, color: '#fff', margin: '12px 0', letterSpacing: '-0.5px' }}>
            "7 seconds is all your resume gets.<br/>Make every second count."
          </div>
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: `linear-gradient(135deg, ${I.coral}, ${I.coralLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#fff' }}>{a.avatar}</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 13.5 }}>{a.author}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{a.role}</div>
          </div>
        </div>
      </div>
      {/* Text side */}
      <div style={{ padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', background: cat.col + '15', color: cat.col, borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 18 }}>{cat.label}</div>
        <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 32, lineHeight: 1.15, letterSpacing: '-1.2px', color: I.dark, margin: '0 0 14px' }}>{a.title}</h3>
        <p style={{ fontSize: 15.5, lineHeight: 1.6, color: I.body, margin: '0 0 24px' }}>{a.sub}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12.5, color: I.muted, marginBottom: 24 }}>
          <span>{a.date}</span>
          <span style={{ width: 3, height: 3, background: I.muted2, borderRadius: '50%' }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><II name="clock" size={12} color={I.muted} /> {a.read} min read</span>
        </div>
        <button style={{ alignSelf: 'flex-start', background: I.dark, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          Read article <II name="arrow" size={14} color="#fff" sw={2.2} />
        </button>
      </div>
    </div>
  );
}

function ArticleCard({ a, setView }) {
  const [hov, setHov] = React.useState(false);
  const cat = CATEGORIES.find(c => c.id === a.cat);
  const isGuest = a.type === 'guest';
  return (
    <article onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={() => setView('article')}
      style={{ cursor: 'pointer', transition: 'transform 0.2s', transform: hov ? 'translateY(-3px)' : 'none' }}>
      <div style={{
        height: 200, borderRadius: 14, marginBottom: 16, overflow: 'hidden', position: 'relative',
        background: a.cat === 'career-stories' ? `linear-gradient(135deg, ${I.green}25, ${I.green}05)`
          : a.cat === 'ats' ? `linear-gradient(135deg, ${I.coral}25, ${I.coral}05)`
          : a.cat === 'interview' ? `linear-gradient(135deg, #7C3AED25, #7C3AED05)`
          : a.cat === 'job-search' ? `linear-gradient(135deg, #0891B225, #0891B205)`
          : a.cat === 'salary' ? `linear-gradient(135deg, ${I.amber}25, ${I.amber}05)`
          : `linear-gradient(135deg, ${I.brand}20, ${I.brand}05)`,
        border: `1px solid ${cat.col}20`,
        transition: 'box-shadow 0.2s',
        boxShadow: hov ? `0 16px 36px ${cat.col}15` : 'none',
      }}>
        {/* Decorative typographic art */}
        <div style={{ position: 'absolute', inset: 0, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ background: cat.col + '20', color: cat.col, borderRadius: 6, padding: '4px 9px', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{cat.label}</div>
            {isGuest && <div style={{ background: '#fff', color: cat.col, borderRadius: 6, padding: '3px 8px', fontSize: 10, fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase', border: `1px solid ${cat.col}30` }}>Guest</div>}
          </div>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 64, color: cat.col, opacity: 0.18, letterSpacing: '-3px', lineHeight: 1, alignSelf: 'flex-end' }}>
            {a.read}<span style={{ fontSize: 24, fontWeight: 600 }}>min</span>
          </div>
        </div>
      </div>
      <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 19, lineHeight: 1.25, letterSpacing: '-0.5px', color: I.dark, margin: '0 0 8px', textWrap: 'pretty' }}>{a.title}</h3>
      <p style={{ fontSize: 13.5, lineHeight: 1.6, color: I.body, margin: '0 0 14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.sub}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg, ${cat.col}, ${cat.col}80)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, color: '#fff' }}>{a.avatar}</div>
        <div style={{ fontSize: 12.5, color: I.body, fontWeight: 600 }}>{a.author}</div>
        <span style={{ width: 3, height: 3, background: I.muted2, borderRadius: '50%' }} />
        <span style={{ fontSize: 12.5, color: I.muted }}>{a.date}</span>
      </div>
    </article>
  );
}

// ── NEWSLETTER ────────────────────────────────────────────────────
function Newsletter() {
  const [email, setEmail] = React.useState('');
  return (
    <div style={{ background: I.bgSoft, borderTop: `1px solid ${I.border}`, padding: '64px 32px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: I.bg, border: `1px solid ${I.border}`, borderRadius: 100, padding: '5px 12px', marginBottom: 18, fontSize: 12, fontWeight: 600, color: I.body }}>
          <II name="sparkle" size={12} color={I.coral} /> Free · 1 email per week · No spam
        </div>
        <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(28px,3.4vw,40px)', letterSpacing: '-1.2px', color: I.dark, margin: '0 0 14px' }}>
          Get one career-changing tip<br/>in your inbox each Sunday.
        </h2>
        <p style={{ fontSize: 15.5, color: I.body, lineHeight: 1.6, margin: '0 0 28px', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
          Resume teardowns, JD breakdowns, salary scripts. From people who've actually hired and been hired.
        </p>
        <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: 8, maxWidth: 460, margin: '0 auto' }}>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" type="email"
            style={{ flex: 1, background: I.bg, border: `1.5px solid ${I.border}`, borderRadius: 10, padding: '13px 16px', fontSize: 14, color: I.dark, outline: 'none' }} />
          <button style={{ background: I.coral, color: '#fff', border: 'none', borderRadius: 10, padding: '13px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: `0 6px 16px ${I.coral}40`, whiteSpace: 'nowrap' }}>Subscribe</button>
        </form>
        <div style={{ marginTop: 16, fontSize: 12, color: I.muted }}>Join 2,400+ readers · Unsubscribe anytime</div>
      </div>
    </div>
  );
}

// ── GUEST STRIP ───────────────────────────────────────────────────
function GuestStrip() {
  return (
    <div style={{ borderTop: `1px solid ${I.border}`, padding: '64px 32px', background: I.bg }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: I.coral, marginBottom: 12 }}>Be on Insights</div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(26px,3vw,34px)', letterSpacing: '-1px', color: I.dark, margin: '0 0 12px' }}>Got a story? We want to publish it.</h2>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: I.body, margin: 0, maxWidth: 580, marginLeft: 'auto', marginRight: 'auto' }}>
            Switched careers? Negotiated a wild raise? Got the offer after 80 rejections? Share what worked. We'll edit it. You'll reach 12,000+ job-seekers.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { t: 'Career stories', d: 'How you actually got the offer. The real version, not the LinkedIn version.', col: I.green },
            { t: 'Hiring manager POV', d: 'You hire engineers, designers, PMs? Tell readers what actually catches your eye.', col: I.brand },
            { t: 'Specialty playbooks', d: 'Bootcamp grads, career-switchers, returnees, parents — your niche, your wisdom.', col: I.coral },
          ].map(b => (
            <div key={b.t} style={{ background: I.bg, border: `1px solid ${I.border}`, borderRadius: 14, padding: 20 }}>
              <div style={{ width: 8, height: 32, background: b.col, borderRadius: 100, marginBottom: 14 }} />
              <div style={{ fontWeight: 700, fontSize: 15, color: I.dark, marginBottom: 6 }}>{b.t}</div>
              <div style={{ fontSize: 13, color: I.body, lineHeight: 1.55 }}>{b.d}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button style={{ background: I.dark, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Pitch your story <II name="arrow" size={14} color="#fff" sw={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ARTICLE PAGE ──────────────────────────────────────────────────
function ArticlePage({ setView }) {
  const a = ARTICLES[0]; // featured
  const cat = CATEGORIES.find(c => c.id === a.cat);
  const [progress, setProgress] = React.useState(0);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const total = el.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY - el.offsetTop;
      setProgress(Math.max(0, Math.min(100, (scrolled / total) * 100)));
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={ref}>
      {/* Progress bar */}
      <div style={{ position: 'sticky', top: 65, height: 3, background: I.borderSoft, zIndex: 40 }}>
        <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${I.brand}, ${I.coral})`, transition: 'width 0.1s' }} />
      </div>

      {/* Back */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 32px 0' }}>
        <button onClick={() => setView('index')} style={{ background: 'none', border: 'none', color: I.muted, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, padding: 0 }}>
          <II name="arrowL" size={14} color={I.muted} /> All Insights
        </button>
      </div>

      {/* Article header */}
      <article style={{ maxWidth: 760, margin: '0 auto', padding: '24px 32px 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', background: cat.col + '15', color: cat.col, borderRadius: 6, padding: '5px 11px', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 24 }}>{cat.label}</div>
        <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(34px,4.4vw,52px)', letterSpacing: '-1.8px', lineHeight: 1.1, color: I.dark, margin: '0 0 18px', textWrap: 'balance' }}>
          {a.title}
        </h1>
        <p style={{ fontFamily: "'Newsreader',serif", fontSize: 21, lineHeight: 1.5, color: I.body, margin: '0 0 32px', fontStyle: 'italic', textWrap: 'pretty' }}>
          {a.sub}
        </p>
        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 28, borderBottom: `1px solid ${I.border}`, marginBottom: 40 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${I.brand}, ${I.coral})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#fff' }}>{a.avatar}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: I.dark }}>{a.author}</div>
            <div style={{ fontSize: 12.5, color: I.muted }}>{a.role} · {a.date} · {a.read} min read</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { i: 'bookmark' }, { i: 'share' }, { i: 'twitter' }, { i: 'linkedin' },
            ].map((b, i) => (
              <button key={i} style={{ width: 36, height: 36, background: I.bg, border: `1px solid ${I.border}`, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: I.muted, transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = I.brand; e.currentTarget.style.color = I.brand; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = I.border; e.currentTarget.style.color = I.muted; }}>
                <II name={b.i} size={15} color="currentColor" />
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ fontFamily: "'Newsreader',serif", fontSize: 19, lineHeight: 1.75, color: I.dark, textWrap: 'pretty' }}>
          <p style={{ margin: '0 0 24px', fontSize: 22, lineHeight: 1.5 }}><span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 64, float: 'left', lineHeight: 0.9, marginRight: 10, marginTop: 6, color: I.brand }}>H</span>iring managers don't read your resume. Algorithms do. Then humans skim what's left for an average of 7.4 seconds.</p>
          <p style={{ margin: '0 0 24px' }}>If your resume isn't built for both audiences, you're competing with people who are. And that's why a perfectly qualified candidate gets rejected for a role they'd ace — while someone less experienced lands the interview.</p>

          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 30, letterSpacing: '-0.8px', color: I.dark, margin: '40px 0 16px' }}>How ATS actually parses your resume</h2>
          <p style={{ margin: '0 0 24px' }}>Modern ATS systems don't just scan for keywords anymore. They use structured parsing — pulling your name, contact info, experience, education and skills into a database. If they can't parse a section, that section may as well not exist.</p>

          {/* Pull quote */}
          <div style={{ borderLeft: `4px solid ${I.brand}`, paddingLeft: 24, margin: '36px 0', background: I.brandSoft, borderRadius: '0 12px 12px 0', padding: '20px 24px' }}>
            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 22, lineHeight: 1.4, color: I.dark, letterSpacing: '-0.5px' }}>
              "If the ATS can't read it, the recruiter never sees it. Period."
            </div>
            <div style={{ fontSize: 13, color: I.muted, marginTop: 10, fontWeight: 600 }}>— Tanvi R., Tech Recruiter (ex-Swiggy)</div>
          </div>

          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 30, letterSpacing: '-0.8px', color: I.dark, margin: '40px 0 16px' }}>The 4 fixes that move the needle</h2>
          <p style={{ margin: '0 0 24px' }}>I've reviewed over 4,000 resumes through CareerForgePro. The same four issues account for 80% of rejections. Fix these and your ATS score jumps from "auto-reject" to "shortlist" in an afternoon.</p>

          {/* Numbered list */}
          {[
            { n: '01', t: 'Use a single-column layout', d: 'Two-column resumes look beautiful in design tools. ATS systems read them top-to-bottom across both columns and end up with garbled text. Stick to one column. Save the design for your portfolio site.' },
            { n: '02', t: 'Match the job description vocabulary', d: 'If the JD says "agile" and your resume says "scrum", you might lose points — even though they overlap. Use their words for the same skill.' },
            { n: '03', t: 'Quantify everything you can', d: 'Not just engineers. Designers, marketers, ops — numbers cut through. "Improved conversion" is invisible. "Improved checkout conversion 22% in 6 weeks" is memorable.' },
            { n: '04', t: 'Save as PDF, but keep it simple', d: 'Tables, text boxes and decorative graphics break parsing. Plain PDF with selectable text is the sweet spot. Test by copy-pasting your own resume into a notepad — if the order makes sense, ATS will read it fine.' },
          ].map(item => (
            <div key={item.n} style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
              <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 36, color: I.coral, lineHeight: 1, letterSpacing: '-1px', minWidth: 50 }}>{item.n}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 21, color: I.dark, margin: '0 0 8px', letterSpacing: '-0.4px' }}>{item.t}</h3>
                <p style={{ margin: 0 }}>{item.d}</p>
              </div>
            </div>
          ))}

          {/* Inline soft CTA */}
          <SoftCTA />

          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 30, letterSpacing: '-0.8px', color: I.dark, margin: '40px 0 16px' }}>The 7 seconds, decoded</h2>
          <p style={{ margin: '0 0 24px' }}>Eye-tracking studies of recruiters show a predictable pattern. They scan your name, your most recent role, the companies you've worked at, and bullet points #1–3 of your most recent job. That's it. Everything else is filler unless something pulls them deeper.</p>
          <p style={{ margin: '0 0 24px' }}>Front-load every section. Your strongest bullet is your first bullet. Your strongest project is your first project. Your most relevant skill is the leftmost skill in the row. This is the difference between "I'm qualified" and "I'm interesting".</p>

          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 30, letterSpacing: '-0.8px', color: I.dark, margin: '40px 0 16px' }}>What to do this weekend</h2>
          <p style={{ margin: '0 0 24px' }}>Take 90 minutes. Open a job description for a role you actually want. Run your current resume through an ATS checker. Apply the four fixes above to your top three bullets. Recheck. The score will move 15–20 points.</p>
          <p style={{ margin: '0 0 24px' }}>That's it. That's the article. The rest is just discipline — applying these fixes to every job, not just the one you're emotionally invested in.</p>

          {/* Author block */}
          <div style={{ marginTop: 48, padding: 24, background: I.bgSoft, border: `1px solid ${I.border}`, borderRadius: 14, display: 'flex', gap: 16, alignItems: 'center', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg, ${I.brand}, ${I.coral})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, color: '#fff', flexShrink: 0 }}>{a.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: I.dark }}>{a.author}</div>
              <div style={{ fontSize: 13, color: I.muted, marginBottom: 8 }}>{a.role}</div>
              <div style={{ fontSize: 13, color: I.body, lineHeight: 1.55 }}>Building CareerForgePro after watching too many friends get auto-rejected. Writes about hiring, ATS, and the weird gap between what gets people hired and what we tell them to do.</div>
            </div>
            <button style={{ background: I.dark, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Follow</button>
          </div>
        </div>
      </article>

      {/* Related */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px 0' }}>
        <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 24, color: I.dark, margin: '0 0 24px', letterSpacing: '-0.6px' }}>Keep reading</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
          {ARTICLES.slice(1, 4).map(x => <ArticleCard key={x.slug} a={x} setView={setView} />)}
        </div>
      </div>

      <Newsletter />
    </div>
  );
}

function SoftCTA() {
  return (
    <div style={{
      margin: '40px 0', padding: 28,
      background: `linear-gradient(135deg, ${I.brandSoft} 0%, ${I.coralLight} 100%)`,
      border: `1px solid ${I.brand}25`,
      borderRadius: 16, fontFamily: "'Plus Jakarta Sans',sans-serif",
      display: 'flex', alignItems: 'center', gap: 20,
    }}>
      <div style={{ width: 48, height: 48, background: I.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 4px 12px ${I.brand}20` }}>
        <II name="sparkle" size={20} color={I.brand} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 15.5, color: I.dark, marginBottom: 4 }}>Test these fixes on your own resume.</div>
        <div style={{ fontSize: 13.5, color: I.body, lineHeight: 1.5 }}>Drop your resume into CareerForgePro and see your ATS score, with a section-by-section breakdown. Free.</div>
      </div>
      <button style={{ background: I.coral, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', boxShadow: `0 6px 16px ${I.coral}40`, whiteSpace: 'nowrap' }}>Try it free →</button>
    </div>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: I.dark, color: '#fff', padding: '56px 32px 32px', marginTop: 0 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 30, height: 30, background: I.brand, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 11L5 6L7.5 8.5L10 4L12.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: 16 }}>CareerForgePro</span>
            </div>
            <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, maxWidth: 340 }}>
              The fastest way to a tailored, ATS-ready resume. Built in India, used worldwide.
            </div>
          </div>
          {[
            { t: 'Product', l: ['Resume Builder', 'Cover Letter', 'ATS Score', 'Templates', 'Pricing'] },
            { t: 'Company', l: ['About', 'Insights', 'Careers', 'Press'] },
            { t: 'Legal', l: ['Terms', 'Privacy', 'Cookies', 'Refund Policy'] },
          ].map(c => (
            <div key={c.t}>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>{c.t}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                {c.l.map(x => <li key={x}><a href="#" style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>{x}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5, color: 'rgba(255,255,255,0.55)' }}>
          <span>© 2026 CareerForgePro. Made for everyone who's ever been ghosted by a recruiter.</span>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.7)' }}><II name="twitter" size={16} color="currentColor" /></a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.7)' }}><II name="linkedin" size={16} color="currentColor" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  I, II, Logo, Nav, CATEGORIES, ARTICLES,
  InsightsShell, IndexPage, FeaturedCard, ArticleCard, Newsletter, GuestStrip,
  ArticlePage, SoftCTA, Footer,
});
