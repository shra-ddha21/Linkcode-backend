const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAuthenticated = async (req, res, next) => {
  try {
    // 1. Read accessToken from cookies
    // (Ensure you have cookie-parser middleware set up in app.js/server.js)
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please login to continue.',
      });
    }

    // 2. Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user info to req.user
    // We look up the full user to ensure they still exist and aren't deleted/banned
    // We use .select('-password') so the password hash is excluded from req.user
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid. User no longer exists.',
      });
    }

    req.user = user;

    // Move to the next middleware or route controller
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Session has expired or token is invalid. Please login again.',
    });
  }
};

module.exports = {
  isAuthenticated,
};
