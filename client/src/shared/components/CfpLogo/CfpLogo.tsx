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
      <svg width="30" height="30" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M42,21 A13,13 0 1 0 42,43" stroke="white" strokeWidth="6" strokeLinecap="round" />
        <line x1="42" y1="21" x2="48" y2="21" stroke="white" strokeWidth="6" strokeLinecap="round" />
        <line x1="42" y1="32" x2="47" y2="32" stroke="white" strokeWidth="6" strokeLinecap="round" />
      </svg>
    </div>
    {!compact && <span className={styles.wordmark}>CareerForge</span>}
  </Link>
)
