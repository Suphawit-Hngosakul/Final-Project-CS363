import Bill from '../models/Bill.js'
import Order from '../models/Order.js'

// รายงานยอดขายรายวัน
export const getDailyReport = async (restaurantId, dateStr) => {
  // ถ้าไม่ส่ง date มา ใช้วันนี้
  const date = dateStr ? new Date(dateStr) : new Date()
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)

  const bills = await Bill.find({
    restaurantId,
    paymentStatus: 'paid',
    paidAt: { $gte: start, $lte: end },
  })

  const totalRevenue = bills.reduce((sum, b) => sum + b.totalAmount, 0)

  return {
    date: start.toISOString().split('T')[0],
    totalBills: bills.length,
    totalRevenue,
    bills,
  }
}

// รายงานเมนูขายดี
export const getPopularItems = async (restaurantId, limit = 10) => {
  const result = await Order.aggregate([
    { $match: { restaurantId: restaurantId } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.menuItemId',
        name: { $first: '$items.name' },
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: Number(limit) },
  ])

  return result
}
