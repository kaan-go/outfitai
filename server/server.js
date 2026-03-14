require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const generateRoutes = require('./routes/generate')
const avatarRoutes = require('./routes/avatar')

const app = express()
const PORT = process.env.PORT || 3001

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
  process.env.CLIENT_URL
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(null, true)
    }
  }
}))
app.use(express.json())

app.use('/api', generateRoutes)
app.use('/api', avatarRoutes)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

const clientDistPath = path.join(__dirname, '..', 'client', 'dist')
app.use(express.static(clientDistPath))
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
