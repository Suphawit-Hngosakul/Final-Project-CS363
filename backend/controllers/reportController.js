import * as reportService from '../services/reportService.js'
import mongoose from 'mongoose'

// GET /api/restaurant/:id/reports/daily?date=2026-04-05
export const getDailyReport = async (req, res, next) => {
  try {
    const report = await reportService.getDailyReport(
      new mongoose.Types.ObjectId(req.params.id),
      req.query.date
    )
    res.json(report)
  } catch (err) {
    next(err)
  }
}

// GET /api/restaurant/:id/reports/popular-items?limit=10
export const getPopularItems = async (req, res, next) => {
  try {
    const items = await reportService.getPopularItems(
      new mongoose.Types.ObjectId(req.params.id),
      req.query.limit
    )
    res.json(items)
  } catch (err) {
    next(err)
  }
}
