import { useRef, useEffect, type TextareaHTMLAttributes } from 'react'
import styles from './Textarea.module.css'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = ({ label, error, id, value, onChange, ...rest }: Props) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  const ref = useRef<HTMLTextAreaElement>(null)

  // Auto-grow so all content stays visible as you type (capped by CSS max-height, then scrolls).
  const resize = () => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  useEffect(() => { resize() }, [value])

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label} htmlFor={inputId}>{label}</label>}
      <textarea
        ref={ref}
        id={inputId}
        className={`${styles.textarea} ${error ? styles.error : ''}`}
        value={value}
        onChange={(e) => { onChange?.(e); resize() }}
        {...rest}
      />
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  )
}
