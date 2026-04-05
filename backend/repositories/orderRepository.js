import Order from '../models/Order.js'

export const create = (data) => new Order(data).save()

export const findBySession = (tableId, sessionId) =>
  Order.find({ tableId, sessionId }).sort({ createdAt: 1 })

export const findByRestaurant = (restaurantId) =>
  Order.find({ restaurantId }).sort({ createdAt: -1 })

export const findById = (id) => Order.findById(id)

export const update = (id, data) =>
  Order.findByIdAndUpdate(id, data, { new: true })

export const findBySessionIds = (sessionIds) =>
  Order.find({ sessionId: { $in: sessionIds } })
