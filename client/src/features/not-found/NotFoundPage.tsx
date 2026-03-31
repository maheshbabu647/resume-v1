import React from 'react'
import { Link } from 'react-router-dom'
import { FileQuestion, ArrowLeft, Home } from 'lucide-react'
import styles from './NotFoundPage.module.css'

const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <FileQuestion className={styles.icon} size={72} />
        </div>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Page Not Found</h2>
        <p className={styles.message}>
          The page you are trying to access doesn't exist, has been moved, or is temporarily unavailable. Let's get you back on track.
        </p>
        
        <div className={styles.actions}>
          <button className={styles.backButton} onClick={() => window.history.back()}>
            <ArrowLeft size={20} />
            Go Back
          </button>
          
          <Link to="/" className={styles.homeButton}>
            <Home size={20} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
