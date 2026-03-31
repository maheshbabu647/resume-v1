import React from 'react'
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'
import { AlertCircle, WifiOff } from 'lucide-react'
import styles from './GlobalErrorBoundary.module.css'

export const GlobalErrorBoundary: React.FC = () => {
  const error = useRouteError()

  // Heuristic to detect chunk load errors / offline errors
  const isChunkLoadError = 
    error instanceof TypeError || 
    (error instanceof Error && error.message.includes('fetch dynamically imported module')) ||
    (error instanceof Error && error.message.includes('Unable to preload CSS'))

  let title = 'Oops! Something went wrong.'
  let message = 'An unexpected error occurred. Please try reloading the page.'
  let Icon = AlertCircle

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Page Not Found'
      message = 'The page you are looking for does not exist.'
    } else {
      title = `${error.status} Error`
      message = error.statusText || message
    }
  } else if (isChunkLoadError || !navigator.onLine) {
    title = 'Connection Lost'
    message = 'We are having trouble loading the application. Please check your internet connection and reload.'
    Icon = WifiOff
  } else if (error instanceof Error) {
    // Optionally log this or use a more detailed message in dev
    // message = error.message
  }

  const handleReload = () => {
    // Hard refresh bypasses cache for broken chunks
    window.location.reload()
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <Icon className={styles.icon} size={64} />
        </div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.message}>{message}</p>
        
        {/* If it's a critical application crash during dev, show error (optional, but keep clean for PROD) */}
        {import.meta.env.DEV && error instanceof Error && !isChunkLoadError && (
          <pre className={styles.details}>
            {error.message}
            {'\n'}
            {error.stack}
          </pre>
        )}

        <button className={styles.reloadButton} onClick={handleReload}>
          Reload Application
        </button>
      </div>
    </div>
  )
}
