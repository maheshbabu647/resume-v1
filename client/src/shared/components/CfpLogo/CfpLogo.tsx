import { Link } from 'react-router-dom'
import styles from './CfpLogo.module.css'

interface CfpLogoProps {
  compact?: boolean
  className?: string
  onClick?: () => void
}

export const CfpLogo = ({ compact = false, className = '', onClick }: CfpLogoProps) => (
  <Link to="/" className={`${styles.logoLink} ${className}`} aria-label="CareerForge home" onClick={onClick}>
    <div className={styles.mark}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M2 11L5 6L7.5 8.5L10 4L12.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    {!compact && <span className={styles.wordmark}>CareerForge</span>}
  </Link>
)
