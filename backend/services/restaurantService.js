import createError from '../utils/createError.js'
import * as restaurantRepo from '../repositories/restaurantRepository.js'
import * as tableRepo from '../repositories/tableRepository.js'

export const getRestaurant = async (id) => {
  const restaurant = await restaurantRepo.findById(id)
  if (!restaurant) throw createError(404, 'Restaurant not found')
  return restaurant
}

export const updateRestaurant = async (id, data) => {
  const { name, logo, address, phone, openingHours, promptPayQR, tableCount } = data

  const restaurant = await restaurantRepo.findById(id)
  if (!restaurant) throw createError(404, 'Restaurant not found')

  if (tableCount !== undefined && Number(tableCount) !== restaurant.tableCount) {
    const newCount = Number(tableCount)
    const oldCount = restaurant.tableCount

    if (newCount > oldCount) {
      const docs = []
      for (let i = oldCount + 1; i <= newCount; i++) {
        docs.push({ restaurantId: restaurant._id, tableNumber: i })
      }
      await tableRepo.insertMany(docs)
    } else if (newCount < oldCount) {
      // ตรวจสอบว่าไม่มีโต๊ะที่กำลังใช้งานอยู่ในช่วงที่จะลบ
      const allTables = await tableRepo.findByRestaurant(restaurant._id)
      const blockedTables = allTables.filter(
        (t) => t.tableNumber > newCount && t.status !== 'available'
      )
      if (blockedTables.length > 0) {
        throw createError(
          409,
          `ไม่สามารถลดจำนวนโต๊ะได้: โต๊ะหมายเลข ${blockedTables.map((t) => t.tableNumber).join(', ')} กำลังถูกใช้งานอยู่`
        )
      }
      await tableRepo.deleteMany({
        restaurantId: restaurant._id,
        tableNumber: { $gt: newCount },
      })
    }
  }

  return restaurantRepo.update(id, { name, logo, address, phone, openingHours, promptPayQR, tableCount })
}
