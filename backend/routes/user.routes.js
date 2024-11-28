const express = require('express')
const router = express.Router()
const { updateUserProfile, googleSignup } = require('../controllers/user.controller')
const protect = require('../middleware/auth.middleware')

router.put('/update', protect, updateUserProfile)
router.post('/google', googleSignup);

module.exports = router 