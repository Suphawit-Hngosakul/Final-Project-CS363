import { Router } from 'express'
import { body } from 'express-validator'
import auth, { requireRole } from '../middleware/auth.js'
import requireOwnership from '../middleware/requireOwnership.js'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js'

const router = Router()

// Nested under /api/restaurant/:id/categories — ownership ตรวจจาก :id
router.get('/restaurant/:id/categories', auth, requireOwnership, getCategories)
router.post(
  '/restaurant/:id/categories',
  auth,
  requireRole('admin'),
  requireOwnership,
  [body('name').notEmpty().withMessage('Category name is required')],
  createCategory
)

// Standalone /api/categories/:id — ownership ตรวจใน service layer
router.put(
  '/categories/:id',
  auth,
  requireRole('admin'),
  [body('name').optional().notEmpty().withMessage('Name cannot be empty')],
  updateCategory
)
router.delete('/categories/:id', auth, requireRole('admin'), deleteCategory)

export default router
