const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('./config/passport');
const authRoutes = require('./routes/auth.routes');
const googleAuthRoutes = require('./routes/googleAuth.routes');
const protectedRoutes = require('./routes/protected.routes');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/protected', protectedRoutes);

export default app;
