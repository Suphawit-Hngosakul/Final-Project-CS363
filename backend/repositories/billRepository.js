import Bill from '../models/Bill.js'

export const create = (data) => new Bill(data).save()

export const createWithSession = (data, session) => Bill.create([data], { session })

export const findBySession = (tableId, sessionId) =>
  Bill.findOne({ tableId, sessionId })

export const findByRestaurant = (restaurantId) =>
  Bill.find({ restaurantId }).sort({ createdAt: -1 })

export const findById = (id) => Bill.findById(id)

export const update = (id, data) =>
  Bill.findByIdAndUpdate(id, data, { new: true })
