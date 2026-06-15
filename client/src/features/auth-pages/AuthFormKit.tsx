import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import styles from './AuthFormKit.module.css'

interface AuthHeadingProps {
  pretitle?: string
  title: ReactNode
  sub?: ReactNode
}

export function AuthHeading({ pretitle, title, sub }: AuthHeadingProps) {
  return (
    <div className={styles.heading}>
      {pretitle && <div className={styles.pretitle}>{pretitle}</div>}
      <h1 className={styles.title}>{title}</h1>
      {sub && <p className={styles.sub}>{sub}</p>}
    </div>
  )
}

export function AuthDivider({ label = 'or' }: { label?: string }) {
  return (
    <div className={styles.divider}>
      <div className={styles.dividerLine} />
      <span className={styles.dividerLabel}>{label}</span>
      <div className={styles.dividerLine} />
    </div>
  )
}

export function OAuthRow({ onGoogleClick }: { onGoogleClick: () => void }) {
  return (
    <div className={styles.oauthRow}>
      <button type="button" className={styles.oauthBtn} onClick={onGoogleClick}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.98h3.86c2.26-2.09 3.56-5.17 3.56-8.8z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-2.98c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.09C3.26 21.3 7.31 24 12 24z" />
          <path fill="#FBBC05" d="M5.27 14.31c-.25-.72-.39-1.49-.39-2.31s.14-1.59.39-2.31V6.6H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.4l4-3.09z" />
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.27 6.6l4 3.09c.95-2.85 3.6-4.94 6.73-4.94z" />
        </svg>
        Continue with Google
      </button>
    </div>
  )
}

const STRENGTH_CHECKS = [
  { test: (pw: string) => pw.length >= 8, label: '8+ characters' },
  { test: (pw: string) => /[A-Z]/.test(pw), label: 'Uppercase letter' },
  { test: (pw: string) => /[0-9]/.test(pw), label: 'Number' },
  { test: (pw: string) => /[^A-Za-z0-9]/.test(pw), label: 'Symbol' },
]

const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Strong', 'Excellent']
const STRENGTH_CLASSES = ['tooWeak', 'weak', 'fair', 'strong', 'excellent'] as const
const STRENGTH_TEXT_CLASSES = ['textTooWeak', 'textWeak', 'textFair', 'textStrong', 'textExcellent'] as const

export function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null

  const passedCount = STRENGTH_CHECKS.filter((c) => c.test(password)).length
  const barClass = styles[STRENGTH_CLASSES[passedCount]]
  const textClass = styles[STRENGTH_TEXT_CLASSES[passedCount]]

  return (
    <div className={styles.strength}>
      <div className={styles.strengthBars}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`${styles.strengthBar} ${i < passedCount ? barClass : ''}`}
          />
        ))}
      </div>
      <div className={styles.strengthLabel}>
        <span className={textClass}>{STRENGTH_LABELS[passedCount]}</span>
      </div>
      <div className={styles.strengthChecks}>
        {STRENGTH_CHECKS.map((c) => {
          const ok = c.test(password)
          return (
            <div key={c.label} className={`${styles.strengthCheck} ${ok ? styles.strengthCheckOk : ''}`}>
              <span className={styles.strengthDot}>{ok && <Check size={8} strokeWidth={3} />}</span>
              {c.label}
            </div>
          )
        })}
      </div>
    </div>
  )
}
