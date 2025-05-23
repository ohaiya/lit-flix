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
  updateNote,
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
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { ResponseUtil } from '../utils/response';

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

/**
 * @swagger
 * /api/movies/{id}/notes/{noteId}:
 *   put:
 *     summary: 更新笔记
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
 *         description: 电影或笔记不存在
 */
router.put('/:id/notes/:noteId', auth, updateNote);

/**
 * @swagger
 * /api/movies/douban-import:
 *   post:
 *     summary: 从豆瓣导入电影海报
 *     tags: [电影]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *             properties:
 *               movieId:
 *                 type: string
 *                 description: 豆瓣电影ID或链接
 *                 example: "36820950"
 *     responses:
 *       200:
 *         description: 导入成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "海报导入成功"
 *                 data:
 *                   type: object
 *                   properties:
 *                     posterUrl:
 *                       type: string
 *                       example: "/uploads/poster/36820950.jpg"
 *       400:
 *         description: 参数验证失败
 *       404:
 *         description: 未找到海报图片
 *       500:
 *         description: 服务器内部错误
 */
router.post('/douban-import', async (req, res) => {
  const { movieId } = req.body;
  try {
    if (!movieId) {
      return ResponseUtil.validationError(res, '豆瓣电影ID不能为空');
    }

    const doubanUrl = `https://movie.douban.com/subject/${movieId}/`;
    
    const response = await axios.get(doubanUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      }
    });

    // 解析海报
    const posterMatch = response.data.match(/<div id="mainpic">\s*<a class="nbgnbg"[^>]*>\s*<img[^>]*src="([^"]+)"/);
    if (!posterMatch) {
      return ResponseUtil.notFound(res, '未找到海报图片');
    }

    // 解析标题
    const titleMatch = response.data.match(/<span property="v:itemreviewed">(.*?)<\/span>/);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // 解析年份
    const yearMatch = response.data.match(/<span class="year">\((.*?)\)<\/span>/);
    const year = yearMatch ? yearMatch[1].trim() : '';

    // 解析地区
    const regionMatch = response.data.match(/制片国家\/地区:<\/span>([^<]*?)(?:<br\/>|<\/div>)/);
    const region = regionMatch ? regionMatch[1].trim() : '';

    const posterUrl = posterMatch[1];
    
    const imageResponse = await axios.get(posterUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': doubanUrl,
      }
    });

    const uploadDir = path.join(__dirname, '../../uploads/poster');
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const ext = path.extname(posterUrl) || '.jpg';
    const fileName = `${movieId}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, imageResponse.data);

    const posterUrlPath = `/uploads/poster/${fileName}`;
    ResponseUtil.success(res, { 
      posterUrl: posterUrlPath,
      title,
      year,
      region
    }, '海报导入成功');
  } catch (error) {
    console.error('导入豆瓣海报失败:', error);
    ResponseUtil.error(res, '导入豆瓣海报失败');
  }
});

export default router; 