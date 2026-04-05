import { Router } from 'express'
import * as menuService from '../services/menuService.js'
import * as categoryService from '../services/categoryService.js'
import Table from '../models/Table.js'
import Restaurant from '../models/Restaurant.js'

const router = Router()

// Trim whitespace จาก params เพื่อป้องกัน ObjectId cast error
router.param('id', (req, res, next, val) => {
  req.params.id = val.trim()
  next()
})
router.param('num', (req, res, next, val) => {
  req.params.num = val.trim()
  next()
})

// Public — ลูกค้าดูเมนูได้โดยไม่ต้อง login
router.get('/public/restaurant/:id/menu', async (req, res, next) => {
  try {
    const items = await menuService.getMenu(req.params.id)
    // ส่งเฉพาะเมนูที่พร้อมขาย
    res.json(items.filter(i => i.isAvailable !== false))
  } catch (err) {
    next(err)
  }
})

// Public — ลูกค้าดูหมวดหมู่ได้โดยไม่ต้อง login
router.get('/public/restaurant/:id/categories', async (req, res, next) => {
  try {
    const cats = await categoryService.getCategories(req.params.id)
    res.json(cats.filter(c => c.isActive !== false))
  } catch (err) {
    next(err)
  }
})

// Public — ข้อมูลร้านพื้นฐาน
router.get('/public/restaurant/:id', async (req, res, next) => {
  try {
    const r = await Restaurant.findById(req.params.id).select('name phone address')
    if (!r) return res.status(404).json({ message: 'Restaurant not found' })
    res.json(r)
  } catch (err) {
    next(err)
  }
})

// Public — หาโต๊ะของร้าน by tableNumber
router.get('/public/restaurant/:id/table-by-number/:num', async (req, res, next) => {
  try {
    const table = await Table.findOne({
      restaurantId: req.params.id,
      tableNumber: Number(req.params.num),
    })
    if (!table) return res.status(404).json({ message: 'Table not found' })
    res.json(table)
  } catch (err) {
    next(err)
  }
})

export default router
