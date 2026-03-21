import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';

// This controller executes AFTER passport finishes its logic (which finds or creates the user)
const googleAuthCallback = async (req, res) => {
  try {
    // 1. Get the authenticated user from the passport middleware
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Google authentication failed',
      });
    }

    // 2. Generate both tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // 3. Store the refresh token firmly in the database
    user.refreshToken = refreshToken;
    await user.save();

    // 4. Configure exact same cookie options as standard login
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    // 5. Send both tokens securely via cookies
    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 6. Redirect back to your frontend React app's dashboard
    // If not using React, change this URL to whatever your active frontend login success page is.
    res.redirect('http://localhost:3000/dashboard');

  } catch (error) {
    console.error('Error in Google Auth Callback:', error);
    // If anything fails, redirect back to login page safely
    res.redirect('http://localhost:3000/login?status=error');
  }
};

export {
  googleAuthCallback,
};
