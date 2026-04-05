import * as orderService from '../services/orderService.js'

// POST /api/tables/:id/orders — ลูกค้าสั่งอาหาร (ไม่ต้อง login)
export const placeOrder = async (req, res, next) => {
  try {
    const order = await orderService.placeOrder(req.params.id, req.body.items)

    // แจ้งเตือน staff แบบ realtime
    const io = req.app.get('io')
    if (io) {
      io.to(`restaurant:${order.restaurantId}`).emit('new_order', order)
    }

    res.status(201).json(order)
  } catch (err) {
    next(err)
  }
}

// GET /api/tables/:id/orders — ดูออเดอร์ของโต๊ะ (ลูกค้า/พนักงาน)
export const getTableOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getTableOrders(req.params.id)
    res.json(orders)
  } catch (err) {
    next(err)
  }
}

// PATCH /api/orders/:id/status — พนักงานอัพเดตสถานะ
export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status,
      req.user.restaurantId
    )

    // แจ้งเตือน customer แบบ realtime
    const io = req.app.get('io')
    if (io) {
      io.to(`table:${order.tableId}`).emit('order_status_updated', {
        orderId: order._id,
        status: order.status,
      })
    }

    res.json(order)
  } catch (err) {
    next(err)
  }
}

// GET /api/restaurant/:id/orders — ดูออเดอร์ทั้งหมดของร้าน (staff/admin)
export const getRestaurantOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getRestaurantOrders(req.params.id)
    res.json(orders)
  } catch (err) {
    next(err)
  }
}
