import express from 'express';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  addNote,
  deleteNote,
} from '../controllers/movieController';
import {
  createMovieValidator,
  updateMovieValidator,
  getMoviesValidator,
  getMovieValidator,
  deleteMovieValidator,
  addNoteValidator,
  deleteNoteValidator,
} from '../middlewares/validators/movieValidators';

const router = express.Router();

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: 获取电影列表
 *     tags: [电影]
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
 *                 movies:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       releaseDate:
 *                         type: string
 *                         format: date
 *                       rating:
 *                         type: number
 *                 total:
 *                   type: integer
 */
router.get('/', getMoviesValidator, validate, getMovies);

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: 获取单个电影详情
 *     tags: [电影]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 电影ID
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
 *                 description:
 *                   type: string
 *                 releaseDate:
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
 *         description: 电影不存在
 */
router.get('/:id', getMovieValidator, validate, getMovie);

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: 创建新电影
 *     tags: [电影]
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
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: 电影标题
 *               description:
 *                 type: string
 *                 description: 电影描述
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 description: 上映日期
 *               rating:
 *                 type: number
 *                 description: 评分
 *     responses:
 *       201:
 *         description: 创建成功
 *       401:
 *         description: 未授权
 */
router.post('/', auth, createMovieValidator, validate, createMovie);

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: 更新电影信息
 *     tags: [电影]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 电影ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 电影标题
 *               description:
 *                 type: string
 *                 description: 电影描述
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 description: 上映日期
 *               rating:
 *                 type: number
 *                 description: 评分
 *     responses:
 *       200:
 *         description: 更新成功
 *       401:
 *         description: 未授权
 *       404:
 *         description: 电影不存在
 */
router.put('/:id', auth, updateMovieValidator, validate, updateMovie);

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: 删除电影
 *     tags: [电影]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 电影ID
 *     responses:
 *       200:
 *         description: 删除成功
 *       401:
 *         description: 未授权
 *       404:
 *         description: 电影不存在
 */
router.delete('/:id', auth, deleteMovieValidator, validate, deleteMovie);

/**
 * @swagger
 * /api/movies/{id}/notes:
 *   post:
 *     summary: 添加电影笔记
 *     tags: [电影]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 电影ID
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
 *         description: 电影不存在
 */
router.post('/:id/notes', auth, addNoteValidator, validate, addNote);

/**
 * @swagger
 * /api/movies/{id}/notes/{noteId}:
 *   delete:
 *     summary: 删除电影笔记
 *     tags: [电影]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 电影ID
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
 *         description: 电影或笔记不存在
 */
router.delete('/:id/notes/:noteId', auth, deleteNoteValidator, validate, deleteNote);

export default router; 