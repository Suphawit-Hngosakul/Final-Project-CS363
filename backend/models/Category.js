import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

// ชื่อหมวดหมู่ต้องไม่ซ้ำกันภายในร้านเดียวกัน
categorySchema.index({ restaurantId: 1, name: 1 }, { unique: true })

export default mongoose.model('Category', categorySchema)
