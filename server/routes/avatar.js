const express = require('express')
const { createAvatar, avatarTaskStatus } = require('../controllers/avatarController')

const router = express.Router()

router.post('/avatar/generate', createAvatar)
router.get('/avatar/task/:token', avatarTaskStatus)

module.exports = router
