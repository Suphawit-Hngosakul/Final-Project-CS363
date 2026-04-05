import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import swaggerUi from 'swagger-ui-express'
import connectDB from './config/db.js'
import errorHandler from './middleware/errorHandler.js'
import swaggerDefinition from './config/swagger.js'
import authRoutes from './routes/auth.js'
import restaurantRoutes from './routes/restaurant.js'
import categoryRoutes from './routes/categories.js'
import menuRoutes from './routes/menu.js'
import tableRoutes from './routes/tables.js'
import orderRoutes from './routes/orders.js'
import billRoutes from './routes/bills.js'
import publicRoutes from './routes/public.js'
import reportRoutes from './routes/reports.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []

app.use(cors({
  origin: (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)),
  credentials: true,
}))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
})

// แชร์ io instance ให้ controllers ใช้ผ่าน req.app.get('io')
app.set('io', io)

io.on('connection', (socket) => {
  // Staff/Admin join ห้องร้าน เพื่อรับ new_order
  socket.on('join_restaurant', (restaurantId) => {
    socket.join(`restaurant:${restaurantId}`)
  })

  // Customer join ห้องโต๊ะ เพื่อรับ order status updates
  socket.on('join_table', (tableId) => {
    socket.join(`table:${tableId}`)
  })

  socket.on('disconnect', () => { })
})

connectDB()

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition, {
  customSiteTitle: 'EzyOrder API Docs',
  swaggerOptions: { persistAuthorization: true },
}))

app.get('/', (_req, res) => res.json({ message: 'EzyOrder API running' }))
app.use('/api', publicRoutes)
app.use('/api/auth', authRoutes)
app.use('/api', restaurantRoutes)
app.use('/api', categoryRoutes)
app.use('/api', menuRoutes)
app.use('/api', tableRoutes)
app.use('/api', orderRoutes)
app.use('/api', billRoutes)
app.use('/api', reportRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 8080
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`))
