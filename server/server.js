require('dotenv').config()
const express = require('express')
const cors = require('cors')
const generateRoutes = require('./routes/generate')
const avatarRoutes = require('./routes/avatar')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api', generateRoutes)
app.use('/api', avatarRoutes)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
