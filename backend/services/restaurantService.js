import bcrypt from 'bcryptjs'
import createError from '../utils/createError.js'
import * as restaurantRepo from '../repositories/restaurantRepository.js'
import * as tableRepo from '../repositories/tableRepository.js'

const PIN_REGEX = /^\d{4,6}$/

// ตัด kioskPin (hash) ออกจาก response แล้วบอกแค่ว่าตั้ง PIN ไว้หรือยัง
const toPublic = (doc) => {
  const { kioskPin, ...rest } = doc.toObject()
  return { ...rest, hasPin: !!kioskPin }
}

export const getRestaurant = async (id) => {
  const restaurant = await restaurantRepo.findById(id)
  if (!restaurant) throw createError(404, 'Restaurant not found')
  return toPublic(restaurant)
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

  const updated = await restaurantRepo.update(id, { name, logo, address, phone, openingHours, promptPayQR, tableCount })
  return toPublic(updated)
}

// ตั้ง / เปลี่ยน PIN ปลดล็อก (เก็บแบบ bcrypt hash)
export const setPin = async (id, pin) => {
  if (!PIN_REGEX.test(String(pin))) throw createError(400, 'PIN must be 4-6 digits')

  const restaurant = await restaurantRepo.findById(id)
  if (!restaurant) throw createError(404, 'Restaurant not found')

  const kioskPin = await bcrypt.hash(String(pin), 10)
  const updated = await restaurantRepo.update(id, { kioskPin })
  return toPublic(updated)
}

// ตรวจ PIN ปลดล็อก — ไม่คืน hash
export const verifyPin = async (id, pin) => {
  const restaurant = await restaurantRepo.findById(id)
  if (!restaurant) throw createError(404, 'Restaurant not found')
  if (!restaurant.kioskPin) throw createError(409, 'PIN has not been set')

  const isMatch = await bcrypt.compare(String(pin), restaurant.kioskPin)
  if (!isMatch) throw createError(401, 'Invalid PIN')

  return { ok: true }
}
