import mongoose from 'mongoose'

const choiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  extraPrice: { type: Number, default: 0 },
}, { _id: false })

const optionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  required: { type: Boolean, default: false },
  choices: [choiceSchema],
}, { _id: false })

const menuItemSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  options: [optionSchema],
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('MenuItem', menuItemSchema)
