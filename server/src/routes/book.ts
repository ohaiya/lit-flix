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
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { ResponseUtil } from '../utils/response';

const router = express.Router();
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

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

/**
 * @swagger
 * /api/books/douban-import:
 *   post:
 *     summary: 从豆瓣导入图书封面
 *     tags: [书籍]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *             properties:
 *               bookId:
 *                 type: string
 *                 description: 豆瓣图书ID或链接
 *                 example: "37205633"
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
 *                   example: "封面导入成功"
 *                 data:
 *                   type: object
 *                   properties:
 *                     coverUrl:
 *                       type: string
 *                       example: "/uploads/cover/37205633.jpg"
 *       400:
 *         description: 参数验证失败
 *       404:
 *         description: 未找到封面图片
 *       500:
 *         description: 服务器内部错误
 */
router.post('/douban-import', async (req, res) => {
  const { bookId } = req.body;
  try {
    if (!bookId) {
      return ResponseUtil.validationError(res, '豆瓣图书ID不能为空');
    }

    const doubanUrl = `https://book.douban.com/subject/${bookId}/`;
    
    const response = await axios.get(doubanUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      }
    });

    // 解析 JSON-LD 数据
    const jsonLdMatch = response.data.match(/<script type="application\/ld\+json">\s*(.*?)\s*<\/script>/s);
    let jsonLdData = null;
    if (jsonLdMatch) {
      try {
        jsonLdData = JSON.parse(jsonLdMatch[1]);
      } catch (e) {
        console.error('JSON-LD 解析失败:', e);
      }
    }

    // 解析封面
    const coverMatch = response.data.match(/<a class="nbg"[^>]*href="([^"]+)"/);
    if (!coverMatch) {
      return ResponseUtil.notFound(res, '未找到封面图片');
    }

    // 从 JSON-LD 或 HTML 中获取数据
    let title = '';
    let subtitle = '';
    let author = '';
    let publisher = '';

    if (jsonLdData) {
      // 从 JSON-LD 获取数据
      title = jsonLdData.name || '';
      
      // 作者可能是字符串或数组
      if (Array.isArray(jsonLdData.author)) {
        author = jsonLdData.author.map((a: any) => a.name).join(' / ');
      } else if (jsonLdData.author) {
        author = jsonLdData.author.name || '';
      }

      publisher = jsonLdData.publisher || '';
    }

    // 如果 JSON-LD 没有数据，从 HTML 获取
    if (!title) {
      const titleMatch = response.data.match(/<h1>\s*<span[^>]*>([^<]+)<\/span>/);
      title = titleMatch ? titleMatch[1].trim() : '';
    }

    // 副标题总是从 HTML 获取，因为 JSON-LD 中没有
    const subtitleMatch = response.data.match(/副标题:<\/span>\s*([^<]*?)(?:<br\/>|<\/div>)/);
    subtitle = subtitleMatch ? subtitleMatch[1].trim() : '';

    // 如果 JSON-LD 中没有作者，从 HTML 获取
    if (!author) {
      const authorBlock = response.data.match(/作者:?<\/span>([\s\S]*?)(?:<br\/>|<\/div>)/);
      if (authorBlock) {
        const authorText = authorBlock[1];
        const authorLinks = authorText.match(/<a[^>]*>([^<]+)<\/a>/g);
        if (authorLinks) {
          author = authorLinks
            .map((link: string) => {
              const nameMatch = link.match(/<a[^>]*>([^<]+)<\/a>/);
              return nameMatch ? nameMatch[1] : '';
            })
            .filter((name: string) => name)
            .join(' / ');
        } else {
          author = authorText.trim();
        }
      }
    }

    // 如果 JSON-LD 中没有出版社，从 HTML 获取
    if (!publisher) {
      // 先尝试匹配带链接的出版社
      const publisherBlockMatch = response.data.match(/<span class="pl">出版社:<\/span>[\s\n]*<a[^>]*>([^<]+)<\/a>/);
      if (publisherBlockMatch) {
        publisher = publisherBlockMatch[1].trim();
      } else {
        // 备用方案：匹配不带链接的出版社
        const backupMatch = response.data.match(/<span class="pl">出版社:<\/span>\s*([^<\n]*?)(?:<br|&nbsp;|<\/div>)/);
        publisher = backupMatch ? backupMatch[1].trim() : '';
      }
    }

    const coverUrl = coverMatch[1];
    
    const imageResponse = await axios.get(coverUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': doubanUrl,
      }
    });

    const uploadDir = path.join(__dirname, '../../uploads/cover');
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const ext = path.extname(coverUrl) || '.jpg';
    const fileName = `${bookId}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, imageResponse.data);

    const coverUrlPath = `/uploads/cover/${fileName}`;
    ResponseUtil.success(res, { 
      coverUrl: coverUrlPath,
      title,
      subtitle,
      author,
      publisher
    }, '封面导入成功');
  } catch (error) {
    console.error('导入豆瓣封面失败:', error);
    ResponseUtil.error(res, '导入豆瓣封面失败');
  }
});

export default router; 