const express = require('express')
const router = express.Router()
const exchangesController = require('../controllers/exchanges') 

router.post('/speaktohunter', exchangesController.speakToHunter)
router.post('/getthenews', exchangesController.getTheNews)
router.get('/', exchangesController.helloWorld)

module.exports = router