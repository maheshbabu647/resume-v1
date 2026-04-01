import { Router } from 'express'
import * as paymentController from '../../controllers/payment/payment.controller'

const router = Router()

// All routes require authentication — applied in the parent router
router.post('/subscribe',    paymentController.subscribe)
router.post('/cancel',       paymentController.cancelSubscription)
router.post('/verify',       paymentController.verifySubscription)
router.get('/subscription',  paymentController.getSubscription)
router.get('/usage',         paymentController.getUsage)

export default router
