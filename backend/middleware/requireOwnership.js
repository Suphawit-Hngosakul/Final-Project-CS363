/**
 * ตรวจสอบว่า req.params.id ตรงกับ restaurantId ของ admin ที่ login อยู่
 * ใช้กับ routes ที่มี restaurant ID เป็น path param (:id)
 * เพื่อป้องกัน admin ร้านหนึ่งแก้ข้อมูลร้านอื่น
 */
const requireOwnership = (req, res, next) => {
  if (req.params.id !== req.user.restaurantId?.toString()) {
    return res.status(403).json({ message: 'Forbidden: this resource does not belong to your restaurant' })
  }
  next()
}

export default requireOwnership
