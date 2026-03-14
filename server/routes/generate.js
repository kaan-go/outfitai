const express = require('express')
const upload = require('../middleware/upload')
const { generate, generateSync, taskStatus, cancelTask } = require('../controllers/generateController')

const router = express.Router()

const imageUpload = upload.fields([
  { name: 'inputImage', maxCount: 14 },
])

router.post('/generate', imageUpload, generate)
router.post('/generate-sync', imageUpload, generateSync)
router.get('/task/:token', taskStatus)
router.post('/task/cancel', cancelTask)

module.exports = router
