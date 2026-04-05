import createError from '../utils/createError.js'
import * as categoryRepo from '../repositories/categoryRepository.js'
import * as menuItemRepo from '../repositories/menuItemRepository.js'

export const getCategories = (restaurantId) =>
  categoryRepo.findByRestaurant(restaurantId)

export const createCategory = (restaurantId, { name, sortOrder }) =>
  categoryRepo.create({ restaurantId, name, sortOrder: sortOrder ?? 0 })

export const updateCategory = async (id, { name, sortOrder, isActive }, adminRestaurantId) => {
  const existing = await categoryRepo.findById(id)
  if (!existing) throw createError(404, 'Category not found')
  if (existing.restaurantId.toString() !== adminRestaurantId) throw createError(403, 'Forbidden')

  return categoryRepo.update(id, { name, sortOrder, isActive })
}

export const deleteCategory = async (id, adminRestaurantId) => {
  const existing = await categoryRepo.findById(id)
  if (!existing) throw createError(404, 'Category not found')
  if (existing.restaurantId.toString() !== adminRestaurantId) throw createError(403, 'Forbidden')

  const items = await menuItemRepo.findByCategory(id)
  if (items.length > 0) throw createError(409, 'Cannot delete category that still has menu items')

  await categoryRepo.remove(id)
}
