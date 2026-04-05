/**
 * สร้าง Error object พร้อม HTTP status code
 * ใช้ใน Service layer เพื่อให้ errorHandler จัดการต่อได้
 */
const createError = (status, message) => {
  const err = new Error(message)
  err.status = status
  return err
}

export default createError
