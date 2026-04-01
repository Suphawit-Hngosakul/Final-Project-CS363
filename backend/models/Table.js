import mongoose from 'mongoose'

const tableSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  tableNumber: { type: Number, required: true },
  status: {
    type: String,
    enum: ['available', 'occupied', 'payment'],
    default: 'available',
  },
  currentSessionId: { type: String, default: null },
}, { timestamps: true })

tableSchema.index({ restaurantId: 1, tableNumber: 1 }, { unique: true })

export default mongoose.model('Table', tableSchema)
