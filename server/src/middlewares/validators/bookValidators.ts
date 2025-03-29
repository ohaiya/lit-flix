import { body, query, param } from 'express-validator';

// 创建书籍验证
export const createBookValidator = [
  body('title').trim().notEmpty().withMessage('书籍标题不能为空'),
  body('subtitle').optional().trim(),
  body('cover').optional().trim(),
  body('author').trim().notEmpty().withMessage('作者不能为空'),
  body('publisher').optional().trim(),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('评分必须在0-5之间'),
  body('status').isIn(['wishlist', 'reading', 'finished']).withMessage('状态值不正确'),
  body('isFavorite').optional().isBoolean().withMessage('收藏状态必须是布尔值'),
];

// 更新书籍验证
export const updateBookValidator = [
  param('id').isMongoId().withMessage('无效的书籍ID'),
  body('title').optional().trim().notEmpty().withMessage('书籍标题不能为空'),
  body('subtitle').optional().trim(),
  body('cover').optional().trim(),
  body('author').optional().trim().notEmpty().withMessage('作者不能为空'),
  body('publisher').optional().trim(),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('评分必须在0-5之间'),
  body('status').optional().isIn(['wishlist', 'reading', 'finished']).withMessage('状态值不正确'),
  body('isFavorite').optional().isBoolean().withMessage('收藏状态必须是布尔值'),
];

// 获取书籍列表验证
export const getBooksValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是大于0的整数'),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).withMessage('每页条数必须是1-100之间的整数'),
  query('title').optional().trim(),
  query('subtitle').optional().trim(),
  query('author').optional().trim(),
  query('publisher').optional().trim(),
  query('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('评分必须在0-5之间'),
  query('status').optional().isIn(['wishlist', 'reading', 'finished']).withMessage('状态值不正确'),
  query('isFavorite').optional().isBoolean().withMessage('收藏状态必须是布尔值'),
];

// 获取单本书籍验证
export const getBookValidator = [
  param('id').isMongoId().withMessage('无效的书籍ID'),
];

// 删除书籍验证
export const deleteBookValidator = [
  param('id').isMongoId().withMessage('无效的书籍ID'),
];

// 添加笔记验证
export const addNoteValidator = [
  param('id').isMongoId().withMessage('无效的书籍ID'),
  body('title').trim().notEmpty().withMessage('笔记标题不能为空'),
  body('content').trim().notEmpty().withMessage('笔记内容不能为空'),
  body('date').trim().notEmpty().withMessage('日期不能为空'),
];

// 删除笔记验证
export const deleteNoteValidator = [
  param('id').isMongoId().withMessage('无效的书籍ID'),
  param('noteId').isMongoId().withMessage('无效的笔记ID'),
]; 