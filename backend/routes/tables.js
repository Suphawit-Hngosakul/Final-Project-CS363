import { Router } from 'express'
import auth, { requireRole } from '../middleware/auth.js'
import requireOwnership from '../middleware/requireOwnership.js'
import { getTables, updateTableStatus, getTableQR } from '../controllers/tableController.js'

const router = Router()

// Nested routes — ownership ตรวจจาก :id
router.get('/restaurant/:id/tables', auth, requireOwnership, getTables)
router.get('/restaurant/:id/qr/:tableNo', auth, requireRole('admin'), requireOwnership, getTableQR)

// Standalone — ownership ตรวจใน service layer
router.patch('/tables/:id/status', auth, requireRole('admin', 'staff'), updateTableStatus)

export default router
