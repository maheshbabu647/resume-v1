// ─── Plan limits ─────────────────────────────────────────────────────────────
// Single source of truth — used by quota middleware and all feature guards.
// CareerForge v2 is fully free: all authenticated users get unlimited access.
// Usage counters are retained for analytics; limits are set to -1 (unlimited).

export type PlanName = 'free' | 'seeker' | 'hustler' | 'closer'

export interface PlanLimits {
  pdfDownloads: number       // per month (-1 = unlimited)
  jdScore: number            // per month (-1 = unlimited)
  aiBullets: number          // per month (-1 = unlimited)
  jdTailoring: number        // per month (-1 = unlimited)
  coverLetter: number        // per month (-1 = unlimited)
  resumeVersions: number     // stored versions (0 = none, -1 = unlimited)
  referralBonusCap: number   // max bonus tailorings credited per month from referrals
  referralBonusPerReferral: number  // how many bonus tailorings per successful referral
  aiAccess: boolean
}

const UNLIMITED: PlanLimits = {
  pdfDownloads: -1,
  jdScore: -1,
  aiBullets: -1,
  jdTailoring: -1,
  coverLetter: -1,
  resumeVersions: -1,
  referralBonusCap: 0,
  referralBonusPerReferral: 0,
  aiAccess: true,
}

/** All plans map to unlimited — legacy plan names kept for backward compat during migration. */
export const PLAN_LIMITS: Record<PlanName, PlanLimits> = {
  free: UNLIMITED,
  seeker: UNLIMITED,
  hustler: UNLIMITED,
  closer: UNLIMITED,
} as const

/** Guests get the same unlimited access once authenticated features are used. */
export const GUEST_LIMITS: Omit<PlanLimits, 'resumeVersions' | 'referralBonusCap' | 'referralBonusPerReferral' | 'aiAccess'> = {
  pdfDownloads: -1,
  jdScore: -1,
  aiBullets: -1,
  jdTailoring: -1,
  coverLetter: -1,
}

// ─── Razorpay (deprecated — pricing removed in v2) ───────────────────────────
// Kept so existing webhook/subscription code compiles until payment routes are removed.

/** @deprecated Pricing removed — do not use for new features. */
export const RAZORPAY_PLAN_IDS: Record<'hustler' | 'closer', string> = {
  hustler: process.env.RAZORPAY_PLAN_ID_HUSTLER || 'plan_hustler_placeholder',
  closer: process.env.RAZORPAY_PLAN_ID_CLOSER || 'plan_closer_placeholder',
}

// ─── Token config ─────────────────────────────────────────────────────────────

export const TOKEN = {
  /** One-time query param name used after Google OAuth callback */
  OAUTH_PARAM: 'token',
  /** HttpOnly cookie name for refresh token */
  REFRESH_COOKIE: 'refreshToken',
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  },
} as const

// ─── Resume ───────────────────────────────────────────────────────────────────

export const RESUME = {
  VALID_TEMPLATE_IDS: ['modern-centered', 'classic-sidebar', 'executive-minimal', 'minimal-left', 'compact-tech'] as const,
  VALID_STATUSES: ['draft', 'complete'] as const,
  TITLE_MAX_LENGTH: 120,
  /** Signed URL lifetime for R2 export links (seconds) */
  EXPORT_URL_TTL_SEC: 7 * 24 * 60 * 60,  // 7 days
} as const

// ─── Cover Letters ────────────────────────────────────────────────────────────

export const COVER_LETTER = {
  VALID_TONES: ['professional', 'enthusiastic', 'concise', 'creative'] as const,
  TITLE_MAX_LENGTH: 120,
  BODY_MAX_LENGTH: 12000,
} as const

// ─── AI ───────────────────────────────────────────────────────────────────────

export const AI = {
  /** Max characters of JD text accepted — prevents prompt injection / abuse */
  JD_TEXT_MAX_CHARS: 8000,
  /** How many suggestions to return from /ai/suggest */
  SUGGESTION_COUNT: 3,
  /** Max tokens for LLM response */
  MAX_OUTPUT_TOKENS: 8192,
  /** Redis TTL for cached AI responses (seconds) */
  CACHE_TTL_SEC: 60 * 60, // 1 hour
} as const

// ─── Articles / Insights CMS ──────────────────────────────────────────────────

export const ARTICLE = {
  SLUG_MAX_LENGTH: 120,
  TITLE_MAX_LENGTH: 200,
  EXCERPT_MAX_LENGTH: 500,
  META_DESCRIPTION_MAX_LENGTH: 320,
  TAG_MAX_LENGTH: 40,
  MAX_TAGS: 12,
} as const

// ─── Pagination ───────────────────────────────────────────────────────────────

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 50,
} as const

// ─── HTTP ─────────────────────────────────────────────────────────────────────

export const API_PREFIX = '/v1'
