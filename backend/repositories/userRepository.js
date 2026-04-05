import User from '../models/User.js'

// คืนค่า user พร้อม password hash เพราะต้องใช้สำหรับ comparePassword ตอน login
export const findByEmail = (email) => User.findOne({ email })

// ตัด password ออกก่อนคืนค่า (ใช้สำหรับ getMe และ profile ทั่วไป)
export const findById = (id) => User.findById(id).select('-password')

export const create = (data) => User.create(data)
