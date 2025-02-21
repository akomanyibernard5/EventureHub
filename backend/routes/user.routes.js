const express = require('express')
const router = express.Router()
const { updateUserProfile } = require('../controllers/user.controller')
const protect = require('../middleware/auth.middleware')

router.put('/update', protect, updateUserProfile)


module.exports = router 