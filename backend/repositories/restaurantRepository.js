import Restaurant from '../models/Restaurant.js'

export const findById = (id) => Restaurant.findById(id)

export const create = (data) => Restaurant.create(data)

export const update = (id, data) =>
  Restaurant.findByIdAndUpdate(id, data, { new: true, runValidators: true })
