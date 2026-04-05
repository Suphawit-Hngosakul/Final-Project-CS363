import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  options: [{ name: String, choice: String, extraPrice: Number }],
  note: { type: String, default: '' },
}, { _id: false })

const orderSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
  sessionId: { type: String, required: true },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'cooking', 'ready', 'served'],
    default: 'pending',
  },
  totalAmount: { type: Number, required: true },
}, { timestamps: true })

orderSchema.index({ restaurantId: 1, createdAt: -1 })
orderSchema.index({ tableId: 1, sessionId: 1 })
orderSchema.index({ restaurantId: 1, status: 1 })

export default mongoose.model('Order', orderSchema)
