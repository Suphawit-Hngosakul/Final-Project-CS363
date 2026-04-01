import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }))
app.use(express.json())

connectDB()

app.get('/', (req, res) => res.json({ message: 'QR Order API running' }))

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
