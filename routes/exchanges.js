const express = require('express')
const router = express.Router()
const exchangesController = require('../controllers/exchanges') 

router.post('/speaktohunter/:uid', exchangesController.speakToHunter)
router.post('/getthenews/:uid', exchangesController.getTheNews)
router.get('/', exchangesController.helloWorld)

module.exports = router