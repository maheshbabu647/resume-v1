/**
 * payment.service.ts
 * ──────────────────
 * All Razorpay subscription logic lives here.
 * Controllers stay thin; business logic is here.
 */

import Razorpay from 'razorpay'
import { env } from '../../config/env'
import { RAZORPAY_PLAN_IDS, PLAN_LIMITS, type PlanName } from '../../config/constants'
import { Subscription } from '../../models/Subscription.model'
import { User } from '../../models/User.model'
import { AppError } from '../../lib/AppError'

// ─── Razorpay client ─────────────────────────────────────────────────────────

let rzp: Razorpay | null = null

const getClient = (): Razorpay => {
  if (!rzp) {
    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
      throw new AppError('PAYMENT_NOT_CONFIGURED', 503, 'Razorpay keys are not set. Add them to .env.')
    }
    rzp = new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET })
  }
  return rzp
}

// ─── Create Razorpay subscription ────────────────────────────────────────────

/**
 * Internal helper to sync subscription status with Razorpay truth.
 */
const syncSubscriptionWithRazorpay = async (userId: string, subscriptionId: string): Promise<boolean> => {
  const client = getClient()
  try {
    const rzpSub = await (client.subscriptions.fetch as Function)(subscriptionId)
    
    if (rzpSub.status === 'active') {
      const sub = await Subscription.findOneAndUpdate(
        { userId },
        { status: 'active' },
        { new: true }
      )
      if (sub) {
        await User.findByIdAndUpdate(userId, { plan: sub.plan })
        return true
      }
    }
  } catch (err) {
    console.error(`[Sync] Failed to fetch subscription ${subscriptionId}:`, err)
  }
  return false
}

// ─── Create Razorpay subscription ────────────────────────────────────────────

export const createSubscription = async (
  userId: string,
  planName: 'hustler' | 'closer',
  userEmail: string,
  userName: string
) => {
  const client = getClient()
  const planId = planName === 'hustler' ? RAZORPAY_PLAN_IDS.hustler : RAZORPAY_PLAN_IDS.closer
  const amount = planName === 'hustler' ? 7900 : 17900

  const existing = await Subscription.findOne({ userId })

  if (existing) {
    // 1. Try to sync if it's not active in our DB
    if (existing.status !== 'active') {
      const recovered = await syncSubscriptionWithRazorpay(userId, existing.razorpaySubscriptionId)
      if (recovered) {
        throw new AppError(
          'SUBSCRIPTION_RECOVERED',
          409,
          'Your active subscription was found and synced! Please refresh the page.'
        )
      }
    }

    // 2. If truly active, block new creation
    if (existing.status === 'active') {
      // If pending cancellation (reactivate flow), skip this block so it cancels the old and creates a fresh one
      if (!existing.cancelAtPeriodEnd) {
        throw new AppError('SUBSCRIPTION_ALREADY_ACTIVE', 409, 'You already have an active subscription.')
      }
    }

    // 3. If "created" and same plan, reuse it
    if (existing.status === 'created' && existing.plan === planName) {
      return {
        subscriptionId: existing.razorpaySubscriptionId,
        keyId: env.RAZORPAY_KEY_ID,
        plan: planName,
        amount,
        name: userName,
        email: userEmail,
      }
    }

    // 4. Otherwise, cancel old pending and create fresh
    try {
      await (client.subscriptions.cancel as Function)(existing.razorpaySubscriptionId)
    } catch (err) {}

    const rzpSub = await (client.subscriptions.create as Function)({
      plan_id: planId,
      total_count: 12,
      quantity: 1,
      customer_notify: 1,
    })

    existing.plan = planName
    existing.razorpaySubscriptionId = rzpSub.id
    existing.razorpayPlanId = planId
    existing.status = 'created'
    await existing.save()

    return {
      subscriptionId: rzpSub.id,
      keyId: env.RAZORPAY_KEY_ID,
      plan: planName,
      amount,
      name: userName,
      email: userEmail,
    }
  }

  // Fresh creation
  const rzpSub = await (client.subscriptions.create as Function)({
    plan_id: planId,
    total_count: 12,
    quantity: 1,
    customer_notify: 1,
  })

  await Subscription.create({
    userId,
    plan: planName,
    razorpaySubscriptionId: rzpSub.id,
    razorpayPlanId: planId,
    status: 'created',
  })

  return {
    subscriptionId: rzpSub.id,
    keyId: env.RAZORPAY_KEY_ID,
    plan: planName,
    amount,
    name: userName,
    email: userEmail,
  }
}

