import { body, query, param } from 'express-validator';

// 创建电影验证
export const createMovieValidator = [
  body('title').trim().notEmpty().withMessage('电影标题不能为空'),
  body('cover').trim().notEmpty().withMessage('封面图片不能为空'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('年份格式不正确'),
  body('region').trim().notEmpty().withMessage('地区不能为空'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('评分必须在0-5之间'),
  body('status').isIn(['watching', 'finished', 'wishlist']).withMessage('状态值不正确'),
  body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('进度必须在0-100之间'),
  body('isFavorite').optional().isBoolean().withMessage('收藏状态必须是布尔值'),
];

// 更新电影验证
export const updateMovieValidator = [
  param('id').isMongoId().withMessage('无效的电影ID'),
  body('title').optional().trim().notEmpty().withMessage('电影标题不能为空'),
  body('cover').optional().trim().notEmpty().withMessage('封面图片不能为空'),
  body('year').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('年份格式不正确'),
  body('region').optional().trim().notEmpty().withMessage('地区不能为空'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('评分必须在0-5之间'),
  body('status').optional().isIn(['watching', 'finished', 'wishlist']).withMessage('状态值不正确'),
  body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('进度必须在0-100之间'),
  body('isFavorite').optional().isBoolean().withMessage('收藏状态必须是布尔值'),
];

// 获取电影列表验证
export const getMoviesValidator = [
  query('status').optional().isIn(['watching', 'finished', 'wishlist']).withMessage('状态值不正确'),
  query('isFavorite').optional().isBoolean().withMessage('收藏状态必须是布尔值'),
];

// 获取单个电影验证
export const getMovieValidator = [
  param('id').isMongoId().withMessage('无效的电影ID'),
];

// 删除电影验证
export const deleteMovieValidator = [
  param('id').isMongoId().withMessage('无效的电影ID'),
];

// 添加笔记验证
export const addNoteValidator = [
  param('id').isMongoId().withMessage('无效的电影ID'),
  body('title').trim().notEmpty().withMessage('笔记标题不能为空'),
  body('content').trim().notEmpty().withMessage('笔记内容不能为空'),
  body('date').trim().notEmpty().withMessage('日期不能为空'),
];

// 删除笔记验证
export const deleteNoteValidator = [
  param('id').isMongoId().withMessage('无效的电影ID'),
  param('noteId').isMongoId().withMessage('无效的笔记ID'),
]; 