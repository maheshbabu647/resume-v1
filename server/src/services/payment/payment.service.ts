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

export const createSubscription = async (
  userId: string,
  planName: 'hustler' | 'closer',
  userEmail: string,
  userName: string
) => {
  const client = getClient()
  const planId = planName === 'hustler' ? RAZORPAY_PLAN_IDS.hustler : RAZORPAY_PLAN_IDS.closer
  const amount = planName === 'hustler' ? 7900 : 17900

  // Check if user already has a subscription record
  const existing = await Subscription.findOne({ userId })

  if (existing) {
    if (existing.status === 'active') {
      throw new AppError('SUBSCRIPTION_ALREADY_ACTIVE', 409, 'You already have an active subscription.')
    }

    if (existing.status === 'created' || existing.status === 'past_due') {
      try {
        // Verify the TRUE status directly from Razorpay to auto-heal missed webhooks
        const rzpSubInfo = await (client.subscriptions.fetch as Function)(existing.razorpaySubscriptionId)
        
        if (rzpSubInfo.status === 'active') {
          existing.status = 'active'
          await existing.save()
          await User.findByIdAndUpdate(userId, { plan: existing.plan })
          
          throw new AppError(
            'SUBSCRIPTION_RECOVERED', 
            409, 
            'We recovered your previous successful payment! Your account is now upgraded. Please refresh the page.'
          )
        }
      } catch (err: any) {
        // Bubble up our own error, ignore Razorpay network/not-found errors
        if (err.statusCode === 409) throw err
      }
    }

    if (existing.status === 'created' && existing.plan === planName) {
      // Resume the payment flow with the existing pending Razorpay subscription
      return {
        subscriptionId: existing.razorpaySubscriptionId,
        keyId: env.RAZORPAY_KEY_ID,
        plan: planName,
        amount,
        name: userName,
        email: userEmail,
      }
    }

    try {
      // Attempt to cancel the old un-paid or past-due subscription on Razorpay to clean up
      await (client.subscriptions.cancel as Function)(existing.razorpaySubscriptionId)
    } catch (err) {
      // Ignore errors if the subscription is already cancelled or the transition is invalid
    }

    // The user has a different plan, or a non-active status (e.g. cancelled, past_due)
    // Since our userId field is unique, we must update the existing record
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

  // Create new Razorpay subscription
  const rzpSub = await (client.subscriptions.create as Function)({
    plan_id: planId,
    total_count: 12,         // 12 billing cycles (1 year), can be adjusted
    quantity: 1,
    customer_notify: 1,
  })

  // Store in DB with status 'created'
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
  await (client.subscriptions.cancel as Function)(sub.razorpaySubscriptionId)

  // Mark as cancelAtPeriodEnd so user keeps access till period ends
  await Subscription.findByIdAndUpdate(sub._id, { cancelAtPeriodEnd: true })

  return { message: 'Subscription will be cancelled at the end of your billing period.' }
}

// ─── Get current subscription ─────────────────────────────────────────────────

export const getSubscription = async (userId: string) => {
  const sub = await Subscription.findOne({ userId }).lean()
  return sub
}

// ─── Get usage for current user ───────────────────────────────────────────────

export const getUsage = async (userId: string) => {
  const user = await User.findById(userId).select('plan usage').lean()
  if (!user) throw new AppError('USER_NOT_FOUND', 404)

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
