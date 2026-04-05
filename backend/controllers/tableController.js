import * as tableService from '../services/tableService.js'

// GET /api/restaurant/:id/tables
export const getTables = async (req, res, next) => {
  try {
    const tables = await tableService.getTables(req.params.id)
    res.json(tables)
  } catch (err) {
    next(err)
  }
}

// PATCH /api/tables/:id/status — Staff/Admin
export const updateTableStatus = async (req, res, next) => {
  try {
    const table = await tableService.updateTableStatus(
      req.params.id,
      req.body.status,
      req.user.restaurantId
    )
    res.json(table)
  } catch (err) {
    next(err)
  }
}

// GET /api/restaurant/:id/qr/:tableNo — Admin
export const getTableQR = async (req, res, next) => {
  try {
    const result = await tableService.getTableQR(req.params.id, req.params.tableNo)
    res.json(result)
  } catch (err) {
    next(err)
  }
}
