import { validationResult } from 'express-validator'
import * as restaurantService from '../services/restaurantService.js'

// GET /api/restaurant/:id
export const getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await restaurantService.getRestaurant(req.params.id)
    res.json(restaurant)
  } catch (err) {
    next(err)
  }
}

// PUT /api/restaurant/:id — Admin only
export const updateRestaurant = async (req, res, next) => {
  try {
    const updated = await restaurantService.updateRestaurant(req.params.id, req.body)
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

// PUT /api/restaurant/:id/pin — Admin only
export const setPin = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const updated = await restaurantService.setPin(req.params.id, req.body.pin)
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

// POST /api/restaurant/:id/pin/verify
export const verifyPin = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const result = await restaurantService.verifyPin(req.params.id, req.body.pin)
    res.json(result)
  } catch (err) {
    next(err)
  }
}
