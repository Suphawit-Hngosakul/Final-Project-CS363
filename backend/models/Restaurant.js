import mongoose from 'mongoose'

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, default: '' },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  openingHours: { type: Object, default: {} },
  promptPayQR: { type: String, default: '' },
  tableCount: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Restaurant', restaurantSchema)
