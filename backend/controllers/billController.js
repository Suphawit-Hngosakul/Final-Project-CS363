import * as billService from '../services/billService.js'

// GET /api/tables/:id/bill — สรุปบิลของโต๊ะ (ลูกค้า/พนักงาน)
export const getTableBill = async (req, res, next) => {
  try {
    const bill = await billService.getTableBill(req.params.id)
    res.json(bill)
  } catch (err) {
    next(err)
  }
}

// POST /api/tables/:id/bill/checkout — ชำระเงิน + ปิดโต๊ะ (staff/admin)
export const checkout = async (req, res, next) => {
  try {
    const bill = await billService.checkout(
      req.params.id,
      req.body.paymentMethod,
      req.user.restaurantId
    )

    // แจ้งเตือน customer ว่าชำระเงินแล้ว
    const io = req.app.get('io')
    if (io) {
      io.to(`table:${req.params.id}`).emit('bill_paid', { sessionId: bill.sessionId })
    }

    res.status(201).json(bill)
  } catch (err) {
    next(err)
  }
}
