import { Router } from 'express'
import { handleRazorpay } from '../../controllers/webhook/webhook.controller'

const router = Router()
// No auth — signature verified inside controller
router.post('/razorpay', handleRazorpay)

export default router
