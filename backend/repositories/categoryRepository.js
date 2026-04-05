import Category from '../models/Category.js'

export const findByRestaurant = (restaurantId) =>
  Category.find({ restaurantId }).sort({ sortOrder: 1, createdAt: 1 })

export const findById = (id) => Category.findById(id)

export const create = (data) => Category.create(data)

export const update = (id, data) =>
  Category.findByIdAndUpdate(id, data, { new: true, runValidators: true })

export const remove = (id) => Category.findByIdAndDelete(id)
