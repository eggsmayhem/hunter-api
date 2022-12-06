const express = require('express')
const router = express.Router()
const exchangesController = require('../controllers/exchanges') 

router.post('/speaktohunter/:uid', exchangesController.speakToHunter)

module.exports = router