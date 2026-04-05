import MenuItem from '../models/MenuItem.js'

export const findByRestaurant = (restaurantId) =>
  MenuItem.find({ restaurantId })
    .populate('categoryId', 'name sortOrder')
    .sort({ createdAt: 1 })

export const findById = (id) => MenuItem.findById(id)

export const create = (data) => MenuItem.create(data)

export const update = (id, data) =>
  MenuItem.findByIdAndUpdate(id, data, { new: true, runValidators: true })

export const remove = (id) => MenuItem.findByIdAndDelete(id)

export const findByCategory = (categoryId) =>
  MenuItem.find({ categoryId }).select('_id').lean()
