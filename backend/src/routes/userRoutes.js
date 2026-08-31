import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  listTechnicians, listUsers, toggleUserStatus,
  updateMe, changeMyPassword,
  createUser, updateUser, deleteUser,
} from '../controllers/userController.js'

const router = Router()

// Self-service — any authenticated role, scoped to req.user inside the
// controller. Registered before the /:role/:id routes below so "me" is
// never swallowed by the :role param.
router.patch('/me', requireAuth, asyncHandler(updateMe))
router.patch('/me/password', requireAuth, asyncHandler(changeMyPassword))

router.get('/technicians', requireAuth, asyncHandler(listTechnicians))
router.get('/', requireAuth, requireRole('operator'), asyncHandler(listUsers))

// Admin CRUD — operator only.
router.post('/', requireAuth, requireRole('operator'), asyncHandler(createUser))
router.patch('/:role/:id/toggle-status', requireAuth, requireRole('operator'), asyncHandler(toggleUserStatus))
router.patch('/:role/:id', requireAuth, requireRole('operator'), asyncHandler(updateUser))
router.delete('/:role/:id', requireAuth, requireRole('operator'), asyncHandler(deleteUser))

export default router