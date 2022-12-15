const express = require('express')
const router = express.Router()
const userController = require('../controllers/user') 

router.get('/overview/:uid', userController.helloUser)
router.post('/createuser/:uid', userController.createUser)
//test route
// router.post('/loginuser/:uid', userController.createUser)

module.exports = router