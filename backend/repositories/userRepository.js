import User from '../models/User.js'

export const findByEmail = (email) => User.findOne({ email })

export const findByIdWithPassword = (id) => User.findById(id)

export const findById = (id) => User.findById(id).select('-password')

export const create = (data) => User.create(data)
