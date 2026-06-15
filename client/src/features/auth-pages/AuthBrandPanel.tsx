import { useEffect, useState } from 'react'
import styles from './AuthBrandPanel.module.css'

type AuthView = 'signup' | 'login' | 'verify' | 'forgot' | 'reset'

interface AuthBrandPanelProps {
  view: AuthView
}

const TESTIMONIALS = [
  {
    quote: 'Got 3 interview calls in the first week after my ATS score jumped from 41 to 89.',
    name: 'Priya Sharma',
    role: 'Frontend Engineer',
    company: 'Razorpay',
    initials: 'PS',
  },
  {
    quote: 'I come back every time I apply somewhere new. Tailoring takes three minutes.',
    name: 'Arjun Kapoor',
    role: 'Product Manager',
    company: 'Swiggy',
    initials: 'AK',
  },
  {
    quote: 'Finally, AI edits I can trust — I see exactly what changed before I commit to it.',
    name: 'Mehul Patel',
    role: 'Senior SDE',
    company: 'Flipkart',
    initials: 'MP',
  },
]

const COMPANIES = ['Razorpay', 'Swiggy', 'CRED', 'Flipkart', 'PhonePe', 'Zomato', 'Meesho']

const PICK: Record<AuthView, number> = { signup: 0, login: 1, verify: 2, forgot: 0, reset: 0 }

export function AuthBrandPanel({ view }: AuthBrandPanelProps) {
  const initial = PICK[view] ?? 0
  const [pick, setPick] = useState(initial)

  useEffect(() => {
    setPick(initial)
  }, [initial])

  useEffect(() => {
    const id = setInterval(() => {
      setPick((p) => (p + 1) % TESTIMONIALS.length)
    }, 6000)
    return () => clearInterval(id)
  }, [])

  const t = TESTIMONIALS[pick]

  return (
    <div className={styles.panel}>
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />
      <div className={styles.glowDrift1} />
      <div className={styles.glowDrift2} />
      <div className={styles.dots} />

      <div className={styles.top}>
        <div className={styles.eyebrow}>CareerForge</div>
        <h2 className={styles.headline}>
          The resume that<br />gets you <span className={styles.headlineAccent}>noticed.</span>
        </h2>
        <p className={styles.sub}>
          Built with the people who got hired — refined every week as the ATS landscape shifts.
        </p>
      </div>

      <div className={styles.testimonial}>
        <div className={styles.quoteMark}>&ldquo;</div>
        <div key={pick} className={styles.quoteFade}>
          <div className={styles.quoteText}>{t.quote}</div>
          <div className={styles.quoteAuthor}>
            <div className={styles.quoteAvatar}>{t.initials}</div>
            <div>
              <div className={styles.quoteName}>{t.name}</div>
              <div className={styles.quoteRole}>
                {t.role}<span className={styles.quoteSep}>&middot;</span>{t.company}
              </div>
            </div>
            <div className={styles.quoteDots}>
              {TESTIMONIALS.map((_, i) => (
                <div key={i} className={`${styles.quoteDot} ${i === pick ? styles.quoteDotActive : ''}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.companies}>
        <div className={styles.companiesLabel}>Members now work at</div>
        <div className={styles.companiesRow}>
          {COMPANIES.map((co) => (
            <span key={co} className={styles.companyName}>{co}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
