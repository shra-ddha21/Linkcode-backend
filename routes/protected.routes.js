import express from 'express';
const router = express.Router();

// Import middlewares
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';


router.get(
  '/instructor-only',
  isAuthenticated,
  authorizeRoles('instructor'),
  (req, res) => {

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

export default router;
