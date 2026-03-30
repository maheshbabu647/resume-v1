import type { InputHTMLAttributes } from 'react'
import styles from './Input.module.css'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = ({ label, error, hint, id, ...rest }: Props) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label} htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        className={`${styles.input} ${error ? styles.error : ''}`}
        {...rest}
      />
      {error && <span className={styles.errorMsg}>{error}</span>}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
    </div>
  )
}
