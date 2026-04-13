import { Router } from 'express'
import * as paymentController from '../../controllers/payment/payment.controller'
import { authenticate } from '../../middleware/authenticate'

const router = Router()

// Specific routes protection
router.post('/subscribe',    authenticate, paymentController.subscribe)
router.post('/cancel',       authenticate, paymentController.cancelSubscription)
router.post('/verify',       authenticate, paymentController.verifySubscription)
router.get('/subscription',  authenticate, paymentController.getSubscription)
router.get('/usage',         paymentController.getUsage)

export default router
