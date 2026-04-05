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
