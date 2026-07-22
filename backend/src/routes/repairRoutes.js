import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  list, getById, create, assignTechnician, updateStatus, getStats,
} from '../controllers/repairController.js'

const router = Router()

router.get('/', requireAuth, asyncHandler(list))
router.get('/stats', requireAuth, requireRole('operator'), asyncHandler(getStats))
router.get('/:id', requireAuth, asyncHandler(getById))
router.post('/', requireAuth, requireRole('citizen'), asyncHandler(create))
router.post('/:id/assign', requireAuth, requireRole('operator'), asyncHandler(assignTechnician))
router.patch('/:id/status', requireAuth, requireRole('technician', 'operator'), asyncHandler(updateStatus))

export default router
