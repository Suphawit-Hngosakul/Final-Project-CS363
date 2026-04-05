import mongoose from 'mongoose'
import createError from '../utils/createError.js'
import * as billRepo from '../repositories/billRepository.js'
import * as orderRepo from '../repositories/orderRepository.js'
import * as tableRepo from '../repositories/tableRepository.js'

// สรุปบิลของโต๊ะ (ลูกค้า/พนักงาน)
export const getTableBill = async (tableId) => {
  const table = await tableRepo.findById(tableId)
  if (!table) throw createError(404, 'Table not found')
  if (!table.currentSessionId) throw createError(404, 'No active session for this table')

  const orders = await orderRepo.findBySession(tableId, table.currentSessionId)
  const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0)

  return {
    tableId,
    tableNumber: table.tableNumber,
    sessionId: table.currentSessionId,
    orders,
    totalAmount,
  }
}

// ชำระเงิน + ปิดโต๊ะ — staff/admin เท่านั้น
export const checkout = async (tableId, paymentMethod, staffRestaurantId) => {
  const ALLOWED_METHODS = ['cash', 'promptpay']
  if (!ALLOWED_METHODS.includes(paymentMethod)) {
    throw createError(400, 'paymentMethod must be cash or promptpay')
  }

  const table = await tableRepo.findById(tableId)
  if (!table) throw createError(404, 'Table not found')
  if (table.restaurantId.toString() !== staffRestaurantId) throw createError(403, 'Forbidden')
  if (!table.currentSessionId) throw createError(400, 'No active session to checkout')
  if (table.status === 'available') throw createError(400, 'Table is already available')

  const orders = await orderRepo.findBySession(tableId, table.currentSessionId)
  if (orders.length === 0) throw createError(400, 'No orders found for this session')

  const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0)

  // ใช้ transaction เพื่อให้ bill + table update เกิดพร้อมกัน (atomic)
  const session = await mongoose.startSession()
  let bill
  try {
    await session.withTransaction(async () => {
      const [created] = await billRepo.createWithSession(
        {
          restaurantId: table.restaurantId,
          tableId: table._id,
          sessionId: table.currentSessionId,
          orders: orders.map((o) => o._id),
          totalAmount,
          paymentMethod,
          paymentStatus: 'paid',
          paidAt: new Date(),
        },
        session
      )
      await tableRepo.updateWithSession(tableId, { status: 'available', currentSessionId: null }, session)
      bill = created
    })
  } finally {
    session.endSession()
  }

  return bill
}
