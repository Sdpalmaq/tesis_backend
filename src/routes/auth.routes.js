import { Router } from 'express';
import { login, getMe, logout } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.post('/logout', logout); 

export default router;