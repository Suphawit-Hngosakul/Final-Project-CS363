import QRCode from 'qrcode'
import createError from '../utils/createError.js'
import * as tableRepo from '../repositories/tableRepository.js'

const ALLOWED_STATUSES = ['available', 'occupied', 'payment']

export const getTables = (restaurantId) =>
  tableRepo.findByRestaurant(restaurantId)

export const updateTableStatus = async (id, status, adminRestaurantId) => {
  if (!ALLOWED_STATUSES.includes(status)) {
    throw createError(400, 'Invalid status value')
  }

  const table = await tableRepo.findById(id)
  if (!table) throw createError(404, 'Table not found')
  if (table.restaurantId.toString() !== adminRestaurantId) throw createError(403, 'Forbidden')

  return tableRepo.update(id, { status })
}

export const getTableQR = async (restaurantId, tableNo) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
  const url = `${frontendUrl}/r/${restaurantId}/table/${tableNo}`
  const qr = await QRCode.toDataURL(url)
  return { qr, url }
}
