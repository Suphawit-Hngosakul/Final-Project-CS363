import { Router } from 'express'
import { body } from 'express-validator'
import auth, { requireRole } from '../middleware/auth.js'
import requireOwnership from '../middleware/requireOwnership.js'
import {
  getRestaurant,
  updateRestaurant,
  setPin,
  verifyPin,
} from '../controllers/restaurantController.js'

const router = Router()

router.get('/restaurant/:id', auth, requireOwnership, getRestaurant)
router.put('/restaurant/:id', auth, requireRole('admin'), requireOwnership, updateRestaurant)

router.put(
  '/restaurant/:id/pin',
  auth,
  requireRole('admin'),
  requireOwnership,
  [body('pin').matches(/^\d{4,6}$/).withMessage('PIN must be 4-6 digits')],
  setPin
)

router.post(
  '/restaurant/:id/pin/verify',
  auth,
  requireOwnership,
  [body('pin').notEmpty().withMessage('PIN is required')],
  verifyPin
)

export default router
