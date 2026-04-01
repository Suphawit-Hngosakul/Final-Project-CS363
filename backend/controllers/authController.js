import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import User from '../models/User.js'
import Restaurant from '../models/Restaurant.js'

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, restaurantId: user.restaurantId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

// POST /api/auth/register — Admin สร้างร้านใหม่พร้อม account
export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { restaurantName, name, email, password } = req.body

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' })
    }

    const restaurant = await Restaurant.create({ name: restaurantName })
    const user = await User.create({
      restaurantId: restaurant._id,
      name,
      email,
      password,
      role: 'admin',
    })

    const token = signToken(user)
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      restaurant: { id: restaurant._id, name: restaurant.name },
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/login — Staff/Admin login
export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = signToken(user)
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, restaurantId: user.restaurantId },
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/me — ดูข้อมูล user ปัจจุบัน
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    next(err)
  }
}
