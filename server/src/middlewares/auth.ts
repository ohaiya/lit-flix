import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ResponseUtil } from '../utils/response';

interface JwtPayload {
  isAdmin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      isAdmin?: boolean;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      ResponseUtil.unauthorized(res);
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;

    if (!decoded.isAdmin) {
      ResponseUtil.forbidden(res);
      return;
    }

    req.isAdmin = decoded.isAdmin;
    next();
  } catch (error) {
    ResponseUtil.unauthorized(res);
  }
}; 