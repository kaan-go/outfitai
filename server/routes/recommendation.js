const express = require('express')
const router = express.Router()
const { startRecommendation, getRecommendationResult } = require('../controllers/recommendationController')

router.post('/recommend', startRecommendation)
router.get('/recommend/task/:token', getRecommendationResult)

module.exports = router
