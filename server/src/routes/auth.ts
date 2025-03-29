import express from 'express';
import { login, getCurrentUser } from '../controllers/authController';
import { auth } from '../middlewares/auth';

const router = express.Router();

// 登录
router.post('/login', login);

// 获取当前用户信息
router.get('/me', auth, getCurrentUser);

export default router; 