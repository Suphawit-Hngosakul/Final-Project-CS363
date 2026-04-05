const errorHandler = (err, _req, res, _next) => {
  console.error(err.stack)

  if (err.name === 'MulterError') {
    const messages = {
      LIMIT_FILE_SIZE: 'ไฟล์รูปมีขนาดใหญ่เกินไป (สูงสุด 10 MB)',
      LIMIT_UNEXPECTED_FILE: 'ประเภทไฟล์ไม่ถูกต้อง',
    }
    return res.status(400).json({ message: messages[err.code] || err.message })
  }

  const status = err.status || 500
  res.status(status).json({ message: err.message || 'Internal server error' })
}

export default errorHandler
