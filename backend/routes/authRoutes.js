// ============================================================
// AUTH ROUTES
// Public: /register, /login  |  Private: /profile
// ============================================================

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Validation rules for registration
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Validation rules for login
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
];

// PUBLIC ROUTES
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// PRIVATE ROUTES (require JWT token)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
