import { Response } from 'express';

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export class ResponseUtil {
  static success<T>(res: Response, data?: T, message: string = '操作成功') {
    res.json({
      code: 0,
      message,
      data
    });
  }

  static error(res: Response, message: string = '操作失败', code: number = -1) {
    res.json({
      code,
      message,
      data: null
    });
  }

  static unauthorized(res: Response, message: string = '请先登录') {
    res.status(401).json({
      code: 401,
      message,
      data: null
    });
  }

  static forbidden(res: Response, message: string = '没有权限访问') {
    res.status(403).json({
      code: 403,
      message,
      data: null
    });
  }

  static notFound(res: Response, message: string = '资源不存在') {
    res.status(404).json({
      code: 404,
      message,
      data: null
    });
  }

  static validationError(res: Response, message: string = '参数验证失败') {
    res.status(400).json({
      code: 400,
      message,
      data: null
    });
  }
} 