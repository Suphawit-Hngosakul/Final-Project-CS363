import { Router } from 'express'
import { body } from 'express-validator'
import { register, login, getMe } from '../controllers/authController.js'
import auth from '../middleware/auth.js'

const router = Router()

router.post(
  '/register',
  [
    body('restaurantName').notEmpty().withMessage('Restaurant name is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  register
)

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
)

router.get('/me', auth, getMe)

export default router
