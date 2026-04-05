import { Router } from 'express'
import auth, { requireRole } from '../middleware/auth.js'
import requireOwnership from '../middleware/requireOwnership.js'
import { getDailyReport, getPopularItems } from '../controllers/reportController.js'

const router = Router()

router.get(
  '/restaurant/:id/reports/daily',
  auth,
  requireRole('admin'),
  requireOwnership,
  getDailyReport
)

router.get(
  '/restaurant/:id/reports/popular-items',
  auth,
  requireRole('admin'),
  requireOwnership,
  getPopularItems
)

export default router
