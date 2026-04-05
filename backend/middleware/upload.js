import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/
  const valid = allowed.test(path.extname(file.originalname).toLowerCase()) &&
    allowed.test(file.mimetype)
  valid ? cb(null, true) : cb(new Error('Only image files are allowed'))
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } })

export default upload
