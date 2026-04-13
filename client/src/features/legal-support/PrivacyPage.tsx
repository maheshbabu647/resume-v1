import { LegalPageLayout } from './LegalPageLayout'

export default function PrivacyPage() {
  return (
    <LegalPageLayout 
      title="Privacy Policy" 
      lastUpdated="April 13, 2026"
      metaDescription="Learn how CareerForge collects, uses, and protects your personal and career data."
    >
      <p>This Privacy Policy explains how CareerForge collects, uses, and protects your data.</p>
      
      <hr />

      <h3>1. What We Collect</h3>
      <ul>
        <li><strong>Account info:</strong> Name, email, password (hashed)</li>
        <li><strong>Career data:</strong> Resume content, job descriptions, cover letters</li>
        <li><strong>Usage data:</strong> Pages visited, features used, session duration</li>
        <li><strong>Payment data:</strong> Transaction details via Razorpay (no card storage)</li>
        <li><strong>Device data:</strong> IP, browser, OS</li>
      </ul>

      <hr />

      <h3>2. How We Use Your Data</h3>
      <ul>
        <li>Provide and improve features</li>
        <li>Process payments</li>
        <li>Send transactional emails</li>
        <li>Analyze usage (Google Analytics 4)</li>
        <li>Provide support</li>
      </ul>

      <hr />

      <h3>3. Data Sharing</h3>
      <p>We do not sell your data. We share data only with:</p>
      <ul>
        <li>Razorpay (payments)</li>
        <li>Google Analytics 4 (analytics)</li>
        <li>Google Cloud / Gemini API (AI processing)</li>
        <li>Transactional email services (for delivery)</li>
      </ul>

      <hr />

      <h3>4. Cookies</h3>
      <p>We use cookies for:</p>
      <ul>
        <li><strong>Authentication:</strong> Keeping you logged in (essential)</li>
        <li><strong>Analytics:</strong> Understanding usage patterns via GA4</li>
      </ul>
      <p>By continuing to use CareerForge, you consent to the use of cookies. You can disable cookies in your browser settings if you wish.</p>

      <hr />

      <h3>5. Data Retention</h3>
      <p>We retain data while your account is active. Upon deletion, data is removed within 30 days unless required by law.</p>

      <hr />

      <h3>6. Your Rights</h3>
      <p>You can request access, correction, or deletion of your data by contacting us at support@careerforge.pro.</p>

      <hr />

      <h3>7. Data Security</h3>
      <p>We use industry-standard security measures. However, no system is completely secure, and we encourage users to prioritize their own account security.</p>

      <hr />

      <h3>8. Children's Privacy</h3>
      <p>CareerForge is not intended for users under the age of 13.</p>

      <hr />

      <h3>9. Changes</h3>
      <p>We may update this policy periodically and will notify users of any significant changes via the platform or email.</p>

      <hr />

      <p><strong>Contact:</strong> <a href="mailto:support@careerforge.pro">support@careerforge.pro</a></p>
    </LegalPageLayout>
  )
}
