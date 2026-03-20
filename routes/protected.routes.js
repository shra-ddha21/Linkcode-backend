const express = require('express');
const router = express.Router();

// Import middlewares
const { isAuthenticated } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

// @route   GET /api/protected/instructor-only
// @desc    Example protected route testing auth and role middlewares
// @access  Private (Instructor only)
router.get(
  '/instructor-only',
  isAuthenticated, // 1st: Check if they are logged in and have a valid token
  authorizeRoles('instructor'), // 2nd: Check if their decoded token role is 'instructor'
  (req, res) => {
    // 3rd: If both pass, execute this controller function
    res.status(200).json({
      success: true,
      message: 'Instructor only route',
    });
  }
);

// Example of how you could add another protected route for multiple roles
router.get(
  '/course-materials',
  isAuthenticated,
  authorizeRoles('instructor', 'student'), // Both can access
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Route accessible by both students and instructors',
    });
  }
);

module.exports = router;
