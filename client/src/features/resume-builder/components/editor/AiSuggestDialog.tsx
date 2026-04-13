import { useEffect } from 'react'
import { Sparkles, Loader2, X, Check, RefreshCw, ArrowRight } from 'lucide-react'
import styles from './AiSuggestDialog.module.css'

interface AiSuggestDialogProps {
  isOpen: boolean
  fieldLabel: string
  currentValue: string
  suggestions: string[]
  isLoading: boolean
  error: string
  onConfirm: (suggestion: string) => void
  onRegenerate: () => void
  onClose: () => void
}

export const AiSuggestDialog = ({
  isOpen,
  fieldLabel,
  currentValue,
  suggestions,
  isLoading,
  error,
  onConfirm,
  onRegenerate,
  onClose,
}: AiSuggestDialogProps) => {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true" aria-label="AI Suggestions">
      <div className={styles.dialog} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.sparkleIconWrap}>
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className={styles.title}>AI Suggestions</h2>
              <span className={styles.fieldBadge}>{fieldLabel}</span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* "Before" / Current content strip */}
        {currentValue.trim() && (
          <div className={styles.beforeStrip}>
            <span className={styles.beforeLabel}>Current</span>
            <p className={styles.beforeText}>{currentValue}</p>
          </div>
        )}

        {/* Arrow separator */}
        <div className={styles.separator}>
          <div className={styles.separatorLine} />
          <div className={styles.separatorChip}>
            <ArrowRight size={11} />
            <span>AI Rewrites</span>
          </div>
          <div className={styles.separatorLine} />
        </div>

        {/* Body: loading / error / suggestions */}
        <div className={styles.body}>
          {isLoading ? (
            <div className={styles.loadingState}>
              {[1, 2, 3].map(i => (
                <div key={i} className={styles.skeleton}>
                  <div className={styles.skeletonLine} style={{ width: '85%' }} />
                  <div className={styles.skeletonLine} style={{ width: '65%' }} />
                  <div className={styles.skeletonBtn} />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              <div className={styles.errorIcon}>
                <X size={20} />
              </div>
              <p className={styles.errorMsg}>{error}</p>
              {!error.includes('Limit') && !error.includes('limit') && (
                <button className={styles.retryBtn} onClick={onRegenerate}>
                  <RefreshCw size={13} /> Try Again
                </button>
              )}
            </div>
          ) : (
            <ul className={styles.suggestionList}>
              {suggestions.map((s, i) => (
                <li key={i} className={styles.suggestionItem}>
                  <div className={styles.suggestionMeta}>
                    <span className={styles.suggestionNum}>Option {i + 1}</span>
                  </div>
                  <p className={styles.suggestionText}>{s}</p>
                  <button
                    className={styles.useBtn}
                    onClick={() => onConfirm(s)}
                  >
                    <Check size={13} /> Use This
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {!isLoading && !error && suggestions.length > 0 && (
          <div className={styles.footer}>
            <button className={styles.regenerateBtn} onClick={onRegenerate}>
              <RefreshCw size={12} />
              Regenerate
            </button>
            <span className={styles.footerHint}>Click any suggestion to apply it</span>
          </div>
        )}
        {isLoading && (
          <div className={styles.footer}>
            <Loader2 size={14} className={styles.spin} />
            <span className={styles.footerHint}>Crafting personalised suggestions…</span>
          </div>
        )}
      </div>
    </div>
  )
}
