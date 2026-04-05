import { validationResult } from 'express-validator'
import * as authService from '../services/authService.js'

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const result = await authService.register(req.body)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const result = await authService.login(req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id)
    res.json(user)
  } catch (err) {
    next(err)
  }
}
