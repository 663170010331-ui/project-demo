import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { list, markRead, markAllRead } from '../controllers/notificationController.js'

const router = Router()

// No requireRole here on purpose — all 3 roles (citizen/operator/technician)
// read their own notifications through the same endpoints; the controller
// scopes every query to req.user, so there's nothing role-specific to gate.
router.get('/', requireAuth, asyncHandler(list))
router.patch('/read-all', requireAuth, asyncHandler(markAllRead))
router.patch('/:id/read', requireAuth, asyncHandler(markRead))

export default router