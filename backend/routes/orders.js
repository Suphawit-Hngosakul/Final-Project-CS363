import { Router } from 'express'
import auth, { requireRole } from '../middleware/auth.js'
import requireOwnership from '../middleware/requireOwnership.js'
import {
  placeOrder,
  getTableOrders,
  updateOrderStatus,
  getRestaurantOrders,
} from '../controllers/orderController.js'

const router = Router()

// Public — ลูกค้าไม่ต้อง login
router.post('/tables/:id/orders', placeOrder)
router.get('/tables/:id/orders', getTableOrders)

// Staff/Admin — ต้อง login
router.patch('/orders/:id/status', auth, requireRole('admin', 'staff'), updateOrderStatus)
router.get('/restaurant/:id/orders', auth, requireRole('admin', 'staff'), requireOwnership, getRestaurantOrders)

export default router
