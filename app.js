<<<<<<< HEAD
import express from "express";
import cors from "cors";
=======
const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('./config/passport');
const authRoutes = require('./routes/auth.routes');
const googleAuthRoutes = require('./routes/googleAuth.routes');
const protectedRoutes = require('./routes/protected.routes');
>>>>>>> 69fbf3d785349d3eaf4b519409788a958bc18961

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowed = ["http://localhost:5173", "http://127.0.0.1:5173"];
    if (!origin || allowed.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

console.log("CORS middleware initialized with origins: http://localhost:5173, http://127.0.0.1:5173");

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/protected', protectedRoutes);

export default app;
