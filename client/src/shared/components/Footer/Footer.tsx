import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M7.75 2C5.1 2 3 4.1 3 6.75v10.5C3 19.9 5.1 22 7.75 22h8.5C18.9 22 21 19.9 21 17.25V6.75C21 4.1 18.9 2 16.25 2h-8.5zm0 1.5h8.5c1.5 0 2.75 1.25 2.75 2.75v10.5c0 1.5-1.25 2.75-2.75 2.75h-8.5c-1.5 0-2.75-1.25-2.75-2.75V6.25c0-1.5 1.25-2.75 2.75-2.75zm4.25 2.25a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 1.5a3 3 0 110 6 3 3 0 010-6zm4.9-.75a.9.9 0 11-1.8 0 .9.9 0 011.8 0z" />
  </svg>
)

const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5C3.34 3.5 2 4.84 2 6.48c0 1.64 1.34 2.98 2.98 2.98 1.64 0 2.98-1.34 2.98-2.98C7.96 4.84 6.62 3.5 4.98 3.5zM3 8.75h3.96V21H3V8.75zm7.91 0H15v1.65h.05c.49-.93 1.69-1.9 3.48-1.9 3.72 0 4.41 2.44 4.41 5.61V21h-3.96v-5.61c0-1.34-.02-3.06-1.86-3.06-1.86 0-2.15 1.45-2.15 2.95V21h-3.96V8.75z" />
  </svg>
)

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerBrand}>
          <div className={styles.brand}>
            <div className={styles.brandLogo}>CF</div>
            <span className={styles.brandName}>CareerForge</span>
          </div>
          <p className={styles.footerTagline}>AI resume tailoring, JD scorer & cover letter generator.</p>
          <p className={styles.footerTagline} style={{ marginTop: 4 }}>careerforge.pro</p>
        </div>
        <div className={styles.footerLinks}>
          <div className={styles.footerCol}>
            <span className={styles.footerColTitle}>Product</span>
            <Link to="/templates" className={styles.footerLink}>Templates</Link>
            <Link to="/jd-tailor" className={styles.footerLink}>JD Fit Score</Link>
            <Link to="/cover-letter" className={styles.footerLink}>Cover Letter</Link>
            <Link to="/pricing" className={styles.footerLink}>Pricing</Link>
          </div>
          <div className={styles.footerCol}>
            <span className={styles.footerColTitle}>Legal</span>
            <Link to="/privacy" className={styles.footerLink}>Privacy Policy</Link>
            <Link to="/terms" className={styles.footerLink}>Terms of Service</Link>
            <Link to="/cookies" className={styles.footerLink}>Cookie Policy</Link>
            <Link to="/refund-policy" className={styles.footerLink}>Refund Policy</Link>
          </div>
          <div className={styles.footerCol}>
            <span className={styles.footerColTitle}>Support</span>
            <Link to="/contact" className={styles.footerLink}>Contact Us</Link>
            <Link to="/login" className={styles.footerLink}>Log in</Link>
            <Link to="/register" className={styles.footerLink}>Get started free</Link>
          </div>
          <div className={styles.footerCol}>
            <span className={styles.footerColTitle}>Follow us</span>
            <p className={styles.footerText}>Stay connected for updates, career resources, and new product announcements.</p>
            <div className={styles.socialRow}>
              <a
                href="https://www.instagram.com/careerforgepro/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="CareerForge Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://www.linkedin.com/company/109617317/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="CareerForge LinkedIn"
              >
                <LinkedinIcon />
              </a>
            </div>
            <p className={styles.followText}>Follow us on Instagram and LinkedIn.</p>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <span>© 2026 CareerForge. All rights reserved. · Made with ❤️ in India · careerforge.pro</span>
      </div>
    </footer>
  )
}
