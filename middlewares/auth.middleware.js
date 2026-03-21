import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const isAuthenticated = async (req, res, next) => {
  try {
    // 1. Read accessToken from cookies

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

export {
  isAuthenticated,
};
