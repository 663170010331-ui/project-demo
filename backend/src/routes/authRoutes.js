import { Router } from 'express'
import { login, lineLogin } from '../controllers/authController.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()
router.post('/login', asyncHandler(login))
router.post('/line-login', asyncHandler(lineLogin))

export default router
