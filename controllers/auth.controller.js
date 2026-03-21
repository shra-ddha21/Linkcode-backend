const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    // 3. Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Save new user in MongoDB
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student', // Provide fallback to the schema's default
    });

    await newUser.save();

    // 5. Return success message
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Error in signup:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during signup. Please try again later.',
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 3. Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 4. Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // 5. Store refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    // 6. Set tokens in HTTP-only cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 7. Return success message and user role
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      role: user.role,
    });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again later.',
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    // 1. Read refresh token from cookies
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not found. Please log in again.',
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    // 3. Find user and confirm refresh token matches the database payload
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({
        success: false,
        message: 'Invalid refresh token.',
      });
    }

    // 4. Generate a new access token
    const newAccessToken = generateAccessToken(user._id, user.role);

    // 5. Send new access token in cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    res.cookie('accessToken', newAccessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.status(200).json({
      success: true,
      message: 'Access token specifically refreshed successfully.',
    });
  } catch (error) {
    console.error('Refresh Token error:', error);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired refresh token. Please log in again.',
    });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    // 1. Remove refresh token from database if it exists
    if (token) {
      const user = await User.findOne({ refreshToken: token });
      if (user) {
        user.refreshToken = ''; // Remove token from database
        await user.save();
      }
    }

    // 2. Clear both cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    // 3. Return success message
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during logout. Please try again later.',
    });
  }
};

module.exports = {
  signup,
  login,
  refreshToken,
  logout,
};
