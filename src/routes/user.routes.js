import { Router } from 'express'
import { getAllUsers, createUser } from '../controllers/user.controller.js'
import validateBody from '../middlewares/validateBody.middleware.js'
import userScheme from '../validators/user.validator.js'

const router = Router()

router.get('/', getAllUsers)
router.post('/', validateBody(userScheme), createUser)

export default router