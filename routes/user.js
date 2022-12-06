const express = require('express')
const router = express.Router()
const userController = require('../controllers/user') 

router.get('/overview/:uid', userController.helloUser)

module.exports = router