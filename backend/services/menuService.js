import createError from '../utils/createError.js'
import * as menuRepo from '../repositories/menuItemRepository.js'
import * as categoryRepo from '../repositories/categoryRepository.js'

function parseOptions(raw) {
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    throw createError(400, 'options must be valid JSON')
  }
}

export const getMenu = (restaurantId) =>
  menuRepo.findByRestaurant(restaurantId)

export const createMenuItem = async (restaurantId, body, file) => {
  const { categoryId, name, description, price, options, imageUrl } = body

  // ตรวจสอบว่า category เป็นของร้านนี้
  const category = await categoryRepo.findById(categoryId)
  if (!category || category.restaurantId.toString() !== restaurantId) {
    throw createError(400, 'Invalid category')
  }

  let image = ''
  if (file) image = file.path          // Cloudinary URL
  else if (imageUrl) image = imageUrl  // URL ตรงๆ

  return menuRepo.create({
    restaurantId,
    categoryId,
    name,
    description,
    price: Number(price),
    image,
    options: parseOptions(options),
  })
}

export const updateMenuItem = async (id, body, file, adminRestaurantId) => {
  const existing = await menuRepo.findById(id)
  if (!existing) throw createError(404, 'Menu item not found')
  if (existing.restaurantId.toString() !== adminRestaurantId) throw createError(403, 'Forbidden')

  const { categoryId, name, description, price, options, isAvailable, imageUrl } = body
  const updateData = { categoryId, name, description, isAvailable }
  if (price !== undefined) updateData.price = Number(price)
  if (options !== undefined) updateData.options = parseOptions(options)

  if (file) {
    updateData.image = file.path       // Cloudinary URL
  } else if (imageUrl !== undefined) {
    updateData.image = imageUrl        // URL ตรงๆ
  }

  return menuRepo.update(id, updateData)
}

export const deleteMenuItem = async (id, adminRestaurantId) => {
  const item = await menuRepo.findById(id)
  if (!item) throw createError(404, 'Menu item not found')
  if (item.restaurantId.toString() !== adminRestaurantId) throw createError(403, 'Forbidden')

  await menuRepo.remove(id)
}

export const toggleAvailability = async (id, isAvailable, adminRestaurantId) => {
  const item = await menuRepo.findById(id)
  if (!item) throw createError(404, 'Menu item not found')
  if (item.restaurantId.toString() !== adminRestaurantId) throw createError(403, 'Forbidden')

  return menuRepo.update(id, { isAvailable })
}
