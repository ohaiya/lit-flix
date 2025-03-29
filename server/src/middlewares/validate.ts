import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ResponseUtil } from '../utils/response';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    ResponseUtil.validationError(res, errors.array().map(err => err.msg).join(', '));
    return;
  }
  next();
}; 