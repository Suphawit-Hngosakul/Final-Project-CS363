import jwt from 'jsonwebtoken'
import createError from '../utils/createError.js'
import * as userRepo from '../repositories/userRepository.js'
import * as restaurantRepo from '../repositories/restaurantRepository.js'

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, restaurantId: user.restaurantId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

export const register = async ({ restaurantName, name, email, password }) => {
  const existing = await userRepo.findByEmail(email)
  if (existing) throw createError(409, 'Email already in use')

  const restaurant = await restaurantRepo.create({ name: restaurantName })
  const user = await userRepo.create({
    restaurantId: restaurant._id,
    name,
    email,
    password,
    role: 'admin',
  })

  const token = signToken(user)
  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    restaurant: { id: restaurant._id, name: restaurant.name },
  }
}

export const login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email)
  if (!user) throw createError(401, 'Invalid email or password')

  const isMatch = await user.comparePassword(password)
  if (!isMatch) throw createError(401, 'Invalid email or password')

  const token = signToken(user)
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      restaurantId: user.restaurantId,
    },
  }
}

export const getMe = (userId) => userRepo.findById(userId)
