const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. Ensure user is authenticated first (req.user must be populated by auth middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in first.',
      });
    }

    // 2. Check if the user's role is in the list of allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Your role (${req.user.role}) is not authorized to perform this action.`,
      });
    }

    // 3. User is authorized, proceed to the next middleware or controller
    next();
  };
};

module.exports = {
  authorizeRoles,
};
