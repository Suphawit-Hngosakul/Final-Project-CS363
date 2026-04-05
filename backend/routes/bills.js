import { Router } from 'express'
import auth, { requireRole } from '../middleware/auth.js'
import { getTableBill, checkout } from '../controllers/billController.js'

const router = Router()

// Public — ลูกค้าดูบิลได้โดยไม่ต้อง login
router.get('/tables/:id/bill', getTableBill)

// Staff/Admin — ยืนยันชำระเงิน
router.post('/tables/:id/bill/checkout', auth, requireRole('admin', 'staff'), checkout)

export default router
