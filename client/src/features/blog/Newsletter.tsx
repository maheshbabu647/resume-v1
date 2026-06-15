import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import styles from './Newsletter.module.css'

export function Newsletter() {
  const [email, setEmail] = useState('')

  return (
    <div className={styles.newsletter}>
      <div className={styles.newsletterInner}>
        <div className={styles.badge}>
          <Sparkles size={12} color="#FF5C35" />
          Free · 1 email per week · No spam
        </div>
        <h2 className={styles.newsletterTitle}>
          Get one career-changing tip<br />in your inbox each Sunday.
        </h2>
        <p className={styles.newsletterSubtitle}>
          Resume teardowns, JD breakdowns, ATS fixes. Practical advice you can use the same day.
        </p>
        <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
          <input
            className={styles.newsletterInput}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
          />
          <button className={styles.newsletterBtn} type="submit">Subscribe</button>
        </form>
        <div className={styles.newsletterFoot}>Free forever · Unsubscribe anytime</div>
      </div>
    </div>
  )
}
