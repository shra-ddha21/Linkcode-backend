const express = require('express');
const passport = require('passport');
const { googleAuthCallback } = require('../controllers/googleAuth.controller');

const router = express.Router();

// @route   GET /api/auth/google
// @desc    Start the Google OAuth login process
// @access  Public
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'], // We specifically request their name and email
    session: false // We disable default cookie sessions because we are sending custom JWTs
  })
);

// @route   GET /api/auth/google/callback
// @desc    Google automatically redirects here after the user logs in
// @access  Public
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: 'http://localhost:3000/login?status=error',
  }),
  // If passport succeeds, it attaches the user to req.user and passes execution to our custom controller
  googleAuthCallback 
);

module.exports = router;
