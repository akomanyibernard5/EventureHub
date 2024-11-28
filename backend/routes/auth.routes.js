const express = require('express');
const router = express.Router();
const { signup, login, logout, changePassword } = require('../controllers/auth.controller');
const { body } = require('express-validator');
const protect = require('../middleware/auth.middleware');

router.post('/signup',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  signup
);

router.post('/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  login
);

router.post('/logout', protect, logout);

router.post('/change-password', protect, changePassword);

module.exports = router; 