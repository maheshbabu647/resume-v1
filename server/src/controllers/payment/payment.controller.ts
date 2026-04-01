import type { Request, Response, NextFunction } from 'express'
import * as paymentService from '../../services/payment/payment.service'

export const subscribe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { plan } = req.body as { plan: 'hustler' | 'closer' }
    if (!plan || !['hustler', 'closer'].includes(plan)) {
      return res.status(400).json({ ok: false, error: { code: 'INVALID_PLAN', message: 'Plan must be hustler or closer.' } })
    }
    const result = await paymentService.createSubscription(
      req.user!._id.toString(),
      plan,
      req.user!.email,
      req.user!.name
    )
    res.json({ ok: true, data: result })
  } catch (err) { next(err) }
}

export const cancelSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await paymentService.cancelSubscription(req.user!._id.toString())
    res.json({ ok: true, data: result })
  } catch (err) { next(err) }
}

export const getSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sub = await paymentService.getSubscription(req.user!._id.toString())
    res.json({ ok: true, data: sub })
  } catch (err) { next(err) }
}

export const getUsage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await paymentService.getUsage(req.user!._id.toString())
    res.json({ ok: true, data })
  } catch (err) { next(err) }
}

export const verifySubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = req.body
    
    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return res.status(400).json({ ok: false, error: { message: 'Missing required Razorpay parameters.' } })
    }

    const data = await paymentService.verifySubscriptionPayment(
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature
    )

    res.json({ ok: true, data })
  } catch (err) { next(err) }
}
