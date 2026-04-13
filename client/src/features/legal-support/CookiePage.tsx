import { LegalPageLayout } from './LegalPageLayout'

export default function CookiePage() {
  return (
    <LegalPageLayout 
      title="Cookie Policy" 
      lastUpdated="April 13, 2026"
      metaDescription="Learn how CareerForge uses cookies to improve your experience and analyze platform usage."
    >
      <p>This Cookie Policy explains how CareerForge ("we", "us", "our") uses cookies and similar technologies when you visit our platform.</p>
      
      <hr />

      <h3>What Are Cookies</h3>
      <p>Cookies are small text files stored on your device (computer or mobile) by your browser to improve platform functionality, remember your preferences, and help us understand how people use our service.</p>

      <hr />

      <h3>The Cookies We Use</h3>
      
      <h4>Essential Cookies</h4>
      <p>These are necessary for the Platform to function correctly. They handle:</p>
      <ul>
        <li>Login sessions and authentication</li>
        <li>Security and fraud prevention</li>
        <li>Basic navigation and feature access</li>
      </ul>

      <h4>Analytics Cookies</h4>
      <p>We use Google Analytics 4 (GA4) to understand how users interact with CareerForge. This data is anonymized and helps us improve our product. It tracks:</p>
      <ul>
        <li>Which pages are most visited</li>
        <li>Feature usage patterns</li>
        <li>Device types and general location (city/country level)</li>
      </ul>

      <hr />

      <h3>Your Consent</h3>
      <p>By continuing to use CareerForge, you consent to the use of cookies as described in this policy. When you first visit our site, we provide a notice about our cookie usage.</p>

      <hr />

      <h3>Managing Your Cookies</h3>
      <p>Most browsers allow you to control cookies through their settings. You can choose to block all cookies, delete existing ones, or receive a notification when a cookie is set. Please note that disabling essential cookies may prevent you from logging in or using key features of the Platform.</p>

      <hr />

      <h3>Changes to This Policy</h3>
      <p>We may update this policy as our practices or legal requirements change. We encourage you to review this page periodically for updates.</p>

      <hr />

      <p><strong>Contact:</strong> <a href="mailto:support@careerforge.pro">support@careerforge.pro</a></p>
    </LegalPageLayout>
  )
}