// ─── Cancel subscription ──────────────────────────────────────────────────────

export const cancelSubscription = async (userId: string) => {
  const sub = await Subscription.findOne({ userId, status: { $in: ['active', 'created'] } })
  if (!sub) throw new AppError('NO_ACTIVE_SUBSCRIPTION', 404, 'No active subscription found.')

  const client = getClient()
  await (client.subscriptions.cancel as Function)(sub.razorpaySubscriptionId, { cancel_at_cycle_end: 1 })

  // Mark as cancelAtPeriodEnd so user keeps access till period ends
  await Subscription.findByIdAndUpdate(sub._id, { cancelAtPeriodEnd: true })

  return { message: 'Subscription will be cancelled at the end of your billing period.' }
}

// ─── Get current subscription ─────────────────────────────────────────────────

import { ISubscriptionBase } from '../../models/Subscription.model'

export const getSubscription = async (userId: string): Promise<ISubscriptionBase | null> => {
  const sub = await Subscription.findOne({ userId }).lean()
  
  // Auto-heal if we have a sub record that isn't active
  if (sub && sub.status !== 'active') {
    const recovered = await syncSubscriptionWithRazorpay(userId, sub.razorpaySubscriptionId)
    if (recovered) return { ...sub, status: 'active' }
  }
  
  return sub
}

// ─── Get usage for current user ───────────────────────────────────────────────

export const getUsage = async (userId: string): Promise<{ plan: PlanName, usage: any, limits: any }> => {
  const user = await User.findById(userId).select('plan usage').lean()
  if (!user) throw new AppError('USER_NOT_FOUND', 404)

  // Auto-heal check: if user is still on seeker but we have a non-active sub record
  if (user.plan === 'seeker') {
    const sub = await Subscription.findOne({ userId }).select('razorpaySubscriptionId status').lean()
    if (sub && sub.status !== 'active') {
      await syncSubscriptionWithRazorpay(userId, sub.razorpaySubscriptionId)
      // Note: we don't return early here, we let it fetch updated user below
    }
  }

  const updatedUser = user.plan === 'seeker' 
    ? await User.findById(userId).select('plan usage').lean() 
    : user
    
  if (!updatedUser) throw new AppError('USER_NOT_FOUND', 404)

  const currentMonth = new Date().toISOString().slice(0, 7)

  // If it's a new month, return zeroed usage (don't persist here — quotaGuard does that)
  const usage = user.usage?.month === currentMonth
    ? user.usage
    : { 
        month: currentMonth, 
        pdfDownloads: 0, 
        jdScore: 0, 
        aiBullets: 0, 
        jdTailoring: 0, 
        coverLetter: 0,
        bonusPdfDownloads: user.usage?.bonusPdfDownloads ?? 0 
      }

  const planName = (user.plan || 'seeker') as PlanName
  const limits = PLAN_LIMITS[planName]

  return {
    plan: planName,
    usage,
    limits,
  }
}

// ─── Verify subscription payment (fallback for localhost) ────────────────────────

import crypto from 'crypto'

export const verifySubscriptionPayment = async (
  razorpayPaymentId: string,
  razorpaySubscriptionId: string,
  razorpaySignature: string
) => {
  const secret = env.RAZORPAY_KEY_SECRET || ''
  
  // Razorpay subscription signature is generated using HMAC-SHA256 with key_secret
  // payload is payment_id + "|" + subscription_id
  const payload = `${razorpayPaymentId}|${razorpaySubscriptionId}`
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  if (expected !== razorpaySignature) {
    throw new AppError('INVALID_SIGNATURE', 400, 'Invalid payment signature.')
  }

  // Signature is valid, update the subscription and user
  const sub = await Subscription.findOne({ razorpaySubscriptionId: razorpaySubscriptionId })
  if (!sub) throw new AppError('SUBSCRIPTION_NOT_FOUND', 404, 'Subscription not found.')

  if (sub.status !== 'active') {
    sub.status = 'active'
    await sub.save()

    // Upgrade user plan
    await User.findByIdAndUpdate(sub.userId, { plan: sub.plan })
  }

  return { message: 'Subscription verified successfully.' }
}
