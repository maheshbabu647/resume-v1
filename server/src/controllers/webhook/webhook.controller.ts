import crypto from 'crypto'
import type { Request, Response, NextFunction } from 'express'
import { Subscription } from '../../models/Subscription.model'
import { User }         from '../../models/User.model'
import { env }          from '../../config/env'

const verifySignature = (rawBody: string, signature: string): boolean => {
  const secret = env.RAZORPAY_WEBHOOK_SECRET || ''
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

export const handleRazorpay = async (req: Request, res: Response, next: NextFunction) => {
  const signature = req.headers['x-razorpay-signature'] as string
  if (!signature || !verifySignature(JSON.stringify(req.body), signature))
    return res.status(400).json({ ok: false, error: { code: 'INVALID_SIGNATURE' } })

  const { event, payload } = req.body as {
    event: string
    payload: { subscription: { entity: { id: string; status: string; current_start?: number; current_end?: number } } }
  }
  const rzEntity = payload?.subscription?.entity
  const razorpayId = rzEntity?.id
  const rzStatus   = rzEntity?.status

  try {
    switch (event) {
      case 'subscription.activated': {
        const sub = await Subscription.findOne({ razorpaySubscriptionId: razorpayId })
        if (sub) {
          sub.status = 'active'
          if (rzEntity.current_start) sub.currentPeriodStart = new Date(rzEntity.current_start * 1000)
          if (rzEntity.current_end)   sub.currentPeriodEnd   = new Date(rzEntity.current_end   * 1000)
          await sub.save()
          // Upgrade user plan to whatever the subscription plan is (hustler or closer)
          await User.findByIdAndUpdate(sub.userId, { plan: sub.plan })
        }
        break
      }
      case 'subscription.charged': {
        // Payment succeeded — keep plan active, update period dates
        const sub = await Subscription.findOne({ razorpaySubscriptionId: razorpayId })
        if (sub) {
          sub.status = 'active'
          if (rzEntity.current_start) sub.currentPeriodStart = new Date(rzEntity.current_start * 1000)
          if (rzEntity.current_end)   sub.currentPeriodEnd   = new Date(rzEntity.current_end   * 1000)
          await sub.save()
        }
        break
      }
      case 'subscription.cancelled':
      case 'subscription.completed': {
        const sub = await Subscription.findOneAndUpdate(
          { razorpaySubscriptionId: razorpayId },
          { status: rzStatus === 'cancelled' ? 'cancelled' : 'completed' },
          { new: true }
        )
        // Only downgrade if the period has actually ended
        if (sub) {
          const now = new Date()
          if (!sub.currentPeriodEnd || now >= sub.currentPeriodEnd) {
             await User.findByIdAndUpdate(sub.userId, { plan: 'seeker' })
          } else {
             console.log(`[Webhook] Sub cancelled but paid period active until ${sub.currentPeriodEnd}`)
          }
        }
        break
      }
      case 'subscription.pending':
      case 'subscription.halted': {
        await Subscription.findOneAndUpdate({ razorpaySubscriptionId: razorpayId }, { status: 'past_due' })
        break
      }
      case 'subscription.paused': {
        await Subscription.findOneAndUpdate({ razorpaySubscriptionId: razorpayId }, { status: 'paused' })
        break
      }
      case 'subscription.resumed': {
        await Subscription.findOneAndUpdate({ razorpaySubscriptionId: razorpayId }, { status: 'active' })
        break
      }
      case 'payment.failed':
        console.log(`[Webhook] Payment failed for sub ${razorpayId}. Razorpay retries automatically.`)
        break
      default:
        console.log(`[Webhook] Unhandled event: ${event}`)
    }
    res.json({ ok: true })
  } catch (err) { next(err) }
}
