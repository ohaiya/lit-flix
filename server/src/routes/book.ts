import express from 'express';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  addNote,
  deleteNote,
  getNote,
  updateNote,
} from '../controllers/bookController';
import {
  createBookValidator,
  updateBookValidator,
  getBooksValidator,
  getBookValidator,
  deleteBookValidator,
  addNoteValidator,
  deleteNoteValidator,
} from '../middlewares/validators/bookValidators';

const router = express.Router();

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: 获取书籍列表
 *     tags: [书籍]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页数量
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       author:
 *                         type: string
 *                       description:
 *                         type: string
 *                       publishDate:
 *                         type: string
 *                         format: date
 *                       rating:
 *                         type: number
 *                 total:
 *                   type: integer
 */
router.get('/', getBooksValidator, validate, getBooks);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: 获取单个书籍详情
 *     tags: [书籍]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 书籍ID
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 author:
 *                   type: string
 *                 description:
 *                   type: string
 *                 publishDate:
 *                   type: string
 *                   format: date
 *                 rating:
 *                   type: number
 *                 notes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       content:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: 书籍不存在
 */
router.get('/:id', getBookValidator, validate, getBook);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: 创建新书籍
 *     tags: [书籍]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: 书籍标题
 *               author:
 *                 type: string
 *                 description: 作者
 *               description:
 *                 type: string
 *                 description: 书籍描述
 *               publishDate:
 *                 type: string
 *                 format: date
 *                 description: 出版日期
 *               rating:
 *                 type: number
 *                 description: 评分
 *     responses:
 *       201:
 *         description: 创建成功
 *       401:
 *         description: 未授权
 */
router.post('/', auth, createBookValidator, validate, createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: 更新书籍信息
 *     tags: [书籍]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 书籍ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 书籍标题
 *               author:
 *                 type: string
 *                 description: 作者
 *               description:
 *                 type: string
 *                 description: 书籍描述
 *               publishDate:
 *                 type: string
 *                 format: date
 *                 description: 出版日期
 *               rating:
 *                 type: number
 *                 description: 评分
 *     responses:
 *       200:
 *         description: 更新成功
 *       401:
 *         description: 未授权
 *       404:
 *         description: 书籍不存在
 */
router.put('/:id', auth, updateBookValidator, validate, updateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: 删除书籍
 *     tags: [书籍]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 书籍ID
 *     responses:
 *       200:
 *         description: 删除成功
 *       401:
 *         description: 未授权
 *       404:
 *         description: 书籍不存在
 */
router.delete('/:id', auth, deleteBookValidator, validate, deleteBook);

/**
 * @swagger
 * /api/books/{id}/notes:
 *   post:
 *     summary: 添加书籍笔记
 *     tags: [书籍]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 书籍ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: 笔记内容
 *     responses:
 *       201:
 *         description: 添加成功
 *       401:
 *         description: 未授权
 *       404:
 *         description: 书籍不存在
 */
router.post('/:id/notes', auth, addNoteValidator, validate, addNote);

/**
 * @swagger
 * /api/books/{id}/notes/{noteId}:
 *   delete:
 *     summary: 删除书籍笔记
 *     tags: [书籍]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 书籍ID
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: 笔记ID
 *     responses:
 *       200:
 *         description: 删除成功
 *       401:
 *         description: 未授权
 *       404:
 *         description: 书籍或笔记不存在
 */
router.delete('/:id/notes/:noteId', auth, deleteNoteValidator, validate, deleteNote);

/**
 * @swagger
 * /api/books/{id}/notes/{noteId}:
 *   get:
 *     summary: 获取笔记详情
 *     tags: [书籍]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 书籍ID
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: 笔记ID
 *     responses:
 *       200:
 *         description: 获取成功
 *       404:
 *         description: 书籍或笔记不存在
 */
router.get('/:id/notes/:noteId', getNote);

/**
 * @swagger
 * /api/books/{id}/notes/{noteId}:
 *   put:
 *     summary: 更新笔记
 *     tags: [书籍]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 书籍ID
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: 笔记ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *                 description: 笔记标题
 *               content:
 *                 type: string
 *                 description: 笔记内容
 *               date:
 *                 type: string
 *                 description: 日期
 *     responses:
 *       200:
 *         description: 更新成功
 *       401:
 *         description: 未授权
 *       404:
 *         description: 书籍或笔记不存在
 */
router.put('/:id/notes/:noteId', auth, updateNote);

export default router; 