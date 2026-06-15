import type { InputHTMLAttributes, ReactNode } from 'react'
import styles from './Input.module.css'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  hintAction?: ReactNode
  leftIcon?: ReactNode
  rightElement?: ReactNode
}

export const Input = ({ label, error, hint, hintAction, leftIcon, rightElement, id, ...rest }: Props) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className={styles.wrapper}>
      {(label || hintAction) && (
        <div className={styles.labelRow}>
          {label && <label className={styles.label} htmlFor={inputId}>{label}</label>}
          {hintAction}
        </div>
      )}
      <div className={`${styles.inputBox} ${error ? styles.error : ''}`}>
        {leftIcon && <span className={styles.iconLeft}>{leftIcon}</span>}
        <input
          id={inputId}
          className={styles.input}
          {...rest}
        />
        {rightElement && <span className={styles.iconRight}>{rightElement}</span>}
      </div>
      {error && <span className={styles.errorMsg}>{error}</span>}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
    </div>
  )
}
