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

const fs = require('fs')
const clientDistPath = path.join(__dirname, '..', 'client', 'dist')
const indexPath = path.join(clientDistPath, 'index.html')

if (fs.existsSync(clientDistPath)) {
  console.log('Serving static files from:', clientDistPath)
  app.use(express.static(clientDistPath))
  app.get('/{*path}', (req, res) => {
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath)
    } else {
      res.status(404).json({ error: 'index.html not found', path: indexPath })
    }
  })
} else {
  console.log('Client dist not found at:', clientDistPath)
  app.get('/{*path}', (req, res) => {
    res.status(503).json({
      error: 'Frontend not built',
      distPath: clientDistPath,
      cwd: process.cwd(),
      dirname: __dirname
    })
  })
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
