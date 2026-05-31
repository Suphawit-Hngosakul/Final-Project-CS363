import { v4 as uuidv4 } from 'uuid'
import createError from '../utils/createError.js'
import * as orderRepo from '../repositories/orderRepository.js'
import * as tableRepo from '../repositories/tableRepository.js'
import MenuItem from '../models/MenuItem.js'

const ORDER_STATUSES = ['pending', 'accepted', 'cooking', 'ready', 'served']

// ลูกค้าสั่งอาหาร — ไม่ต้อง login
export const placeOrder = async (tableId, rawItems) => {
  const table = await tableRepo.findById(tableId)
  if (!table) throw createError(404, 'Table not found')

  // ถ้าโต๊ะรอชำระเงินอยู่ → ไม่ให้สั่งเพิ่ม
  if (table.status === 'payment') {
    throw createError(400, 'Table is waiting for payment, cannot place new order')
  }

  // ถ้าโต๊ะว่าง atomic claim เพื่อป้องกัน race condition
  let sessionId = table.currentSessionId
  if (table.status === 'available' || !sessionId) {
    const newSessionId = uuidv4()
    const claimed = await tableRepo.claimIfAvailable(tableId, newSessionId)
    if (claimed) {
      sessionId = newSessionId
    } else {
      // request อื่น claim ไปก่อน ดึงข้อมูลล่าสุด
      const refreshed = await tableRepo.findById(tableId)
      if (refreshed.status === 'payment') {
        throw createError(400, 'Table is waiting for payment, cannot place new order')
      }
      sessionId = refreshed.currentSessionId
    }
  }

  // ตรวจสอบ items และดึงราคาจริงจาก DB
  if (!rawItems || rawItems.length === 0) throw createError(400, 'Order must have at least one item')

  const menuItemIds = rawItems.map((i) => i.menuItemId)
  const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } })
  const menuMap = Object.fromEntries(menuItems.map((m) => [m._id.toString(), m]))

  let totalAmount = 0
  const items = rawItems.map((raw) => {
    const menu = menuMap[raw.menuItemId]
    if (!menu) throw createError(404, `Menu item ${raw.menuItemId} not found`)
    if (!menu.isAvailable) throw createError(400, `${menu.name} is not available`)

    let itemPrice = menu.price
    const options = (raw.options || []).map((opt) => {
      itemPrice += opt.extraPrice || 0
      return { name: opt.name, choice: opt.choice, extraPrice: opt.extraPrice || 0 }
    })

    const quantity = raw.quantity || 1
    totalAmount += itemPrice * quantity

    return {
      menuItemId: menu._id,
      name: menu.name,
      price: menu.price,
      quantity,
      options,
      note: raw.note || '',
    }
  })

  const order = await orderRepo.create({
    restaurantId: table.restaurantId,
    tableId: table._id,
    sessionId,
    items,
    status: 'pending',
    totalAmount,
  })

  return order
}

// GET orders ของโต๊ะ (by current sessionId)
export const getTableOrders = async (tableId) => {
  const table = await tableRepo.findById(tableId)
  if (!table) throw createError(404, 'Table not found')
  if (!table.currentSessionId) return []

  return orderRepo.findBySession(tableId, table.currentSessionId)
}

// พนักงานอัพเดตสถานะออเดอร์
export const updateOrderStatus = async (orderId, status, staffRestaurantId) => {
  if (!ORDER_STATUSES.includes(status)) throw createError(400, 'Invalid status value')

  const order = await orderRepo.findById(orderId)
  if (!order) throw createError(404, 'Order not found')
  if (order.restaurantId.toString() !== staffRestaurantId) throw createError(403, 'Forbidden')

  return orderRepo.update(orderId, { status })
}

// ดูออเดอร์ทั้งหมดของร้าน
export const getRestaurantOrders = (restaurantId) =>
  orderRepo.findByRestaurant(restaurantId)
