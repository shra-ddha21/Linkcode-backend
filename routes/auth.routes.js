import express from 'express';
const router = express.Router();
import { signup, login, refreshToken, logout } from '../controllers/auth.controller.js';

router.post('/signup', signup);
router.post('/login', login);
router.get('/refresh', refreshToken);
router.post('/logout', logout);

export default router;
