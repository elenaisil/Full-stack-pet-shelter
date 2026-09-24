
const express = require('express')
const router = express.Router()
const AdopterController = require('../controller/AdopterController')

// check if admin and check if login
const isAdmin = require('../middleware/isAdmin')
const verify = require('../middleware/auth')
// aut
router.post('/signup', AdopterController.signup)
router.post('/login', AdopterController.login)


//crud
router.get('/',verify, isAdmin, AdopterController.getAllAdopters)
router.get('/:id',verify, AdopterController.getAdopterById)

module.exports = router