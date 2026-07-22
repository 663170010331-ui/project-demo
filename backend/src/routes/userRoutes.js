import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { listTechnicians, listUsers, toggleUserStatus } from '../controllers/userController.js'

const router = Router()

router.get('/technicians', requireAuth, asyncHandler(listTechnicians))
router.get('/', requireAuth, requireRole('operator'), asyncHandler(listUsers))
router.patch('/:role/:id/toggle-status', requireAuth, requireRole('operator'), asyncHandler(toggleUserStatus))

export default router
