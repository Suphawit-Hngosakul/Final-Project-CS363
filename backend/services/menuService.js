import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'
import createError from '../utils/createError.js'
import * as menuRepo from '../repositories/menuItemRepository.js'
import * as categoryRepo from '../repositories/categoryRepository.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function downloadImageFromUrl(imageUrl) {
  const res = await fetch(imageUrl)
  if (!res.ok) throw createError(400, `ดาวน์โหลดรูปไม่สำเร็จ: HTTP ${res.status}`)

  const contentType = res.headers.get('content-type') || ''
  const extMap = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }
  const ext = extMap[contentType.split(';')[0].trim()] || 'jpg'

  const filename = `${uuidv4()}.${ext}`
  const fullPath = path.join(__dirname, '..', 'uploads', filename)

  const buffer = Buffer.from(await res.arrayBuffer())
  await fs.promises.writeFile(fullPath, buffer)

  return `/uploads/${filename}`
}

function deleteImageFile(imagePath) {
  if (!imagePath || !imagePath.startsWith('/uploads/')) return
  const fullPath = path.join(__dirname, '..', imagePath)
  fs.unlink(fullPath, (err) => {
    if (err && err.code !== 'ENOENT') console.error('Failed to delete image file:', err)
  })
}

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
  if (file) image = `/uploads/${file.filename}`
  else if (imageUrl) image = await downloadImageFromUrl(imageUrl)

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
    deleteImageFile(existing.image)
    updateData.image = `/uploads/${file.filename}`
  } else if (imageUrl !== undefined) {
    deleteImageFile(existing.image)
    updateData.image = await downloadImageFromUrl(imageUrl)
  }

  return menuRepo.update(id, updateData)
}

export const deleteMenuItem = async (id, adminRestaurantId) => {
  const item = await menuRepo.findById(id)
  if (!item) throw createError(404, 'Menu item not found')
  if (item.restaurantId.toString() !== adminRestaurantId) throw createError(403, 'Forbidden')

  await menuRepo.remove(id)
  deleteImageFile(item.image)
}

export const toggleAvailability = async (id, isAvailable, adminRestaurantId) => {
  const item = await menuRepo.findById(id)
  if (!item) throw createError(404, 'Menu item not found')
  if (item.restaurantId.toString() !== adminRestaurantId) throw createError(403, 'Forbidden')

  return menuRepo.update(id, { isAvailable })
}
