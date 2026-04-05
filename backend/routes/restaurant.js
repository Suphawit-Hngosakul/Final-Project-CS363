import { Router } from 'express'
import auth, { requireRole } from '../middleware/auth.js'
import requireOwnership from '../middleware/requireOwnership.js'
import { getRestaurant, updateRestaurant } from '../controllers/restaurantController.js'

const router = Router()

router.get('/restaurant/:id', auth, requireOwnership, getRestaurant)
router.put('/restaurant/:id', auth, requireRole('admin'), requireOwnership, updateRestaurant)

export default router
