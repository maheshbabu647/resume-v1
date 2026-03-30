import { Router } from 'express'
import * as userController from '../../controllers/user/user.controller'
import { validate }         from '../../middleware/validate'
import { updateUserSchema } from '../../schemas/user.schema'

const router = Router()
// authenticate applied in routers/index.ts
router.get('/',    userController.getMe)
router.patch('/',  validate('body', updateUserSchema), userController.updateMe)
router.delete('/', userController.deleteMe)

export default router
