import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Get the user's primary email from Google
        const email = profile.emails[0].value;

        // 2. Check if the user already exists in our database
        let user = await User.findOne({ email });

        if (user) {
          // If they exist, successfully authenticate them
          return done(null, user);
        }

        // 3. If they don't exist, register them automatically
        // Since we require a password in our schema, we generate a random secure string
        const randomPassword = crypto.randomBytes(16).toString('hex');
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        user = new User({
          name: profile.displayName,
          email: email,
          password: hashedPassword, 
          role: 'student', // Default role for Google Signups
        });

        await user.save();
        
        // Pass the successfully created user forward
        return done(null, user);
      } catch (error) {
        console.error('Passport Google Strategy Error:', error);
        return done(error, false);
      }
    }
  )
);

// We export passport so we can drop it straight into our routes later
export default passport;
