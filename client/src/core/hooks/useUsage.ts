/**
 * useUsage — fetches the current user's plan + monthly usage counters.
 * Usage: const { usage, plan, isAtLimit, refetch } = useUsage()
 */
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/apiClient'
import { useAuthStore } from '@/core/auth/useAuthStore'

export type PlanName = 'seeker' | 'hustler' | 'closer'
export type QuotaFeature = 'pdfDownloads' | 'jdScore' | 'aiBullets' | 'jdTailoring' | 'coverLetter'

export interface UsageData {
  month: string
  pdfDownloads: number
  jdScore: number
  aiBullets: number
  jdTailoring: number
  coverLetter: number
  bonusTailoring: number
  bonusPdfDownloads: number
}

interface UsageResponse {
  plan: PlanName
  usage: UsageData
  limits: Record<QuotaFeature, number>
}

export const PLAN_LIMITS: Record<PlanName, Record<QuotaFeature, number>> = {
  seeker:  { pdfDownloads: 5,  jdScore: 3,  aiBullets: 5,  jdTailoring: 2,  coverLetter: 3  },
  hustler: { pdfDownloads: 10, jdScore: 20, aiBullets: 25, jdTailoring: 12, coverLetter: 15 },
  closer:  { pdfDownloads: -1, jdScore: -1, aiBullets: -1, jdTailoring: -1, coverLetter: -1 },
}

export const PLAN_LABELS: Record<PlanName, string> = {
  seeker: 'Seeker — Free',
  hustler: 'Hustler — ₹79/mo',
  closer: 'Closer — ₹179/mo',
}

export const PLAN_PRICES: Record<'hustler' | 'closer', string> = {
  hustler: '₹79',
  closer: '₹179',
}

export function useUsage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const { data, isLoading, refetch } = useQuery<UsageResponse>({
    queryKey: ['usage'],
    queryFn: async () => {
      const res = await apiClient.get('/payment/usage')
      return res.data.data as UsageResponse
    },
    enabled: isAuthenticated,
    staleTime: 30_000, // re-fetch every 30s
  })

  const rawPlan = (data?.plan as string) ?? 'seeker'
  // Normalize legacy plan names if they exist in DB
  let plan: PlanName = 'seeker'
  if (rawPlan === 'hustler' || rawPlan === 'pro') plan = 'hustler'
  else if (rawPlan === 'closer') plan = 'closer'
  
  const usage = data?.usage
  // Prioritize limits from backend, fallback to frontend defaults for robustness
  const limits = data?.limits ?? PLAN_LIMITS[plan]

  /** Returns true if user has hit or exceeded limit for a feature */
  const isAtLimit = (feature: QuotaFeature): boolean => {
    const featureLimit = limits[feature]
      
    // -1 = unlimited
    if (featureLimit === -1) return false

    const used = usage?.[feature] ?? 0
    const bonusPoolKey = feature === 'jdTailoring' ? 'bonusTailoring' : feature === 'pdfDownloads' ? 'bonusPdfDownloads' : null
    const bonusPool = bonusPoolKey ? (usage?.[bonusPoolKey] ?? 0) : 0
      
    return used >= featureLimit && bonusPool <= 0
  }

  /** Returns remaining count for a feature (Infinity for unlimited) */
  const remaining = (feature: QuotaFeature): number | 'Unlimited' => {
    if (!usage) return 0
    const featureLimit = limits[feature]
    if (featureLimit === -1) return 'Unlimited'

    const used = usage?.[feature] ?? 0
    const bonusPoolKey = feature === 'jdTailoring' ? 'bonusTailoring' : feature === 'pdfDownloads' ? 'bonusPdfDownloads' : null
    const bonusPool = bonusPoolKey ? (usage?.[bonusPoolKey] ?? 0) : 0

    const monthlyRemaining = Math.max(0, featureLimit - used)
    return monthlyRemaining + bonusPool
  }

  /** 0–1 fill ratio for progress bars (1.0 = full/exceeded) */
  const ratio = (feature: QuotaFeature): number => {
    if (!usage) return 0
    const featureLimit = limits[feature]
    if (featureLimit === -1) return 0

    const used = usage[feature] ?? 0
    const bonusPoolKey = feature === 'jdTailoring' ? 'bonusTailoring' : feature === 'pdfDownloads' ? 'bonusPdfDownloads' : null
    const bonusPool = bonusPoolKey ? (usage?.[bonusPoolKey] ?? 0) : 0
    
    const totalLimit = featureLimit + bonusPool
    if (totalLimit === 0) return 1
    
    // For the UI bar, we show (Used) / (Monthly Limit + Bonus Pool)
    // But wait, 'Used' only tracks monthly. 
    // If we've started using bonus pool, 'Used' stays at 'featureLimit'.
    // So the ratio should be: (Used + (InitialBonus - CurrentBonus)) / (Monthly + InitialBonus)
    // But we don't know InitialBonus. 
    // Let's keep it simple: if monthly used up, bar is full, and we show bonus count separately.
    return Math.min(1, used / featureLimit)
  }

  return { plan, usage, isLoading, isAtLimit, remaining, ratio, refetch }
}
