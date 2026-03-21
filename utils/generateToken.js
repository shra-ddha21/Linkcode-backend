import jwt from 'jsonwebtoken';

// Generate Access Token (Expires in 15 minutes)
const generateAccessToken = (userId, userRole) => {
  return jwt.sign(
    { id: userId, role: userRole },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

// Generate Refresh Token (Expires in 7 days)
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

export {
  generateAccessToken,
  generateRefreshToken
};
