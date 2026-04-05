import { validationResult } from 'express-validator'
import * as menuService from '../services/menuService.js'

// GET /api/restaurant/:id/menu
export const getMenu = async (req, res, next) => {
  try {
    const items = await menuService.getMenu(req.params.id)
    res.json(items)
  } catch (err) {
    next(err)
  }
}

// POST /api/restaurant/:id/menu — Admin only
export const createMenuItem = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const item = await menuService.createMenuItem(req.params.id, req.body, req.file)
    res.status(201).json(item)
  } catch (err) {
    next(err)
  }
}

// PUT /api/menu/:id — Admin only
export const updateMenuItem = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const item = await menuService.updateMenuItem(req.params.id, req.body, req.file, req.user.restaurantId)
    res.json(item)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/menu/:id — Admin only
export const deleteMenuItem = async (req, res, next) => {
  try {
    await menuService.deleteMenuItem(req.params.id, req.user.restaurantId)
    res.json({ message: 'Menu item deleted' })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/menu/:id/availability — Admin only
export const toggleAvailability = async (req, res, next) => {
  try {
    const { isAvailable } = req.body
    if (isAvailable === undefined) {
      return res.status(400).json({ message: 'isAvailable is required' })
    }
    const item = await menuService.toggleAvailability(req.params.id, isAvailable, req.user.restaurantId)
    res.json(item)
  } catch (err) {
    next(err)
  }
}
