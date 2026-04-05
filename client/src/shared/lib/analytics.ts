// ─────────────────────────────────────────────────────────────────────────────
// CareerForge Analytics — Single source of truth for all GA4 events
// All window.gtag() calls go through this file. Never call gtag directly.
// ─────────────────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

// ─── Guard: no-op if gtag isn't loaded ────────────────────────────────────
const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', eventName, params)
}

// ─── Auth ─────────────────────────────────────────────────────────────────

/** Fire after a successful registration (email or Google) */
export const trackSignUp = (method: 'email' | 'google' = 'email') => {
  trackEvent('user_signed_up', { method })
  // GA4 built-in: https://support.google.com/analytics/answer/9267735
  trackEvent('sign_up', { method })
}

/** Fire after a successful login (email or Google) */
export const trackLogin = (method: 'email' | 'google' = 'email') => {
  trackEvent('user_logged_in', { method })
  trackEvent('login', { method })
}

/** Fire when a login attempt fails (wrong password, account not found, etc.) */
export const trackLoginFailed = (method: 'email' | 'google' = 'email', reason?: string) => {
  trackEvent('user_login_failed', { method, reason: reason ?? 'unknown' })
}

// ─── User Properties (call on every login / session restore) ──────────────

/** Sets GA4 User-ID so sessions are tied to your DB user across devices */
export const setUserProperties = (userId: string, plan: 'seeker' | 'hustler' | 'closer') => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined
  if (measurementId) {
    window.gtag('config', measurementId, { user_id: userId })
  }
  window.gtag('set', 'user_properties', {
    subscription_plan: plan,
    user_id: userId,
  })
}

// ─── Resume Builder ────────────────────────────────────────────────────────

/** User skips AI parse and starts a blank resume */
export const trackResumeStartedFresh = () => {
  trackEvent('resume_started_fresh')
}

/** User uploaded an existing resume and AI successfully parsed it */
export const trackResumeImported = () => {
  trackEvent('resume_imported')
}

/** User clicks "New Resume" from the template gallery (dashboard) */
export const trackResumeCreated = (templateId: string) => {
  trackEvent('resume_created', { template_id: templateId })
}

/** User successfully exports a PDF */
export const trackResumeDownloaded = (resumeId: string, format: 'pdf' = 'pdf') => {
  trackEvent('resume_downloaded', { resume_id: resumeId, format })
}

/** User opens the template gallery (Switch Template button in Toolbar) */
export const trackTemplateGalleryOpened = () => {
  trackEvent('template_gallery_opened')
}

/** User switches to a different resume template */
export const trackTemplateChanged = (fromTemplate: string, toTemplate: string) => {
  trackEvent('template_changed', {
    from_template: fromTemplate,
    to_template: toTemplate,
  })
}

/** User accepts or rejects an AI suggestion in the editor */
export const trackAISuggestion = (accepted: boolean, section: string) => {
  const eventName = accepted ? 'ai_suggestion_accepted' : 'ai_suggestion_rejected'
  trackEvent(eventName, { section })
}

// ─── Payment & Upgrade ────────────────────────────────────────────────────

/** User lands on /pricing */
export const trackPricingPageViewed = () => {
  trackEvent('pricing_page_viewed')
}

/** User clicks an upgrade CTA button */
export const trackUpgradeClicked = (
  plan: 'hustler' | 'closer',
  location: 'pricing_page' | 'feature_gate_modal' | 'dashboard' | string
) => {
  trackEvent('upgrade_clicked', {
    plan_name: plan,
    click_location: location,
  })
}

/** Razorpay modal is about to open */
export const trackPaymentInitiated = (plan: string, amount: number) => {
  trackEvent('payment_initiated', {
    plan_name: plan,
    value: amount,
    currency: 'INR',
  })
}

/** Payment completed successfully (fires in Razorpay handler callback) */
export const trackPaymentCompleted = (plan: string, amount: number, orderId: string) => {
  trackEvent('payment_completed', {
    plan_name: plan,
    value: amount,
    currency: 'INR',
    order_id: orderId,
  })
  // GA4 standard e-commerce purchase event
  trackEvent('purchase', {
    transaction_id: orderId,
    value: amount,
    currency: 'INR',
    items: [{ item_name: `CareerForge ${plan}`, price: amount }],
  })
}

/**
 * Payment failed or user dismissed the Razorpay modal.
 * @param reason - 'user_dismissed' | 'verification_failed' | string
 */
export const trackPaymentFailed = (plan: string, reason: string) => {
  trackEvent('payment_failed', { plan_name: plan, failure_reason: reason })
}

/** User confirms subscription cancellation */
export const trackSubscriptionCancelled = (plan: string) => {
  trackEvent('subscription_cancelled', { plan_name: plan })
}

// ─── Feature Gates ────────────────────────────────────────────────────────

/**
 * User hit a gated feature and the upgrade modal appeared.
 * @param featureName - matches the UpgradeModal `trigger` prop value
 */
export const trackFeatureLocked = (featureName: string) => {
  trackEvent('feature_locked_seen', { feature_name: featureName })
}

// ─── JD Tailor ────────────────────────────────────────────────────────────

/** JD fit score was computed and displayed to the user */
export const trackJDScoreViewed = () => {
  trackEvent('jd_score_viewed')
}

/** User triggered a JD tailoring job (AI rewrites resume to match JD) */
export const trackJDTailorRequested = () => {
  trackEvent('jd_tailor_requested')
}

// ─── Cover Letter ─────────────────────────────────────────────────────────

/** AI successfully generated a cover letter */
export const trackCoverLetterGenerated = () => {
  trackEvent('cover_letter_generated')
}

// ─── Referral ─────────────────────────────────────────────────────────────

/**
 * User shared their referral link via one of the channels.
 * @param channel - 'whatsapp' | 'telegram' | 'email' | 'copy'
 */
export const trackReferralShared = (channel: 'whatsapp' | 'telegram' | 'email' | 'copy') => {
  trackEvent('referral_link_shared', { share_channel: channel })
}
