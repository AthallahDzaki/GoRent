import { Router } from 'express'
import { getAllUsers, getUserProfile } from '../controllers/user.controller.js'
import { isAdmin, authenticate } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', [ authenticate, isAdmin ], getAllUsers)
router.get('/profile', [ authenticate ], getUserProfile)

export default router