import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import './config/passport.js';
import authRoutes from './routes/auth.routes.js';
import googleAuthRoutes from './routes/googleAuth.routes.js';
import protectedRoutes from './routes/protected.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/protected', protectedRoutes);

export default app;
