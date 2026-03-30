import type { TextareaHTMLAttributes } from 'react'
import styles from './Textarea.module.css'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = ({ label, error, id, ...rest }: Props) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label} htmlFor={inputId}>{label}</label>}
      <textarea
        id={inputId}
        className={`${styles.textarea} ${error ? styles.error : ''}`}
        rows={4}
        {...rest}
      />
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  )
}
