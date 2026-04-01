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
    default: null,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
  paidAt: { type: Date, default: null },
}, { timestamps: true })

export default mongoose.model('Bill', billSchema)
