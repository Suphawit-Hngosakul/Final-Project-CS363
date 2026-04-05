import { Router } from 'express'
import { body } from 'express-validator'
import auth, { requireRole } from '../middleware/auth.js'
import requireOwnership from '../middleware/requireOwnership.js'
import upload from '../middleware/upload.js'
import {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
} from '../controllers/menuController.js'

const router = Router()

const menuValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('categoryId').notEmpty().withMessage('Category is required'),
]

// Nested under /api/restaurant/:id/menu — ownership ตรวจจาก :id
router.get('/restaurant/:id/menu', auth, requireOwnership, getMenu)
router.post(
  '/restaurant/:id/menu',
  auth,
  requireRole('admin'),
  requireOwnership,
  upload.single('image'),
  menuValidation,
  createMenuItem
)

// Standalone /api/menu/:id — ownership ตรวจใน service layer
router.put(
  '/menu/:id',
  auth,
  requireRole('admin'),
  upload.single('image'),
  menuValidation,
  updateMenuItem
)
router.delete('/menu/:id', auth, requireRole('admin'), deleteMenuItem)
router.patch('/menu/:id/availability', auth, requireRole('admin'), toggleAvailability)

export default router
