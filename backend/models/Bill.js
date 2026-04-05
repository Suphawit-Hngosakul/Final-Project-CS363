import mongoose from 'mongoose'

const billSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
  sessionId: { type: String, required: true },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['cash', 'promptpay'],
    default: undefined,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
  paidAt: { type: Date, default: null },
}, { timestamps: true })

billSchema.index({ restaurantId: 1, paidAt: -1 })
billSchema.index({ tableId: 1, sessionId: 1 })
billSchema.index({ restaurantId: 1, paymentStatus: 1 })

export default mongoose.model('Bill', billSchema)
