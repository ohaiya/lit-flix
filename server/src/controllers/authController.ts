import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ResponseUtil } from '../utils/response';

// 生成 JWT token
const generateToken = () => {
  return jwt.sign(
    { isAdmin: true },
    process.env.JWT_SECRET || '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    { expiresIn: '7d' }
  );
};

// 登录
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // 验证用户名和密码
    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      ResponseUtil.error(res, '用户名或密码错误');
      return;
    }

    // 生成 token
    const token = generateToken();

    ResponseUtil.success(res, { token, username });
  } catch (error) {
    ResponseUtil.error(res, '登录失败');
  }
};

// 获取当前用户信息
export const getCurrentUser = async (_: Request, res: Response): Promise<void> => {
  try {
    ResponseUtil.success(res, { username: process.env.ADMIN_USERNAME });
  } catch (error) {
    ResponseUtil.error(res, '获取用户信息失败');
  }
}; 