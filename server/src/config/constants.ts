// ─── Plan limits ─────────────────────────────────────────────────────────────
// Single source of truth — used by quota middleware and all feature guards.

export type PlanName = 'seeker' | 'hustler' | 'closer'

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

export const PLAN_LIMITS: Record<PlanName, PlanLimits> = {
  seeker: {
    pdfDownloads: 5,
    jdScore: 3,
    aiBullets: 5,
    jdTailoring: 2,
    coverLetter: 3,
    resumeVersions: 0,
    referralBonusCap: 5,
    referralBonusPerReferral: 1,
    aiAccess: true,
  },
  hustler: {
    pdfDownloads: 10,
    jdScore: 20,
    aiBullets: 25,
    jdTailoring: 12,
    coverLetter: 15,
    resumeVersions: 5,
    referralBonusCap: 99,
    referralBonusPerReferral: 2,
    aiAccess: true,
  },
  closer: {
    pdfDownloads: -1,
    jdScore: -1,
    aiBullets: -1,
    jdTailoring: -1,
    coverLetter: -1,
    resumeVersions: -1,
    referralBonusCap: 99,
    referralBonusPerReferral: 3,
    aiAccess: true,
  },
} as const

export const GUEST_LIMITS: Omit<PlanLimits, 'resumeVersions' | 'referralBonusCap' | 'referralBonusPerReferral' | 'aiAccess'> = {
  pdfDownloads: 0,
  jdScore: 2,
  aiBullets: 4,
  jdTailoring: 1,
  coverLetter: 1,
}

// ─── Razorpay plan IDs ────────────────────────────────────────────────────────
// Set these to your actual Razorpay plan IDs once created in the dashboard.
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
  VALID_TEMPLATE_IDS: ['modern-centered', 'minimal-left', 'compact-tech'] as const,
  VALID_STATUSES: ['draft', 'complete'] as const,
  TITLE_MAX_LENGTH: 120,
  /** Signed URL lifetime for R2 export links (seconds) */
  EXPORT_URL_TTL_SEC: 7 * 24 * 60 * 60,  // 7 days
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

// ─── Pagination ───────────────────────────────────────────────────────────────

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 50,
} as const

// ─── HTTP ─────────────────────────────────────────────────────────────────────

export const API_PREFIX = '/v1'
