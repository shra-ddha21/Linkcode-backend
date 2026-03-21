const express = require('express');
const router = express.Router();

// Import controllers
const { signup, login, refreshToken, logout } = require('../controllers/auth.controller');

// @route   POST /api/auth/signup
// @desc    Register a new user (student or instructor)
// @access  Public
router.post('/signup', signup);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/refresh
// @desc    Refresh access token using refresh token in cookies
// @access  Public
router.get('/refresh', refreshToken);

// @route   POST /api/auth/logout
// @desc    Clear cookies & remove refresh token
// @access  Public
router.post('/logout', logout);

module.exports = router;
