import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import styles from './LegalPage.module.css'

interface LegalPageLayoutProps {
  title: string
  lastUpdated?: string
  children: ReactNode
  metaDescription: string
}

export const LegalPageLayout = ({ title, lastUpdated, children, metaDescription }: LegalPageLayoutProps) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className={styles.legalPage}>
      <Helmet>
        <title>{`${title} | CareerForge`}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.label}>Legal & support</span>
          <h1 className={styles.title}>{title}</h1>
          {lastUpdated && <p className={styles.lastUpdated}>Last Updated: {lastUpdated}</p>}
          <p className={styles.intro}>This page explains how CareerForge protects your information, governs your use, and supports your experience on the platform.</p>
        </header>

        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  )
}
