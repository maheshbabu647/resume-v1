import { LegalPageLayout } from './LegalPageLayout'
import { Mail, User, Users, Globe } from 'lucide-react'
import styles from './LegalPage.module.css'

export default function ContactPage() {
  return (
    <LegalPageLayout
      title="Contact Us"
      metaDescription="Get in touch with the CareerForge team for support, feedback, or general enquiries."
    >
      <div className={styles.contactIntro}>
        <p>Need help with your account, want to share feedback, or have a quick question? Our team is here to support you with fast, friendly, and reliable service.</p>
        <div className={styles.contactActions}>
          <a href="mailto:support@careerforge.pro" className={styles.ctaButton}>
            <Mail size={18} /> Email support@careerforge.pro
          </a>
        </div>
      </div>

      <div className={styles.contactGrid}>
        <div className={styles.contactCard}>
          <h3><Mail size={20} /> Customer support</h3>
          <p>Questions about your subscription, login, resume exports, or technical issues.</p>
          <p><strong><a href="mailto:support@careerforge.pro">support@careerforge.pro</a></strong></p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--outline)' }}>Response time: typically within one business day.</p>
        </div>

        <div className={styles.contactCard}>
          <h3><Users size={20} strokeWidth={1.5} /> Partnerships</h3>
          <p>Press requests, collaborations, or platform integrations.</p>
          <p><strong><a href="mailto:support@careerforge.pro">support@careerforge.pro</a></strong></p>
        </div>

        <div className={styles.contactCard}>
          <h3><Globe size={20} /> Global access</h3>
          <p>CareerForge is based in Andhra Pradesh, India and serves customers worldwide.</p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--outline)' }}>Built for freshers, students, and early-career professionals everywhere.</p>
        </div>
      </div>

      <div className={styles.socialLinks}>
        <a href="https://www.linkedin.com/in/mahesh-babu-53030b267/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="LinkedIn">
          <User size={24} />
        </a>
        <a href="https://linkedin.com/company/careerforgepro" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Company LinkedIn">
          <Users size={24} strokeWidth={1.5} />
        </a>
        <a href="https://instagram.com/careerforgepro" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Instagram">
          <Globe size={24} />
        </a>
      </div>

      <p className={styles.footerNote}>
        CareerForge is built and operated by G Mahesh Babu and P Ganapathi Ramu. We are dedicated to helping freshers and students navigate the competitive job market with AI-powered intelligence.
      </p>
    </LegalPageLayout>
  )
}
