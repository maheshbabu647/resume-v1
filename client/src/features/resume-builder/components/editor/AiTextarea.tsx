import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { apiClient } from '@/shared/lib/apiClient'
import { AiSuggestDialog } from './AiSuggestDialog'
import styles from './AiTextarea.module.css'
import type { TextareaHTMLAttributes } from 'react'

interface AiTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  sectionKey: string
  fieldName: string
  currentValue: string
  contextFields?: Record<string, string>
  onValueChange: (val: string) => void
}

export const AiTextarea = ({
  label,
  sectionKey,
  fieldName,
  currentValue,
  contextFields,
  onValueChange,
  ...rest
}: AiTextareaProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [error, setError] = useState('')

  const fetchSuggestions = async () => {
    setLoading(true)
    setError('')
    setSuggestions([])
    try {
      const res = await apiClient.post('/ai/suggest', {
        sectionKey,
        fieldName,
        currentValue,
        contextFields,
      })
      setSuggestions(res.data.data?.suggestions || res.data.suggestions || [])
    } catch (err: any) {
      const code = err.response?.data?.error?.code ?? err.response?.data?.code
      if (code === 'GUEST_LIMIT_HIT') {
        setError('Limit reached. Please sign in to generate more.')
      } else if (code === 'QUOTA_EXCEEDED') {
        setError('Monthly AI limit reached. Please upgrade your plan.')
      } else {
        setError(err.response?.data?.message || 'Failed to generate suggestions. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = async () => {
    setDialogOpen(true)
    if (suggestions.length === 0) {
      await fetchSuggestions()
    }
  }

  const handleConfirm = (suggestion: string) => {
    const prefix = currentValue && !currentValue.endsWith('\n') ? '\n' : ''
    onValueChange(currentValue + prefix + suggestion)
    setDialogOpen(false)
  }

  const handleRegenerate = async () => {
    await fetchSuggestions()
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {label && <label className={styles.label}>{label}</label>}
        <button type="button" className={styles.aiButton} onClick={handleOpenDialog}>
          <Sparkles size={14} className={styles.sparkleIcon} /> AI Assist
        </button>
      </div>

      <textarea
        className={styles.textarea}
        value={currentValue}
        onChange={(e) => onValueChange(e.target.value)}
        rows={5}
        {...rest}
      />

      <AiSuggestDialog
        isOpen={dialogOpen}
        fieldLabel={label}
        currentValue={currentValue}
        suggestions={suggestions}
        isLoading={loading}
        error={error}
        onConfirm={handleConfirm}
        onRegenerate={handleRegenerate}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  )
}
