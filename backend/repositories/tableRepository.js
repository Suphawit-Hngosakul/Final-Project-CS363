import Table from '../models/Table.js'

export const findByRestaurant = (restaurantId) =>
  Table.find({ restaurantId }).sort({ tableNumber: 1 })

export const findById = (id) => Table.findById(id)

export const update = (id, data) =>
  Table.findByIdAndUpdate(id, data, { new: true })

export const updateWithSession = (id, data, session) =>
  Table.findByIdAndUpdate(id, data, { new: true, session })

export const insertMany = (docs) => Table.insertMany(docs)

export const deleteMany = (filter) => Table.deleteMany(filter)

export const claimIfAvailable = (tableId, sessionId) =>
  Table.findOneAndUpdate(
    { _id: tableId, status: 'available' },
    { status: 'occupied', currentSessionId: sessionId },
    { new: true }
  )
