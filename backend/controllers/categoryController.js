import { validationResult } from 'express-validator'
import * as categoryService from '../services/categoryService.js'

// GET /api/restaurant/:id/categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories(req.params.id)
    res.json(categories)
  } catch (err) {
    next(err)
  }
}

// POST /api/restaurant/:id/categories — Admin only
export const createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const category = await categoryService.createCategory(req.params.id, req.body)
    res.status(201).json(category)
  } catch (err) {
    next(err)
  }
}

// PUT /api/categories/:id — Admin only
export const updateCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const category = await categoryService.updateCategory(req.params.id, req.body, req.user.restaurantId)
    res.json(category)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/categories/:id — Admin only
export const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id, req.user.restaurantId)
    res.json({ message: 'Category deleted' })
  } catch (err) {
    next(err)
  }
}
